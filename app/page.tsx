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
}

// =================================================================
// COFFEE-TABLE MAGAZINE VALIDATED DATABASES (RY 2026-2027 ROSTERS)
// =================================================================
const initialUsers: RotaryUser[] = [
  // RY 2026-2027 OFFICERS
  { id: 1, name: "Arvin Jason Andaya", role: "Officer", position: "Club President", isOfficer: true, isDirector: false, image: "/members/Arvin Jayson Andaya.png", birthday: "March 9", username: "arvinjasonandaya", email: "arvin@rcmeycauayanmetro.org" },
  { id: 2, name: "Diosdado Alvarado", role: "Officer", position: "Vice President", isOfficer: true, isDirector: false, image: "/members/Diosdado Alvarado.png", birthday: "December 9", username: "diosdadoalvarado", email: "diosdado@rcmeycauayanmetro.org" },
  { id: 3, name: "Daniel Cuyos", role: "Officer", position: "President Elect", isOfficer: true, isDirector: false, image: "/members/Daniel Cuyos.png", birthday: "April 11", username: "danielcuyos", email: "daniel@rcmeycauayanmetro.org" },
  { id: 4, name: "Rosemarie Valencia", role: "Officer", position: "Club Secretary", isOfficer: true, isDirector: true, directorPosition: "Club Administration Director", image: "/members/Rosemarie Valencia.png", birthday: "August 14", username: "rosemarievalencia", email: "rosemarie@rcmeycauayanmetro.org" },
  { id: 5, name: "Adrian Go", role: "Officer", position: "Executive Secretary", isOfficer: true, isDirector: true, directorPosition: "Public Image Director", image: "/members/Adrian Go.png", birthday: "November 19", username: "adriango", email: "adrian@rcmeycauayanmetro.org" },
  { id: 6, name: "Mark Christian Aloran", role: "Officer", position: "Club Treasurer", isOfficer: true, isDirector: false, image: "/members/Mark Christian Aloran.png", birthday: "November 15", username: "markchristianaloran", email: "mark@rcmeycauayanmetro.org" },
  { id: 7, name: "April Homoroc", role: "Officer", position: "Club Auditor", isOfficer: true, isDirector: false, image: "/members/April Homoroc.png", birthday: "December 20", username: "aprilhomoroc", email: "april@rcmeycauayanmetro.org" },
  { id: 8, name: "Eric Homoroc", role: "Officer", position: "PRO", isOfficer: true, isDirector: false, image: "/members/Eric Homoroc.png", birthday: "October 13", username: "erichomoroc", email: "eric@rcmeycauayanmetro.org" },
  // INDEPENDENT CLUB DIRECTORS / LEADERSHIP MARGINS
  { id: 9, name: "Angelito Ferrer", role: "Super Admin", position: "Immediate Past President", isOfficer: false, isDirector: true, directorPosition: "Rotary Foundation Director", image: "/members/Angelito Ferrer.png", birthday: "November 2", username: "angelitoferrer", email: "angelito@rcmeycauayanmetro.org" },
  { id: 10, name: "Jaquelyn Jacob", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Club Membership Director", image: "/members/Jackie Halasan.png", birthday: "July 21", username: "jackiehalasan", email: "jackie@rcmeycauayanmetro.org" },
  { id: 11, name: "Raymond Peralta", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Service Project Director", image: "/members/Raymond Peralta.png", birthday: "January 10", username: "raymondperalta", email: "raymond@rcmeycauayanmetro.org" },
  { id: 12, name: "Severino Pascual Jr.", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Youth Service Director", image: "/members/Severino Pascual Jr.png", birthday: "July 27", username: "severinopascual", email: "severino@rcmeycauayanmetro.org" },
  { id: 13, name: "Jayson Fernandez", role: "Officer", position: "Assistant Governor", isOfficer: false, isDirector: true, directorPosition: "Protocol Officer", image: "/members/Jayson Fernandez.png", birthday: "July 13", username: "jaysonfernandez", email: "jayson@rcmeycauayanmetro.org" },
  { id: 14, name: "Francis Jay Dela Cruz", role: "Officer", position: "Active Member", isOfficer: false, isDirector: true, directorPosition: "Club Learning Facilitator", image: "/members/Francis Jay Dela Cruz.png", birthday: "December 21", username: "francisjaydelacruz", email: "francis@rcmeycauayanmetro.org" },
  { id: 18, name: "Felix Domigpe", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Felix Domigpe.png", birthday: "November 5", username: "felixdomigpe", email: "felix@rcmeycauayanmetro.org" },
  { id: 19, name: "Pablito Javier", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Pablito Javier.png", birthday: "January 5", username: "pablitojavier", email: "pablito@rcmeycauayanmetro.org" },
  { id: 20, name: "Frederick Malapit", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Frederick Malapit.png", birthday: "July 12", username: "frederickmalapit", email: "frederick@rcmeycauayanmetro.org" },
  { id: 21, name: "Enrique Milan", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Enrique Milan.png", birthday: "March 1", username: "enriquemilan", email: "enrique@rcmeycauayanmetro.org" },
  { id: 22, name: "Ma. Carmela Osiones", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Ma Carmela Osiones.png", birthday: "July 7", username: "macarmelaosiones", email: "carmela@rcmeycauayanmetro.org" },
  { id: 23, name: "Willy Sy", role: "Member", position: "Active Member", isOfficer: false, isDirector: false, image: "/members/Willy Sy.png", birthday: "March 12", username: "willysy", email: "willy@rcmeycauayanmetro.org" }
];

const initialActivities = [
  { id: 1, type: 'Project', title: "Global Grant Health Initiative (GG2517783)", category: "Disease Prevention & Treatment", description: "Deploying targeted diagnostic facility clusters and essential clinical resources to localized sectors.", fullDescription: "This targeted global grant health blueprint coordinates specialized cluster installations alongside active diagnostic operations across dense municipal hubs.", status: "Completed", detail: "Global Grant Verification Compliance Complete", galleryImages: ["/carousel 3.jpg"] },
  { id: 2, type: 'Project', title: "WASH Clean Water Hub Infrastructure", category: "Water, Sanitation, & Hygiene", description: "Constructing physical water delivery nodes and comprehensive sanitation framework units for high-need zones.", fullDescription: "Deploying physical resource delivery terminals coupled with multi-stage micro-filtration block architecture grids for surrounding residential pockets.", status: "Ongoing", detail: "WASH Infrastructure Deployment Grid", galleryImages: ["/carousel 2.jpg"] },
  { id: 3, type: 'News', title: "24th Handover and Induction Ceremony Success", category: "Club Assembly", description: "The club formally convened at the Matrix Creation Events Venue to install President Arvin Jayson Andaya and the incoming board.", fullDescription: "Formally convening incoming legislative executives and club directors into operational alignment benchmarks for the current administrative calendar layout.", status: "Completed", detail: "Inaugurated on July 29, 2026", galleryImages: ["/carousel 1.jpg"] },
  { id: 4, type: 'Project', title: "Meycauayan Youth Textbook & Literacy Drive", category: "Supporting Education", description: "Distributing full core primary catalog book blocks and implementing reading systems in public facilities.", fullDescription: "Distributing robust foundational media blocks and textual libraries to expand primary development track records within localized school clusters.", status: "Completed", detail: "Empowering Next-Gen Scholars", galleryImages: ["/carousel 1.jpg"] }
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
    meta: "Assistant Governor, RY 2026–2027 • District 3770"
  },
  {
    title: "Message from the Immediate Past President",
    text: "It has been both an honor and a privilege to serve as President of the Rotary Club of Meycauayan Metro during Rotary Year 2025–2026. Guided by the inspiring Rotary theme “Unite for Good,” our club came together with a shared purpose—to strengthen our fellowship and expand our service to the community. This Rotary year has shown us the true power of unity. When individuals come together with the same vision and dedication to service, extraordinary things can be achieved. Through the collective efforts of our members, partners, and supporters, we were able to carry out meaningful projects that addressed community needs and uplifted the lives of those we serve. I am deeply grateful to every Rotarian of our club whose commitment and passion made our initiatives possible. Your willingness to serve, your generosity, and your dedication to the Rotary ideals continue to embody the spirit of Service Above Self that defines the mission of Rotary International. As we gather for our 23rd Handover and Induction Ceremony, we celebrate not only the accomplishments of the past year but also the enduring legacy of service that our club continues to build. I extend my heartfelt congratulations to the incoming leaders and officers who will guide the club forward under the theme “Create Lasting Impact.” May we continue to stand together in fellowship and service, united in our commitment to make a difference in our community and beyond. Maraming salamat, and may Rotary continue to inspire us all to serve with compassion, integrity, and unity.",
    author: "Angelito Ferrer",
    meta: "Immediate Past President, RY 2025–2026"
  },
  {
    title: "Message from the President",
    text: "It is with great humility and gratitude that I accept the responsibility of serving as President of the Rotary Club of Meycauayan Metro for Rotary Year 2026–2027. I am deeply honored by the trust and confidence given to me by my fellow Rotarians, and I look forward to leading our club in another meaningful year of service and fellowship. As we begin this new Rotary year, we are inspired by the Rotary theme “Create Lasting Impact.” This theme reminds us that the true value of our service is not only measured by what we accomplish today, but by the lasting difference we make in the lives of the people and communities we serve. Building on the strong foundation laid by our past leaders and members, our club will continue to pursue projects that address real community needs, promote sustainable development, and strengthen partnerships with organizations that share our vision. Through collaboration, dedication, and the unwavering commitment of our members, we will strive to create programs that leave a meaningful and lasting legacy. I extend my heartfelt appreciation to our Immediate Past President, Angelito Ferrer, whose leadership under the theme “Unite for Good” has further strengthened the spirit of unity and service within our club. Because of this strong foundation, we move forward with renewed energy and purpose. As we celebrate our 23rd Handover and Induction Ceremony, I invite every member of the Rotary Club of Meycauayan Metro to continue working together with passion and commitment. Let us deepen our fellowship, expand our service, and remain steadfast in upholding the ideals of Rotary International and its guiding principle of Service Above Self. Together, let us continue to serve with purpose, lead with integrity, and truly create lasting impact in our community and beyond.",
    author: "Arvin Jayson Andaya",
    meta: "Club President, RY 2026–2027"
  }
];

const areasOfFocus = [
  { id: 1, title: "Disease Prevention & Treatment", desc: "Setting up continuous diagnostic networks, mobile medical supply grids, and regional health immunity block camps.", icon: "🩺" },
  { id: 2, title: "Water, Sanitation, & Hygiene", desc: "Constructing long-term scalable clean water delivery systems and sustainable micro-filtration infrastructure segments.", icon: "𚚰" },
  { id: 3, title: "Supporting Education", desc: "Expanding text material blocks, structural micro-libraries, and continuous adult learning environments.", icon: "📚" },
  { id: 4, title: "Growing Local Economies", desc: "Formulating scalable alternative livelihood micro-grants and strategic cooperative development framework blocks.", icon: "📊" },
  { id: 5, title: "Peacebuilding & Conflict Prevention", desc: "Training municipal community leaders to identify threat triggers and formulate legal integration paradigms.", icon: "🕊️" },
  { id: 6, title: "Maternal & Child Health", desc: "Supplying comprehensive clean delivery kits and optimizing early infantile health tracking mechanisms.", icon: "👶" }
];

// DATA MATRIX: VERIFIED RELATIVE PUBLIC IMAGE DOMAIN REFERENCES
const corporateSponsors = [
  { name: "Evergold Memorial Services", logoImage: "/partner-evergold-logo.jpg", fallbackText: "EMS", url: "https://www.facebook.com/evergoldmemorialservice" },
  { name: "Trident Assessment and Technical Training Center, Inc.", logoImage: "/partner-trident-logo.jpg", fallbackText: "TAATTC", url: "https://www.facebook.com/profile.php?id=100093554252998" },
  { name: "The Pixels Inc.", logoImage: "/partner-thepixelsinc-logo.png", fallbackText: "TPI", url: "https://www.thepixelsinc.com/" },
  { name: "Dr. H Centro Estetico", logoImage: "/partner-dr-h-centro-estetico-logo.jpg", fallbackText: "DRH", url: "https://www.facebook.com/DrHCentroEstetico" },
  { name: "Rotary International", logoImage: "/partner-rotary-international.png", fallbackText: "RI", url: "https://www.rotary.org/en" },
  { name: "Cityblinds Enterprises", logoImage: "/partner-cityblinds-logo.png", fallbackText: "CE", url: "#" },
  { name: "EM Builders", logoImage: "/partner-em-builders-logo.jpg", fallbackText: "EMB", url: "https://www.facebook.com/profile.php?id=100063686025704" },
  { name: "J4 Squad Events & Management", logoImage: "/partner-j4-squad-logo.jpeg", fallbackText: "J4S", url: "#" }
];

const monthMap: { [key: string]: number } = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const hydration = { suppressHydrationWarning: true };
  const [activeForm, setActiveForm] = useState<'inquiry' | 'member' | 'donate'>('inquiry');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Project' | 'News'>('All');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'fourway' | 'objectives' | 'vision'>('fourway');
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
  const itemsPerPage = 8;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const allProcessedActivities = initialActivities.filter(item => {
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
    setCurrentSlideIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  const handleNextMessage = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % officialMessages.length);
  };

  const handlePrevMessage = () => {
    setCurrentMessageIndex((prev) => (prev === 0 ? officialMessages.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!mounted || isHovered) return;
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [isHovered, mounted]);

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
  }, [activeVisionaryTab, rosterSortCriteria]);

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
    const subset = initialUsers.filter(user => {
      if (activeVisionaryTab === 'officers') return user.isOfficer;
      if (activeVisionaryTab === 'directors') return user.isDirector;
      return true;
    });

    if (activeVisionaryTab === 'roster') {
      return [...subset].sort((a, b) => {
        if (rosterSortCriteria === 'surname') {
          const namePartsA = a.name.trim().split(/\s+/);
          const namePartsB = b.name.trim().split(/\s+/);
          const surnameA = namePartsA[namePartsA.length - 1].toLowerCase();
          const surnameB = namePartsB[namePartsB.length - 1].toLowerCase();
          return surnameA.localeCompare(surnameB);
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
  const filteredVisionaries = activeVisionaryTab === 'roster'
    ? allFilteredVisionaries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : allFilteredVisionaries;

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
        /* Webkit Engines (Chrome, Safari, Edge) */
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

        /* Firefox Support Layer */
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
      `}</style>

      {/* 1. SMART STICKY NAVIGATION BAR */}
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
            <a href="#contactus" onClick={(e) => scrollToSection(e, 'contactus')} className="hover:text-amber-500 py-1">Get Involved</a>
          </div>
        )}
      </header>

      {/* 2. DYNAMIC HERO LANDING CAROUSEL */}
      <section 
        className="relative min-h-[85vh] flex items-center text-white px-4 sm:px-6 overflow-hidden bg-black"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {carouselSlides.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.65)), url('${slide.url}')`,
              transitionProperty: 'opacity, transform'
            }}
          />
        ))}

        <button {...hydration} onClick={handlePrevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/30 border border-neutral-800 hover:border-amber-500 hover:text-amber-500 text-white transition z-20 cursor-pointer hidden sm:flex select-none">‹</button>
        <button {...hydration} onClick={handleNextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/30 border border-neutral-800 hover:border-amber-500 hover:text-amber-500 text-white transition z-20 cursor-pointer hidden sm:flex select-none">›</button>

        <div className="max-w-7xl mx-auto w-full relative z-10 py-12 sm:py-16">
          <div className="text-center md:text-left max-w-2xl">
            <span className="bg-neutral-900 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-neutral-800 shadow-sm inline-block">District 3770 • Service Above Self</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mt-4 mb-6 uppercase leading-none">Create Lasting Impact</h1>
            <p className="text-sm sm:text-base text-neutral-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">Guided by the enduring Rotary principle of Service Above Self, the Rotary Club of Meycauayan Metro continues to transform lives through sustainable humanitarian action.</p>
            
            <div className="grid grid-cols-2 sm:flex gap-3 max-w-sm mx-auto md:max-w-none md:mx-0">
              <a href="#projects-and-news" onClick={(e) => scrollToSection(e, 'projects-and-news')} className="bg-white text-black font-black py-3 rounded-lg hover:bg-amber-500 hover:text-black transition -300 shadow-md text-center text-xs sm:text-sm px-4 sm:px-6">Show Impact</a>
              <a href="#who-we-are" onClick={(e) => scrollToSection(e, 'who-we-are')} className="border-2 border-neutral-500 text-white font-bold py-3 rounded-lg hover:bg-white/10 transition text-center text-xs sm:text-sm px-4 sm:px-6">Learn More</a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {carouselSlides.map((_, dotIdx) => (
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
            
            {/* LEFT COLUMN: INTRODUCTION TEXT COPY */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <span className="text-amber-500 font-black uppercase tracking-widest text-xs block">Who We Are</span>
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight uppercase border-b-4 border-black pb-3 inline-block">
                  Introduction
                </h2>
              </div>
              <div className="text-neutral-600 leading-relaxed space-y-5 text-justify text-sm sm:text-base font-normal">
                <p>
                  Guided by the enduring Rotary principle of Service Above Self, the Rotary International community continues to transform lives through meaningful service and strong fellowship. Each Rotary year offers a renewed opportunity for Rotarians to make a difference in their communities and beyond.
                </p>
                <p>
                  As we celebrate the 23rd Handover and Induction Ceremony of the Rotary Club of Meycauayan Club, we reflect on the remarkable journey of service that has shaped our club. This milestone marks not only the transition of leadership but also a reaffirmation of our shared commitment to Rotary’s mission.
                </p>
                <p>
                  Anchored in this year’s Rotary theme, “Create Lasting Impact,” our club continues to pursue initiatives that bring sustainable and meaningful change to the communities we serve. Through collaborative projects, humanitarian programs, and the dedication of our members, we strive to ensure that our efforts today will leave a positive legacy for generations to come.
                </p>
                <p>
                  This commemorative coffee-table magazine captures the spirit of our club—our projects, achievements, partnerships, and the fellowship that binds us together as Rotarians. It is a celebration of the passion and commitment of our members, leaders, and partners who continually support our mission of service.
                </p>
                <p>
                  As we honor the leadership and contributions of the outgoing officers and warmly welcome the new set of leaders, we look forward with renewed inspiration and determination. Together, as one Rotary family, we remain committed to serving our community and truly creating lasting impact.
                </p>
              </div>
            </div>
            
            {/* RIGHT COLUMN: PREMIUM EDITORIAL CAROUSEL DECK WITH CUSTOM MATCHING SCROLLBAR */}
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
                        
                        <div className="mt-4 pt-4 border-t border-neutral-900">
                          <h4 className="font-black text-amber-500 text-sm tracking-wide uppercase leading-none">
                            {msg.author}
                          </h4>
                          <p className="text-[11px] font-mono text-neutral-500 mt-1 uppercase tracking-widest leading-none">
                            {msg.meta}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center relative z-10">
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

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-500 font-extrabold uppercase tracking-widest text-xs block">Guiding Frameworks</span>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">The Objectives & Vision Matrix</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">Explore the fundamental tenets and structural philosophy that steer our global network of service leaders.</p>
          </div>

          <div className="flex bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl max-w-xl mx-auto">
            <button {...hydration} onClick={() => setActiveTab('fourway')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeTab === 'fourway' ? 'bg-amber-500 text-black font-extrabold shadow-lg' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>The 4-Way Test</button>
            <button {...hydration} onClick={() => setActiveTab('objectives')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeTab === 'objectives' ? 'bg-amber-500 text-black font-extrabold shadow-lg' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Rotary Objectives</button>
            <button {...hydration} onClick={() => setActiveTab('vision')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeTab === 'vision' ? 'bg-amber-500 text-black font-extrabold shadow-lg' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Our Vision</button>
          </div>

          <div className="bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-6 sm:p-12 shadow-2xl min-h-[300px] flex items-center justify-center transition-all duration-500 hover:border-neutral-700/40">
            
            {activeTab === 'fourway' && (
              <div className="w-full space-y-8 animate-fadeIn">
                <div className="text-center md:text-left">
                  <span className="text-[10px] bg-slate-900 text-slate-400 font-mono border border-slate-800 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-2">Ethical Baseline</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">Of the things we think, say, or do:</h3>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "01", desc: "Is it the truth?" },
                    { title: "02", desc: "Is it fair to all concerned?" },
                    { title: "03", desc: "Will it build goodwill and better friendships?" },
                    { title: "04", desc: "Will it be beneficial to all concerned?" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-950/80 backdrop-blur-md border border-slate-900 rounded-2xl p-5 hover:border-amber-500/40 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.1)] transition-all group duration-300 relative overflow-hidden">
                      <div className="text-3xl font-black text-amber-500/5 font-mono absolute top-2 right-3 group-hover:text-amber-500/30 transition-all duration-300 transform group-hover:scale-110 select-none">{item.title}</div>
                      <h4 className="text-xs font-black tracking-widest text-amber-500 mb-1.5 uppercase font-mono group-hover:text-amber-400 transition-colors">{item.title}</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed font-normal">{item.desc}</p>
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
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "The development of acquaintance as an opportunity for service.",
                    "High ethical standards in business and professions; the recognition of worthiness of all useful occupations; and the dignifying of each Rotarian's occupation as an opportunity to serve society.",
                    "The application of the ideal of service in each Rotarian's personal, business, and community life.",
                    "The advancement of international understanding, goodwill, and peace through a world fellowship of business and professional persons united in the ideal of service."
                  ].map((text, idx) => (
                    <div key={idx} className="bg-slate-950/50 backdrop-blur-md border border-slate-900/60 rounded-2xl p-5 flex gap-4 items-start hover:bg-slate-950/90 hover:scale-[1.01] hover:border-blue-500/30 shadow-md transition-all duration-300 group">
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

          </div>
        </div>
      </section>

      {/* =============================================================
          4.5 ADDED ROTARY AREAS OF FOCUS INTERACTIVE MESH WORKSPACE
          ============================================================= */}
      <section id="focus-channels" className="py-24 bg-white border-b border-neutral-200 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-600 font-extrabold uppercase tracking-widest text-xs block">Strategic Pillars</span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight uppercase">Rotary Areas of Focus</h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">Our humanitarian targets optimize specific tactical focus nodes across seven globally recognized development vector bands.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {areasOfFocus.map((focus) => (
              <div 
                key={focus.id}
                className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-8 hover:border-amber-500/50 hover:bg-white hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(217,119,6,0.08)] transition-all group duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-xl group-hover:bg-amber-500 group-hover:text-black group-hover:scale-105 transition-all duration-300">
                    {focus.icon}
                  </div>
                  <h3 className="text-base font-black text-neutral-900 uppercase tracking-wide leading-snug group-hover:text-amber-600 transition-colors duration-200">
                    {focus.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-normal tracking-wide text-justify">
                    {focus.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================================
          4.8 UPGRADED: IMMERSIVE LOGO MARQUEE (NO OUTLINES, MATCHES BACKGROUND)
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
                className="flex items-center justify-center p-3 rounded-2xl shrink-0 group transition-all duration-300 no-underline cursor-pointer w-44 h-24 bg-neutral-50/50 hover:bg-neutral-100/60"
                title={sponsor.name}
              >
                {/* Optimized size architecture with object-contain to dynamically unify logos */}
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

          <div className="flex bg-white p-1 rounded-2xl border border-neutral-200 shadow-sm max-w-xl mx-auto">
            <button {...hydration} onClick={() => setActiveVisionaryTab('officers')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeVisionaryTab === 'officers' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-neutral-500 hover:text-amber-600 bg-transparent'}`}>RY Officers</button>
            <button {...hydration} onClick={() => setActiveVisionaryTab('directors')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeVisionaryTab === 'directors' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-neutral-500 hover:text-amber-600 bg-transparent'}`}>Club Directors</button>
            <button {...hydration} onClick={() => setActiveVisionaryTab('roster')} className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-none cursor-pointer ${activeVisionaryTab === 'roster' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-neutral-500 hover:text-amber-600 bg-transparent'}`}>Official Roster</button>
          </div>

          <div className="bg-white/40 backdrop-blur-xl border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-500">
            
            {activeVisionaryTab === 'roster' && (
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6 pb-4 border-b border-neutral-100 animate-fadeIn">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
                  ⚡ Sort Algorithm Parameters:
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

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
              {filteredVisionaries.map((officer) => {
                // RUNTIME AUTO-NORMALIZER LAYER
                const resolvedImagePath = officer.image.startsWith('/members/') 
                  ? officer.image 
                  : `/members/${officer.name.trim().replace(/\s+/g, '_')}${officer.image.endsWith('.png') ? '.png' : '.jpg'}`;

                return (
                  <div 
                    key={officer.id} 
                    className="bg-white border border-neutral-200 rounded-2xl p-5 text-center hover:border-amber-500/50 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(217,119,6,0.12)] transition-all group duration-300 relative overflow-hidden flex flex-col items-center justify-between min-h-[260px]"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-neutral-100 group-hover:border-amber-500/50 transition-colors duration-300 shadow-sm relative bg-neutral-100">
                      <img 
                        src={resolvedImagePath} 
                        alt={officer.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f5f5f5'/><text x='50%27 y='55%27 font-family='sans-serif' font-size='30' fill='%23d97706' text-anchor='middle'>👤</text></svg>";
                        }}
                      />
                    </div>

                    <div className="space-y-1 flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-black text-neutral-900 tracking-wide group-hover:text-amber-600 transition-colors duration-200 line-clamp-2 px-1">
                        {officer.name}
                      </h3>
                      
                      {activeVisionaryTab === 'roster' ? (
                        <div className="pt-2">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block">
                            Birthday
                          </span>
                          <p className="text-xs font-bold text-blue-600 font-sans mt-0.5">
                            {officer.birthday || "Unspecified"}
                          </p>
                        </div>
                      ) : activeVisionaryTab === 'directors' ? (
                        <p className="text-[11px] text-blue-600 font-extrabold uppercase tracking-wider leading-tight max-w-[180px] mx-auto">
                          {officer.directorPosition || officer.position}
                        </p>
                      ) : (
                        <p className="text-[11px] text-blue-600 font-extrabold uppercase tracking-wider leading-tight max-w-[180px] mx-auto">
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

            {/* AESTHETIC PAGINATION LAYER */}
            {activeVisionaryTab === 'roster' && totalPages > 1 && (
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
                            ? 'bg-amber-500 border-amber-500 text-black shadow-md shadow-amber-500/20'
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
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full ${
                      activity.type === 'Project' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {activity.type}
                    </span>
                    {activity.type === 'Project' && activity.status && (
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        activity.status === 'Completed' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-amber-600 bg-amber-50 border border-amber-100'
                      }`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 mb-1 tracking-tight leading-snug group-hover:text-amber-600 transition-colors duration-200">
                    {activity.title}
                  </h3>
                  <p className="text-[11px] font-extrabold text-blue-600 tracking-wide uppercase mb-3">{activity.category}</p>
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
                <p className="text-xs text-blue-600 font-mono font-bold uppercase tracking-wider pt-1">{selectedActivity.category}</p>
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
                
                {/* Left Area Content Column */}
                <div className="lg:col-span-7 flex flex-col justify-between min-h-[460px] text-left">
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-3 custom-magazine-scrollbar">
                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase border-b-4 border-black pb-3">
                      {selectedActivity.title}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed text-justify font-normal tracking-wide">
                      {selectedActivity.fullDescription || selectedActivity.description}
                    </p>
                  </div>
                  
                  {/* Share Action Block Container */}
                  <div className="pt-4 border-t border-neutral-100 space-y-4 bg-white relative">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">📤 Distribute This Document Ledger Node:</span>
                      
                      <div className="relative inline-block text-left" ref={shareMenuRef}>
                        <button 
                          onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-black uppercase tracking-wider rounded-xl transition duration-200 border-none cursor-pointer shadow-md flex items-center gap-1.5 select-none"
                        >
                          Share <span>{isShareMenuOpen ? '▴' : '▾'}</span>
                        </button>

                        {isShareMenuOpen && (
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn py-1">
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

                {/* Right Area Media Deck Column */}
                <div className="lg:col-span-5 space-y-4 flex flex-col">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-1 text-left">
                    🖼️ Media Portfolio Gallery (Click to Expand Fullscreen)
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
            
            <div className="flex gap-2 mt-8 max-w-md mx-auto bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
              <button suppressHydrationWarning onClick={() => setActiveForm('inquiry')} className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${activeForm === 'inquiry' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Inquiry</button>
              <button suppressHydrationWarning onClick={() => setActiveForm('member')} className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${activeForm === 'member' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Join Us</button>
              <button suppressHydrationWarning onClick={() => setActiveForm('donate')} className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${activeForm === 'donate' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-400 hover:text-amber-500 bg-transparent'}`}>Donate</button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-amber-500/30 transform hover:scale-[1.01]">
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
                    <input suppressHydrationWarning type="tel" name="phone" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition" placeholder="+63 947 467 5516" />
                  </div>
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
                    <select suppressHydrationWarning name="cause" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 transition bg-transparent">
                      <option value="maternal-health">Disease Prevention</option>
                      <option value="education">Supporting Education</option>
                      <option value="environment">Clean Water Facility</option>
                    </select>
                  </div>
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
          </div>
          <div className="text-neutral-400">© {new Date().getFullYear()} All Rights Reserved. Service Above Self.</div>
        </div>
      </footer>

      {/* 9. FLOATING BACK TO TOP FLOATER */}
      <a href="#top" onClick={(e) => scrollToSection(e, 'top')} className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-amber-500 text-black w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-300 transform font-bold text-lg sm:text-xl select-none ${showScrollButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'}`} title="Scroll to Top">↑</a>

    </main>
  );
}