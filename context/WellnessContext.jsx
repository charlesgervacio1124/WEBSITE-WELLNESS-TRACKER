import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

const parseSleep = (sleep) => {
  if (typeof sleep === 'number') return sleep;
  if (!sleep) return 0;
  if (typeof sleep === 'string') {
    const matchOriginal = sleep.match(/(\d+)\s*h\s*(\d+)\s*m/i);
    if (matchOriginal) {
      return parseInt(matchOriginal[1], 10) * 60 + parseInt(matchOriginal[2], 10);
    }
    const matchHours = sleep.match(/(\d+)\s*h/i);
    if (matchHours) {
      return parseInt(matchHours[1], 10) * 60;
    }
  }
  return parseFloat(sleep) || 0;
};

const WellnessContext = createContext();

export const WellnessProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [todayData, setTodayData] = useState({
    date: new Date().toISOString().split('T')[0],
    sleep: 0,
    water: 0,
    steps: 0,
  });

  const [sleepGoal, setSleepGoal] = useState(480); // 8 hours in minutes
  const [waterGoal, setWaterGoal] = useState(8); // 8 liters
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from Firestore
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        console.log('WellnessContext: Starting to load user data for', currentUser.uid);
        setError(null);
        
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log('WellnessContext: User data found:', userData);
          setSleepGoal(userData.sleepGoal || 480);
          setWaterGoal(userData.waterGoal || 8);
          setStepsGoal(userData.stepsGoal || 10000);
        } else {
          console.log('WellnessContext: No user document, creating one');
          // Create new user document
          await setDoc(userRef, {
            email: currentUser.email,
            sleepGoal: 480,
            waterGoal: 8,
            stepsGoal: 10000,
            createdAt: serverTimestamp(),
          });
        }

        // Load today's wellness data
        console.log('WellnessContext: Loading today data');
        await loadTodayData();
        
        // Load history
        console.log('WellnessContext: Loading history');
        await loadHistory();
        
        console.log('WellnessContext: All data loaded successfully');
      } catch (error) {
        console.error('Error loading user data:', error);
        setError(error.message);
      } finally {
        console.log('WellnessContext: Setting loading to false');
        setLoading(false);
      }
    };

    // Set a timeout to force stop loading after 10 seconds
    const timeout = setTimeout(() => {
      console.warn('WellnessContext: Loading timeout - forcing load to complete');
      setLoading(false);
    }, 10000);

    loadUserData().finally(() => clearTimeout(timeout));

    return () => clearTimeout(timeout);
  }, [currentUser]);

  const loadTodayData = async () => {
    if (!currentUser) return;

    try {
      console.log('WellnessContext: loadTodayData starting');
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      console.log('WellnessContext: Today date is:', today);
      const wellnessRef = doc(db, 'users', currentUser.uid, 'wellness', today);
      const wellnessSnap = await getDoc(wellnessRef);

      if (wellnessSnap.exists()) {
        const data = wellnessSnap.data();
        console.log('WellnessContext: Today data found:', data);
        // Ensure all values are numbers
        setTodayData({
          date: data.date || today,
          sleep: typeof data.sleep === 'number' ? data.sleep : parseSleep(data.sleep),
          water: typeof data.water === 'number' ? data.water : parseFloat(data.water) || 0,
          steps: typeof data.steps === 'number' ? data.steps : parseInt(data.steps, 10) || 0,
        });
      } else {
        console.log('WellnessContext: No today data, using defaults');
        setTodayData({
          date: today,
          sleep: 0,
          water: 0,
          steps: 0,
        });
      }
      console.log('WellnessContext: loadTodayData completed');
    } catch (error) {
      console.error('Error loading today data:', error);
      // Set defaults on error
      const today = new Date().toISOString().split('T')[0];
      setTodayData({
        date: today,
        sleep: 0,
        water: 0,
        steps: 0,
      });
      throw error;
    }
  };

  const loadHistory = async () => {
    if (!currentUser) return;

    try {
      console.log('WellnessContext: loadHistory starting');
      const wellnessRef = collection(db, 'users', currentUser.uid, 'wellness');
      const q = query(wellnessRef);
      const querySnap = await getDocs(q);
      
      console.log('WellnessContext: Found', querySnap.size, 'history documents');
      const historyData = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        historyData.push({ 
          ...data,
          id: doc.id,
          sleep: typeof data.sleep === 'number' ? data.sleep : parseSleep(data.sleep),
          water: typeof data.water === 'number' ? data.water : parseFloat(data.water) || 0,
          steps: typeof data.steps === 'number' ? data.steps : parseInt(data.steps, 10) || 0,
        });
      });
      
      const sorted = historyData.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log('WellnessContext: History sorted, setting state with', sorted.length, 'items');
      setHistory(sorted);
      console.log('WellnessContext: loadHistory completed');
    } catch (error) {
      console.error('Error loading history:', error);
      throw error;
    }
  };

  const updateTodayData = async (updates) => {
    if (!currentUser) return;

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const wellnessRef = doc(db, 'users', currentUser.uid, 'wellness', today);
      
      const newData = { ...todayData, ...updates, date: today };
      await setDoc(wellnessRef, newData, { merge: true });
      
      setTodayData(newData);
      
      // Update history list immediately
      setHistory(prev => {
        const index = prev.findIndex(item => item.date === today);
        let newHistory;
        if (index >= 0) {
          newHistory = [...prev];
          newHistory[index] = newData;
        } else {
          newHistory = [...prev, newData];
        }
        return newHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    } catch (error) {
      console.error('Error updating wellness data:', error);
    }
  };

  const updateGoals = async (goals) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, goals);
      
      if (goals.sleepGoal) setSleepGoal(goals.sleepGoal);
      if (goals.waterGoal) setWaterGoal(goals.waterGoal);
      if (goals.stepsGoal) setStepsGoal(goals.stepsGoal);
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };

  const addWaterIntake = async (amount) => {
    const currentWater = todayData.water || 0;
    await updateTodayData({ water: currentWater + amount });
  };

  const setSleep = async (minutes) => {
    await updateTodayData({ sleep: minutes });
  };

  const setSteps = async (count) => {
    await updateTodayData({ steps: count });
  };

  return (
    <WellnessContext.Provider value={{
      todayData,
      sleepGoal,
      waterGoal,
      stepsGoal,
      history,
      loading,
      error,
      updateTodayData,
      updateGoals,
      addWaterIntake,
      setSleep,
      setSteps,
      loadHistory,
    }}>
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
            <div style={{
              width: '60px',
              height: '60px',
              background: '#007bff',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'pulse-animation 1.5s ease-in-out infinite'
            }}></div>
            <p style={{ color: '#000', fontSize: '16px', fontWeight: 'bold' }}>Loading wellness data...</p>
            <style>{`
              @keyframes pulse-animation {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        </div>
      ) : error ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          background: '#fff3cd',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <p style={{ color: '#856404', fontSize: '16px', fontWeight: 'bold' }}>Error loading wellness data</p>
            <p style={{ color: '#856404', fontSize: '14px', marginTop: '10px' }}>{error}</p>
            <p style={{ color: '#856404', fontSize: '12px', marginTop: '20px' }}>The app will continue with default values</p>
          </div>
        </div>
      ) : (
        children
      )}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within WellnessProvider');
  }
  return context;
};
