'use client';
import React, { useState, useRef } from 'react';

interface RotaryUser {
  id: number;
  name: string;
  lastName?: string;
  suffix?: string;
  role: 'Member' | 'Director' | 'Officer' | 'Admin';
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
  likes: string[]; 
  comments: Comment[];
  rsvp?: { [username: string]: 'Accept' | 'Maybe' | 'Decline' }; 
  authorRole?: string;
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

interface CustomTheme {
  mouseLogo: string;
  favicon: string;
  colorPalette: 'default' | 'amber' | 'blue' | 'emerald' | 'rose';
}

interface ExecutivePanelProps {
  onLeave: () => void;
  currentUser: RotaryUser;
  initialUsers: RotaryUser[];
  initialActivities: any[];
  corporateSponsors: Sponsor[];
}

export default function ExecutivePanel({
  onLeave,
  currentUser,
  initialUsers,
  initialActivities,
  corporateSponsors,
}: ExecutivePanelProps) {
  // --- States ---
  const [users, setUsers] = useState<RotaryUser[]>(() => {
    return initialUsers.map((u) => ({
      ...u,
      username: u.username || u.name.toLowerCase().replace(/\s+/g, ''),
      role: u.username === 'admin' ? 'Admin' : u.isOfficer ? 'Officer' : u.isDirector ? 'Director' : 'Member',
    }));
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    return initialActivities.map((act) => ({
      ...act,
      likes: act.likes || [],
      comments: act.comments || [],
      rsvp: act.rsvp || {},
      authorRole: act.authorRole || 'Officer', 
    }));
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(corporateSponsors);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [themeConfig, setThemeConfig] = useState<CustomTheme>({
    mouseLogo: '🖱️',
    favicon: '⚙️',
    colorPalette: 'default',
  });

  const [activeSessionUser, setActiveSessionUser] = useState<RotaryUser>(currentUser);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'announcements' | 'activities' | 'roster' | 'sponsors' | 'site_editor' | 'theme_customizer' | 'audit_logs'>('profile');

  const [commentInputs, setCommentInputs] = useState<{ [activityId: number]: string }>({});
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [rosterForm, setRosterForm] = useState<Partial<RotaryUser>>({
    name: '', lastName: '', suffix: '', position: 'Active Member', role: 'Member', birthday: '', username: '', email: '', phone: '', occupation: '', address: ''
  });
  
  const [simulatedEncryptionHash, setSimulatedEncryptionHash] = useState<string | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '', type: 'Project' as 'Project' | 'News', category: '', description: '', status: 'Ongoing' as 'Ongoing' | 'Completed', detail: '', galleryImages: ['/carousel 1.jpg']
  });

  const [editingSponsorName, setEditingSponsorName] = useState<string | null>(null);
  const [sponsorForm, setSponsorForm] = useState<Sponsor>({
    name: '', logoImage: '', fallbackText: '', url: ''
  });

  const [siteContent, setSiteContent] = useState({
    heroTitle: 'Service Above Self',
    heroSubtitle: 'Rotary Club of Meycauayan Metro',
    visionStatement: 'To guide and execute critical community transformation projects throughout the region.',
    ctaText: 'Become a Partner Today',
    ctaLink: '#involved',
    heroImage: '/carousel 1.jpg',
    customSections: [] as string[]
  });

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editLogs, setEditLogs] = useState<EditLog[]>([
    { 
      timestamp: '2026-07-16 14:32:10', 
      user: currentUser?.username || 'system',
      section: 'Hero Block', 
      changeDetails: 'Updated primary campaign text values' 
    }
  ]);

  const profileImageRef = useRef<HTMLInputElement>(null);
  const sponsorImageRef = useRef<HTMLInputElement>(null);

  const confirmChange = (message: string, executionCallback: () => void) => {
    const isConfirmed = window.confirm(`${message}\nAre you sure you want to enforce these changes?`);
    if (isConfirmed) executionCallback();
  };

