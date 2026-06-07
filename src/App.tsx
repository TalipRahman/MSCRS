/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Trophy, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Bot, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Globe, 
  Calendar, 
  X, 
  Check, 
  Award,
  AlertCircle,
  TrendingDown,
  Clock,
  Briefcase,
  AlertTriangle,
  Zap,
  Cpu,
  ShieldCheck,
  Server,
  Terminal,
  RefreshCw
} from "lucide-react";
import { CategoryType, CityData, SmartProject, IndicatorDefinition } from "./types";
import { CATEGORIES, CATEGORY_COLORS, INDICATOR_DEFINITIONS, INITIAL_CITIES } from "./data";
import CitySelector, { getSmartCityStatus } from "./components/CitySelector";

const TRANSLATIONS = {
  ms: {
    heading: "MSCRS TACTICAL",
    subheading: "TERMINAL KAWALAN & PENGIKTIRAFAN BANDAR PINTAR KEBANGSAAN",
    frameworkDesc: "Protokol Pemantauan Standard PLANMalaysia & MS ISO 37122 Directive",
    overallScore: "INDEKS COMPLIANCE TACTICAL Overall",
    tierStatus: "STATUS OPERASI SEKTOR [CLASSIFICATION]",
    projects: "Inisiatif Berdaftar",
    indicators: "Metrik Dipenuhi",
    aiAdvice: "DIREKTIF INTEL STRATEGI AI",
    generatePlan: "INITIATE AI CO-PILOT SYSTEM",
    generating: "MENGHUBUNGKAN INTELEKTUAL KEBANGSAAN AI...",
    networkHealth: "INTEGRITI INTEGRASI IOT SYSTEM",
    nodesActive: "SEMUA 1,204 GRID SENSOR OPERASIONAL [ONLINE]",
    nextAudit: "TINGKAP AUDIT KEPATUHAN BERIKUT",
    auditDate: "DIJADUALKAN: 15 JANUARI 2027",
    historicalTrend: "SIRI GRAF TELEMETRI SEJARAH",
    indicatorsTool: "METRIK PEMATUHAN MS ISO 37122 (INTEL CHECKLIST)",
    searchPlaceholder: "Tapis metrik ketat...",
    projectRegistry: "DAFTAR INISIATIF PEMBANGUNAN STRATEGIK",
    addProject: "Suntik Projek Baru",
    deleteProject: "Batalkan Projek",
    editProject: "Edit Projek",
    budget: "Peruntukan Dana",
    timeline: "Rangka Masa",
    targetImpact: "Sasaran Hasil / Impak KPI",
    save: "Kompilasikan Projek",
    cancel: "Batal Tindakan",
    statusProposed: "Cadangan Sektor",
    statusOngoing: "Sedang Berjalan",
    statusCompleted: "Selesai Optimum",
    allCategories: "Semua Dimensi",
    searchProjects: "Cari projek atau koridor pembangunan...",
    category: "Dimensi Tumpuan",
    description: "Deskripsi Kerja & Penyelarasan Strategik",
    action: "Tindakan",
    noProjects: "Tiada rekod inisiatif dalam sektor ini.",
    addTitle: "SUNTIK INISIATIF STRATEGIK BARU",
    editTitle: "KEMAS KINI PARAMETER PROJEK",
    projName: "Nama Projek / Inisiatif",
    status: "Status Operasi Projek",
    descMs: "Deskripsi Kerja (Melayu)",
    descEn: "Deskripsi Kerja (English)",
    impact: "Sasaran Impak Khusus",
    unfulfilledWarning: "Sistem mengenalpasti baki jurang metrik standard kritikal berisiko:",
    quickFocus: "Fokus Dimensi Sektor",
    statsSummary: "RUMUSAN STATISTIK KOMPATIBILITI",
    auditTime: "AUDIT TERAKHIR: 12 OKTOBER 2026",
    navHome: "Utama",
    navForm: "Urus",
    navDoc: "Standard",
    copied: "Direktif AI Diperolehi!",
    copyText: "Salin Direktif AI",
  },
  en: {
    heading: "MSCRS TACTICAL",
    subheading: "NATIONAL SMART CITY BATTLEGROUND COMMAND TERMINAL",
    frameworkDesc: "PLANMalaysia Compliance Protocol & MS ISO 37122 Directives",
    overallScore: "Overall Tactical Compliance Index",
    tierStatus: "SECTOR OPERATIONAL CLASSIFICATION STATUS",
    projects: "Initiatives Registered",
    indicators: "Fulfilled Standards",
    aiAdvice: "STRATEGIC AI CO-PILOT DIRECTIVES",
    generatePlan: "INITIATE AI CO-PILOT SYSTEM",
    generating: "ESTABLISHING CORE AI INTEL HOOKS...",
    networkHealth: "CORE CO-SYSTEM INTEGRITY LEVEL",
    nodesActive: "ALL 1,204 SENSOR GRID POINT NODES [ONLINE]",
    nextAudit: "NEXT CRITICAL COMPLIANCE AUDIT WINDOW",
    auditDate: "SCHEDULED FOR: JAN 15, 2027",
    historicalTrend: "HISTORICAL PERFORMANCE TELEMETRY GRAPH",
    indicatorsTool: "MS ISO 37122 COMPLIANCE GATEWAYS Checklist",
    searchPlaceholder: "Search indicators by query...",
    projectRegistry: "URBAN DEVELOPMENT COMPREHENSIVE REGISTRY",
    addProject: "Inject Smart Initiative",
    deleteProject: "Decommission Initiative",
    editProject: "Modify Parameters",
    budget: "Budget Commitment",
    timeline: "Timeline Window",
    targetImpact: "Target Impact Goal & Metric KPIs",
    save: "Compile Project Parameters",
    cancel: "Cancel",
    statusProposed: "Proposed Sector",
    statusOngoing: "Fully Operational",
    statusCompleted: "Optimized / Completed",
    allCategories: "All Dimensions",
    searchProjects: "Query initiative registry databases...",
    category: "Focal Smart Dimension",
    description: "Operational Objectives & Directives",
    action: "Operational Actions",
    noProjects: "No strategic initiatives found in current query.",
    addTitle: "PROVISION STRATEGIC URBAN INITATIVE",
    editTitle: "MUTATE INITIATIVE SPECIFICATIONS",
    projName: "Strategic Initiative Name",
    status: "Directive Status",
    descMs: "Objective Narrative (BM)",
    descEn: "Objective Narrative (EN)",
    impact: "Target Metric / Impact KPI",
    unfulfilledWarning: "The system flags the following compliance vulnerabilities:",
    quickFocus: "Category Filter Scope",
    statsSummary: "INTEGRATION SUITE DIAGNOSTICS",
    auditTime: "LAST SECURE SESSION: OCT 12, 2026",
    navHome: "Master Deck",
    navForm: "Provision",
    navDoc: "Directives Checklist",
    copied: "AI Intelligence Copied!",
    copyText: "Copy Tactical Advisor Core",
  }
};

