import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up
  const signup = async (email, password, name) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        name: name,
        sleepGoal: 480,
        waterGoal: 8,
        stepsGoal: 10000,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      
      // If user doesn't exist, create profile
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: userCredential.user.email,
          name: userCredential.user.displayName || 'User',
          sleepGoal: 480,
          waterGoal: 8,
          stepsGoal: 10000,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Track auth state
  useEffect(() => {
    console.log('AuthProvider: Starting auth state listener');
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('AuthProvider: Auth check timed out after 10 seconds');
      setLoading(false);
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      console.log('AuthProvider: Auth state changed', user ? 'user logged in' : 'no user');
      setCurrentUser(user);
      setLoading(false);
    });
    
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loginWithGoogle,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          background: '#f0f0f0',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', color: '#000', marginBottom: '20px' }}>Wellness Tracker</h1>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#007bff',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'pulse-animation 1.5s ease-in-out infinite'
            }}></div>
            <p style={{ color: '#000', fontSize: '16px', fontWeight: 'bold' }}>Loading...</p>
            <style>{`
              @keyframes pulse-animation {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
