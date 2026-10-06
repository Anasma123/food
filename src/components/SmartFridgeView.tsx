"use client";

import React, { useState, useMemo } from "react";
import {
  Refrigerator,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Clock,
  Flame,
  Candy,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChefHat,
  Search,
  RotateCcw,
  Check
} from "lucide-react";
import { FRIDGE_RECIPES_DATABASE, FridgeRecipe, matchFridgeRecipes } from "@/lib/data-science/datasets";
import { UserHealthProfile } from "./TruthInScannerView";

interface SmartFridgeViewProps {
  userProfile: UserHealthProfile;
  onLogMeal?: (meal: any) => void;
}

// Popular quick pantry items to tap & add
const POPULAR_PANTRY_ITEMS = [
  { name: "Eggs", category: "protein" },
  { name: "Onion", category: "veggie" },
  { name: "Tomato", category: "veggie" },
  { name: "Green Chili", category: "spice" },
  { name: "Curry Leaves", category: "spice" },
  { name: "Coconut Oil", category: "staple" },
  { name: "Chicken", category: "protein" },
  { name: "Fish", category: "protein" },
  { name: "Milk", category: "dairy" },
  { name: "Curd / Yogurt", category: "dairy" },
  { name: "Dal / Lentils", category: "staple" },
  { name: "Spinach / Cheera", category: "veggie" },
  { name: "Carrot", category: "veggie" },
  { name: "Beans", category: "veggie" },
  { name: "Cabbage", category: "veggie" },
  { name: "Rice", category: "staple" },
  { name: "Potato", category: "veggie" },
  { name: "Ginger", category: "spice" },
  { name: "Garlic", category: "spice" },
  { name: "Paneer", category: "dairy" }
];