export default function App() {
  const [cities, setCities] = useState<CityData[]>(() => {
    const stored = localStorage.getItem("mscrs_cities_data");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return INITIAL_CITIES; }
    }
    return INITIAL_CITIES;
  });

  const [selectedCityId, setSelectedCityId] = useState<string>("kuala-lumpur");
  const [language, setLanguage] = useState<"ms" | "en">("ms");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryType | "All">("All");
  
  // Search state variables
  const [indicatorSearch, setIndicatorSearch] = useState<string>("");
  const [projectSearch, setProjectSearch] = useState<string>("");

  // Server recommendations state
  const [aiReport, setAiReport] = useState<string>(() => {
    return localStorage.getItem(`mscrs_ai_report_${selectedCityId}`) || "";
  });
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiErrorMsg, setAiErrorMsg] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Command System modal variables
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const [projectForm, setProjectForm] = useState<Omit<SmartProject, "id">>({
    name: "",
    category: "Smart Governance",
    budget: 3500000,
    status: "Ongoing",
    descriptionMs: "",
    descriptionEn: "",
    targetImpact: "",
    timeline: "Jan 2026 - Dis 2026"
  });

  // Keep state persistent with localStorage
  useEffect(() => {
    localStorage.setItem("mscrs_cities_data", JSON.stringify(cities));
  }, [cities]);

  // Handle active advisory load on selected city mutation
  useEffect(() => {
    const saved = localStorage.getItem(`mscrs_ai_report_${selectedCityId}`);
    setAiReport(saved || "");
    setAiErrorMsg("");
  }, [selectedCityId]);

  const t = TRANSLATIONS[language];

  // Pick target active city
  const currentCity = useMemo(() => {
    const found = cities.find(c => c.id === selectedCityId);
    return found || cities[0];
  }, [cities, selectedCityId]);

  // Compute stats on fly
  const categoryIndicatorStats = useMemo(() => {
    const stats: Record<CategoryType, { checked: number; total: number; score: number }> = {} as any;
    
    CATEGORIES.forEach(category => {
      const defs = INDICATOR_DEFINITIONS.filter(i => i.category === category);
      const total = defs.length;
      const checked = defs.filter(d => !!currentCity.indicatorValues[d.id]).length;
      const score = Math.round((checked / (total || 1)) * 100);
      stats[category] = { checked, total, score };
    });

    return stats;
  }, [currentCity]);

  // Overall combined indexes
  const overallScore = useMemo(() => {
    const values = Object.values(categoryIndicatorStats).map((c: any) => c.score);
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, current) => sum + current, 0) / values.length);
  }, [categoryIndicatorStats]);

  const statusInfo = useMemo(() => {
    return getSmartCityStatus(overallScore, language);
  }, [overallScore, language]);

  // Unchecked elements for targeting
  const unfulfilledIndicators = useMemo(() => {
    return INDICATOR_DEFINITIONS.filter(ind => {
      const val = !!currentCity.indicatorValues[ind.id];
      const matchCat = activeCategoryFilter === "All" || ind.category === activeCategoryFilter;
      return !val && matchCat;
    });
  }, [currentCity, activeCategoryFilter]);

  // Checkbox mutation handler
  const handleToggleIndicator = (id: string) => {
    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== selectedCityId) return city;
        
        const newIndicatorValues = {
          ...city.indicatorValues,
          [id]: !city.indicatorValues[id]
        };

        const nextScores = { ...city.scores };
        CATEGORIES.forEach(cat => {
          const catIndicators = INDICATOR_DEFINITIONS.filter(i => i.category === cat);
          const totalInCat = catIndicators.length;
          const checkedInCat = catIndicators.filter(d => !!newIndicatorValues[d.id]).length;
          nextScores[cat] = Math.round((checkedInCat / (totalInCat || 1)) * 100);
        });

        return {
          ...city,
          indicatorValues: newIndicatorValues,
          scores: nextScores
        };
      });
    });
  };

  // Mass modifier toggle
  const handleSetAllIndicators = (val: boolean) => {
    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== selectedCityId) return city;
        
        const newIndicatorValues: Record<string, boolean> = {};
        INDICATOR_DEFINITIONS.forEach(ind => {
          newIndicatorValues[ind.id] = val;
        });

        const nextScores = { ...city.scores };
        CATEGORIES.forEach(cat => {
          nextScores[cat] = val ? 100 : 0;
        });

        return {
          ...city,
          indicatorValues: newIndicatorValues,
          scores: nextScores
        };
      });
    });
  };

  // Set Project Forms Trigger
  const handleOpenProjectModal = (project?: SmartProject) => {
    if (project) {
      setEditingProjectId(project.id);
      setProjectForm({
        name: project.name,
        category: project.category,
        budget: project.budget,
        status: project.status,
        descriptionMs: project.descriptionMs,
        descriptionEn: project.descriptionEn,
        targetImpact: project.targetImpact,
        timeline: project.timeline
      });
    } else {
      setEditingProjectId(null);
      setProjectForm({
        name: "",
        category: "Smart Governance",
        budget: 4500000,
        status: "Proposed",
        descriptionMs: "",
        descriptionEn: "",
        targetImpact: "",
        timeline: "Jan 2026 - Dis 2027"
      });
    }
    setIsModalOpen(true);
  };

  // Compile / Save Parameters
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== selectedCityId) return city;

        let updatedProjects = [...city.projects];

        if (editingProjectId) {
          updatedProjects = updatedProjects.map(p => {
            if (p.id === editingProjectId) return { ...p, ...projectForm };
            return p;
          });
        } else {
          const newProj: SmartProject = {
            id: `proj-${Date.now()}`,
            ...projectForm
          };
          updatedProjects.unshift(newProj);
        }

        return {
          ...city,
          projects: updatedProjects
        };
      });
    });

    setIsModalOpen(false);
    setEditingProjectId(null);
  };

  // Demolish / Cancel spec
  const handleDeleteProject = (projectId: string) => {
    if (!window.confirm(language === 'ms' ? "SUNTIKAN PEMBATALAN: Padam projek ini dari sistem?" : "COMMISSION DESTRUCTION: Abort and delete this project from database?")) return;
    
    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== selectedCityId) return city;
        return {
          ...city,
          projects: city.projects.filter(p => p.id !== projectId)
        };
      });
    });
  };

  // Trigger Gemini strategic assessment
  const handleFetchAiAdvisory = async () => {
    setAiLoading(true);
    setAiErrorMsg("");
    try {
      const missing = INDICATOR_DEFINITIONS.filter(i => !currentCity.indicatorValues[i.id]);

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityName: currentCity.name,
          state: currentCity.state,
          population: currentCity.population,
          scores: currentCity.scores,
          missingIndicators: missing,
          projects: currentCity.projects,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error(`Command failure response status: ${response.status}`);
      }

      const body = await response.json();
      const reportContent = body.recommendation || "Integrity error: missing advice payloads.";
      setAiReport(reportContent);
      localStorage.setItem(`mscrs_ai_report_${selectedCityId}`, reportContent);
    } catch (err: any) {
      console.error(err);
      setAiErrorMsg(language === "ms" ? "Gagal berkomunikasi dengan Teras Server Intel Strategic AI. Sila semak sambungan." : "System link to strategic central AI servers timed out. Check firewall keys.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(aiReport);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const total = currentCity.projects.length;
    const completed = currentCity.projects.filter(p => p.status === "Completed").length;
    const ongoing = currentCity.projects.filter(p => p.status === "Ongoing").length;
    const proposed = currentCity.projects.filter(p => p.status === "Proposed").length;
    
    let totalBudget = 0;
    currentCity.projects.forEach(p => {
      totalBudget += p.budget;
    });

    return { total, completed, ongoing, proposed, totalBudget };
  }, [currentCity]);

  // Derived filtered structures
  const filteredIndicators = useMemo(() => {
    return INDICATOR_DEFINITIONS.filter(ind => {
      const matchCat = activeCategoryFilter === "All" || ind.category === activeCategoryFilter;
      const matchQuery = !indicatorSearch || 
        ind.nameMs.toLowerCase().includes(indicatorSearch.toLowerCase()) ||
        ind.nameEn.toLowerCase().includes(indicatorSearch.toLowerCase()) ||
        ind.descriptionMs.toLowerCase().includes(indicatorSearch.toLowerCase()) ||
        ind.descriptionEn.toLowerCase().includes(indicatorSearch.toLowerCase());
      
      return matchCat && matchQuery;
    });
  }, [activeCategoryFilter, indicatorSearch]);

  const filteredProjects = useMemo(() => {
    return currentCity.projects.filter(p => {
      const matchCat = activeCategoryFilter === "All" || p.category === activeCategoryFilter;
      const matchQuery = !projectSearch || 
        p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.descriptionMs.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.descriptionEn.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.targetImpact.toLowerCase().includes(projectSearch.toLowerCase());

      return matchCat && matchQuery;
    });
  }, [currentCity, activeCategoryFilter, projectSearch]);

  // Dynamic tactical alert generator
  const clientSummaryTips = useMemo(() => {
    const sorted = Object.entries(categoryIndicatorStats).sort((a: any, b: any) => a[1].score - b[1].score);
    const lowestCat = sorted[0]?.[0];
    const scoreVal = (sorted[0]?.[1] as any)?.score;

    if (lowestCat === "Smart Mobility") {
      return language === "ms" 
        ? "SEKTOR TRAFIK GENTING: Mobiliti Pintar berada di bawah had selamat kebangsaan. Pasangkan Sistem Pengurusan Lampu Isyarat AI (ITMS) atau penderia letak kereta ultrasonik IoT untuk lonjakan segera +35% indeks."
        : "TRAFFIC BOTTLE-NECK: Smart Mobility values are tracking below safe operational threshold limits. Instruct immediate provisioning of AI street sign telemetry models for a +35% indices boost.";
    } else if (lowestCat === "Smart Environment") {
      return language === "ms"
        ? "AMARAN ALAM SEKITAR: Kriteria pencegahan banjir kilat berada di tahap berisiko tinggi. Pasangkan stesen penderiaan telemetri air bersepadu sungai-sungai utama dengan siren tindak balas kecemasan segera."
        : "THEMETRIC DISASTER RISK: Extreme climate monitoring indicators show severe baseline gaps. Deploy automated river-level sonar tracking arrays with immediate localized broadcast sirens.";
    } else {
      return language === "ms"
        ? `LOMPATAN STRATEGIK: Dimensi ${lowestCat} membentangkan jurang optimum terbesar (${scoreVal}%). Pemenuhan metrik bertumpu di bahagian ini akan menolak sektor ini ke penarafan ALPHA PLATINUM.`
        : `TACTICAL COMPLIANCE ADVANTAGE: The ${lowestCat} sector registers critical system tolerances (${scoreVal}%). Solving unfulfilled indicators here will trigger status elevation to ALPHA PLATINUM level.`;
    }
  }, [categoryIndicatorStats, language]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-4 md:p-8 selection:bg-red-500/30 selection:text-white relative overflow-hidden radar-scanner hud-scanlines font-sans">
      
      {/* Absolute futuristic holographic grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="w-full h-full bg-grid-pattern" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* ========================================== */}
        {/* TOP COMMAND PANEL BOARD                    */}
        {/* ========================================== */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-red-500/20 relative">
          
          <div className="flex items-center gap-4">
            {/* Pulsator reactor core */}
            <div className="w-16 h-16 bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 rounded-lg flex items-center justify-center font-black text-3xl shadow-[0_0_20px_rgba(239,68,68,0.4)] reactor-pulse border border-red-400/40 text-black select-none">
              ☢️
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-display font-black tracking-wider text-white uppercase flex items-center gap-2">
                  <span>{t.heading}</span>
                  <span className="text-red-500 font-extrabold font-mono text-base bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.2)]">CORE INTEL</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-sm font-mono font-bold tracking-widest uppercase">
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-red-400 mt-1.5 font-mono">
                {t.subheading}
              </p>
              <p className="text-[11px] text-slate-400 font-medium font-mono mt-0.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.frameworkDesc}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-start lg:justify-end">
            
            {/* System Status Metrics */}
            <div className="hidden lg:flex gap-6 text-right text-xs mr-3 pr-6 border-r border-slate-900 font-mono">
              <div>
                <p className="text-[9px] text-red-500 uppercase font-bold tracking-widest flex items-center gap-1 justify-end">
                  <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                  <span>{t.statsSummary}</span>
                </p>
                <p className="text-slate-200 mt-0.5 font-bold uppercase">{currentCity.name}, {currentCity.state === "Wilayah Persekutuan" ? "WPK" : "STATE UNIT"}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">TRANSACTION STATUS</p>
                <p className="text-slate-200 mt-0.5 font-bold">{t.auditTime}</p>
              </div>
            </div>

            {/* Language Decryption Switch */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(lang => lang === "ms" ? "en" : "ms")}
              className="flex items-center gap-2 px-4 py-2.5 border rounded-none bg-red-950/10 border-red-500/30 hover:border-amber-500 hover:text-amber-400 hover:bg-amber-950/20 text-xs font-mono font-bold tracking-widest cursor-pointer transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.4)] uppercase"
            >
              <Globe className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{language === "ms" ? "DECRYPT EN" : "DECRYPT MS"}</span>
            </button>
          </div>

          {/* Absolute scanning overlay border effect */}
          <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-red-500" />
        </header>

        {/* CITY PARAMETER SELECTOR DECK */}
        <section className="pt-2">
          <CitySelector 
            cities={cities}
            selectedCityId={selectedCityId}
            onSelectCity={setSelectedCityId}
            language={language}
          />
        </section>

        {/* ========================================================= */}
        {/* TACTICAL BENTO CORE DATA REGISTRY                         */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* CARD 1: EXTREME COMPLIANCE REACTOR INDICES (Span 2 col) */}
          <div className="col-span-1 md:col-span-2 card-glass p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group border-red-500/30">
            {/* Visual background reactor grid */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent rounded-full blur-2xl opacity-70 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-2xl opacity-40 pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
              <div>
                <p className="text-red-400 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>{t.overallScore}</span>
                </p>
                
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-8xl sm:text-9xl font-black font-display tracking-tighter leading-none text-white accent-glow-red">
                    {overallScore}
                  </span>
                  <span className="text-3xl font-black text-red-500 font-mono select-none">%</span>
                </div>
              </div>

              {/* TIER TICKET CLASSIFICATION CONTAINER */}
              <div className="flex flex-col items-start sm:items-end gap-2.5">
                <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/40 rounded-sm flex items-center gap-2 shadow-[0_0_12px_rgba(239,68,68,0.15)] bg-slate-950/80">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <span className="text-xs font-mono font-black text-red-400 tracking-[0.15em] uppercase select-none">
                    LEVEL {statusInfo.tier} SECTOR
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-bold text-left sm:text-right mt-1.5 uppercase tracking-widest">
                  {t.tierStatus}
                </span>
                <span className="text-xs font-mono font-black text-amber-400 tracking-wide bg-amber-500/5 border border-amber-500/20 px-2.5 py-1 text-left sm:text-right select-all uppercase">
                  {statusInfo.text}
                </span>
              </div>
            </div>

            {/* Technical visual tracker sliders */}
            <div className="mt-8 pt-6 border-t border-red-500/20 relative z-10 font-mono">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3.5">
                <span>SECTOR RANGE STATUS METRIC</span>
                <span className="text-red-500 font-black">AUDIT GATEWAY ACTIVATED</span>
              </div>
              
              <div className="flex gap-3 w-full items-center">
                {/* Bronze segment */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className={`h-2.5 rounded-none ${overallScore >= 30 ? 'bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-slate-900'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider">Bronze (30%)</span>
                </div>
                {/* Silver segment */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className={`h-2.5 rounded-none ${overallScore >= 60 ? 'bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-slate-900'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider">Silver (60%)</span>
                </div>
                {/* Gold segment */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className={`h-2.5 rounded-none ${overallScore >= 80 ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.45)]' : 'bg-slate-900'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider">Gold (80%)</span>
                </div>
                {/* Platinum segment */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className={`h-2.5 rounded-none ${overallScore >= 90 ? 'bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_8px_rgba(20,184,166,0.55)]' : 'bg-slate-900'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider">Platinum (90%)</span>
                </div>
              </div>
            </div>

            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-red-500" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-red-500" />
          </div>

          {/* CARD 2: ACTIVE URBAN DESTRUCTIVE DIRECTIVES (1x1) */}
          <div className="card-glass p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group border-red-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/5 to-transparent rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10">
              <span className="text-red-400 text-xs font-mono font-bold tracking-[0.15em] uppercase">
                {t.projects}
              </span>
              <div className="w-8 h-8 rounded-none bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>

            <div className="my-4 relative z-10">
              <div className="flex items-baseline gap-1.5">
                <span className="text-6xl font-black font-display text-white tracking-tight accent-glow-red">
                  {projectStats.total}
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-sm font-mono border border-amber-500/20">
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-3 leading-relaxed">
                Total urban capital inject assets deployed under command metrics.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-red-500/20 text-[9px] font-mono text-slate-400 relative z-10">
              <div>
                <span className="block font-black text-white text-base">{projectStats.completed}</span>
                <span className="uppercase tracking-widest">{t.statusCompleted.split(" ")[0]}</span>
              </div>
              <div>
                <span className="block font-black text-red-400 text-base">{projectStats.ongoing}</span>
                <span className="uppercase tracking-widest">Active</span>
              </div>
              <div>
                <span className="block font-black text-slate-500 text-base">{projectStats.proposed}</span>
                <span className="uppercase tracking-widest">Proposed</span>
              </div>
            </div>

            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/40" />
          </div>

          {/* CARD 3: AUDITED MS ISO RATINGS BLOCK (1x1) */}
          <div className="card-glass p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group border-red-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10">
              <span className="text-red-400 text-xs font-mono font-bold tracking-[0.15em] uppercase">
                {t.indicators}
              </span>
              <div className="w-8 h-8 rounded-none bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="my-4 relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black font-display text-white tracking-tight accent-glow-cyan">
                  {Object.values(currentCity.indicatorValues).filter(Boolean).length}
                </span>
                <span className="text-xl font-bold font-mono text-slate-600">/30 METRICS</span>
              </div>
              
              {/* Tactical progress bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-none mt-4 overflow-hidden border border-red-500/10">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-550 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                  style={{ width: `${(Object.values(currentCity.indicatorValues).filter(Boolean).length / 30) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-red-500/20 flex justify-between items-center text-[9px] font-mono text-slate-400 relative z-10">
              <span className="font-bold text-slate-300 uppercase tracking-widest">ISO 37122 COMPLIANT</span>
              <span className="text-emerald-400 font-extrabold bg-emerald-950/20 border border-emerald-500/40 px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                {Math.round((Object.values(currentCity.indicatorValues).filter(Boolean).length / 30) * 100)}% OK
              </span>
            </div>

            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/40" />
          </div>

          {/* CARD 4: INTERACTIVE HUD SECTOR MATRIX GRID (Span 2 col) */}
          <div className="col-span-1 md:col-span-2 card-glass p-6 shadow-xl border-red-500/20 relative">
            <div className="absolute inset-0 hud-grid-pattern opacity-10 pointer-events-none" />
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-red-400 text-xs font-mono font-bold tracking-[0.25em] uppercase">
                {language === "ms" ? "STRUKTUR INDEKS DIMENSI PBT" : "MUNICIPAL KEY DIMENSION ARRAY"}
              </span>
              <span className="text-[8px] bg-red-950/40 border border-red-500/30 text-red-500 font-mono font-black px-2 py-0.5 rounded-sm tracking-widest uppercase">
                LIVE INTERACTIVE MATRIX
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10 font-mono">
              {CATEGORIES.map(cat => {
                const stat = categoryIndicatorStats[cat];
                const isPressed = activeCategoryFilter === cat;
                const isLowest = cat === Object.entries(categoryIndicatorStats).sort((a: any, b: any) => a[1].score - b[1].score)[0]?.[0];

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`p-3 rounded-none text-left border cursor-pointer transition-all duration-300 relative group/tile overflow-hidden ${
                      isPressed 
                        ? 'bg-gradient-to-br from-red-950/40 to-slate-950/80 border-amber-500 ring-1 ring-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                        : 'bg-slate-950/50 border-red-500/10 hover:border-red-500/40'
                    }`}
                  >
                    {/* Laser scanning strip inside selected dimensions */}
                    {isPressed && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500" />
                    )}

                    <div className="flex justify-between items-start mb-1.5 relative z-10">
                      <p className={`text-[10px] font-black tracking-widest truncate uppercase leading-none ${
                        isPressed ? 'text-amber-400' : isLowest ? 'text-red-500 font-extrabold animate-pulse' : 'text-slate-400'
                      }`}>
                        {cat.replace("Smart ", "")}
                      </p>
                      
                      {isLowest && (
                        <span className="w-2 h-2 bg-red-500 animate-ping shadow-[0_0_8px_rgba(239,68,68,1)]" title="Vulnerability Flag" />
                      )}
                    </div>
                    
                    <p className="text-2xl font-black font-display text-slate-100 relative z-10 leading-none mt-1">{stat.score}%</p>
                    
                    {/* Compact diagnostic slider */}
                    <div className="w-full h-1 bg-slate-950 rounded-none mt-2.5 overflow-hidden border border-white/5">
                      <div 
                        className={`h-full transition-all duration-550 ${
                          isLowest ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" : stat.score >= 80 ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${stat.score}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2 font-bold relative z-10">
                      <span>{stat.checked}/{stat.total} FULFILLED</span>
                      <span className="opacity-0 group-hover/tile:opacity-100 transition-opacity text-red-400 font-mono">SCOPING &rarr;</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/40" />
          </div>

          {/* CARD 5: NATIONAL AI TACTICAL WEAPON RECOMMENDATION SYSTEM (Span 2 col) */}
          <div className="col-span-1 md:col-span-2 card-glass p-6 flex flex-col justify-between shadow-xl border-red-500/30 bg-gradient-to-br from-slate-955 via-[#0c0f1d] to-[#1a0505]/40 relative overflow-hidden group">
            
            {/* Background heat map blur */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start gap-4 p-0.5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-none bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pulse">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-mono font-black tracking-[0.2em] text-red-400 bg-red-950/50 border border-red-500/30 px-2.5 py-0.5 rounded-sm">
                      NATIONAL INTEL HUB
                    </span>
                    {aiReport && !aiLoading && (
                      <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-sm uppercase tracking-widest border border-amber-500/20">LIVE INTEL</span>
                    )}
                  </div>
                  <h3 className="text-base font-display font-black text-slate-100 mt-1 uppercase tracking-wide">
                    {t.aiAdvice}
                  </h3>
                </div>
              </div>

              {!aiReport && !aiLoading && (
                <div className="text-right hidden sm:block font-mono">
                  <span className="text-xs font-bold text-red-500 animate-pulse">CRITICAL DECISION MATRIX</span>
                </div>
              )}
            </div>

            {/* Assessment logs block */}
            <div className="my-5 flex-grow relative z-10">
              {aiLoading ? (
                <div className="bg-slate-950/90 rounded-none p-6 border border-red-500/20 flex flex-col items-center justify-center min-h-[160px] text-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin" />
                    <Cpu className="w-5 h-5 text-amber-500 absolute top-3.5 left-3.5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-red-400 font-bold tracking-[0.15em] animate-pulse">
                      {t.generating}
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                      Processing {currentCity.name} diagnostics... compiling ISO 37122 standard compliance budget matrices...
                    </p>
                  </div>
                </div>
              ) : aiReport ? (
                <div className="bg-slate-950/80 rounded-none p-5 border border-red-500/20 max-h-[190px] overflow-y-auto text-xs text-slate-300 leading-normal font-mono shadow-inner space-y-3 font-normal">
                  <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-900 sticky top-0 bg-slate-950/90 backdrop-blur-sm">
                    <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">
                      STRATEGIC ADVISORY LOGS
                    </span>
                    <button
                      onClick={handleCopyReport}
                      className="text-[9px] text-amber-400 hover:text-amber-300 font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 transition-colors uppercase cursor-pointer"
                    >
                      {isCopied ? t.copied : t.copyText}
                    </button>
                  </div>
                  <div className="text-[11px] whitespace-pre-wrap select-all uppercase">
                    {aiReport}
                  </div>
                </div>
              ) : (
                <div className="bg-[#110505]/40 rounded-none p-5 border border-red-500/20 flex gap-4 items-start min-h-[100px]">
                  <div className="w-10 h-10 rounded-none bg-red-950/40 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-500 animate-pulse">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono font-black tracking-[0.25em] text-red-500 block">DIAGNOSTIC TELEMETRY TIP</span>
                    <p className="text-xs font-semibold text-slate-200 mt-1 lines-clamp-3 leading-relaxed">
                      {clientSummaryTips}
                    </p>
                  </div>
                </div>
              )}

              {aiErrorMsg && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-2 bg-red-950/20 border border-red-900 p-3 font-mono uppercase">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{aiErrorMsg}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3.5 border-t border-slate-900 relative z-10 font-mono">
              <span className="text-[9px] text-slate-500 leading-tight max-w-sm uppercase tracking-wide">
                Diagnostics parsed {unfulfilledIndicators.length} operational vulnerabilities inside urban sector parameters.
              </span>
              
              <button
                id="generate-ai-plan-btn"
                onClick={handleFetchAiAdvisory}
                disabled={aiLoading}
                className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 text-xs font-black font-mono tracking-wider px-6 py-3 rounded-none shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 select-none uppercase"
              >
                <Zap className="w-4 h-4" />
                <span>{t.generatePlan}</span>
              </button>
            </div>
            
            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/45" />
          </div>

          {/* CARD 6: INTENSE SPARKLINE GRAPH OF CO-INTEGRATION (Span 2 col) */}
          <div className="col-span-1 md:col-span-2 card-glass p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group border-red-500/20">
            <div className="flex justify-between items-center mb-3 relative z-10">
              <div>
                <span className="text-red-400 text-xs font-mono font-bold tracking-[0.2em] uppercase">
                  {t.historicalTrend}
                </span>
                <p className="text-[9px] text-slate-500 font-mono uppercase mt-0.5">{t.frameworkDesc}</p>
              </div>

              <div className="text-right">
                <span className="bg-red-500/10 text-red-400 border border-red-500/30 font-black font-mono text-[9px] px-2.5 py-0.5 rounded-sm uppercase tracking-widest animate-pulse">
                  TACTICAL LIVE TELEMETRY FEED
                </span>
              </div>
            </div>

            {/* Clean SVG Graph in Neon Red / Ambers */}
            <div className="h-28 my-3 relative z-10">
              <div className="absolute inset-0 bg-slate-955 p-2 border border-red-500/10">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45"/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(239, 68, 68, 0.1)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(239, 68, 68, 0.1)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(239, 68, 68, 0.1)" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Shaded Area */}
                  <path 
                    d={`M 10 100 L 10 ${100 - (currentCity.history[0]?.score || 71)} L 130 ${100 - (currentCity.history[1]?.score || 74)} L 260 ${100 - (currentCity.history[2]?.score || 76)} L 390 ${100 - overallScore} L 390 100 Z`} 
                    fill="url(#scoreGlow)" 
                    className="transition-all duration-500"
                  />

                  {/* High Quality Crimson Stroke Line */}
                  <path 
                    d={`M 10 ${100 - (currentCity.history[0]?.score || 71)} L 130 ${100 - (currentCity.history[1]?.score || 74)} L 260 ${100 - (currentCity.history[2]?.score || 76)} L 390 ${100 - overallScore}`} 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="3.5" 
                    strokeLinecap="square"
                    className="transition-all duration-500"
                  />

                  {/* Anchors on points */}
                  <circle cx="10" cy={100 - (currentCity.history[0]?.score || 71)} r="3.5" fill="#030712" stroke="#ea580c" strokeWidth="2.5" />
                  <circle cx="130" cy={100 - (currentCity.history[1]?.score || 74)} r="3.5" fill="#030712" stroke="#ea580c" strokeWidth="2.5" />
                  <circle cx="260" cy={100 - (currentCity.history[2]?.score || 76)} r="3.5" fill="#030712" stroke="#ea580c" strokeWidth="2.5" />
                  <circle cx="390" cy={100 - overallScore} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" className="transition-all duration-550 pulsing-dot shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                </svg>

                {/* Grid performance thresholds label overlays */}
                <div className="absolute bottom-1.5 left-3 right-3 flex justify-between text-[8px] font-mono font-bold text-slate-500 leading-none select-none">
                  <span>{currentCity.history[0]?.date || "Ogos 2025"} ({currentCity.history[0]?.score || 71}%)</span>
                  <span>{currentCity.history[1]?.date || "Nov 2025"} ({currentCity.history[1]?.score || 74}%)</span>
                  <span>{currentCity.history[2]?.date || "Feb 2026"} ({currentCity.history[2]?.score || 76}%)</span>
                  <span className="text-red-400 font-bold animate-pulse">LIVE TRACK: {overallScore}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-red-500/20 text-xs relative z-10 font-mono">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-950 border border-slate-900 flex items-center justify-center flex-shrink-0 relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <div className="absolute inset-0 border border-red-500/20" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t.networkHealth}</p>
                  <p className="text-[11px] font-bold text-slate-300 mt-0.5">{t.nodesActive}</p>
                </div>
              </div>

              <div className="text-right flex flex-col justify-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t.nextAudit}</p>
                <p className="text-xs font-bold text-amber-400 mt-0.5">{t.auditDate}</p>
              </div>
            </div>
            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/40" />
          </div>

        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE WORKSPACE CHANNELS                            */}
        {/* ========================================================= */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT INTERACTIVE MODULE: MS ISO STANDARDS CHECKLIST (7-Cols) */}
          <div className="lg:col-span-7 card-glass p-6 md:p-8 space-y-6 border-red-500/20 relative">
            <div className="absolute inset-0 hud-grid-pattern opacity-5 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-red-500/20 relative z-10 font-mono">
              <div>
                <h2 className="text-xl font-display font-black text-white flex items-center gap-2 uppercase">
                  <ShieldCheck className="w-6 h-6 text-red-500" />
                  <span>{t.indicatorsTool}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-normal">
                  PBT sector level analysis matrix database. Check standard rows below to adjust overall indices.
                </p>
              </div>

              {/* Mass controllers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetAllIndicators(true)}
                  className="px-3 py-1.5 text-[9px] bg-red-950/20 border border-red-500/45 text-red-400 hover:bg-red-500 hover:text-black font-black uppercase transition-colors cursor-pointer"
                >
                  SET ALL DECK
                </button>
                <button
                  onClick={() => handleSetAllIndicators(false)}
                  className="px-3 py-1.5 text-[9px] bg-slate-900 border border-slate-800 text-slate-500 hover:bg-slate-850 hover:text-slate-350 font-black uppercase transition-colors cursor-pointer"
                >
                  WIPE ALL DECK
                </button>
              </div>
            </div>

            {/* Query modifiers */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between relative z-10 font-mono">
              
              {/* Search telemetry */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-red-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={indicatorSearch}
                  onChange={(e) => setIndicatorSearch(e.target.value)}
                  className="with-glow w-full bg-slate-950 border border-red-500/10 focus:border-red-500 focus:outline-none rounded-none py-2.5 pl-9 pr-8 text-xs text-slate-200 placeholder:text-slate-600 transition-colors uppercase font-mono"
                />
                {indicatorSearch && (
                  <button 
                    onClick={() => setIndicatorSearch("")}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Active capsules filters */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto justify-end font-mono">
                <button
                  onClick={() => setActiveCategoryFilter("All")}
                  className={`px-3 py-2 rounded-none text-[9px] font-black select-none cursor-pointer transition-all uppercase tracking-wide border ${
                    activeCategoryFilter === "All"
                      ? "bg-red-500 border-red-400 text-black shadow-[0_0_10px_rgba(239,68,68,0.35)]"
                      : "bg-slate-950 border-red-500/10 text-slate-400 hover:border-red-500/30"
                  }`}
                >
                  {t.allCategories}
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-2 rounded-none text-[9px] font-black select-none cursor-pointer transition-all uppercase tracking-wide border ${
                      activeCategoryFilter === cat
                        ? "bg-red-500 border-red-400 text-black shadow-[0_0_10px_rgba(239,68,68,0.35)]"
                        : "bg-slate-950 border-red-500/10 text-slate-400 hover:border-red-500/30"
                    }`}
                  >
                    {cat.replace("Smart ", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist items dynamic rows wrapper */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 relative z-10 font-mono">
              {filteredIndicators.length > 0 ? (
                filteredIndicators.map((ind) => {
                  const isChecked = !!currentCity.indicatorValues[ind.id];
                  const colorConfig = CATEGORY_COLORS[ind.category] || { bg: "bg-slate-800", text: "text-slate-300", accent: "bg-slate-600" };

                  return (
                    <div
                      key={ind.id}
                      onClick={() => handleToggleIndicator(ind.id)}
                      className={`p-4 rounded-none border transition-all duration-300 cursor-pointer flex gap-4 items-start select-none ${
                        isChecked
                          ? "bg-gradient-to-r from-emerald-950/20 to-slate-950/80 border-emerald-500/40 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]"
                          : "bg-slate-950/40 border-red-500/5 hover:border-red-500/20 hover:bg-slate-900/10"
                      }`}
                    >
                      {/* Technical checker state indicator */}
                      <div className={`w-5 h-5 rounded-none border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                        isChecked 
                          ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                          : "border-slate-850 bg-slate-950"
                      }`}>
                        {isChecked && <Check className="w-4.5 h-4.5 stroke-[4]" />}
                      </div>

                      {/* Info layout */}
                      <div className="flex-grow space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 leading-none">
                          <span className={`text-[8px] font-black tracking-widest px-2 py-1 rounded-sm uppercase ${
                            isChecked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/5 text-slate-500 border border-red-500/10'
                          }`}>
                            {ind.category}
                          </span>
                          <span className="text-[8px] font-bold text-slate-600">SECTOR INDEX: {ind.id}</span>
                        </div>

                        <h4 className={`text-sm font-bold font-sans tracking-tight leading-snug uppercase transition-colors ${isChecked ? 'text-white font-extrabold' : 'text-slate-300'}`}>
                          {language === "ms" ? ind.nameMs : ind.nameEn}
                        </h4>
                        
                        <p className="text-xs text-slate-400 leading-relaxed font-sans normal-case">
                          {language === "ms" ? ind.descriptionMs : ind.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center border border-dashed border-red-500/20 bg-slate-950">
                  <AlertCircle className="w-8 h-8 text-red-500/40 mx-auto mb-2" />
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">No matching compliance matrices found under filter query.</p>
                </div>
              )}
            </div>
            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/40" />
          </div>

          {/* RIGHT INTERACTIVE MODULE: URBAN INITIATIVES REGISTER & VULNERABILITY MONITOR (5-Cols) */}
          <div className="lg:col-span-5 card-glass p-6 md:p-8 space-y-6 flex flex-col border-red-500/20 relative">
            <div className="absolute inset-0 hud-grid-pattern opacity-5 pointer-events-none" />
            
            <div className="flex justify-between items-center pb-4 border-b border-red-500/20 relative z-10 font-mono">
              <div>
                <h2 className="text-xl font-display font-black text-white flex items-center gap-2 uppercase">
                  <Briefcase className="w-6 h-6 text-red-500" />
                  <span>{t.projectRegistry}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-normal">
                  Suntik pelaburan modal, audit status operasi semasa dan kesan pulangan KPI.
                </p>
              </div>

              {/* Add trigger */}
              <button
                id="add-initiative-btn"
                onClick={() => handleOpenProjectModal()}
                className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-none shadow-md cursor-pointer transition-all hover:scale-105 flex items-center gap-1.5 uppercase"
              >
                <Plus className="w-4 h-4 text-black stroke-[3]" />
                <span>INJECT</span>
              </button>
            </div>

            {/* Keyword searching */}
            <div className="relative z-10 font-mono">
              <Search className="w-4 h-4 text-red-550 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder={t.searchProjects}
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full bg-slate-955 border border-red-500/15 focus:border-red-500 focus:outline-none rounded-none py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-650 uppercase font-mono"
              />
            </div>

            {/* Projects cards loop */}
            <div className="space-y-4 flex-grow max-h-[500px] overflow-y-auto pr-2 relative z-10 font-mono">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p) => {
                  const statusColors = {
                    Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    Ongoing: "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.05)]",
                    Proposed: "bg-slate-950 text-slate-500 border-slate-900"
                  };

                  return (
                    <div 
                      key={p.id}
                      className="p-4 rounded-none bg-slate-950/60 border border-red-500/5 hover:border-red-500/30 transition-all duration-300 relative group flex flex-col justify-between"
                    >
                      <div>
                        {/* Header metadata details */}
                        <div className="flex justify-between items-start gap-4 mb-2.5">
                          <div>
                            <span className="text-[8px] font-black text-red-400 tracking-widest uppercase">
                              {p.category}
                            </span>
                            <h4 className="text-sm font-sans font-bold text-slate-100 mt-1 line-clamp-1 truncate uppercase tracking-tight">
                              {p.name}
                            </h4>
                          </div>

                          {/* Quick mutate control blocks */}
                          <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenProjectModal(p)}
                              className="p-1 px-2 bg-slate-900 hover:bg-amber-500 hover:text-black hover:font-bold rounded-none text-[9px] text-slate-400 transition-colors cursor-pointer"
                              title={t.editProject}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1 px-2 bg-slate-900 hover:bg-red-600 hover:text-white hover:font-bold rounded-none text-[9px] text-slate-400 transition-colors cursor-pointer"
                              title={t.deleteProject}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Narratives objective */}
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 font-sans normal-case">
                          {language === "ms" ? p.descriptionMs : p.descriptionEn}
                        </p>
                      </div>

                      {/* Footer tags */}
                      <div className="pt-3 border-t border-slate-900 flex flex-wrap gap-2.5 items-center justify-between text-[9px] font-mono text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 border font-extrabold text-[8px] tracking-wider uppercase ${statusColors[p.status]}`}>
                            {p.status === "Proposed" ? t.statusProposed.split(" ")[0] : p.status === "Ongoing" ? t.statusOngoing.split(" ")[0] : t.statusCompleted.split(" ")[0]}
                          </span>
                          <span className="font-extrabold text-slate-200">RM {p.budget.toLocaleString()}</span>
                        </div>

                        <div className="text-right text-[8px] text-slate-500">
                          {p.timeline}
                        </div>
                      </div>

                      {/* High-intensity KPI Impact Tag */}
                      <div className="mt-3 bg-red-950/20 p-2 border border-red-500/10 text-[10px] bg-slate-950/80">
                        <span className="font-black text-red-500 block uppercase tracking-widest text-[8px] mb-0.5 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-red-500 inline" />
                          <span>TARGET METRIC DIRECTIVE</span>
                        </span>
                        <span className="text-slate-300 font-sans leading-relaxed normal-case">{p.targetImpact}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center border border-dashed border-red-500/20 bg-slate-950">
                  <Briefcase className="w-8 h-8 text-red-500/40 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{t.noProjects}</p>
                </div>
              )}
            </div>

            {/* Target vulnerability metrics */}
            <div className="pt-4 border-t border-red-500/20 relative z-10 font-mono">
              <div className="bg-[#1a0505]/30 border border-red-500/30 p-4 rounded-none">
                <span className="text-[10px] font-black text-red-400 block uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 leading-none">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>{language === "ms" ? "STRATEGI CADANGAN AUTOMATIK" : "RECOMMENDED NEXT METRIC TARGETS"}</span>
                </span>
                
                {unfulfilledIndicators.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 italic">
                      {t.unfulfilledWarning}
                    </p>
                    <div className="max-h-[100px] overflow-y-auto space-y-1.5 pr-1 text-xs">
                      {unfulfilledIndicators.slice(0, 3).map(ind => (
                        <div 
                          key={ind.id}
                          onClick={() => handleToggleIndicator(ind.id)}
                          className="flex items-center justify-between p-2 rounded-none bg-slate-950 hover:bg-slate-900 border border-red-500/5 hover:border-red-500/30 text-[10px] cursor-pointer group"
                        >
                          <span className="text-slate-300 font-bold truncate pr-2">
                            {language === "ms" ? ind.nameMs : ind.nameEn}
                          </span>
                          <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/30 px-1.5 py-0.5 font-bold uppercase shrink-0 group-hover:bg-red-500 group-hover:text-black transition-colors">
                            +20% DECK
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 leading-none">
                    <Award className="w-4 h-4 animate-bounce" />
                    <span>SYSTEM STABLE: ALL 30 METRICS OPTIMIZED!</span>
                  </p>
                )}
              </div>
            </div>

            {/* Corner tactical accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/40" />
          </div>

        </section>

        {/* ========================================================= */}
        {/* ACTION / INJECT MODAL PANEL DIALOG                        */}
        {/* ========================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-950 border border-red-500/40 rounded-none p-6 md:p-8 w-full max-w-lg shadow-[0_0_30px_rgba(239,68,68,0.25)] relative font-mono text-xs">
              
              {/* Abs grid bg */}
              <div className="absolute inset-0 hud-grid-pattern opacity-5 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white bg-slate-900 p-1.5 border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-display font-black text-white mb-1 flex items-center gap-2 uppercase tracking-wider">
                <Plus className="w-5 h-5 text-red-500" />
                <span>{editingProjectId ? t.editTitle : t.addTitle}</span>
              </h3>
              <p className="text-[10px] text-slate-500 mb-6 pb-4 border-b border-slate-900 uppercase tracking-wide">
                SYSTEM COMMAND SUNTIKAN: Mutate smart parameters below to compile deployment stats.
              </p>

              <form onSubmit={handleSaveProject} className="space-y-4 text-slate-350">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.projName}</label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="e.g. CORE-IOT: Rangkaian Sensor Pengecasan Bukit Bintang"
                    className="w-full bg-slate-950 border border-slate-850 rounded-none p-3 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-red-500 uppercase font-mono"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.category}</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as CategoryType })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-none p-3 text-slate-200 focus:outline-none focus:border-red-500 cursor-pointer uppercase font-mono"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.status}</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-none p-3 text-slate-200 focus:outline-none focus:border-red-500 cursor-pointer uppercase font-mono"
                    >
                      <option value="Proposed">{t.statusProposed}</option>
                      <option value="Ongoing">{t.statusOngoing}</option>
                      <option value="Completed">{t.statusCompleted}</option>
                    </select>
                  </div>
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.budget} (MYR / RM)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-none p-3 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.timeline}</label>
                    <input
                      type="text"
                      required
                      value={projectForm.timeline}
                      onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })}
                      placeholder="e.g. Jan 2026 - Dis 2026"
                      className="w-full bg-slate-950 border border-slate-850 rounded-none p-3 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                {/* Desc Ms */}
                <div className="space-y-1">
                  <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.descMs}</label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.descriptionMs}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionMs: e.target.value })}
                    placeholder="Deskripsi tindakan pembangunan bandar..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-none p-3 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-red-500 normal-case font-sans"
                  />
                </div>

                {/* Desc En */}
                <div className="space-y-1">
                  <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.descEn}</label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.descriptionEn}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                    placeholder="Provide compliance directives narrative..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-none p-3 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-red-500 normal-case font-sans"
                  />
                </div>

                {/* Impact Goal */}
                <div className="space-y-1">
                  <label className="block text-red-500 font-bold uppercase tracking-wider text-[9px]">{t.impact}</label>
                  <input
                    type="text"
                    required
                    value={projectForm.targetImpact}
                    onChange={(e) => setProjectForm({ ...projectForm, targetImpact: e.target.value })}
                    placeholder="e.g. REDUCTION OF CONGESTION RATIO BY 23% AT PEAK INTERVALS"
                    className="w-full bg-slate-955 border border-slate-850 rounded-none p-3 text-slate-200 placeholder:text-slate-750 focus:outline-none focus:border-red-500 uppercase font-mono"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded-none transition-all cursor-pointer font-bold uppercase"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-650 hover:bg-red-500 text-black rounded-none font-black transition-all shadow-md cursor-pointer flex items-center gap-1 uppercase"
                  >
                    <Check className="w-4 h-4 stroke-[4]" />
                    <span>COMPILE</span>
                  </button>
                </div>
                
              </form>
              
              {/* Corner tactical accents inside modal */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-red-500" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-red-500" />
            </div>
          </div>
        )}

        {/* SYSTEM FOOTER */}
        <footer className="mt-12 pt-6 border-t border-red-500/20 flex flex-col sm:flex-row justify-between items-center text-[9px] tracking-[0.25em] font-bold text-red-500/70 uppercase gap-4 select-none font-mono">
          <div className="text-center sm:text-left">
            KPKT DEPLOYMENT CORE // PLANMALAYSIA STRATEGIC UNIT
          </div>
          <div className="text-center sm:text-right">
            MSCRS COMMAND BENTO SHIELD &copy; 2026 // MALAYSIA SMART CITY COUNCIL
          </div>
        </footer>

      </div>
    </div>
  );
}
