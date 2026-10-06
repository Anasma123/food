"use client";

import React from "react";
import {
  Menu,
  Sun,
  Moon,
  ScanBarcode,
  Search,
  Bell,
  ShieldCheck,
  Globe,
  User,
  SlidersHorizontal
} from "lucide-react";
import { AppLanguage, LANGUAGE_OPTIONS } from "@/lib/translations";
import { AppPageTab } from "./SidebarNavigation";

interface TopAppHeaderProps {
  activeTab: AppPageTab;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  onQuickTruthInScan: () => void;
  currentLanguage: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  userName: string;
  isAdmin: boolean;
  onOpenProfile: () => void;
}

const PAGE_TITLES: Record<AppPageTab, { title: string; subtitle: string; category: string }> = {
  dashboard: {
    title: "Clinical Diet & Calorie Dashboard",
    subtitle: "Real-time energy balance, macronutrient targets & daily meal logs",
    category: "Health Hub"
  },
  ai_nutritionist: {
    title: "Personal AI Nutritionist & Health Assistant",
    subtitle: "Real-time personal dietary analysis, fridge cooking & clinical answers",
    category: "AI Intelligence"
  },
  truthin_scanner: {
    title: "Barcode & Food Label Scanner",
    subtitle: "1.0-5.0 Clean Food Score, E-numbers decoder & personal health match",
    category: "Food Safety & Transparency"
  },
  truthin_compare: {
    title: "Food Showdown & Comparator",
    subtitle: "Compare two groceries side-by-side to find the cleanest choice",
    category: "Food Safety & Transparency"
  },
  meal_scanner: {
    title: "AI Food Plate Vision & Logger",
    subtitle: "Computer vision multi-item nutrient breakdown & diabetic alerts",
    category: "Clinical Vision"
  },
  smart_fridge: {
    title: "Smart Fridge & Pantry Zero-Waste",
    subtitle: "Live inventory expiry management & clinical recipe synthesis",
    category: "Pantry"
  },
  datasets: {
    title: "Kerala & Global Food Encyclopedia",
    subtitle: "Trained nutritional composition models, ICMR metrics & Malayalam dishes",
    category: "Data Science & Training"
  },
  full_analysis: {
    title: "Clinical Analytics & Graph Engine",
    subtitle: "Historical trends, calorie deficit/surplus & glycemic metrics",
    category: "Analytics"
  },
  food_safety: {
    title: "Food Safety & Grievance Lab",
    subtitle: "Adulteration rapid testing, lab grievance tracking & dispatch",
    category: "Safety & Grievance"
  },
  workflow_guide: {
    title: "A-Z System Architecture & Guide",
    subtitle: "Interactive workflow guide explaining algorithms and data flows",
    category: "Documentation"
  },
  home: {
    title: "AIFood Health & Clinical Nutrition Suite",
    subtitle: "India's first personalized clinical nutrition & food transparency ecosystem",
    category: "Overview"
  }
};

export default function TopAppHeader({
  activeTab,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
  onQuickTruthInScan,
  currentLanguage,
  onChangeLanguage,
  userName,
  isAdmin,
  onOpenProfile
}: TopAppHeaderProps) {
  const currentInfo = PAGE_TITLES[activeTab] || PAGE_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger + Breadcrumb Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                {currentInfo.category}
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[11px] font-semibold text-slate-500">
                {activeTab.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate max-w-md sm:max-w-xl">
              {currentInfo.title}
            </h1>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick TruthIn Scan Button */}
          {activeTab !== "truthin_scanner" && (
            <button
              onClick={onQuickTruthInScan}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <ScanBarcode className="w-4 h-4 text-emerald-600" />
              <span>Scan Barcode</span>
            </button>
          )}

          {/* Light / Dark Mode Button */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200/60 cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {userName || "Profile"}
              </span>
            </div>
            {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />}
          </button>
        </div>
      </div>
    </header>
  );
}
