import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, ChevronRight, Edit, Bell, Clock, Info, LogOut } from 'lucide-react';

export const Profile = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(currentUser?.email || 'user@example.com');
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;
      
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name || '');
          setEmail(userData.email || currentUser.email);
          setTempName(userData.name || '');
          setTempEmail(userData.email || currentUser.email);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: tempName,
        email: tempEmail,
      });
      
      setName(tempName);
      setEmail(tempEmail);
      setShowEditDialog(false);
    } catch (error) {
      alert('Error saving profile: ' + error.message);
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  const menuItems = [
    {
      icon: Edit,
      label: 'Edit Profile',
      onClick: () => {
        setTempName(name);
        setTempEmail(email);
        setShowEditDialog(true);
      },
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Bell,
      label: 'Reminder',
      onClick: () => alert('Reminder settings'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: Clock,
      label: 'History',
      onClick: () => window.location.href = '/history',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Info,
      label: 'About',
      onClick: () => alert('Wellness Tracker v1.0'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="col-span-1 bg-gradient-to-b from-blue-400 to-cyan-300 rounded-2xl p-8 shadow-lg text-center">
              <div className="mb-6">
                <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-gray-700" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{name}</h2>
              <p className="text-sm mb-6">{email}</p>

              <button
                onClick={handleLogout}
                className="w-full bg-purple-600 text-white py-3 rounded-full font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                LOG OUT
              </button>
            </div>

            {/* Menu Items */}
            <div className="col-span-2 space-y-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full bg-cyan-50 hover:bg-cyan-100 rounded-2xl p-6 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-lg font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              ))}

              {/* Account Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
                <h3 className="text-lg font-bold mb-4">Account Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">45</p>
                    <p className="text-sm text-gray-600">Days Active</p>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-xl">
                    <p className="text-2xl font-bold text-cyan-600">92%</p>
                    <p className="text-sm text-gray-600">Goal Completion</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-600">Streak Days</p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Quick Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Reminders</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Water Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Step Goal Alerts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        {showEditDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowEditDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-50">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full mx-4">
              <h2 className="text-2xl font-bold mb-2">Confirm Logout</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
              <div className="flex gap-3">
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
