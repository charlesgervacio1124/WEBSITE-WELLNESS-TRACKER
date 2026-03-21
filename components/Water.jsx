import { useState } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import { Droplet, Plus, TrendingUp } from 'lucide-react';

export const Water = () => {
  const { todayData, waterGoal, addWaterIntake, updateGoals } = useWellness();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [newGoal, setNewGoal] = useState(waterGoal);
  const [intakeAmount, setIntakeAmount] = useState(0.25);

  const waterProgress = (todayData.water / waterGoal) * 100;

  const handleSetGoal = async () => {
    await updateGoals({ waterGoal: newGoal });
    setShowGoalDialog(false);
  };

  const handleAddIntake = async () => {
    await addWaterIntake(intakeAmount);
    setIntakeAmount(0.25);
    setShowIntakeDialog(false);
  };

  const quickAddWater = async (amount) => {
    await addWaterIntake(amount);
  };

  return (
    <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Water Tracking</h1>
          <p className="text-gray-600">Stay hydrated and track your daily water intake</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Main Water Card */}
          <div className="bg-gradient-to-br from-cyan-100 to-blue-50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Intake</p>
                <p className="text-5xl font-bold">{todayData.water.toFixed(1)}L</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Daily Goal</span>
                  <span className="text-sm font-bold text-cyan-600">{waterGoal.toFixed(1)}L</span>
                </div>
                <div className="relative h-4 bg-cyan-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all"
                    style={{ inlineSize: `${Math.min(waterProgress, 100)}%` }}
                  />
                </div>
                <p className="text-right text-sm text-gray-600 mt-1">{Math.round(waterProgress)}% complete</p>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-sm font-bold">Quick Add</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => quickAddWater(0.25)}
                    className="bg-white p-3 rounded-lg hover:bg-cyan-50 transition-colors border border-cyan-200"
                  >
                    <p className="text-sm font-bold">250ml</p>
                  </button>
                  <button
                    onClick={() => quickAddWater(0.5)}
                    className="bg-white p-3 rounded-lg hover:bg-cyan-50 transition-colors border border-cyan-200"
                  >
                    <p className="text-sm font-bold">500ml</p>
                  </button>
                  <button
                    onClick={() => quickAddWater(1)}
                    className="bg-white p-3 rounded-lg hover:bg-cyan-50 transition-colors border border-cyan-200"
                  >
                    <p className="text-sm font-bold">1L</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => setShowIntakeDialog(true)}
                  className="bg-cyan-600 text-white py-3 rounded-xl font-bold hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Custom
                </button>
                <button
                  onClick={() => setShowGoalDialog(true)}
                  className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Set Goal
                </button>
              </div>
            </div>
          </div>

          {/* Water Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
                <h2 className="text-lg font-bold">Hydration Statistics</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                  <span className="text-sm text-gray-700">Daily Average</span>
                  <span className="font-bold text-cyan-600">1.8L</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                  <span className="text-sm text-gray-700">Hydration Level</span>
                  <span className="font-bold text-cyan-600">Good</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                  <span className="text-sm text-gray-700">Weekly Average</span>
                  <span className="font-bold text-cyan-600">2.0L</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-3">Hydration Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Drink water first thing in the morning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Keep a water bottle with you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Drink before, during, and after exercise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Set hourly reminders to drink water</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Goal Dialog */}
        {showGoalDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Set Water Goal</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Liters</label>
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(parseFloat(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    min="0.5"
                    max="10"
                    step="0.1"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSetGoal}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
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

        {/* Intake Dialog */}
        {showIntakeDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Water Intake</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (Liters)</label>
                  <input
                    type="number"
                    value={intakeAmount}
                    onChange={(e) => setIntakeAmount(parseFloat(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    min="0.1"
                    max="2"
                    step="0.05"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIntakeAmount(0.25)} className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                    250ml
                  </button>
                  <button onClick={() => setIntakeAmount(0.5)} className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                    500ml
                  </button>
                  <button onClick={() => setIntakeAmount(1)} className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                    1L
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddIntake}
                    className="flex-1 bg-cyan-600 text-white py-2 rounded-lg font-bold hover:bg-cyan-700"
                  >
                    Add Intake
                  </button>
                  <button
                    onClick={() => setShowIntakeDialog(false)}
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
