import React from 'react';
import { useWellness } from './context/WellnessContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';

export const Home = () => {
  const { todayData, sleepGoal, waterGoal, stepsGoal, loading, history } = useWellness();
  const { currentUser } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Safely parse values
  const water = parseFloat(todayData.water) || 0;
  const sleep = parseFloat(todayData.sleep) || 0;
  const steps = parseFloat(todayData.steps) || 0;

  const sleepHours = Math.floor(sleep / 60);
  const sleepMinutes = Math.floor(sleep % 60);
  
  const sleepProgress = Math.min((sleep / sleepGoal) * 100, 100) || 0;
  const waterProgress = Math.min((water / waterGoal) * 100, 100) || 0;
  const stepsProgress = Math.min((steps / stepsGoal) * 100, 100) || 0;

  const overallProgress = Math.round((sleepProgress + waterProgress + stepsProgress) / 3);

  const userName = currentUser?.email?.split('@')[0] || 'User';
  const nameCapitalized = userName.charAt(0).toUpperCase() + userName.slice(1);

  // Steps SVG calculations
  const circleCircumference = 515.22;
  const stepOffset = circleCircumference - (circleCircumference * (stepsProgress / 100));
  const remainingSteps = Math.max(stepsGoal - steps, 0);

  // History calculations (Last 7 days)
  const recentHistory = history.slice(0, 7).reverse();
  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const totalSleepRecent = recentHistory.reduce((sum, h) => sum + (parseFloat(h.sleep) || 0), 0);
  const avgSleepRecent = recentHistory.length > 0 ? totalSleepRecent / recentHistory.length : sleep;
  const avgSleepHours = Math.floor(avgSleepRecent / 60);
  const avgSleepMinutes = Math.floor(avgSleepRecent % 60);
  const maxSleep = Math.max(...recentHistory.map(h => parseFloat(h.sleep) || 0), sleepGoal, 1);

  // Wellness Trends calculation (Overall goal completion over last 7 days)
  const wellnessTrendData = [...recentHistory].map(h => {
    const sP = Math.min((parseFloat(h.steps) || 0) / stepsGoal, 1) * 100;
    const wP = Math.min((parseFloat(h.water) || 0) / waterGoal, 1) * 100;
    const slP = Math.min((parseFloat(h.sleep) || 0) / sleepGoal, 1) * 100;
    return {
      score: Math.round((sP + wP + slP) / 3),
      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  // Generate trend line points (1000px wide SVG coordinates)
  const points = wellnessTrendData.length > 0 ? wellnessTrendData.map((data, i) => {
    const x = (i / Math.max(1, wellnessTrendData.length - 1)) * 1000;
    const y = 180 - (data.score * 1.5); // 0% = 180, 100% = 30
    return { x, y, ...data };
  }) : [{ x: 0, y: 150, score: 0, date: 'No Data' }, { x: 1000, y: 150, score: 0, date: 'No Data' }];
  
  const trendD = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;
  const areaD = `${trendD} L1000,200 L0,200 Z`;
  const lastPoint = points.length > 0 ? points[points.length - 1] : { x: 850, y: 60, score: 0, date: 'Today' };
  const avgWellnessScore = wellnessTrendData.length > 0 
    ? Math.round(wellnessTrendData.reduce((a, b) => a + b.score, 0) / wellnessTrendData.length)
    : overallProgress;

  const [hoveredPointIndex, setHoveredPointIndex] = React.useState(null);
  const activePoint = hoveredPointIndex !== null && points.length > 0 ? points[hoveredPointIndex] : lastPoint;
  const isHovering = hoveredPointIndex !== null;

  // Typing Effect
  const [typedText, setTypedText] = React.useState('');
  const fullText = `Good morning, ${nameCapitalized}.`;

  React.useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(typingInterval);
      }
    }, 50); // Fast typing for better feel
    return () => clearInterval(typingInterval);
  }, [fullText]);

  return (
    <>
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tighter min-h-[60px]">
            {typedText}
            <span className="inline-block w-1.5 h-12 bg-primary ml-2 animate-pulse align-middle"></span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">You're doing great! You've reached <span className="text-primary font-extrabold">{overallProgress}%</span> of your goals today.</p>
        </div>
        <Link to="/steps" className="px-8 py-4 bg-gradient-to-r from-primary to-sapphire text-white rounded-2xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Log Activity
        </Link>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Steps Card */}
        <div className="md:col-span-4 glass-card-elevated rounded-2xl p-8 flex flex-col relative group overflow-hidden hover:-translate-y-1 transition-transform">
          <Link to="/steps" className="absolute inset-0 z-10"></Link>
          <div className="flex justify-between items-center mb-10">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Steps Activity</span>
            <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">directions_run</span>
          </div>
          <div className="relative w-44 h-44 mx-auto mb-8 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle className="text-blue-100/50" cx="88" cy="88" fill="transparent" r="82" stroke="currentColor" strokeWidth="10"></circle>
              <circle className="transition-all duration-1000" cx="88" cy="88" fill="transparent" r="82" stroke="url(#stepsGrad)" strokeDasharray="515.22" strokeDashoffset={stepOffset} strokeLinecap="round" strokeWidth="12"></circle>
              <defs>
                <linearGradient id="stepsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2d6cf5"></stop>
                  <stop offset="100%" stopColor="#1e40af"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <span className="text-4xl font-extrabold block text-slate-900 tracking-tighter">{steps.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-primary uppercase">Goal: {(stepsGoal/1000).toFixed(0)}k</span>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-primary/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Remaining</p>
              <p className="text-lg font-extrabold text-sapphire">{remainingSteps.toLocaleString()}</p>
            </div>
            {stepsProgress >= 100 && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Goal Met!</span>
            )}
          </div>
        </div>

        {/* Sleep Card */}
        <div className="md:col-span-8 glass-card-elevated rounded-2xl p-8 relative group hover:-translate-y-1 transition-transform overflow-hidden">
          <Link to="/sleep" className="absolute inset-0 z-10"></Link>
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sapphire/10 text-sapphire rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined material-symbols-fill">bedtime</span>
              </div>
              <span className="text-[10px] font-extrabold text-sapphire uppercase tracking-widest">Sleep Analysis</span>
            </div>
            <div className="px-4 py-2 bg-sapphire/5 rounded-full">
              <span className="text-[10px] font-extrabold text-sapphire">GOAL: {Math.floor(sleepGoal/60)}H</span>
            </div>
          </div>
          
          <div className="flex items-end gap-x-4 h-48 mb-8 px-2">
            {recentHistory.map((h, i) => {
              const h_sleep = parseFloat(h.sleep) || 0;
              const height = (h_sleep / maxSleep) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full group/bar">
                  <div className="w-full relative flex flex-col justify-end h-full">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md z-20">
                      {Math.floor(h_sleep/60)}h {Math.floor(h_sleep%60)}m
                    </div>
                    <div style={{ height: `${height}%` }} 
                      className={`w-full rounded-xl transition-all duration-500 bg-gradient-to-t ${h_sleep >= sleepGoal ? 'from-sapphire to-primary' : 'from-blue-200 to-blue-300'}`}>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-on-surface-variant uppercase">{getDayName(h.date)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-primary/5 pt-6">
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-slate-900">{sleepHours}h {sleepMinutes}m</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Sleep Tonight</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-32 bg-blue-50 rounded-full overflow-hidden border border-primary/5">
                <div className="h-full bg-gradient-to-r from-primary to-sapphire transition-all duration-1000" style={{ width: `${sleepProgress}%` }}></div>
              </div>
              <span className="text-sm font-extrabold text-primary">{Math.round(sleepProgress)}%</span>
            </div>
          </div>
        </div>

        {/* Hydration Card */}
        <div className="md:col-span-5 glass-card-elevated rounded-2xl p-8 border-t-4 border-primary/40 relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined material-symbols-fill">water_drop</span>
            </div>
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Hydration Balance</span>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-slate-900">{water.toFixed(1)}</span>
              <span className="text-lg font-bold text-primary tracking-tight">Liters</span>
            </div>
            <div className="w-full bg-blue-50/50 h-10 rounded-2xl p-1.5 border border-primary/5">
              <div className="h-full bg-gradient-to-r from-primary to-sapphire rounded-xl transition-all duration-700 shadow-lg shadow-primary/20" 
                style={{ width: `${waterProgress}%` }}></div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold text-on-surface-variant tracking-wide uppercase">Tracked Today</span>
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Goal: {waterGoal}L</span>
            </div>
            <Link to="/water" className="mt-4 py-3 bg-white border border-primary/10 rounded-xl text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all text-center">Open Water Tracker</Link>
          </div>
        </div>

        {/* Recent & Averages */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-8 flex flex-col h-full border-l-4 border-primary/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined material-symbols-fill">history</span>
              </div>
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Recent Logs</span>
            </div>
            <div className="space-y-4">
              {history.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-primary/5 last:border-0">
                  <div className="text-xs font-bold text-slate-800">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="text-sm font-extrabold text-primary">{item.steps.toLocaleString()} steps</div>
                </div>
              ))}
              {history.length === 0 && <p className="text-xs text-on-surface-variant italic">No data yet.</p>}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-8 flex flex-col h-full border-l-4 border-sapphire/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-sapphire/10 text-sapphire rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined material-symbols-fill">query_stats</span>
              </div>
              <span className="text-[10px] font-extrabold text-sapphire uppercase tracking-widest">Sleep Average</span>
            </div>
            <div className="mt-2">
              <p className="text-4xl font-extrabold text-slate-900 tracking-tighter">{avgSleepHours}h {avgSleepMinutes}m</p>
              <p className="text-[11px] text-on-surface-variant font-medium mt-2 leading-relaxed">Your 7-day average sleep duration.</p>
            </div>
          </div>
        </div>

        {/* Functional Wellness Trends */}
        <div className="md:col-span-12 glass-card-elevated rounded-2xl p-10 mt-4 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Active Analytics</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">Wellness Growth Curve</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-primary/5 border border-primary/10 text-[10px] font-extrabold text-primary rounded-xl uppercase tracking-widest">7-Day Avg: {avgWellnessScore}%</div>
              <div className="px-4 py-2 bg-blue-50 text-[10px] font-extrabold text-on-surface-variant rounded-xl uppercase tracking-widest border border-primary/5">Past 7 Days</div>
            </div>
          </div>
          <div className="relative w-full h-[320px] px-4 py-8">
            <svg className="w-full h-full overflow-visible" viewBox="-40 -20 1080 240">
              <defs>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                
                {/* Improved Multi-stop Gradient */}
                <linearGradient id="mainTrendGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2d6cf5" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#2d6cf5" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#2d6cf5" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
              </defs>

              {/* Horizontal Help Lines */}
              <line stroke="currentColor" strokeDasharray="8 8" strokeWidth="1" x1="-40" x2="1040" y1="50" y2="50" opacity="0.15"></line>
              <line stroke="currentColor" strokeDasharray="8 8" strokeWidth="1" x1="-40" x2="1040" y1="100" y2="100" opacity="0.15"></line>
              <line stroke="currentColor" strokeDasharray="8 8" strokeWidth="1" x1="-40" x2="1040" y1="150" y2="150" opacity="0.15"></line>
              
              {/* Vertical Day Grid */}
              {points.map((p, i) => (
                <line key={`vcl-${i}`} stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1={p.x} x2={p.x} y1="30" y2="200" opacity="0.1" />
              ))}

              <path d={areaD} fill="url(#mainTrendGrad)" className="transition-all duration-500"></path>
              
              {/* Main Line with Glow */}
              <path d={trendD} fill="none" stroke="url(#lineGrad)" strokeLinecap="round" strokeWidth="6" filter="url(#glow)" className="transition-all duration-500"></path>
              
              {/* Render visible points and labels */}
              {points.map((p, i) => (
                <g key={`point-group-${i}`}>
                   {/* Date Labels below X-axis */}
                   <text x={p.x} y="225" fill="#64748b" textAnchor="middle" className="text-[10px] font-extrabold uppercase tracking-tight">
                    {p.date.split(',')[0]}
                   </text>

                   <circle 
                    cx={p.x} 
                    cy={p.y} 
                    fill={hoveredPointIndex === i ? '#2d6cf5' : '#fff'} 
                    r={hoveredPointIndex === i ? "10" : "6"} 
                    stroke={hoveredPointIndex === i ? '#dbeafe' : '#2d6cf5'} 
                    strokeWidth={hoveredPointIndex === i ? "5" : "3"} 
                    className="transition-all duration-300 shadow-xl cursor-pointer"
                  />
                  {/* Invisible target for easier hovering */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="40"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                </g>
              ))}
            </svg>
            {isHovering && (
              <div style={{ left: `${Math.min(920, Math.max(80, activePoint.x))/10}%`, top: `${activePoint.y/2}%` }} 
                className="absolute -translate-x-1/2 -translate-y-28 glass-card p-6 rounded-[2.5rem] border border-white/80 shadow-2xl pointer-events-none bg-white/95 transition-all duration-300 min-w-[160px] z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{activePoint.date}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{activePoint.score}</span>
                    <span className="text-sm font-bold text-primary">%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${activePoint.score}%` }}></div>
                  </div>
                  <span className="text-[9px] text-on-surface-variant font-bold mt-1 uppercase tracking-tight">Goal Compliance</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Link to="/profile" className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-tr from-sapphire to-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[110] group">
        <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
      </Link>
    </>
  );
};