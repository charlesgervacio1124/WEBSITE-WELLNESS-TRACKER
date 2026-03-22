import { useState } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import { Footprints, ZoomIn, ZoomOut, Locate, TrendingUp } from 'lucide-react';

export const Steps = () => {
  const { todayData, stepsGoal, setSteps } = useWellness();
  const [showStepsDialog, setShowStepsDialog] = useState(false);
  const [stepsInput, setStepsInput] = useState(0);
  const stepsProgress = (todayData.steps / stepsGoal) * 100;
  const rawDistance = todayData.distance || ((todayData.steps / 1000) * 0.8);
  const distance = parseFloat(rawDistance).toFixed(2);
  
  let activeTimeFormatted;
  if (todayData.timeMillis) {
    const totalSeconds = Math.floor(todayData.timeMillis / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    activeTimeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;
  } else {
    activeTimeFormatted = `${Math.round((todayData.steps || 0) / 100)}:00`;
  }

  const handleAddSteps = async () => {
    const newSteps = parseInt(stepsInput);
    if (newSteps > 0) {
      await setSteps(todayData.steps + newSteps);
      setStepsInput(0);
      setShowStepsDialog(false);
    }
  };

  const handleSetSteps = async (amount) => {
    await setSteps(todayData.steps + amount);
  };

  return (
    <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Step Tracking</h1>
          <p className="text-gray-600">Monitor your daily activity and reach your step goals</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Steps Card */}
          <div className="col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <Footprints className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Steps Today</p>
                  <p className="text-5xl font-bold">{todayData.steps.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-700">Daily Goal</span>
                    <span className="text-sm font-bold text-blue-600">{stepsGoal.toLocaleString()} steps</span>
                  </div>
                  <div className="relative h-4 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all"
                      style={{ inlineSize: `${Math.min(stepsProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">{Math.round(stepsProgress)}% complete</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="relative bg-white rounded-2xl overflow-hidden h-96 shadow-sm border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                  <div className="absolute top-1/4 left-0 w-full h-1 bg-gray-400"></div>
                  <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-500"></div>
                  <div className="absolute top-3/4 left-0 w-full h-1 bg-gray-400"></div>
                  <div className="absolute left-1/4 top-0 h-full w-1 bg-gray-400"></div>
                  <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-400"></div>
                  <div className="absolute left-3/4 top-0 h-full w-1 bg-gray-400"></div>
                </div>
                
                {/* Current location marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                {/* Map controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                    <ZoomOut className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                    <Locate className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Map attribution */}
                <div className="absolute bottom-3 left-3 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
                  Google Maps
                </div>
              </div>
            </div>
          </div>

          {/* Step Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold">Activity Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Distance</span>
                  <span className="font-bold text-blue-600">{distance} km</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Active Time (Min/Sec)</span>
                  <span className="font-bold text-blue-600">{activeTimeFormatted}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-3">Activity Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Take the stairs instead of elevator</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Walk during phone calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Park farther from destinations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Take short walking breaks hourly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Steps Dialog */}
        {showStepsDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Steps</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Number of Steps</label>
                  <input
                    type="number"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSteps}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
                  >
                    Add Steps
                  </button>
                  <button
                    onClick={() => setShowStepsDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}      </div>
  );
};
