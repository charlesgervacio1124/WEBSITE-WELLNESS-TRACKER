import { Home, Clock, Moon, Droplet, Footprints, Activity, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-500 to-purple-600 text-white p-6 flex flex-col">
      <div className="flex flex-col items-center gap-4 mb-10 pb-4 border-b border-white/20">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <Activity className="w-7 h-7" />
        </div>
        <h1 className="font-bold text-2xl tracking-wide text-center">WELLNESS TRACKER</h1>
      </div>

      <div className="space-y-2 flex-1">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === '/' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/sleep"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === '/sleep' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Moon className="w-5 h-5" />
          <span>Sleep</span>
        </Link>
        <Link
          to="/water"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === '/water' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Droplet className="w-5 h-5" />
          <span>Water</span>
        </Link>
        <Link
          to="/steps"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === '/steps' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Footprints className="w-5 h-5" />
          <span>Steps</span>
        </Link>
        <Link
          to="/history"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === '/history' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>History</span>
        </Link>
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === '/profile' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </div>

      <div className="pt-6 border-t border-white/20">
        <p className="text-sm opacity-70">Wellness Tracker v1.0</p>
      </div>
    </nav>
  );
};
