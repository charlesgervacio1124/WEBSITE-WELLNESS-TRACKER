import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isResettingPassword) {
      setLoading(true);
      try {
        await resetPassword(email);
        setResetMessage('Check your inbox for further instructions.');
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to reset password');
        setResetMessage('');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleResetPasswordMode = () => {
    setIsResettingPassword(!isResettingPassword);
    setResetMessage('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background matches dashboard */ }
      <div className="mesh-gradient"></div>
      
      <div className="w-full max-w-md glass-card-elevated rounded-[2.5rem] p-10 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <Activity className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter text-center mb-2">
          {isResettingPassword ? 'Reset Password' : 'Welcome Back'}
        </h1>
        <p className="text-center text-on-surface-variant font-medium mb-8">
          {isResettingPassword 
            ? 'Enter your email to receive a reset link' 
            : 'Sign in to access your dashboard'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white/60 border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>

          {!isResettingPassword && (
            <div>
              <label className="block text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white/60 border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {!isResettingPassword && (
            <div className="flex justify-end mt-1 mb-4">
              <button
                type="button"
                onClick={toggleResetPasswordMode}
                className="text-xs font-bold text-primary hover:text-sapphire transition-colors focus:outline-none"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-sapphire text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {isResettingPassword 
              ? (loading ? 'Sending...' : 'Send Reset Link') 
              : (loading ? 'Signing in...' : 'Sign In')}
          </button>
        </form>

        {isResettingPassword ? (
          <div className="mt-6 text-center">
            <button
              onClick={toggleResetPasswordMode}
              className="text-sm font-bold text-on-surface-variant hover:text-slate-900 transition-colors focus:outline-none inline-flex items-center gap-2"
            >
              &larr; Back to login
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-primary/10"></div>
              <span className="px-4 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">Or continue with</span>
              <div className="flex-1 border-t border-primary/10"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-white/80 border border-primary/10 text-slate-700 font-bold py-4 px-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <p className="text-center mt-6 text-sm font-medium text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:text-sapphire transition-colors inline-flex items-center gap-1">
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
