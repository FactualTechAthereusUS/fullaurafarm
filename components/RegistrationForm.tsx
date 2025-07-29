'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, X, Mail, User, Calendar, Lock, Users, Globe } from 'lucide-react';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
}

interface UsernameStatus {
  checking: boolean;
  available: boolean | null;
  message: string;
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden',
  'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Portugal', 'Ireland', 'New Zealand', 'Japan',
  'South Korea', 'Singapore', 'Hong Kong', 'UAE', 'Saudi Arabia', 'Israel', 'Turkey', 'South Africa', 'India', 'China',
  'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Other'
];

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portal.aurafarming.co/api';

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    country: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>({
    checking: false,
    available: null,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Real-time username availability checking
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username || formData.username.length < 2) {
        setUsernameStatus({ checking: false, available: null, message: '' });
        return;
      }

      setUsernameStatus({ checking: true, available: null, message: 'Checking availability...' });

      try {
        const response = await fetch(`${API_URL}/check-username`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ username: formData.username })
        });

        const result = await response.json();
        
        setUsernameStatus({
          checking: false,
          available: result.available,
          message: result.message
        });
      } catch (error) {
        console.error('Username check error:', error);
        setUsernameStatus({
          checking: false,
          available: false,
          message: 'Error checking username'
        });
      }
    };

    const debounceTimer = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.username]);

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitMessage) setSubmitMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usernameStatus.available !== true) {
      setSubmitMessage({ type: 'error', text: 'Please choose an available username' });
      return;
    }
    
    if (passwordStrength < 3) {
      setSubmitMessage({ type: 'error', text: 'Please create a stronger password' });
      return;
    }
    
    if (!passwordMatch) {
      setSubmitMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubmitMessage({ 
          type: 'success', 
          text: `Account created successfully! You can now login at mail.aurafarming.co with ${formData.username}@aurafarming.co` 
        });
        // Reset form
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          dateOfBirth: '',
          gender: '',
          country: ''
        });
        setUsernameStatus({ checking: false, available: null, message: '' });
      } else {
        setSubmitMessage({ type: 'error', text: result.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 1) return 'Very Weak';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black"></div>
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Join AuraMail
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg"
          >
            Create your professional email account
          </motion.p>
        </motion.div>

        {/* Registration Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800/50"
        >
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-lg"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Choose Username
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                required
                className={`w-full pl-12 pr-14 py-4 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-lg ${
                  usernameStatus.available === true
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                    : usernameStatus.available === false
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="username"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {usernameStatus.checking ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : usernameStatus.available === true ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : usernameStatus.available === false ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {formData.username && `${formData.username}@aurafarming.co`}
            </div>
            {usernameStatus.message && (
              <div className={`mt-2 text-sm ${
                usernameStatus.available === true ? 'text-green-400' : 'text-red-400'
              }`}>
                {usernameStatus.message}
              </div>
            )}
          </div>

          {/* Date of Birth & Gender Row */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Gender
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Country */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full pl-12 pr-14 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-lg"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Password strength:</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength <= 2 ? 'text-red-400' : 
                    passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className={`w-full pl-12 pr-14 py-4 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-lg ${
                  passwordMatch ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' :
                  formData.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' :
                  'border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className={`mt-2 text-sm ${passwordMatch ? 'text-green-400' : 'text-red-400'}`}>
                {passwordMatch ? 'Passwords match!' : 'Passwords do not match'}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || usernameStatus.available !== true || passwordStrength < 3 || !passwordMatch}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center text-lg shadow-lg disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              'Create Email Account'
            )}
          </button>

          {/* Success/Error Messages */}
          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-center ${
                submitMessage.type === 'success' 
                  ? 'bg-green-900/50 border border-green-500/50 text-green-300'
                  : 'bg-red-900/50 border border-red-500/50 text-red-300'
              }`}
            >
              {submitMessage.text}
            </motion.div>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            By creating an account, you agree to AuraFarming's email policies
          </div>
        </motion.form>
      </div>
    </div>
  );
} 