  const logAction = (section: string, details: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setEditLogs((prev) => [
      { timestamp: now, user: activeSessionUser.username, section, changeDetails: details },
      ...prev,
    ]);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    confirmChange('You are updating your public personal member directory fields.', () => {
      setUsers((prev) =>
        prev.map((u) => (u.id === activeSessionUser.id ? { ...u, ...activeSessionUser } : u))
      );
      logAction('Profile Deck', 'Self-updated core personal profile records');
    });
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const simulatedPath = `/members/uploaded_${e.target.files[0].name}`;
      confirmChange('Upload and apply this image asset for your profile picture layout?', () => {
        setActiveSessionUser({ ...activeSessionUser, image: simulatedPath });
        setUsers((prev) =>
          prev.map((u) => (u.id === activeSessionUser.id ? { ...u, image: simulatedPath } : u))
        );
        logAction('Profile Deck', `Uploaded display avatar image: ${e.target.files![0].name}`);
      });
    }
  };

  const handleResetSelfPassword = () => {
    confirmChange('Generate a new encrypted password configuration update?', () => {
      const randomSalt = Math.floor(Math.random() * 100000);
      const simulatedHash = `$2b$12$R.S9${randomSalt}Xg8o7VdE9U/O31.qZWeuWf5X.S87`;
      setSimulatedEncryptionHash(simulatedHash);
      logAction('Security Module', 'Executed a secure encryption self-password reset');
    });
  };

  const toggleLike = (activityId: number) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const isLiked = act.likes.includes(activeSessionUser.username);
          const updatedLikes = isLiked
            ? act.likes.filter((username) => username !== activeSessionUser.username)
            : [...act.likes, activeSessionUser.username];
          return { ...act, likes: updatedLikes };
        }
        return act;
      })
    );
  };

  const submitComment = (activityId: number) => {
    const text = commentInputs[activityId]?.trim();
    if (!text) return;

    const newComment: Comment = {
      id: Date.now(),
      author: activeSessionUser.name,
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

  const submitRSVP = (activityId: number, status: 'Accept' | 'Maybe' | 'Decline') => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            rsvp: {
              ...(act.rsvp || {}),
              [activeSessionUser.username]: status,
            },
          };
        }
        return act;
      })
    );
    logAction('Community Board', `Set RSVP selection framework to "${status}" for event code: ${activityId}`);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title || !activityForm.category) return;

    confirmChange('Save this activity entry onto the central registry board index?', () => {
      if (editingActivityId !== null) {
        setActivities((prev) =>
          prev.map((act) => (act.id === editingActivityId ? { ...act, ...activityForm } : act))
        );
        logAction('Content Directory', `Modified activity layout nodes: ${activityForm.title}`);
        setEditingActivityId(null);
      } else {
        const created: Activity = {
          id: Date.now(),
          ...activityForm,
          likes: [],
          comments: [],
          rsvp: {},
          authorRole: activeSessionUser.role || 'Officer'
        };
        setActivities((prev) => [created, ...prev]);
        logAction('Content Directory', `Dispatched new activity node: ${activityForm.title}`);
      }
      setActivityForm({
        title: '', type: 'Project', category: '', description: '', status: 'Ongoing', detail: '', galleryImages: ['/carousel 1.jpg']
      });
    });
  };

  const handleDeleteActivity = (id: number) => {
    const act = activities.find((a) => a.id === id);
    confirmChange(`Are you absolutely sure you want to delete the activity: ${act?.title}?`, () => {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      if (act) logAction('Content Directory', `Removed activity node structure: ${act.title}`);
    });
  };

  const handleSaveRoster = (e: React.FormEvent) => {
    e.preventDefault();
    const verifiedName = rosterForm.name?.trim();
    const verifiedBirthday = rosterForm.birthday?.trim();
    const verifiedRole = rosterForm.role || 'Member';
    const verifiedPosition = rosterForm.position || 'Active Member';

    if (!verifiedName || !verifiedBirthday) return;

    confirmChange('Commit these roster profile changes to the system registry database?', () => {
      const targetIsOfficer = verifiedRole === 'Officer';
      const targetIsDirector = verifiedRole === 'Director';

      if (editingMemberId !== null) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingMemberId
              ? {
                  ...u, ...rosterForm, name: verifiedName, birthday: verifiedBirthday,
                  role: verifiedRole, position: verifiedPosition, isOfficer: targetIsOfficer, isDirector: targetIsDirector,
                } as RotaryUser
              : u
          )
        );
        logAction('Registry Directory', `Modified roster record data parameters targeting: ${verifiedName}`);
        setEditingMemberId(null);
      } else {
        const generatedUsername = rosterForm.username || verifiedName.toLowerCase().replace(/\s+/g, '');
        const created: RotaryUser = {
          id: Date.now(), name: verifiedName, lastName: rosterForm.lastName || '', suffix: rosterForm.suffix || '',
          position: verifiedPosition, role: verifiedRole as any, isOfficer: targetIsOfficer, isDirector: targetIsDirector,
          image: '/members/default.png', birthday: verifiedBirthday, username: generatedUsername,
          email: rosterForm.email || '', phone: rosterForm.phone || '', occupation: rosterForm.occupation || '', address: rosterForm.address || '',
        };
        setUsers((prev) => [created, ...prev]);
        logAction('Registry Directory', `Created new membership profile ledger node for: ${verifiedName}`);
      }
      setRosterForm({
        name: '', lastName: '', suffix: '', position: 'Active Member', role: 'Member', birthday: '', username: '', email: '', phone: '', occupation: '', address: ''
      });
    });
  };

  const handleDeleteMember = (id: number) => {
    const target = users.find((u) => u.id === id);
    confirmChange(`Remove member account profile ${target?.name} completely from roster indices?`, () => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (target) logAction('Registry Directory', `Purged member registry configuration node: ${target.name}`);
    });
  };

  const triggerOfficerPasswordReset = (memberName: string) => {
    confirmChange(`Force an encrypted password override parameter update reset sequence for ${memberName}?`, () => {
      const randomSalt = Math.floor(Math.random() * 999999);
      const simulatedHash = `$2y$10$E.M${randomSalt}H9zOa5p9R/7Qj9.K8eXh3tF9a7B`;
      setSimulatedEncryptionHash(simulatedHash);
      logAction('Registry Directory', `Enforced cryptographic password reset for roster user account: ${memberName}`);
    });
  };

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.name) return;

    confirmChange('Commit changes to the corporate sponsor directory parameters?', () => {
      if (editingSponsorName !== null) {
        setSponsors((prev) =>
          prev.map((s) => (s.name === editingSponsorName ? { ...sponsorForm } : s))
        );
        logAction('Sponsors Module', `Edited business sponsor data: ${sponsorForm.name}`);
        setEditingSponsorName(null);
      } else {
        const created: Sponsor = {
          ...sponsorForm,
          logoImage: sponsorForm.logoImage || '/rotary-logo.png',
          fallbackText: sponsorForm.fallbackText || 'SPN',
        };
        setSponsors((prev) => [created, ...prev]);
        logAction('Sponsors Module', `Registered new business sponsor layout profile: ${sponsorForm.name}`);
      }
      setSponsorForm({ name: '', logoImage: '', fallbackText: '', url: '' });
    });
  };

  const handleDeleteSponsor = (name: string) => {
    confirmChange(`Completely delete business sponsor index node link [ ${name} ]?`, () => {
      setSponsors((prev) => prev.filter((s) => s.name !== name));
      logAction('Sponsors Module', `Purged business sponsor node from layout grid: ${name}`);
    });
  };

  const handleSponsorImageSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSponsorForm((prev) => ({
        ...prev,
        logoImage: `/partners/uploaded_${e.target.files![0].name}`,
      }));
    }
  };

  const handleACFFieldSave = () => {
    confirmChange('Commit dynamic text content variables, image vectors, and link routes to active JSON presentation frameworks?', () => {
      logAction('ACF Live Block Engine', 'Overrode global static website copy and hyperlink assets');
    });
  };

  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    confirmChange(`Inject custom Elementor plugin widget container structure [ ${newSectionTitle} ] into root index template arrays?`, () => {
      setSiteContent(prev => ({
        ...prev,
        customSections: [...prev.customSections, newSectionTitle.trim()]
      }));
      logAction('Elementor Layer Engine', `Injected standalone Elementor layout container node block: "${newSectionTitle}"`);
      setNewSectionTitle('');
    });
  };

  const exportLogsToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Operator Profile,Section Affected,Action Metric Description\r\n';

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

  const isDirector = activeSessionUser?.role === 'Director';
  const isOfficer = activeSessionUser?.role === 'Officer';
  const isAdmin = activeSessionUser?.role === 'Admin';

  const canEditActivities = isDirector || isOfficer || isAdmin;
  const canManageRosterAndSponsors = isOfficer || isAdmin;

  const adminAnnouncements = activities.filter(act => act.authorRole === 'Officer' || act.authorRole === 'Admin');

  const navTabs = [
    { id: 'profile', label: 'My Profile', allowed: true },
    { id: 'announcements', label: 'Announcements', allowed: true },
    { id: 'activities', label: 'Activities Management', allowed: canEditActivities },
    { id: 'roster', label: 'Roster Registry', allowed: canManageRosterAndSponsors },
    { id: 'sponsors', label: 'Sponsors Hub', allowed: canManageRosterAndSponsors },
    { id: 'site_editor', label: 'ACF Live CMS', allowed: canManageRosterAndSponsors },
    { id: 'theme_customizer', label: 'Elementor Canvas', allowed: isAdmin },
    { id: 'audit_logs', label: 'Security System Logs', allowed: canManageRosterAndSponsors },
  ] as const;

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-amber-500 selection:text-black palette-${themeConfig.colorPalette}`}>
      
      {/* Top Bar Workspace Navigation Header */}
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl select-none">{themeConfig.favicon}</span>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-white">Executive Workspace Node</h1>
              <p className="text-[11px] text-neutral-400 font-mono">RY 2026-2027 Roster Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLeave}
              className="text-[11px] tracking-wider font-bold bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 px-3.5 py-2 rounded-xl transition duration-200 cursor-pointer shadow-sm"
            >
              Disconnect
            </button>
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 bg-neutral-800 text-neutral-300 rounded-xl hover:text-white focus:outline-none cursor-pointer border-none"
            >
              <span className="text-lg">{isMobileNavOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layer */}
      <div className="max-w-7xl mx-auto py-6 lg:py-10 px-4 sm:px-6 space-y-6">
        
        {/* Dynamic User Profile Card Section */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800/80 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left z-10">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/40 bg-neutral-950 shadow-md">
              <img 
                src={activeSessionUser.image || '/members/default.png'} 
                alt={activeSessionUser.name} 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23171717'/><text x='50%27 y='65%27 font-family='sans-serif' font-size='35' fill='%23d97706' text-anchor='middle'>👤</text></svg>"; }}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-base font-black uppercase tracking-wide text-white">{activeSessionUser.name} {activeSessionUser.lastName || ''}</h2>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                  {activeSessionUser.role}
                </span>
                {isMaintenanceMode && (
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border border-red-500/30">🚧 Maintenance</span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">{activeSessionUser.position}</p>
            </div>
          </div>
        </div>

        {/* Responsive Drawer Mobile System Navigation Tab Selector */}
        {isMobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-neutral-900 border-l border-neutral-800 p-6 shadow-2xl space-y-4 overflow-y-auto">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Navigation Framework</span>
                <button onClick={() => setIsMobileNavOpen(false)} className="bg-transparent border-none text-neutral-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
              </div>
              <div className="flex flex-col gap-1.5">
                {navTabs.map((tab) => tab.allowed && (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsMobileNavOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border-none cursor-pointer ${
                      activeTab === tab.id ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Tab Strip Navigation */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-900/50 p-1.5 rounded-2xl border border-neutral-900 shadow-inner">
          {navTabs.map((tab) => tab.allowed && (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-black transition-all border-none cursor-pointer ${
                activeTab === tab.id ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-400 hover:text-amber-500 bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Encrypted Hash Output Panel Block */}
        {simulatedEncryptionHash && (
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn shadow-md">
            <div className="flex-1 w-full overflow-hidden">
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest block font-mono">Secure Cryptographic Output Hash Block</span>
              <code className="text-[11px] block mt-2 text-emerald-400 font-mono break-all p-3 bg-neutral-950 rounded border border-neutral-800 overflow-x-auto">
                {simulatedEncryptionHash}
              </code>
            </div>
            <button onClick={() => setSimulatedEncryptionHash(null)} className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 border-none text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer">Dismiss</button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: INDIVIDUAL PROFILE SETTINGS CONTROLLER DECK */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6 text-center shadow-lg">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-neutral-800 bg-neutral-950 flex items-center justify-center shadow-inner group">
                {activeSessionUser.image ? (
                  <img src={activeSessionUser.image} alt={activeSessionUser.name} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <span className="text-neutral-500 text-3xl">👤</span>
                )}
              </div>
              <div className="space-y-2">
                <input type="file" accept="image/*" ref={profileImageRef} onChange={handleProfileImageUpload} className="hidden" />
                <button onClick={() => profileImageRef.current?.click()} className="w-full bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white text-[10px] font-black tracking-widest uppercase px-4 py-3 rounded-xl transition cursor-pointer">
                  Upload Profile Avatar
                </button>
                <button onClick={handleResetSelfPassword} className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-[10px] font-black tracking-widest uppercase py-3 rounded-xl transition cursor-pointer">
                  Reset Secure Password Node
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 p-5 sm:p-6 rounded-3xl shadow-lg">
              <h3 className="text-sm font-black uppercase text-white tracking-wider border-b border-neutral-800 pb-3 mb-5">Edit Profile Registry fields</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">First Name</label>
                    <input type="text" required value={activeSessionUser.name} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, name: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">Last Name</label>
                    <input type="text" value={activeSessionUser.lastName || ''} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, lastName: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" placeholder="Last Name" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">Suffix</label>
                    <input type="text" value={activeSessionUser.suffix || ''} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, suffix: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" placeholder="e.g. Jr." />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">Birthday</label>
                    <input type="text" required value={activeSessionUser.birthday} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, birthday: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">Contact Number</label>
                    <input type="text" value={activeSessionUser.phone || ''} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, phone: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" placeholder="Contact number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">Email Address</label>
                    <input type="email" value={activeSessionUser.email || ''} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, email: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" placeholder="email@address.org" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">Occupation</label>
                    <input type="text" value={activeSessionUser.occupation || ''} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, occupation: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" placeholder="Occupation" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">Address Location</label>
                  <input type="text" value={activeSessionUser.address || ''} onChange={(e) => setActiveSessionUser({ ...activeSessionUser, address: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" placeholder="Street, City, Province" />
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest px-6 py-3.5 rounded-xl text-xs border-none cursor-pointer shadow-md transition-colors mt-2">
                  Commit Personal Directory Updates
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ANNOUNCEMENTS BOARD SCREEN */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-400">&lfloor; Active Leadership Bulletins Manifest</h3>
            
            {adminAnnouncements.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 p-8 text-center rounded-3xl">
                <p className="text-neutral-400 text-xs font-bold">No active announcements broadcasted by executive officers layout networks.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminAnnouncements.map((act) => {
                  const liked = act.likes.includes(activeSessionUser.username);
                  const userRSVP = act.rsvp?.[activeSessionUser.username] || 'No Selection';

                  return (
                    <div key={act.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4 flex flex-col justify-between shadow-md">
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase">{act.category}</span>
                          <span>{act.detail}</span>
                        </div>
                        <h4 className="text-base font-black uppercase text-white tracking-tight">{act.title}</h4>
                        <p className="text-neutral-400 text-xs leading-relaxed text-justify">{act.description}</p>
                      </div>

                      <div className="border-t border-neutral-800/80 pt-4 space-y-4">
                        {/* Interactive RSVP Framework component */}
                        <div className="bg-neutral-950 p-3 rounded-2xl space-y-2 border border-neutral-800/40">
                          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-extrabold">
                            <span className="text-neutral-400">Google Calendar RSVP Choice:</span>
                            <span className={`font-black uppercase ${userRSVP === 'Accept' ? 'text-emerald-400' : userRSVP === 'Maybe' ? 'text-amber-500' : userRSVP === 'Decline' ? 'text-red-400' : 'text-neutral-500'}`}>
                              {userRSVP}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {['Accept', 'Maybe', 'Decline'].map((choice) => (
                              <button
                                key={choice}
                                onClick={() => submitRSVP(act.id, choice as any)}
                                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer transition ${
                                  userRSVP === choice ? 'bg-amber-500 text-black border-amber-500' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                                }`}
                              >
                                {choice}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                          <button onClick={() => toggleLike(act.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border cursor-pointer transition ${liked ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-neutral-950 text-neutral-400 border-neutral-800'}`}>
                            👍 {liked ? 'Liked' : 'Like'} ({act.likes.length})
                          </button>
                          <span className="font-bold">{act.comments.length} Comments</span>
                        </div>

                        <div className="space-y-2 max-h-24 overflow-y-auto custom-magazine-scrollbar bg-neutral-950 p-3 rounded-xl text-[11px] border border-neutral-900">
                          {act.comments.map((c) => (
                            <div key={c.id} className="leading-normal">
                              <span className="font-bold text-amber-500">@{c.author.toLowerCase().replace(/\s+/g, '')}</span> <span className="text-neutral-300 font-sans">{c.text}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input type="text" value={commentInputs[act.id] || ''} onChange={(e) => setCommentInputs({ ...commentInputs, [act.id]: e.target.value })} placeholder="Write a comment..." className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                          <button onClick={() => submitComment(act.id)} className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-[10px] px-4 rounded-xl border-none cursor-pointer transition-colors shadow-sm">Post</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CLUB ACTIVITIES SCHEDULER MANAGEMENT */}
        {activeTab === 'activities' && canEditActivities && (
          <div className="grid lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl shadow-lg">
              <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider border-b border-neutral-800 pb-2 mb-4">{editingActivityId ? 'Modify Activity Record' : 'Publish Activity Log'}</h3>
              <form onSubmit={handleSaveActivity} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Title</label>
                  <input type="text" required value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Category / Area Focus</label>
                  <input type="text" required value={activityForm.category} onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Description Details</label>
                  <textarea required rows={3} value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Type</label>
                    <select value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value as any })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer outline-none">
                      <option value="Project">Project</option>
                      <option value="News">News</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Status</label>
                    <select value={activityForm.status} onChange={(e) => setActivityForm({ ...activityForm, status: e.target.value as any })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer outline-none">
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-3 rounded-xl text-xs border-none cursor-pointer shadow-md transition-colors">Commit Activity Logs</button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-3xl shadow-lg overflow-hidden">
              <h3 className="text-sm font-black uppercase text-white border-b border-neutral-800 pb-2 mb-4">Activity Matrix Records</h3>
              
              {/* Mobile Card Renders / Desktop Table Grid Fallback */}
              <div className="block sm:hidden space-y-3">
                {activities.map((a) => (
                  <div key={a.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-3">
                    <div>
                      <h4 className="text-xs font-black uppercase text-white">{a.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{a.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingActivityId(a.id); setActivityForm(a); }} className="flex-1 bg-neutral-800 text-neutral-200 text-xs py-2 rounded-xl border-none cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteActivity(a.id)} className="flex-1 bg-red-500/20 text-red-400 text-xs py-2 rounded-xl border border-red-500/30 cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                      <th className="p-3">Title Namespace</th>
                      <th className="p-3">Area Focus</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((a) => (
                      <tr key={a.id} className="border-b border-neutral-800/50 hover:bg-neutral-950/40 transition-colors">
                        <td className="p-3 font-bold text-white">{a.title}</td>
                        <td className="p-3 text-neutral-300">{a.category}</td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <button onClick={() => { setEditingActivityId(a.id); setActivityForm(a); }} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg cursor-pointer border-none transition">Edit</button>
                          <button onClick={() => handleDeleteActivity(a.id)} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30 cursor-pointer transition">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ROSTER REGISTRY DIRECTORY PANEL CONTROL */}
        {activeTab === 'roster' && canManageRosterAndSponsors && (
          <div className="grid lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl shadow-lg">
              <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider border-b border-neutral-800 pb-2 mb-4">{editingMemberId ? 'Modify Roster Details' : 'Inject New Account Profile'}</h3>
              <form onSubmit={handleSaveRoster} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" placeholder="First Name" required value={rosterForm.name} onChange={(e) => setRosterForm({ ...rosterForm, name: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                  <input type="text" placeholder="Last Name" value={rosterForm.lastName || ''} onChange={(e) => setRosterForm({ ...rosterForm, lastName: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" placeholder="Suffix (e.g. Jr.)" value={rosterForm.suffix || ''} onChange={(e) => setRosterForm({ ...rosterForm, suffix: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                  <input type="text" placeholder="Username" value={rosterForm.username || ''} onChange={(e) => setRosterForm({ ...rosterForm, username: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono focus:border-amber-500 shadow-inner" />
                </div>
                <input type="text" placeholder="Functional Title Position" value={rosterForm.position} onChange={(e) => setRosterForm({ ...rosterForm, position: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" placeholder="Birthday Date String" required value={rosterForm.birthday} onChange={(e) => setRosterForm({ ...rosterForm, birthday: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                  <select value={rosterForm.role} onChange={(e) => setRosterForm({ ...rosterForm, role: e.target.value as any })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer">
                    <option value="Member">Regular Member</option>
                    <option value="Director">Club Director</option>
                    <option value="Officer">Club Officer</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-3 rounded-xl text-xs border-none cursor-pointer shadow-md transition-colors">Save Registry Record</button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-3xl shadow-lg overflow-hidden">
              <h3 className="text-sm font-black uppercase text-white border-b border-neutral-800 pb-2 mb-4">Official Membership Registry</h3>
              
              {/* Mobile Responsive Grid Flow Cards */}
              <div className="block sm:hidden space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-3">
                    <div>
                      <h4 className="text-xs font-black uppercase text-white">{u.name} {u.lastName || ''} {u.suffix || ''}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-amber-500 font-mono">@{u.username}</span>
                        <span className="text-[10px] text-neutral-400 font-mono uppercase bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">{u.role}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => { setEditingMemberId(u.id); setRosterForm(u); }} className="flex-1 bg-neutral-800 text-white text-[11px] py-2 rounded-xl border-none cursor-pointer">Edit</button>
                      <button onClick={() => triggerOfficerPasswordReset(u.name)} className="flex-1 bg-yellow-600/20 text-yellow-500 border border-yellow-500/20 text-[11px] py-2 rounded-xl cursor-pointer">Pass Override</button>
                      <button onClick={() => handleDeleteMember(u.id)} className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] py-2 rounded-xl cursor-pointer">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                      <th className="p-3">Identity Profile</th>
                      <th className="p-3">Role Tier Assignment</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-neutral-800/40 hover:bg-neutral-950/30 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-white">{u.name} {u.lastName || ''} {u.suffix || ''}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">@{u.username}</p>
                        </td>
                        <td className="p-3 uppercase font-mono text-amber-500 font-bold">{u.role}</td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button onClick={() => { setEditingMemberId(u.id); setRosterForm(u); }} className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1.5 rounded-lg text-[11px] border-none cursor-pointer transition">Edit</button>
                          <button onClick={() => triggerOfficerPasswordReset(u.name)} className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-500 border border-yellow-500/20 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition">Reset Pass</button>
                          <button onClick={() => handleDeleteMember(u.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SPONSORS NETWORK DIRECTORY */}
        {activeTab === 'sponsors' && canManageRosterAndSponsors && (
          <div className="grid lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl shadow-lg">
              <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider border-b border-neutral-800 pb-2 mb-4">{editingSponsorName ? 'Modify Partner Details' : 'Register Corporate Sponsor'}</h3>
              <form onSubmit={handleSaveSponsor} className="space-y-4">
                <input type="text" placeholder="Brand Name" required value={sponsorForm.name} onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                <input type="text" placeholder="Short Code (Fallback Text)" value={sponsorForm.fallbackText} onChange={(e) => setSponsorForm({ ...sponsorForm, fallbackText: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                <input type="text" placeholder="Destination Website URL" value={sponsorForm.url} onChange={(e) => setSponsorForm({ ...sponsorForm, url: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Business Logo Route</label>
                  <input type="text" placeholder="Relative Image Asset Route Link" value={sponsorForm.logoImage} onChange={(e) => setSponsorForm({ ...sponsorForm, logoImage: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono mb-2 outline-none focus:border-amber-500 shadow-inner" />
                  <input type="file" ref={sponsorImageRef} onChange={handleSponsorImageSimulate} className="hidden" />
                  <button type="button" onClick={() => sponsorImageRef.current?.click()} className="w-full bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-white py-2 text-[10px] rounded-xl uppercase font-black tracking-wider transition cursor-pointer">Upload Brand Logo</button>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-3 rounded-xl text-xs border-none cursor-pointer shadow-md transition-colors">Commit Partner Node</button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-3xl shadow-lg overflow-hidden">
              <h3 className="text-sm font-black uppercase text-white border-b border-neutral-800 pb-2 mb-4">Corporate Sponsors Grid</h3>
              
              {/* Mobile View Renders */}
              <div className="block sm:hidden space-y-3">
                {sponsors.map((s) => (
                  <div key={s.name} className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-mono font-bold text-amber-500 shadow-inner">{s.fallbackText.substring(0, 2)}</span>
                      <div>
                        <h4 className="text-xs font-black uppercase text-white">{s.name}</h4>
                        <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{s.fallbackText}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingSponsorName(s.name); setSponsorForm(s); }} className="flex-1 bg-neutral-800 text-white text-xs py-2 rounded-xl border-none cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteSponsor(s.name)} className="flex-1 bg-red-500/20 text-red-400 text-xs py-2 rounded-xl border border-red-500/30 cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                      <th className="p-3">Partner Brand</th>
                      <th className="p-3">Code</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsors.map((s) => (
                      <tr key={s.name} className="border-b border-neutral-800/40 hover:bg-neutral-950/30 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[10px] font-mono text-amber-400 shadow-inner">{s.fallbackText.substring(0, 2)}</span>
                          {s.name}
                        </td>
                        <td className="p-3 font-mono text-neutral-400">{s.fallbackText}</td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <button onClick={() => { setEditingSponsorName(s.name); setSponsorForm(s); }} className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg border-none cursor-pointer transition">Edit</button>
                          <button onClick={() => handleDeleteSponsor(s.name)} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30 cursor-pointer transition">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: WordPress ACF STYLE PLUGIN CONTROLLER ENGINE */}
        {activeTab === 'site_editor' && canManageRosterAndSponsors && (
          <div className="bg-neutral-900 border border-neutral-800 p-5 sm:p-6 rounded-3xl space-y-6 shadow-lg animate-fadeIn">
            <div>
              <span className="text-amber-500 text-[10px] font-black uppercase font-mono block">Advanced Custom Fields CMS Configuration Engine</span>
              <h3 className="text-base font-black uppercase text-white tracking-wide mt-0.5">ACF Content Controller Layout</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-900/40">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-neutral-900 pb-2 font-mono">&lfloor; Text Blocks Map</h4>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Banner Hero Main Title</label>
                  <input type="text" value={siteContent.heroTitle} onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Hero Section Subtitle copy</label>
                  <input type="text" value={siteContent.heroSubtitle} onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-neutral-900 pb-2 font-mono">&lfloor; Hyperlinks & Assets</h4>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">CTA Destination URL Route</label>
                  <input type="text" value={siteContent.ctaLink} onChange={(e) => setSiteContent({ ...siteContent, ctaLink: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono focus:border-amber-500 shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Visual Hero Presentation Image Route</label>
                  <input type="text" value={siteContent.heroImage} onChange={(e) => setSiteContent({ ...siteContent, heroImage: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono focus:border-amber-500 shadow-inner" />
                </div>
              </div>
            </div>

            {/* restricted widget layer container */}
            {isAdmin && (
              <div className="bg-neutral-950 border border-dashed border-neutral-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase text-white flex items-center gap-2 font-mono">
                    <span>🧱</span> Elementor Section Structural Injector
                  </h4>
                  <p className="text-[11px] text-neutral-400">Inject raw component dynamic containers into layout nodes grids context.</p>
                </div>
                
                <form onSubmit={handleAddCustomSection} className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    required
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="e.g. ActivityGridContainerBlock" 
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none flex-1 font-mono focus:border-amber-500 shadow-inner"
                  />
                  <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider border-none cursor-pointer shadow-md transition-colors">Inject Container</button>
                </form>

                {siteContent.customSections.length > 0 && (
                  <div className="pt-2">
                    <span className="block text-[10px] uppercase font-bold text-neutral-500 mb-1.5 font-mono">Custom Elementor Section Manifest:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {siteContent.customSections.map((sect, sidx) => (
                        <span key={sidx} className="bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-[11px] px-3 py-1 rounded-lg shadow-sm">
                          &lt;{sect} /&gt;
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-neutral-800 pt-4 flex justify-end">
              <button onClick={handleACFFieldSave} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest px-6 py-3.5 rounded-xl text-xs border-none cursor-pointer transition-colors shadow-md">
                Enforce Build Overrides
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: ELEMENTOR THEME CUSTOMIZER DECK */}
        {activeTab === 'theme_customizer' && isAdmin && (
          <div className="bg-neutral-900 border border-neutral-800 p-5 sm:p-6 rounded-3xl space-y-6 shadow-lg animate-fadeIn">
            <div>
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest block font-mono">Master Setup Systems Node</span>
              <h3 className="text-base font-black uppercase text-white tracking-wide">Elementor Visual Theme Customizer</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-900/40 space-y-4">
                <h4 className="text-xs font-black uppercase text-white border-b border-neutral-900 pb-2 font-mono">&lfloor; UI Canvas Modifiers</h4>
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Mouse Style Icon</label>
                  <input type="text" value={themeConfig.mouseLogo} onChange={(e) => setThemeConfig({ ...themeConfig, mouseLogo: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Global Site Favicon Path</label>
                  <input type="text" value={themeConfig.favicon} onChange={(e) => setThemeConfig({ ...themeConfig, favicon: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 shadow-inner" />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Global Color Palette Selection</label>
                  <select value={themeConfig.colorPalette} onChange={(e) => setThemeConfig({ ...themeConfig, colorPalette: e.target.value as any })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer">
                    <option value="default">Default Obsidian Slate</option>
                    <option value="amber">Rotary Gold Amber</option>
                    <option value="blue">Humanitarian Ocean Blue</option>
                    <option value="emerald">Legacy Emerald Green</option>
                    <option value="rose">Disease Prevention Crimson Rose</option>
                  </select>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-900/40 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-white border-b border-neutral-900 pb-2 font-mono">&lfloor; Platform Operations Gate</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed text-justify">
                    Enabling the maintenance wall restricts portal rendering channels entirely. Only Admin credentials can sign into the platform while active.
                  </p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                  <div>
                    <span className="block text-xs font-black uppercase text-white">Maintenance Flag</span>
                    <span className="text-[10px] text-neutral-500 font-mono uppercase font-bold">Status: {isMaintenanceMode ? 'Locked' : 'Open'}</span>
                  </div>
                  <button 
                    onClick={() => confirmChange(`Modify global operational accessibility states?`, () => {
                      setIsMaintenanceMode(!isMaintenanceMode);
                      logAction('Platform Security Gate', `Toggled website maintenance flag node states to: ${!isMaintenanceMode}`);
                    })} 
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black uppercase border-none cursor-pointer tracking-wider transition ${isMaintenanceMode ? 'bg-red-500 text-white shadow-md' : 'bg-neutral-800 text-neutral-300 hover:text-white'}`}
                  >
                    {isMaintenanceMode ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: LOG SHEET SECURITY HISTORY LAYER DATA */}
        {activeTab === 'audit_logs' && canManageRosterAndSponsors && (
          <div className="bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-3xl space-y-6 shadow-lg animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest block font-mono">Operational History Logger Framework</span>
                <h3 className="text-base font-black uppercase text-white tracking-wide mt-0.5">ACF Content Live History Log Sheet</h3>
              </div>
              <button onClick={exportLogsToCSV} className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-amber-500 font-black uppercase tracking-widest px-4 py-3 rounded-xl text-[10px] transition duration-200 shadow-sm cursor-pointer">
                📥 Extract Log Sheet (CSV)
              </button>
            </div>

            {/* Mobile Cards for Table */}
            <div className="block md:hidden space-y-3">
              {editLogs.map((l, i) => (
                <div key={i} className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl font-mono text-[11px] space-y-2">
                  <div className="flex justify-between border-b border-neutral-900 pb-1 text-[10px] text-neutral-400">
                    <span>{l.timestamp}</span>
                    <span className="text-amber-500 font-bold">@{l.user}</span>
                  </div>
                  <div>
                    <span className="text-white font-bold block uppercase text-[10px] tracking-wide mb-0.5">Module: {l.section}</span>
                    <p className="text-neutral-300 font-sans leading-normal">{l.changeDetails}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block max-h-[300px] overflow-y-auto custom-magazine-scrollbar border border-neutral-950 rounded-2xl bg-neutral-950 p-2 shadow-inner">
              <table className="w-full text-left font-mono text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-neutral-900 text-neutral-500 border-b border-neutral-800">
                    <th className="p-3">Timestamps</th>
                    <th className="p-3">User Operator</th>
                    <th className="p-3">Target Module</th>
                    <th className="p-3">Action Metrics Description</th>
                  </tr>
                </thead>
                <tbody>
                  {editLogs.map((l, i) => (
                    <tr key={i} className="border-b border-neutral-900/50 text-[11px] hover:bg-neutral-900/20 transition-colors">
                      <td className="p-3 text-neutral-400 whitespace-nowrap">{l.timestamp}</td>
                      <td className="p-3 text-amber-500 font-bold">@{l.user}</td>
                      <td className="p-3 text-white font-bold">{l.section}</td>
                      <td className="p-3 text-neutral-300 font-sans">{l.changeDetails}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}