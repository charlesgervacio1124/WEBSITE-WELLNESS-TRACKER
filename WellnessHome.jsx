import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WellnessProvider } from './context/WellnessContext';
import { Home } from './app';
import { History } from './components/History';
import { Sleep } from './components/Sleep';
import { Water } from './components/Water';
import { Steps } from './components/Steps';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';

// DashboardLayout wrapper for pages that need navigation
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="ml-64 flex-1">
        {children}
      </div>
    </div>
  );
};

// App component
function App() {
  return (
    <AuthProvider>
      <WellnessProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Home />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sleep"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Sleep />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/water"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Water />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/steps"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Steps />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <History />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </WellnessProvider>
    </AuthProvider>
  );
}

// Initialize React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);