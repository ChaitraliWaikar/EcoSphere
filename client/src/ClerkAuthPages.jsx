import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Leaf } from 'lucide-react';

const AuthShell = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-6">
    <div className="w-full max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
          Back to account selection
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{title}</h1>
            <p className="text-gray-600 text-lg">{subtitle}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border border-emerald-100 shadow-sm">
            <p className="text-sm text-gray-600">
              Connectrust is your gateway to verified green initiatives. Track impact, discover events, and build a
              sustainability footprint that matters.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const ClerkSignIn = () => (
  <AuthShell
    title="Welcome Back"
    subtitle="Sign in to keep your sustainability journey moving."
  >
    <SignedIn>
      <Navigate to="/dashboard" replace />
    </SignedIn>
    <SignedOut>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </SignedOut>
  </AuthShell>
);

export const ClerkSignUp = () => (
  <AuthShell
    title="Join Connectrust"
    subtitle="Create your account and start making impact today."
  >
    <SignedIn>
      <Navigate to="/dashboard" replace />
    </SignedIn>
    <SignedOut>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </SignedOut>
  </AuthShell>
);
