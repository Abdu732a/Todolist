import { useState, useMemo, useEffect } from 'react';
import { 
  FaCode, FaLanguage, FaGraduationCap, FaBook, FaBrain, 
  FaDesktop, FaMobile, FaUser, FaUsers, FaCheck, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaUserCircle, FaArrowLeft,
  FaGlobe
} from 'react-icons/fa';

const StudentForm = ({ onBack }) => {
  // Fetch countries data from a reliable API
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Using RestCountries API to get all countries with dial codes
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        const data = await response.json();
        
        const formattedCountries = data.map(country => ({
          name: country.name.common,
          code: country.cca2,
          phoneCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
          // You could add more properties like flag emoji if needed
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback to a basic list if API fails
        setCountries([
          { name: "Ethiopia", code: "ET", phoneCode: "+251" },
          { name: "United States", code: "US", phoneCode: "+1" },
          { name: "United Kingdom", code: "GB", phoneCode: "+44" },
          { name: "Germany", code: "DE", phoneCode: "+49" },
          { name: "France", code: "FR", phoneCode: "+33" },
          { name: "India", code: "IN", phoneCode: "+91" },
          { name: "China", code: "CN", phoneCode: "+86" },
          { name: "Brazil", code: "BR", phoneCode: "+55" },
          // Add more countries as needed
        ]);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    
    fetchCountries();
  }, []);

  // For Ethiopian cities and subcities (you could expand this for other countries)
  const citiesByCountry = {
    "ET": ["Addis Ababa", "Dire Dawa", "Mekelle", "Hawassa", "Bahir Dar", "Gondar"],
    // Add more countries and their cities as needed
  };

  const subcities = {
    "Addis Ababa": ["Bole", "Lideta", "Gulele", "Kirkos", "Arada", "Addis Ketema", "Nifas Silk", "Kolfe"],
    "Dire Dawa": ["Dechatu", "Gonfa", "Sabian", "Gurgura"],
    "Mekelle": ["Hawelti", "Ayder", "Quiha", "Adi Haki"],
    // Add more cities and subcities as needed
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
    learningOption: '',
    programmingArea: '',
    language: '',
    grade: '',
    curriculum: '',
    preference: '',
    studyHours: '',
    studyDays: [],
    exam: '',
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
    handleInputChange('country', country.name);
  };

  const handleCountryInputFocus = () => {
    setShowCountryDropdown(true);
  };

  const handleCountryInputChange = (e) => {
    setCountryInput(e.target.value);
    setShowCountryDropdown(true);
    
    // Try to find a matching country as the user types
    const matchedCountry = countries.find(
      c => c.name.toLowerCase() === e.target.value.toLowerCase()
    );
    
    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
      setPhoneCode(matchedCountry.phoneCode);
    } else if (selectedCountry) {
      // Reset if input doesn't match the selected country
      setSelectedCountry(null);
      setPhoneCode("");
    }
  };

  const handleCountryInputBlur = () => {
    // Delay hiding dropdown to allow for click selection
    setTimeout(() => setShowCountryDropdown(false), 200);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLearningOptionChange = (value) => {
    handleInputChange('learningOption', value);
    // Reset dependent states
    handleInputChange('programmingArea', '');
    handleInputChange('language', '');
    handleInputChange('preference', '');
  };

  // Handler to toggle day selection
  const toggleDay = (day) => {
    const updatedDays = formData.studyDays.includes(day)
      ? formData.studyDays.filter(d => d !== day)
      : [...formData.studyDays, day];
    
    handleInputChange('studyDays', updatedDays);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation would go here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  const PreferenceCards = ({ onSelect, selected }) => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="relative">
        <input
          type="radio"
          name="preference"
          value="individual"
          className="sr-only peer"
          onChange={(e) => onSelect(e.target.value)}
          checked={selected === 'individual'}
        />
        <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <FaUser className="text-green-600 text-3xl"></FaUser>
            <h4 className="font-medium mt-2">Individual</h4>
            <p className="text-sm text-gray-500">One-on-one sessions for focused learning</p>
          </div>
        </div>
      </label>

      <label className="relative">
        <input
          type="radio"
          name="preference"
          value="group"
          className="sr-only peer"
          onChange={(e) => onSelect(e.target.value)}
          checked={selected === 'group'}
        />
        <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <FaUsers className="text-green-600 text-3xl"></FaUsers>
            <h4 className="font-medium mt-2">Group</h4>
            <p className="text-sm text-gray-500">Collaborate and learn with others</p>
          </div>
        </div>
      </label>
    </div>
  );

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
          Thank you for your application. We'll contact you soon to discuss your learning plan.
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
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
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
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
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
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="5"
                max="25"
                required
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter your age"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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

        {/* Learning Preferences Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaGraduationCap className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Learning Preferences</h2>
          </div>

          <div className="pt-6 border-t border-gray-200"></div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              What do you want to learn? <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  name="learningOption"
                  value="programming"
                  className="sr-only peer"
                  required
                  onChange={() => handleLearningOptionChange('programming')}
                  checked={formData.learningOption === 'programming'}
                />
                <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaCode className="text-blue-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">Programming</h3>
                  <p className="text-sm text-gray-500 mt-1">Learn to code and build amazing things.</p>
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="learningOption"
                  value="language"
                  className="sr-only peer"
                  onChange={() => handleLearningOptionChange('language')}
                  checked={formData.learningOption === 'language'}
                />
                <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaLanguage className="text-purple-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">Language</h3>
                  <p className="text-sm text-gray-500 mt-1">Become fluent in a new language.</p>
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="learningOption"
                  value="schoolGrades"
                  className="sr-only peer"
                  onChange={() => handleLearningOptionChange('schoolGrades')}
                  checked={formData.learningOption === 'schoolGrades'}
                />
                <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaGraduationCap className="text-green-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">School Grades</h3>
                  <p className="text-sm text-gray-500 mt-1">Get help with your school subjects.</p>
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="learningOption"
                  value="entrancePreparation"
                  className="sr-only peer"
                  onChange={() => handleLearningOptionChange('entrancePreparation')}
                  checked={formData.learningOption === 'entrancePreparation'}
                />
                <div className="cursor-pointer p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaBook className="text-orange-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">Entrance Preparation</h3>
                  <p className="text-sm text-gray-500 mt-1">Prepare for your final exams.</p>
                </div>
              </label>
            </div>

            {/* Programming Options */}
            {formData.learningOption === 'programming' && (
              <div className="mt-6 space-y-6">
                <label className="block text-sm font-semibold text-gray-700">
                  Which area? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <span className="font-medium text-gray-900">AI</span>
                      </div>
                      </div>
                  </label>

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
                </div>

                {formData.programmingArea && (
                  <PreferenceCards 
                    onSelect={(value) => handleInputChange('preference', value)} 
                    selected={formData.preference}
                  />
                )}
              </div>
            )}

            {/* Language Options */}
            {formData.learningOption === 'language' && (
              <div className="mt-6 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Which Language? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Amharic", "French", "English", "Afan-Oromo", "Chinese", "Arabic"].map((lang) => (
                    <label key={lang} className="flex">
                      <input
                        type="radio"
                        name="language"
                        value={lang.toLowerCase().replace(" ", "_")}
                        className="sr-only peer"
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        checked={formData.language === lang.toLowerCase().replace(" ", "_")}
                      />
                      <span className="w-full text-center px-4 py-3 text-sm border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-500 hover:bg-green-500 hover:border-green-300">
                        {lang}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.language && (
                  <PreferenceCards 
                    onSelect={(value) => handleInputChange('preference', value)} 
                    selected={formData.preference}
                  />
                )}
              </div>
            )}

            {/* School Grades Options */}
            {formData.learningOption === 'schoolGrades' && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className='flex flex-col'>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What Grade are you in? <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select Grade</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Grade {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='flex flex-col'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curriculum <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.curriculum}
                      required
                      onChange={(e) => handleInputChange('curriculum', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select Curriculum</option>
                      <option value="ethiopian">Ethiopian Curriculum</option>
                      <option value="igcse">IGCSE</option>
                      <option value="american">American Curriculum</option>
                      <option value="british">British Curriculum</option>
                      <option value="international">International Baccalaureate</option>
                    </select>
                  </div>
                </div>
                <PreferenceCards 
                  onSelect={(value) => handleInputChange('preference', value)} 
                  selected={formData.preference}
                />
              </div>
            )}

            {/* Entrance Preparation Options */}
            {formData.learningOption === 'entrancePreparation' && (
              <div className="mt-6 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Which Exam? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Grade 12", "ASAT", "TOEFL", "IELTS"].map((exam) => (
                    <label key={exam} className="flex">
                      <input
                        type="radio"
                        name="exam"
                        value={exam.toLowerCase().replace(" ", "_")}
                        className="sr-only peer"
                        onChange={(e) => handleInputChange('exam', e.target.value)}
                        checked={formData.exam === exam.toLowerCase().replace(" ", "_")}
                      />
                      <span className="w-full text-center px-4 py-3 text-sm border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-500 hover:bg-green-500 hover:border-green-300">
                        {exam}
                      </span>
                    </label>
                  ))}
                </div>
                <PreferenceCards 
                  onSelect={(value) => handleInputChange('preference', value)} 
                  selected={formData.preference}
                />
              </div>
            )}
          </div>
        </div>

        {/* Study Plan Section */}
        <div>
          <div className="flex items-center mb-2">
            <FaBook className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Study Plan</h2>
          </div>

          <div className="pt-6 border-t border-gray-200"></div>
          
          <div>
            <label className="block text-medium font-bold text-gray-700 mb-3">
              Your Weekly Study Plan <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Study Days</p>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-full border transition-all duration-200
                        ${formData.studyDays.includes(day)
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
                <label htmlFor="studyHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Study Hours <span className="text-red-500">*</span>
                </label>
                <select
                  id="studyHours"
                  required
                  value={formData.studyHours}
                  onChange={(e) => handleInputChange('studyHours', e.target.value)}
                  className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Hours</option>
                  <option value="1">1 hr</option>
                  <option value="2">2 hrs</option>
                  <option value="3">3 hrs</option>
                  <option value="4">4 hrs</option>
                  <option value="5">5 hrs</option>
                  <option value="6">6 hrs</option>
                  <option value="7">7 hrs</option>
                  <option value="8">8 hrs</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Submit Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center">
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

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              Create Student Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;