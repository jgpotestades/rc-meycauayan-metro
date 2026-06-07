'use client';
import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// INITIAL PRODUCTION DATABASES (LIVE SOURCE)
// ==========================================
const initialUsers = [
  { id: 1, name: "Rot. Rosemarie P. Valencia", role: "Super Admin", position: "Club President", username: "superadmin", email: "president@rcmm.org" },
  { id: 2, name: "Rot. Janno Potestades", role: "Officer", position: "Secretary", username: "officer1", email: "secretary@rcmm.org" },
  { id: 3, name: "Rot. Anne Regine", role: "Member", position: "Active Member", username: "member1", email: "anne@rcmm.org" },
  { id: 4, name: "Rot. Lala Bonifacio", role: "Member", position: "Active Member", username: "member2", email: "lala@rcmm.org" }
];

const initialActivities = [
  { id: 1, type: 'Project', title: "Barangay Health Center Medical Supply Drive", category: "Maternal & Child Health", description: "Distributed diagnostic tools, blood pressure monitors, and essential prenatal vitamins to localized community health hubs.", status: "Completed", detail: "Assisted over 1,200 families across Meycauayan." },
  { id: 2, type: 'Project', title: "Meycauayan Youth Literacy Initiative", category: "Supporting Education", description: "Donating textbook sets and establishing reading centers in partnership with local public primary schools.", status: "Ongoing", detail: "Currently targeting 5 adopt-a-school facilities." },
  { id: 3, type: 'News', title: "District 3770 Governor's Official Visit", category: "Club Assembly", description: "The club hosted the district leadership assembly to review community service goals and evaluate upcoming environment programs.", status: "Completed", detail: "Held successfully on June 1, 2026." },
  { id: 4, type: 'Project', title: "Bulacan Watershed Tree Planting", category: "Environmental Action", description: "Reforestation efforts along crucial regional basins to prevent soil erosion and localized flash flooding.", status: "Completed", detail: "500 native saplings planted and monitored." }
];

