import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingFallback from './components/LoadingFallback';
import { logPerformance } from './utils/performance';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const StartupList = lazy(() => import('./pages/StartupList'));
const StartupDetail = lazy(() => import('./pages/StartupDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chat = lazy(() => import('./pages/Chat'));
const CreateStartup = lazy(() => import('./pages/CreateStartup'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Careers = lazy(() => import('./pages/Careers'));

function App() {
  // Log performance metrics on mount
  useEffect(() => {
    logPerformance();
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="main-content" style={{ flex: 1 }}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/startups" element={<StartupList />} />
                  <Route path="/startups/create" element={<CreateStartup />} />
                  <Route path="/startups/:id" element={<StartupDetail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/browse-startups" element={<StartupList />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/about" element={<AboutUs />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
