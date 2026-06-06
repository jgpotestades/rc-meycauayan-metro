'use client';
import React, { useState, useEffect } from 'react';

// Core Structured Datastore
const clubActivities = [
  { id: 1, type: 'Project', title: "Barangay Health Center Medical Supply Drive", category: "Maternal & Child Health", description: "Distributed tools and essential vitamins to localized health hubs.", status: "Completed", detail: "Assisted over 1,200 families across Meycauayan." },
  { id: 2, type: 'Project', title: "Meycauayan Youth Literacy Initiative", category: "Supporting Education", description: "Donating textbook sets and establishing reading centers in public primary schools.", status: "Ongoing", detail: "Currently targeting 5 adopt-a-school facilities." },
  { id: 3, type: 'News', title: "District 3770 Governor's Official Visit", category: "Club Assembly", description: "The club hosted the district leadership assembly to review community service goals.", status: "Completed", detail: "Held successfully on June 1, 2026." },
  { id: 4, type: 'Project', title: "Bulacan Watershed Tree Planting", category: "Environmental Action", description: "Reforestation efforts along crucial regional basins to prevent flash flooding.", status: "Completed", detail: "500 native saplings planted and monitored." }
];

export default function Home() {
  // Public UI State
  const [activeForm, setActiveForm] = useState<'inquiry' | 'member' | 'donate'>('inquiry');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Project' | 'News'>('All');
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Authentication & Dashboard State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userSession, setUserSession] = useState<{ name: string; role: 'Officer' | 'Member' } | null>(null);

  useEffect(() => {
    const handleScrollToggle = () => {
      setShowScrollButton(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScrollToggle);
    return () => window.removeEventListener('scroll', handleScrollToggle);
  }, []);

  // Secure Local Authentication Matrix
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const normalizedUser = username.trim().toLowerCase();

    if (normalizedUser === 'officer' && password === 'rcmm2026') {
      setUserSession({ name: 'Pres. Rosemarie Valencia', role: 'Officer' });
      setShowLoginModal(false);
      clearAuthInputs();
    } else if (normalizedUser === 'member' && password === 'rotary3770') {
      setUserSession({ name: 'Rotarian Member', role: 'Member' });
      setShowLoginModal(false);
      clearAuthInputs();
    } else {
      setLoginError('Invalid credentials. Hint: Use officer/rcmm2026 or member/rotary3770');
    }
  };

  const clearAuthInputs = () => {
    setUsername('');
    setPassword('');
  };

  const filteredActivities = activityFilter === 'All' 
    ? clubActivities 
    : clubActivities.filter(item => item.type === activityFilter);

  return (
    <main id="top" className="min-h-screen bg-white text-gray-800 font-sans scroll-smooth relative">
      
      {/* 1. HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-sky-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#top" className="group cursor-pointer block text-left select-none">
            <span className="text-xl font-bold tracking-wide text-white group-hover:text-amber-400 transition">ROTARY CLUB OF</span>
            <span className="block text-sm font-semibold text-amber-500 group-hover:text-amber-300 tracking-wider transition">MEYCAUAYAN METRO</span>
          </a>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-amber-500 transition">Who We Are</a>
            <a href="#pillars" className="hover:text-amber-500 transition">Our Focus</a>
            <a href="#portfolio" className="hover:text-amber-500 transition">Projects & News</a>
            <a href="#contact" className="hover:text-amber-500 transition">Get Involved</a>
            {userSession && <a href="#dashboard" className="text-amber-400 font-bold hover:underline">Portal Dashboard</a>}
          </nav>
          
          <div className="flex items-center gap-4">
            {userSession ? (
              <div className="flex items-center gap-3">
                <span className="text-xs hidden lg:inline bg-sky-950 px-3 py-1.5 rounded-md text-gray-300 border border-white/10">
                  {userSession.name} ({userSession.role})
                </span>
                <button onClick={() => setUserSession(null)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full text-xs transition">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-sky-950 font-bold px-5 py-2 rounded-full text-sm transition">
                Portal Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MODAL WINDOW: PORTAL LOGIN AUTHENTICATOR */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-sky-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-8 relative">
            <button onClick={() => { setShowLoginModal(false); setLoginError(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-sky-950">RCMM Portal Login</h3>
              <p className="text-xs text-gray-500 mt-1">Access secure organizational data and metrics.</p>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username / Access Key</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-900" placeholder="officer or member" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Security Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-900" placeholder="••••••••" />
              </div>
              {loginError && <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded border border-red-100">{loginError}</p>}
              <button type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-2.5 rounded-lg text-sm transition shadow">
                Verify Credentials
              </button>
            </form>
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 leading-relaxed">
              <strong>Testing Credentials:</strong><br />
              • Officer Access: <code className="bg-amber-100 px-1 rounded text-xs font-bold">officer</code> / password: <code className="bg-amber-100 px-1 rounded text-xs font-bold">rcmm2026</code><br />
              • Member Access: <code className="bg-amber-100 px-1 rounded text-xs font-bold">member</code> / password: <code className="bg-amber-100 px-1 rounded text-xs font-bold">rotary3770</code>
            </div>
          </div>
        </div>
      )}

      {/* 2. CORE SECURE PORTAL DASHBOARD SECTION */}
      {userSession && (
        <section id="dashboard" className="bg-sky-950 text-white py-16 px-6 border-b border-sky-900 scroll-mt-16 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-white/10 pb-6 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">Internal Club Workspace</span>
                <h2 className="text-3xl font-bold mt-1">Welcome Back, {userSession.name}</h2>
              </div>
              <span className="bg-amber-500 text-sky-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                Clearance Level: {userSession.role}
              </span>
            </div>

            {/* UPSTREAM OFFICER ACCESS DATA VISUALIZATION GRID */}
            {userSession.role === 'Officer' ? (
              <div className="space-y-8">
                {/* Metrics Row */}
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Treasury Balance (General Fund)</span>
                    <h3 className="text-3xl font-black text-amber-500 mt-2">₱ 148,500.00</h3>
                    <p className="text-[10px] text-green-400 mt-1">● Audited & Balanced June 2026</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Enrolled Roster</span>
                    <h3 className="text-3xl font-black text-white mt-2">42 Active Members</h3>
                    <p className="text-[10px] text-amber-400 mt-1">+3 Inducted this quarter</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending Membership Intakes</span>
                    <h3 className="text-3xl font-black text-white mt-2">7 Applications</h3>
                    <p className="text-[10px] text-gray-400 mt-1">Awaiting interview scheduling</p>
                  </div>
                </div>

                {/* Management Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl text-gray-800 shadow-xl">
                    <h4 className="font-bold text-sky-950 border-b border-gray-100 pb-2 mb-3 text-sm uppercase tracking-wide">Administrative Officer Action Panel</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-100 text-xs">
                        <div>
                          <p className="font-bold text-gray-800">Review Form Intake Data</p>
                          <p className="text-[10px] text-gray-400">Syncs directly via serverless Netlify Forms</p>
                        </div>
                        <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">Form API Live</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-100 text-xs">
                        <div>
                          <p className="font-bold text-gray-800">Draft District 3770 Attendance Report</p>
                          <p className="text-[10px] text-gray-400">Monthly assembly reporting requirement</p>
                        </div>
                        <button className="bg-sky-900 text-white font-bold px-2.5 py-1 rounded text-[10px] hover:bg-sky-950">Open</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h4 className="font-bold text-amber-500 pb-2 mb-3 border-b border-white/10 text-sm uppercase tracking-wide">Recent Treasury Disbursements</h4>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between text-gray-300 py-1 border-b border-white/5"><span className="font-medium">Maternal Vitamins Batch A</span><span className="font-mono text-amber-400">- ₱ 12,450.00</span></div>
                      <div className="flex justify-between text-gray-300 py-1 border-b border-white/5"><span className="font-medium">Primary School Book Purchasing</span><span className="font-mono text-amber-400">- ₱ 8,900.00</span></div>
                      <div className="flex justify-between text-gray-300 py-1"><span className="font-medium">District Governor Assembly Catering</span><span className="font-mono text-amber-400">- ₱ 6,200.00</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MEMBER SECURITY CLEARANCE DISPLAY BLOCK */
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2">
                  <h4 className="font-bold text-amber-500 mb-4 text-sm uppercase tracking-wide">Internal Club Broadcasts & Memos</h4>
                  <div className="space-y-4 text-xs">
                    <div className="bg-white/5 p-4 rounded-lg border-l-4 border-amber-500">
                      <p className="font-bold text-white mb-0.5">Upcoming General Assembly Reminder</p>
                      <p className="text-gray-400 text-[10px] mb-2">Posted by Sec. Potestades</p>
                      <p className="text-gray-300 leading-relaxed">Our bi-weekly fellowship meeting is scheduled for next Thursday at 7:00 PM. We will finalize sub-allocations for the rainy-season watershed management drive.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border-l-4 border-sky-500">
                      <p className="font-bold text-white mb-0.5">Dues Settlement Notification</p>
                      <p className="text-gray-300 leading-relaxed">Quarterly membership dues can now be transferred via bank or GCash straight to the treasury desk accounts.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">Fellowship Calendar</h4>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 bg-sky-900/40 rounded border border-white/5">
                      <span className="text-amber-500 font-bold block text-[10px]">JUNE 18, 2026</span>
                      <p className="font-semibold text-gray-200">Regular Fellowship Meeting</p>
                    </div>
                    <div className="p-2.5 bg-sky-900/40 rounded border border-white/5">
                      <span className="text-amber-500 font-bold block text-[10px]">JULY 05, 2026</span>
                      <p className="font-semibold text-gray-200">School Book Supply Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. PARALLAX HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-fixed bg-cover bg-center text-white px-6" style={{ backgroundImage: `linear-gradient(rgba(1, 58, 99, 0.85), rgba(1, 42, 74, 0.9)), url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1920')` }}>
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10 py-16">
          <div>
            <span className="bg-sky-950 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">District 3770 • Service Above Self</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-4 mb-6 leading-tight">Making a Lasting <br/><span className="text-amber-500">Impact in Meycauayan</span></h1>
            <p className="text-lg text-gray-200 mb-8 max-w-xl">We are community leaders, neighbors, and problem solvers coming together to create positive, sustainable change across Bulacan through hands-on service.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#portfolio" className="bg-white text-sky-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-500 hover:text-sky-950 transition shadow-md text-center">Explore Initiatives</a>
              <a href="#about" className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition text-center">Learn More</a>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-2xl text-center md:text-left">
            <h3 className="text-xl font-bold text-amber-500 mb-2">Fellowship Through Service</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Every week, our members meet to orchestrate critical field actions. Scroll down to see our live historical impacts and explore ongoing projects.</p>
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section id="about" className="py-20 px-6 bg-white border-b border-gray-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Our Heritage</span>
              <h2 className="text-3xl font-bold text-sky-950 mt-2 mb-4">About Us & Rotary International</h2>
              <p className="text-gray-600 leading-relaxed mb-4">Rotary International is a global network of 1.4 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change.</p>
              <p className="text-gray-600 leading-relaxed">The **Rotary Club of Meycauayan Metro**, operating under **District 3770**, carries out this global mission locally. Our members pool professional expertise to champion civic development, health solutions, and youth literacy programs here in Meycauayan City, Bulacan.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-sky-900 mb-4">Core Club History & Vision</h3>
              <div className="border-l-4 border-amber-500 pl-4 space-y-4">
                <div>
                  <h4 className="font-bold text-sky-950 text-sm">The Rotary Motto</h4>
                  <p className="text-xs text-gray-500 mt-0.5">"Service Above Self" directs every humanitarian blueprint, local donation, and fellowship project we authorize.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sky-950 text-sm">Community Partners</h4>
                  <p className="text-xs text-gray-500 mt-0.5">We collaborate natively with local public schools, barangay health centers, and municipal bodies to pinpoint high-need civic operations.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-sky-950 text-center mb-8">Club Leadership & Officers</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Rot. Rosemarie P. Valencia", role: "Club President" },
                { name: "Club President Elect", role: "Vice President" },
                { name: "Club Executive Officer", role: "Secretary" },
                { name: "Club Financial Officer", role: "Treasurer" }
              ].map((officer, i) => (
                <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 text-center shadow-sm hover:shadow-md transition">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3 text-sky-900 font-bold text-lg">👤</div>
                  <h4 className="font-bold text-sky-950 text-sm">{officer.name}</h4>
                  <p className="text-xs text-amber-600 font-medium mt-1">{officer.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE FOCUS AREAS (PILLARS) */}
      <section id="pillars" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-sky-950">Areas of Service Focus</h2>
          <p className="text-gray-600 mt-3">How the Rotary Club of Meycauayan Metro channels resources to empower our communities.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-gray-100 p-8 rounded-xl bg-gray-50 hover:shadow-md transition">
            <div className="text-3xl mb-4">🩺</div>
            <h3 className="text-xl font-bold text-sky-900 mb-2">Maternal & Child Health</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Supplying diagnostic equipment, medical tools, and prenatal vitamins to local barangay health centers.</p>
          </div>
          <div className="border border-gray-100 p-8 rounded-xl bg-gray-50 hover:shadow-md transition">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-sky-900 mb-2">Supporting Education</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Organizing book drives, school supply distributions, and supporting literacy infrastructure for public schools.</p>
          </div>
          <div className="border border-gray-100 p-8 rounded-xl bg-gray-50 hover:shadow-md transition">
            <div className="text-3xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-sky-900 mb-2">Environmental Action</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Spearheading regional tree-planting programs and localized cleanup activities to preserve natural basins.</p>
          </div>
        </div>
      </section>

      {/* 6. SECONDARY PARALLAX SEPARATOR BANNER */}
      <section className="relative py-32 bg-fixed bg-cover bg-center text-center text-white px-6" style={{ backgroundImage: `linear-gradient(rgba(1, 42, 74, 0.8), rgba(1, 42, 74, 0.8)), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1920')` }}>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-amber-500">One Million Saplings, Clean Waters, Bright Minds</h2>
          <p className="text-lg text-gray-200">"We do not just build frameworks; we deliver immediate, transparent field resources where they matter most."</p>
        </div>
      </section>

      {/* 7. DYNAMIC ACTIVITY PORTFOLIO TRACKER */}
      <section id="portfolio" className="py-20 bg-gray-50 px-6 border-b border-gray-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-sky-950">Club Projects & News</h2>
              <p className="text-gray-600 mt-1">Real-time tracker of our active deployments and announcements.</p>
            </div>
            <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              {(['All', 'Project', 'News'] as const).map((filterOpt) => (
                <button key={filterOpt} onClick={() => setActivityFilter(filterOpt)} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activityFilter === filterOpt ? 'bg-sky-900 text-white' : 'text-gray-600 hover:text-sky-900'}`}>{filterOpt === 'All' ? 'View All' : `${filterOpt}s`}</button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full ${activity.type === 'Project' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-sky-50 text-sky-700 border border-sky-100'}`}>{activity.type}</span>
                    <span className="text-xs text-gray-400 font-medium">{activity.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-sky-900 mb-1">{activity.title}</h3>
                  <p className="text-xs font-semibold text-amber-600 mb-3">{activity.category}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Recorded Impact / Date</span>
                  <p className="text-sky-950 font-medium text-xs">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT US HUB */}
      <section id="contact" className="py-20 px-6 max-w-4xl mx-auto scroll-mt-16">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Connect With Us</span>
          <h2 className="text-3xl font-bold text-sky-950 mt-1">Get Involved Today</h2>
          <p className="text-gray-600 mt-2">Have a question? Ready to volunteer? Select an option below to submit your form directly to our team.</p>
          <div className="flex justify-center gap-2 mt-6 max-w-md mx-auto border-b border-gray-200">
            <button onClick={() => setActiveForm('inquiry')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${activeForm === 'inquiry' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>General Inquiry</button>
            <button onClick={() => setActiveForm('member')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${activeForm === 'member' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Be a Member</button>
            <button onClick={() => setActiveForm('donate')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${activeForm === 'donate' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Support/Donate</button>
          </div>
        </div>

        {activeForm === 'inquiry' && (
          <form name="general-inquiries" method="POST" data-netlify="true" className="space-y-5 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <input type="hidden" name="form-name" value="general-inquiries" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="juan@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message or Question</label>
              <textarea name="message" rows={4} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="How can our organization collaborate with the club?"></textarea>
            </div>
            <button type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 rounded-lg shadow transition text-sm">Submit General Inquiry</button>
          </form>
        )}

        {activeForm === 'member' && (
          <form name="membership-applications" method="POST" data-netlify="true" className="space-y-5 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <input type="hidden" name="form-name" value="membership-applications" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                <input type="tel" name="phone" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="+63 947 467 5516" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="juan@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profession / Occupation</label>
                <input type="text" name="occupation" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="Civil Engineer / Business Owner" />
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-sky-950 font-bold py-3 rounded-lg shadow transition text-sm">Submit Membership Request</button>
          </form>
        )}

        {activeForm === 'donate' && (
          <form name="donation-pledges" method="POST" data-netlify="true" className="space-y-5 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <input type="hidden" name="form-name" value="donation-pledges" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Donor Name / Organization</label>
                <input type="text" name="donor" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="Anonymous or Company Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Project Cause</label>
                <select name="cause" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900 bg-white">
                  <option value="maternal-health">Maternal & Child Health</option>
                  <option value="education">Supporting Education</option>
                  <option value="environment">Environmental Action</option>
                  <option value="general">General Community Fund</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pledge or Support Description</label>
              <textarea name="pledge_details" rows={3} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-900" placeholder="Detail your pledge here..."></textarea>
            </div>
            <button type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 rounded-lg shadow transition text-sm">Submit Donation Pledge</button>
          </form>
        )}
      </section>

      {/* 9. FOOTER SECTION */}
      <footer className="bg-sky-950 text-white py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg text-white">Rotary Club of Meycauayan Metro</h4>
            <p className="text-sm text-gray-400 mt-1">Rotary International District 3770 • Bulacan, Philippines</p>
          </div>
          <div className="text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved. Service Above Self.</div>
        </div>
      </footer>

      {/* 10. FLOATING SCROLL TO TOP BUTTON */}
      <a href="#top" className={`fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-sky-950 w-12 h-12 rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-300 transform font-bold text-xl select-none ${showScrollButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'}`} title="Scroll to Top">↑</a>

    </main>
  );
}