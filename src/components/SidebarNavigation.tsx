"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  ScanBarcode,
  Sparkles,
  UtensilsCrossed,
  Refrigerator,
  BarChart3,
  ShieldAlert,
  Compass,
  Scale,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  LogOut,
  Globe,
  Bot,
  Database
} from "lucide-react";
import { AppLanguage, LANGUAGE_OPTIONS } from "@/lib/translations";

export type AppPageTab =
  | "dashboard"
  | "ai_nutritionist"
  | "truthin_scanner"
  | "truthin_compare"
  | "meal_scanner"
  | "smart_fridge"
  | "datasets"
  | "full_analysis"
  | "food_safety"
  | "workflow_guide"
  | "home";

interface SidebarNavigationProps {
  activeTab: AppPageTab;
  onSelectTab: (tab: AppPageTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentLanguage: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  userName: string;
  userRole: "admin" | "user";
  onOpenAuthModal: () => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function SidebarNavigation({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  currentLanguage,
  onChangeLanguage,
  isLoggedIn,
  isAdminLoggedIn,
  userName,
  userRole,
  onOpenAuthModal,
  onLogout,
  mobileMenuOpen,
  onCloseMobileMenu,
  collapsed: controlledCollapsed,
  onToggleCollapse: controlledOnToggleCollapse
}: SidebarNavigationProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = controlledOnToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const navGroups = [
    {
      label: "Diet & Personal AI",
      items: [
        {
          id: "dashboard" as AppPageTab,
          label: "Diet Dashboard",
          sublabel: "Daily Calories & Macros",
          icon: LayoutDashboard,
          badge: "Live",
          badgeColor: "bg-emerald-100 text-emerald-800 font-bold"
        },
        {
          id: "ai_nutritionist" as AppPageTab,
          label: "Personal AI Nutritionist",
          sublabel: "Personalized Diet Assistant",
          icon: Bot,
          badge: "AI Chat",
          badgeColor: "bg-indigo-100 text-indigo-800 font-bold"
        },
        {
          id: "home" as AppPageTab,
          label: "Landing Hub",
          sublabel: "Overview & Features",
          icon: Compass
        }
      ]
    },
    {
      label: "Food Transparency & Scanner",
      items: [
        {
          id: "truthin_scanner" as AppPageTab,
          label: "Barcode & Label Scanner",
          sublabel: "1-5 Clean Score & Additives",
          icon: ScanBarcode,
          badge: "Scanner",
          badgeColor: "bg-teal-100 text-teal-800 font-bold"
        },
        {
          id: "truthin_compare" as AppPageTab,
          label: "Food Showdown",
          sublabel: "Head-to-head Clean Score",
          icon: Scale,
          badge: "Compare",
          badgeColor: "bg-amber-100 text-amber-800"
        }
      ]
    },
    {
      label: "Clinical Nutrition",
      items: [
        {
          id: "meal_scanner" as AppPageTab,
          label: "AI Plate Vision",
          sublabel: "Photo Meal Nutrition",
          icon: UtensilsCrossed
        },
        {
          id: "smart_fridge" as AppPageTab,
          label: "Smart Fridge",
          sublabel: "Inventory & Zero Waste",
          icon: Refrigerator
        },
        {
          id: "datasets" as AppPageTab,
          label: "Food Encyclopedia",
          sublabel: "1,050+ Trained Foods",
          icon: Database,
          badge: "1,000+",
          badgeColor: "bg-blue-100 text-blue-800 font-bold"
        },
        {
          id: "full_analysis" as AppPageTab,
          label: "Analytics & Charts",
          sublabel: "Deficit/Surplus & Trends",
          icon: BarChart3
        }
      ]
    },
    {
      label: "Safety & Directory",
      items: [
        {
          id: "food_safety" as AppPageTab,
          label: "Food Safety Lab",
          sublabel: "Grievances & Adulteration",
          icon: ShieldAlert,
          badge: isAdminLoggedIn ? "Admin" : undefined,
          badgeColor: "bg-red-100 text-red-700"
        },
        {
          id: "workflow_guide" as AppPageTab,
          label: "A-Z System Guide",
          sublabel: "How features work",
          icon: Sparkles
        }
      ]
    }
  ];

  const handleSelect = (tab: AppPageTab) => {
    onSelectTab(tab);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={onCloseMobileMenu}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/90 shadow-lg lg:shadow-none transition-all duration-300 ease-in-out ${
          collapsed ? "lg:w-20" : "lg:w-72"
        } ${mobileMenuOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => handleSelect("dashboard")}
            className="flex items-center gap-3 text-left group overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/25 shrink-0 group-hover:scale-105 transition-transform">
              AI
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <div className="leading-tight overflow-hidden whitespace-nowrap animate-fadeIn">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    AIFood<span className="text-emerald-500">.</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Pro AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Clean Food & Diet Suite
                </p>
              </div>
            )}
          </button>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {(!collapsed || mobileMenuOpen) && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    } ${collapsed && !mobileMenuOpen ? "justify-center" : ""}`}
                  >
                    <IconComponent
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive
                          ? "text-emerald-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />

                    {(!collapsed || mobileMenuOpen) && (
                      <div className="flex-1 text-left truncate flex items-center justify-between">
                        <div className="truncate">
                          <div className="leading-snug truncate">{item.label}</div>
                          {item.sublabel && (
                            <div className="text-[10px] text-slate-400 font-normal truncate">
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                        {item.badge && (
                          <span
                            className={`ml-1.5 px-2 py-0.5 text-[9px] rounded-full shrink-0 font-bold ${
                              item.badgeColor || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Active Indicator Bar on collapsed view */}
                    {collapsed && !mobileMenuOpen && isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors ${
              collapsed && !mobileMenuOpen ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              {(!collapsed || mobileMenuOpen) && (
                <span>{isDarkMode ? "Dark Theme" : "Light Theme"}</span>
              )}
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                {isDarkMode ? "Dark" : "Light"}
              </span>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors ${
                collapsed && !mobileMenuOpen ? "justify-center" : "justify-between"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                {(!collapsed || mobileMenuOpen) && (
                  <span>Language</span>
                )}
              </div>
              {(!collapsed || mobileMenuOpen) && (
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  {currentLanguage}
                </span>
              )}
            </button>

            {languageMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50">
                {LANGUAGE_OPTIONS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onChangeLanguage(l.id as AppLanguage);
                      setLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                      currentLanguage === l.id
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{l.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Login status */}
          {(!collapsed || mobileMenuOpen) ? (
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                    <span>{userName || "Guest User"}</span>
                    {isAdminLoggedIn && (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isAdminLoggedIn ? "Administrator" : isLoggedIn ? "Verified User" : "Demo Mode"}
                  </div>
                </div>
              </div>

              {isLoggedIn ? (
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={isLoggedIn ? onLogout : onOpenAuthModal}
              title={isLoggedIn ? "Logout" : "Sign In"}
              className="w-full flex justify-center py-2 text-slate-400 hover:text-emerald-500"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
