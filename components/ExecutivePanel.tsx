'use client';
import React, { useState, useRef } from 'react';

// Define strict interfaces for our expanded system
interface RotaryUser {
  id: number;
  name: string;
  lastName?: string;
  suffix?: string;
  role: 'Member' | 'Director' | 'Officer';
  position: string;
  isOfficer: boolean;
  isDirector: boolean;
  image: string;
  birthday: string;
  username: string;
  email?: string;
  phone?: string;
  occupation?: string;
  address?: string;
  directorPosition?: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface Activity {
  id: number;
  title: string;
  type: 'Project' | 'News';
  category: string;
  description: string;
  status: 'Ongoing' | 'Completed';
  detail: string;
  galleryImages: string[];
  likes: string[]; // usernames of users who liked
  comments: Comment[];
  rsvp?: { [username: string]: 'Yes' | 'Maybe' | 'No' }; // RSVP tracking
}

interface Sponsor {
  name: string;
  logoImage: string;
  fallbackText: string;
  url: string;
}

interface EditLog {
  timestamp: string;
  user: string;
  section: string;
  changeDetails: string;
}

interface ExecutivePanelProps {
  onLeave: () => void;
  initialUsers: RotaryUser[];
  initialActivities: any[];
  corporateSponsors: Sponsor[];
}

export default function ExecutivePanel({
  onLeave,
  initialUsers,
  initialActivities,
  corporateSponsors,
}: ExecutivePanelProps) {
  // --- States ---
  const [users, setUsers] = useState<RotaryUser[]>(() => {
    // Inject usernames and defaults to existing members if missing
    return initialUsers.map((u) => ({
      ...u,
      username: u.username || u.name.toLowerCase().replace(/\s+/g, ''),
      role: u.isOfficer ? 'Officer' : u.isDirector ? 'Director' : 'Member',
    }));
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    return initialActivities.map((act) => ({
      ...act,
      likes: act.likes || [],
      comments: act.comments || [],
      rsvp: act.rsvp || {},
    }));
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(corporateSponsors);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<RotaryUser | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordField, setPasswordField] = useState(''); // Simulated login UI

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<'profile' | 'announcements' | 'activities' | 'roster' | 'sponsors' | 'site_editor' | 'audit_logs'>('profile');

  // Input states for modifications & creation
  const [commentInputs, setCommentInputs] = useState<{ [activityId: number]: string }>({});
  
  // Officer Roster Management forms
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [rosterForm, setRosterForm] = useState<Partial<RotaryUser>>({
    name: '', lastName: '', suffix: '', position: 'Active Member', role: 'Member', isOfficer: false, isDirector: false, birthday: '', username: '', email: '', phone: '', occupation: '', address: ''
  });
  
  // Password simulator states
  const [simulatedEncryptionHash, setSimulatedEncryptionHash] = useState<string | null>(null);

  // Activity management states
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '', type: 'Project' as 'Project' | 'News', category: '', description: '', status: 'Ongoing' as 'Ongoing' | 'Completed', detail: '', galleryImages: ['/carousel 1.jpg']
  });

  // Sponsor state managers
  const [editingSponsorName, setEditingSponsorName] = useState<string | null>(null);
  const [sponsorForm, setSponsorForm] = useState<Sponsor>({
    name: '', logoImage: '', fallbackText: '', url: ''
  });

  // Site ACF CMS editor mock state
  const [siteContent, setSiteContent] = useState({
    heroTitle: 'Service Above Self',
    heroSubtitle: 'Rotary Club of Meycauayan East',
    visionStatement: 'To guide and execute critical community transformation projects throughout the region.',
    ctaText: 'Become a Partner Today',
    ctaLink: '#involved',
    heroImage: '/carousel 1.jpg'
  });

  // CMS History logs
  const [editLogs, setEditLogs] = useState<EditLog[]>([
    { timestamp: '2026-07-16 14:32:10', user: 'president.admin', section: 'Hero Block', changeDetails: 'Updated primary campaign image' },
    { timestamp: '2026-07-17 09:15:01', user: 'secretary.east', section: 'Vision Block', changeDetails: 'Rephrased direct community objective statement' }
  ]);

  // Image Upload Simulators
  const profileImageRef = useRef<HTMLInputElement>(null);
  const sponsorImageRef = useRef<HTMLInputElement>(null);
  const acfImageRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---
  const logAction = (section: string, details: string) => {
    if (!currentUser) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setEditLogs((prev) => [
      { timestamp: now, user: currentUser.username, section, changeDetails: details },
      ...prev,
    ]);
  };

