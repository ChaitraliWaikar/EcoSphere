import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import ConnectrustAuth from "./ConnectrustAuth";
import ConnectrustLanding from "./ConnectrustLanding";
import LandingPage from "./LandingPage";
import { ClerkSignIn, ClerkSignUp } from "./ClerkAuthPages";
import ConnectrustOrgDashboard from "./ConnectrustOrgDashboard";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ClerkProviderWithRoutes = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
};

class ClerkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const message =
        this.state.error?.message ||
        "Clerk failed to initialize. Check your publishable key.";

      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Auth Setup Error
            </h1>
            <p className="text-gray-600">{message}</p>
            <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-700 space-y-2">
              <div className="font-semibold">Checklist</div>
              <div>
                1. Use a valid Clerk publishable key in{" "}
                <span className="font-mono">client/.env</span>.
              </div>
              <div>2. Restart the dev server after updating env vars.</div>
              <div>
                3. Add your local origin (e.g.{" "}
                <span className="font-mono">http://localhost:5173</span>) in
                Clerk dashboard.
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedDashboard = () => (
  <>
    <SignedIn>
      <ConnectrustLanding />
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

function App() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Connectrust</h1>
          <p className="text-gray-600">
            Clerk is not configured yet. Add your publishable key to
            <span className="font-medium"> client/.env </span>
            to enable sign in and sign up.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-700">
            <div className="font-semibold mb-2">Required</div>
            <div>
              <span className="font-mono">
                VITE_CLERK_PUBLISHABLE_KEY=pk_...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ClerkErrorBoundary>
        <ClerkProviderWithRoutes>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<ConnectrustAuth />} />
            <Route path="/sign-in/*" element={<ClerkSignIn />} />
            <Route path="/sign-up/*" element={<ClerkSignUp />} />
            <Route path="/dashboard" element={<ProtectedDashboard />} />
            <Route path="/org-dashboard" element={<ConnectrustOrgDashboard />} />
          </Routes>
        </ClerkProviderWithRoutes>
      </ClerkErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
