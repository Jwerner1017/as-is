import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/lib/ThemeContext';

// Page imports
import Home from '@/pages/Home';
import Browse from '@/pages/Browse';
import ListingDetail from '@/pages/ListingDetail';
import Sell from '@/pages/Sell';
import Dashboard from '@/pages/Dashboard';
import Live from '@/pages/Live';
import Policies from '@/pages/Policies';
import Onboarding from '@/pages/Onboarding';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Verification from '@/pages/Verification';
import Inventory from '@/pages/Inventory';
import Notifications from '@/pages/Notifications';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConfirmedRoute, { LoginRedirect } from '@/components/ConfirmedRoute';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-display text-4xl text-primary animate-pulse">AS IS</p>
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policies" element={<Policies />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<LoginRedirect />} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route element={<ConfirmedRoute />}>
          <Route path="/sell" element={<Sell />} />
          <Route path="/live" element={<Live />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App