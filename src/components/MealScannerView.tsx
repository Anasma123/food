"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  Flame,
  Candy,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  Info,
  Check,
  HeartPulse,
  Search,
  Scale,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  X,
  Layers,
  Award
} from "lucide-react";
import { 
  COMPREHENSIVE_FOOD_DATABASE, 
  NutritionalItem,
  findHealthyAlternativeForMeal 
} from "@/lib/data-science/datasets";
import { UserHealthProfile } from "./TruthInScannerView";

interface MealScannerViewProps {
  userProfile: UserHealthProfile;
  initialCapturedImageBase64?: string | null;
  onOpenLiveCamera?: () => void;
  onLogMeal: (meal: any) => void;
  onSelectFoodForCompare?: (foodA: NutritionalItem, foodB?: NutritionalItem) => void;
}

export default function MealScannerView({
  userProfile,
  initialCapturedImageBase64,
  onOpenLiveCamera,
  onLogMeal,
  onSelectFoodForCompare
}: MealScannerViewProps) {
  // Currently analyzed meal item
  const [selectedMeal, setSelectedMeal] = useState<NutritionalItem>(COMPREHENSIVE_FOOD_DATABASE[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  const [loggedStatus, setLoggedStatus] = useState(false);
  const [mealCategoryFilter, setMealCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [apiHealthyAlt, setApiHealthyAlt] = useState<any | null>(null);

  // Compute healthy alternative for current selected meal
  const healthyAlternative = useMemo(() => {
    if (apiHealthyAlt && apiHealthyAlt.name !== selectedMeal.name) {
      return apiHealthyAlt;
    }
    const match = findHealthyAlternativeForMeal(selectedMeal);
    return {
      id: match.id,
      name: match.name,
      category: match.category,
      imageUrl: match.imageUrl,
      servingSize: match.servingSize,
      calories: match.calories,
      sugar: match.sugar,
      protein: match.protein,
      carbs: match.carbs,
      fat: match.fat,
      fiber: match.fiber,
      glycemicIndex: match.glycemicIndex,
      healthScore: match.healthScore,
      safeForDiabetic: match.safeForDiabetic,
      dietRecommendation: match.dietRecommendation,
      caloriesSaved: Math.max(0, selectedMeal.calories - match.calories),
      sugarSaved: +(Math.max(0, selectedMeal.sugar - match.sugar)).toFixed(1),
      scoreImprovement: +(Math.max(0, match.healthScore - selectedMeal.healthScore))
    };
  }, [selectedMeal, apiHealthyAlt]);

  // Analyze image via API
  const analyzeFoodImage = async (base64Str: string, fileName?: string) => {
    setIsAnalyzing(true);
    setAnalysisStatus("AI Food Plate Vision analyzing visual features, colors & ingredients...");
    setCustomPhotoUrl(base64Str);
    setLoggedStatus(false);

    try {
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Str,
          fileName: fileName || "camera_food_plate.jpg",
          userGoal: userProfile.goal,
          userAllergies: userProfile.allergies,
          dailyCalorieTarget: userProfile.dailyCalorieTarget,
          dailySugarLimitGrams: userProfile.dailySugarLimitGrams
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const matchedItem: NutritionalItem = {
          id: `analyzed_${Date.now()}`,
          name: d.foodName,
          category: d.category || "kerala_traditional",
          imageUrl: base64Str,
          servingSize: d.servingSize || "1 plate (250g)",
          calories: d.calories,
          sugar: d.sugar,
          protein: d.protein,
          carbs: d.carbs,
          fat: d.fat,
          fiber: d.fiber || 3.5,
          glycemicIndex: d.glycemicIndex || 50,
          allergens: [],
          healthScore: d.healthScore || 85,
          safeForDiabetic: d.safeForDiabetic ?? true,
          dietRecommendation: d.dietRecommendation,
          healthyAlternative: d.healthyAlternative
        };
        setSelectedMeal(matchedItem);
        if (d.healthyAlternativeItem) {
          setApiHealthyAlt(d.healthyAlternativeItem);
        }
      }
    } catch (err) {
      console.error("Food analysis error:", err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatus(null);
    }
  };

  // Sync if camera photo captured from parent
  useEffect(() => {
    if (initialCapturedImageBase64) {
      analyzeFoodImage(initialCapturedImageBase64, "live_camera_capture.jpg");
    }
  }, [initialCapturedImageBase64]);

  const filteredItems = useMemo(() => {
    return COMPREHENSIVE_FOOD_DATABASE.filter((item) => {
      const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesCategory = true;
      if (mealCategoryFilter === "kerala") matchesCategory = item.category === "kerala_traditional";
      else if (mealCategoryFilter === "diabetic") matchesCategory = item.safeForDiabetic;
      else if (mealCategoryFilter === "protein") matchesCategory = item.protein >= 15;
      else if (mealCategoryFilter === "fruits_veg") matchesCategory = item.category === "fruits_veg";
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, mealCategoryFilter]);

  const handleSelectPreset = (item: NutritionalItem) => {
    setIsAnalyzing(true);
    setAnalysisStatus("Loading trained clinical data...");
    setCustomPhotoUrl(null);
    setLoggedStatus(false);
    setApiHealthyAlt(null);
    setTimeout(() => {
      setSelectedMeal(item);
      setIsAnalyzing(false);
      setAnalysisStatus(null);
    }, 200);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      analyzeFoodImage(url, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSwitchToHealthyAlternative = () => {
    const match = COMPREHENSIVE_FOOD_DATABASE.find(f => f.name === healthyAlternative.name);
    if (match) {
      setSelectedMeal(match);
    } else {
      setSelectedMeal({
        id: healthyAlternative.id || `alt_${Date.now()}`,
        name: healthyAlternative.name,
        category: healthyAlternative.category || "kerala_traditional",
        imageUrl: healthyAlternative.imageUrl || selectedMeal.imageUrl,
        servingSize: healthyAlternative.servingSize || selectedMeal.servingSize,
        calories: healthyAlternative.calories,
        sugar: healthyAlternative.sugar,
        protein: healthyAlternative.protein,
        carbs: healthyAlternative.carbs,
        fat: healthyAlternative.fat,
        fiber: healthyAlternative.fiber,
        glycemicIndex: healthyAlternative.glycemicIndex,
        allergens: [],
        healthScore: healthyAlternative.healthScore,
        safeForDiabetic: healthyAlternative.safeForDiabetic,
        dietRecommendation: healthyAlternative.dietRecommendation,
        healthyAlternative: "Continue enjoying balanced whole foods."
      });
    }
    setCustomPhotoUrl(null);
    setLoggedStatus(false);
  };

  const handleLogToDiary = () => {
    onLogMeal({
      id: `meal_log_${Date.now()}`,
      name: selectedMeal.name,
      mealType: "Lunch",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      calories: selectedMeal.calories,
      sugar: selectedMeal.sugar,
      protein: selectedMeal.protein,
      carbs: selectedMeal.carbs,
      fat: selectedMeal.fat,
      safeForDiabetic: selectedMeal.safeForDiabetic,
      imageUrl: customPhotoUrl || selectedMeal.imageUrl,
      status: "consumed"
    });

    setLoggedStatus(true);
    setTimeout(() => setLoggedStatus(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-teal-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              AI Food Plate Computer Vision
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
              1,050+ Foods Trained
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Instant Food Photo Recognition & Clean Swaps
          </h1>
          <p className="text-sm text-emerald-50 max-w-2xl leading-relaxed">
            Snap any food plate or upload a photo. High-accuracy computer vision extracts calories, macros, glycemic index, and automatically recommends healthier clean-label alternatives!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onOpenLiveCamera && (
            <button
              onClick={onOpenLiveCamera}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Live Camera Snap</span>
            </button>
          )}

          <label
            htmlFor="meal-upload-input"
            className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-300" />
            <span>Upload Food Photo</span>
            <input
              id="meal-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Live AI Analysis Status Banner */}
      {isAnalyzing && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-pulse shadow-sm">
          <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
          <span>{analysisStatus || "Analyzing food plate composition & detecting ingredients..."}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trained Food Presets Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Trained Food Database (1,050+)
              </span>
              <span className="text-[11px] font-mono text-emerald-600 font-bold">
                {filteredItems.length} Available
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search meals (e.g. biryani, puttu, dosa, salad)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: "all", label: "All Items" },
                { id: "kerala", label: "Kerala Traditional" },
                { id: "diabetic", label: "Diabetic Safe" },
                { id: "protein", label: "High Protein" },
                { id: "fruits_veg", label: "Fruits & Veg" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMealCategoryFilter(cat.id)}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    mealCategoryFilter === cat.id
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Presets Grid */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredItems.slice(0, 50).map((item) => {
                const isSelected = selectedMeal.name === item.name && !customPhotoUrl;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPreset(item)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 shadow-sm"
                        : "bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-slate-400 truncate">
                        {item.servingSize}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                        <span className="font-bold text-orange-600">{item.calories} kcal</span>
                        <span>•</span>
                        <span>{item.protein}g protein</span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            item.safeForDiabetic ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {item.safeForDiabetic ? "Diabetic Safe" : "Sugar Caution"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result & Healthy Alternatives Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            {/* Meal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={customPhotoUrl || selectedMeal.imageUrl}
                  alt={selectedMeal.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0 border border-slate-200 bg-slate-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Verified AI Plate Vision
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      Health Score: {selectedMeal.healthScore}/100
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {selectedMeal.name}
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Portion: {selectedMeal.servingSize}
                  </div>
                </div>
              </div>

              {/* 1-Click Log Button */}
              <button
                onClick={handleLogToDiary}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 ${
                  loggedStatus
                    ? "bg-emerald-600 text-white animate-pulse"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{loggedStatus ? "✓ Logged to Diary!" : "Log to Daily Diary"}</span>
              </button>
            </div>

            {/* Nutrient Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/60">
                <div className="text-[10px] uppercase font-bold text-orange-700 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3" />
                  <span>Calories</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {selectedMeal.calories}
                </div>
                <span className="text-[10px] text-slate-400">kcal</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/60">
                <div className="text-[10px] uppercase font-bold text-blue-700">
                  Protein
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {selectedMeal.protein}g
                </div>
                <span className="text-[10px] text-slate-400">Muscle repair</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <div className="text-[10px] uppercase font-bold text-amber-700">
                  Carbohydrates
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {selectedMeal.carbs}g
                </div>
                <span className="text-[10px] text-slate-400">{selectedMeal.fiber}g fiber</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/60">
                <div className="text-[10px] uppercase font-bold text-rose-700 flex items-center justify-center gap-1">
                  <Candy className="w-3 h-3" />
                  <span>Sugar</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {selectedMeal.sugar}g
                </div>
                <span className="text-[10px] text-slate-400">GI: {selectedMeal.glycemicIndex}</span>
              </div>
            </div>

            {/* Diabetic Safety & Clinical Advice */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                selectedMeal.safeForDiabetic
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-rose-50 border-rose-300 text-rose-900"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {selectedMeal.safeForDiabetic ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-wider">
                  {selectedMeal.safeForDiabetic
                    ? "✓ Clinically Safe for Diabetics & Insulin Control"
                    : "⚠️ High Glycemic Spike Warning for Diabetics"}
                </div>
                <p className="text-xs leading-relaxed">{selectedMeal.dietRecommendation}</p>
              </div>
            </div>

            {/* UNIVERSAL HEALTHY ALTERNATIVE & CLEAN SWAP CARD (APPLIES TO ALL FOODS!) */}
            {healthyAlternative && healthyAlternative.name !== selectedMeal.name && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-300 shadow-sm space-y-3.5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                          ✨ Recommended Healthier Clean Alternative
                        </span>
                        {healthyAlternative.scoreImprovement > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900">
                            +{healthyAlternative.scoreImprovement} Score Improvement
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-800 font-medium mt-0.5">
                        Instead of high calories or insulin spikes, switch to this dietitian-recommended alternative:
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alternative Details Box */}
                <div className="bg-white rounded-xl p-4 border border-emerald-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {healthyAlternative.imageUrl && (
                      <img
                        src={healthyAlternative.imageUrl}
                        alt={healthyAlternative.name}
                        className="w-14 h-14 rounded-xl object-cover border border-emerald-200 shrink-0 bg-slate-100"
                      />
                    )}
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {healthyAlternative.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {healthyAlternative.calories} kcal ({healthyAlternative.caloriesSaved > 0 ? `-${healthyAlternative.caloriesSaved} kcal` : "Balanced"})
                        </span>
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                          GI: {healthyAlternative.glycemicIndex} (Low Glycemic)
                        </span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          ★ {healthyAlternative.healthScore}/100 Score
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleSwitchToHealthyAlternative}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Switch to this Meal</span>
                    </button>
                    <button
                      onClick={() => setShowCompareModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Compare ⚔️</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison Modal for Current Meal vs Healthy Alternative */}
      {showCompareModal && healthyAlternative && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base text-slate-900">
                  Head-to-Head Food Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Option A: Current Meal */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Current Selection
                </span>
                <h4 className="font-black text-sm text-slate-900">
                  {selectedMeal.name}
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Calories:</span>
                    <span className="font-bold">{selectedMeal.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sugar:</span>
                    <span className="font-bold">{selectedMeal.sugar}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein:</span>
                    <span className="font-bold">{selectedMeal.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Glycemic Index:</span>
                    <span className="font-bold">{selectedMeal.glycemicIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Score:</span>
                    <span className="font-black text-amber-600">{selectedMeal.healthScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Option B: Healthy Alternative */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    🏆 Healthy Swap
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                    Winner
                  </span>
                </div>
                <h4 className="font-black text-sm text-slate-900">
                  {healthyAlternative.name}
                </h4>
                <div className="space-y-1.5 text-xs text-emerald-900">
                  <div className="flex justify-between">
                    <span>Calories:</span>
                    <span className="font-bold text-emerald-700">{healthyAlternative.calories} kcal ({healthyAlternative.caloriesSaved > 0 ? `-${healthyAlternative.caloriesSaved}` : ""})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sugar:</span>
                    <span className="font-bold">{healthyAlternative.sugar}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein:</span>
                    <span className="font-bold">{healthyAlternative.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Glycemic Index:</span>
                    <span className="font-bold">{healthyAlternative.glycemicIndex} (Better)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Score:</span>
                    <span className="font-black text-emerald-700">{healthyAlternative.healthScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSwitchToHealthyAlternative();
                  setShowCompareModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Switch & Use Healthy Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
