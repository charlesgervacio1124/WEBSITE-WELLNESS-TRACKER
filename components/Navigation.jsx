import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return "flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 transition-all";
    }
    return "flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-blue-100/50 font-bold transition-all group";
  };

  const getIconClass = (path) => {
    const isActive = location.pathname === path;
    return `material-symbols-outlined ${isActive ? 'material-symbols-fill' : 'group-hover:text-primary'}`;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-10">
      <div className="flex flex-col gap-6">
        <div className="px-2">
          <h3 className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] mb-4">Core Trackers</h3>
          <nav className="flex flex-col gap-2">
            <Link to="/" className={getLinkClass('/')}>
              <span className={getIconClass('/')}>grid_view</span>
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link to="/steps" className={getLinkClass('/steps')}>
              <span className={getIconClass('/steps')}>directions_run</span>
              <span className="text-sm">Steps</span>
            </Link>
            <Link to="/sleep" className={getLinkClass('/sleep')}>
              <span className={getIconClass('/sleep')}>nights_stay</span>
              <span className="text-sm">Sleep</span>
            </Link>
            <Link to="/water" className={getLinkClass('/water')}>
              <span className={getIconClass('/water')}>opacity</span>
              <span className="text-sm">Water Intake</span>
            </Link>
          </nav>
        </div>
        <div className="px-2">
          <h3 className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] mb-4">Settings</h3>
          <nav className="flex flex-col gap-2">
            <Link to="/history" className={getLinkClass('/history')}>
              <span className={getIconClass('/history')}>history</span>
              <span className="text-sm">History</span>
            </Link>
            <Link to="/profile" className={getLinkClass('/profile')}>
              <span className={getIconClass('/profile')}>person</span>
              <span className="text-sm">Profile</span>
            </Link>
          </nav>
        </div>
      </div>


    </aside>
  );
};
