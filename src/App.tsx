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
  DollarSign, 
  ChevronRight, 
  X, 
  Check, 
  Award,
  AlertCircle,
  TrendingDown,
  Clock,
  Briefcase
} from "lucide-react";
import { CategoryType, CityData, SmartProject, IndicatorDefinition } from "./types";
import { CATEGORIES, CATEGORY_COLORS, INDICATOR_DEFINITIONS, INITIAL_CITIES } from "./data";
import CitySelector, { getSmartCityStatus } from "./components/CitySelector";

const TRANSLATIONS = {
  ms: {
    heading: "MSCRS PRO",
    subheading: "SISTEM PENGIKTIRAFAN BANDAR PINTAR MALAYSIA",
    frameworkDesc: "Mengikut standard Kerangka Bandar Pintar Negara (PLANMalaysia) & MS ISO 37122",
    overallScore: "Jumlah Skor Kebangsaan",
    tierStatus: "Kategori Pengiktirafan PBT",
    projects: "Projek Aktif",
    indicators: "Indikator Lengkap",
    aiAdvice: "Integrasi Penasihat Pintar AI",
    generatePlan: "Jana Pelan Strategik AI",
    generating: "Mengakses Strategis Kebangsaan...",
    networkHealth: "Kesihatan Rangkaian IoT",
    nodesActive: "Semua 1,204 Nod Sensor Aktif",
    nextAudit: "Audit Pengesahan Seterusnya",
    auditDate: "Akan datang: 15 Jun 2026",
    historicalTrend: "Siri Prestasi Aliran Sejarah",
    indicatorsTool: "Pusat Penilaian & Kawalan Indikator standard (MS ISO 37122)",
    searchPlaceholder: "Cari mengikut kriteria...",
    projectRegistry: "Daftar Koleksi Inisiatif Bandar Pintar",
    addProject: "Daftar Projek Baru",
    deleteProject: "Hapus Projek",
    editProject: "Edit Projek",
    budget: "Anggaran Kos",
    timeline: "Garis Masa",
    targetImpact: "Sasaran Impak / Hasil",
    save: "Simpan Projek",
    cancel: "Batal",
    statusProposed: "Cadangan",
    statusOngoing: "Sedang Berjalan",
    statusCompleted: "Selesai",
    allCategories: "Semua Kategori",
    searchProjects: "Cari projek atau inisiatif...",
    category: "Dimensi Utama",
    description: "Hubungan Strategik & Deskripsi Kerja",
    action: "Tindakan",
    noProjects: "Tiada inisiatif dijumpai.",
    addTitle: "Sediakan Projek Peningkatan Bandar Pintar Baharu",
    editTitle: "Kemas Kini Butiran Projek",
    projName: "Nama Projek",
    status: "Status Projek",
    descMs: "Deskripsi (Bahasa Melayu)",
    descEn: "Deskripsi (English)",
    impact: "Sasaran Impak",
    unfulfilledWarning: "Sistem mengesan baki indikator standard berikut bersedia untuk diperbaiki:",
    quickFocus: "Fokus Kategori",
    statsSummary: "Rumusan Data Statistik",
    auditTime: "Audit Terakhir: 12 Okt 2026",
    navHome: "Utama",
    navForm: "Urus Projek",
    navDoc: "Standard Standard",
    copied: "Salin Laporan Berjaya!",
    copyText: "Salin Laporan AI",
  },
  en: {
    heading: "MSCRS PRO",
    subheading: "MALAYSIA SMART CITY RECOGNITION SYSTEM",
    frameworkDesc: "In alignment with the National Smart City Framework (PLANMalaysia) & MS ISO 37122",
    overallScore: "Overall Smart City Score",
    tierStatus: "Recognition Tier Status",
    projects: "Smart Projects",
    indicators: "Indicators Completed",
    aiAdvice: "AI Expert Strategic Recommendation",
    generatePlan: "Generate Strategic Plan",
    generating: "Consulting National Strategy Co-Pilot...",
    networkHealth: "IoT Gateway Operations Core",
    nodesActive: "All 1,204 Sensor Nodes Operational",
    nextAudit: "Next Validation Audit Window",
    auditDate: "Scheduled: Jan 15, 2027",
    historicalTrend: "Historical Progress Framework Trend",
    indicatorsTool: "MS ISO 37122 Standard Performance Checklist",
    searchPlaceholder: "Search indicators by keyword...",
    projectRegistry: "Urban Development & Smart Initiatives Registry",
    addProject: "Add Smart Initiative",
    deleteProject: "Delete Initiative",
    editProject: "Edit Initiative",
    budget: "Estimated Budget",
    timeline: "Timeline Window",
    targetImpact: "Target Impact & Metrics",
    save: "Save Project",
    cancel: "Cancel",
    statusProposed: "Proposed",
    statusOngoing: "Ongoing",
    statusCompleted: "Completed",
    allCategories: "All Categories",
    searchProjects: "Search smart projects registry...",
    category: "Core Smart Dimension",
    description: "Strategic Alignment & Narrative",
    action: "Action",
    noProjects: "No core projects found.",
    addTitle: "Provision New Smart City Initiative",
    editTitle: "Update Initiative Metrics",
    projName: "Project Name",
    status: "Project Status",
    descMs: "Description (Bahasa Melayu)",
    descEn: "Description (English)",
    impact: "Impact Goal",
    unfulfilledWarning: "The system detects the following unfulfilled indicators are ripe for strategic targeting:",
    quickFocus: "Quick Category Filter",
    statsSummary: "Framework Statistics Summary",
    auditTime: "Last Audit: Oct 12, 2026",
    navHome: "Dashboard Home",
    navForm: "Manage Initiatives",
    navDoc: "Standards Checklist",
    copied: "Report copied to clipboard!",
    copyText: "Copy AI Report",
  }
};

