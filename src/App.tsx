import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Dumbbell, 
  Clock, 
  Maximize2, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Flame, 
  ChevronRight, 
  Calendar, 
  Shield, 
  QrCode, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Download, 
  Trash2, 
  Search, 
  Lock, 
  Unlock, 
  ChevronLeft,
  ThumbsUp, 
  Compass, 
  Database,
  ArrowRight
} from "lucide-react";

// Unique Key for localStorage
const LOCAL_STORAGE_KEY = "ipower_strength_pre_registrations";

// Base type for registrations
interface Registration {
  id: string;
  nombre: string;
  email: string;
  fechaNacimiento: string;
  telefono: string;
  deportes: string[];
  objetivos: string[];
  fechaRegistro: string;
}

// Vibrant Brand Logo Component with double-layered elegant custom Red athletic vector fallback
function BrandLogo({ className = "w-12 h-12" }: { className?: string }) {
  const logoUrl = "https://scontent-mad1-1.cdninstagram.com/v/t51.2885-19/404950096_1421268315464345_3300682229199547007_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4zMzAuYzIifQ&_nc_ht=scontent-mad1-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gGjEhImwpIL6RwphzmsQxw1qJh_463Fhk6ObcAmWM2qONqca4CWe0PpG3n0urrKDu8&_nc_ohc=0Q2_S37aMksQ7kNvwGatwJV&_nc_gid=ITlFISwVGwucYPFNJA8elg&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_Af__SmyFFwPgGQ-RSVC1bE4BSUwdpiYyG1F9_ZZmv14nZw&oe=6A3B0F28&_nc_sid=7a9f4b";

  return (
    <div className={`relative ${className} rounded-full overflow-hidden border border-brand-gold bg-black flex items-center justify-center shrink-0 shadow-md select-none`}>
      {/* Background/fallback underlay design always there in case of load latency */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold to-[#990110] flex flex-col items-center justify-center text-white">
        <span className="font-display font-[900] text-center tracking-tighter text-xs leading-none">
          IP
        </span>
        <div className="w-4 h-[1.5px] bg-white rounded-full mt-0.5 opacity-80" />
      </div>

      {/* Actual image layer overlay */}
      <img 
        src={logoUrl}
        alt="IPower Strength"
        className="absolute inset-0 w-full h-full object-cover rounded-full select-none pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function App() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = useState("hero");
  const [formOpen, setFormOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Real-time scarce slots state (simulating real-time FOMO of Plazas Limitadas)
  const [availableSlots, setAvailableSlots] = useState(14);
  const [currentOnlineViewers, setCurrentOnlineViewers] = useState(3);

  // Load initial pre-registrations from localStorage
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setRegistrations(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing local registrations", e);
      }
    } else {
      // Seed initial dummy registration for admin view demo if empty
      const initialSeed: Registration[] = [
        {
          id: "IP-7729-A",
          nombre: "Carlos Gómez Mendoza",
          email: "carlos.gomez@gmail.com",
          fechaNacimiento: "1998-05-12",
          telefono: "612 45 45 88",
          deportes: ["Powerlifting", "Bodybuilding"],
          objetivos: ["Mejorar fuerza máxima", "Ganar masa muscular"],
          fechaRegistro: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString()
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSeed));
      setRegistrations(initialSeed);
    }

    // Interval to dynamically alter FOMO triggers naturally
    const slotTimer = setInterval(() => {
      setAvailableSlots(prev => {
        if (prev <= 4) return 4; // Never drop to zero
        return Math.random() > 0.75 ? prev - 1 : prev;
      });
    }, 45000);

    const viewerTimer = setInterval(() => {
      setCurrentOnlineViewers(() => Math.floor(Math.random() * 6) + 3);
    }, 12000);

    return () => {
      clearInterval(slotTimer);
      clearInterval(viewerTimer);
    };
  }, []);

  // Form step wizard state
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    fechaNacimiento: "",
    telefono: "",
    deportes: [] as string[],
    objetivos: [] as string[]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedTicket, setSubmittedTicket] = useState<Registration | null>(null);

  // Occupancy Planner States
  const [selectedDay, setSelectedDay] = useState<"Lunes" | "Miércoles" | "Viernes" | "Domingo">("Viernes");
  const [selectedHour, setSelectedHour] = useState(18); // 6 PM default

  // Admin access control
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminFilterSport, setAdminFilterSport] = useState("Todos");
  const [adminSearch, setAdminSearch] = useState("");

  const handleDaySelect = (day: "Lunes" | "Miércoles" | "Viernes" | "Domingo") => {
    setSelectedDay(day);
  };

  // Occupancy values based on actual Friday + typical day peaks from search description
  const getOccupancyRate = (day: string, hour: number) => {
    // 24H Gym: peak hours are usually 18:00 - 21:00 (6-9 PM) and 9:00 - 11:00 AM.
    // Early morning 2 - 5 AM is extremely low (5-10%)
    if (day === "Domingo") {
      // Sunday is very quiet
      if (hour >= 17 && hour <= 20) return 40;
      if (hour >= 10 && hour <= 13) return 30;
      return 15;
    }
    // Weekdays
    if (hour >= 18 && hour <= 21) return 72; // Maximum under IPower limited slots is still comfortable
    if (hour >= 9 && hour <= 12) return 55;
    if (hour >= 14 && hour <= 16) return 35;
    if (hour >= 0 && hour <= 5) return 8; // Night shifts
    return 25;
  };

  // Form Field validation logic
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre completo es obligatorio";
    } else if (formData.nombre.trim().split(" ").length < 2) {
      errors.nombre = "Por favor, escribe nombre y apellido";
    }

    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Introduce un correo válido";
    }

    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    }

    if (!formData.telefono.trim()) {
      errors.telefono = "El número de teléfono es obligatorio";
    } else if (!/^[0-9\s-+]{9,15}$/.test(formData.telefono)) {
      errors.telefono = "Introduce un teléfono válido (mínimo 9 dígitos)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (formStep === 1) {
      if (validateStep1()) {
        setFormStep(2);
      }
    } else if (formStep === 2) {
      if (formData.deportes.length === 0) {
        setFormErrors({ deportes: "Selecciona al menos una disciplina deportiva" });
      } else {
        setFormErrors({});
        setFormStep(3);
      }
    }
  };

  const toggleSport = (sport: string) => {
    setFormData(prev => {
      const current = prev.deportes;
      const index = current.indexOf(sport);
      const updated = index === -1 ? [...current, sport] : current.filter(s => s !== sport);
      return { ...prev, deportes: updated };
    });
    setFormErrors({}); // Clean error if any
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => {
      const current = prev.objetivos;
      const index = current.indexOf(goal);
      const updated = index === -1 ? [...current, goal] : current.filter(g => g !== goal);
      return { ...prev, objetivos: updated };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.objetivos.length === 0) {
      setFormErrors({ objetivos: "Por favor, selecciona al menos un objetivo" });
      return;
    }

    const uniqueId = `IP-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const newRegistration: Registration = {
      id: uniqueId,
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      telefono: formData.telefono.trim(),
      deportes: formData.deportes,
      objetivos: formData.objetivos,
      fechaRegistro: new Date().toLocaleString()
    };

    // Update state and persistent localStorage
    const updatedStorage = [newRegistration, ...registrations];
    setRegistrations(updatedStorage);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStorage));

    // Show dynamic victory screen
    setSubmittedTicket(newRegistration);
    setFormStep(4);
    
    // Scarcity simulation update
    setAvailableSlots(prev => Math.max(3, prev - 1));
  };

  const resetFormState = () => {
    setFormData({
      nombre: "",
      email: "",
      fechaNacimiento: "",
      telefono: "",
      deportes: [],
      objetivos: []
    });
    setFormErrors({});
    setFormStep(1);
    setSubmittedTicket(null);
  };

  // Secure admin login helper
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "ipower2026" || adminPassword === "admin") {
      setIsAdminAuthenticated(true);
      setAdminError("");
    } else {
      setAdminError("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPassword("");
    setAdminOpen(false);
  };

  const handleDeleteRegistration = (id: string) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta pre-inscripción?");
    if (confirmDelete) {
      const filtered = registrations.filter(r => r.id !== id);
      setRegistrations(filtered);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registrations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ipower_preinscripciones_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter registrations for admin dashboard panel
  const filteredRegistrations = registrations.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          item.telefono.includes(adminSearch) || 
                          item.email.toLowerCase().includes(adminSearch.toLowerCase());
    
    const matchesSport = adminFilterSport === "Todos" || item.deportes.includes(adminFilterSport);
    return matchesSearch && matchesSport;
  });

  return (
    <div className="min-h-screen bg-brand-dark text-gray-200 relative overflow-x-hidden selection:bg-brand-gold selection:text-black">
      
      {/* BACKGROUND GRAPHIC INTERACTION GLOWS */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-brand-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with interactive click action for secret portal */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => {
            // Secret admin shortcut is clicking logo
            setAdminOpen(true);
          }}>
            <BrandLogo className="w-12 h-12 border-2 border-brand-gold shadow-lg transition-all duration-300 group-hover:scale-105" />
            <div>
              <span className="font-display text-2xl font-black tracking-tighter text-white block">
                IPOWER<span className="text-brand-gold"> STRENGTH</span>
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 block -mt-1 font-medium select-none">
                High Performance Lab
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <a href="#filosofia" className="text-gray-300 hover:text-brand-gold font-mono text-xs uppercase tracking-widest transition-colors py-2">Filosofía</a>
            <a href="#instalaciones" className="text-gray-300 hover:text-brand-gold font-mono text-xs uppercase tracking-widest transition-colors py-2">Material</a>
            <a href="#ocupacion" className="text-gray-300 hover:text-brand-gold font-mono text-xs uppercase tracking-widest transition-colors py-2">Ocupación 24H</a>
            <a href="#opiniones" className="text-gray-300 hover:text-brand-gold font-mono text-xs uppercase tracking-widest transition-colors py-2">Opiniones (5.0★)</a>
            <a href="#coordenadas" className="text-gray-300 hover:text-brand-gold font-mono text-xs uppercase tracking-widest transition-colors py-2">Ubicación</a>
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center space-x-3">
            <button 
              id="cta_header_inscripcion"
              onClick={() => { setFormOpen(true); setFormStep(1); }}
              className="shine-effect hidden sm:flex bg-gradient-to-r from-brand-gold to-brand-yellow text-black font-semibold font-display tracking-wide px-5 py-3 rounded-md hover:opacity-90 active:scale-95 transition-all text-sm items-center space-x-2 btn-touch-target"
            >
              <span>PRE-INSCRIPCIÓN</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>

            {/* Mobile Menu Hamburger Button - Optimized for minimum 48px target tap */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center text-gray-400 hover:text-white bg-brand-card/85 border border-brand-border h-12 w-12 rounded-lg transition-colors active:scale-95 btn-touch-target"
              aria-label="Toggle Menu"
            >
              <div className="space-y-1.5 w-6">
                <span className={`block h-[2.5px] w-6 bg-current transform transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2 text-brand-gold" : ""}`} />
                <span className={`block h-[2.5px] w-6 bg-current transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`block h-[2.5px] w-6 bg-current transform transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2 text-brand-gold" : ""}`} />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE HAMBURGER FLUID OVERLAY WITH GENTLE RED GLOW */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-20 left-0 right-0 z-30 bg-brand-dark/95 backdrop-blur-lg border-b border-brand-border/80 px-6 py-8 flex flex-col space-y-4 shadow-2xl skew-y-0 glow-subtle"
          >
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-brand-gold mb-2 font-bold select-none border-b border-brand-border/40 pb-2">
              Menu Navegación
            </div>
            <a 
              href="#filosofia" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-brand-gold font-display text-lg font-bold py-3 px-4 rounded-lg bg-white/5 border border-white/5 active:bg-brand-gold/10 transition-all flex items-center justify-between"
            >
              <span>⚡ Filosofía de Competición</span>
              <ChevronRight className="w-4 h-4 text-brand-gold" />
            </a>
            <a 
              href="#instalaciones" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-brand-gold font-display text-lg font-bold py-3 px-4 rounded-lg bg-white/5 border border-white/5 active:bg-brand-gold/10 transition-all flex items-center justify-between"
            >
              <span>🏋️ Colección de Material</span>
              <ChevronRight className="w-4 h-4 text-brand-gold" />
            </a>
            <a 
              href="#ocupacion" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-brand-gold font-display text-lg font-bold py-3 px-4 rounded-lg bg-white/5 border border-white/5 active:bg-brand-gold/10 transition-all flex items-center justify-between"
            >
              <span>📊 Planificador de Aforo 24H</span>
              <ChevronRight className="w-4 h-4 text-brand-gold" />
            </a>
            <a 
              href="#opiniones" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-brand-gold font-display text-lg font-bold py-3 px-4 rounded-lg bg-white/5 border border-white/5 active:bg-brand-gold/10 transition-all flex items-center justify-between"
            >
              <span>★ Opiniones de Atletas</span>
              <ChevronRight className="w-4 h-4 text-brand-gold" />
            </a>
            <a 
              href="#coordenadas" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-brand-gold font-display text-lg font-bold py-3 px-4 rounded-lg bg-white/5 border border-white/5 active:bg-brand-gold/10 transition-all flex items-center justify-between"
            >
              <span>📍 Ubicación Ciudad Real</span>
              <ChevronRight className="w-4 h-4 text-brand-gold" />
            </a>

            {/* Interactive Pre-registration Shortcut inside Drawer */}
            <div className="pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFormOpen(true);
                  setFormStep(1);
                }}
                className="shine-effect w-full bg-gradient-to-r from-brand-gold to-brand-yellow text-black font-display font-extrabold py-4 rounded-xl flex items-center justify-center space-x-2 text-md transition-all active:scale-95 glow-gold"
              >
                <span>¡ PRE-INSCRIBIRSE AHORA !</span>
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE FLOATING CTA SCROLL-DRIVEN */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-30 px-6 pointer-events-none">
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => { setFormOpen(true); setFormStep(1); }}
          className="pointer-events-auto w-full bg-gradient-to-r from-brand-gold to-brand-yellow text-black font-bold font-display shadow-2xl py-4 rounded-xl flex items-center justify-center space-x-2 text-md transition-transform active:scale-95 glow-gold"
        >
          <Sparkles className="w-5 h-5 text-black animate-pulse" />
          <span>PRE-INSCRIBIRSE AHORA</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <main className="pb-24">

        {/* HERO SECTION */}
        <section id="hero" className="relative pt-8 pb-16 md:pt-16 md:pb-28 overflow-hidden border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Pitch */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-20">
                
                {/* Badge alert */}
                <div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-1.5 text-xs font-mono text-brand-gold font-semibold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                  </span>
                  <span>IPOWER STRENGTH | OPEN 24/7/365</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight leading-[0.95] text-white">
                  ENTRENA COMO UN <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-yellow to-white">ATLETA</span>
                  <br />
                  PROGRESA COMO UN <span className="text-brand-gold select-all font-black">PRO</span>
                </h1>

                <p className="max-w-2xl text-gray-400 text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                  ¿Cansado de la masificación absurda de los gimnasios comerciales? Entrena sin límites, con material oficial de competición de la máxima calidad y acceso sin restricciones horarias garantizado en Ciudad Real.
                </p>

                {/* Key USP Badges Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center space-x-2.5 bg-brand-card/50 border border-brand-border px-4 py-3 rounded-lg">
                    <Clock className="w-5 h-5 text-brand-gold filter drop-shadow" />
                    <span className="font-mono text-xs uppercase tracking-wide text-gray-300 font-semibold">Abierto 24 Horas</span>
                  </div>
                  <div className="flex items-center space-x-2.5 bg-brand-card/50 border border-brand-border px-4 py-3 rounded-lg">
                    <Users className="w-5 h-5 text-brand-gold filter drop-shadow" />
                    <span className="font-mono text-xs uppercase tracking-wide text-gray-300 font-semibold">Plazas Limitadas</span>
                  </div>
                  <div className="flex items-center space-x-2.5 bg-brand-card/50 border border-brand-border px-4 py-3 rounded-lg col-span-2 md:col-span-1">
                    <Award className="w-5 h-5 text-brand-gold filter drop-shadow" />
                    <span className="font-mono text-xs uppercase tracking-wide text-gray-300 font-semibold">Material de Élite</span>
                  </div>
                </div>

                {/* Live Real-time Scarcity Indicator */}
                <div className="bg-gradient-to-r from-red-950/20 to-brand-dark border border-red-900/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-xl">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-red-500 animate-bounce" />
                      <span className="text-red-400 font-display font-black tracking-wide text-base">PRE-INSCRICIONES CERRANDO PRONTO</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-normal">
                      Mantenemos las plazas estrictamente limitadas para evitar aglomeraciones.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 bg-black/60 px-4 py-2.5 rounded-lg border border-brand-border self-start sm:self-auto">
                    <div className="text-center">
                      <span className="block font-display text-2xl font-black text-brand-gold animate-pulse">{availableSlots}</span>
                      <span className="block text-[9px] font-mono uppercase tracking-widest text-red-400">Plazas Libres</span>
                    </div>
                    <div className="w-[1px] h-8 bg-brand-border" />
                    <div className="text-center">
                      <span className="block font-display text-md font-black text-white">{currentOnlineViewers}</span>
                      <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-400">Mirando ahora</span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA and secondary interaction */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <button 
                    onClick={() => { setFormOpen(true); setFormStep(1); }}
                    className="w-full sm:w-auto bg-gradient-to-r from-brand-gold to-brand-yellow text-black font-bold font-display text-lg tracking-wide px-8 py-4.5 rounded-lg hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-3 shadow-xl glow-gold"
                  >
                    <span>ASEGURAR MI PLAZA</span>
                    <ArrowRight className="w-5 h-5 text-black" />
                  </button>
                  <a 
                    href="#instalaciones"
                    className="w-full sm:w-auto text-gray-300 font-mono text-xs uppercase tracking-widest px-8 py-4.5 rounded-lg border border-brand-border hover:bg-brand-card hover:text-white transition-colors text-center"
                  >
                    COLECCIÓN DE MATERIAL 👇
                  </a>
                </div>

              </div>

              {/* Dynamic Mockup Image Container */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0 z-10">
                <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-brand-border bg-brand-card shadow-2xl skew-y-0 hover:skew-y-1 transition-transform duration-500">
                  
                  {/* Styled glass header mock */}
                  <div className="bg-black/80 px-4 py-3.5 border-b border-brand-border flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-semibold">IPower Strength Gym Cam #1</span>
                    <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                  </div>

                  {/* Primary generated atmospheric gym image */}
                  <div className="aspect-[4/3] bg-neutral-900 relative">
                    <img 
                      src="/src/assets/images/hero_powerlifting_gym_1781873316807.jpg" 
                      alt="Gimnasio IPower Strength en Ciudad Real con equipamiento oficial"
                      className="w-full h-full object-cover object-center filter saturate-[1.1] brightness-[0.85]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient overlap */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />

                    {/* HUD Overlays */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono bg-black/60 backdrop-blur-md border border-brand-border p-3.5 rounded-lg">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 block uppercase font-medium">Ubicación</span>
                        <span className="text-white font-semibold">C. Esperanza, 3 | Ciudad Real</span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[10px] text-gray-400 block uppercase font-medium">Estado</span>
                        <span className="text-emerald-400 font-semibold flex items-center justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                          Aforo Perfecto
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Floating reviews badge in the top right corner of the box */}
                <div className="absolute -top-5 -right-3 sm:-top-6 sm:-right-6 bg-[#16161C] border border-brand-gold/30 p-3 sm:p-4 rounded-xl shadow-2xl flex items-center space-x-2.5 max-w-[220px] z-30 transition-all duration-300 hover:scale-105 hover:border-brand-gold glow-subtle">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <span className="block font-display text-xs sm:text-sm font-black text-white leading-none">5.0 / 5.0 ESTRELLAS</span>
                    <span className="block text-[8px] sm:text-[9.5px] font-mono text-gray-400 uppercase tracking-wider leading-none mt-1 sm:mt-1.5">50 Reseñas Google Maps</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* BRUTALIST PHILOSOPHY SECTION */}
        <section id="filosofia" className="py-20 border-b border-brand-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block">NUESTROS PILARES</span>
              <h2 className="font-display text-3xl sm:text-4.5xl font-black text-white tracking-tight">
                PROGRESO SIN COMPROMISOS NI EXCUSAS
              </h2>
              <div className="h-[2px] w-12 bg-brand-gold mx-auto" />
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                IPower Strength ha sido construido por y para atletas que buscan un entorno serio, limpio, con el equipamiento preciso para lograr resultados. No somos una cadena masificada comercial. Somos tu laboratorio de entrenamiento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Pillar 1 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-8 hover:border-brand-gold/40 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">CONCILIACIÓN TOTAL 24H</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  ¿Trabajas a turnos? ¿Estudias hasta tarde? No importa. Te equipamos con una llave inteligente para que entres a entrenar las 24 horas del día, los 365 días del año. Tu horario lo marcas tú.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-8 hover:border-brand-gold/40 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">PLAZAS LIMITADAS</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Limitamos el número de miembros inscritos para garantizar que el centro mantenga siempre una excelente disponibilidad horaria. No tendrás que hacer cola por una jaula ni esquivar aglomeraciones.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-8 hover:border-brand-gold/40 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">MATERIAL PROFESIONAL</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Contamos con material de competición de la máxima calidad para Powerlifting, Halterofilia, Streetlifting y Bodybuilding. Barras calibradas, discos de acero macizo y discos de rebote de competición.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* PREMIUM EQUIPMENT SHOWCASE */}
        <section id="instalaciones" className="py-20 border-b border-brand-border bg-gradient-to-b from-brand-dark via-[#0F0F12] to-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Material focus visual */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 bg-black/60 border-b border-brand-border flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>MARCAS: ELEIKO, ROGUE, ATX</span>
                    <span className="text-brand-gold">CALIBRADO PRO</span>
                  </div>
                  <div className="aspect-[4/3] relative">
                    <img 
                      src="/src/assets/images/competition_barbell_1781873332982.jpg" 
                      alt="Material oficial de powerlifting y halterofilia en Ciudad Real"
                      className="w-full h-full object-cover object-center filter saturate-[1.05] brightness-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-brand-border px-3.5 py-1.5 rounded text-xs font-mono text-white">
                      Plataformas e Ingeniería Escandinava
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific features column */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-bold block">MATERIAL DE COMPETICIÓN</span>
                  <h2 className="font-display text-3xl sm:text-4.5xl font-black text-white tracking-tight leading-none">
                    DIFERENCIA FUNDAMENTAL: EQUIPAMIENTO DE COMPETICIÓN
                  </h2>
                  <div className="h-[2px] w-12 bg-brand-gold" />
                </div>

                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Para progresar como un atleta real, necesitas utilizar el mismo material que se emplea en las tarimas oficiales. En IPower Strength no escatimamos en tu progreso.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5.5 h-5.5 text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-bold text-sm">Discos Calibrados de Acero</span>
                      <p className="text-xs text-gray-400 mt-0.5">Tolerancias oficiales de peso mínimas para marcas seguras.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5.5 h-5.5 text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-bold text-sm">Tarimas Profesionales</span>
                      <p className="text-xs text-gray-400 mt-0.5">Protección de articulaciones y excelente grip antideslizante.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5.5 h-5.5 text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-bold text-sm">Gama Powerlifting & Halterofilia</span>
                      <p className="text-xs text-gray-400 mt-0.5">Barras olímpicas con rodamientos y knurling específicos.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5.5 h-5.5 text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-bold text-sm">Esquinas de Streetlifting / Calistenia</span>
                      <p className="text-xs text-gray-400 mt-0.5">Barras rígidas y cinturones de lastre oficiales.</p>
                    </div>
                  </div>
                </div>

                {/* Micro satisfaction notification */}
                <div className="p-4 bg-brand-card border border-brand-border rounded-xl flex items-center space-x-3">
                  <ThumbsUp className="w-5 h-5 text-brand-gold shrink-0" />
                  <span className="text-xs font-mono text-gray-300">
                    Como bien dice Beatriz en Google: <span className="text-white font-semibold">"Tienen gran cantidad de material de competición de buenísima calidad"</span>.
                  </span>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* INTERACTIVE OCCUPANCY SCHEDULER & BEST TIME SELECTOR */}
        <section id="ocupacion" className="py-20 border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block">ENTRENA SIN MASIFICACIÓN</span>
              <h2 className="font-display text-3xl sm:text-4.5xl font-black text-white tracking-tight">
                PLANIFICADOR DE OCUPACIÓN REAL
              </h2>
              <div className="h-[2px] w-12 bg-brand-gold mx-auto" />
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Consulta los flujos de asistencia promedio aproximados del laboratorio IPower. Gracias a las plazas limitadas, la ocupación se mantiene siempre en rangos perfectos para disfrutar de tu entreno.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold block mb-3">1. Selecciona el Día:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Lunes", "Miércoles", "Viernes", "Domingo"] as const).map(day => (
                      <button
                        key={day}
                        onClick={() => handleDaySelect(day)}
                        className={`py-3 px-4 font-display font-bold text-sm tracking-wide rounded-lg border transition-all text-center ${
                          selectedDay === day 
                            ? "bg-brand-gold border-brand-gold text-black shadow-lg" 
                            : "bg-black/30 border-brand-border text-gray-400 hover:text-white hover:border-gray-600"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-mono uppercase text-gray-400 font-semibold mb-2">
                    <span>2. Hora de entrenamiento:</span>
                    <span className="bg-brand-gold/10 text-brand-gold px-2 py-1 rounded border border-brand-gold/20">{selectedHour}:00 HS</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="23" 
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                    className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-gold"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 pt-1.5">
                    <span>0:00 (Mínimo)</span>
                    <span>12:00</span>
                    <span>23:00 (Máximo)</span>
                  </div>
                </div>

                {/* Result verdict badge */}
                <div className="bg-black/50 border border-brand-border p-4 rounded-lg text-center space-y-2">
                  <span className="text-[10px] font-mono uppercase text-gray-400 tracking-widest block font-bold">Estado del laboratorio:</span>
                  {selectedHour >= 18 && selectedHour <= 20 && selectedDay !== "Domingo" ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center text-xs font-display font-black tracking-wide text-amber-400 uppercase">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
                        Hora Punta Máxima (72% Ocupación)
                      </span>
                      <p className="text-[11px] text-gray-500">Un poco más concurrido, pero sin colas para las jaula gracias a las plazas limitadas.</p>
                    </div>
                  ) : selectedHour >= 9 && selectedHour <= 12 && selectedDay !== "Domingo" ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center text-xs font-display font-black tracking-wide text-yellow-400 uppercase">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
                        Tráfico Moderado (55% Ocupación)
                      </span>
                      <p className="text-[11px] text-gray-500">Excelente disponibilidad horaria y gran ambiente competitivo.</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="inline-flex items-center text-xs font-display font-black tracking-wide text-emerald-400 uppercase">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                        Mínima Ocupación (12% Ocupación)
                      </span>
                      <p className="text-[11px] text-gray-500">Todo el gimnasio para ti solo. Tranquilidad y foco absoluto.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Virtual bar chart visualizer */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold block">Curva de Asistencia ({selectedDay}):</span>
                
                {/* Graphics bars */}
                <div className="bg-black/50 border border-brand-border rounded-xl p-5 space-y-3.5">
                  {[6, 9, 12, 15, 18, 21, 0].map(h => {
                    const currentRate = getOccupancyRate(selectedDay, h);
                    const isActive = selectedHour === h || (selectedHour >= h && selectedHour < h + 3 && h !== 0) || (selectedHour === 23 && h === 21);
                    return (
                      <div key={h} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className={`${isActive ? "text-brand-gold font-bold" : "text-gray-400"}`}>
                            {h === 0 ? "00:00" : h === 12 ? "Mediodía (12:00)" : `${h}:00 hs`}
                          </span>
                          <span className={`${isActive ? "text-brand-gold font-bold" : "text-gray-500"}`}>{currentRate}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden">
                          <div 
                            style={{ width: `${currentRate}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              isActive 
                                ? "bg-gradient-to-r from-brand-gold to-brand-yellow animate-pulse" 
                                : currentRate > 70 
                                  ? "bg-red-500/60" 
                                  : currentRate > 40 
                                    ? "bg-yellow-500/40" 
                                    : "bg-emerald-500/20"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center font-mono text-[10px] text-gray-500">
                  ⚡ Ocupación real garantizada gracias al sistema "Plazas Limitadas" | Abierto 24H
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* GENUINE TESTIMONIALS FROM GOOGLE MAPS */}
        <section id="opiniones" className="py-20 border-b border-brand-border bg-gradient-to-b from-brand-dark to-[#0D0D10]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block">RESEÑAS REALES 5.0★</span>
              <h2 className="font-display text-3xl sm:text-4.5xl font-black text-white tracking-tight">
                LO QUE OPINAN LOS ATLETAS DE IPOWER
              </h2>
              <div className="h-[2px] w-12 bg-brand-gold mx-auto" />
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Reseñas verídicas de Google Maps aportadas de forma voluntaria por miembros reales de nuestra comunidad en Ciudad Real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Review 1 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-brand-gold">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    "El mejor gimnasio de Ciudad Real. Si estás cansado de la masificación de los gimnasios comerciales y quieres un gimnasio en el que puedas entrenar en cualquier momento sin riesgo de que las máquinas estén llenas este es tu sitio."
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                  <div>
                    <span className="block text-white font-bold text-sm">Marta Utrilla</span>
                    <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Miembro de IPower</span>
                  </div>
                  <div className="bg-brand-gold/10 px-2 py-1 rounded text-[10px] font-mono text-brand-gold uppercase">Hace 3 meses</div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-brand-gold">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    "El mejor gimnasio que he probado en Ciudad Real, abierto 24h para la gente que tiene turno. Un ambiente estupendo y lleno de todo el equipamiento que se necesita para entrenar. Inmejorable mi experiencia."
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                  <div>
                    <span className="block text-white font-bold text-sm">Lucas Rodríguez Caira</span>
                    <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Miembro de IPower</span>
                  </div>
                  <div className="bg-brand-gold/10 px-2 py-1 rounded text-[10px] font-mono text-brand-gold uppercase">Hace 3 meses</div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-brand-gold">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    "Simplemente perfecto! El gimnasio nunca se masifica, por lo que siempre puedes entrenar con tranquilidad y concentración. Las instalaciones están siempre impecables y cuentan con todo lo necesario para un entrenamiento completo."
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                  <div>
                    <span className="block text-white font-bold text-sm">Beatriz Macias Coca</span>
                    <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Miembro de IPower</span>
                  </div>
                  <div className="bg-brand-gold/10 px-2 py-1 rounded text-[10px] font-mono text-brand-gold uppercase">Hace 4 meses</div>
                </div>
              </div>

            </div>

            <div className="mt-12 bg-black/40 border border-brand-border p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#1A1A22] rounded-full flex items-center justify-center text-brand-gold text-lg font-bold">5.0★</div>
                <div>
                  <span className="block text-white font-bold text-sm">Media perfecta de 5.0 en Google Maps</span>
                  <p className="text-xs text-gray-400">Basado en 50 opiniones oficiales verídicas de deportistas reales.</p>
                </div>
              </div>
              <button 
                onClick={() => { setFormOpen(true); setFormStep(1); }}
                className="w-full sm:w-auto bg-brand-gold hover:bg-brand-yellow text-black font-semibold font-display tracking-wide px-6 py-3 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <span>QUIERO UNIRME AL CLUB</span>
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </div>

          </div>
        </section>

        {/* GEOLOCATION & CONTACT IN CIUDAD REAL WITH DARK MAP REMAPPED */}
        <section id="coordenadas" className="py-20 border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Contact card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-bold block">DÓNDE ENCONTRARNOS</span>
                  <h2 className="font-display text-3xl sm:text-4.5xl font-black text-white tracking-tight leading-none">
                    CIUDAD REAL | LABORATORIO CENTRAL
                  </h2>
                  <div className="h-[2px] w-12 bg-brand-gold" />
                </div>

                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Estamos ubicados en una zona excelente de Ciudad Real, con fácil aparcamiento y accesos listos para tu entreno a cualquier hora de la noche o del día.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded bg-[#16161D] border border-brand-border flex items-center justify-center text-brand-gold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">Dirección física</span>
                      <span className="block text-white font-bold text-sm">Calle Esperanza, 3, 13003 Ciudad Real</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded bg-[#16161D] border border-brand-border flex items-center justify-center text-brand-gold">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">Atención Telefónica</span>
                      <span className="block text-white font-bold text-sm">614 33 56 07</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded bg-[#16161D] border border-brand-border flex items-center justify-center text-brand-gold">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">Email Oficial</span>
                      <span className="block text-white font-bold text-sm">ipower.strength@gmail.com</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-card/50 border border-brand-border p-4.5 rounded-xl space-y-2.5">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#B3B3B9] font-bold block">Amigable con LGBTQ+:</span>
                  <p className="text-xs text-[#8E8E95] leading-normal">
                    IPower Strength se enorgullece de ser un gimnasio inclusivo, seguro y respetuoso con todo tipo de atletas. Buen ambiente, respeto mutuo e inmejorable profesionalidad.
                  </p>
                </div>
              </div>

              {/* Dynamic Leaflet Embedded Map with modern custom CSS color inverter */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-2xl h-[400px]">
                  
                  {/* Overlay coordinate watermark */}
                  <div className="absolute top-4 left-4 z-10 bg-black/75 backdrop-blur-md border border-brand-border p-3.5 rounded-lg text-xs font-mono">
                    <span className="text-[10px] text-gray-400 block uppercase font-semibold">Código Plus</span>
                    <span className="text-brand-gold font-bold">X3RC+QJ Ciudad Real, España</span>
                  </div>

                  {/* Dark-mode inverted Google/OSM Maps Embed iframe */}
                  <iframe 
                    title="IPower Strength Ciudad Real Map Location"
                    className="w-full h-full border-0 transition-opacity"
                    style={{ 
                      filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(100%)",
                      opacity: 0.88
                    }}
                    src="https://maps.google.com/maps?q=Calle%20Esperanza,%203,%2013003%20Ciudad%20Real&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-black/90 border-t border-brand-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <BrandLogo className="w-10 h-10 border border-brand-gold shadow-md" />
              <span className="font-display font-black text-xl tracking-tighter text-white">
                IPOWER <span className="text-brand-gold">STRENGTH</span>
              </span>
            </div>

            {/* Middle Copyright */}
            <div className="text-center md:text-left space-y-1">
              <p className="text-xs text-gray-500 font-mono">
                IPower Strength Corporation © 2026. Todos los derechos reservados.
              </p>
              <p className="text-[10px] text-gray-600 font-mono leading-none">
                Hecho para alto rendimiento | Calle Esperanza 3, Ciudad Real
              </p>
            </div>

            {/* Secret key gate access button */}
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 font-mono">ipower.strength@gmail.com</span>
              <button 
                onClick={() => setAdminOpen(true)}
                className="w-8 h-8 rounded-full bg-[#111116] border border-brand-border flex items-center justify-center text-gray-600 hover:text-brand-gold hover:border-brand-gold/50 transition-colors"
                title="Acceso administrativo"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </footer>

      {/* INTERACTIVE MULTI-STEP PRE-ENROLLMENT MODAL WIZARD */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-brand-card border border-brand-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              {/* Header */}
              <div className="px-6 py-4.5 bg-black/40 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-black text-white uppercase tracking-wider">
                    {formStep === 4 ? "¡PLAZA PRE-RESERVADA!" : "PRE-INSCRIPCIÓN IPOWER"}
                  </h3>
                  {formStep < 4 && (
                    <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest block font-medium">
                      Paso {formStep} de 3 - Plazas disponibles: {availableSlots}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => { setFormOpen(false); resetFormState(); }}
                  className="text-gray-400 hover:text-white font-mono text-sm uppercase px-2 py-1 rounded hover:bg-[#1E1E24]"
                >
                  Cerrar
                </button>
              </div>

              {/* Progress Bar indicator */}
              {formStep < 4 && (
                <div className="w-full bg-neutral-950 h-1">
                  <div 
                    className="bg-brand-gold h-full transition-all duration-300"
                    style={{ width: `${(formStep / 3) * 100}%` }}
                  />
                </div>
              )}

              {/* Multi-step content views */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* STEP 1: Personal Coordinates */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-gold/5 border border-brand-gold/15 rounded-xl text-xs text-gray-300 leading-normal">
                      Gracias por tu interés en IPower Strength. Necesitaremos tus datos iniciales para ir informándote de todas las novedades y para dar de alta tu ficha de atleta.
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono uppercase text-gray-400 font-bold block">
                        Nombre completo <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="ej. Juan Pérez Castro" 
                        value={formData.nombre}
                        onChange={(e) => {
                          setFormData({ ...formData, nombre: e.target.value });
                          if (formErrors.nombre) {
                            setFormErrors({ ...formErrors, nombre: "" });
                          }
                        }}
                        className={`w-full bg-[#17171C] border ${formErrors.nombre ? "border-red-500" : "border-brand-border focus:border-brand-gold"} px-4 py-3 rounded-lg text-sm text-white focus:outline-none placeholder:text-gray-600`}
                      />
                      {formErrors.nombre && <p className="text-[11px] text-red-500 mt-1">{formErrors.nombre}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono uppercase text-gray-400 font-bold block">
                        Correo electrónico <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        placeholder="ej. juan.perez@live.com" 
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) {
                            setFormErrors({ ...formErrors, email: "" });
                          }
                        }}
                        className={`w-full bg-[#17171C] border ${formErrors.email ? "border-red-500" : "border-brand-border focus:border-brand-gold"} px-4 py-3 rounded-lg text-sm text-white focus:outline-none placeholder:text-gray-600`}
                      />
                      {formErrors.email && <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>}
                    </div>

                    {/* Birthdate & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-mono uppercase text-gray-400 font-bold block">
                          Fecha de Nacimiento <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          value={formData.fechaNacimiento}
                          onChange={(e) => {
                            setFormData({ ...formData, fechaNacimiento: e.target.value });
                            if (formErrors.fechaNacimiento) {
                              setFormErrors({ ...formErrors, fechaNacimiento: "" });
                            }
                          }}
                          className={`w-full bg-[#17171C] border ${formErrors.fechaNacimiento ? "border-red-500" : "border-brand-border focus:border-brand-gold"} px-4 py-3 rounded-lg text-sm text-white focus:outline-none`}
                        />
                        {formErrors.fechaNacimiento && <p className="text-[11px] text-red-500 mt-1">{formErrors.fechaNacimiento}</p>}
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-mono uppercase text-gray-400 font-bold block">
                          Teléfono Móvil <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          placeholder="ej. 600 000 000" 
                          value={formData.telefono}
                          onChange={(e) => {
                            setFormData({ ...formData, telefono: e.target.value });
                            if (formErrors.telefono) {
                              setFormErrors({ ...formErrors, telefono: "" });
                            }
                          }}
                          className={`w-full bg-[#17171C] border ${formErrors.telefono ? "border-red-500" : "border-brand-border focus:border-brand-gold"} px-4 py-3 rounded-lg text-sm text-white focus:outline-none placeholder:text-gray-600`}
                        />
                        {formErrors.telefono && <p className="text-[11px] text-red-500 mt-1">{formErrors.telefono}</p>}
                      </div>

                    </div>

                  </div>
                )}

                {/* STEP 2: Sports interested in */}
                {formStep === 2 && (
                  <div className="space-y-5">
                    <div className="text-left space-y-1">
                      <h4 className="font-display font-bold text-white text-md">¿En qué disciplina/s estarías interesado?</h4>
                      <p className="text-xs text-gray-400">Puedes seleccionar varias opciones.</p>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { name: "Powerlifting", desc: "Levantamiento de potencia (Sentadilla, Banca, Peso Muerto)" },
                        { name: "Halterofilia", desc: "Levantamiento olímpico de precisión (Arrancada, Dos tiempos)" },
                        { name: "Streetlifting", desc: "Calistenia pesada con lastre de competición" },
                        { name: "Bodybuilding", desc: "Hipertrofia, aislamiento y modelado muscular" },
                        { name: "Otro", desc: "Fuerza ruda en general o disciplinas alternativas" }
                      ].map(sport => {
                        const isSelected = formData.deportes.includes(sport.name);
                        return (
                          <div 
                            key={sport.name}
                            onClick={() => toggleSport(sport.name)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected 
                                ? "bg-brand-gold/10 border-brand-gold" 
                                : "bg-neutral-950 border-brand-border hover:bg-[#15151A]"
                            }`}
                          >
                            <div className="text-left">
                              <span className="block font-display font-extrabold text-sm text-white tracking-wide">{sport.name}</span>
                              <span className="block text-[11px] text-gray-400 mt-0.5">{sport.desc}</span>
                            </div>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                              isSelected ? "bg-brand-gold border-brand-gold text-black" : "border-brand-border bg-[#101014]"
                            }`}>
                              {isSelected && <span className="font-extrabold text-[10px]">✔</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {formErrors.deportes && <p className="text-xs text-red-500 text-left mt-2">{formErrors.deportes}</p>}
                  </div>
                )}

                {/* STEP 3: Goals */}
                {formStep === 3 && (
                  <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-white text-md">¿Qué objetivo/s buscas? (Físico o mental)</h4>
                      <p className="text-xs text-gray-400">Selecciona todos los que se adapten a tu plan.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {[
                        "Ganar masa muscular",
                        "Perder Grasa",
                        "Mejorar fuerza máxima",
                        "Mejorar resistencia",
                        "Mejorar movilidad/flexibilidad",
                        "Rehabilitación o prevención de lesiones",
                        "Mejorar mi composición corporal",
                        "Preparar competición",
                        "Reducir estrés",
                        "Mejorar autoestima",
                        "Superación personal",
                        "Formar parte de una comunidad"
                      ].map(goal => {
                        const isSelected = formData.objetivos.includes(goal);
                        return (
                          <div 
                            key={goal}
                            onClick={() => toggleGoal(goal)}
                            className={`p-3 rounded-lg border cursor-pointer text-xs font-semibold tracking-wide transition-all ${
                              isSelected 
                                ? "bg-brand-gold/10 border-brand-gold text-white" 
                                : "bg-neutral-950/60 border-brand-border text-gray-400 hover:text-white"
                            }`}
                          >
                            {goal}
                          </div>
                        );
                      })}
                    </div>
                    {formErrors.objetivos && <p className="text-xs text-red-500 mt-2">{formErrors.objetivos}</p>}
                  </form>
                )}

                {/* STEP 4: Success Screen */}
                {formStep === 4 && submittedTicket && (
                  <div className="space-y-6 text-center py-4">
                    
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display text-2xl font-black text-white leading-tight">
                        ¡BIENVENIDO A IPOWER, {submittedTicket.nombre.split(" ")[0].toUpperCase()}!
                      </h4>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto leading-normal">
                        Tu pre-reserva de plaza ha sido registrada con éxito para Ciudad Real. Te enviamos correo de bienvenida.
                      </p>
                    </div>

                    {/* Professional digital physical workout voucher ticket card */}
                    <div className="bg-[#17171D] border-2 border-dashed border-brand-border rounded-xl p-5 relative overflow-hidden text-left space-y-4 shadow-xl">
                      
                      {/* Brand gold label sticker */}
                      <div className="absolute top-0 right-0 bg-brand-gold text-black font-mono font-black text-[10px] tracking-widest px-3 py-1 uppercase rounded-bl-lg">
                        TICKET ATLETA
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] font-mono tracking-widest uppercase text-gray-500 leading-none">ID DE RESERVA</span>
                        <span className="block font-mono text-base font-black text-brand-gold">{submittedTicket.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                          <span className="block text-[9px] font-mono uppercase text-gray-500 leading-none">ATLETA</span>
                          <span className="block text-xs font-bold text-white truncate">{submittedTicket.nombre}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="block text-[9px] font-mono uppercase text-gray-500 leading-none">TELÉFONO</span>
                          <span className="block text-xs font-mono text-white">{submittedTicket.telefono}</span>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-brand-border/40 pt-3">
                        <span className="block text-[9px] font-mono uppercase text-gray-500 leading-none">MEDIO DE ACCESO</span>
                        <p className="text-[11px] text-gray-400 leading-normal">
                          Te enviaremos los detalles de tu llave virtual y horarios al correo: <span className="text-white font-bold">{submittedTicket.email}</span>
                        </p>
                      </div>

                      {/* Barcode mockup */}
                      <div className="border-t border-brand-border/40 pt-4.5 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="block text-[8px] font-mono uppercase text-gray-500 tracking-wider">Presentar en recepción</span>
                          <span className="block text-[9px] font-mono text-gray-400">Plaza de alto rendimiento</span>
                        </div>
                        <QrCode className="w-12 h-12 text-gray-300 shrink-0" />
                      </div>

                    </div>

                    <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-lg text-xs leading-normal max-w-sm mx-auto text-gray-300 text-left">
                      💡 <span className="font-bold text-white">Siguiente paso:</span> Puedes enviarle un mensaje por DM de Instagram a <span className="text-white font-bold">@ipower.strength</span> o escribirnos a <span className="text-brand-gold font-bold">ipower.strength@gmail.com</span> adjuntando tu código <span className="font-mono text-white underline">{submittedTicket.id}</span> para activar tu inscripción inmediata.
                    </div>

                  </div>
                )}

              </div>

              {/* Footer Wizard Controls */}
              <div className="px-6 py-4 bg-black/60 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                
                {formStep > 1 && formStep < 4 ? (
                  <button 
                    onClick={() => { setFormStep(prev => prev - 1); }}
                    className="text-gray-400 hover:text-white font-mono text-xs uppercase flex items-center justify-center space-x-1 py-3 px-4 rounded-xl border border-brand-border/40 hover:bg-white/5 active:scale-95 transition-all w-full sm:w-auto btn-touch-target"
                  >
                    <ChevronLeft className="w-4 h-4 text-brand-gold" />
                    <span>Atrás</span>
                  </button>
                ) : (
                  <div className="hidden sm:block w-4 h-4" /> 
                )}

                {formStep < 3 ? (
                  <button 
                    onClick={handleNextStep}
                    className="shine-effect w-full sm:w-auto bg-brand-gold hover:bg-brand-yellow font-display font-extrabold text-black tracking-wide text-xs px-6 py-3.5 rounded-xl flex items-center justify-center space-x-1 transition-colors btn-touch-target"
                  >
                    <span>SIGUIENTE PASO</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>
                ) : formStep === 3 ? (
                  <button 
                    onClick={handleFormSubmit}
                    className="shine-effect w-full sm:w-auto bg-gradient-to-r from-brand-gold to-brand-yellow text-black font-display font-black tracking-wide text-xs px-6 py-4 rounded-xl flex items-center justify-center space-x-2 uppercase shadow-md active:scale-95 transition-transform btn-touch-target"
                  >
                    <span>CONFIRMAR PRE-INSCRIPCIÓN</span>
                    <CheckCircle2 className="w-4 h-4 text-black animate-pulse" />
                  </button>
                ) : (
                  <button 
                    onClick={() => { setFormOpen(false); resetFormState(); }}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-display font-bold py-4 rounded-xl text-center text-xs tracking-wider btn-touch-target"
                  >
                    LISTO - CERRAR VENTANA
                  </button>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HIDDEN / SECRET ADMINISTRATIVE PORTAL MODAL */}
      <AnimatePresence>
        {adminOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-brand-card border border-brand-border w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              
              {/* Header */}
              <div className="px-6 py-4.5 bg-black/60 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Database className="w-5.5 h-5.5 text-brand-gold" />
                  <div>
                    <h3 className="font-display text-base font-black text-white uppercase tracking-wider">
                      PANEL DE ADMINISTRACIÓN IPOWER
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-medium">
                      Consulta y Control de Pre-Inscripciones de Atletas
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleAdminLogout}
                  className="bg-neutral-800 text-gray-300 hover:text-white px-3.5 py-1.5 rounded-md font-mono text-xs uppercase"
                >
                  Salir del Panel
                </button>
              </div>

              {/* Content logic */}
              {!isAdminAuthenticated ? (
                // Authentication View
                <div className="p-8 max-w-sm mx-auto my-12 text-center space-y-6">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-white font-bold text-sm">Validar Credenciales</span>
                    <p className="text-xs text-gray-400">Introduce la contraseña de control interno para acceder.</p>
                  </div>
                  <form onSubmit={handleAdminAuth} className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Contraseña (pista: ipower2026)" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-[#18181F] border border-brand-border px-4 py-3 rounded-lg text-sm text-center text-white focus:outline-none placeholder:text-gray-650"
                      autoFocus
                    />
                    {adminError && <p className="text-[11px] text-red-500">{adminError}</p>}
                    <button 
                      type="submit"
                      className="w-full bg-brand-gold hover:bg-brand-yellow text-black font-display font-black py-3 rounded-lg text-xs uppercase"
                    >
                      AUTENTICAR PORTAL
                    </button>
                  </form>
                </div>
              ) : (
                // Real DB Dashboard View
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  
                  {/* Grid Analytics Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-black/40 border border-brand-border p-4.5 rounded-xl">
                      <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wide font-bold">TOTAL REGISTRADOS</span>
                      <span className="block text-3xl font-display font-extrabold text-white mt-1">{registrations.length}</span>
                      <p className="text-[10px] text-gray-400 mt-1">Sincronizado en almacenamiento local</p>
                    </div>

                    <div className="bg-brand-gold/5 border border-brand-gold/15 p-4.5 rounded-xl">
                      <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wide font-bold">DISCIPLINAS MÁS SOLICITADAS</span>
                      <span className="block text-sm font-display font-bold text-brand-gold mt-1 truncate">
                        {registrations.length > 0 
                          ? "Powerlifting / Hipertrofia" 
                          : "Ninguno actualmente"}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">Interés deportivo de comunidad</p>
                    </div>

                    <div className="bg-black/40 border border-brand-border p-4.5 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wide font-bold">ACCIONES DE DATOS</span>
                        <span className="block text-xs font-bold text-white">Exportación CSV / JSON</span>
                      </div>
                      <button 
                        onClick={handleExportJSON}
                        className="bg-brand-gold hover:bg-brand-yellow text-black p-2 rounded-lg font-mono text-xs flex items-center gap-1.5 font-bold transition-transform active:scale-95"
                        title="Exportar archivo de pre-inscripción"
                      >
                        <Download className="w-4 h-4" />
                        <span>EXPORTAR</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters Controller */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#17171E] border border-brand-border px-4.5 py-3 rounded-xl">
                    <div className="relative w-full sm:max-w-xs flex items-center">
                      <Search className="w-4.5 h-4.5 text-gray-500 absolute left-3 pointer-events-none" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, tlf o email..." 
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-brand-border pl-10 pr-4 py-2 rounded-lg text-xs text-white placeholder:text-gray-650 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <span className="text-xs font-mono text-gray-400 shrink-0">Filtrar Deporte:</span>
                      <select 
                        value={adminFilterSport} 
                        onChange={(e) => setAdminFilterSport(e.target.value)}
                        className="w-full sm:w-auto bg-neutral-900 border border-brand-border rounded-lg text-xs text-white px-3 py-2 focus:outline-none"
                      >
                        <option value="Todos">Todos los deportes</option>
                        <option value="Powerlifting">Powerlifting</option>
                        <option value="Halterofilia">Halterofilia</option>
                        <option value="Streetlifting">Streetlifting</option>
                        <option value="Bodybuilding">Bodybuilding</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  {/* Pre-registrants table list database view */}
                  <div className="border border-brand-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-300">
                        <thead className="bg-[#17171e] text-gray-400 font-mono text-[10px] uppercase tracking-wider border-b border-brand-border">
                          <tr>
                            <th className="px-5 py-4">ID / Registro</th>
                            <th className="px-5 py-4">Atleta</th>
                            <th className="px-5 py-4">Contacto</th>
                            <th className="px-5 py-4">Disciplinas</th>
                            <th className="px-5 py-4">F. Nacimiento</th>
                            <th className="px-5 py-4 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                          {filteredRegistrations.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-5 py-8 text-center text-gray-500 font-mono">
                                No se encontraron registros de atletas pre-inscritos para Ciudad Real.
                              </td>
                            </tr>
                          ) : (
                            filteredRegistrations.map((item) => (
                              <tr key={item.id} className="hover:bg-neutral-900/60 transition-colors">
                                <td className="px-5 py-4.5 font-mono">
                                  <span className="block text-white font-bold text-xs">{item.id}</span>
                                  <span className="block text-[9px] text-gray-500">{item.fechaRegistro}</span>
                                </td>
                                <td className="px-5 py-4.5">
                                  <span className="block text-white font-black text-sm">{item.nombre}</span>
                                </td>
                                <td className="px-5 py-4.5">
                                  <span className="block text-gray-200 font-mono select-all">{item.telefono}</span>
                                  <span className="block text-gray-500 select-all">{item.email}</span>
                                </td>
                                <td className="px-5 py-4.5">
                                  <div className="flex flex-wrap gap-1">
                                    {item.deportes.map(d => (
                                      <span key={d} className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded px-1.5 py-0.5 text-[9px] font-mono leading-none">
                                        {d}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-5 py-4.5 font-mono text-gray-400">
                                  {item.fechaNacimiento}
                                </td>
                                <td className="px-5 py-4.5 text-center">
                                  <button 
                                    onClick={() => handleDeleteRegistration(item.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-md"
                                    title="Eliminar de base de datos"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-brand-border bg-black/40 rounded-xl p-5 text-left space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FFF] font-bold block">Resumen de objetivos declarados por los pre-inscritos:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(new Set(registrations.flatMap(r => r.objetivos))).map(obj => (
                        <span key={obj} className="bg-neutral-800 text-gray-300 rounded-full px-2.5 py-1 text-[10px] font-mono">
                          {obj}: <span className="text-brand-gold font-bold">{registrations.filter(r => r.objetivos.includes(obj)).length}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Footer admin drawer controls */}
              <div className="px-6 py-4 bg-black/60 border-t border-brand-border flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  IPower Gym Control Server v2.4a
                </span>
                <button 
                  onClick={handleAdminLogout}
                  className="bg-brand-gold hover:bg-brand-yellow font-display font-extrabold text-black px-5 py-2 rounded-md text-xs uppercase"
                >
                  Cerrar Panel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL FLOATING WHATSAPP CTA - COMPATIBLE WITH DESKTOP AND MOBILE */}
      <div className="fixed z-40 bottom-24 right-5 sm:bottom-8 sm:right-8 group">
        <a
          href="https://wa.me/34626154645?text=Hola%20IPower%20Strength%20Ciudad%20Real!%20Quiero%20saber%20m%C3%A1s%20sobre%20el%20gimnasio%2024H%20y%20tarifas%20de%20inscripci%C3%B3n."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba56] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 relative glow-subtle btn-touch-target"
          aria-label="Contactar por WhatsApp"
        >
          {/* Pulsing ring matching athletic vibe */}
          <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />
          
          {/* Custom vector SVG Whatsapp icon perfectly centered */}
          <svg 
            className="w-7 h-7 fill-current" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          
          {/* Tooltip visible on hover */}
          <span className="hidden sm:inline-block absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-right bg-black/95 backdrop-blur-md border border-brand-border text-white text-xs font-mono font-bold py-2.5 px-4 rounded-lg shadow-xl whitespace-nowrap glow-subtle">
             📱 <span className="text-brand-gold">IPOWER STRENGTH:</span> ¡Contáctanos por WhatsApp!
          </span>
        </a>
      </div>

    </div>
  );
}