export default function Home() {
  // Navigation & Menu Trackers
  const [activeForm, setActiveForm] = useState<'inquiry' | 'member' | 'donate'>('inquiry');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Project' | 'News'>('All');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Smart Sticky Scroll Direction Trackers
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Staging vs Production States
  const [prodUsers, setProdUsers] = useState(initialUsers);
  const [prodActivities, setProdActivities] = useState(initialActivities);
  const [prodHeroTitle, setProdHeroTitle] = useState("Making a Lasting Impact in Meycauayan");
  const [prodHeroSub, setProdHeroSub] = useState("We are community leaders, neighbors, and problem solvers coming together to create positive, sustainable change across Bulacan through hands-on service.");
  const [prodHeroBgUrl, setProdHeroBgUrl] = useState("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1920");

  const [stageUsers, setStageUsers] = useState(initialUsers);
  const [stageActivities, setStageActivities] = useState(initialActivities);
  const [stageHeroTitle, setStageHeroTitle] = useState("Making a Lasting Impact in Meycauayan");
  const [stageHeroSub, setStageHeroSub] = useState("We are community leaders, neighbors, and problem solvers coming together to create positive, sustainable change across Bulacan through hands-on service.");
  const [stageHeroBgUrl, setStageHeroBgUrl] = useState("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1920");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auth States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userSession, setUserSession] = useState<typeof initialUsers[0] | null>(null);

  // Local CRUD State
  const [editingUser, setEditingUser] = useState<typeof initialUsers[0] | null>(null);
  const [newUser, setNewUser] = useState({ name: '', role: 'Member', position: 'Active Member', username: '', email: '' });
  const [newActivity, setNewActivity] = useState({ type: 'Project', title: '', category: '', description: '', status: 'Ongoing', detail: '' });

  // Combined Window Scroll Listener Matrix
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 1. Manage Back-to-Top floating button threshold
      setShowScrollButton(currentScrollY > 400);

      // 2. Evaluate Scroll Direction for Smart Sticky Header
      if (currentScrollY < 50) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling Down - hide navbar unless mobile menu drawer is open
        if (!mobileMenuOpen) setNavVisible(false);
      } else {
        // Scrolling Up - show navbar instantly
        setNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const clearAuthFields = () => { setUsernameInput(''); setPasswordInput(''); };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const targetUser = stageUsers.find(u => u.username === usernameInput.trim().toLowerCase());

    if (!targetUser) {
      setLoginError('Contact your admin to give him/her access to the portal.');
      return;
    }

    if (targetUser.role === 'Super Admin' && passwordInput === 'super2026') {
      setUserSession(targetUser);
      setShowLoginModal(false);
      clearAuthFields();
    } else if (targetUser.role === 'Officer' && passwordInput === 'officer2026') {
      setUserSession(targetUser);
      setShowLoginModal(false);
      clearAuthFields();
    } else if (targetUser.role === 'Member' && passwordInput === 'rotary3770') {
      setUserSession(targetUser);
      setShowLoginModal(false);
      clearAuthFields();
    } else {
      setLoginError('Security clearance password verification failed.');
    }
  };

  // CRUD Sandbox Mutations
  const saveUserEditToStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setStageUsers(stageUsers.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    setHasUnsavedChanges(true);
  };

  const createMemberInStage = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      ...newUser,
      id: Date.now(),
      username: newUser.name.toLowerCase().replace(/\s+/g, '')
    };
    setStageUsers([...stageUsers, created]);
    setNewUser({ name: '', role: 'Member', position: 'Active Member', username: '', email: '' });
    setHasUnsavedChanges(true);
  };

  const deleteUserFromStage = (id: number) => {
    if (confirm("Remove user from current staging repository?")) {
      setStageUsers(stageUsers.filter(u => u.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const createActivityInStage = (e: React.FormEvent) => {
    e.preventDefault();
    const created = { ...newActivity, id: Date.now() };
    setStageActivities([created, ...stageActivities]);
    setNewActivity({ type: 'Project', title: '', category: '', description: '', status: 'Ongoing', detail: '' });
    setHasUnsavedChanges(true);
  };

  const deleteActivityFromStage = (id: number) => {
    if (confirm("Remove item from current staging repository?")) {
      setStageActivities(stageActivities.filter(a => a.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const handleDeployToProduction = () => {
    if (confirm("Push all staged sandbox data live to public view channels?")) {
      setProdUsers([...stageUsers]);
      setProdActivities([...stageActivities]);
      setProdHeroTitle(stageHeroTitle);
      setProdHeroSub(stageHeroSub);
      setProdHeroBgUrl(stageHeroBgUrl);
      setHasUnsavedChanges(false);
      alert("Deployment successful!");
    }
  };

  const filteredProdActivities = activityFilter === 'All' 
    ? prodActivities 
    : prodActivities.filter(item => item.type === activityFilter);

  const displayProdOfficers = prodUsers.filter(u => u.role === 'Officer' || u.role === 'Super Admin');

  return (
    <main id="top" className="min-h-screen bg-white text-gray-800 font-sans scroll-smooth relative overflow-x-hidden">
      
      {/* 1. SMART STICKY NAVIGATION BAR */}
      <header className={`sticky top-0 z-50 bg-sky-900 text-white shadow-lg border-b border-white/5 transition-transform duration-300 transform ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <a href="#top" onClick={handleLinkClick} className="group block bg-transparent border-none outline-none cursor-pointer text-left no-underline">
            <span className="text-lg sm:text-xl font-bold tracking-wide text-white group-hover:text-amber-400 transition block">ROTARY CLUB OF</span>
            <span className="block text-xs sm:text-sm font-semibold text-amber-500 group-hover:text-amber-300 tracking-wider transition">MEYCAUAYAN METRO</span>
          </a>
          
          {/* Desktop Navbar Menu */}
          <nav className="hidden md:flex gap-5 lg:gap-7 text-xs uppercase tracking-wider font-bold items-center">
            <a href="#top" className="hover:text-amber-400 transition text-amber-400">Home</a>
            <a href="#about" className="hover:text-amber-400 transition">Who We Are</a>
            <a href="#officers" className="hover:text-amber-400 transition">Roster Officers</a>
            <a href="#pillars" className="hover:text-amber-400 transition">Our Focus</a>
            <a href="#portfolio" className="hover:text-amber-400 transition">Projects & News</a>
            <a href="#contact" className="hover:text-amber-400 transition">Get Involved</a>
            {userSession && <a href="#control-center" className="text-emerald-400 font-black hover:underline normal-case">CMS Panel</a>}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {userSession ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-sky-950 px-3 py-1.5 rounded-md text-gray-300 border border-white/10">{userSession.role}</span>
                <button suppressHydrationWarning onClick={() => { setUserSession(null); setMobileMenuOpen(false); }} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full text-xs transition border-none cursor-pointer">Logout</button>
              </div>
            ) : (
              <button suppressHydrationWarning onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-sky-950 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-wider transition cursor-pointer">Portal Access</button>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white hover:text-amber-400 font-bold focus:outline-none text-2xl bg-transparent border-none cursor-pointer">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-sky-900 border-t border-sky-800 p-4 space-y-3 flex flex-col text-xs font-bold tracking-wider uppercase text-gray-200 animate-fadeIn shadow-inner">
            <a href="#top" onClick={handleLinkClick} className="hover:text-amber-400 py-1">Home</a>
            <a href="#about" onClick={handleLinkClick} className="hover:text-amber-400 py-1">Who We Are</a>
            <a href="#officers" onClick={handleLinkClick} className="hover:text-amber-400 py-1">Roster Officers</a>
            <a href="#pillars" onClick={handleLinkClick} className="hover:text-amber-400 py-1">Our Focus</a>
            <a href="#portfolio" onClick={handleLinkClick} className="hover:text-amber-400 py-1">Projects & News</a>
            <a href="#contact" onClick={handleLinkClick} className="hover:text-amber-400 py-1">Get Involved</a>
            {userSession && <a href="#control-center" onClick={handleLinkClick} className="text-emerald-400 py-1 font-bold border-t border-sky-800/40 normal-case">CMS Panel Workspace</a>}
            <div className="pt-2 border-t border-sky-800">
              {userSession ? (
                <button suppressHydrationWarning onClick={() => { setUserSession(null); setMobileMenuOpen(false); }} className="w-full bg-red-600 text-white text-center font-bold py-2.5 rounded-lg border-none text-xs tracking-widest">Logout</button>
              ) : (
                <button suppressHydrationWarning onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full border border-amber-500 text-amber-500 text-center font-bold py-2.5 rounded-lg bg-transparent text-xs tracking-widest">Portal Access Login</button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SECURE PORTAL ACCESS LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-sky-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 sm:p-8 relative text-gray-800">
            <button onClick={() => { setShowLoginModal(false); setLoginError(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg bg-transparent border-none cursor-pointer">✕</button>
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-sky-950">RCMM Role Identity Verification</h3>
              <p className="text-xs text-gray-500 mt-1">Provide credentials matching your club clearance level.</p>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">User Authorization ID</label>
                <input suppressHydrationWarning type="text" required value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-900" placeholder="Username" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Clearance Password</label>
                <input suppressHydrationWarning type="password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-900" placeholder="••••••••" />
              </div>
              {loginError && <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded border border-red-200 leading-relaxed">⚠️ {loginError}</p>}
              <button suppressHydrationWarning type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-2.5 rounded-lg text-sm transition shadow border-none cursor-pointer">Authorize Session</button>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================
          ADMINISTRATOR CONTROL MATRIX (100% RESPONSIVE STAGING CMS)
          ============================================================= */}
      {userSession && (
        <section id="control-center" className="bg-slate-900 text-white py-12 px-4 sm:px-6 border-b-4 border-amber-500 scroll-mt-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-slate-950 rounded-xl p-4 sm:p-6 border border-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-inner">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse block"></span>Staging Sandbox Working Mode</h3>
                <p className="text-xs text-gray-400 mt-1">All changes made below are saved securely in staging. They will NOT go live to public users until you deploy.</p>
              </div>
              <div>
                {hasUnsavedChanges ? (
                  <button suppressHydrationWarning onClick={handleDeployToProduction} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-sky-950 font-black px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase shadow-md transition border-none cursor-pointer">🚀 Publish to Live Production</button>
                ) : (
                  <span className="text-xs bg-slate-800 border border-gray-700 text-gray-400 font-semibold px-4 py-2 rounded-lg block text-center">✓ Production Synced & Fresh</span>
                )}
              </div>
            </div>

            {userSession.role === 'Super Admin' && (
              <div className="bg-slate-800 border border-gray-700 p-4 sm:p-6 rounded-xl space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-amber-400">🛠️ Real-Time Layout Content Editor (Super Admin Sandbox)</h3>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Staging Hero Title Text</label>
                    <input suppressHydrationWarning type="text" value={stageHeroTitle} onChange={(e) => { setStageHeroTitle(e.target.value); setHasUnsavedChanges(true); }} className="w-full bg-slate-900 text-white border border-gray-600 rounded px-3 py-2.5 focus:border-amber-400 outline-none text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Staging Hero Background URL</label>
                    <input suppressHydrationWarning type="text" value={stageHeroBgUrl} onChange={(e) => { setStageHeroBgUrl(e.target.value); setHasUnsavedChanges(true); }} className="w-full bg-slate-900 text-white border border-gray-600 rounded px-3 py-2.5 focus:border-amber-400 outline-none text-xs" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 font-bold mb-1">Staging Hero Paragraph Description Block</label>
                    <textarea suppressHydrationWarning value={stageHeroSub} onChange={(e) => { setStageHeroSub(e.target.value); setHasUnsavedChanges(true); }} rows={2} className="w-full bg-slate-900 text-white border border-gray-600 rounded px-3 py-2.5 focus:border-amber-400 outline-none text-xs" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="bg-slate-800 border border-gray-700 p-4 sm:p-6 rounded-xl lg:col-span-2 space-y-6">
                <h3 className="font-bold text-base sm:text-lg text-white border-b border-gray-700 pb-2">👥 Roster Database Sandbox Registry</h3>
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-xs text-left text-gray-300 block md:table">
                    <thead className="text-gray-400 uppercase bg-slate-900/50 text-[10px] hidden md:table-header-group">
                      <tr>
                        <th className="px-4 py-3">Full Roster Name</th>
                        <th className="px-4 py-3">Security Role</th>
                        <th className="px-4 py-3">Designation</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50 block md:table-row-group">
                      {stageUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition flex flex-col md:table-row py-3 px-2 md:p-0 gap-1.5 md:gap-0 border-b border-gray-700/40 md:border-none">
                          <td className="px-4 md:py-3 font-bold text-white block md:table-cell">
                            <span className="md:hidden text-gray-500 font-normal block uppercase text-[9px] tracking-wider">Name</span>
                            {u.name} <span className="text-[10px] text-gray-500 font-mono block md:inline md:ml-1">({u.email})</span>
                          </td>
                          <td className="px-4 md:py-3 block md:table-cell">
                            <span className="md:hidden text-gray-500 font-normal block uppercase text-[9px] tracking-wider mb-0.5">Role Authorization</span>
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${u.role === 'Super Admin' ? 'bg-red-900/50 text-red-300 border border-red-700' : u.role === 'Officer' ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-slate-700 text-gray-300'}`}>{u.role}</span>
                          </td>
                          <td className="px-4 md:py-3 text-gray-400 block md:table-cell">
                            <span className="md:hidden text-gray-500 font-normal block uppercase text-[9px] tracking-wider">Designation</span>
                            {u.position}
                          </td>
                          <td className="px-4 md:py-3 text-left md:text-right space-x-3 block md:table-cell mt-1 md:mt-0">
                            <span className="md:hidden text-gray-500 font-normal block uppercase text-[9px] tracking-wider mb-1">Actions</span>
                            {(userSession.role === 'Super Admin' || userSession.id === u.id) ? (
                              <button suppressHydrationWarning onClick={() => setEditingUser(u)} className="text-amber-400 hover:underline font-bold bg-transparent border-none cursor-pointer text-xs">Edit</button>
                            ) : <span className="text-gray-600 text-[10px]">Locked</span>}
                            {userSession.role === 'Super Admin' && u.role !== 'Super Admin' && (
                              <button suppressHydrationWarning onClick={() => deleteUserFromStage(u.id)} className="text-red-400 hover:underline font-bold bg-transparent border-none cursor-pointer text-xs">Delete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editingUser && (
                  <form onSubmit={saveUserEditToStage} className="bg-slate-900 p-4 rounded-lg border border-amber-500/30 grid sm:grid-cols-2 gap-4 text-xs text-gray-800">
                    <div className="sm:col-span-2 flex justify-between items-center text-white border-b border-gray-700 pb-1.5">
                      <span className="font-bold">Edit Staging User Properties</span>
                      <button suppressHydrationWarning type="button" onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer">✕ Cancel</button>
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Full Name</label>
                      <input suppressHydrationWarning type="text" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="w-full p-2 rounded border border-gray-300 focus:outline-none text-xs" required />
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Email Interface</label>
                      <input suppressHydrationWarning type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full p-2 rounded border border-gray-300 focus:outline-none text-xs" required />
                    </div>
                    {userSession.role === 'Super Admin' && (
                      <>
                        <div>
                          <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Authorization Level</label>
                          <select suppressHydrationWarning value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full p-2 rounded border border-gray-300 bg-white focus:outline-none text-xs">
                            <option value="Member">Member</option>
                            <option value="Officer">Officer</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Club Assignment Designation</label>
                          <input suppressHydrationWarning type="text" value={editingUser.position} onChange={(e) => setEditingUser({...editingUser, position: e.target.value})} className="w-full p-2 rounded border border-gray-300 focus:outline-none text-xs" required />
                        </div>
                      </>
                    )}
                    <button suppressHydrationWarning type="submit" className="sm:col-span-2 bg-amber-500 text-sky-950 font-bold py-2.5 rounded text-xs hover:bg-amber-600 transition border-none cursor-pointer">Save to Staging Cache</button>
                  </form>
                )}

                {userSession.role === 'Super Admin' ? (
                  <form onSubmit={createMemberInStage} className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-gray-700 space-y-4">
                    <h4 className="text-xs sm:text-sm font-bold text-amber-500">➕ Super Admin Proxy Action: Enroll New Member / Officer</h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-800">
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Full Name</label>
                        <input suppressHydrationWarning type="text" name="name" required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full p-2 rounded border border-gray-300 text-xs focus:outline-none" placeholder="Rot. John Doe" />
                      </div>
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Email Interface</label>
                        <input suppressHydrationWarning type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full p-2 rounded border border-gray-300 text-xs focus:outline-none" placeholder="john@rcmm.org" />
                      </div>
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">System Authorization Clearance</label>
                        <select suppressHydrationWarning value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full p-2 rounded border border-gray-300 bg-white text-xs focus:outline-none">
                          <option value="Member">Member</option>
                          <option value="Officer">Officer</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Designation Title</label>
                        <input suppressHydrationWarning type="text" required value={newUser.position} onChange={(e) => setNewUser({...newUser, position: e.target.value})} className="w-full p-2 rounded border border-gray-300 text-xs focus:outline-none" placeholder="Active Member" />
                      </div>
                    </div>
                    <button suppressHydrationWarning type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded transition border-none cursor-pointer">Stage Account Creation</button>
                  </form>
                ) : (
                  <p className="text-xs text-gray-500 italic bg-slate-900 p-3 rounded text-center border border-gray-800">🔒 Roster additions are exclusively reserved for the Super Admin level.</p>
                )}
              </div>

              <div className="bg-slate-800 border border-gray-700 p-4 sm:p-6 rounded-xl space-y-6">
                <h3 className="font-bold text-base sm:text-lg text-white border-b border-gray-700 pb-2">📢 Content Engine Operations</h3>
                {userSession.role === 'Super Admin' ? (
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs text-gray-800">
                    <h4 className="font-bold text-amber-500 text-xs">➕ Add New Project Portfolio or News Event</h4>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Content Record Entry Type</label>
                      <select suppressHydrationWarning value={newActivity.type} onChange={(e) => setNewActivity({...newActivity, type: e.target.value})} className="w-full p-2 rounded border border-gray-300 bg-white focus:outline-none text-xs">
                        <option value="Project">Project Rollout</option>
                        <option value="News">News / Bulletin Announcement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Humanitarian Activity Title</label>
                      <input suppressHydrationWarning type="text" required value={newActivity.title} onChange={(e) => setNewActivity({...newActivity, title: e.target.value})} className="w-full p-2 rounded border border-gray-300 text-xs focus:outline-none" placeholder="Feeding Program 2026" />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Strategic Objective Category</label>
                      <input suppressHydrationWarning type="text" required value={newActivity.category} onChange={(e) => setNewActivity({...newActivity, category: e.target.value})} className="w-full p-2 rounded border border-gray-300 text-xs focus:outline-none" placeholder="Supporting Education" />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Public Summary Description Context</label>
                      <textarea suppressHydrationWarning required value={newActivity.description} onChange={(e) => setNewActivity({...newActivity, description: e.target.value})} rows={3} className="w-full p-2 rounded border border-gray-300 text-xs focus:outline-none" placeholder="Summarize field activities..." />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Metric Output / Date Tag</label>
                      <input suppressHydrationWarning type="text" required value={newActivity.detail} onChange={(e) => setNewActivity({...newActivity, detail: e.target.value})} className="w-full p-2 rounded border border-gray-300 text-xs focus:outline-none" placeholder="300 kits distributed" />
                    </div>
                    <button suppressHydrationWarning type="button" onClick={createActivityInStage} className="w-full bg-amber-500 text-sky-950 font-black py-2.5 rounded hover:bg-amber-600 transition border-none cursor-pointer text-xs">Stage Content Component</button>
                  </form>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-slate-900 p-4 rounded border border-gray-700 text-center">🔒 Content publishing configurations are locked under Super Admin clearances.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =============================================================
          100% RESPONSIVE DYNAMIC SINGLE-PAGE PUBLIC LAYOUT TIMELINE
          ============================================================= */}
      
      {/* 2. DYNAMIC HERO BRAND SHOWCASE */}
      <section 
        className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center bg-fixed bg-cover bg-center text-white px-4 sm:px-6"
        style={{ backgroundImage: `linear-gradient(rgba(1, 58, 99, 0.85), rgba(1, 42, 74, 0.9)), url('${prodHeroBgUrl}')` }}
      >
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10 py-12 sm:py-16">
          <div className="text-center md:text-left">
            <span className="bg-sky-950 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">District 3770 • Service Above Self</span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-4 mb-6 leading-tight">{prodHeroTitle}</h1>
            <p className="text-sm sm:text-lg text-gray-200 mb-8 max-w-xl mx-auto md:mx-0">{prodHeroSub}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start max-w-md mx-auto md:max-w-none">
              <a href="#portfolio" className="bg-white text-sky-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-500 hover:text-sky-950 transition shadow-md text-center text-sm">Explore Initiatives</a>
              <a href="#about" className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition text-center text-sm">Learn More</a>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl text-center md:text-left hidden sm:block">
            <h3 className="text-lg sm:text-xl font-bold text-amber-500 mb-2">Fellowship Through Service</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Every week, our members meet to orchestrate critical field actions. Scroll down to see our live historical impacts and explore ongoing projects.</p>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-b border-gray-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span className="text-amber-500 font-bold uppercase tracking-wider text-xs block">Our Heritage</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-sky-950 mt-2 mb-4">About Us & Rotary International</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">Rotary International is a global network of 1.4 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves.</p>
              <p className="text-sm text-gray-600 leading-relaxed">The **Rotary Club of Meycauayan Metro**, operating under **District 3770**, carries out this global mission locally. Our members pool professional expertise to champion civic development, health solutions, and youth literacy programs here in Meycauayan City, Bulacan.</p>
            </div>
            
            <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-4">Core Club History & Vision</h3>
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
        </div>
      </section>

      {/* 4. DEDICATED ROSTER OFFICERS SHOWCASE */}
      <section id="officers" className="py-16 px-4 sm:px-6 bg-gray-50 border-b border-gray-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-500 font-bold uppercase tracking-wider text-xs block">Club Leadership</span>
            <h2 className="text-3xl font-extrabold text-sky-950 mt-1">Club Administration & Officers</h2>
            <p className="text-sm text-gray-600 mt-2">Duly certified administrative registry of executives presiding over local operational developments.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProdOfficers.map((officer) => (
              <div key={officer.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-900 font-black text-xl shadow-inner">⚙️</div>
                <h3 className="text-base font-black text-sky-950">{officer.name}</h3>
                <p className="text-xs text-amber-600 font-bold mt-1 uppercase tracking-wider">{officer.position}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 font-mono overflow-hidden text-ellipsis text-center select-all">{officer.email}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STRATEGIC OBJECTIVE FOCUS PILLARS */}
      <section id="pillars" className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-sky-950">Areas of Service Focus</h2>
          <p className="text-sm text-gray-600 mt-3">How the Rotary Club of Meycauayan Metro channels resources to empower our communities.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <div className="border border-gray-100 p-6 sm:p-8 rounded-xl bg-gray-50 hover:shadow-md transition">
            <div className="text-2xl sm:text-3xl mb-4">🩺</div>
            <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">Maternal & Child Health</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Supplying diagnostic equipment, medical tools, and prenatal vitamins to local barangay health centers.</p>
          </div>
          <div className="border border-gray-100 p-6 sm:p-8 rounded-xl bg-gray-50 hover:shadow-md transition">
            <div className="text-2xl sm:text-3xl mb-4">📚</div>
            <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">Supporting Education</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Organizing book drives, school supply distributions, and supporting literacy infrastructure for public schools.</p>
          </div>
          <div className="border border-gray-100 p-6 sm:p-8 rounded-xl bg-gray-50 hover:shadow-md transition">
            <div className="text-2xl sm:text-3xl mb-4">🌱</div>
            <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">Environmental Action</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Spearheading regional tree-planting programs and localized cleanup activities to preserve natural basins.</p>
          </div>
        </div>
      </section>

      {/* 6. PARALLAX SEPARATOR BANNER */}
      <section className="relative py-24 sm:py-32 bg-fixed bg-cover bg-center text-center text-white px-4 sm:px-6" style={{ backgroundImage: `linear-gradient(rgba(1, 42, 74, 0.8), rgba(1, 42, 74, 0.8)), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1920')` }}>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 text-amber-500">One Million Saplings, Clean Waters, Bright Minds</h2>
          <p className="text-sm sm:text-base text-gray-200">"We do not just build frameworks; we deliver immediate, transparent field resources where they matter most."</p>
        </div>
      </section>

      {/* 7. DYNAMIC CONTENT PORTFOLIO HUB */}
      <section id="portfolio" className="py-16 sm:py-20 bg-gray-50 px-4 sm:px-6 border-b border-gray-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-sky-950">Club Projects & News Feed</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Real-time content matrix showing field outcomes (Protected by staging deployment approvals).</p>
            </div>
            <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm w-full md:w-auto overflow-x-auto">
              {(['All', 'Project', 'News'] as const).map((filterOpt) => (
                <button suppressHydrationWarning key={filterOpt} onClick={() => setActivityFilter(filterOpt)} className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-bold transition-all border-none cursor-pointer text-center ${activityFilter === filterOpt ? 'bg-sky-900 text-white' : 'text-gray-600 hover:text-sky-900 bg-transparent'}`}>{filterOpt === 'All' ? 'View All' : `${filterOpt}`}</button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProdActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition relative group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full ${activity.type === 'Project' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-sky-50 text-sky-700 border border-sky-100'}`}>{activity.type}</span>
                    <span className="text-xs text-gray-400 font-medium">{activity.status}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-sky-900 mb-1">{activity.title}</h3>
                  <p className="text-xs font-semibold text-amber-600 mb-3">{activity.category}</p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{activity.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Recorded Impact / Date</span>
                    <p className="text-sky-950 font-medium text-xs">{activity.detail}</p>
                  </div>
                  {userSession?.role === 'Super Admin' && (
                    <button suppressHydrationWarning onClick={() => deleteActivityFromStage(activity.id)} className="bg-red-50 text-red-600 border border-red-100 text-[10px] px-2 py-1 rounded font-bold hover:bg-red-100 transition cursor-pointer">Delete Stage Node</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT US HUB (Integrated Netlify Forms) */}
      <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-16">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-amber-500 font-bold uppercase tracking-wider text-xs block">Connect With Us</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-sky-950 mt-1">Get Involved Today</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">Select an option below to submit your secure data vector.</p>
          
          <div className="flex gap-1 mt-6 max-w-md mx-auto border-b border-gray-200">
            <button suppressHydrationWarning onClick={() => setActiveForm('inquiry')} className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeForm === 'inquiry' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Inquiry</button>
            <button suppressHydrationWarning onClick={() => setActiveForm('member')} className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeForm === 'member' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Join Us</button>
            <button suppressHydrationWarning onClick={() => setActiveForm('donate')} className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeForm === 'donate' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Donate</button>
          </div>
        </div>

        {activeForm === 'inquiry' && (
          <form name="general-inquiries" method="POST" data-netlify="true" className="space-y-4 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm text-xs sm:text-sm">
            <input type="hidden" name="form-name" value="general-inquiries" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input suppressHydrationWarning type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input suppressHydrationWarning type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="juan@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message or Question</label>
              <textarea name="message" rows={4} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="How can our organization collaborate with the club?"></textarea>
            </div>
            <button suppressHydrationWarning type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 rounded-lg shadow transition border-none cursor-pointer text-xs">Submit General Inquiry</button>
          </form>
        )}

        {activeForm === 'member' && (
          <form name="membership-applications" method="POST" data-netlify="true" className="space-y-4 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm text-xs sm:text-sm">
            <input type="hidden" name="form-name" value="membership-applications" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input suppressHydrationWarning type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                <input suppressHydrationWarning type="tel" name="phone" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="+63 947 467 5516" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input suppressHydrationWarning type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="juan@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profession / Occupation</label>
                <input suppressHydrationWarning type="text" name="occupation" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="Business Owner" />
              </div>
            </div>
            <button suppressHydrationWarning type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-sky-950 font-bold py-3 rounded-lg shadow transition border-none cursor-pointer text-xs">Submit Membership Request</button>
          </form>
        )}

        {activeForm === 'donate' && (
          <form name="donation-pledges" method="POST" data-netlify="true" className="space-y-4 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm text-xs sm:text-sm">
            <input type="hidden" name="form-name" value="donation-pledges" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Donor Name / Organization</label>
                <input suppressHydrationWarning type="text" name="donor" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="Anonymous" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Project Cause</label>
                <select suppressHydrationWarning name="cause" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900 bg-white">
                  <option value="maternal-health">Maternal & Child Health</option>
                  <option value="education">Supporting Education</option>
                  <option value="environment">Environmental Action</option>
                  <option value="general">General Community Fund</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pledge or Support Description</label>
              <textarea name="pledge_details" rows={3} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-sky-900" placeholder="Detail your pledge here..."></textarea>
            </div>
            <button suppressHydrationWarning type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 rounded-lg shadow transition border-none cursor-pointer text-xs">Submit Donation Pledge</button>
          </form>
        )}
      </section>

      {/* 9. FOOTER SECTION */}
      <footer className="bg-sky-950 text-white py-12 px-6 border-t border-white/10 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h4 className="font-bold text-base text-white">Rotary Club of Meycauayan Metro</h4>
            <p className="text-xs text-gray-400 mt-1">Rotary International District 3770 • Bulacan, Philippines</p>
          </div>
          <div className="text-gray-400">© {new Date().getFullYear()} All Rights Reserved. Service Above Self.</div>
        </div>
      </footer>

      {/* 10. FLOATING SCROLL TO TOP BUTTON */}
      <a href="#top" className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-amber-500 hover:bg-amber-600 text-sky-950 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-300 transform font-bold text-lg sm:text-xl select-none ${showScrollButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'}`} title="Scroll to Top">↑</a>

    </main>
  );
}