export default function App() {
  const [cities, setCities] = useState<CityData[]>(() => {
    // Attempt local storage recall
    const stored = localStorage.getItem("mscrs_cities_data");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return INITIAL_CITIES; }
    }
    return INITIAL_CITIES;
  });

  const [selectedCityId, setSelectedCityId] = useState<string>("kuala-lumpur");
  const [language, setLanguage] = useState<"ms" | "en">("ms");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryType | "All">("All");
  
  // Search states
  const [indicatorSearch, setIndicatorSearch] = useState<string>("");
  const [projectSearch, setProjectSearch] = useState<string>("");

  // AI strategy states
  const [aiReport, setAiReport] = useState<string>(() => {
    return localStorage.getItem(`mscrs_ai_report_${selectedCityId}`) || "";
  });
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiErrorMsg, setAiErrorMsg] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Project Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Custom Project Form fields
  const [projectForm, setProjectForm] = useState<Omit<SmartProject, "id">>({
    name: "",
    category: "Smart Governance",
    budget: 2500000,
    status: "Ongoing",
    descriptionMs: "",
    descriptionEn: "",
    targetImpact: "",
    timeline: "Mei 2026 - Dis 2026"
  });

  // Keep localStorage updated with cities data
  useEffect(() => {
    localStorage.setItem("mscrs_cities_data", JSON.stringify(cities));
  }, [cities]);

  // Load raw AI report when city changes
  useEffect(() => {
    const saved = localStorage.getItem(`mscrs_ai_report_${selectedCityId}`);
    setAiReport(saved || "");
    setAiErrorMsg("");
  }, [selectedCityId]);

  // Read language setting or toggle
  const t = TRANSLATIONS[language];

  // Helper: Retrieve active city reference
  const currentCity = useMemo(() => {
    const found = cities.find(c => c.id === selectedCityId);
    return found || cities[0];
  }, [cities, selectedCityId]);

  // Dynamic calculations:
  // We compute actual scores from the toggled indicators in the state!
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

  // Derived Overall Score
  const overallScore = useMemo(() => {
    const values = Object.values(categoryIndicatorStats).map((c: any) => c.score);
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, current) => sum + current, 0) / values.length);
  }, [categoryIndicatorStats]);

  // Status Info based on overall score
  const statusInfo = useMemo(() => {
    return getSmartCityStatus(overallScore, language);
  }, [overallScore, language]);

  // Unfulfilled/Pending indicators for targeted advice
  const unfulfilledIndicators = useMemo(() => {
    return INDICATOR_DEFINITIONS.filter(ind => {
      // Show only if false for current city and matches category filter (if not "All")
      const val = !!currentCity.indicatorValues[ind.id];
      const matchCat = activeCategoryFilter === "All" || ind.category === activeCategoryFilter;
      return !val && matchCat;
    });
  }, [currentCity, activeCategoryFilter]);

  // Trigger Indicator Checkbox toggle
  const handleToggleIndicator = (id: string) => {
    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== selectedCityId) return city;
        
        const newIndicatorValues = {
          ...city.indicatorValues,
          [id]: !city.indicatorValues[id]
        };

        // Recalculate and update the static "scores" dictionary to keep data structures fully synced
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

  // Quick auto-set/reset all indicators for testing
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

  // Add or Edit Project handler
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
        budget: 1500000,
        status: "Proposed",
        descriptionMs: "",
        descriptionEn: "",
        targetImpact: "",
        timeline: "Jul 2026 - Dis 2026"
      });
    }
    setIsModalOpen(true);
  };

  // Save Project action
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    setCities(prevCities => {
      return prevCities.map(city => {
        if (city.id !== selectedCityId) return city;

        let updatedProjects = [...city.projects];

        if (editingProjectId) {
          // Edit
          updatedProjects = updatedProjects.map(p => {
            if (p.id === editingProjectId) {
              return {
                ...p,
                ...projectForm
              };
            }
            return p;
          });
        } else {
          // Create new
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

  // Delete Project Action
  const handleDeleteProject = (projectId: string) => {
    if (!window.confirm(language === 'ms' ? "Adakah anda pasti mahu menghapus inisiatif ini?" : "Are you sure you want to delete this initiative?")) return;
    
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

  // Call Server Side AI Advisory Recommendations API
  const handleFetchAiAdvisory = async () => {
    setAiLoading(true);
    setAiErrorMsg("");
    try {
      // Find indicators currently unfulfilled or pending
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
        throw new Error(`Server returned status code: ${response.status}`);
      }

      const body = await response.json();
      const reportContent = body.recommendation || "Tiada data cadangan dijumpai.";
      setAiReport(reportContent);
      localStorage.setItem(`mscrs_ai_report_${selectedCityId}`, reportContent);
    } catch (err: any) {
      console.error(err);
      setAiErrorMsg(language === "ms" ? "Mengalami kesulitan memanggil Hub AI Strategis. Sila cuba seketika." : "Could not reach national AI strategy hub. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Copy AI Report Utility
  const handleCopyReport = () => {
    navigator.clipboard.writeText(aiReport);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Statistics for projects
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

  // Filtered lists:
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

  // Generate an automated strategic suggestion dynamically on client-side
  const clientSummaryTips = useMemo(() => {
    // Pick the lowest score category
    const sorted = Object.entries(categoryIndicatorStats).sort((a: any, b: any) => a[1].score - b[1].score);
    const lowestCat = sorted[0]?.[0];
    const scoreVal = (sorted[0]?.[1] as any)?.score;

    if (lowestCat === "Smart Mobility") {
      return language === "ms" 
        ? "Mobiliti Pintar berada di tahap kritikal dalam penilaian semasa. Utamakan pemasangan Sistem Pengurusan Trafik AI (ITMS) atau rangkaian sensor Letak Kereta Pintar untuk peningkatan markah terpantas sebanyak +20%."
        : "Smart Mobility is scoring lower than standard target dimensions. Prioritize Intelligent Traffic Signal Management (ITMS) and smart sensor-based parking to boost your overall audit level by +20%.";
    } else if (lowestCat === "Smart Environment") {
      return language === "ms"
        ? "Skor Alam Sekitar memerlukan pecutan segera tebatan banjir. Sensor IoT Paras Sg. Gombak-Klang JPS membolehkan maklumbalas awal banjir diaktifkan."
        : "Smart Environment scores indicate need for immediate weather resilience upgrades. Implementing real-time telemetry river sensors could secure immediate framework approval.";
    } else {
      return language === "ms"
        ? `Dimensi ${lowestCat} kini mempunyai ruang peningkatan terbesar (${scoreVal}%). Melengkapkan baki indikator standard ISO 37122 akan menyokong sasaran penarafan status Emas/Platinum.`
        : `The ${lowestCat} dimension presents the largest space for immediate rating advancement (${scoreVal}%). Completing standard metrics here acts as the strategic catalyst.`;
    }
  }, [categoryIndicatorStats, language]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 selection:bg-sky-500/30 selection:text-white">
      {/* Container to restrict maximum width */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP BAR / NAVIGATION / BRANDING */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-900">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-600 to-sky-400 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-sky-500/10 text-slate-900">
              🏙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight leading-none text-white uppercase">
                  {t.heading} <span className="text-sky-400 font-black">PRO</span>
                </h1>
                <span className="text-[10px] bg-sky-500/10 border border-sky-400/20 text-sky-400 px-1.5 py-0.5 rounded-full font-bold">
                  v2.8.2
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 mt-1">
                {t.subheading}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {t.frameworkDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* AUDIT DATE METADATA */}
            <div className="hidden lg:flex gap-6 text-right text-xs mr-2 pr-6 border-r border-slate-900">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.statsSummary}</p>
                <p className="text-slate-300 font-medium mt-0.5">{currentCity.name}, {currentCity.state === "Wilayah Persekutuan" ? "WPK" : "SEL"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Last Compliance Session</p>
                <p className="text-slate-300 font-medium mt-0.5">{t.auditTime}</p>
              </div>
            </div>

            {/* LANGUAGE SWITCHER */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(lang => lang === "ms" ? "en" : "ms")}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-slate-900/30 border-slate-800/80 hover:border-sky-500 hover:text-sky-300 hover:bg-sky-950/20 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-md shadow-black/20"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === "ms" ? "ENGLISH (EN)" : "BAHASA MALAYU (MS)"}</span>
            </button>
          </div>
        </header>

        {/* CITY SELECTOR COMPONENT */}
        <div className="pt-2">
          <CitySelector 
            cities={cities}
            selectedCityId={selectedCityId}
            onSelectCity={setSelectedCityId}
            language={language}
          />
        </div>

        {/* ========================================================= */}
        {/* PRIMARY BENTO GRID LAYOUT                                 */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* CARD 1: OVERALL SCORE & RATING TIER (Span 2 col, Span 2 row) */}
          <div className="col-span-1 md:col-span-2 row-span-1 lg:row-span-2 card-glass p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            
            {/* Visual background gradient and design details */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-500/10 to-transparent rounded-full blur-3xl opacity-60 -z-10 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl opacity-60 pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                  {t.overallScore}
                </p>
                
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none text-white accent-text">
                    {overallScore}
                  </span>
                  <span className="text-3xl md:text-4xl font-extrabold text-sky-400 select-none">%</span>
                </div>
              </div>

              {/* TIER TICKET / BADGE */}
              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="px-4 py-2 bg-sky-400/10 border border-sky-400/30 rounded-2xl flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-ping shadow-lg shadow-sky-500" />
                  <span className="text-xs font-extrabold text-sky-400 tracking-wider uppercase select-none">
                    {statusInfo.tier} STATUS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium text-left sm:text-right mt-1">
                  {t.tierStatus}
                </span>
                <span className="text-sm font-bold text-slate-100 text-left sm:text-right">
                  {statusInfo.text}
                </span>
              </div>
            </div>

            {/* Dynamic Milestone Tracker */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-3">
                Rating Progress Tracker
              </p>
              
              <div className="flex gap-2.5 w-full items-center">
                {/* Bronze milestone */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className={`h-2.5 rounded-full ${overallScore >= 30 ? 'bg-sky-500 shadow-md shadow-sky-500/20' : 'bg-slate-800'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center">Bronze (&gt;30%)</span>
                </div>
                {/* Silver milestone */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className={`h-2.5 rounded-full ${overallScore >= 60 ? 'bg-sky-500 shadow-md shadow-sky-500/20' : 'bg-slate-800'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center">Silver (&gt;60%)</span>
                </div>
                {/* Gold milestone */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className={`h-2.5 rounded-full ${overallScore >= 80 ? 'bg-sky-400 shadow-md shadow-sky-400/25' : 'bg-slate-800'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center">Gold (&gt;80%)</span>
                </div>
                {/* Platinum milestone */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className={`h-2.5 rounded-full ${overallScore >= 90 ? 'bg-teal-400 shadow-md shadow-teal-400/25' : 'bg-slate-800'} transition-all duration-500`} />
                  <span className="text-[9px] font-bold text-slate-500 text-center">Platinum (&gt;90%)</span>
                </div>
              </div>
            </div>

            {/* National insignia decorative watermark */}
            <svg className="absolute -bottom-16 -right-16 opacity-[0.02] w-64 h-64 select-none pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
          </div>

          {/* CARD 2: SMART PROJECTS COUNT (1x1) */}
          <div className="card-glass p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl opacity-60 pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                {t.projects}
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-400/20">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white tracking-tight">
                  {projectStats.total}
                </span>
                <span className="text-xs text-sky-400 font-bold bg-sky-400/10 px-1.5 py-0.5 rounded select-none">
                  +12% vs LY
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                PBT registered capital investment initiatives.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              <div>
                <span className="block font-bold text-white">{projectStats.completed}</span>
                <span>{t.statusCompleted}</span>
              </div>
              <div>
                <span className="block font-bold text-sky-400">{projectStats.ongoing}</span>
                <span>Active</span>
              </div>
              <div>
                <span className="block font-bold text-slate-500">{projectStats.proposed}</span>
                <span>{t.statusProposed}</span>
              </div>
            </div>
          </div>

          {/* CARD 3: INDICATORS PROGRESS FRAC (1x1) */}
          <div className="card-glass p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl opacity-60 pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                {t.indicators}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white tracking-tight">
                  {Object.values(currentCity.indicatorValues).filter(Boolean).length}
                </span>
                <span className="text-xl font-bold text-slate-600">/30</span>
              </div>
              
              {/* Dynamic Progress indicator bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full mt-4 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${(Object.values(currentCity.indicatorValues).filter(Boolean).length / 30) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-bold text-slate-300">ISO 37122 Standards</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                {Math.round((Object.values(currentCity.indicatorValues).filter(Boolean).length / 30) * 100)}% Compliant
              </span>
            </div>
          </div>

          {/* CARD 4: CORE CATEGORIES RATINGS GRID (Span 2 col) */}
          <div className="col-span-1 md:col-span-2 card-glass p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                {language === "ms" ? "Markah Dimensi PBT" : "Municipal Dimension Performance"}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded uppercase">
                Interactive Grid
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => {
                const stat = categoryIndicatorStats[cat];
                const isPressed = activeCategoryFilter === cat;
                const isLowest = cat === Object.entries(categoryIndicatorStats).sort((a: any, b: any) => a[1].score - b[1].score)[0]?.[0];

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`p-3.5 pr-2 rounded-2xl text-left border cursor-pointer transition-all duration-300 relative group/tile ${
                      isPressed 
                        ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500/20' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-[10px] uppercase font-bold truncate pr-1 ${
                        isPressed ? 'text-sky-400' : isLowest ? 'text-red-400 font-extrabold' : 'text-slate-400'
                      }`}>
                        {cat.replace("Smart ", "")}
                      </p>
                      
                      {isLowest && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" title="Needs Attention" />
                      )}
                    </div>
                    
                    <p className="text-2xl font-black text-slate-100 mt-1">{stat.score}%</p>
                    
                    {/* Micro Mini Progress block */}
                    <div className="w-full h-1 bg-slate-900 rounded-full mt-2.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isLowest ? "bg-red-500" : stat.score >= 80 ? "bg-emerald-500" : "bg-sky-500"
                        }`}
                        style={{ width: `${stat.score}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1.5 font-bold">
                      <span>{stat.checked}/{stat.total} Metrics</span>
                      <span className="opacity-0 group-hover/tile:opacity-100 transition-opacity text-sky-400 font-medium">Filter &rarr;</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 5: DYNAMIC AI STRATEGY BOX (Span 2 col) */}
          <div className="col-span-1 md:col-span-2 card-glass p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/20 border-sky-900/40 shadow-xl relative overflow-hidden group">
            
            {/* Ambient subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black text-sky-400 bg-sky-400/10 px-2.5 py-0.5 rounded-full tracking-wider">
                      PLANMalaysia Assist
                    </span>
                    {aiReport && !aiLoading && (
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">Live Advice</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mt-1">
                    {t.aiAdvice}
                  </h3>
                </div>
              </div>

              {!aiReport && !aiLoading && (
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">ISO 37122 Strategic Advisory</span>
                </div>
              )}
            </div>

            {/* Main view field for AI recommendations */}
            <div className="my-5 flex-grow">
              {aiLoading ? (
                <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-900 flex flex-col items-center justify-center min-h-[140px] text-center space-y-3">
                  <div className="relative">
                    <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
                    <Sparkles className="w-4 h-4 text-sky-400 absolute top-3 left-3 animate-ping" />
                  </div>
                  <p className="text-xs text-sky-400 font-bold tracking-wide animate-pulse">
                    {t.generating}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Sistem sedang memproses parameter {currentCity.name}, mengira jurang indikator standard, dan merumus belanjawan...
                  </p>
                </div>
              ) : aiReport ? (
                <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-900/80 max-h-[180px] overflow-y-auto text-xs text-slate-300 leading-relaxed font-normal shadow-inner space-y-2 prose prose-invert">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-900 sticky top-0 bg-slate-950">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Laporan Pengiktirafan PBT
                    </span>
                    <button
                      onClick={handleCopyReport}
                      className="text-[10px] text-sky-400 hover:text-sky-300 font-bold bg-sky-500/5 hover:bg-sky-500/15 px-2 py-1 rounded transition-colors"
                    >
                      {isCopied ? t.copied : t.copyText}
                    </button>
                  </div>
                  <div className="text-[11px] whitespace-pre-wrap select-text selection:bg-sky-500/40">
                    {aiReport}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/30 rounded-2xl p-5 border border-slate-900/50 flex gap-4 items-start min-h-[90px]">
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center flex-shrink-0 text-amber-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Saranan Dinamik Pra-Kiraan</span>
                    <p className="text-xs font-semibold text-slate-300 mt-1 leading-relaxed">
                      {clientSummaryTips}
                    </p>
                  </div>
                </div>
              )}

              {aiErrorMsg && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 bg-red-950/10 border border-red-900/20 p-2.5 rounded-lg font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{aiErrorMsg}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3 border-t border-slate-850">
              <span className="text-[10px] text-slate-500 leading-normal max-w-md font-medium">
                Saranan menganalisis {unfulfilledIndicators.length} jurang kriteria sedia ada bagi {currentCity.name}.
              </span>
              
              <button
                id="generate-ai-plan-btn"
                onClick={handleFetchAiAdvisory}
                disabled={aiLoading}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl shadow-lg hover:shadow-sky-500/10 hover:shadow-xl hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.generatePlan}</span>
              </button>
            </div>
          </div>

          {/* CARD 6: TELEMENTRY & HISTORICAL TREND LINE (Span 2 col) */}
          <div className="col-span-1 md:col-span-2 card-glass p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                  {t.historicalTrend}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">{t.frameworkDesc}</p>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/10 text-emerald-400 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                  Live Feed Status
                </span>
              </div>
            </div>

            {/* Sparkline historical trend graph built with robust scalable pure SVG */}
            <div className="h-28 my-2 relative">
              <div className="absolute inset-0 bg-slate-950/20 rounded-2xl border border-slate-900/60 p-2 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Shaded Area */}
                  {/* Points calculated based on history: Ogos: 71, Nov: 74, Feb: 76, Jun: overallScore (dynamic) */}
                  <path 
                    d={`M 10 100 L 10 ${100 - (currentCity.history[0]?.score || 71)} L 130 ${100 - (currentCity.history[1]?.score || 74)} L 260 ${100 - (currentCity.history[2]?.score || 76)} L 390 ${100 - overallScore} L 390 100 Z`} 
                    fill="url(#scoreGlow)" 
                    className="transition-all duration-500"
                  />

                  {/* Trend Line (Interpolated based on active values) */}
                  <path 
                    d={`M 10 ${100 - (currentCity.history[0]?.score || 71)} L 130 ${100 - (currentCity.history[1]?.score || 74)} L 260 ${100 - (currentCity.history[2]?.score || 76)} L 390 ${100 - overallScore}`} 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />

                  {/* Individual Points Anchors */}
                  {/* Point 1 */}
                  <circle cx="10" cy={100 - (currentCity.history[0]?.score || 71)} r="4" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                  {/* Point 2 */}
                  <circle cx="130" cy={100 - (currentCity.history[1]?.score || 74)} r="4" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                  {/* Point 3 */}
                  <circle cx="260" cy={100 - (currentCity.history[2]?.score || 76)} r="4" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                  {/* Dynamic Point 4 */}
                  <circle cx="390" cy={100 - overallScore} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="transition-all duration-500 pulsing-dot" />
                </svg>

                {/* Date labels overlay */}
                <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] text-slate-500 font-bold select-none leading-none">
                  <span>{currentCity.history[0]?.date || "Ogos 2025"} ({currentCity.history[0]?.score || 71}%)</span>
                  <span>{currentCity.history[1]?.date || "Nov 2025"} ({currentCity.history[1]?.score || 74}%)</span>
                  <span>{currentCity.history[2]?.date || "Feb 2026"} ({currentCity.history[2]?.score || 76}%)</span>
                  <span className="text-sky-400 font-black">Live: {overallScore}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shadow-lg shadow-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.networkHealth}</p>
                  <p className="text-[11px] font-bold text-slate-300 mt-0.5">{t.nodesActive}</p>
                </div>
              </div>

              <div className="text-right flex flex-col justify-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.nextAudit}</p>
                <p className="text-xs font-bold text-sky-400 mt-0.5">{t.auditDate}</p>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE WORKSPACE SECTION                           */}
        {/* ========================================================= */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT INTERACTIVE MODULE: MS ISO STANDARDS CHECKLIST (7-Cols) */}
          <div className="lg:col-span-7 card-glass p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5.5 h-5.5 text-sky-400" />
                  <span>{t.indicatorsTool}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Bahagian ini membenarkan pegawai PBT menyemak kepatuhan kriteria standard.
                </p>
              </div>

              {/* Reset handlers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetAllIndicators(true)}
                  className="px-2.5 py-1 text-[10px] bg-sky-950/20 border border-sky-800 text-sky-300 hover:bg-sky-900/30 rounded font-semibold transition-colors cursor-pointer"
                >
                  Set Semua
                </button>
                <button
                  onClick={() => handleSetAllIndicators(false)}
                  className="px-2.5 py-1 text-[10px] bg-slate-900/40 border border-slate-800 text-slate-400 hover:bg-slate-800 rounded font-semibold transition-colors cursor-pointer"
                >
                  Padam Semua
                </button>
              </div>
            </div>

            {/* Filters Dashboard */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Query Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={indicatorSearch}
                  onChange={(e) => setIndicatorSearch(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-900 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                {indicatorSearch && (
                  <button 
                    onClick={() => setIndicatorSearch("")}
                    className="absolute right-3 top-2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category selector capsules */}
              <div className="flex flex-wrap gap-1 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setActiveCategoryFilter("All")}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold select-none cursor-pointer transition-colors ${
                    activeCategoryFilter === "All"
                      ? "bg-sky-500 text-slate-950"
                      : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {t.allCategories}
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold select-none cursor-pointer transition-colors ${
                      activeCategoryFilter === cat
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    {cat.replace("Smart ", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredIndicators.length > 0 ? (
                filteredIndicators.map((ind) => {
                  const isChecked = !!currentCity.indicatorValues[ind.id];
                  const colorConfig = CATEGORY_COLORS[ind.category] || { bg: "bg-slate-800", text: "text-slate-300", accent: "bg-slate-600" };

                  return (
                    <div
                      key={ind.id}
                      onClick={() => handleToggleIndicator(ind.id)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start select-none ${
                        isChecked
                          ? "bg-slate-900/45 border-sky-400/40 shadow-inner"
                          : "bg-slate-950/20 border-slate-850 hover:bg-slate-900/20"
                      }`}
                    >
                      {/* Checkbox circle node */}
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                        isChecked 
                          ? "bg-sky-500 border-sky-400 text-slate-950" 
                          : "border-slate-700 hover:border-slate-500"
                      }`}>
                        {isChecked && <Check className="w-4.5 h-4.5 stroke-[3]" />}
                      </div>

                      {/* Text details */}
                      <div className="flex-grow space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md text-slate-200 border border-slate-800 bg-slate-950 ${colorConfig.text}`}>
                            {ind.category}
                          </span>
                          <span className="text-[9px] font-bold text-slate-600">ID: {ind.id}</span>
                        </div>

                        <h4 className={`text-sm font-bold tracking-tight transition-colors ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                          {language === "ms" ? ind.nameMs : ind.nameEn}
                        </h4>
                        
                        <p className="text-xs text-slate-400 leading-normal font-normal">
                          {language === "ms" ? ind.descriptionMs : ind.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10">
                  <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Tiada kriteria standard yang sepadan dengan carian ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT INTERACTIVE MODULE: INITIATIVES REGISTER & AUDIT LISTS (5-Cols) */}
          <div className="lg:col-span-5 card-glass p-6 md:p-8 space-y-6 flex flex-col">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5.5 h-5.5 text-sky-400" />
                  <span>{t.projectRegistry}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Urus bajet dan sasaran kerja fungsian.
                </p>
              </div>

              {/* Add initiative trigger button */}
              <button
                id="add-initiative-btn"
                onClick={() => handleOpenProjectModal()}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow cursor-pointer transition-all hover:scale-103 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addProject.split(" ")[0]}</span>
              </button>
            </div>

            {/* Projects Search filter bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t.searchProjects}
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-900 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            {/* List of ongoing projects cards */}
            <div className="space-y-4 flex-grow max-h-[500px] overflow-y-auto pr-2">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p) => {
                  const statusColors = {
                    Completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                    Ongoing: "bg-sky-500/10 text-sky-300 border-sky-500/30",
                    Proposed: "bg-slate-800 text-slate-400 border-slate-700"
                  };

                  return (
                    <div 
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 relative group flex flex-col justify-between"
                    >
                      <div>
                        {/* Header details with action keys */}
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase">
                              {p.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-100 mt-0.5 line-clamp-1">
                              {p.name}
                            </h4>
                          </div>

                          {/* Controls */}
                          <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenProjectModal(p)}
                              className="p-1 px-1.5 bg-slate-800/80 hover:bg-sky-500 hover:text-slate-950 rounded text-[10px] text-slate-300 font-bold flex items-center transition-colors cursor-pointer"
                              title={t.editProject}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1 px-1.5 bg-slate-800/80 hover:bg-red-600 hover:text-white rounded text-[10px] text-slate-300 font-bold flex items-center transition-colors cursor-pointer"
                              title={t.deleteProject}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Narratives */}
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {language === "ms" ? p.descriptionMs : p.descriptionEn}
                        </p>
                      </div>

                      {/* Footnotes: Key indicators, values */}
                      <div className="pt-3 border-t border-slate-850 flex flex-wrap gap-2 items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded border font-bold text-[8px] tracking-wider uppercase ${statusColors[p.status]}`}>
                            {p.status === "Proposed" ? t.statusProposed : p.status === "Ongoing" ? t.statusOngoing : t.statusCompleted}
                          </span>
                          <span className="font-semibold text-slate-300">RM {p.budget.toLocaleString()}</span>
                        </div>

                        <div className="text-right text-[9px] text-slate-500">
                          {p.timeline}
                        </div>
                      </div>

                      {/* Targeted KPI info */}
                      <div className="mt-2 bg-slate-950/40 p-2 rounded-lg text-[10px] border border-slate-900">
                        <span className="font-extrabold text-[#38bdf8] block uppercase tracking-wider text-[8px] mb-0.5">KPI IMPAK</span>
                        <span className="text-slate-300 leading-snug">{p.targetImpact}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10">
                  <Briefcase className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">{t.noProjects}</p>
                </div>
              )}
            </div>

            {/* Targeted Unfulfilled Indicators Widget inside Initiatives Module */}
            <div className="pt-4 border-t border-slate-900">
              <div className="bg-sky-500/5 border border-sky-400/20 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-sky-400 block uppercase tracking-widest mb-2">
                  {language === "ms" ? "Fokus Sasaran Automatik" : "Recommended Next Smart Targets"}
                </span>
                
                {unfulfilledIndicators.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-300 italic">
                      {t.unfulfilledWarning}
                    </p>
                    <div className="max-h-[100px] overflow-y-auto space-y-1.5 pr-1">
                      {unfulfilledIndicators.slice(0, 3).map(ind => (
                        <div 
                          key={ind.id}
                          onClick={() => handleToggleIndicator(ind.id)}
                          className="flex items-center justify-between p-2 rounded bg-slate-950/60 hover:bg-slate-900 border border-slate-900 text-[10px] cursor-pointer group"
                        >
                          <span className="text-slate-200 font-bold truncate pr-2">
                            {language === "ms" ? ind.nameMs : ind.nameEn}
                          </span>
                          <span className="text-[8px] bg-sky-400/10 text-sky-400 border border-sky-400/20 px-1 py-0.5 rounded font-bold uppercase shrink-0 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                            +20% Score
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>Tahniah! Semua indikator standard bandar pintar telah dipenuhi secara optimum!</span>
                  </p>
                )}
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================= */}
        {/* ADD/EDIT PROJECT INITIATIVE DIALOG MODAL                  */}
        {/* ========================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
              
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white rounded-full bg-slate-800 p-1.5 border border-slate-700 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Plus className="w-5.5 h-5.5 text-sky-400" />
                <span>{editingProjectId ? t.editTitle : t.addTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6 pb-4 border-b border-slate-850">
                Pendaftaran inisiatif akan mengemaskini paparan volum pelaburan serta statistik projek di bento utama.
              </p>

              <form onSubmit={handleSaveProject} className="space-y-4 text-xs text-slate-300">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.projName}</label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="Contoh: Rangkaian Sensor Pengecasan EV Taman Botani"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Grid categories & status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.category}</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as CategoryType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.status}</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      <option value="Proposed">{t.statusProposed}</option>
                      <option value="Ongoing">{t.statusOngoing}</option>
                      <option value="Completed">{t.statusCompleted}</option>
                    </select>
                  </div>
                </div>

                {/* Grid budget & timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.budget} (MYR / RM)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.timeline}</label>
                    <input
                      type="text"
                      required
                      value={projectForm.timeline}
                      onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })}
                      placeholder="e.g. Mac 2026 - Dis 2026"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Narrative description (Bahasa) */}
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.descMs}</label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.descriptionMs}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionMs: e.target.value })}
                    placeholder="Penerangan projek dalam Bahasa Melayu..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-750 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Narrative description (English) */}
                <div className="space-y-1">
                  <label className="block text-slate-450 font-bold uppercase tracking-wider text-[9px]">{t.descEn}</label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.descriptionEn}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                    placeholder="Provide description english details..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-750 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Target Impact (KPI) */}
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.impact}</label>
                  <input
                    type="text"
                    required
                    value={projectForm.targetImpact}
                    onChange={(e) => setProjectForm({ ...projectForm, targetImpact: e.target.value })}
                    placeholder="e.g. Mengurangkan pelepasan karbon mikro sebanyak 14% di zon padat"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Form Buttons actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer font-bold"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl transition-all font-black shadow-lg cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t.save}</span>
                  </button>
                </div>
                
              </form>
            </div>
          </div>
        )}

        {/* SYSTEM FOOTER / FRAMEWORK ACCREDITATIONS */}
        <footer className="mt-12 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium gap-4 select-none">
          <div className="text-center sm:text-left">
            KEMENTERIAN PERUMAHAN DAN KERAJAAN TEMPATAN KPKT
          </div>
          <div className="text-center sm:text-right">
            MSCRS DIGITAL BENTO FRAMEWORK &copy; 2026 MALAYSIA SMART CITY COUNCIL
          </div>
        </footer>

      </div>
    </div>
  );
}