  // --- Auth logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = loginUsername.trim().toLowerCase();
    const foundUser = users.find((u) => u.username.toLowerCase() === cleanUsername);

    if (foundUser) {
      setCurrentUser(foundUser);
      setLoginError('');
      // Set defaults for the member profile tab matching authenticated user
      setActiveTab('announcements');
    } else {
      setLoginError('Invalid credentials. Check database registry username key.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginUsername('');
    setPasswordField('');
  };

  // --- Profile Edits (Regular Members) ---
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...currentUser } : u))
    );
    logAction('Profile Deck', 'Self-updated core personal registry details');
    alert('Your profile changes have been successfully committed to the server registry.');
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUser) {
      const simulatedPath = `/members/uploaded_${e.target.files[0].name}`;
      setCurrentUser({ ...currentUser, image: simulatedPath });
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, image: simulatedPath } : u))
      );
      logAction('Profile Deck', `Uploaded new display avatar: ${e.target.files[0].name}`);
    }
  };

  const handleResetSelfPassword = () => {
    // Simulated hashing output
    const randomSalt = Math.floor(Math.random() * 100000);
    const simulatedHash = `$2b$12$R.S9${randomSalt}Xg8o7VdE9U/O31.qZWeuWf5X.S87`;
    setSimulatedEncryptionHash(simulatedHash);
    logAction('Security Module', 'Executed a secure encryption self-password reset');
  };

  // --- Interactions (Likes, Comments, RSVP) ---
  const toggleLike = (activityId: number) => {
    if (!currentUser) return;
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const isLiked = act.likes.includes(currentUser.username);
          const updatedLikes = isLiked
            ? act.likes.filter((username) => username !== currentUser.username)
            : [...act.likes, currentUser.username];
          return { ...act, likes: updatedLikes };
        }
        return act;
      })
    );
  };

  const submitComment = (activityId: number) => {
    const text = commentInputs[activityId]?.trim();
    if (!text || !currentUser) return;

    const newComment: Comment = {
      id: Date.now(),
      author: currentUser.name,
      text,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return { ...act, comments: [...act.comments, newComment] };
        }
        return act;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [activityId]: '' }));
  };

  const submitRSVP = (activityId: number, status: 'Yes' | 'Maybe' | 'No') => {
    if (!currentUser) return;
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            rsvp: {
              ...(act.rsvp || {}),
              [currentUser.username]: status,
            },
          };
        }
        return act;
      })
    );
    logAction('Community Board', `Set RSVP to "${status}" for program code: ${activityId}`);
  };

  // --- Activities CRUD (Directors & Officers) ---
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title || !activityForm.category) return;

    if (editingActivityId !== null) {
      // Edit
      setActivities((prev) =>
        prev.map((act) => (act.id === editingActivityId ? { ...act, ...activityForm } : act))
      );
      logAction('Content Directory', `Modified program/news node details: ${activityForm.title}`);
      setEditingActivityId(null);
    } else {
      // Create
      const created: Activity = {
        id: Date.now(),
        ...activityForm,
        likes: [],
        comments: [],
        rsvp: {},
      };
      setActivities((prev) => [created, ...prev]);
      logAction('Content Directory', `Dispatched new community board program: ${activityForm.title}`);
    }

    setActivityForm({
      title: '', type: 'Project', category: '', description: '', status: 'Ongoing', detail: '', galleryImages: ['/carousel 1.jpg']
    });
  };

  const handleEditActivityClick = (act: Activity) => {
    setEditingActivityId(act.id);
    setActivityForm({
      title: act.title,
      type: act.type,
      category: act.category,
      description: act.description,
      status: act.status,
      detail: act.detail,
      galleryImages: act.galleryImages,
    });
  };

  const handleDeleteActivity = (id: number) => {
    const act = activities.find((a) => a.id === id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    if (act) logAction('Content Directory', `Removed node directory: ${act.title}`);
  };

  // --- Roster CRUD (Officers only) ---
  const handleSaveRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rosterForm.name || !rosterForm.birthday) return;

    // Standardize role permissions alignment
    const targetIsOfficer = rosterForm.role === 'Officer';
    const targetIsDirector = rosterForm.role === 'Director';

    if (editingMemberId !== null) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingMemberId
            ? {
                ...u,
                ...rosterForm,
                isOfficer: targetIsOfficer,
                isDirector: targetIsDirector,
                username: rosterForm.username || u.username,
              } as RotaryUser
            : u
        )
      );
      logAction('Registry Directory', `Modified record metrics of member: ${rosterForm.name}`);
      setEditingMemberId(null);
    } else {
      const generatedUsername = rosterForm.username || rosterForm.name.toLowerCase().replace(/\s+/g, '');
      const created: RotaryUser = {
        id: Date.now(),
        name: rosterForm.name,
        lastName: rosterForm.lastName || '',
        suffix: rosterForm.suffix || '',
        position: rosterForm.position || 'Active Member',
        role: rosterForm.role as 'Member' | 'Director' | 'Officer',
        isOfficer: targetIsOfficer,
        isDirector: targetIsDirector,
        image: '/members/default.png',
        birthday: rosterForm.birthday,
        username: generatedUsername,
        email: rosterForm.email || '',
        phone: rosterForm.phone || '',
        occupation: rosterForm.occupation || '',
        address: rosterForm.address || '',
      };
      setUsers((prev) => [created, ...prev]);
      logAction('Registry Directory', `Injected new member node to registry: ${rosterForm.name}`);
    }

    setRosterForm({
      name: '', lastName: '', suffix: '', position: 'Active Member', role: 'Member', isOfficer: false, isDirector: false, birthday: '', username: '', email: '', phone: '', occupation: '', address: ''
    });
  };

  const handleEditRosterClick = (user: RotaryUser) => {
    setEditingMemberId(user.id);
    setRosterForm({
      name: user.name,
      lastName: user.lastName || '',
      suffix: user.suffix || '',
      position: user.position,
      role: user.role,
      isOfficer: user.isOfficer,
      isDirector: user.isDirector,
      birthday: user.birthday,
      username: user.username,
      email: user.email || '',
      phone: user.phone || '',
      occupation: user.occupation || '',
      address: user.address || '',
    });
  };

  const handleDeleteMember = (id: number) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (target) logAction('Registry Directory', `Purged account record of member: ${target.name}`);
  };

  const triggerOfficerPasswordReset = (memberName: string) => {
    const randomSalt = Math.floor(Math.random() * 999999);
    const simulatedHash = `$2y$10$E.M${randomSalt}H9zOa5p9R/7Qj9.K8eXh3tF9a7B`;
    setSimulatedEncryptionHash(simulatedHash);
    logAction('Registry Directory', `Executed encrypted override-password reset protocol for: ${memberName}`);
  };

  // --- Sponsor Network CRUD (Officers only) ---
  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.name) return;

    if (editingSponsorName !== null) {
      setSponsors((prev) =>
        prev.map((s) => (s.name === editingSponsorName ? { ...sponsorForm } : s))
      );
      logAction('Sponsors Module', `Edited partner info: ${sponsorForm.name}`);
      setEditingSponsorName(null);
    } else {
      const created: Sponsor = {
        ...sponsorForm,
        logoImage: sponsorForm.logoImage || '/rotary-logo.png',
        fallbackText: sponsorForm.fallbackText || 'SPN',
      };
      setSponsors((prev) => [created, ...prev]);
      logAction('Sponsors Module', `Linked new sponsor node: ${sponsorForm.name}`);
    }

    setSponsorForm({ name: '', logoImage: '', fallbackText: '', url: '' });
  };

  const handleEditSponsorClick = (s: Sponsor) => {
    setEditingSponsorName(s.name);
    setSponsorForm(s);
  };

  const handleDeleteSponsor = (name: string) => {
    setSponsors((prev) => prev.filter((s) => s.name !== name));
    logAction('Sponsors Module', `Deleted sponsor node link: ${name}`);
  };

  const handleSponsorImageSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSponsorForm((prev) => ({
        ...prev,
        logoImage: `/partners/uploaded_${e.target.files![0].name}`,
      }));
    }
  };

  // --- ACF CMS Editor Updates (Officers only) ---
  const handleACFUpdate = (field: keyof typeof siteContent, value: string) => {
    setSiteContent((prev) => ({ ...prev, [field]: value }));
    logAction('ACF Live Block Engine', `Modified site content variable [${field}] to: "${value.substring(0, 30)}..."`);
  };

  const handleACFImageSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const targetPath = `/brand/uploaded_${e.target.files[0].name}`;
      handleACFUpdate('heroImage', targetPath);
    }
  };

  // --- CSV Audit Export ---
  const exportLogsToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,User,Section Affected,Change Description\r\n';

    editLogs.forEach((log) => {
      const row = `"${log.timestamp}","${log.user}","${log.section}","${log.changeDetails.replace(/"/g, '""')}"`;
      csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rotary_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Dynamic Role Permissions Helpers ---
  const canEditActivities = currentUser && (currentUser.role === 'Director' || currentUser.role === 'Officer');
  const canManageRosterAndSettings = currentUser && currentUser.role === 'Officer';

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Login State Guard */}
      {!currentUser ? (
        <div className="max-w-md mx-auto pt-24 px-4 pb-12 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-amber-500 font-extrabold uppercase tracking-widest text-[10px]">
                Internal Security Gate
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Club Administration Login
              </h2>
              <p className="text-neutral-400 text-xs">
                Enter your system-registered username below to gain direct clearance to your personalized layout.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-neutral-400 mb-1">
                  Registered Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500 font-mono transition"
                  placeholder="e.g. jannopotestades"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-neutral-400 mb-1">
                  Secure Passphrase
                </label>
                <input
                  type="password"
                  value={passwordField}
                  onChange={(e) => setPasswordField(e.target.value)}
                  className="w-full bg-slate-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500 font-mono transition"
                  placeholder="••••••••••••"
                />
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-bold leading-tight">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-3.5 rounded-xl text-xs transition-all cursor-pointer border-none shadow-lg shadow-amber-500/10"
              >
                Authenticate Session
              </button>
            </form>

            <div className="border-t border-neutral-800 pt-4 text-center">
              <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-wider font-mono">
                System Batch 2026 / Node Protection Activated
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Main Authenticated Dashboard layout */
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 animate-fadeIn">
          {/* Header Block with dynamic Greeting based on Role */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-900 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-amber-500/20">
                  {currentUser.role} Cleared
                </span>
                <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-mono">
                  Session Token: Active
                </span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-2">
                Greetings, {currentUser.name} {currentUser.lastName || ''}
              </h1>
              <p className="text-xs text-neutral-400">
                Authorized Position: <strong className="text-white">{currentUser.position}</strong>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="bg-neutral-900 border border-neutral-800 hover:bg-red-500/20 hover:text-red-400 text-neutral-400 px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-black transition cursor-pointer"
              >
                Disconnect Session
              </button>
              <button
                onClick={onLeave}
                className="bg-amber-500 text-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-black transition-all hover:bg-amber-600 shadow-lg shadow-amber-500/10 cursor-pointer border-none"
              >
                ← Back to Portal Layout
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs based on authorization levels */}
          <div className="flex flex-wrap gap-1.5 border-b border-neutral-900 pb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-black transition rounded-t-xl cursor-pointer ${
                activeTab === 'profile' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-amber-500'
              }`}
            >
              My Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-black transition rounded-t-xl cursor-pointer ${
                activeTab === 'announcements' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-amber-500'
              }`}
            >
              Announcements Board
            </button>

            {canEditActivities && (
              <button
                onClick={() => setActiveTab('activities')}
                className={`px-5 py-3 text-xs uppercase tracking-widest font-black transition rounded-t-xl cursor-pointer ${
                  activeTab === 'activities' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-amber-500'
                }`}
              >
                Manage Activities
              </button>
            )}

            {canManageRosterAndSettings && (
              <>
                <button
                  onClick={() => setActiveTab('roster')}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-black transition rounded-t-xl cursor-pointer ${
                    activeTab === 'roster' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-amber-500'
                  }`}
                >
                  Roster Directory Registry
                </button>
                <button
                  onClick={() => setActiveTab('sponsors')}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-black transition rounded-t-xl cursor-pointer ${
                    activeTab === 'sponsors' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-amber-500'
                  }`}
                >
                  Manage Sponsor Nodes
                </button>
                <button
                  onClick={() => setActiveTab('site_editor')}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-black transition rounded-t-xl cursor-pointer ${
                    activeTab === 'site_editor' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-amber-500'
                  }`}
                >
                  ACF Content Editor
                </button>
                <button
                  onClick={() => setActiveTab('audit_logs')}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-black transition rounded-t-xl cursor-pointer ${
                    activeTab === 'audit_logs' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-amber-500'
                  }`}
                >
                  System Logs History
                </button>
              </>
            )}
          </div>

          {/* Encryption Popups / Hash Toast */}
          {simulatedEncryptionHash && (
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
              <div>
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
                  Secure Password Simulator Engine (Argon2 / BCrypt Mocked)
                </span>
                <p className="text-xs text-neutral-400 mt-0.5">
                  The password has been safely salted and encrypted. Plain text will never be stored in the directory.
                </p>
                <code className="text-[11px] block mt-2 text-emerald-400 font-mono break-all max-w-4xl p-2 bg-slate-950 rounded border border-neutral-800">
                  {simulatedEncryptionHash}
                </code>
              </div>
              <button
                onClick={() => setSimulatedEncryptionHash(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition"
              >
                Clear Notification
              </button>
            </div>
          )}

          {/* TAB CONTENT 1: PROFILE MANAGEMENT (All Members) */}
          {activeTab === 'profile' && (
            <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
              <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-6 h-fit">
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-neutral-800 bg-slate-950 flex items-center justify-center">
                    {currentUser.image ? (
                      <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover animate-pulse-slow" />
                    ) : (
                      <span className="text-neutral-500 text-4xl">👤</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase text-white">{currentUser.name}</h3>
                    <p className="text-[10px] text-amber-500 font-mono tracking-wider uppercase mt-0.5">
                      {currentUser.position}
                    </p>
                  </div>
                  <div className="pt-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={profileImageRef}
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => profileImageRef.current?.click()}
                      className="bg-slate-950 hover:bg-slate-900 border border-neutral-800 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg transition"
                    >
                      Upload Profile Image File
                    </button>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Security Clearance</span>
                    <span className="font-bold text-amber-500 uppercase">{currentUser.role}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Username Code</span>
                    <span className="font-mono font-bold text-white">@{currentUser.username}</span>
                  </div>
                </div>

                <button
                  onClick={handleResetSelfPassword}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black tracking-widest uppercase py-3 rounded-lg transition"
                >
                  Perform Secure Password Reset
                </button>
              </div>

              <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                <h3 className="text-base font-black uppercase text-white mb-6">Personal Directory Info</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={currentUser.name}
                        onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={currentUser.lastName || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="LastName"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Suffix (if any)</label>
                      <input
                        type="text"
                        value={currentUser.suffix || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, suffix: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="e.g. Jr., III"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Birthday</label>
                      <input
                        type="text"
                        required
                        value={currentUser.birthday}
                        onChange={(e) => setCurrentUser({ ...currentUser, birthday: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Contact Number</label>
                      <input
                        type="text"
                        value={currentUser.phone || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="e.g. +63 917 123 4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={currentUser.email || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="yourname@rotary.org"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Occupation</label>
                      <input
                        type="text"
                        value={currentUser.occupation || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, occupation: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="e.g. Systems Engineer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Address Location</label>
                    <input
                      type="text"
                      value={currentUser.address || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, address: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="Street, City, Province"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest px-6 py-3 rounded-lg text-xs transition border-none mt-4 cursor-pointer"
                  >
                    Commit Profile Registry Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: ANNOUNCEMENTS BOARD (All Members) */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  Active Community Board & Broadcast Registry
                </h3>
              </div>

              {activities.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 p-8 text-center rounded-2xl">
                  <p className="text-neutral-400 text-xs">No project or announcement logs currently active on the board.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {activities.map((act) => {
                    const liked = act.likes.includes(currentUser.username);
                    const userRSVP = act.rsvp?.[currentUser.username] || 'No Response';

                    return (
                      <div key={act.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-full text-[9px] uppercase font-black">
                              {act.category}
                            </span>
                            <span className="text-neutral-500 text-[10px] font-mono">{act.detail}</span>
                          </div>

                          <h4 className="text-base font-black uppercase leading-tight text-white">{act.title}</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">{act.description}</p>
                        </div>

                        {/* Interactive Section */}
                        <div className="border-t border-neutral-800/60 pt-4 space-y-4">
                          {/* Calendar RSVP Widget */}
                          <div className="bg-slate-950 p-3 rounded-xl space-y-2 border border-neutral-800/40">
                            <div className="flex justify-between text-[9px] uppercase tracking-wider font-bold">
                              <span className="text-neutral-400">Event RSVP Alignment:</span>
                              <span className={`font-black uppercase ${userRSVP === 'Yes' ? 'text-emerald-400' : userRSVP === 'Maybe' ? 'text-amber-500' : 'text-red-400'}`}>
                                {userRSVP}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {['Yes', 'Maybe', 'No'].map((choice) => (
                                <button
                                  key={choice}
                                  onClick={() => submitRSVP(act.id, choice as any)}
                                  className={`py-1.5 rounded text-[10px] font-bold transition uppercase tracking-wider border cursor-pointer ${
                                    userRSVP === choice
                                      ? 'bg-amber-500 text-black border-amber-500'
                                      : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
                                  }`}
                                >
                                  {choice}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Action Stats */}
                          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                            <button
                              onClick={() => toggleLike(act.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                                liked
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : 'bg-slate-950 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
                              }`}
                            >
                              👍 {liked ? 'Liked' : 'Like'} ({act.likes.length})
                            </button>
                            <span>{act.comments.length} Comments</span>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-2 max-h-32 overflow-y-auto custom-magazine-scrollbar bg-slate-950 p-2 rounded-xl">
                            {act.comments.map((c) => (
                              <div key={c.id} className="text-[11px] leading-tight">
                                <span className="font-black text-amber-500">@{c.author.toLowerCase().replace(/\s+/g, '')}</span>{' '}
                                <span className="text-neutral-300">{c.text}</span>
                                <span className="text-neutral-600 block text-[9px] mt-0.5">{c.timestamp}</span>
                              </div>
                            ))}
                          </div>

                          {/* Write Comment */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[act.id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [act.id]: e.target.value })}
                              placeholder="Write a comment..."
                              className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                            />
                            <button
                              onClick={() => submitComment(act.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider px-3 rounded-lg text-[10px] transition cursor-pointer border-none"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 3: MANAGE ACTIVITIES (Directors & Officers) */}
          {activeTab === 'activities' && canEditActivities && (
            <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
              <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl h-fit">
                <h3 className="text-base font-black uppercase text-amber-500 mb-4">
                  {editingActivityId ? 'Update Activity' : 'Record New Activity'}
                </h3>
                <form onSubmit={handleSaveActivity} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={activityForm.title}
                      onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="e.g. Youth Literacy Drive"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Category / Area of Focus</label>
                    <input
                      type="text"
                      required
                      value={activityForm.category}
                      onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="e.g. Water and Sanitation"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Description Overview</label>
                    <textarea
                      required
                      rows={3}
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="Enter concise project scope details..."
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Type</label>
                      <select
                        value={activityForm.type}
                        onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value as any })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      >
                        <option value="Project">Project</option>
                        <option value="News">News</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Status</label>
                      <select
                        value={activityForm.status}
                        onChange={(e) => setActivityForm({ ...activityForm, status: e.target.value as any })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Status Subdetail / Date</label>
                    <input
                      type="text"
                      value={activityForm.detail}
                      onChange={(e) => setActivityForm({ ...activityForm, detail: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="e.g. Concluded March 2026"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-3 rounded-lg text-xs transition border-none cursor-pointer"
                    >
                      {editingActivityId ? 'Save Edits' : 'Publish Activity'}
                    </button>
                    {editingActivityId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingActivityId(null);
                          setActivityForm({ title: '', type: 'Project', category: '', description: '', status: 'Ongoing', detail: '', galleryImages: ['/carousel 1.jpg'] });
                        }}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-base font-black uppercase text-white">System Activity Logs ({activities.length})</h3>
                <div className="max-h-[500px] overflow-y-auto custom-magazine-scrollbar border border-neutral-900 rounded-2xl bg-slate-900/30">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                        <th className="p-4 uppercase font-bold">Scope Output Ledger</th>
                        <th className="p-4 uppercase font-bold">Category</th>
                        <th className="p-4 uppercase font-bold">Type</th>
                        <th className="p-4 uppercase font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((a) => (
                        <tr key={a.id} className="border-b border-neutral-800/60 hover:bg-neutral-900/30 transition">
                          <td className="p-4 font-black">
                            <p className="text-white leading-tight">{a.title}</p>
                            <span className="text-[10px] font-mono text-neutral-400">{a.detail}</span>
                          </td>
                          <td className="p-4 text-neutral-300">{a.category}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${a.type === 'Project' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                              {a.type}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditActivityClick(a)}
                              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg font-bold border border-neutral-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(a.id)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-lg font-bold border border-red-500/20 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: ROSTER REGISTRY DIRECTORY (Officers only) */}
          {activeTab === 'roster' && canManageRosterAndSettings && (
            <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
              <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl h-fit">
                <h3 className="text-base font-black uppercase text-amber-500 mb-4">
                  {editingMemberId ? 'Update Member Profile' : 'Inject Roster Member'}
                </h3>
                <form onSubmit={handleSaveRoster} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={rosterForm.name}
                        onChange={(e) => setRosterForm({ ...rosterForm, name: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={rosterForm.lastName || ''}
                        onChange={(e) => setRosterForm({ ...rosterForm, lastName: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="dela Cruz"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Suffix</label>
                      <input
                        type="text"
                        value={rosterForm.suffix || ''}
                        onChange={(e) => setRosterForm({ ...rosterForm, suffix: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="e.g. Jr."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Username Code</label>
                      <input
                        type="text"
                        value={rosterForm.username || ''}
                        onChange={(e) => setRosterForm({ ...rosterForm, username: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                        placeholder="username_code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Functional Position</label>
                    <input
                      type="text"
                      value={rosterForm.position}
                      onChange={(e) => setRosterForm({ ...rosterForm, position: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="e.g. Active Member"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Birthday</label>
                      <input
                        type="text"
                        required
                        value={rosterForm.birthday}
                        onChange={(e) => setRosterForm({ ...rosterForm, birthday: e.target.value })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        placeholder="e.g. August 14"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Tier / Role</label>
                      <select
                        value={rosterForm.role}
                        onChange={(e) => setRosterForm({ ...rosterForm, role: e.target.value as any })}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      >
                        <option value="Member">Regular Member</option>
                        <option value="Director">Club Director</option>
                        <option value="Officer">Club Officer</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-3 rounded-lg text-xs transition border-none cursor-pointer"
                    >
                      {editingMemberId ? 'Update Record' : 'Add Member'}
                    </button>
                    {editingMemberId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMemberId(null);
                          setRosterForm({ name: '', position: 'Active Member', role: 'Member', isOfficer: false, isDirector: false, birthday: '' });
                        }}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-base font-black uppercase text-white">Roster Registry ({users.length})</h3>
                <div className="max-h-[500px] overflow-y-auto custom-magazine-scrollbar border border-neutral-900 rounded-2xl bg-slate-900/30">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                        <th className="p-4 uppercase font-bold">Identity</th>
                        <th className="p-4 uppercase font-bold">Position / Tier</th>
                        <th className="p-4 uppercase font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-neutral-800/60 hover:bg-neutral-900/30 transition">
                          <td className="p-4">
                            <p className="font-black text-white">{u.name} {u.lastName || ''} {u.suffix || ''}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">@{u.username} | {u.birthday}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-neutral-200">{u.position}</span>
                            <span className="block text-[9px] text-amber-500 font-bold uppercase tracking-wider">{u.role}</span>
                          </td>
                          <td className="p-4 text-right space-y-1 sm:space-y-0 sm:space-x-1.5">
                            <button
                              onClick={() => handleEditRosterClick(u)}
                              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-lg font-bold border border-neutral-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => triggerOfficerPasswordReset(u.name)}
                              className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black px-2.5 py-1.5 rounded-lg font-bold border border-yellow-500/20 transition"
                            >
                              Reset Pass
                            </button>
                            <button
                              onClick={() => handleDeleteMember(u.id)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-2.5 py-1.5 rounded-lg font-bold border border-red-500/20 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 5: SPONSOR MODULE (Officers only) */}
          {activeTab === 'sponsors' && canManageRosterAndSettings && (
            <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
              <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl h-fit">
                <h3 className="text-base font-black uppercase text-amber-500 mb-4">
                  {editingSponsorName ? 'Modify Brand Node' : 'Register Brand Sponsor'}
                </h3>
                <form onSubmit={handleSaveSponsor} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Brand Name</label>
                    <input
                      type="text"
                      required
                      value={sponsorForm.name}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="e.g. Brand Industry"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Short Code (Fallback Text)</label>
                    <input
                      type="text"
                      value={sponsorForm.fallbackText}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, fallbackText: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="e.g. BRND"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Destination URL</label>
                    <input
                      type="text"
                      value={sponsorForm.url}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, url: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="https://brand-website.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Brand Logo Image</label>
                    <input
                      type="text"
                      value={sponsorForm.logoImage}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, logoImage: e.target.value })}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 mb-2 font-mono"
                      placeholder="/partners/default-logo.png"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={sponsorImageRef}
                      onChange={handleSponsorImageSimulate}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => sponsorImageRef.current?.click()}
                      className="w-full bg-slate-950 hover:bg-slate-900 text-neutral-400 text-[10px] font-bold uppercase py-2 border border-neutral-800 rounded-lg transition"
                    >
                      Simulate Image Upload
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-3 rounded-lg text-xs transition border-none cursor-pointer"
                    >
                      {editingSponsorName ? 'Commit Sponsor Edits' : 'Link Sponsor'}
                    </button>
                    {editingSponsorName && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSponsorName(null);
                          setSponsorForm({ name: '', logoImage: '', fallbackText: '', url: '' });
                        }}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-base font-black uppercase text-white">Sponsors Network Directory ({sponsors.length})</h3>
                <div className="max-h-[500px] overflow-y-auto custom-magazine-scrollbar border border-neutral-900 rounded-2xl bg-slate-900/30">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                        <th className="p-4 uppercase font-bold">Brand Partner</th>
                        <th className="p-4 uppercase font-bold">Short Code</th>
                        <th className="p-4 uppercase font-bold">Destination URL</th>
                        <th className="p-4 uppercase font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sponsors.map((s) => (
                        <tr key={s.name} className="border-b border-neutral-800/60 hover:bg-neutral-900/30 transition">
                          <td className="p-4 font-black">{s.name}</td>
                          <td className="p-4 font-mono text-neutral-400">{s.fallbackText}</td>
                          <td className="p-4 text-blue-400 truncate max-w-[200px]">{s.url}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditSponsorClick(s)}
                              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg font-bold border border-neutral-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSponsor(s.name)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-lg font-bold border border-red-500/20 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 6: ACF CONTENT CMS EDITOR (Officers only) */}
          {activeTab === 'site_editor' && canManageRosterAndSettings && (
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
                  Live Advanced Custom Fields (ACF) Platform Simulator
                </span>
                <h3 className="text-lg font-black uppercase text-white">Live Site Content Controller</h3>
                <p className="text-neutral-400 text-xs">
                  Directly manipulate homepage text vectors, banner links, asset routes, and visual elements dynamically.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-neutral-800/40">
                  <h4 className="text-xs font-black uppercase text-white border-b border-neutral-900 pb-2">Text Blocks & Strings</h4>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Landing Page Primary Hero Title</label>
                    <input
                      type="text"
                      value={siteContent.heroTitle}
                      onChange={(e) => handleACFUpdate('heroTitle', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Landing Page Hero Subtitle</label>
                    <input
                      type="text"
                      value={siteContent.heroSubtitle}
                      onChange={(e) => handleACFUpdate('heroSubtitle', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Core Vision Statement String</label>
                    <textarea
                      rows={3}
                      value={siteContent.visionStatement}
                      onChange={(e) => handleACFUpdate('visionStatement', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-neutral-800/40">
                  <h4 className="text-xs font-black uppercase text-white border-b border-neutral-900 pb-2">Assets, Media & Links</h4>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Primary Call-to-Action Text</label>
                    <input
                      type="text"
                      value={siteContent.ctaText}
                      onChange={(e) => handleACFUpdate('ctaText', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">CTA Destination Hyperlink Route</label>
                    <input
                      type="text"
                      value={siteContent.ctaLink}
                      onChange={(e) => handleACFUpdate('ctaLink', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Hero Asset Image Route</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={siteContent.heroImage}
                        onChange={(e) => handleACFUpdate('heroImage', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={acfImageRef}
                        onChange={handleACFImageSimulate}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => acfImageRef.current?.click()}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold px-3 rounded-lg uppercase"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-4 flex justify-between items-center">
                <span className="text-[10px] text-neutral-500 font-mono">
                  ACF live updates simulate visual overrides on components utilizing the siteContent model context.
                </span>
                <button
                  onClick={() => alert('CMS overrides written successfully to the operational JSON layer.')}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest px-5 py-2.5 rounded-lg text-xs border-none cursor-pointer"
                >
                  Save Changes to Live Build
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT 7: MOCK SYSTEM LOGS / HISTORY (Officers only) */}
          {activeTab === 'audit_logs' && canManageRosterAndSettings && (
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    Security Operations Center
                  </span>
                  <h3 className="text-lg font-black uppercase text-white">System Logs & Site Audit History</h3>
                </div>
                <button
                  onClick={exportLogsToCSV}
                  className="bg-slate-950 hover:bg-slate-900 border border-neutral-800 text-amber-500 hover:text-amber-400 font-black uppercase tracking-widest px-4 py-2.5 rounded-xl text-[10px] transition cursor-pointer"
                >
                  📥 Export Database Logs to Excel (CSV)
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-magazine-scrollbar border border-neutral-950 rounded-2xl bg-slate-950 p-2">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                      <th className="p-3 uppercase font-bold text-[9px] tracking-wider text-neutral-500">Timestamp</th>
                      <th className="p-3 uppercase font-bold text-[9px] tracking-wider text-neutral-500">Operator</th>
                      <th className="p-3 uppercase font-bold text-[9px] tracking-wider text-neutral-500">Section Affected</th>
                      <th className="p-3 uppercase font-bold text-[9px] tracking-wider text-neutral-500">Action Metric Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editLogs.map((log, idx) => (
                      <tr key={idx} className="border-b border-neutral-900/60 hover:bg-neutral-900/20 transition">
                        <td className="p-3 text-neutral-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-3 text-amber-500 font-bold">@{log.user}</td>
                        <td className="p-3 text-white font-bold">{log.section}</td>
                        <td className="p-3 text-neutral-300 text-[11px] font-sans">{log.changeDetails}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}