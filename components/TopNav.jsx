import React from 'react';
import { Link } from 'react-router-dom';

export const TopNav = () => {
  return (
    <header className="fixed top-0 w-full z-[100] px-8 py-4 pointer-events-none">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center glass-card px-8 h-16 rounded-2xl pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg font-bold">blur_on</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sapphire to-primary bg-clip-text text-transparent">WellnessTracker</span>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="relative text-primary font-bold text-sm nav-link-active">Overview</Link>
          <Link to="/history" className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors">Analysis</Link>
          <Link to="/steps" className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors">Activity</Link>
          <Link to="/profile" className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors">Settings</Link>
        </nav>
        <div className="flex items-center gap-5">

          <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm cursor-pointer hover:border-primary transition-colors">
            <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAliAXWgws9qzL44ype7AiZjNymsNb6L2_ilb8WriNtfy6jwSToVxYGsZLgpVJPLhW1nnlvRsl3_FpqgNNspgUMUIvyEIV2DLxDrpBVg6D4igpnyqbNnSfVTEPMjl5eBUDNLBbp7M0f_z1opQot_oZjbyGo61aLIQ-Aby_sYWjLhFksln7mH2VPoTGt3YY9QVX0BF2jvPZAPAZ-tSDQwYTVcLvFivKQyfXNm0r6AJf7aqNfxs0O3G8IWu6_J6Twa4yLSF_NIrzJcA" />
          </Link>
        </div>
      </div>
    </header>
  );
};
