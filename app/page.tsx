/// <reference types="styled-jsx" />
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CustomCursor } from '@/components/CustomCursor';

// Define strict interfaces to satisfy the TypeScript compiler and prevent build failure
interface RotaryUser {
  id: number;
  name: string;
  role: string;
  position: string;
  isOfficer: boolean;
  isDirector: boolean;
  image: string;
  birthday: string;
  username?: string; // Optional to prevent missing property errors
  email?: string;    // Optional to prevent missing property errors
  directorPosition?: string;
  lastName?: string;  // Added for future explicit overrides
  suffix?: string;    // Added for clean separation if needed
  // Phase 2 Fields
  occupation?: string;
  address?: string;
  contactNumber?: string;
}

// Phase 2: System Bulletin/Announcement Interface
interface ClubAnnouncement {
  id: number;
  title: string;
  date: string;
  content: string;
  comments: Array<{ id: number; userName: string; text: string; date: string }>;
}

// =================================================================
// COFFEE-TABLE MAGAZINE VALIDATED DATABASES (RY 2026-2027 ROSTERS)
// =================================================================
const initialUsers: RotaryUser[] = [
  // RY 2026-2027 OFFICERS
  { id: 1, name: "Arvin Jason Andaya", role: "Officer", position: "Club President", isOfficer: true, isDirector: false, image: "/members/Arvin Jayson Andaya.png", birthday: "March 9", username: "arvinjasonandaya", email: "arvin@rcmeycauayanmetro.org", occupation: "Business Executive", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4567" },
  { id: 2, name: "Diosdado Alvarado", role: "Officer", position: "Vice President", isOfficer: true, isDirector: false, image: "/members/Diosdado Alvarado.png", birthday: "December 9", username: "diosdadoalvarado", email: "diosdado@rcmeycauayanmetro.org", occupation: "Engineer", address: "Meycauayan, Bulacan", contactNumber: "+63 917 234 5678" },
  { id: 3, name: "Daniel Cuyos", role: "Officer", position: "President Elect", isOfficer: true, isDirector: false, image: "/members/Daniel Cuyos.png", birthday: "April 11", username: "danielcuyos", email: "daniel@rcmeycauayanmetro.org", occupation: "Creative Director", address: "Meycauayan, Bulacan", contactNumber: "+63 917 345 6789" },
  { id: 4, name: "Rosemarie Valencia", role: "Officer", position: "Club Secretary", isOfficer: true, isDirector: true, directorPosition: "Club Administration Director", image: "/members/Rosemarie Valencia.png", birthday: "August 14", username: "rosemarievalencia", email: "rosemarie@rcmeycauayanmetro.org", occupation: "Administrator", address: "Meycauayan, Bulacan", contactNumber: "+63 917 456 7890" },
  { id: 5, name: "Adrian Go", role: "Officer", position: "Executive Secretary", isOfficer: true, isDirector: true, directorPosition: "Public Image Director", image: "/members/Adrian Go.png", birthday: "November 19", username: "adriango", email: "adrian@rcmeycauayanmetro.org", occupation: "Public Relations Specialist", address: "Meycauayan, Bulacan", contactNumber: "+63 917 567 8901" },
  { id: 6, name: "Mark Christian Aloran", role: "Officer", position: "Club Treasurer", isOfficer: true, isDirector: false, image: "/members/Mark Christian Aloran.png", birthday: "November 15", username: "markchristianaloran", email: "mark@rcmeycauayanmetro.org", occupation: "Financial Officer", address: "Meycauayan, Bulacan", contactNumber: "+63 917 678 9012" },
  { id: 7, name: "April Homoroc", role: "Officer", position: "Club Auditor", isOfficer: true, isDirector: false, image: "/members/April Homoroc.png", birthday: "December 20", username: "aprilhomoroc", email: "april@rcmeycauayanmetro.org", occupation: "Certified Public Accountant", address: "Meycauayan, Bulacan", contactNumber: "+63 917 789 0123" },
  { id: 8, name: "Eric Homoroc", role: "Officer", position: "PRO", isOfficer: true, isDirector: false, image: "/members/Eric Homoroc.png", birthday: "October 13", username: "erichomoroc", email: "eric@rcmeycauayanmetro.org", occupation: "Marketing Consultant", address: "Meycauayan, Bulacan", contactNumber: "+63 917 890 1234" },
  // INDEPENDENT CLUB DIRECTORS / LEADERSHIP MARGINS
  { id: 9, name: "Angelito Ferrer", role: "Super Admin", position: "Immediate Past President", isOfficer: false, isDirector: true, directorPosition: "Rotary Foundation Director", image: "/members/Angelito Ferrer.png", birthday: "November 2", username: "angelitoferrer", email: "angelito@rcmeycauayanmetro.org", occupation: "Consultant", address: "Meycauayan, Bulacan", contactNumber: "+63 917 901 2345" },
  { id: 10, name: "Jaquelyn Jacob", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Club Membership Director", image: "/members/Jackie Halasan.png", birthday: "July 21", username: "jackiehalasan", email: "jackie@rcmeycauayanmetro.org", occupation: "Corporate Manager", address: "Meycauayan, Bulacan", contactNumber: "+63 917 012 3456" },
  { id: 11, name: "Raymond Peralta", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Service Project Director", image: "/members/Raymond Peralta.png", birthday: "January 10", username: "raymondperalta", email: "raymond@rcmeycauayanmetro.org", occupation: "Business Owner", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4500" },
  { id: 12, name: "Severino Pascual", suffix: "Jr.", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Youth Service Director", image: "/members/Severino Pascual Jr.png", birthday: "July 27", username: "severinopascual", email: "severinopascual@rcmeycauayanmetro.org", occupation: "Educator", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4511" },
  { id: 13, name: "Jayson Fernandez", role: "Officer", position: "Assistant Governor", isOfficer: false, isDirector: true, directorPosition: "Protocol Officer", image: "/members/Jayson Fernandez.png", birthday: "July 13", username: "jaysonfernandez", email: "jayson@rcmeycauayanmetro.org", occupation: "Public Servant", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4522" },
  { id: 14, name: "Francis Jay Dela Cruz", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Club Learning Facilitator", image: "/members/Francis Jay Dela Cruz.png", birthday: "December 21", username: "francisjaydelacruz", email: "francis@rcmeycauayanmetro.org", occupation: "Corporate Trainer", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4533" },
  { id: 18, name: "Felix Domigpe", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Felix Domigpe.png", birthday: "November 5", username: "felixdomigpe", email: "felix@rcmeycauayanmetro.org", occupation: "Entrepreneur", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4544" },
  { id: 19, name: "Pablito Javier", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Pablito Javier.png", birthday: "January 5", username: "pablitojavier", email: "pablito@rcmeycauayanmetro.org", occupation: "Merchant", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4555" },
  { id: 20, name: "Frederick Malapit", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Frederick Malapit.png", birthday: "July 12", username: "frederickmalapit", email: "frederick@rcmeycauayanmetro.org", occupation: "Real Estate Agent", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4566" },
  { id: 21, name: "Enrique Milan", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Enrique Milan.png", birthday: "March 1", username: "enriquemilan", email: "enrique@rcmeycauayanmetro.org", occupation: "Medical Practitioner", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4577" },
  { id: 22, name: "Ma. Carmela Osiones", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Ma Carmela Osiones.png", birthday: "July 7", username: "macarmelaosiones", email: "carmela@rcmeycauayanmetro.org", occupation: "Financier", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4588" },
  { id: 23, name: "Willy Sy", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Willy Sy.png", birthday: "March 12", username: "willysy", email: "willy@rcmeycauayanmetro.org", occupation: "Retailer", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4599" },
  { id: 24, name: "Richard Becerro", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Richard Becerro.png", birthday: "May 16", username: "richardbecerro", email: "richard@rcmeycauayanmetro.org", occupation: "Supplier", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4611" },
  { id: 25, name: "Ramil Inopia Burdin", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Ramil Inopia Burdin.png", birthday: "August 16", username: "ramilinopia", email: "ramil@rcmeycauayanmetro.org", occupation: "Contractor", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4622" },
  { id: 26, name: "Morris Delos Santos", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Morris Delos Santos.png", birthday: "November 17", username: "morrisdelossantos", email: "morris@rcmeycauayanmetro.org", occupation: "Designer", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4633" },
  { id: 27, name: "Edgardo Ambray", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Edgardo Ambray.jpeg", birthday: "December 29", username: "edgardoombray", email: "edgardo@rcmeycauayanmetro.org", occupation: "Technologist", address: "Meycauayan, Bulacan", contactNumber: "+63 917 123 4644" }
];

const initialActivities = [
  { id: 1, type: 'Project', title: "Global Grant Health Initiative (GG2517783)", category: "Disease Prevention & Treatment", description: "Deploying targeted diagnostic facility clusters and essential clinical resources to localized sectors.", fullDescription: "This targeted global grant health blueprint coordinates specialized cluster installations alongside active diagnostic operations across dense municipal hubs.", status: "Completed", detail: "Global Grant Verification Compliance Complete", galleryImages: ["/carousel 3.jpg"] },
  { id: 2, type: 'Project', title: "WASH Clean Water Hub Infrastructure", category: "Water, Sanitation, & Hygiene", description: "Constructing physical water delivery nodes and comprehensive sanitation framework units for high-need zones.", fullDescription: "Deploying physical resource delivery terminals coupled with multi-stage micro-filtration block architecture grids for surrounding residential pockets.", status: "Ongoing", detail: "WASH Infrastructure Deployment Grid", galleryImages: ["/carousel 2.jpg"] },
  { id: 3, type: 'News', title: "24th Handover and Induction Ceremony Success", category: "Club Assembly", description: "The club formally convened at the Matrix Creation Events Venue to install President Arvin Jayson Andaya and the incoming board.", fullDescription: "Formally convening incoming legislative executives and club directors into operational alignment benchmarks for the current administrative calendar layout.", status: "Completed", detail: "Inaugurated on July 29, 2026", galleryImages: ["/carousel 1.jpg"] },
  { id: 4, type: 'Project', title: "Meycauayan Youth Textbook & Literacy Drive", category: "Basic Education and Literacy", description: "Distributing full core primary catalog book blocks and implementing reading systems in public facilities.", fullDescription: "Distributing robust foundational media blocks and textual libraries to expand primary development track records within localized school clusters.", status: "Completed", detail: "Empowering Next-Gen Scholars", galleryImages: ["/carousel 1.jpg"] }
];

const carouselSlides = [
  { url: "/carousel 1.jpg", caption: "24th Induction Leadership Cascade — Matrix Creation Events Venue" },
  { url: "/carousel 2.jpg", caption: "WASH Infrastructure Clean Water Facility Deployments" },
  { url: "/carousel 3.jpg", caption: "Global Grant GG2517783 Medical Supply Cascade Forums" }
];

const officialMessages = [
  {
    title: "Message from the Assistant Governor",
    text: "It is both an honor and a privilege to serve as Assistant Governor for Rotary Year 2026–2027. Having previously served as President of the Rotary Club of Meycauayan Metro, I take great pride in seeing our club continue to grow in strength, fellowship, and service to the community. Rotary has always been about people coming together with a shared commitment to make a difference. As we embrace this year’s Rotary theme, “Create Lasting Impact,” we are reminded that our service should not only address present needs but also create meaningful and sustainable change that will benefit future generations. Our district continues to thrive because of the dedication of Rotarians who give their time, resources, and passion to serve others. Through strong collaboration among clubs, innovative community projects, and a spirit of fellowship, we can amplify the impact of Rotary in the communities we serve. I extend my warm congratulations to the officers and members of the Rotary Club of Meycauayan Metro as you celebrate your 23rd Handover and Induction Ceremony. May this milestone inspire every member to continue pursuing excellence in service and leadership. To the incoming President Arvin Jayson Andaya and the new set of officers, I wish you a successful and impactful Rotary year ahead. May your leadership further strengthen the club’s commitment to the ideals of Rotary International and its guiding principle of Service Above Self. Together, let us continue to serve with purpose, inspire others through our actions, and truly create lasting impact in our communities.",
    author: "Jayson Fernandez",
    meta: "Assistant Governor, RY 2026–2027 • District 3770",
    image: "/members/Jayson Fernandez.png"
  },
  {
    title: "Message from the Immediate Past President",
    text: "It has been both an honor and a privilege to serve as President of the Rotary Club of Meycauayan Metro during Rotary Year 2025–2026. Guided by the inspiring Rotary theme “Unite for Good,” our club came together with a shared purpose—to strengthen our fellowship and expand our service to the community. This Rotary year has shown us the true power of unity. When individuals come together with the same vision and dedication to service, extraordinary things can be achieved. Through the collective efforts of our members, partners, and supporters, we were able to carry out meaningful projects that addressed community needs and uplifted the lives of those we serve. I am deeply grateful to every Rotarian of our club whose commitment and passion made our initiatives possible. Your willingness to serve, your generosity, and your dedication to the Rotary ideals continue to embody the spirit of Service Above Self that defines the mission of Rotary International. As we gather for our 23rd Handover and Induction Ceremony, we celebrate not only the accomplishments of the past year but also the enduring legacy of service that our club continues to build. I extend my heartfelt congratulations to the incoming leaders and officers who will guide the club forward under the theme “Create Lasting Impact.” May we continue to stand together in fellowship and service, united in our commitment to make a difference in our community and beyond. Maraming salamat, and may Rotary continue to inspire us all to serve with compassion, integrity, and unity.",
    author: "Angelito Ferrer",
    meta: "Immediate Past President, RY 2025–2026",
    image: "/members/Angelito Ferrer.png"
  },
  {
    title: "Message from the President",
    text: "It is with great humility and gratitude that I accept the responsibility of serving as President of the Rotary Club of Meycauayan Metro for Rotary Year 2026–2027. I am deeply honored by the trust and confidence given to me by my fellow Rotarians, and I look forward to leading our club in another meaningful year of service and fellowship. As we begin this new Rotary year, we are inspired by the Rotary theme “Create Lasting Impact.” This theme reminds us that the true value of our service is not only measured by what we accomplish today, but by the lasting difference we make in the lives of the people and communities we serve. Building on the strong foundation laid by our past leaders and members, our club will continue to pursue projects that address real community needs, promote sustainable development, and strengthen partnerships with organizations that share our vision. Through collaboration, dedication, and the unwavering commitment of our members, we will strive to create programs that leave a meaningful and lasting legacy. I extend my heartfelt appreciation to our Immediate Past President, Angelito Ferrer, whose leadership under the theme “Unite for Good” has further strengthened the spirit of unity and service within our club. Because of this strong foundation, we move forward with renewed energy and purpose. As we celebrate our 23rd Handover and Induction Ceremony, I invite every member of the Rotary Club of Meycauayan Metro to continue working together with passion and commitment. Let us deepen our fellowship, expand our service, and remain steadfast in upholding the ideals of Rotary International and its guiding principle of Service Above Self. Together, let us continue to serve with purpose, lead with integrity, and truly create lasting impact in our community and beyond.",
    author: "Arvin Jayson Andaya",
    meta: "Club President, RY 2026–2027",
    image: "/members/Arvin Jayson Andaya.png"
  }
];

const areasOfFocus = [
  { id: 1, title: "Disease Prevention & Treatment", desc: "To educate and equip communities to stop the spread of life-threatening diseases like polio and to improve and expand access to low-cost and free health care in developing areas.", icon: "🩺" },
  { id: 2, title: "Water Sanitation and Hygiene", desc: "To support local solutions to bring clean water, sanitation, and hygiene to more people everyday.", icon: "💧" },
  { id: 3, title: "Basic Education and Literacy", desc: "To strengthen the capacity of communities to support basic education and literacy, reduce gender disparity in education, and increase adult literacy.", icon: "📚" },
  { id: 4, title: "Community Economic Development", desc: "To enhance economic and community development and create opportunities for decent and productive work for young and old, and to strengthen local entrepreneurs and community leaders, particularly women, in impoverished communities.", icon: "📊" },
  { id: 5, title: "Peacebuilding & Conflict Prevention", desc: "To encourage conversations to foster understanding within and across cultures. To train adults and young leaders to prevent and mediate conflict.", icon: "🕊️" },
  { id: 6, title: "Maternal & Child Health", desc: "To expand access to quality care, so mothers and their children can live and grow stronger.", icon: "👶" },
  { id: 7, title: "Environment", desc: "To tackle environmental issues the way they always do: coming up with projects, using their connections to change policy and planning for the future.", icon: "🌍" }
];

// DATA MATRIX: VERIFIED RELATIVE PUBLIC IMAGE DOMAIN REFERENCES
const corporateSponsors = [
  { name: "Evergold Memorial Services", logoImage: "/partner-evergold-logo.jpg", fallbackText: "EMS", url: "https://www.facebook.com/evergoldmemorialservice" },
  { name: "Trident Assessment and Technical Training Center, Inc.", logoImage: "/partner-trident-logo.jpg", fallbackText: "TAATTC", url: "https://www.facebook.com/profile.php?id=100093554252998" },
  { name: "The Pixels Inc.", logoImage: "/partner-thepixelsinc-logo.png", fallbackText: "TPI", url: "https://www.thepixelsinc.com/" },
  { name: "Dr. H Centro Estetico", logoImage: "/partner-dr-h-centro-estetico-logo.jpg", fallbackText: "DRH", url: "https://www.facebook.com/DrHCentroEstetico" },
  { name: "Rotary International", logoImage: "/partner-rotary-international.png", fallbackText: "RI", url: "https://www.rotary.org/en" },
  { name: "Cityblinds Enterprises", logoImage: "/partner-cityblinds-logo.jpg", fallbackText: "CE", url: "https://www.facebook.com/profile.php?id=61591280907892" },
  { name: "EM Builders", logoImage: "/partner-em-builders-logo.jpg", fallbackText: "EMB", url: "https://www.facebook.com/profile.php?id=100063686025704" },
  { name: "J4 Squad Events & Management", logoImage: "/partner-j4-squad-logo.jpeg", fallbackText: "J4S", url: "#" },
  { name: "Suds Go - Project 6", logoImage: "/partner-suds-go-project-6.jpg", fallbackText: "SGP6", url: "https://www.facebook.com/sudsgoproject6" },
  { name: "Metrogreen Technologies Corporation", logoImage: "/partner-metrogreen-technologies-corporation.jpg", fallbackText: "MCG", url: "https://www.facebook.com/metrogreentech" },
  { name: "ADS Modular Concept", logoImage: "/partner-ads-modular-concept.jpeg", fallbackText: "ADC", url: "https://www.facebook.com/profile.php?id=61560490317848" },
  { name: "Kornbeats Manila Music Production", logoImage: "/partner-kornbeats-manila.jpeg", fallbackText: "KMM", url: "https://www.facebook.com/profile.php?id=100083273196111" },
  { name: "Cuyos' Arts and Customized Frames", logoImage: "/partner-cuyos.JPG", fallbackText: "CAF", url: "https://www.facebook.com/cuyosartsandframes" },
  { name: "TFDS UPVC Windows & Doors", logoImage: "/partner-tfds-upvc-windows-and-doors.jpg", fallbackText: "TFDS", url: "https://www.facebook.com/tfdsupvcsupply" }
];

const monthMap: { [key: string]: number } = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // =================================================================
  // BIRTHDAY ANNOUNCEMENT STATE & COMPLIANCE PARAMS
  // =================================================================
  const [celebratedUser, setCelebratedUser] = useState<RotaryUser | null>(null);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);

  // =================================================================
  // PHASE 2 PORTAL STATE MANAGEMENT
  // =================================================================
  const [users, setUsers] = useState<RotaryUser[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<RotaryUser | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Custom Background Music Path Track State
  const [bgMusic, setBgMusic] = useState<string>('/audio/rotary-anthem.mp3');

  // WordPress-Style Content Customizer State (ACF-like)
  const [editableSections, setEditableSections] = useState({
    carousel: [...carouselSlides],
    whoWeAre: {
      title: "Introduction",
      body: [
        "Guided by the enduring Rotary principle of Service Above Self, the Rotary International community continues to transform lives through meaningful service and strong fellowship. Each Rotary year offers a renewed opportunity for Rotarians to make a difference in their communities and beyond.",
        "As we celebrate the 24th Handover and Induction Ceremony of the Rotary Club of Meycauayan Club, we reflect on the remarkable journey of service that has shaped our club. This milestone marks not only the transition of leadership but also a reaffirmation of our shared commitment to Rotary’s mission.",
        "Anchored in this year’s Rotary theme, “Create Lasting Impact,” our club continues to pursue initiatives that bring sustainable and meaningful change to the communities we serve. Through collaborative projects, humanitarian programs, and the dedication of our members, we strive to ensure that our efforts today will leave a positive legacy for generations to come."
      ]
    },
    rotaryCode: {
      fourwayTest: [
        "Is it the truth?",
        "Is it fair to all concerned?",
        "Will it build goodwill and better friendships?",
        "Will it be beneficial to all concerned?"
      ]
    },
    areasOfFocus: [...areasOfFocus]
  });

  // Bulletins / Club Announcements State
  const [announcements, setAnnouncements] = useState<ClubAnnouncement[]>([
    {
      id: 1,
      title: "Upcoming Community Medical & Diagnostic Mission",
      date: "August 15, 2026",
      content: "We will coordinate targeted clinic operations to service local sectors. Volunteer shifts are open.",
      comments: [
        { id: 1, userName: "Arvin Jason Andaya", text: "Looking forward to working alongside all units on this drive.", date: "2026-07-15" }
      ]
    },
    {
      id: 2,
      title: "RY 2026-2027 General Membership Assembly Meeting",
      date: "September 02, 2026",
      content: "Convening incoming committee alignment parameters. Physical attendance is expected.",
      comments: []
    }
  ]);

  // Activity Database State
  const [activities, setActivities] = useState(initialActivities);

  // Administrative / User Creator States
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Member');
  const [newUserPosition, setNewUserPosition] = useState('Active Member');
  const [newUserBirthday, setNewUserBirthday] = useState('January 1');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Comment Creation States
  const [newCommentText, setNewCommentText] = useState<{ [announcementId: number]: string }>({});

  // ACF Editor Overlay Control
  const [isAcfEditorOpen, setIsAcfEditorOpen] = useState(false);

  // Profile Edit States
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editSuffix, setEditSuffix] = useState('');
  const [editOccupation, setEditOccupation] = useState('');
  const [editBirthday, setEditBirthday] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editImage, setEditImage] = useState('');

  // Announcement Creation States (For Dashboard)
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnDate, setNewAnnDate] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');

  // Project Creation States
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('Disease Prevention & Treatment');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjType, setNewProjType] = useState<'Project' | 'News'>('Project');
  const [newProjDetail, setNewProjDetail] = useState('');

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Dynamic verification engine scanning rosters matching the current client calendar timeline date strings
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthIndex = today.getMonth() + 1; // 1-12 range conversion

    const birthdayMatch = initialUsers.find(user => {
      if (!user.birthday) return false;
      const tokens = user.birthday.trim().toLowerCase().split(/\s+/);
      if (tokens.length < 2) return false;
      const userMonthValue = monthMap[tokens[0]] || 0;
      const userDayValue = parseInt(tokens[1], 10) || 0;
      return userMonthValue === currentMonthIndex && userDayValue === currentDay;
    });

    if (birthdayMatch) {
      setCelebratedUser(birthdayMatch);
      setShowBirthdayModal(true);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync profile editing inputs when currentUser shifts
  useEffect(() => {
    if (currentUser) {
      const nameParts = currentUser.name.split(' ');
      setEditFirstName(nameParts[0] || '');
      setEditLastName(nameParts.slice(1).join(' ') || '');
      setEditSuffix(currentUser.suffix || '');
      setEditOccupation(currentUser.occupation || '');
      setEditBirthday(currentUser.birthday || '');
      setEditAddress(currentUser.address || '');
      setEditEmail(currentUser.email || '');
      setEditContact(currentUser.contactNumber || '');
      setEditImage(currentUser.image || '');
    }
  }, [currentUser]);

  const hydration = { suppressHydrationWarning: true };
  const [activeForm, setActiveForm] = useState<'inquiry' | 'member' | 'donate'>('inquiry');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Project' | 'News'>('All');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'fourway' | 'objectives' | 'vision' | 'endpolio'>('fourway');
  const [activeVisionaryTab, setActiveVisionaryTab] = useState<'officers' | 'directors' | 'roster'>('officers');
  
  const [rosterSortCriteria, setRosterSortCriteria] = useState<'surname' | 'birthday'>('surname');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ongoing' | 'Completed'>('All');
  const [activityPage, setActivityPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [modalActiveImage, setModalActiveImage] = useState<string>('');
  const [isFullscreenLightbox, setIsFullscreenLightbox] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Pagination State Variables
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 4 : 8;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  // State handles for updated project donations tab
  const [selectedCause, setSelectedCause] = useState<string>('disease-prevention');

  // =================================================================
  // MASONRY GRID ADAPTIVE LOCAL COMPONENT AND ASSET POOL CONFIGURATION
  // =================================================================
  const masonryImages = [
    '/masonry/connect.jpg',
    '/masonry/fight-hunger.jpg',
    '/masonry/inspire.jpg',
    '/masonry/mentor.jpg',
    '/masonry/transform.jpg',
    '/masonry/image-1.jpg',
    '/masonry/image-2.jpg',
    '/masonry/image-3.jpg',
    '/masonry/image-4.jpg',
    '/masonry/image-5.jpg',
    '/masonry/image-6.jpg',
    '/masonry/image-7.jpg',
    '/masonry/image-8.jpg',
    '/masonry/image-9.jpg',
    '/masonry/image-10.jpg',
    '/masonry/image-11.jpg',
    '/masonry/image-12.jpg',
    '/masonry/image-13.jpg',
    '/masonry/image-14.jpg',
    '/masonry/image-15.jpg',
    '/masonry/image-16.jpg',
    '/masonry/image-17.jpg',
    '/masonry/image-18.jpg',
    '/masonry/image-19.jpg',
    '/masonry/image-20.jpg'
  ];

  const initialTiles = [
    { id: 0, frontImg: '/masonry/fight-hunger.jpg', backImg: '/masonry/connect.jpg', gridClass: 'col-span-2 row-span-2 min-h-[280px] sm:min-h-[340px]', flipped: false },
    { id: 1, frontImg: '/masonry/inspire.jpg', backImg: '/masonry/mentor.jpg', gridClass: 'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]', flipped: false },
    { id: 2, frontImg: '/masonry/transform.jpg', backImg: '/masonry/fight-hunger.jpg', gridClass: 'col-span-1 row-span-2 min-h-[280px] sm:min-h-[340px]', flipped: false },
    { id: 3, frontImg: '/masonry/mentor.jpg', backImg: '/masonry/inspire.jpg', gridClass: 'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]', flipped: false },
    { id: 4, frontImg: '/masonry/connect.jpg', backImg: '/masonry/transform.jpg', gridClass: 'col-span-2 row-span-1 min-h-[140px] sm:min-h-[160px]', flipped: false },
    { id: 5, frontImg: '/masonry/fight-hunger.jpg', backImg: '/masonry/mentor.jpg', gridClass: 'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]', flipped: false },
    { id: 6, frontImg: '/masonry/inspire.jpg', backImg: '/masonry/connect.jpg', gridClass: 'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]', flipped: false }
  ];

  const [tiles, setTiles] = useState(initialTiles);

  useEffect(() => {
    if (!mounted) return;

    const intervals = tiles.map((tile, index) => {
      const timingOptions = [6000, 7500, 9000];
      const selectedDelay = timingOptions[index % timingOptions.length];

      return setInterval(() => {
        setTiles(prevTiles => {
          return prevTiles.map(t => {
            if (t.id === tile.id) {
              const randomPick = masonryImages[Math.floor(Math.random() * masonryImages.length)];
              return {
                ...t,
                frontImg: t.flipped ? randomPick : t.frontImg,
                backImg: !t.flipped ? randomPick : t.backImg,
                flipped: !t.flipped
              };
            }
            return t;
          });
        });
      }, selectedDelay);
    });

    return () => intervals.forEach(clearInterval);
  }, [mounted]);

  const allProcessedActivities = activities.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activityFilter === 'All' || item.type === activityFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const activityItemsPerPage = 6;
  const totalActivityPages = Math.ceil(allProcessedActivities.length / activityItemsPerPage);
  const paginatedActivities = allProcessedActivities.slice(
    (activityPage - 1) * activityItemsPerPage, 
    activityPage * activityItemsPerPage
  );

  const openActivityModal = (activity: any) => {
    setSelectedActivity(activity);
    setModalActiveImage(activity?.galleryImages?.[0] || '/rotary-logo.png'); 
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % editableSections.carousel.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? editableSections.carousel.length - 1 : prev - 1));
  };

  const handleNextMessage = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % officialMessages.length);
  };

  const handlePrevMessage = () => {
    setCurrentMessageIndex((prev) => (prev === 0 ? officialMessages.length - 1 : prev - 1));
  };

  // RESPONSIVE AUTOMATED INTERMITTENT STREAM
  useEffect(() => {
    if (!mounted || isHovered) return;
    const contextInterval = window.innerWidth < 640 ? 5000 : 6000;
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % editableSections.carousel.length);
    }, contextInterval);
    return () => clearInterval(slideTimer);
  }, [isHovered, mounted, editableSections.carousel]);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollButton(currentScrollY > 400);

      if (currentScrollY < 50) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        if (!mobileMenuOpen) setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, mounted]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeVisionaryTab, rosterSortCriteria, isMobile]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;

    const headerOffset = window.innerWidth >= 768 ? 84 : 70;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const getFilteredAndSortedVisionaries = () => {
    const subset = users.filter(user => {
      if (activeVisionaryTab === 'officers') return user.isOfficer;
      if (activeVisionaryTab === 'directors') return user.isDirector;
      return true;
    });

    if (activeVisionaryTab === 'roster') {
      return [...subset].sort((a, b) => {
        if (rosterSortCriteria === 'surname') {
          const parseLastName = (u: RotaryUser) => {
            if (u.lastName) return u.lastName.toLowerCase().trim();
            const cleaned = u.name.replace(/\s+(jr\.|sr\.|iii|ii|iv|v|juniour)(\s+|$)/i, '').trim();
            const tokens = cleaned.split(/\s+/);
            if (tokens.length <= 1) return cleaned.toLowerCase();

            const lowSec = tokens[tokens.length - 2].toLowerCase();
            const lowThird = tokens.length > 2 ? tokens[tokens.length - 3].toLowerCase() : "";

            if (lowSec === "delos" || lowSec === "dela" || lowSec === "de" || lowSec === "san") {
              return tokens.slice(tokens.length - 2).join(" ").toLowerCase();
            }
            if (lowThird === "de" && lowSec === "los") {
              return tokens.slice(tokens.length - 3).join(" ").toLowerCase();
            }
            return tokens[tokens.length - 1].toLowerCase();
          };

          return parseLastName(a).localeCompare(parseLastName(b));
        } else {
          const [monthStrA, dayStrA] = a.birthday.trim().toLowerCase().split(/\s+/);
          const [monthStrB, dayStrB] = b.birthday.trim().toLowerCase().split(/\s+/);
          
          const monthValA = monthMap[monthStrA] || 0;
          const monthValB = monthMap[monthStrB] || 0;
          
          if (monthValA !== monthValB) return monthValA - monthValB;
          
          const dayValA = parseInt(dayStrA, 10) || 0;
          const dayValB = parseInt(dayStrB, 10) || 0;
          return dayValA - dayValB;
        }
      });
    }
    return subset;
  };

  const allFilteredVisionaries = getFilteredAndSortedVisionaries();
  const totalPages = Math.ceil(allFilteredVisionaries.length / itemsPerPage);
  const filteredVisionaries = allFilteredVisionaries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // =================================================================
  // PHASE 2 BUSINESS ACTIONS & SIMULATED PRIVILEGES
  // =================================================================
  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const targetUser = users.find(
      u => u.username?.toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (targetUser) {
      setCurrentUser(targetUser);
      setLoginModalOpen(false);
      setDashboardOpen(true);
    } else {
      setLoginError("Invalid member identifier username. Please cross-reference the official roster names.");
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated = {
      ...currentUser,
      name: `${editFirstName} ${editLastName}`.trim(),
      suffix: editSuffix,
      occupation: editOccupation,
      birthday: editBirthday,
      address: editAddress,
      email: editEmail,
      contactNumber: editContact,
      image: editImage || currentUser.image
    };

    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    setCurrentUser(updated);
    alert("Profile metrics synchronized successfully.");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (currentUser.position !== "Club President" && currentUser.position !== "Club Secretary")) {
      alert("Unauthorized hierarchy action.");
      return;
    }

    const newUser: RotaryUser = {
      id: Date.now(),
      name: newUserName,
      role: newUserRole,
      position: newUserPosition,
      isOfficer: newUserRole === "Officer",
      isDirector: newUserRole === "Director",
      image: "/members/placeholder.png",
      birthday: newUserBirthday,
      username: newUserUsername.toLowerCase(),
      email: newUserEmail
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserEmail('');
    alert(`Success: ${newUserName} added to club portal directory.`);
  };

  const handleDeleteUser = (userId: number) => {
    if (!currentUser || (currentUser.position !== "Club President" && currentUser.position !== "Club Secretary")) {
      alert("Unauthorized hierarchy action.");
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handlePromoteUser = (userId: number, newRole: string, newPosition: string) => {
    if (!currentUser || (currentUser.position !== "Club President" && currentUser.position !== "Club Secretary")) {
      alert("Unauthorized hierarchy action.");
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          position: newPosition,
          isOfficer: newRole === "Officer",
          isDirector: newRole === "Director"
        };
      }
      return u;
    }));
  };

  const handleAddComment = (announcementId: number) => {
    const text = newCommentText[announcementId];
    if (!text || !text.trim() || !currentUser) return;

    setAnnouncements(prev => prev.map(ann => {
      if (ann.id === announcementId) {
        return {
          ...ann,
          comments: [
            ...ann.comments,
            {
              id: Date.now(),
              userName: currentUser.name,
              text: text.trim(),
              date: new Date().toLocaleDateString()
            }
          ]
        };
      }
      return ann;
    }));

    setNewCommentText(prev => ({ ...prev, [announcementId]: '' }));
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.isOfficer) {
      alert("Unauthorized action. Only Officers have access to post announcements.");
      return;
    }

    const newAnnouncement: ClubAnnouncement = {
      id: Date.now(),
      title: newAnnTitle,
      date: newAnnDate,
      content: newAnnContent,
      comments: []
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setNewAnnTitle('');
    setNewAnnDate('');
    setNewAnnContent('');
    alert("New bulletin successfully published on member timeline.");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (!currentUser.isDirector && !currentUser.isOfficer)) {
      alert("Only Officers or Directors can add new projects/news.");
      return;
    }

    const newActivityObj = {
      id: Date.now(),
      type: newProjType,
      title: newProjTitle,
      category: newProjCategory,
      description: newProjDesc,
      fullDescription: newProjDesc,
      status: "Completed",
      detail: newProjDetail,
      galleryImages: ["/carousel 1.jpg"]
    };

    setActivities(prev => [newActivityObj, ...prev]);
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjDetail('');
    alert("Humanitarian record logged on portal pipeline.");
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-neutral-500 font-sans">
        Loading Portal Ecosystem...
      </main>
    );
  }

  return (
    <main id="top" className="min-h-screen bg-neutral-50 text-neutral-800 font-sans scroll-smooth relative overflow-x-hidden">
      
      {/* GLOBAL CUSTOM CURSOR COMPONENT */}
      <CustomCursor />
      
      <style jsx global>{`
        .custom-magazine-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-magazine-scrollbar::-webkit-scrollbar-track {
          background: #171717;
          border-radius: 999px;
        }
        .custom-magazine-scrollbar::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 999px;
          transition: background 0.2s ease-in-out;
        }
        .custom-magazine-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
        .custom-magazine-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d97706 #171717;
        }
        @keyframes infiniteMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-stream {
          display: flex;
          width: max-content;
          animation: infiniteMarquee 28s linear infinite;
        }
        .animate-marquee-stream:hover {
          animation-play-state: paused;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes floatConfetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute; width: 8px; height: 16px; top: -20px;
          animation: floatConfetti 4s linear infinite; pointer-events: none; z-index: 60;
        }
      `}</style>

      {/* =============================================================
          🆕 AUDIO PLAYER BACKGROUND ENGINE
          ============================================================= */}
      <div className="hidden">
        <audio autoPlay loop muted src={bgMusic} id="portal-bg-audio" />
      </div>

      {/* =============================================================
          🆕 PRE-ENTRY BIRTHDAY POP-UP COMPONENT (COMPLIANCE MODULE)
          ============================================================= */}
      {showBirthdayModal && celebratedUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          {Array.from({ length: 40 }).map((_, i) => {
            const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
            const randomColor = colors[i % colors.length];
            const randomLeft = Math.random() * 100;
            const randomDelay = Math.random() * 4;
            const randomTransform = Math.random() * 15 + 5;
            return (
              <div 
                key={i} 
                className="confetti-piece"
                style={{
                  left: `${randomLeft}%`,
                  backgroundColor: randomColor,
                  animationDelay: `${randomDelay}s`,
                  width: `${randomTransform}px`,
                  height: `${randomTransform / 2}px`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            );
          })}

          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 sm:p-10 shadow-2xl text-center border border-neutral-200 relative overflow-hidden animate-scaleUp flex flex-col items-center">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600" />
            <span className="text-3xl sm:text-4xl mb-4 select-none animate-bounce">🎉🎂🥳</span>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-700 border border-amber-500/20 px-4 py-1.5 rounded-full uppercase font-black tracking-widest inline-block shadow-sm mb-4">
              Rotary Birthday Celebration
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase leading-tight">
              Happy Birthday!
            </h2>
            <div className="my-6 w-28 h-28 rounded-full overflow-hidden border-4 border-amber-500/30 shadow-md relative bg-neutral-100">
              <img 
                src={celebratedUser.image.startsWith('/members/') ? celebratedUser.image : `/members/${celebratedUser.name.trim().replace(/\s+/g, '_')}.png`}
                alt={celebratedUser.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f5f5f5'/><text x='50%27 y='55%27 font-family='sans-serif' font-size='30' fill='%23d97706' text-anchor='middle'>👤</text></svg>";
                }}
              />
            </div>
            <h3 className="text-lg font-black text-amber-600 tracking-wide uppercase">
              {celebratedUser.name} {celebratedUser.suffix || ''}
            </h3>
            <p className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mt-1">
              {celebratedUser.directorPosition || celebratedUser.position}
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-xs mt-4 mb-6 font-normal">
              Wishing our fellow Rotarian a wonderful day filled with fellowship, joy, and service! Thank you for creating lasting impact.
            </p>
            <button
              onClick={() => setShowBirthdayModal(false)}
              className="w-full bg-black hover:bg-amber-500 text-white hover:text-black font-black py-4 rounded-xl transition border-none cursor-pointer text-xs uppercase tracking-wider shadow-lg outline-none select-none"
            >
              Enter Official Portal
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          1. SMART STICKY NAVIGATION BAR
          ============================================================= */}
      <header className={`sticky top-0 z-50 bg-black text-white shadow-md border-b border-neutral-800 transition-transform duration-300 transform ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex justify-between items-center relative">
          
          <button {...hydration} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white hover:text-amber-500 font-bold focus:outline-none text-2xl bg-transparent border-none cursor-pointer z-10">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          <a href="#top" onClick={(e) => scrollToSection(e, 'top')} className="flex items-center bg-transparent border-none outline-none cursor-pointer text-left no-underline select-none shrink-0 md:order-first">
            <img 
              src="/rotary-logo.png" 
              alt="Rotary Club of Meycauayan Metro" 
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-102"
            />
          </a>
          
          <nav className="hidden md:flex gap-6 lg:gap-8 text-xs uppercase tracking-widest font-bold items-center">
            <a href="#who-we-are" onClick={(e) => scrollToSection(e, 'who-we-are')} className="text-neutral-300 hover:text-amber-500 transition duration-300">Who We Are</a>
            <a href="#rotary-code" onClick={(e) => scrollToSection(e, 'rotary-code')} className="text-neutral-300 hover:text-amber-500 transition duration-300">Rotary Code</a>
            <a href="#focus-channels" onClick={(e) => scrollToSection(e, 'focus-channels')} className="text-neutral-300 hover:text-amber-500 transition duration-300">Areas of Focus</a>
            <a href="#visionaries" onClick={(e) => scrollToSection(e, 'visionaries')} className="text-neutral-300 hover:text-amber-500 transition duration-300">Visionaries</a>
            <a href="#projects-and-news" onClick={(e) => scrollToSection(e, 'projects-and-news')} className="text-neutral-300 hover:text-amber-500 transition duration-300">Projects & News</a>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <button onClick={() => setDashboardOpen(true)} className="bg-amber-500 border border-transparent text-black font-black px-5 py-2 rounded-full text-xs uppercase tracking-wider transition cursor-pointer">
                Portal Dashboard
              </button>
            ) : (
              <button onClick={() => setLoginModalOpen(true)} className="bg-transparent border border-neutral-700 text-neutral-200 hover:border-amber-500 hover:text-amber-500 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-wider transition cursor-pointer">
                Member Login
              </button>
            )}
            <button onClick={(e) => scrollToSection(e, 'contactus')} className="bg-transparent border border-neutral-700 text-neutral-200 hover:border-amber-500 hover:text-amber-500 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-wider transition cursor-pointer text-center no-underline">
              Get Involved
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-neutral-900 p-4 space-y-3 flex flex-col text-xs font-bold tracking-wider uppercase text-neutral-300 animate-fadeIn shadow-inner">
            <a href="#home" onClick={(e) => scrollToSection(e, 'top')} className="hover:text-amber-500 py-1">Home</a>
            <a href="#who-we-are" onClick={(e) => scrollToSection(e, 'who-we-are')} className="hover:text-amber-500 py-1">Who We Are</a>
            <a href="#rotary-code" onClick={(e) => scrollToSection(e, 'rotary-code')} className="hover:text-amber-500 py-1">Rotary Code</a>
            <a href="#focus-channels" onClick={(e) => scrollToSection(e, 'focus-channels')} className="hover:text-amber-500 py-1">Areas of Focus</a>
            <a href="#visionaries" onClick={(e) => scrollToSection(e, 'visionaries')} className="hover:text-amber-500 py-1">Visionaries</a>
            <a href="#projects-and-news" onClick={(e) => scrollToSection(e, 'projects-and-news')} className="hover:text-amber-500 py-1">Projects & News</a>
            <hr className="border-neutral-800" />
            {currentUser ? (
              <button onClick={() => { setMobileMenuOpen(false); setDashboardOpen(true); }} className="w-full text-left bg-amber-500 text-black font-black p-2 rounded text-xs uppercase tracking-wider">
                Portal Dashboard
              </button>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }} className="w-full text-left bg-neutral-800 text-white font-black p-2 rounded text-xs uppercase tracking-wider">
                Member Login
              </button>
            )}
            <a href="#contactus" onClick={(e) => scrollToSection(e, 'contactus')} className="hover:text-amber-500 py-1">Get Involved</a>
          </div>
        )}
      </header>

      {/* =============================================================
          🆕 MEMBER LOGIN GATE (MODAL)
          ============================================================= */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-neutral-800 rounded-3xl w-full max-w-md p-8 border border-neutral-200 relative animate-scaleUp">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-black font-bold">✕</button>
            <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 border-b border-neutral-100 pb-3">Portal Gateway</h3>
            <p className="text-xs text-neutral-500 mt-2 mb-6">Access your active dashboard using your certified lowercased username handle (e.g. "arvinjasonandaya").</p>
            <form onSubmit={handleSimulatedLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Username Handle</label>
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="arvinjasonandaya"
                  required
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              {loginError && <p className="text-xs font-bold text-red-600 font-mono">{loginError}</p>}
              <button type="submit" className="w-full bg-black hover:bg-amber-500 hover:text-black text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition">
                Authenticate Securely
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================
          🆕 PORTAL DASHBOARD DRAWER / INTERFACE OVERLAY
          ============================================================= */}
      {dashboardOpen && currentUser && (
        <div className="fixed inset-0 z-[140] flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div onClick={() => setDashboardOpen(false)} className="absolute inset-0 cursor-pointer" />
          <div className="bg-white text-neutral-800 w-full max-w-4xl h-full shadow-2xl relative z-10 flex flex-col justify-between animate-slideLeft overflow-hidden">
            
            {/* Header Area */}
            <div className="bg-neutral-900 text-white p-6 flex justify-between items-center border-b border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                  <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide">{currentUser.name}</h4>
                  <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">{currentUser.position} • {currentUser.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {currentUser.isOfficer && (
                  <button onClick={() => setIsAcfEditorOpen(true)} className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider">
                    ACF Content Editor
                  </button>
                )}
                <button onClick={() => setCurrentUser(null)} className="text-neutral-400 hover:text-red-500 font-black text-xs uppercase">Logout</button>
                <button onClick={() => setDashboardOpen(false)} className="text-white text-lg">✕</button>
              </div>
            </div>

            {/* Scrollable Workspace Panels */}
            <div className="flex-1 p-6 overflow-y-auto custom-magazine-scrollbar space-y-8 bg-neutral-50">
              
              {/* Profile Management Section */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950 border-b pb-2 mb-4">Edit Profile Settings</h3>
                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">First Name</label>
                    <input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} required className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Last Name</label>
                    <input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} required className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Suffix</label>
                    <input type="text" value={editSuffix} onChange={(e) => setEditSuffix(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" placeholder="Jr., III, etc." />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Occupation</label>
                    <input type="text" value={editOccupation} onChange={(e) => setEditOccupation(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Birthday Month/Day</label>
                    <input type="text" value={editBirthday} onChange={(e) => setEditBirthday(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" placeholder="e.g. March 9" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Physical Address</label>
                    <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Email Address</label>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Contact Number</label>
                    <input type="text" value={editContact} onChange={(e) => setEditContact(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs" />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" className="bg-black text-white hover:bg-amber-500 hover:text-black font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl transition">
                      Synchronize Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Club Bulletin / Announcements Feed with Interactive Live Chat */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b pb-2 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950">Active Bulletins & Comment Deck</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">Interact Live</span>
                </div>
                
                {currentUser.isOfficer && (
                  <form onSubmit={handleCreateAnnouncement} className="bg-neutral-50 p-4 border border-neutral-200 rounded-2xl space-y-3">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">⚙️ Create New Bulletin announcement (Officers Area)</span>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Announcement Title" value={newAnnTitle} onChange={(e) => setNewAnnTitle(e.target.value)} required className="border border-neutral-300 rounded-lg p-2 text-xs w-full bg-white" />
                      <input type="text" placeholder="Event Calendar Date" value={newAnnDate} onChange={(e) => setNewAnnDate(e.target.value)} required className="border border-neutral-300 rounded-lg p-2 text-xs w-full bg-white" />
                    </div>
                    <textarea placeholder="Write announcement details..." value={newAnnContent} onChange={(e) => setNewAnnContent(e.target.value)} required rows={2} className="border border-neutral-300 rounded-lg p-2 text-xs w-full bg-white" />
                    <button type="submit" className="bg-neutral-900 text-white font-bold text-[9px] px-4 py-2 rounded-lg uppercase tracking-wider">Publish Announcement</button>
                  </form>
                )}

                <div className="space-y-4">
                  {announcements.map(ann => (
                    <div key={ann.id} className="border border-neutral-100 rounded-2xl p-4 bg-white shadow-inner">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-neutral-900 text-xs sm:text-sm uppercase">{ann.title}</h4>
                        <span className="text-[9px] font-mono text-neutral-400 font-semibold">{ann.date}</span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-2">{ann.content}</p>
                      
                      {/* Comments Sub-list */}
                      <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                        <span className="text-[9px] uppercase font-bold text-neutral-400 block">Comments ({ann.comments.length})</span>
                        {ann.comments.map(c => (
                          <div key={c.id} className="bg-neutral-50 rounded-lg p-2 text-[11px] leading-tight flex justify-between items-start">
                            <div>
                              <strong className="text-neutral-800">{c.userName}: </strong>
                              <span className="text-neutral-600">{c.text}</span>
                            </div>
                            <span className="text-[8px] font-mono text-neutral-400 shrink-0 ml-2">{c.date}</span>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <input 
                            type="text" 
                            placeholder="Add commentary..." 
                            value={newCommentText[ann.id] || ''}
                            onChange={(e) => setNewCommentText(prev => ({ ...prev, [ann.id]: e.target.value }))}
                            className="border border-neutral-200 rounded-lg p-2 text-[11px] flex-1 outline-none"
                          />
                          <button onClick={() => handleAddComment(ann.id)} className="bg-amber-500 text-black font-bold text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider">Comment</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative Node (Only visible for President down to Secretary) */}
              {(currentUser.position === "Club President" || currentUser.position === "Club Secretary") && (
                <div className="bg-white border border-red-200/50 rounded-3xl p-6 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950 border-b pb-2 mb-4">Portal Administrative Management</h3>
                  
                  {/* Create Member */}
                  <form onSubmit={handleCreateUser} className="bg-neutral-50 p-4 border border-neutral-200 rounded-2xl space-y-3">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">Create Registered Portal User Account</span>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Full Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required className="border rounded p-2 text-xs" />
                      <input type="text" placeholder="Username Handle" value={newUserUsername} onChange={(e) => setNewUserUsername(e.target.value)} required className="border rounded p-2 text-xs" />
                      <input type="email" placeholder="Email address" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required className="border rounded p-2 text-xs" />
                      <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="border rounded p-2 text-xs">
                        <option value="Member">Member</option>
                        <option value="Officer">Officer</option>
                        <option value="Director">Director</option>
                      </select>
                      <input type="text" placeholder="Position (e.g. Active Member)" value={newUserPosition} onChange={(e) => setNewUserPosition(e.target.value)} className="border rounded p-2 text-xs col-span-2" />
                    </div>
                    <button type="submit" className="bg-black text-white font-bold text-[10px] px-4 py-2 rounded uppercase">Register User Account</button>
                  </form>

                  {/* List and Modify Roster */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-magazine-scrollbar">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">Interactive Membership Hierarchy Editor</span>
                    {users.map(u => (
                      <div key={u.id} className="border border-neutral-100 rounded-xl p-3 flex justify-between items-center bg-white">
                        <div>
                          <strong className="text-xs">{u.name}</strong>
                          <p className="text-[9px] text-neutral-500 uppercase">{u.position} ({u.role})</p>
                        </div>
                        <div className="flex gap-2">
                          <select 
                            value={u.role} 
                            onChange={(e) => handlePromoteUser(u.id, e.target.value, u.position)}
                            className="text-[10px] border p-1 rounded"
                          >
                            <option value="Member">Member</option>
                            <option value="Director">Director</option>
                            <option value="Officer">Officer</option>
                          </select>
                          <button onClick={() => handleDeleteUser(u.id)} className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Club Directors & Officers Section Creation Tool */}
              {(currentUser.isDirector || currentUser.isOfficer) && (
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950">Add Humanitarian Projects & News</h3>
                  <form onSubmit={handleCreateProject} className="space-y-3 bg-neutral-50 p-4 border border-neutral-200 rounded-2xl">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Document Type</label>
                        <select value={newProjType} onChange={(e) => setNewProjType(e.target.value as any)} className="border rounded p-2 text-xs w-full">
                          <option value="Project">Project</option>
                          <option value="News">News</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Humanitarian Title</label>
                        <input type="text" value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} required className="border rounded p-2 text-xs w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Category (e.g. WASH Clean Water)</label>
                      <input type="text" value={newProjCategory} onChange={(e) => setNewProjCategory(e.target.value)} required className="border rounded p-2 text-xs w-full" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Ledger Detail Info</label>
                      <input type="text" value={newProjDetail} onChange={(e) => setNewProjDetail(e.target.value)} required className="border rounded p-2 text-xs w-full" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Description Paragraph</label>
                      <textarea value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} required className="border rounded p-2 text-xs w-full" rows={2} />
                    </div>
                    <button type="submit" className="bg-amber-500 text-black font-bold text-[10px] px-4 py-2 rounded uppercase tracking-wider">Log Project Output</button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          🆕 WORDPRESS ACF CONTENT EDITOR OVERLAY (Officers Privileges)
          ============================================================= */}
      {isAcfEditorOpen && currentUser && currentUser.isOfficer && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto custom-magazine-scrollbar space-y-6 animate-scaleUp">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-wide">WordPress ACF Visual Editor</h3>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Officers Content Core Controller</p>
              </div>
              <button onClick={() => setIsAcfEditorOpen(false)} className="text-neutral-500 font-black text-xs uppercase">✕</button>
            </div>

            {/* Background Music Editor */}
            <div className="border p-4 rounded-2xl space-y-2 bg-neutral-50">
              <strong className="text-xs uppercase tracking-wider block">Background Music Soundtrack Track</strong>
              <input 
                type="text" 
                value={bgMusic} 
                onChange={(e) => setBgMusic(e.target.value)}
                className="w-full text-xs p-2.5 border rounded-lg bg-white font-mono"
                placeholder="/audio/rotary-anthem.mp3"
              />
            </div>

            {/* Carousel Content Editor */}
            <div className="border p-4 rounded-2xl space-y-3 bg-neutral-50">
              <strong className="text-xs uppercase tracking-wider block">Carousel Slides Catalog</strong>
              {editableSections.carousel.map((slide, idx) => (
                <div key={idx} className="space-y-2 border-b pb-3 last:border-0">
                  <span className="text-[10px] font-mono font-bold">Slide {idx + 1} Image URL</span>
                  <input 
                    type="text" 
                    value={slide.url} 
                    onChange={(e) => {
                      const updated = [...editableSections.carousel];
                      updated[idx].url = e.target.value;
                      setEditableSections({ ...editableSections, carousel: updated });
                    }}
                    className="w-full text-xs p-2 border rounded bg-white" 
                  />
                  <input 
                    type="text" 
                    value={slide.caption} 
                    onChange={(e) => {
                      const updated = [...editableSections.carousel];
                      updated[idx].caption = e.target.value;
                      setEditableSections({ ...editableSections, carousel: updated });
                    }}
                    className="w-full text-xs p-2 border rounded bg-white" 
                    placeholder="Caption"
                  />
                </div>
              ))}
            </div>

            {/* Who We Are Editor */}
            <div className="border p-4 rounded-2xl space-y-3 bg-neutral-50">
              <strong className="text-xs uppercase tracking-wider block">Who We Are Section</strong>
              <input 
                type="text" 
                value={editableSections.whoWeAre.title} 
                onChange={(e) => setEditableSections({
                  ...editableSections,
                  whoWeAre: { ...editableSections.whoWeAre, title: e.target.value }
                })}
                className="w-full text-xs p-2 border rounded bg-white" 
              />
              {editableSections.whoWeAre.body.map((para, idx) => (
                <textarea 
                  key={idx}
                  value={para}
                  onChange={(e) => {
                    const updated = [...editableSections.whoWeAre.body];
                    updated[idx] = e.target.value;
                    setEditableSections({
                      ...editableSections,
                      whoWeAre: { ...editableSections.whoWeAre, body: updated }
                    });
                  }}
                  rows={2}
                  className="w-full text-xs p-2 border rounded bg-white"
                />
              ))}
            </div>

            <button onClick={() => { setIsAcfEditorOpen(false); alert("Ecosystem modules successfully rewritten."); }} className="w-full bg-black hover:bg-amber-500 hover:text-black text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider transition">
              Apply Modules Live
            </button>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC HERO LANDING CAROUSEL (SPLIT-FOCUS NON-CROP ADAPTIVE MODULE) */}
      <section 
        className="relative flex flex-col sm:block text-white overflow-hidden bg-black"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* CAROUSEL IMAGE VIEWPORT WINDOW */}
        <div className="relative w-full aspect-[4/3] sm:aspect-none sm:absolute sm:inset-0 sm:h-full sm:w-full bg-neutral-950">
          {editableSections.carousel.map((slide, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIndex ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('${slide.url}')`,
                transitionProperty: 'opacity, transform'
              }}
            />
          ))}

          {/* DIRECTIONAL TOGGLE OVERLAYS */}
          <button {...hydration} onClick={handlePrevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/30 border border-neutral-800 hover:border-amber-500 hover:text-amber-500 text-white transition z-20 cursor-pointer hidden sm:flex select-none">‹</button>
          <button {...hydration} onClick={handleNextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/30 border border-neutral-800 hover:border-amber-500 hover:text-amber-500 text-white transition z-20 cursor-pointer hidden sm:flex select-none">›</button>
        </div>

        {/* CONTENT CAPTIONS ZONE */}
        <div className="relative w-full bg-neutral-950 sm:bg-transparent px-5 py-8 sm:py-16 md:py-24 max-w-7xl mx-auto z-10 flex items-center min-h-none sm:min-h-[85vh]">
          <div className="text-center sm:text-left max-w-2xl w-full">
            <span className="bg-neutral-900/90 sm:bg-neutral-900 text-amber-500 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-neutral-800 shadow-sm inline-block">District 3770 • Service Above Self</span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mt-4 mb-4 sm:mb-6 uppercase leading-tight sm:leading-none">Create Lasting Impact</h1>
            <p className="text-xs sm:text-base text-neutral-300 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">Guided by the enduring Rotary principle of Service Above Self, the Rotary Club of Meycauayan Metro continues to transform lives through sustainable humanitarian action.</p>
            
            <div className="grid grid-cols-2 sm:flex gap-3 max-w-xs mx-auto sm:max-w-none sm:mx-0">
              <a href="#projects-and-news" onClick={(e) => scrollToSection(e, 'projects-and-news')} className="bg-white text-black font-black py-2.5 sm:py-3 rounded-lg hover:bg-amber-500 hover:text-black transition shadow-md text-center text-xs sm:text-sm px-4 sm:px-6">Show Impact</a>
              <a href="#who-we-are" onClick={(e) => scrollToSection(e, 'who-we-are')} className="border-2 border-neutral-500 text-white font-bold py-2.5 sm:py-3 rounded-lg hover:bg-white/10 transition text-center text-xs sm:text-sm px-4 sm:px-6">Learn More</a>
            </div>
          </div>
        </div>

        {/* INDICATOR TRACK DOTS MESH */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-5 flex gap-2 z-20">
          {editableSections.carousel.map((_, dotIdx) => (
            <button {...hydration} key={dotIdx} onClick={() => setCurrentSlideIndex(dotIdx)} className={`h-1.5 rounded-full transition-all border-none outline-none cursor-pointer ${dotIdx === currentSlideIndex ? 'bg-amber-500 w-6' : 'bg-neutral-600 w-1.5'}`} />
          ))}
        </div>
      </section>

      {/* =============================================================
          3. ABOUT US INTRODUCTORY REFLECTIONS & EMBEDDED SCROLL CAROUSEL
          ============================================================= */}
      <section id="who-we-are" className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <span className="text-amber-500 font-black uppercase tracking-widest text-xs block">Who We Are</span>
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight uppercase border-b-4 border-black pb-3 inline-block">
                  {editableSections.whoWeAre.title}
                </h2>
              </div>
              
              <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-md border border-neutral-200 bg-neutral-100 relative group select-none">
                <img 
                  src="/carousel 1.jpg" 
                  alt="Rotary Club community assembly framework layout"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-4 text-[10px] sm:text-xs font-mono font-bold text-white tracking-wide drop-shadow-sm">
                  ⚡ Rotary Club of Meycauayan Metro — Roster assembly catalog preview
                </span>
              </div>

              <div className="text-neutral-600 leading-relaxed space-y-5 text-justify text-sm sm:text-base font-normal">
                {editableSections.whoWeAre.body.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between min-h-[580px] relative border border-amber-500/20 overflow-hidden">
                
                <div className="absolute -top-6 -left-2 text-neutral-900 text-[180px] font-serif leading-none select-none pointer-events-none opacity-40">
                  “
                </div>

                <div className="relative z-10">
                  <span className="text-amber-500 font-black uppercase tracking-widest text-[11px] bg-amber-500/10 px-3 py-1 rounded-full inline-block mb-6 border border-amber-500/20">
                    Leadership Addresses
                  </span>
                  
                  <div className="relative min-h-[380px] sm:min-h-[400px]">
                    {officialMessages.map((msg, mIdx) => (
                      <div 
                        key={mIdx}
                        className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ${
                          mIdx === currentMessageIndex 
                            ? 'opacity-100 translate-y-0 scale-100 z-10 pointer-events-auto' 
                            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                        }`}
                      >
                        <div className="w-full">
                          <h3 className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight uppercase border-l-4 border-amber-500 pl-3 mb-4">
                            {msg.title}
                          </h3>
                          
                          <p className="custom-magazine-scrollbar text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify font-normal tracking-wide max-h-[260px] sm:max-h-[280px] overflow-y-auto pr-3 scroll-smooth">
                            {msg.text}
                          </p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0">
                            <img 
                              src={msg.image} 
                              alt={msg.author} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23171717'/><text x='50%27 y='65%27 font-family='sans-serif' font-size='35' fill='%23d97706' text-anchor='middle'>👤</text></svg>";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-amber-500 text-xs sm:text-sm tracking-wide uppercase leading-tight truncate">
                              {msg.author}
                            </h4>
                            <p className="text-[10px] font-mono text-neutral-400 mt-0.5 uppercase tracking-wider leading-none truncate">
                              {msg.meta}
                            </p>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-100 flex justify-between items-center relative z-10">
                  <div className="flex gap-2">
                    {officialMessages.map((_, dIdx) => (
                      <button
                        {...hydration}
                        key={dIdx}
                        onClick={() => setCurrentMessageIndex(dIdx)}
                        className={`h-1.5 rounded-full transition-all border-none outline-none cursor-pointer ${
                          dIdx === currentMessageIndex ? 'bg-amber-500 w-6' : 'bg-neutral-800 w-1.5'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2.5">
                    <button {...hydration} onClick={handlePrevMessage} className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-white hover:border-amber-500 hover:text-amber-500 transition-all duration-300 cursor-pointer font-black text-sm select-none">‹</button>
                    <button {...hydration} onClick={handleNextMessage} className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-white hover:border-amber-500 hover:text-amber-500 transition-all duration-300 cursor-pointer font-black text-sm select-none">›</button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500 text-black p-6 rounded-3xl shadow-lg border border-amber-600/20 text-left">
                <h3 className="text-base font-black uppercase tracking-wider text-black flex items-center gap-2">
                  Fellowship Through Service
                </h3>
                <p className="text-xs font-semibold leading-relaxed mt-2 text-neutral-900">
                  "The true value of our service is measured by the lasting difference we make in the lives of the people and communities we serve."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =============================================================
          4. HIGHLY INTERACTIVE & PREMIUM GUIDING ROTARY CODES MATRIX
          ============================================================= */}
      <section 
        id="rotary-code" 
        className="py-24 bg-cover bg-center bg-fixed relative overflow-hidden"
        style={{ backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.88), rgba(5, 5, 10, 0.95)), url('/rotary-background.jpg')` }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10 px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-500 font-extrabold uppercase tracking-widest text-xs block">Guiding Frameworks</span>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">The Objectives & Vision Matrix</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">Explore the fundamental tenets and structural philosophy that steer our global network of service leaders.</p>
          </div>

          {/* MOBILE VIEW DROP-DOWN SELECT ELEMENT */}
          <div className="block sm:hidden max-w-xs mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full bg-slate-950 text-amber-400 font-black text-xs uppercase tracking-widest pl-5 pr-12 py-3.5 rounded-xl border border-slate-800/80 shadow-2xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 appearance-none text-left transition-all duration-300"
              >
                <option value="fourway" className="bg-slate-950 text-neutral-200 uppercase tracking-wider">The 4-Way Test</option>
                <option value="objectives" className="bg-slate-950 text-neutral-200 uppercase tracking-wider">Rotary Objectives</option>
                <option value="vision" className="bg-slate-950 text-neutral-200 uppercase tracking-wider">Our Vision</option>
                <option value="endpolio" className="bg-slate-950 text-neutral-200 uppercase tracking-wider">End Polio Now</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-1.5 border-l border-slate-800/80 pl-3">
                <span className="text-[9px] text-amber-500/50 font-mono font-bold uppercase tracking-wider">View</span>
                <span className="w-1.5 h-1.5 border-r-2 border-b-2 border-amber-400/80 transform rotate-45 -translate-y-px transition-transform duration-300"></span>
              </div>
            </div>
          </div>

          {/* TABLET & DESKTOP BREAKPOINT TABS MATRIX */}
          <div className="hidden sm:flex bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl max-w-2xl mx-auto">
            <button {...hydration} onClick={() => setActiveTab('fourway')} className={`flex-1 py-2 text-[10px] lg:text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeTab === 'fourway' ? 'bg-amber-500 text-black font-extrabold shadow-lg' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>The 4-Way Test</button>
            <button {...hydration} onClick={() => setActiveTab('objectives')} className={`flex-1 py-2 text-[10px] lg:text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeTab === 'objectives' ? 'bg-amber-500 text-black font-extrabold shadow-lg' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Rotary Objectives</button>
            <button {...hydration} onClick={() => setActiveTab('vision')} className={`flex-1 py-2 text-[10px] lg:text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeTab === 'vision' ? 'bg-amber-500 text-black font-extrabold shadow-lg' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Our Vision</button>
            <button {...hydration} onClick={() => setActiveTab('endpolio')} className={`flex-1 py-2 text-[10px] lg:text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeTab === 'endpolio' ? 'bg-amber-500 text-black font-extrabold shadow-lg' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>End Polio Now</button>
          </div>

          <div className="bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-6 sm:p-12 shadow-2xl min-h-[340px] flex items-center justify-center transition-all duration-500 hover:border-neutral-700/40">
            
            {activeTab === 'fourway' && (
              <div className="w-full space-y-8 animate-fadeIn">
                <div className="text-center md:text-left">
                  <span className="text-[10px] bg-slate-900 text-slate-400 font-mono border border-slate-800 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-2">Ethical Baseline</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">Of the things we think, say, or do:</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {editableSections.rotaryCode.fourwayTest.map((item, idx) => (
                    <div key={idx} className="bg-slate-955/80 backdrop-blur-md border border-slate-900 Regel rounded-2xl p-5 hover:border-amber-500/40 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.1)] transition-all group duration-300 relative overflow-hidden">
                      <h4 className="text-xs font-black tracking-widest text-amber-500 mb-1.5 uppercase font-mono group-hover:text-amber-400 transition-colors">0{idx + 1}</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed font-normal">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'objectives' && (
              <div className="w-full space-y-6 animate-fadeIn">
                <div className="text-center md:text-left">
                  <span className="text-[10px] bg-slate-900 text-slate-400 font-mono border border-slate-800 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-2">Core Purpose</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide mb-4">To encourage and foster the ideal of service:</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "The development of acquaintance as an opportunity for service.",
                    "High ethical standards in business and professions; the recognition of worthiness of all useful occupations; and the dignifying of each Rotarian's occupation as an opportunity to serve society.",
                    "The application of the ideal of service in each Rotarian's personal, business, and community life.",
                    "The advancement of international understand, goodwill, and peace through a world fellowship of business and professional persons united in the ideal of service."
                  ].map((text, idx) => (
                    <div key={idx} className="bg-slate-955/50 backdrop-blur-md border border-slate-900/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-slate-950/90 hover:scale-[1.01] hover:border-blue-500/30 shadow-md transition-all duration-300 group">
                      <span className="w-6 h-6 bg-blue-600/10 rounded-full flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400 font-mono font-bold text-[10px] mt-0.5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">{idx + 1}</span>
                      <p className="text-xs text-neutral-300 leading-relaxed font-normal tracking-wide group-hover:text-white transition-colors">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="w-full max-w-4xl text-center py-6 px-4 animate-fadeIn">
                <div className="max-w-3xl mx-auto space-y-6 group bg-black/40 backdrop-blur-md border border-neutral-800 p-8 sm:p-12 rounded-2xl shadow-xl hover:border-amber-500/30 transition-all duration-500">
                  <span className="text-[10px] bg-neutral-900/80 text-amber-500 font-mono border border-neutral-800 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
                    Official International Blueprint
                  </span>
                  
                  <p className="text-xl sm:text-3xl font-light text-neutral-300 tracking-wide leading-relaxed text-center font-serif select-none">
                    "
                    <span className="inline-block font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] uppercase tracking-tight mx-1 transition-all duration-300 hover:scale-110 hover:rotate-1 hover:drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] cursor-pointer">
                      Together
                    </span> 
                    we see a world where 
                    <span className="inline-block font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] uppercase tracking-tight mx-1 transition-all duration-300 hover:scale-110 hover:-rotate-1 hover:drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] cursor-pointer">
                      people
                    </span> 
                    unite and take action to 
                    <span className="inline-block font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] uppercase tracking-tight mx-1 transition-all duration-300 hover:scale-110 hover:rotate-2 hover:drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] cursor-pointer">
                      create
                    </span> 
                    lasting 
                    <span className="inline-block font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] uppercase tracking-tight mx-1 transition-all duration-300 hover:scale-110 hover:-rotate-2 hover:drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] cursor-pointer">
                      change
                    </span> 
                    across the globe, in our communities, and in ourselves.
                    "
                  </p>
                  
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto shadow-md" />
                </div>
              </div>
            )}

            {activeTab === 'endpolio' && (
              <div className="w-full space-y-6 animate-fadeIn">
                <div className="text-center md:text-left">
                  <span className="text-[10px] bg-red-600/20 text-red-400 font-mono border border-red-500/30 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-2">Global Initiative</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">Ending Polio Worldwide</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4 text-justify text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                    <p>
                      Rotary and its partners have reduced polio cases by 99.9% worldwide since our first project to immunize children in the Philippines in 1979. We are close to making polio the second human disease in history to be eradicated globally.
                    </p>
                    <p>
                      As a founding partner of the Global Polio Eradication Initiative, we have helped immunize more than 2.5 billion children in 122 countries. Rotarians have contributed more than $2.1 billion and countless volunteer hours to protect children from this devastating vaccine-preventable disease.
                    </p>
                  </div>
                  <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">Why Eradication Matters</h4>
                    <ul className="text-xs text-neutral-400 space-y-2 list-none p-0 m-0">
                      <li className="flex gap-2 items-start"><span className="text-red-500">✔</span> <strong>Humanitarian Legacy:</strong> No child will ever suffer the paralyzing effects of polio again.</li>
                      <li className="flex gap-2 items-start"><span className="text-red-500">✔</span> <strong>Economic Dividend:</strong> Eradication saves an estimated $40-$50 billion in healthcare costs.</li>
                      <li className="flex gap-2 items-start"><span className="text-red-500">✔</span> <strong>Global Health Security:</strong> Polio infrastructure is actively used to fight other infectious diseases.</li>
                    </ul>
                    <a href="https://www.rotary.org/our-work/ending-polio" target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-black uppercase tracking-wider text-amber-500 hover:text-amber-400 pt-2 transition-colors">
                      Learn More on rotary.org ↗
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* =============================================================
          4.5 ROTARY AREAS OF FOCUS INTERACTIVE MESH WORKSPACE
          ============================================================= */}
      <section id="focus-channels" className="py-16 sm:py-24 bg-white border-b border-neutral-200 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-600 font-extrabold uppercase tracking-widest text-[10px] sm:text-xs block">Strategic Pillars</span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">Rotary Areas of Focus</h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">Our humanitarian targets optimize specific tactical focus nodes across seven globally recognized development vector bands.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {editableSections.areasOfFocus.map((focus) => (
              <div 
                key={focus.id}
                className="bg-neutral-50/70 border border-neutral-200 rounded-xl sm:rounded-3xl p-3.5 sm:p-8 hover:border-amber-500/50 hover:bg-white hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(217,119,6,0.06)] transition-all group duration-300 flex flex-col justify-between text-left"
              >
                <div className="space-y-2.5 sm:space-y-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-base sm:text-xl group-hover:bg-amber-500 group-hover:text-black group-hover:scale-105 transition-all duration-300 shrink-0">
                    {focus.icon}
                  </div>
                  <h3 className="text-[11px] sm:text-base font-black text-neutral-900 uppercase tracking-wide leading-tight sm:leading-snug group-hover:text-amber-600 transition-colors duration-200 line-clamp-2">
                    {focus.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-neutral-500 leading-relaxed text-left font-normal tracking-wide line-clamp-4 sm:line-clamp-none">
                    {focus.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          4.8 IMMERSIVE LOGO MARQUEE
          ============================================================= */}
      <section className="py-16 bg-white border-b border-neutral-200 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 mb-8 flex items-center justify-center md:justify-start">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border border-neutral-200 px-3 py-1 rounded-full bg-neutral-50">
            Our Partners & Sponsors
          </span>
        </div>
        
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee-stream flex gap-12 items-center">
            {[...corporateSponsors, ...corporateSponsors, ...corporateSponsors].map((sponsor, sIdx) => (
              <a 
                key={sIdx}
                href={sponsor.url}
                target={sponsor.url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 rounded-2xl shrink-0 group transition-all duration-300 no-underline cursor-pointer w-28 h-16 sm:w-44 sm:h-24 bg-neutral-50/50 hover:bg-neutral-100/60"
                title={sponsor.name}
              >
                <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-106">
                  <img 
                    src={sponsor.logoImage} 
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply transition-opacity duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerText = sponsor.fallbackText;
                        parent.className = "w-16 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-mono font-black";
                      }
                    }}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          5. OFFICIAL LEADERSHIP ROSTER SHOWCASE (VISIONARIES LIGHT THEME)
          ============================================================= */}
      <section 
        id="visionaries" 
        className="py-24 bg-neutral-50 border-b border-neutral-200 relative overflow-hidden transition-colors duration-500"
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10 px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-600 font-extrabold uppercase tracking-widest text-xs block">Visionaries Team</span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight uppercase">RY 2026-2027 Roster Administration</h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">Review the officers, project heads, and official team members executing change across the local sector channels.</p>
          </div>

          {/* MOBILE VIEW DROP-DOWN SELECT ELEMENT */}
          <div className="block sm:hidden max-w-xs mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <select
                value={activeVisionaryTab}
                onChange={(e) => setActiveVisionaryTab(e.target.value as any)}
                className="w-full bg-white text-neutral-900 font-black text-xs uppercase tracking-widest pl-5 pr-12 py-3.5 rounded-xl border border-neutral-200 shadow-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 appearance-none text-left transition-all duration-300"
              >
                <option value="officers" className="bg-white text-neutral-800 uppercase tracking-wider">RY Officers</option>
                <option value="directors" className="bg-white text-neutral-800 uppercase tracking-wider">Club Directors</option>
                <option value="roster" className="bg-white text-neutral-800 uppercase tracking-wider">Official Roster</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-1.5 border-l border-neutral-200 pl-3">
                <span className="text-[9px] text-amber-600/60 font-mono font-bold uppercase tracking-wider">View</span>
                <span className="w-1.5 h-1.5 border-r-2 border-b-2 border-neutral-800/80 transform rotate-45 -translate-y-px transition-transform duration-300"></span>
              </div>
            </div>
          </div>

          {/* TABLET & DESKTOP BREAKPOINT TABS MATRIX */}
          <div className="hidden sm:flex bg-white p-1 rounded-2xl border border-neutral-200 shadow-sm max-w-xl mx-auto">
            <button {...hydration} onClick={() => setActiveVisionaryTab('officers')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeVisionaryTab === 'officers' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-neutral-500 hover:text-amber-600 bg-transparent'}`}>RY Officers</button>
            <button {...hydration} onClick={() => setActiveVisionaryTab('directors')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeVisionaryTab === 'directors' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-neutral-500 hover:text-amber-600 bg-transparent'}`}>Club Directors</button>
            <button {...hydration} onClick={() => setActiveVisionaryTab('roster')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeVisionaryTab === 'roster' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-neutral-500 hover:text-amber-600 bg-transparent'}`}>Official Roster</button>
          </div>

          <div className="bg-white/40 backdrop-blur-xl border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500">
            
            {activeVisionaryTab === 'roster' && (
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6 pb-4 border-b border-neutral-100 animate-fadeIn">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
                  Sort Algorithm Parameters:
                </span>
                <div className="flex gap-2 bg-neutral-100/80 p-0.5 rounded-xl border border-neutral-200 shadow-inner">
                  <button 
                    {...hydration}
                    onClick={() => setRosterSortCriteria('surname')} 
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition border-none cursor-pointer ${rosterSortCriteria === 'surname' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black bg-transparent'}`}
                  >
                    By Surname
                  </button>
                  <button 
                    {...hydration}
                    onClick={() => setRosterSortCriteria('birthday')} 
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition border-none cursor-pointer ${rosterSortCriteria === 'birthday' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black bg-transparent'}`}
                  >
                    By Birthday Month
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 animate-fadeIn">
              {filteredVisionaries.map((officer) => {
                const resolvedImagePath = officer.image.startsWith('/members/') 
                  ? officer.image 
                  : `/members/${officer.name.trim().replace(/\s+/g, '_')}${officer.image.endsWith('.png') ? '.png' : '.jpg'}`;

                const renderedFullName = officer.suffix ? `${officer.name} ${officer.suffix}` : officer.name;

                return (
                  <div 
                    key={officer.id} 
                    className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 text-left sm:text-center hover:border-amber-500/50 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(217,119,6,0.12)] transition-all group duration-300 relative overflow-hidden flex flex-row sm:flex-col items-center sm:justify-between min-h-0 sm:min-h-[260px] gap-4 sm:gap-0"
                  >
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-neutral-100 group-hover:border-amber-500/50 transition-colors duration-300 shadow-sm relative bg-neutral-100 shrink-0">
                      <img 
                        src={resolvedImagePath} 
                        alt={officer.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f5f5f5'/><text x='50%27 y='55%27 font-family='sans-serif' font-size='30' fill='%23d97706' text-anchor='middle'>👤</text></svg>";
                        }}
                      />
                    </div>

                    <div className="space-y-1 flex-1 flex flex-col justify-center sm:items-center">
                      <h3 className="text-sm font-black text-neutral-900 tracking-wide group-hover:text-amber-600 transition-colors duration-200 line-clamp-2 sm:px-1">
                        {renderedFullName}
                      </h3>
                      
                      {activeVisionaryTab === 'roster' ? (
                        <div className="pt-0.5 sm:pt-2">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block sm:hidden">
                            Birthday
                          </span>
                          <p className="text-xs font-bold text-blue-600 font-sans mt-0.5">
                            {officer.birthday || "Unspecified"}
                          </p>
                        </div>
                      ) : activeVisionaryTab === 'directors' ? (
                        <p className="text-[11px] text-blue-600 font-extrabold uppercase tracking-wider leading-tight max-w-[140px]">
                          {officer.directorPosition || officer.position}
                        </p>
                      ) : (
                        <p className="text-[11px] text-blue-600 font-extrabold uppercase tracking-wider leading-tight max-w-[140px]">
                          {officer.position}
                        </p>
                      )}
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-amber-500/40 transition-all duration-500" />
                  </div>
                );
              })}
            </div>

            {filteredVisionaries.length === 0 && (
              <div className="text-center py-12 text-neutral-400 text-xs tracking-wider">
                No verified organization members match the current display query vector filters.
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 pt-6 border-t border-neutral-100 flex items-center justify-between flex-col sm:flex-row gap-4 animate-fadeIn select-none">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Showing <span className="text-neutral-800 font-black">{filteredVisionaries.length}</span> of <span className="text-neutral-800 font-black">{allFilteredVisionaries.length}</span> Members
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    {...hydration}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-700 font-bold hover:border-amber-500 hover:text-amber-600 disabled:opacity-40 disabled:hover:text-neutral-700 disabled:hover:border-neutral-200 transition pointer cursor-pointer text-sm"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        {...hydration}
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black tracking-wide uppercase transition border ${
                          currentPage === pageNumber
                            ? 'bg-amber-50 border-amber-500 text-black shadow-md shadow-amber-500/20'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-amber-500 hover:text-amber-600'
                        } cursor-pointer`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button 
                    {...hydration}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-700 font-bold hover:border-amber-500 hover:text-amber-600 disabled:opacity-40 disabled:hover:text-neutral-700 disabled:hover:border-neutral-200 transition pointer cursor-pointer text-sm"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. PROJECTS & NEWS */}
      <section id="projects-and-news" className="py-24 bg-white px-4 sm:px-6 border-b border-neutral-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10 relative">
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="space-y-1">
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs block">People of Action</span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">Humanitarian Program Output Metrics</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project outputs..."
                  className="w-full bg-neutral-50 text-neutral-800 text-xs font-medium pl-9 pr-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm select-none pointer-events-none">🔍</span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black border-none bg-transparent cursor-pointer text-xs font-bold font-mono p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex bg-neutral-100/80 rounded-xl border border-neutral-200/60 p-0.5 shadow-sm overflow-x-auto shrink-0">
                {(['All', 'Project', 'News'] as const).map((filterOpt) => (
                  <button 
                    suppressHydrationWarning 
                    key={filterOpt} 
                    onClick={() => {
                      setActivityFilter(filterOpt);
                      if (filterOpt === 'News') setStatusFilter('All');
                    }} 
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all border-none cursor-pointer whitespace-nowrap ${
                      activityFilter === filterOpt ? 'bg-black text-white shadow-sm' : 'text-neutral-500 hover:text-amber-600 bg-transparent'
                    }`}
                  >
                    {filterOpt === 'All' ? 'View All' : filterOpt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activityFilter !== 'News' && (
            <div className="flex justify-center md:justify-start">
              <div className="flex bg-neutral-50 border border-neutral-200 p-1 rounded-2xl max-w-md w-full sm:w-auto shadow-sm">
                <button 
                  onClick={() => setStatusFilter('All')}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${statusFilter === 'All' ? 'bg-amber-500 text-black font-extrabold shadow-sm' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}
                >
                  All Impacts
                </button>
                <button 
                  onClick={() => setStatusFilter('Ongoing')}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${statusFilter === 'Ongoing' ? 'bg-amber-500 text-black font-extrabold shadow-sm' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}
                >
                  Active Initiatives
                </button>
                <button 
                  onClick={() => setStatusFilter('Completed')}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${statusFilter === 'Completed' ? 'bg-amber-500 text-black font-extrabold shadow-sm' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}
                >
                  Completed Legacies
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {paginatedActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="bg-neutral-50/50 hover:bg-white rounded-3xl shadow-sm hover:shadow-xl border border-neutral-200/80 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
              >
                <div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center mb-4">
                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full w-max ${
                      activity.type === 'Project' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {activity.type}
                    </span>
                    {activity.type === 'Project' && activity.status && (
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max ${
                        activity.status === 'Completed' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-amber-600 bg-amber-50 border border-amber-100'
                      }`}>{activity.status}</span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 mb-1 tracking-tight leading-snug group-hover:text-amber-600 transition-colors duration-200">
                    {activity.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed text-justify font-normal tracking-wide line-clamp-3">
                    {activity.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block mb-0.5">
                      {activity.type === 'News' ? 'Publication / Reference' : 'Recorded Impact / Status'}
                    </span>
                    <p className="text-neutral-900 font-bold font-mono text-[11px] tracking-tight">{activity.detail}</p>
                  </div>
                  
                  <button 
                    onClick={() => openActivityModal(activity)}
                    className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-amber-500 text-neutral-700 group-hover:text-black font-black text-base flex items-center justify-center transition-all duration-300 shadow-sm border-none cursor-pointer outline-none select-none hover:scale-105"
                    title="Expand Project Portfolio"
                  >
                    ❯
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-amber-500/40 transition-all duration-500" />
              </div>
            ))}
          </div>

          {paginatedActivities.length === 0 && (
            <div className="text-center py-20 bg-neutral-50 border border-dashed border-neutral-200 rounded-3xl text-neutral-400 text-xs font-medium uppercase tracking-widest animate-fadeIn">
              No humanitarian logs correspond to your current index filtering nodes.
            </div>
          )}

          {totalActivityPages > 1 && (
            <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none animate-fadeIn">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Displaying Index <span className="text-neutral-800 font-black">{paginatedActivities.length}</span> of <span className="text-neutral-800 font-black">{allProcessedActivities.length}</span> Total Records
              </span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setActivityPage(p => Math.max(p - 1, 1))} 
                  disabled={activityPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 font-bold hover:border-amber-500 hover:text-amber-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer text-xs"
                >
                  ‹
                </button>
                {Array.from({ length: totalActivityPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setActivityPage(index + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black tracking-wide border transition-all duration-200 ${
                      activityPage === index + 1
                        ? 'bg-black border-black text-white shadow-md'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-amber-500 hover:text-amber-600'
                    } cursor-pointer`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setActivityPage(p => Math.min(p + 1, totalActivityPages))} 
                  disabled={activityPage === totalActivityPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 font-bold hover:border-amber-500 hover:text-amber-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer text-xs"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =============================================================
          🆕 BRAND NEW FLIPPING MASONRY INTUITIVE SHOWCASE GRID MODULE
          ============================================================= */}
      <section id="action-showcase" className="py-24 bg-neutral-900 border-b border-neutral-950 overflow-hidden relative text-center">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
          
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-amber-500 font-extrabold uppercase tracking-widest text-xs block">Our Core Mission in Action</span>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Stories of Service: A Visual Journey</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">A dynamic chronicle of our hands-on projects, sustainable initiatives, and the Rotarians making them happen.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-4 max-w-5xl mx-auto perspective-1000">
            {tiles.map((tile) => (
              <div 
                key={tile.id} 
                className={`${tile.gridClass} relative transform-style-3d transition-transform duration-1000 cursor-pointer ${tile.flipped ? 'rotate-y-180' : ''}`}
              >
                {/* CARD FRONT LAYER */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden bg-cover bg-center shadow-lg border border-neutral-800 flex items-end p-4"
                  style={{ backgroundImage: `url('${tile.frontImg}')` }}
                />

                {/* CARD BACK LAYER (FLIPPED STATE) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden rotate-y-180 bg-cover bg-center shadow-2xl border border-neutral-800 flex items-end p-4"
                  style={{ backgroundImage: `url('${tile.backImg}')` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          MODAL INTERACTIVE INTERFACE WITH DROP-DOWN TRIGGER PORTAL
          ============================================================= */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden animate-fadeIn">
          <div 
            onClick={() => setSelectedActivity(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer transition-opacity duration-300"
          />
          
          <div className="bg-white text-neutral-800 rounded-[32px] w-full max-w-6xl h-[85vh] shadow-2xl relative z-10 border border-neutral-200 flex flex-col animate-scaleUp overflow-hidden">
            
            <div className="bg-white border-b border-neutral-100 px-6 sm:px-10 py-6 flex justify-between items-center shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono font-black px-3 py-1 bg-amber-500 text-black rounded-full tracking-widest inline-block shadow-sm">
                  {selectedActivity.type} Ledger Documentation
                </span>
                <p className="text-xs text-blue-600 font-mono font-bold uppercase tracking-wider pt-1">{selectedActivity.cause || selectedActivity.category}</p>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-black text-neutral-500 hover:text-white flex items-center justify-center transition-all duration-200 font-mono text-xs font-bold border-none cursor-pointer outline-none shadow-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-6 sm:p-10 overflow-y-auto custom-magazine-scrollbar">
              <div className="grid lg:grid-cols-12 gap-10 items-start">
                
                <div className="lg:col-span-7 flex flex-col justify-between min-h-[460px] text-left">
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-3 custom-magazine-scrollbar">
                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase border-b-4 border-black pb-3">
                      {selectedActivity.title}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed text-justify font-normal tracking-wide">
                      {selectedActivity.fullDescription || selectedActivity.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-100 space-y-4 bg-white relative">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">📤 Distribute This Document Ledger Node:</span>
                      
                      <div className="relative inline-block text-left w-full sm:w-auto" ref={shareMenuRef}>
                        <button 
                          onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                          className="w-full sm:w-48 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black [11px] font-black uppercase tracking-wider rounded-xl transition duration-200 border-none cursor-pointer shadow-md flex items-center justify-center gap-2 select-none relative"
                        >
                          <span className="flex-1 text-center pl-4">Share</span>
                          <span className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent transition-transform duration-300 shrink-0 ${isShareMenuOpen ? 'border-b-[5px] border-b-black rotate-0' : 'border-t-[5px] border-t-black'}`}></span>
                        </button>

                        {isShareMenuOpen && (
                          <div className="absolute left-0 bottom-full mb-2 w-full sm:w-48 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn py-1">
                            <a 
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://rcmeycauayanmetro.org')}&quote=${encodeURIComponent(`Check out the latest from Rotary Club of Meycauayan Metro: ${selectedActivity.title}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsShareMenuOpen(false)}
                              className="flex items-center px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-[#1877F2] tracking-wide uppercase transition no-underline"
                            >
                              Facebook
                            </a>
                            <a 
                              href="https://www.instagram.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                setIsShareMenuOpen(false);
                                alert('To share this ledger item to Instagram: Copy the project description details and upload to your stories or feed.');
                              }}
                              className="flex items-center px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-purple-600 tracking-wide uppercase transition no-underline"
                            >
                              Instagram
                            </a>
                            <a 
                              href={`mailto:?subject=${encodeURIComponent(selectedActivity.title)}&body=${encodeURIComponent(`Check out the latest from Rotary Club of Meycauayan Metro: ${selectedActivity.title}\n\n${selectedActivity.description}`)}`}
                              onClick={() => setIsShareMenuOpen(false)}
                              className="flex items-center px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-black tracking-wide uppercase transition no-underline"
                            >
                              Email App
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/60 grid grid-cols-2 gap-4 shadow-inner">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">Operations State</span>
                        {selectedActivity.type === 'News' ? (
                          <span className="text-xs font-extrabold uppercase tracking-wide border border-blue-200 bg-blue-500/5 text-blue-700 px-2.5 py-1 rounded-md inline-block">Published</span>
                        ) : (
                          <span className={`text-xs font-extrabold uppercase tracking-wide border px-2.5 py-1 rounded-md inline-block ${
                            selectedActivity.status === 'Completed' ? 'text-emerald-700 bg-emerald-500/5 border-emerald-500/20' : 'text-amber-700 bg-amber-500/5 border-amber-500/20'
                          }`}>{selectedActivity.status}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                          {selectedActivity.type === 'News' ? 'Log Timestamp Reference' : 'Ledger Detail Vector'}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-800 block pt-1 line-clamp-2 leading-tight">{selectedActivity.detail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 flex flex-col">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1 text-left">
                    Ref 🖼️ Media Portfolio Gallery (Click to Expand Fullscreen)
                  </span>
                  
                  <div 
                    onClick={() => setIsFullscreenLightbox(true)}
                    className="w-full h-64 sm:h-80 bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-200 relative group shadow-sm bg-cover bg-center transition-all duration-300 cursor-zoom-in"
                    style={{ backgroundImage: `url('${modalActiveImage || '/rotary-logo.png'}')` }}
                  >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                      <div className="bg-white/90 text-black text-xs font-black px-4 py-2.5 rounded-xl shadow-md uppercase tracking-wider scale-95 group-hover:scale-100 transition-transform duration-200">
                        🔍 View Fullscreen
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {(selectedActivity?.galleryImages || []).slice(0, 4).map((imgSrc: string, imgIdx: number) => {
                      const isLastSlot = imgIdx === 3;
                      const hasMoreFiles = (selectedActivity?.galleryImages || []).length > 4;
                      const remainingCount = (selectedActivity?.galleryImages || []).length - 4;

                      return (
                        <button
                          key={imgIdx}
                          onClick={() => setModalActiveImage(imgSrc)}
                          className={`h-16 sm:h-20 bg-neutral-50 rounded-xl overflow-hidden border bg-cover bg-center transition-all duration-200 shadow-sm outline-none cursor-pointer p-0 relative hover:scale-[1.04] ${
                            modalActiveImage === imgSrc ? 'border-amber-500 scale-[0.97]' : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                          style={{ backgroundImage: `url('${imgSrc}')` }}
                        >
                          {isLastSlot && hasMoreFiles && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center text-white font-sans font-black text-sm sm:text-base tracking-wider select-none">
                              +{remainingCount}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* LIGHTBOX Fullscreen Theater */}
          {isFullscreenLightbox && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
              <div onClick={() => setIsFullscreenLightbox(false)} className="absolute inset-0 cursor-zoom-out" />
              <button
                onClick={() => setIsFullscreenLightbox(false)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200 font-mono text-sm font-bold border-none cursor-pointer outline-none shadow-lg z-10"
              >
                ✕
              </button>
              <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center p-2 select-none pointer-events-none">
                <img src={modalActiveImage || '/rotary-logo.png'} alt="Fullscreen Asset Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scaleUp" />
              </div>
              <div className="absolute bottom-6 bg-black/60 backdrop-blur-md px-6 py-2.5 border border-white/10 rounded-full text-white/80 text-xs font-mono tracking-wider shadow-md select-none pointer-events-none">
                {selectedActivity.title} • Media File View
              </div>
            </div>
          )}

        </div>
      )}

      {/* =============================================================
          7. CONTACT HUB WITH HIGH CONTRAST DARK STYLING
          ============================================================= */}
      <section id="contactus" className="py-20 sm:py-28 bg-slate-950 px-4 sm:px-6 border-t border-slate-900 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-1">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs block">Connect With Us</span>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Get Involved Today</h2>
            
            <div className="flex gap-2 mt-8 max-w-md mx-auto bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
              <button suppressHydrationWarning onClick={() => setActiveForm('inquiry')} className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${activeForm === 'inquiry' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Inquiry</button>
              <button suppressHydrationWarning onClick={() => setActiveForm('member')} className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${activeForm === 'member' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Join Us</button>
              <button suppressHydrationWarning onClick={() => setActiveForm('donate')} className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${activeForm === 'donate' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Donate</button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-amber-500/30 transform scale-[1.01]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {activeForm === 'inquiry' && (
              <form name="general-inquiries" method="POST" data-netlify="true" className="space-y-5 text-neutral-200 animate-fadeIn">
                <input type="hidden" name="form-name" value="general-inquiries" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Full Name</label>
                    <input suppressHydrationWarning type="text" name="name" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="Juan dela Cruz" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Email Address</label>
                    <input suppressHydrationWarning type="email" name="email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="juan@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Message or Question</label>
                  <textarea name="message" rows={4} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="How can our organization collaborate with the club?"></textarea>
                </div>
                <div className="w-full block">
                  <button suppressHydrationWarning type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl shadow-lg transition border-none cursor-pointer text-xs uppercase tracking-wider">Submit General Inquiry</button>
                </div>
              </form>
            )}

            {activeForm === 'member' && (
              <form name="membership-applications" method="POST" data-netlify="true" className="space-y-5 text-neutral-200 animate-fadeIn">
                <input type="hidden" name="form-name" value="membership-applications" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Full Name</label>
                    <input suppressHydrationWarning type="text" name="name" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="Juan dela Cruz" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Contact Number</label>
                    <input suppressHydrationWarning type="tel" name="phone" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="+63 912 345 6789" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Occupation</label>
                    <input suppressHydrationWarning type="text" name="occupation" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="Software Engineer / Business Owner" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Why do you want to join us?</label>
                  <textarea name="reason_to_join" rows={4} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="Tell us about your motivation to service the community..."></textarea>
                </div>
                <div className="w-full block">
                  <button suppressHydrationWarning type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl shadow-lg transition border-none cursor-pointer text-xs uppercase tracking-wider">Submit Membership Request</button>
                </div>
              </form>
            )}

            {activeForm === 'donate' && (
              <form name="donation-pledges" method="POST" data-netlify="true" className="space-y-5 text-neutral-200 animate-fadeIn">
                <input type="hidden" name="form-name" value="donation-pledges" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Donor Name</label>
                    <input suppressHydrationWarning type="text" name="donor" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="Anonymous" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Target Project Cause</label>
                    <select 
                      suppressHydrationWarning 
                      name="cause" 
                      value={selectedCause}
                      onChange={(e) => setSelectedCause(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 transition bg-transparent"
                    >
                      <option value="disease-prevention">Disease Prevention & Treatment</option>
                      <option value="water-sanitation">Water, Sanitation, & Hygiene</option>
                      <option value="supporting-education">Basic Education and Literacy</option>
                      <option value="local-economies">Growing Local Economies</option>
                      <option value="peacebuilding">Peacebuilding & Conflict Prevention</option>
                      <option value="maternal-child-health">Maternal & Child Health</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {selectedCause === 'other' && (
                  <div className="animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Specify Project Cause</label>
                    <input 
                      suppressHydrationWarning 
                      type="text" 
                      name="custom_cause" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" 
                      placeholder="Enter the custom project or initiative name..." 
                    />
                  </div>
                )}

                <div className="bg-slate-955 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <span className="block text-xs font-black text-amber-500 uppercase tracking-wider">Fund Transfer Instructions</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    Please transfer your donation amount using your preferred banking dashboard or electronic wallet to the following destination parameters below:
                  </p>
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-400">
                    <div><span className="text-slate-500 font-bold">Bank Name:</span> Asia United Bank (AUB)</div>
                    <div><span className="text-slate-500 font-bold">Account Name:</span> Rotary Club of Meycauayan Metro</div>
                    <div><span className="text-slate-500 font-bold">Account Number:</span> 122-01-00110-8</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Upload Receipt Attachment</label>
                  <p className="text-[10px] text-slate-500 mb-2 leading-tight">
                    Please attach your verified digital transaction remittance slip snapshot or banking snapshot. Accepted formats include: JPG, JPEG, and PNG only.
                  </p>
                  <input 
                    type="file" 
                    name="receipt_attachment" 
                    required 
                    accept="image/png, image/jpeg, image/jpg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-400 focus:outline-none focus:border-amber-500 transition file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-black hover:file:bg-amber-600 file:cursor-pointer"
                  />
                </div>

                <div className="w-full block">
                  <button suppressHydrationWarning type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl shadow-lg transition border-none cursor-pointer text-xs uppercase tracking-wider">Submit Donation Pledge</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-black text-white py-12 px-6 border-t border-neutral-800 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h4 className="font-bold text-base text-white">Rotary Club of Meycauayan Metro</h4>
            <p className="text-xs text-neutral-400 mt-1">Rotary International District 3770 • Bulacan, Philippines</p>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-4 text-xs font-mono">
              <a href="mailto:rcmeycauayanmetro@gmail.com" className="text-neutral-400 hover:text-amber-500 transition duration-300 no-underline">
                📧 rcmeycauayanmetro@gmail.com
              </a>
              <a href="https://www.facebook.com/rotaryclubofmeycauayanmetro" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition duration-300 inline-block align-middle" title="Visit our Facebook Page">
                <svg className="w-5 h-5 fill-current text-neutral-400 hover:text-[#1877F2] transition duration-300" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-neutral-400">© {new Date().getFullYear()} All Rights Reserved. Service Above Self.</div>
        </div>
      </footer>

      {/* 9. FLOATING BACK TO TOP FLOATER */}
      <a href="#top" onClick={(e) => scrollToSection(e, 'top')} className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-amber-500 text-black w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-300 transform font-bold text-lg sm:text-xl select-none ${showScrollButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'}`} title="Scroll to Top">↑</a>

    </main>
  );
}