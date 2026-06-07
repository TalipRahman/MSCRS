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
      text: lang === "ms" ? "Platinum (Hadapan)" : "Platinum (Leading)",
      color: "bg-teal-500/10 text-teal-300 border-teal-500/40",
      solidColor: "bg-teal-500",
      tier: "Platinum",
    };
  } else if (score >= 80) {
    return {
      text: lang === "ms" ? "Emas (Hadapan)" : "Gold (Leading)",
      color: "bg-amber-500/10 text-amber-300 border-amber-500/40",
      solidColor: "bg-amber-500",
      tier: "Emas",
    };
  } else if (score >= 60) {
    return {
      text: lang === "ms" ? "Perak (Sedang Membangun)" : "Silver (Developing)",
      color: "bg-sky-500/10 text-sky-300 border-sky-500/40",
      solidColor: "bg-sky-500",
      tier: "Perak",
    };
  } else {
    return {
      text: lang === "ms" ? "Gangsa (Permulaan)" : "Bronze (Early Stage)",
      color: "bg-slate-500/10 text-slate-300 border-slate-500/40",
      solidColor: "bg-slate-500",
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
            className={`text-left p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
              isSelected
                ? "bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-500/10 scale-102 ring-2 ring-sky-500/20"
                : "bg-slate-900/30 border-slate-800/80 hover:border-slate-700/80 hover:shadow-lg"
            }`}
          >
            {/* Background design accents */}
            <div
              className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-125 transition-transform duration-500 ${
                isSelected ? "bg-sky-400" : "bg-sky-600"
              }`}
            />

            <div className="flex justify-between items-start mb-2">
              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest ${
                    isSelected ? "text-sky-400" : "text-slate-500"
                  }`}
                >
                  {city.state}
                </span>
                <h3 className="text-lg font-bold tracking-tight leading-tight mt-0.5 text-slate-100">
                  {city.name}
                </h3>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shadow-inner ${
                  isSelected
                    ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                    : "bg-slate-800/50 text-slate-300 border border-slate-700/50"
                }`}
              >
                {overallScore}%
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                <span>
                  {language === "ms" ? "Penduduk" : "Population"}:{" "}
                  <span className="font-semibold text-slate-300">{city.population}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                <span>
                  {language === "ms" ? "Indikator" : "Indicators"}:{" "}
                  <span className="font-semibold text-slate-300">
                    {totalChecked} / {city.totalIndicators}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-dashed border-slate-800/80">
                <Trophy className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusInfo.color}`}
                >
                  {statusInfo.tier}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
