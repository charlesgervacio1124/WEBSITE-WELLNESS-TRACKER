import { useState } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import { Moon, TrendingUp } from 'lucide-react';

export const Sleep = () => {
  const { todayData, sleepGoal, setSleep, updateGoals, updateTodayData, history } = useWellness();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showSleepDialog, setShowSleepDialog] = useState(false);
  const [newGoal, setNewGoal] = useState(sleepGoal);
  const [sleepInput, setSleepInput] = useState(0);

  const sleepHours = Math.floor(todayData.sleep || 0);
  const sleepMinutes = Math.round(((todayData.sleep || 0) % 1) * 60);
  const activeSleepGoal = todayData.sleepGoal || sleepGoal;
  const goalHours = activeSleepGoal; // daily goal overrides global
  const sleepProgress = ((todayData.sleep || 0) / activeSleepGoal) * 100;

  const formatTime = (hours) => {
    if (!hours || isNaN(hours)) return "0h 0m";
    const h = Math.floor(hours);
    const mins = Math.round((hours % 1) * 60);
    return `${h}h ${mins}m`;
  };

  const totalSleep = history.reduce((sum, h) => sum + (parseFloat(h.sleep) || 0), 0);
  const avgSleep = history.length > 0 ? totalSleep / history.length : 0;
  const avgSleepText = formatTime(avgSleep);
  
  let sleepMood = todayData.sleepMood;
  if (!sleepMood) {
    if (sleepProgress >= 100) sleepMood = "Energetic";
    else if (sleepProgress >= 70) sleepMood = "Refreshed";
    else sleepMood = "Groggy";
  }

  const last7Days = history.slice(0, 7);
  const weeklyTotal = last7Days.reduce((sum, h) => sum + (parseFloat(h.sleep) || 0), 0);
  const weeklyAvg = last7Days.length > 0 ? weeklyTotal / last7Days.length : 0;
  const weeklyAvgText = formatTime(weeklyAvg);

  let sleepQuality = todayData.sleepQuality;
  if (!sleepQuality) {
    if (sleepProgress >= 100) sleepQuality = "Excellent";
    else if (sleepProgress >= 70) sleepQuality = "Good";
    else sleepQuality = "Needs Improvement";
  }

  const handleSetGoal = async () => {
    // Save to the daily wellness document as a daily override, plus the global goal
    await updateTodayData({ sleepGoal: newGoal });
    await updateGoals({ sleepGoal: newGoal });
    setShowGoalDialog(false);
  };

  const handleAddSleep = async () => {
    const sleepToAdd = parseFloat(sleepInput);
    if (sleepToAdd > 0) {
      await setSleep((todayData.sleep || 0) + sleepToAdd);
      setSleepInput(0);
      setShowSleepDialog(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sleep Tracking</h1>
        <p className="text-gray-600">Monitor your sleep patterns and reach your goals</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Main Sleep Card */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sleep Time</p>
              <p className="text-5xl font-bold">{sleepHours}h {sleepMinutes}m</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Daily Goal</span>
                <span className="text-sm font-bold text-purple-600">{goalHours} hours</span>
              </div>
              <div className="relative h-4 bg-purple-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                  style={{ inlineSize: `${Math.min(sleepProgress, 100)}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">{Math.round(sleepProgress)}% complete</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => setShowSleepDialog(true)}
                className="bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                Log Sleep
              </button>
              <button
                onClick={() => { setNewGoal(sleepGoal); setShowGoalDialog(true); }}
                className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Set Goal
              </button>
            </div>
          </div>
        </div>

        {/* Sleep Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold">Sleep Statistics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Mood</span>
                <span className="font-bold text-purple-600">{sleepMood}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Sleep Quality</span>
                <span className="font-bold text-purple-600">{sleepQuality}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Weekly Average</span>
                <span className="font-bold text-purple-600">{weeklyAvgText}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">Sleep Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Maintain a consistent sleep schedule</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Avoid screens 1 hour before bed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Keep your bedroom cool and dark</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Avoid caffeine after 2 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Goal Dialog */}
      {showGoalDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Set Sleep Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Hours</label>
                <input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(parseFloat(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  min="1"
                  max="24"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSetGoal}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700"
                >
                  Set Goal
                </button>
                <button
                  onClick={() => setShowGoalDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sleep Dialog */}
      {showSleepDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Log Sleep</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Hours Slept</label>
                <input
                  type="number"
                  value={sleepInput || ''}
                  onChange={(e) => setSleepInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  min="0"
                  step="0.5"
                  placeholder="hours"
                />
              </div>
              <div className="flex gap-2 justify-between text-sm text-gray-600">
                <button onClick={() => setSleepInput(6)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">6h</button>
                <button onClick={() => setSleepInput(7)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">7h</button>
                <button onClick={() => setSleepInput(8)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">8h</button>
                <button onClick={() => setSleepInput(9)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">9h</button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSleep}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700"
                >
                  Log Sleep
                </button>
                <button
                  onClick={() => setShowSleepDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
