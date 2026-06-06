'use client';
import React, { useState, useEffect } from 'react';

// ==========================================
// INITIAL SIMULATED DATASETS (DATABASE SEEDS)
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
  // Global View Navigation Mode toggles ('public' | 'officers-tab')
  const [activeTab, setActiveTab] = useState<'public' | 'officers-tab'>('public');

  // Core Simulation Databases (CRUD Targets)
  const [users, setUsers] = useState(initialUsers);
  const [activities, setActivities] = useState(initialActivities);
  
  // Editable Layout Content States (Super Admin can change these text blocks/images)
  const [heroTitle, setHeroTitle] = useState("Making a Lasting Impact in Meycauayan");
  const [heroSub, setHeroSub] = useState("We are community leaders, neighbors, and problem solvers coming together to create positive, sustainable change across Bulacan through hands-on service.");
  const [heroBgUrl, setHeroBgUrl] = useState("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1920");

  // Interaction State UI controls
  const [activeForm, setActiveForm] = useState<'inquiry' | 'member' | 'donate'>('inquiry');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Project' | 'News'>('All');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Auth Inputs
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userSession, setUserSession] = useState<typeof initialUsers[0] | null>(null);

  // CRUD Form States
  const [editingUser, setEditingUser] = useState<typeof initialUsers[0] | null>(null);
  const [newUser, setNewUser] = useState({ name: '', role: 'Member', position: 'Active Member', username: '', email: '' });
  const [newActivity, setNewActivity] = useState({ type: 'Project', title: '', category: '', description: '', status: 'Ongoing', detail: '' });

  useEffect(() => {
    const handleScrollToggle = () => setShowScrollButton(window.scrollY > 400);
    window.addEventListener('scroll', handleScrollToggle);
    return () => window.removeEventListener('scroll', handleScrollToggle);
  }, []);

  // Secure Local Multi-Role Access Authenticator Matrix
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const targetUser = users.find(u => u.username === usernameInput.trim().toLowerCase());

    if (!targetUser) {
      setLoginError('User identification access key not found.');
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

  const clearAuthFields = () => { setUsernameInput(''); setPasswordInput(''); };

  // User Mutations (CRUD Updates)
  const saveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const createMemberRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      ...newUser,
      id: Date.now(),
      username: newUser.name.toLowerCase().replace(/\s+/g, '')
    };
    setUsers([...users, created]);
    setNewUser({ name: '', role: 'Member', position: 'Active Member', username: '', email: '' });
  };

  const deleteUserRecord = (id: number) => {
    if (confirm("Are you sure you want to terminate this profile authorization layer?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Content Mutations (CRUD Writing for Portfolio Content)
  const createActivityRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const created = { ...newActivity, id: Date.now() };
    setActivities([created, ...activities]);
    setNewActivity({ type: 'Project', title: '', category: '', description: '', status: 'Ongoing', detail: '' });
  };

  const deleteActivityRecord = (id: number) => {
    if (confirm("Delete this portfolio content index?")) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const filteredActivities = activityFilter === 'All' 
    ? activities 
    : activities.filter(item => item.type === activityFilter);

  const displayOfficers = users.filter(u => u.role === 'Officer' || u.role === 'Super Admin');

  return (
    <main id="top" className="min-h-screen bg-white text-gray-800 font-sans scroll-smooth relative">
      
      {/* 1. HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-sky-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setActiveTab('public')} className="group block text-left select-none bg-transparent border-none outline-none text-left">
            <span className="text-xl font-bold tracking-wide text-white group-hover:text-amber-400 transition block">ROTARY CLUB OF</span>
            <span className="block text-sm font-semibold text-amber-500 group-hover:text-amber-300 tracking-wider transition">MEYCAUAYAN METRO</span>
          </button>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <button onClick={() => setActiveTab('public')} className={`hover:text-amber-500 transition bg-transparent border-none outline-none cursor-pointer ${activeTab === 'public' ? 'text-amber-400 font-bold underline' : ''}`}>Home Framework</button>
            <button onClick={() => setActiveTab('officers-tab')} className={`hover:text-amber-500 transition bg-transparent border-none outline-none cursor-pointer ${activeTab === 'officers-tab' ? 'text-amber-400 font-bold underline' : ''}`}>Roster Officers</button>
            {activeTab === 'public' && (
              <>
                <a href="#about" className="hover:text-amber-500 transition">Who We Are</a>
                <a href="#pillars" className="hover:text-amber-500 transition">Our Focus</a>
                <a href="#portfolio" className="hover:text-amber-500 transition">Projects & News</a>
                <a href="#contact" className="hover:text-amber-500 transition">Get Involved</a>
              </>
            )}
            {userSession && <a href="#control-center" className="text-emerald-400 font-black hover:underline">CMS Panel</a>}
          </nav>
          
          <div className="flex items-center gap-4">
            {userSession ? (
              <div className="flex items-center gap-3">
                <span className="text-xs hidden lg:inline bg-sky-950 px-3 py-1.5 rounded-md text-gray-300 border border-white/10">
                  {userSession.name} ({userSession.role})
                </span>
                <button onClick={() => setUserSession(null)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full text-xs transition">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-sky-950 font-bold px-5 py-2 rounded-full text-sm transition">Portal Access</button>
            )}
          </div>
        </div>
      </header>

      {/* LOGIN SECURITY INTERCEPT MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-sky-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-8 relative text-gray-800">
            <button onClick={() => { setShowLoginModal(false); setLoginError(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-sky-950">RCMM Role Identity Verification</h3>
              <p className="text-xs text-gray-500 mt-1">Provide credentials matching your club clearance level.</p>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">User Authorization ID</label>
                <input type="text" required value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-900" placeholder="superadmin, officer1, or member1" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Clearance Password</label>
                <input type="password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-900" placeholder="••••••••" />
              </div>
              {loginError && <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded border border-red-100">{loginError}</p>}
              <button type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-2.5 rounded-lg text-sm transition shadow">Authorize Session</button>
            </form>
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[10px] text-amber-900 leading-relaxed space-y-1">
              <strong>Simulated Role Registry Master Keys:</strong><br />
              • <strong>Super Admin:</strong> <code className="bg-amber-100 px-1 font-bold">superadmin</code> / password: <code className="bg-amber-100 px-1 font-bold">super2026</code><br />
              • <strong>Officer Layer:</strong> <code className="bg-amber-100 px-1 font-bold">officer1</code> / password: <code className="bg-amber-100 px-1 font-bold">officer2026</code><br />
              • <strong>Member Layer:</strong> <code className="bg-amber-100 px-1 font-bold">member1</code> / password: <code className="bg-amber-100 px-1 font-bold">rotary3770</code>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ADMIN/OFFICER CMS WORKSPACE (CRUD CONTROLS)
          ========================================== */}
      {userSession && (
        <section id="control-center" className="bg-slate-900 text-white py-16 px-6 border-b-4 border-amber-500 scroll-mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-700 pb-4 mb-8">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Active System Control Matrix</span>
              <h2 className="text-3xl font-black">CMS Workspace Panel ({userSession.role})</h2>
            </div>

            {/* SUPER ADMIN MASTER CONTENT WRITER */}
            {userSession.role === 'Super Admin' && (
              <div className="bg-slate-800 border border-gray-700 p-6 rounded-xl mb-8 space-y-6">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">🛠️ Real-Time Layout Content Editor (Super Admin Only)</h3>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Modify Hero Title text</label>
                    <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full bg-slate-900 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-400 outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Parallax Background Image URL</label>
                    <input type="text" value={heroBgUrl} onChange={(e) => setHeroBgUrl(e.target.value)} className="w-full bg-slate-900 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-400 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 font-bold mb-1">Modify Hero Paragraph Body Context</label>
                    <textarea value={heroSub} onChange={(e) => setHeroSub(e.target.value)} rows={2} className="w-full bg-slate-900 text-white border border-gray-600 rounded px-3 py-2 focus:border-amber-400 outline-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* ROSTER DIRECTORY DATATABLE TRACKER */}
              <div className="bg-slate-800 border border-gray-700 p-6 rounded-xl lg:col-span-2 space-y-6">
                <h3 className="font-bold text-lg text-white border-b border-gray-700 pb-2">👥 Roster Database Index Management</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-gray-300">
                    <thead className="text-gray-400 uppercase bg-slate-900/50 text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Full Roster Name</th>
                        <th className="px-4 py-3">Security Role</th>
                        <th className="px-4 py-3">Designation</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition">
                          <td className="px-4 py-3 font-bold text-white">{u.name}<br/><span className="text-[10px] text-gray-500 font-mono">{u.email}</span></td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'Super Admin' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                              u.role === 'Officer' ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-slate-700 text-gray-300'
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{u.position}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            {(userSession.role === 'Super Admin' || userSession.id === u.id) ? (
                              <button onClick={() => setEditingUser(u)} className="text-amber-400 hover:underline font-bold bg-transparent border-none cursor-pointer">Edit</button>
                            ) : <span className="text-gray-600 text-[10px]">Locked</span>}

                            {userSession.role === 'Super Admin' && u.role !== 'Super Admin' && (
                              <button onClick={() => deleteUserRecord(u.id)} className="text-red-400 hover:underline font-bold bg-transparent border-none cursor-pointer">Delete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CRUD FORM LAYOUT DETACHMENT: USER MODIFICATION NODE */}
                {editingUser && (
                  <form onSubmit={saveUserEdit} className="bg-slate-900 p-4 rounded-lg border border-amber-500/30 grid sm:grid-cols-2 gap-4 text-xs text-gray-800">
                    <div className="sm:col-span-2 flex justify-between items-center text-white border-b border-gray-700 pb-1.5">
                      <span className="font-bold">Edit Profile Properties: {editingUser.name}</span>
                      <button type="button" onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer">Cancel</button>
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Full Name</label>
                      <input type="text" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="w-full p-2 rounded border border-gray-300" required />
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Email Address</label>
                      <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full p-2 rounded border border-gray-300" required />
                    </div>
                    {userSession.role === 'Super Admin' && (
                      <>
                        <div>
                          <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Access Authorization Level</label>
                          <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full p-2 rounded border border-gray-300 bg-white">
                            <option value="Member">Member</option>
                            <option value="Officer">Officer</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-400 uppercase font-bold text-[10px] mb-1">Official Club Assignment Designation</label>
                          <input type="text" value={editingUser.position} onChange={(e) => setEditingUser({...editingUser, position: e.target.value})} className="w-full p-2 rounded border border-gray-300" required />
                        </div>
                      </>
                    )}
                    <button type="submit" className="sm:col-span-2 bg-amber-500 text-sky-950 font-bold py-2 rounded text-xs hover:bg-amber-600 transition border-none cursor-pointer">Commit CRUD Update Parameters</button>
                  </form>
                )}

                {/* CRUD CREATE TRIGGER: SYSTEM MEMBER REGISTER INTAKE */}
                {userSession.role === 'Super Admin' ? (
                  <form onSubmit={createMemberRecord} className="bg-slate-900/60 p-5 rounded-xl border border-gray-700 space-y-4">
                    <h4 className="text-sm font-bold text-amber-500">➕ Super Admin Proxy Action: Enroll New Member / Officer</h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-800">
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Roster Name</label>
                        <input type="text" required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full p-2 rounded border border-gray-300" placeholder="Rot. John Doe" />
                      </div>
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Email Interface</label>
                        <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full p-2 rounded border border-gray-300" placeholder="john@rcmm.org" />
                      </div>
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">System Authorization Clearance</label>
                        <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full p-2 rounded border border-gray-300 bg-white">
                          <option value="Member">Member</option>
                          <option value="Officer">Officer</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Designation Title</label>
                        <input type="text" required value={newUser.position} onChange={(e) => setNewUser({...newUser, position: e.target.value})} className="w-full p-2 rounded border border-gray-300" placeholder="Active Member, Committee Chair, etc." />
                      </div>
                    </div>
                    <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded transition border-none cursor-pointer">Inject User Row</button>
                  </form>
                ) : (
                  <p className="text-xs text-gray-500 italic bg-slate-900 p-3 rounded text-center border border-gray-800">🔒 Roster addition tools are exclusively reserved for the Super Admin level.</p>
                )}
              </div>

              {/* CRUD CREATE PORTFOLIO GENERATOR NODE CONTAINER */}
              <div className="bg-slate-800 border border-gray-700 p-6 rounded-xl space-y-6">
                <h3 className="font-bold text-lg text-white border-b border-gray-700 pb-2">📢 Content Engine Operations</h3>
                
                {userSession.role === 'Super Admin' ? (
                  <form onSubmit={createActivityRecord} className="space-y-4 text-xs text-gray-800">
                    <h4 className="font-bold text-amber-500 text-xs">➕ Add New Project Portfolio or News Event</h4>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Content Record Entry Type</label>
                      <select value={newActivity.type} onChange={(e) => setNewActivity({...newActivity, type: e.target.value})} className="w-full p-2 rounded border border-gray-300 bg-white">
                        <option value="Project">Project Rollout</option>
                        <option value="News">News / Bulletin Announcement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Humanitarian Activity Title</label>
                      <input type="text" required value={newActivity.title} onChange={(e) => setNewActivity({...newActivity, title: e.target.value})} className="w-full p-2 rounded border border-gray-300" placeholder="E.g., Feeding Program 2026" />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Strategic Objective Category</label>
                      <input type="text" required value={newActivity.category} onChange={(e) => setNewActivity({...newActivity, category: e.target.value})} className="w-full p-2 rounded border border-gray-300" placeholder="E.g., Supporting Education" />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Public Summary Description Context</label>
                      <textarea required value={newActivity.description} onChange={(e) => setNewActivity({...newActivity, description: e.target.value})} rows={3} className="w-full p-2 rounded border border-gray-300" placeholder="Summarize field activities..." />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Metric Output / Date Tag</label>
                      <input type="text" required value={newActivity.detail} onChange={(e) => setNewActivity({...newActivity, detail: e.target.value})} className="w-full p-2 rounded border border-gray-300" placeholder="E.g., 300 kits distributed / June 2026" />
                    </div>
                    <button type="submit" className="w-full bg-amber-500 text-sky-950 font-black py-2.5 rounded hover:bg-amber-600 transition border-none cursor-pointer">Publish Live Node</button>
                  </form>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-slate-900 p-4 rounded border border-gray-700 text-center">🔒 Content publishing authorizations (Projects/News deployment tools) are explicitly locked under Super Admin permissions.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          TABBED INTERFACE ROUTER RENDER SECTIONS
          ========================================== */}
      
      {/* ----------------- TAB A: DEDICATED OFFICERS VIEW MODULE ----------------- */}
      {activeTab === 'officers-tab' ? (
        <section className="py-20 px-6 bg-gray-50 min-h-[70vh] animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Our Leadership</span>
              <h2 className="text-4xl font-extrabold text-sky-950 mt-1">Club Administration & Officers</h2>
              <p className="text-gray-600 mt-2">Duly certified administrative registry of executives presiding over Rotary International District 3770 local actions.</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayOfficers.map((officer) => (
                <div key={officer.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 p-6 text-center transition duration-300 transform hover:-translate-y-1">
                  <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-900 font-black text-2xl shadow-inner">⚙️</div>
                  <h3 className="text-lg font-black text-sky-950">{officer.name}</h3>
                  <p className="text-sm text-amber-600 font-bold mt-1 uppercase tracking-wider">{officer.position}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 font-mono select-all">{officer.email}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* ----------------- TAB B: PUBLIC MAIN SYSTEM HOME FRAMEWORK ----------------- */
        <>
          {/* PARALLAX HERO BACKGROUND */}
          <section 
            className="relative min-h-[85vh] flex items-center bg-fixed bg-cover bg-center text-white px-6 transition-all duration-300"
            style={{ backgroundImage: `linear-gradient(rgba(1, 58, 99, 0.85), rgba(1, 42, 74, 0.9)), url('${heroBgUrl}')` }}
          >
            <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10 py-16">
              <div>
                <span className="bg-sky-950 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">District 3770 • Service Above Self</span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-4 mb-6 leading-tight transition-all">{heroTitle}</h1>
                <p className="text-lg text-gray-200 mb-8 max-w-xl transition-all">{heroSub}</p>
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

          {/* ABOUT US SECTION */}
          <section id="about" className="py-20 px-6 bg-white border-b border-gray-100 scroll-mt-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Our Heritage</span>
                  <h2 className="text-3xl font-bold text-sky-950 mt-2 mb-4">About Us & Rotary International</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">Rotary International is a global network of 1.4 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves.</p>
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
            </div>
          </section>

          {/* CORE FOCUS AREAS (PILLARS) */}
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

          {/* SECONDARY PARALLAX SEPARATOR BANNER */}
          <section className="relative py-32 bg-fixed bg-cover bg-center text-center text-white px-6" style={{ backgroundImage: `linear-gradient(rgba(1, 42, 74, 0.8), rgba(1, 42, 74, 0.8)), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1920')` }}>
            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-amber-500">One Million Saplings, Clean Waters, Bright Minds</h2>
              <p className="text-lg text-gray-200">"We do not just build frameworks; we deliver immediate, transparent field resources where they matter most."</p>
            </div>
          </section>

          {/* DYNAMIC PORTFOLIO ACTIVITY TRACKER BOARD */}
          <section id="portfolio" className="py-20 bg-gray-50 px-6 border-b border-gray-100 scroll-mt-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-sky-950">Club Projects & News Feed</h2>
                  <p className="text-gray-600 mt-1">Real-time content matrix showing field outcomes (Dynamically alterable via Super Admin authorization panel).</p>
                </div>
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                  {(['All', 'Project', 'News'] as const).map((filterOpt) => (
                    <button key={filterOpt} onClick={() => setActivityFilter(filterOpt)} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border-none cursor-pointer ${activityFilter === filterOpt ? 'bg-sky-900 text-white' : 'text-gray-600 hover:text-sky-900 bg-transparent'}`}>{filterOpt === 'All' ? 'View All' : `${filterOpt}s`}</button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition relative group">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full ${activity.type === 'Project' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-sky-50 text-sky-700 border border-sky-100'}`}>{activity.type}</span>
                        <span className="text-xs text-gray-400 font-medium">{activity.status}</span>
                      </div>
                      <h3 className="text-lg font-bold text-sky-900 mb-1">{activity.title}</h3>
                      <p className="text-xs font-semibold text-amber-600 mb-3">{activity.category}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-0.5">Recorded Impact / Date</span>
                        <p className="text-sky-950 font-medium text-xs">{activity.detail}</p>
                      </div>
                      
                      {userSession?.role === 'Super Admin' && (
                        <button onClick={() => deleteActivityRecord(activity.id)} className="bg-red-50 text-red-600 border border-red-100 text-[10px] px-2 py-1 rounded font-bold hover:bg-red-100 transition cursor-pointer">Delete Node</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT HUB INTAKE FORMS */}
          <section id="contact" className="py-20 px-6 max-w-4xl mx-auto scroll-mt-16">
            <div className="text-center mb-12">
              <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Connect With Us</span>
              <h2 className="text-3xl font-bold text-sky-950 mt-1">Get Involved Today</h2>
              <p className="text-gray-600 mt-2">Have a question? Ready to volunteer? Select an option below to submit your form directly to our team.</p>
              <div className="flex justify-center gap-2 mt-6 max-w-md mx-auto border-b border-gray-200">
                <button onClick={() => setActiveForm('inquiry')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeForm === 'inquiry' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>General Inquiry</button>
                <button onClick={() => setActiveForm('member')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeForm === 'member' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Be a Member</button>
                <button onClick={() => setActiveForm('donate')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeForm === 'donate' ? 'border-sky-900 text-sky-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Support/Donate</button>
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
                <button type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 rounded-lg shadow transition text-sm border-none cursor-pointer">Submit General Inquiry</button>
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
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-sky-950 font-bold py-3 rounded-lg shadow transition text-sm border-none cursor-pointer">Submit Membership Request</button>
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
                <button type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 rounded-lg shadow transition text-sm border-none cursor-pointer">Submit Donation Pledge</button>
              </form>
            )}
          </section>
        </>
      )}

      {/* FOOTER BAR CONTAINER */}
      <footer className="bg-sky-950 text-white py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg text-white">Rotary Club of Meycauayan Metro</h4>
            <p className="text-sm text-gray-400 mt-1">Rotary International District 3770 • Bulacan, Philippines</p>
          </div>
          <div className="text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved. Service Above Self.</div>
        </div>
      </footer>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      <a href="#top" className={`fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-sky-950 w-12 h-12 rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-300 transform font-bold text-xl select-none ${showScrollButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'}`} title="Scroll to Top">↑</a>

    </main>
  );
}