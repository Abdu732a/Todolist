import { useState } from 'react';
import StudentForm from './forms/StudentForm';
import TutorForm from './forms/TutorForm';
import { FaArrowLeft } from 'react-icons/fa';

const RegisterForm = () => {
  const [registrationType, setRegistrationType] = useState('student');
  const [showForm, setShowForm] = useState(false);

  const handleRoleSelect = (role) => {
    setRegistrationType(role);
    setShowForm(true);
  };

  const handleBackToSelection = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-8 py-8">
          {!showForm ? (
            // Role selection view
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Register with Bright Tutor</h2> 
                <p className="text-gray-600">Select your role to get started</p>
              </div>
              
              <div className="flex justify-center space-x-6 mb-10">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-300 w-48"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Student</span>
                  <span className="text-sm text-gray-500 mt-1">Find the perfect tutor</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('tutor')}
                  className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-300 w-48"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Tutor</span>
                  <span className="text-sm text-gray-500 mt-1">Share your knowledge</span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="#" className="font-medium text-green-600 hover:text-green-500">
                    Sign in
                  </a>
                </p>
              </div>
            </>
          ) : (
            // Form view
            <>
              <button
                onClick={handleBackToSelection}
                className="flex items-center text-green-600 hover:text-green-700 mb-6"
              >
                <FaArrowLeft className="mr-2" /> Back to role selection
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {registrationType === 'student' ? 'Student Registration' : 'Tutor Registration'}
                </h2>
              </div>

              <div className="space-y-6">
                {registrationType === 'student' ? <StudentForm /> : <TutorForm />}
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span>Google</span>
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span>GitHub</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;