import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import {
  Leaf,
  ArrowRight,
  LogIn,
  Users,
  ArrowLeft,
  Mail,
  Lock,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Twitter
} from 'lucide-react';

const ConnectrustAuth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('choice');
  const [communityData, setCommunityData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '',
    contactPerson: '',
    contactPhone: '',
    address: '',
    registrationNumber: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: ''
  });
  const [communityError, setCommunityError] = useState('');
  const [communitySuccess, setCommunitySuccess] = useState('');
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityLogin, setCommunityLogin] = useState({
    email: '',
    password: ''
  });
  const [communityLoginError, setCommunityLoginError] = useState('');
  const [communityLoginSuccess, setCommunityLoginSuccess] = useState('');
  const [communityLoginLoading, setCommunityLoginLoading] = useState(false);

  const handleCommunityChange = (e) => {
    const { name, value } = e.target;
    setCommunityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommunityLoginChange = (e) => {
    const { name, value } = e.target;
    setCommunityLogin((prev) => ({ ...prev, [name]: value }));
  };

  const hasAnySocial = () =>
    communityData.instagram.trim() ||
    communityData.facebook.trim() ||
    communityData.linkedin.trim() ||
    communityData.twitter.trim();

  const handleCommunitySignup = async (e) => {
    e.preventDefault();
    if (!hasAnySocial()) {
      setCommunityError('Add at least one social media link for verification.');
      return;
    }
    if (communityData.password !== communityData.confirmPassword) {
      setCommunityError('Passwords do not match.');
      return;
    }

    setCommunityError('');
    setCommunitySuccess('');
    setCommunityLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/communities/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communityData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Community signup failed.');
      }

      setCommunitySuccess('Registration submitted. Verification pending.');
      setView('community-login');
    } catch (error) {
      setCommunityError(error.message);
    } finally {
      setCommunityLoading(false);
    }
  };

  const handleCommunityLogin = async (e) => {
    e.preventDefault();
    setCommunityLoginError('');
    setCommunityLoginSuccess('');
    setCommunityLoginLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/communities/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communityLogin)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Community login failed.');
      }

      localStorage.setItem('communityToken', data.token || '');
      localStorage.setItem('communityProfile', JSON.stringify(data.community || {}));
      setCommunityLoginSuccess('Login successful.');
      navigate('/org-dashboard');
    } catch (error) {
      setCommunityLoginError(error.message);
    } finally {
      setCommunityLoginLoading(false);
    }
  };

  const renderChoice = () => (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4 shadow-lg">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Connectrust</h1>
        <p className="text-gray-600">Choose how you want to continue</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">User Account</h2>
              <p className="text-sm text-gray-600">Volunteer and track your impact</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-emerald-200 text-emerald-700 py-3 rounded-xl font-semibold hover:border-emerald-400 hover:text-emerald-800 transition"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Organization / Community</h2>
              <p className="text-sm text-gray-600">Host events and verify your organization</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setView('community-login')}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-200 text-blue-700 py-3 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-800 transition"
            >
              <LogIn className="w-5 h-5" />
              Org Login
            </button>
            <button
              onClick={() => setView('community-signup')}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
            >
              Register Org
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunityLogin = () => (
    <div className="w-full max-w-md">
      <button
        onClick={() => setView('choice')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Organization Login</h2>
          <p className="text-sm text-gray-600">Access your organization dashboard</p>
        </div>

        <form className="space-y-4" onSubmit={handleCommunityLogin}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={communityLogin.email}
                onChange={handleCommunityLoginChange}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="community@email.org"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={communityLogin.password}
                onChange={handleCommunityLoginChange}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {communityLoginError && (
            <p className="text-sm text-red-600">{communityLoginError}</p>
          )}
          {communityLoginSuccess && (
            <p className="text-sm text-green-600">{communityLoginSuccess}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-70"
            disabled={communityLoginLoading}
          >
            {communityLoginLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderCommunitySignup = () => (
    <div className="w-full max-w-3xl">
      <button
        onClick={() => setView('choice')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Register Organization / Community</h2>
          <p className="text-sm text-gray-600">
            Provide details for verification. At least one social media link is required.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleCommunitySignup}>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Organization Name *</label>
              <input
                type="text"
                name="name"
                value={communityData.name}
                onChange={handleCommunityChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Green Action Collective"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Official Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={communityData.email}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="team@community.org"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={communityData.password}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={communityData.confirmPassword}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={communityData.website}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="https://community.org"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={communityData.registrationNumber}
                onChange={handleCommunityChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Contact Person *</label>
              <input
                type="text"
                name="contactPerson"
                value={communityData.contactPerson}
                onChange={handleCommunityChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Full name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Contact Phone *</label>
              <input
                type="tel"
                name="contactPhone"
                value={communityData.contactPhone}
                onChange={handleCommunityChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="+91 XXXXXXXXXX"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Address *</label>
            <input
              type="text"
              name="address"
              value={communityData.address}
              onChange={handleCommunityChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Full address"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-3">
              Social Media Links (at least one required)
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Instagram className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  name="instagram"
                  value={communityData.instagram}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Instagram URL"
                />
              </div>
              <div className="relative">
                <Facebook className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  name="facebook"
                  value={communityData.facebook}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Facebook URL"
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  name="linkedin"
                  value={communityData.linkedin}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="relative">
                <Twitter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  name="twitter"
                  value={communityData.twitter}
                  onChange={handleCommunityChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="X / Twitter URL"
                />
              </div>
            </div>
            {communityError && (
              <p className="text-sm text-red-600 mt-2">{communityError}</p>
            )}
            {communitySuccess && (
              <p className="text-sm text-green-600 mt-2">{communitySuccess}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-70"
            disabled={communityLoading}
          >
            {communityLoading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-6">
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>

      <SignedOut>
        {view === 'choice' && renderChoice()}
        {view === 'community-login' && renderCommunityLogin()}
        {view === 'community-signup' && renderCommunitySignup()}
      </SignedOut>
    </div>
  );
};

export default ConnectrustAuth;