export default function SmartFridgeView({ userProfile, onLogMeal }: SmartFridgeViewProps) {
  // Active ingredients inside fridge
  const [activeIngredients, setActiveIngredients] = useState<string[]>([
    "Eggs",
    "Onion",
    "Tomato",
    "Green Chili",
    "Curry Leaves",
    "Coconut Oil"
  ]);

  const [customInput, setCustomInput] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<FridgeRecipe | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);

  // Expiration tracker shelf items
  const [shelfItems, setShelfItems] = useState([
    { name: "Fresh Milk", daysLeft: 2, status: "warning" },
    { name: "Eggs (6 pack)", daysLeft: 12, status: "fresh" },
    { name: "Tomatoes", daysLeft: 4, status: "fresh" },
    { name: "Spinach", daysLeft: 1, status: "warning" },
    { name: "Curd / Dahi", daysLeft: 3, status: "fresh" }
  ]);

  // Generate recipes matching active ingredients
  const recipeMatchResult = useMemo(() => {
    return matchFridgeRecipes(activeIngredients);
  }, [activeIngredients]);

  // Set default selected recipe
  const currentRecipe = selectedRecipe || recipeMatchResult.matchedRecipes[0] || FRIDGE_RECIPES_DATABASE[0];

  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (activeIngredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) return;
    setActiveIngredients([...activeIngredients, trimmed]);
    setCustomInput("");
  };

  const handleRemoveIngredient = (name: string) => {
    setActiveIngredients(activeIngredients.filter((i) => i.toLowerCase() !== name.toLowerCase()));
  };

  // Text-to-Speech Voice Chef Assistant
  const handleToggleVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentRecipe) return;

    const speechText = `Now preparing ${currentRecipe.title}. Preparation time: ${currentRecipe.prepTimeMinutes} minutes. ${currentRecipe.instructions.join(". ")}. Chef's health tip: ${currentRecipe.chefTip}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleLogCurrentRecipe = () => {
    if (!currentRecipe) return;
    if (onLogMeal) {
      onLogMeal({
        id: `fridge_${Date.now()}`,
        name: currentRecipe.title,
        mealType: "Dinner",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        calories: currentRecipe.caloriesPerServing,
        sugar: currentRecipe.sugarGrams,
        protein: 16,
        carbs: 22,
        fat: 8,
        safeForDiabetic: currentRecipe.sugarGrams < 5,
        status: "consumed"
      });
      setCopiedRecipe(true);
      setTimeout(() => setCopiedRecipe(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-cyan-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
              <Refrigerator className="w-3.5 h-3.5" />
              Smart Fridge & Zero-Waste Chef
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
              Voice Assisted
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Pantry Inventory & Instant Recipe Synthesis
          </h1>
          <p className="text-sm text-cyan-50 max-w-2xl leading-relaxed">
            Select what you have in your fridge right now. AI formulates healthy, clinical meals with exact calories,
            macros, and reads them out step-by-step while you cook!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggleVoice}
            className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isSpeaking
                ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                : "bg-white hover:bg-slate-100 text-slate-900"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-600" />}
            <span>{isSpeaking ? "Stop Voice Chef" : "Read Recipe Aloud"}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fridge Ingredients & Shelf Tracker (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Ingredients Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Refrigerator className="w-4 h-4 text-teal-600" />
                <span>Available Ingredients ({activeIngredients.length})</span>
              </h3>
              <button
                onClick={() => setActiveIngredients([])}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddIngredient(customInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Type ingredient (e.g. Chicken, Spinach)..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Active Pills */}
            <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 rounded-2xl bg-slate-50 border border-slate-100">
              {activeIngredients.length === 0 ? (
                <span className="text-xs text-slate-400 italic m-auto">
                  No ingredients added yet. Tap popular items below!
                </span>
              ) : (
                activeIngredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-teal-100 text-teal-900 border border-teal-200"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveIngredient(item)}
                      className="text-teal-600 hover:text-rose-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Popular Items Quick Tap Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Tap to Add:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                {POPULAR_PANTRY_ITEMS.map((item) => {
                  const isAdded = activeIngredients.some(
                    (i) => i.toLowerCase() === item.name.toLowerCase()
                  );
                  return (
                    <button
                      key={item.name}
                      onClick={() =>
                        isAdded ? handleRemoveIngredient(item.name) : handleAddIngredient(item.name)
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isAdded
                          ? "bg-teal-600 text-white shadow-xs font-bold"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {item.name} {isAdded ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Expiration Shelf Alerts */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Fridge Expiration Shelf Tracker</span>
              </span>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                Zero Waste
              </span>
            </h3>

            <div className="space-y-2">
              {shelfItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      item.status === "warning"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.daysLeft === 1 ? "Expires Tomorrow!" : `${item.daysLeft} days remaining`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Recipe Generator & Cooking Assistant (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Matched Recipes List Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {recipeMatchResult.matchedRecipes.map((r, idx) => (
              <button
                key={r.id || idx}
                onClick={() => setSelectedRecipe(r)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentRecipe?.title === r.title
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>

          {/* Active Recipe Detail Card */}
          {currentRecipe && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <img
                    src={currentRecipe.imageUrl}
                    alt={currentRecipe.title}
                    className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      AI Formulated Meal
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      {currentRecipe.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {currentRecipe.prepTimeMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-orange-600">
                        <Flame className="w-3.5 h-3.5" />
                        {currentRecipe.caloriesPerServing} kcal
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-pink-600">
                        <Candy className="w-3.5 h-3.5" />
                        {currentRecipe.sugarGrams}g sugar
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleLogCurrentRecipe}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{copiedRecipe ? "Logged!" : "Log Eaten"}</span>
                  </button>
                </div>
              </div>

              {/* Matched vs Missing Ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    ✓ You Have ({currentRecipe.matchedIngredients.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentRecipe.matchedIngredients.map((ing, iIdx) => (
                      <span
                        key={iIdx}
                        className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    + Missing Seasonings to Elevate:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentRecipe.missingIngredientsToElevate.map((ing, iIdx) => (
                      <span
                        key={iIdx}
                        className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Cooking Instructions */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-teal-600" />
                  <span>Step-by-Step Instructions</span>
                </h3>
                <ol className="space-y-2.5">
                  {currentRecipe.instructions.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Chef Clinical Tip */}
              {currentRecipe.chefTip && (
                <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-start gap-3 text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-900 block">
                      Clinical Nutrition Tip:
                    </span>
                    <span className="text-cyan-800 mt-0.5 block">
                      {currentRecipe.chefTip}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
