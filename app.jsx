import { useWellness } from './context/WellnessContext.jsx';
import { Link } from 'react-router-dom';
import { Activity, Moon, Droplet, Footprints, TrendingUp, Calendar } from 'lucide-react';

export const Home = () => {
  const { todayData, sleepGoal, waterGoal, stepsGoal, loading } = useWellness();

  if (loading) {
    return (
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
          <p style={{ color: '#000', fontSize: '16px', fontWeight: 'bold' }}>Loading...</p>
          <style>{`
            @keyframes pulse-animation {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Ensure todayData has valid numeric values
  const water = typeof todayData.water === 'number' ? todayData.water : 0;
  const sleep = typeof todayData.sleep === 'number' ? todayData.sleep : 0;
  const steps = typeof todayData.steps === 'number' ? todayData.steps : 0;

  const sleepHours = Math.floor(sleep / 60);
  const sleepMinutes = sleep % 60;
  const sleepProgress = (sleep / sleepGoal) * 100;
  const waterProgress = (water / waterGoal) * 100;
  const stepsProgress = (steps / stepsGoal) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Here's your wellness summary for today</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{todayData.date}</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Sleep Card */}
          <Link to="/sleep" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Moon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sleep</p>
                  <p className="text-2xl font-bold">{sleepHours}h {sleepMinutes}m</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Goal: {Math.floor(sleepGoal / 60)}h</span>
                <span className="font-medium text-purple-600">{Math.round(sleepProgress)}%</span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                  style={{ inlineSize: `${Math.min(sleepProgress, 100)}%` }}
                />
              </div>
            </div>
          </Link>

          {/* Water Card */}
          <Link to="/water" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Water</p>
                  <p className="text-2xl font-bold">{water.toFixed(1)}L</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Goal: {waterGoal}L</span>
                <span className="font-medium text-cyan-600">{Math.round(waterProgress)}%</span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all"
                  style={{ inlineSize: `${Math.min(waterProgress, 100)}%` }}
                />
              </div>
            </div>
          </Link>

          {/* Steps Card */}
          <Link to="/steps" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Footprints className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Steps</p>
                  <p className="text-2xl font-bold">{steps.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Goal: {stepsGoal.toLocaleString()}</span>
                <span className="font-medium text-blue-600">{Math.round(stepsProgress)}%</span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                  style={{ inlineSize: `${Math.min(stepsProgress, 100)}%` }}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Activity Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold">Today's Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Sleep Quality</span>
                <span className="font-bold text-purple-600">Excellent</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                <span className="text-sm text-gray-700">Hydration Level</span>
                <span className="font-bold text-cyan-600">Good</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Activity Level</span>
                <span className="font-bold text-blue-600">Low</span>
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-gradient-to-br from-cyan-50 to-purple-50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold">Reminders</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <p className="text-sm">Don't forget to drink water!</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Go for a walk to reach your step goal</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm">Aim for 8 hours of sleep tonight</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};