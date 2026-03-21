import { useWellness } from '../context/WellnessContext';
import { Calendar, ActivitySquare } from 'lucide-react';

export const History = () => {
  const { history, loading } = useWellness();

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
          <p style={{ color: '#000', fontSize: '16px', fontWeight: 'bold' }}>Loading history...</p>
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

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalSleep = history.reduce((sum, h) => sum + (typeof h.sleep === 'number' ? h.sleep : parseFloat(h.sleep) || 0), 0);
  const totalWater = history.reduce((sum, h) => sum + (typeof h.water === 'number' ? h.water : parseFloat(h.water) || 0), 0);
  const totalSteps = history.reduce((sum, h) => sum + (typeof h.steps === 'number' ? h.steps : parseFloat(h.steps) || 0), 0);

  const avgSleep = history.length > 0 ? formatTime(Math.floor(totalSleep / history.length)) : "0h 0m";
  const avgWater = history.length > 0 ? (totalWater / history.length).toFixed(1) : "0.0";
  const avgSteps = history.length > 0 ? Math.floor(totalSteps / history.length).toLocaleString() : "0";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity History</h1>
        <p className="text-gray-600">Review your wellness journey and track your progress</p>
      </div>

      {history.length === 0 && (
        <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
          <p className="text-gray-500 text-lg">No activity recorded yet</p>
          <p className="text-gray-400 text-sm mt-2">Start tracking your wellness to see history here.</p>
        </div>
      )}

      <div className="grid gap-4">
        {history.map((entry, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <p className="font-bold">{entry.date}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <ActivitySquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Sleep</p>
                  <p className="text-lg font-bold">{formatTime(entry.sleep || 0)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <ActivitySquare className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Water</p>
                  <p className="text-lg font-bold">{(typeof entry.water === 'number' ? entry.water : parseFloat(entry.water) || 0).toFixed(1)}L</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ActivitySquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Steps</p>
                  <p className="text-lg font-bold">{(typeof entry.steps === 'number' ? entry.steps : parseInt(entry.steps) || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Weekly Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Sleep</p>
              <p className="text-2xl font-bold text-purple-600">{avgSleep}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Water</p>
              <p className="text-2xl font-bold text-cyan-600">{avgWater}L</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Steps</p>
              <p className="text-2xl font-bold text-blue-600">{avgSteps}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
