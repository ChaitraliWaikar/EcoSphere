import React from 'react';
import { RedirectToSignIn, SignedIn, SignedOut, UserProfile } from '@clerk/clerk-react';

const ClerkAccount = () => (
  <div className="min-h-screen bg-gray-50 py-10 px-4">
    <SignedIn>
      <div className="max-w-5xl mx-auto">
        <UserProfile routing="path" path="/account" />
      </div>
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </div>
);

export default ClerkAccount;
