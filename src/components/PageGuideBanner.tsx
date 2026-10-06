"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  HelpCircle,
  Compass
} from "lucide-react";
import { PAGE_GUIDES, UI_TRANSLATIONS, AppLanguage } from "@/lib/translations";

interface PageGuideBannerProps {
  pageKey: "dashboard" | "meal_scanner" | "barcode_scanner" | "smart_fridge" | "food_safety";
  language: AppLanguage;
  onOpenFullGuide?: () => void;
  accentColor?: "emerald" | "amber" | "cyan" | "rose" | "teal";
}

export default function PageGuideBanner({
  pageKey,
  language,
  onOpenFullGuide,
  accentColor = "emerald"
}: PageGuideBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const guide = PAGE_GUIDES[pageKey]?.[language] || PAGE_GUIDES[pageKey]?.en;
  const ui = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const colorStyles = {
    emerald: {
      btn: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      accentText: "text-emerald-400",
      border: "border-emerald-500/25",
      gradient: "from-emerald-500/10 via-emerald-950/20 to-transparent",
      badge: "bg-emerald-500 text-slate-950"
    },
    amber: {
      btn: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30",
      pill: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      accentText: "text-amber-400",
      border: "border-amber-500/25",
      gradient: "from-amber-500/10 via-amber-950/20 to-transparent",
      badge: "bg-amber-500 text-slate-950"
    },
    cyan: {
      btn: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      pill: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      accentText: "text-cyan-400",
      border: "border-cyan-500/25",
      gradient: "from-cyan-500/10 via-cyan-950/20 to-transparent",
      badge: "bg-cyan-500 text-slate-950"
    },
    rose: {
      btn: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30",
      pill: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      accentText: "text-rose-400",
      border: "border-rose-500/25",
      gradient: "from-rose-500/10 via-rose-950/20 to-transparent",
      badge: "bg-rose-500 text-slate-950"
    },
    teal: {
      btn: "bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/30",
      pill: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      accentText: "text-teal-400",
      border: "border-teal-500/25",
      gradient: "from-teal-500/10 via-teal-950/20 to-transparent",
      badge: "bg-teal-500 text-slate-950"
    }
  }[accentColor];

  if (!guide) return null;

  return (
    <div className={`rounded-3xl border ${colorStyles.border} bg-gradient-to-r ${colorStyles.gradient} backdrop-blur-md overflow-hidden transition-all shadow-lg`}>
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow ${colorStyles.pill}`}>
            <BookOpen className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorStyles.pill}`}>
                {ui.pageGuide}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {guide.tagline}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {guide.title}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onOpenFullGuide && (
            <button
              type="button"
              onClick={onOpenFullGuide}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${colorStyles.btn}`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{ui.explainThisWork}</span>
              <span className="sm:hidden">Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isExpanded
                ? "bg-white/20 text-white border border-white/20"
                : `${colorStyles.pill} hover:brightness-110`
            }`}
          >
            <span>{isExpanded ? ui.hideGuide : ui.showGuide}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Detailed Guidance Body */}
      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-white/10 space-y-5 text-xs text-slate-300 animate-fadeIn">
          {/* Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/10 text-slate-200 leading-relaxed">
            <p>{guide.summary}</p>
          </div>

          {/* Step-by-Step Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {guide.steps.map((st) => (
              <div
                key={st.number}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${colorStyles.badge}`}>
                      {st.number}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Step {st.number}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 text-[10px] text-cyan-300 font-mono">
                  👉 {st.actionHint}
                </div>
              </div>
            ))}
          </div>

          {/* Tips & Example Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Tips for Best Results
              </h5>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {guide.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Example Output
              </h5>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                {guide.example}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
