/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CityData } from "../types";
import { Building2, Users, CheckCircle2, Trophy } from "lucide-react";

interface CitySelectorProps {
  cities: CityData[];
  selectedCityId: string;
  onSelectCity: (id: string) => void;
  language: "ms" | "en";
}

export function getSmartCityStatus(score: number, lang: "ms" | "en") {
  if (score >= 90) {
    return {
      text: lang === "ms" ? "ALPHA PLATINUM (HADAPAN)" : "ALPHA PLATINUM (LEADING)",
      color: "bg-teal-500/20 text-teal-400 border-teal-500/40 shadow-[0_0_10px_rgba(20,184,166,0.15)]",
      solidColor: "bg-teal-500",
      tier: "Platinum",
    };
  } else if (score >= 80) {
    return {
      text: lang === "ms" ? "CORE GOLD (KOMPREHENSIF)" : "CORE GOLD (COMPREHENSIVE)",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
      solidColor: "bg-amber-500",
      tier: "Emas",
    };
  } else if (score >= 60) {
    return {
      text: lang === "ms" ? "TACTICAL SILVER (SEDANG MAJU)" : "TACTICAL SILVER (DEVELOPING)",
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]",
      solidColor: "bg-cyan-500",
      tier: "Perak",
    };
  } else {
    return {
      text: lang === "ms" ? "SECTOR BRONZE (RINTIS BASAL)" : "SECTOR BRONZE (INITIATION COMPLIANCE)",
      color: "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
      solidColor: "bg-red-500",
      tier: "Gangsa",
    };
  }
}

export default function CitySelector({
  cities,
  selectedCityId,
  onSelectCity,
  language,
}: CitySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cities.map((city) => {
        const isSelected = city.id === selectedCityId;
        
        // Calculate scores dynamically based on checked indicators
        const totalChecked = Object.values(city.indicatorValues).filter(Boolean).length;
        
        // Dynamic category scores calculation to keep everything synchronized
        const scoreValues = Object.values(city.scores);
        const overallScore = Math.round(
          scoreValues.reduce((sum, current) => sum + current, 0) / (scoreValues.length || 1)
        );
        const statusInfo = getSmartCityStatus(overallScore, language);

        return (
          <button
            key={city.id}
            id={`city-btn-${city.id}`}
            onClick={() => onSelectCity(city.id)}
            className={`text-left p-5 transition-all duration-300 relative overflow-hidden group cursor-pointer card-glass ${
              isSelected
                ? "border-amber-500 ring-2 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.02] bg-gradient-to-br from-slate-950 via-slate-950 to-amber-950/20"
                : "border-slate-850 bg-slate-950/40 opacity-70 hover:opacity-100 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            }`}
          >
            {/* HUD Grid Pattern in background */}
            <div className="absolute inset-0 hud-grid-pattern opacity-10 pointer-events-none" />

            {/* Background heat corner glowing accent */}
            <div
              className={`absolute -right-12 -top-12 w-24 h-24 rounded-full blur-2xl opacity-15 transition-transform duration-700 ${
                isSelected ? "bg-amber-400 scale-150" : "bg-red-500 hover:scale-125"
              }`}
            />

            {/* Tactical laser scanning line indicator inside elected cards */}
            {isSelected && (
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse shadow-[0_1px_8px_rgba(245,158,11,0.8)]" />
            )}

            <div className="flex justify-between items-start mb-2 relative z-10">
              <div>
                <span
                  className={`text-[9px] uppercase font-bold tracking-[0.2em] font-mono ${
                    isSelected ? "text-amber-400 font-extrabold" : "text-slate-500"
                  }`}
                >
                  {city.state}
                </span>
                <h3 className="text-lg font-bold font-sans tracking-tight leading-none mt-1 text-slate-100 uppercase">
                  {city.name}
                </h3>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-display font-bold text-lg select-none ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                    : "bg-slate-900/60 text-slate-400 border border-slate-800"
                }`}
              >
                <span className="text-[7px] font-mono uppercase tracking-widest text-slate-500">Score</span>
                <span className="-mt-1 font-black">{overallScore}%</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-xs relative z-10 font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                <span className="text-[11px]">
                  {language === "ms" ? "PENDAFTAR" : "POPULATION"}:{" "}
                  <span className="font-bold text-slate-200 font-display text-sm">{city.population}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                <span className="text-[11px]">
                  {language === "ms" ? "INDIKATOR" : "COMPLIANCE"}:{" "}
                  <span className="font-bold text-slate-200 font-display text-sm">
                    {totalChecked} <span className="text-slate-600 font-normal">/</span> {city.totalIndicators}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-slate-800/80">
                <Trophy className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-amber-400 animate-bounce" : "text-slate-600"}`} />
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider border uppercase ${statusInfo.color}`}
                >
                  {statusInfo.tier} CLASSIFICATION
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
