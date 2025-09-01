import { useState, useMemo, useEffect } from 'react';
import { 
  FaCode, FaLanguage, FaGraduationCap, FaBook, FaBrain, 
  FaDesktop, FaMobile, FaUser, FaUsers, FaCheck, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaUserCircle, FaArrowLeft,
  FaGlobe, FaFileUpload, FaBriefcase, FaUserGraduate, FaBuilding,
  FaClock, FaCalendarAlt
} from 'react-icons/fa';

const TutorForm = ({ onBack }) => {
  // Fetch countries data from a reliable API (same as StudentForm)
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        const data = await response.json();
        
        const formattedCountries = data.map(country => ({
          name: country.name.common,
          code: country.cca2,
          phoneCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        setCountries([
          { name: "Ethiopia", code: "ET", phoneCode: "+251" },
          { name: "United States", code: "US", phoneCode: "+1" },
          { name: "United Kingdom", code: "GB", phoneCode: "+44" },
          { name: "Germany", code: "DE", phoneCode: "+49" },
          { name: "France", code: "FR", phoneCode: "+33" },
        ]);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    
    fetchCountries();
  }, []);

  // For Ethiopian cities and subcities
  const citiesByCountry = {
    "ET": ["Addis Ababa", "Dire Dawa", "Mekelle", "Hawassa", "Bahir Dar", "Gondar"],
  };

  const subcities = {
    "Addis Ababa": ["Bole", "Lideta", "Gulele", "Kirkos", "Arada", "Addis Ketema"],
    "Dire Dawa": ["Dechatu", "Gonfa", "Sabian", "Gurgura"],
    "Mekelle": ["Hawelti", "Ayder", "Quiha", "Adi Haki"],
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    degreeLevel: '',
    currentStatus: '',
    hasTutoringExperience: '',
    experienceGrade: '',
    specialty: '',
    programmingArea: '',
    language: '',
    grade: '',
    availabilityDays: [],
    availabilityTime: '',
    degreePhoto: null,
    terms: false,
  });

  // UI state
  const [countryInput, setCountryInput] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubcity, setSelectedSubcity] = useState("");
  const [phoneCode, setPhoneCode] = useState("+251");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [degreePhotoName, setDegreePhotoName] = useState('');

  // Filter countries for autocomplete
  const filteredCountries = useMemo(() => 
    countries.filter((c) =>
      c.name.toLowerCase().includes(countryInput.toLowerCase()) ||
      c.phoneCode.includes(countryInput)
    ), [countryInput, countries]
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryInput(country.name);
    setPhoneCode(country.phoneCode);
    setSelectedCity("");
    setSelectedSubcity("");
    setShowCountryDropdown(false);
  };

  const handleCountryInputFocus = () => {
    setShowCountryDropdown(true);
  };

  const handleCountryInputChange = (e) => {
    setCountryInput(e.target.value);
    setShowCountryDropdown(true);
    
    const matchedCountry = countries.find(
      c => c.name.toLowerCase() === e.target.value.toLowerCase()
    );
    
    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
      setPhoneCode(matchedCountry.phoneCode);
    } else if (selectedCountry) {
      setSelectedCountry(null);
      setPhoneCode("");
    }
  };

  const handleCountryInputBlur = () => {
    setTimeout(() => setShowCountryDropdown(false), 200);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [
      "10-11 AM" , "11-12 PM" , "12-1 PM" , "1-2 PM" , "Anytime"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyChange = (value) => {
    handleInputChange('specialty', value);
    // Reset dependent states
    handleInputChange('programmingArea', '');
    handleInputChange('language', '');
    handleInputChange('grade', '');
  };

  // Handler to toggle day selection
  const toggleDay = (day) => {
    const updatedDays = formData.availabilityDays.includes(day)
      ? formData.availabilityDays.filter(d => d !== day)
      : [...formData.availabilityDays, day];
    
    handleInputChange('availabilityDays', updatedDays);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange('degreePhoto', file);
      setDegreePhotoName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FaCheck className="text-green-600 text-2xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your application. We'll review your credentials and contact you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-2"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaUserCircle className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          </div>

          <div className="pt-6 border-t border-gray-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter your first name"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="21"
                max="70"
                required
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter your age"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
          </div>

          <div className="pt-6 border-t border-gray-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={countryInput}
                  onFocus={handleCountryInputFocus}
                  onChange={handleCountryInputChange}
                  onBlur={handleCountryInputBlur}
                  placeholder="Start typing your country"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>
              {showCountryDropdown && countryInput && filteredCountries.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-auto shadow-lg">
                  {isLoadingCountries ? (
                    <li className="px-4 py-2 text-gray-500">Loading countries...</li>
                  ) : (
                    filteredCountries.map((country) => (
                      <li
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                        className="px-4 py-2 cursor-pointer hover:bg-green-50 transition-colors flex items-center"
                      >
                        <span className="flex-1">{country.name}</span>
                        <span className="text-sm text-gray-500">{country.phoneCode}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-lg shadow-sm overflow-hidden">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  {phoneCode || "Code"}
                </span>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {selectedCountry && citiesByCountry[selectedCountry.code] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedSubcity("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                >
                  <option value="">Select City</option>
                  {citiesByCountry[selectedCountry.code].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedCity && subcities[selectedCity] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcity/District <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubcity}
                  onChange={(e) => setSelectedSubcity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                >
                  <option value="">Select Subcity/District</option>
                  {subcities[selectedCity].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedCity || selectedCountry) && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your full address"
                />
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex-1">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="sr-only peer"
                  required
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  checked={formData.gender === 'male'}
                />
                <span className="cursor-pointer py-3 px-4 text-center rounded-lg border border-gray-300 hover:bg-gray-50 block peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-colors">
                  Male
                </span>
              </label>
              
              <label className="flex-1">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="sr-only peer"
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  checked={formData.gender === 'female'}
                />
                <span className="cursor-pointer py-3 px-4 text-center rounded-lg border border-gray-300 hover:bg-gray-50 block peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-colors">
                  Female
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Education and Experience Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaUserGraduate className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Education & Experience</h2>
          </div>

          <div className="pt-6 border-t border-gray-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Highest Degree Level <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.degreeLevel}
                onChange={(e) => handleInputChange('degreeLevel', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select Degree Level</option>
                <option value="highschool">High School Diploma</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Degree/Certificate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="degreePhoto"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <label
                  htmlFor="degreePhoto"
                  className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
                >
                  <span className="text-gray-500">
                    {degreePhotoName || 'Choose file...'}
                  </span>
                  <FaFileUpload className="text-green-600" />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload a scan of your degree or certification (PDF or image)</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "student", label: "Student", icon: <FaUserGraduate /> },
                  { value: "government", label: "Gov't Employee", icon: <FaBuilding /> },
                  { value: "private", label: "Private Sector", icon: <FaBriefcase /> },
                  { value: "unemployed", label: "Unemployed", icon: <FaUser /> },
                ].map((status) => (
                  <label key={status.value} className="flex">
                    <input
                      type="radio"
                      name="currentStatus"
                      value={status.value}
                      className="sr-only peer"
                      required
                      onChange={(e) => handleInputChange('currentStatus', e.target.value)}
                      checked={formData.currentStatus === status.value}
                    />
                    <span className="w-full text-center px-4 py-3 text-sm border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-500 hover:bg-green-50 hover:border-green-300 flex flex-col items-center">
                      <span className="mb-1">{status.icon}</span>
                      <span>{status.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Have you worked as a tutor before? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="hasTutoringExperience"
                    value="yes"
                    className="sr-only peer"
                    required
                    onChange={(e) => handleInputChange('hasTutoringExperience', e.target.value)}
                    checked={formData.hasTutoringExperience === 'yes'}
                  />
                  <span className="cursor-pointer py-3 px-4 text-center rounded-lg border border-gray-300 hover:bg-gray-50 block peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-colors">
                    Yes
                  </span>
                </label>
                
                <label className="flex-1">
                  <input
                    type="radio"
                    name="hasTutoringExperience"
                    value="no"
                    className="sr-only peer"
                    onChange={(e) => handleInputChange('hasTutoringExperience', e.target.value)}
                    checked={formData.hasTutoringExperience === 'no'}
                  />
                  <span className="cursor-pointer py-3 px-4 text-center rounded-lg border border-gray-300 hover:bg-gray-50 block peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-colors">
                    No
                  </span>
                </label>
              </div>
            </div>

            {formData.hasTutoringExperience === 'yes' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Which grades have you tutored? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                    <label key={grade} className="flex items-center">
                      <input
                        type="checkbox"
                        value={grade}
                        onChange={(e) => {
                          const updatedGrades = e.target.checked
                            ? [...(formData.experienceGrade || []), grade]
                            : (formData.experienceGrade || []).filter(g => g !== grade);
                          handleInputChange('experienceGrade', updatedGrades);
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Grade {grade}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specialization Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaGraduationCap className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Specialization</h2>
          </div>

          <div className="pt-6 border-t border-gray-200"></div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What is your specialty? <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  name="specialty"
                  value="programming"
                  className="sr-only peer"
                  required
                  onChange={() => handleSpecialtyChange('programming')}
                  checked={formData.specialty === 'programming'}
                />
                <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaCode className="text-blue-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">Programming</h3>
                  <p className="text-sm text-gray-500 mt-1">Teach coding and development skills</p>
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="specialty"
                  value="language"
                  className="sr-only peer"
                  onChange={() => handleSpecialtyChange('language')}
                  checked={formData.specialty === 'language'}
                />
                <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaLanguage className="text-purple-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">Language</h3>
                  <p className="text-sm text-gray-500 mt-1">Teach language skills</p>
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="specialty"
                  value="schoolGrades"
                  className="sr-only peer"
                  onChange={() => handleSpecialtyChange('schoolGrades')}
                  checked={formData.specialty === 'schoolGrades'}
                />
                <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaGraduationCap className="text-green-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">School Subjects</h3>
                  <p className="text-sm text-gray-500 mt-1">Teach academic subjects</p>
                </div>
              </label>
            </div>

            {/* Programming Options */}
            {formData.specialty === 'programming' && (
              <div className="mt-6 space-y-6">
                <label className="block text-sm font-medium text-gray-700">
                  Which area? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="relative">
                    <input
                      type="radio"
                      name="programmingArea"
                      value="webDevelopment"
                      className="sr-only peer"
                      onChange={(e) => handleInputChange('programmingArea', e.target.value)}
                      checked={formData.programmingArea === 'webDevelopment'}
                    />
                    <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:ring-2 peer-checked:ring-green-200 transition-all duration-300 hover:border-green-400 hover:shadow-md">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-blue-100 rounded-full mb-3">
                          <FaDesktop className="text-blue-600 text-xl" />
                        </div>
                        <span className="font-medium text-gray-900">Web Development</span>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      type="radio"
                      name="programmingArea"
                      value="appDevelopment"
                      className="sr-only peer"
                      onChange={(e) => handleInputChange('programmingArea', e.target.value)}
                      checked={formData.programmingArea === 'appDevelopment'}
                    />
                    <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:ring-2 peer-checked:ring-green-200 transition-all duration-300 hover:border-green-400 hover:shadow-md">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-green-100 rounded-full mb-3">
                          <FaMobile className="text-green-600 text-xl" />
                        </div>
                        <span className="font-medium text-gray-900">App Development</span>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      type="radio"
                      name="programmingArea"
                      value="ai"
                      className="sr-only peer"
                      onChange={(e) => handleInputChange('programmingArea', e.target.value)}
                      checked={formData.programmingArea === 'ai'}
                    />
                    <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:ring-2 peer-checked:ring-green-200 transition-all duration-300 hover:border-green-400 hover:shadow-md">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-purple-100 rounded-full mb-3">
                          <FaBrain className="text-purple-600 text-xl" />
                        </div>
                        <span className="font-medium text-gray-900">AI & Data Science</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Language Options */}
            {formData.specialty === 'language' && (
              <div className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Which Language? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Amharic", "English", "French", "Afan-Oromo", "Arabic", "Chinese"].map((lang) => (
                    <label key={lang} className="flex">
                      <input
                        type="radio"
                        name="language"
                        value={lang.toLowerCase().replace(" ", "_")}
                        className="sr-only peer"
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        checked={formData.language === lang.toLowerCase().replace(" ", "_")}
                      />
                      <span className="w-full text-center px-4 py-3 text-sm border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-500 hover:bg-green-50 hover:border-green-300">
                        {lang}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* School Grades Options */}
            {formData.specialty === 'schoolGrades' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which grades can you teach? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                    <label key={grade} className="flex items-center">
                      <input
                        type="checkbox"
                        value={grade}
                        onChange={(e) => {
                          const updatedGrades = e.target.checked
                            ? [...(formData.grade || []), grade]
                            : (formData.grade || []).filter(g => g !== grade);
                          handleInputChange('grade', updatedGrades);
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Grade {grade}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Availability</h2>
          </div>

          <div className="pt-6 border-t border-gray-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Days <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-full border transition-all duration-200
                      ${formData.availabilityDays.includes(day)
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-400"
                      }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.availabilityTime}
                onChange={(e) => handleInputChange('availabilityTime', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select Time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
                {/* Terms and Submit Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" className="text-green-600 hover:text-green-500">Terms</a> and <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Register as Tutor
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorForm;