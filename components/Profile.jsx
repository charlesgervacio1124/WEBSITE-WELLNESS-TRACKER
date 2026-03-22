import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      await updateDoc(userRef, { name: tempName, email: tempEmail });
      setName(tempName);
      setEmail(tempEmail);
      setShowEditDialog(false);
    } catch (error) {
      alert('Error saving profile: ' + error.message);
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
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Bell,
      label: 'Reminder',
      onClick: () => alert('Reminder settings'),
      color: 'text-sapphire',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Clock,
      label: 'Activity Log',
      onClick: () => navigate('/history'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Info,
      label: 'About',
      onClick: () => alert('Wellness Tracker v1.1 Premium'),
      color: 'text-on-surface-variant',
      bgColor: 'bg-blue-50/50',
    },
  ];

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tighter">Profile Settings</h1>
          <p className="text-on-surface-variant text-lg font-medium">Manage your account and app preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Profile Identity Card */}
        <div className="md:col-span-4 glass-card-elevated rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden h-fit">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-sapphire to-primary p-1 mb-6 shadow-xl shadow-primary/20">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <User className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{name || 'Wellness User'}</h2>
          <p className="text-on-surface-variant font-medium mb-8 text-sm">{email}</p>
          
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-gradient-to-r from-primary to-sapphire text-white rounded-2xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Menu & Details */}
        <div className="md:col-span-8 flex flex-col gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="glass-card hover:bg-blue-50/50 p-6 rounded-2xl flex items-center justify-between transition-all group border-l-4 border-transparent hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="text-lg font-bold text-slate-800 tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          {/* Account Stats */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Account Analytics</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-primary/5 text-center">
                <p className="text-3xl font-extrabold text-primary tracking-tighter mb-1">45</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Days Active</p>
              </div>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-primary/5 text-center">
                <p className="text-3xl font-extrabold text-sapphire tracking-tighter mb-1">92%</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Goal Met</p>
              </div>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-primary/5 text-center">
                <p className="text-3xl font-extrabold text-primary tracking-tighter mb-1">12</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Streak</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass-card-elevated rounded-2xl p-8 bg-gradient-to-br from-blue-50/30 to-blue-100/20">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-extrabold text-sapphire uppercase tracking-widest">Notification Settings</span>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Daily Reminders', checked: true },
                { label: 'Water Intake AI Insights', checked: true },
                { label: 'Step Goal Completion Alerts', checked: false }
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{pref.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={pref.checked} />
                    <div className="w-12 h-6 bg-blue-100/50 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-in fade-in duration-300">
          <div className="glass-card-elevated rounded-3xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Update Profile</h2>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-5 py-4 bg-blue-50/50 border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-800 placeholder:text-slate-400"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-blue-50/50 border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-800 placeholder:text-slate-400"
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-to-r from-primary to-sapphire text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:translate-y-[-2px] transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-in fade-in duration-300">
          <div className="glass-card-elevated rounded-3xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <LogOut className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Leaving Already?</h2>
            <p className="text-on-surface-variant font-medium mb-10 leading-relaxed">Are you sure you want to sign out? Your latest wellness metrics are safely synced to the cloud.</p>
            <div className="flex gap-4">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Keep Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

