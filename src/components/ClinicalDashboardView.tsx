"use client";

import React, { useState } from "react";
import {
  Flame,
  Candy,
  Droplets,
  Plus,
  Trash2,
  ScanBarcode,
  Camera,
  Refrigerator,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Activity,
  Heart,
  ChevronRight
} from "lucide-react";
import { UserHealthProfile } from "./AIFoodScannerView";

interface MealLogItem {
  id: string;
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;
  calories: number;
  sugar: number;
  protein: number;
  carbs: number;
  fat: number;
  safeForDiabetic: boolean;
  imageUrl?: string;
  status: "consumed" | "planned";
}

interface ClinicalDashboardViewProps {
  userProfile: UserHealthProfile;
  meals: MealLogItem[];
  waterGlasses: number;
  onUpdateWater: (count: number) => void;
  onDeleteMeal: (mealId: string) => void;
  onAddMeal: (meal: MealLogItem) => void;
  onNavigate: (tab: any) => void;
}

export default function ClinicalDashboardView({
  userProfile,
  meals,
  waterGlasses,
  onUpdateWater,
  onDeleteMeal,
  onAddMeal,
  onNavigate
}: ClinicalDashboardViewProps) {
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMealForm, setNewMealForm] = useState({
    name: "",
    mealType: "Lunch" as "Breakfast" | "Lunch" | "Dinner" | "Snack",
    calories: "350",
    protein: "15",
    carbs: "45",
    fat: "8",
    sugar: "3"
  });

  // Calculate consumed totals
  const consumedCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const consumedSugar = +meals.reduce((sum, m) => sum + (m.sugar || 0), 0).toFixed(1);
  const consumedProtein = +meals.reduce((sum, m) => sum + (m.protein || 0), 0).toFixed(1);
  const consumedCarbs = +meals.reduce((sum, m) => sum + (m.carbs || 0), 0).toFixed(1);
  const consumedFat = +meals.reduce((sum, m) => sum + (m.fat || 0), 0).toFixed(1);

  const calorieBudget = userProfile.dailyCalorieTarget;
  const remainingCalories = Math.max(0, calorieBudget - consumedCalories);
  const caloriePercent = Math.min(100, Math.round((consumedCalories / calorieBudget) * 100));

  const sugarCeiling = userProfile.dailySugarLimitGrams;
  const isSugarSpike = consumedSugar > sugarCeiling;

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealForm.name.trim()) return;

    onAddMeal({
      id: `manual_${Date.now()}`,
      name: newMealForm.name.trim(),
      mealType: newMealForm.mealType,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      calories: Number(newMealForm.calories) || 0,
      protein: Number(newMealForm.protein) || 0,
      carbs: Number(newMealForm.carbs) || 0,
      fat: Number(newMealForm.fat) || 0,
      sugar: Number(newMealForm.sugar) || 0,
      safeForDiabetic: Number(newMealForm.sugar) <= 5,
      status: "consumed"
    });

    setNewMealForm({
      name: "",
      mealType: "Lunch",
      calories: "350",
      protein: "15",
      carbs: "45",
      fat: "8",
      sugar: "3"
    });
    setShowAddMealModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Banner & Profile Greeting */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-teal-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Clinical Health & Energy Hub
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
              {userProfile.goal.replace("_", " ")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Welcome back, {userProfile.name}
          </h1>
          <p className="text-sm text-emerald-50 max-w-2xl leading-relaxed">
            Daily Budget: <strong className="text-white">{calorieBudget} kcal</strong> • Sugar Ceiling:{" "}
            <strong className="text-amber-200">{sugarCeiling}g</strong> • Diet:{" "}
            <strong className="text-cyan-200 capitalize">{userProfile.dietaryPreference}</strong>
          </p>
        </div>

        {/* Quick Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate("truthin_scanner")}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ScanBarcode className="w-3.5 h-3.5 text-teal-600" />
            <span>Barcode Scan</span>
          </button>
          <button
            onClick={() => onNavigate("meal_scanner")}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-300" />
            <span>Plate Vision</span>
          </button>
          <button
            onClick={() => onNavigate("smart_fridge")}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Refrigerator className="w-3.5 h-3.5 text-cyan-300" />
            <span>Fridge Chef</span>
          </button>
        </div>
      </div>

      {/* Main Stats Row: Calorie Balance + Macro Cards + Hydration */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calorie Gauge Card (5 cols) */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Daily Caloric Target
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Energy Balance
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black ${
                caloriePercent > 100
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {caloriePercent}% Budget
            </span>
          </div>

          {/* Calorie Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                Consumed: <strong className="text-slate-900 font-black">{consumedCalories}</strong> kcal
              </span>
              <span className="text-slate-500 font-semibold">
                Remaining: <strong className="text-emerald-600 font-black">{remainingCalories}</strong> kcal
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  caloriePercent > 100
                    ? "bg-rose-500"
                    : caloriePercent > 80
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
          </div>

          {/* Summary Mini Pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Goal Cap</span>
              <span className="font-extrabold text-slate-900">{calorieBudget}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Eaten</span>
              <span className="font-extrabold text-orange-600">{consumedCalories}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Meals</span>
              <span className="font-extrabold text-teal-600">{meals.length}</span>
            </div>
          </div>
        </div>

        {/* Macro Nutrient Split Cards (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Protein */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-600 block tracking-wider">
              Protein
            </span>
            <div className="text-2xl font-black text-slate-900">{consumedProtein}g</div>
            <p className="text-[11px] text-slate-400 leading-tight">Muscle repair & satiety</p>
          </div>

          {/* Carbs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wider">
              Carbohydrates
            </span>
            <div className="text-2xl font-black text-slate-900">{consumedCarbs}g</div>
            <p className="text-[11px] text-slate-400 leading-tight">Primary energy fuel</p>
          </div>

          {/* Fat */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-pink-600 block tracking-wider">
              Fats & Lipids
            </span>
            <div className="text-2xl font-black text-slate-900">{consumedFat}g</div>
            <p className="text-[11px] text-slate-400 leading-tight">Hormone balance</p>
          </div>

          {/* Sugar Spike Alert */}
          <div
            className={`border rounded-3xl p-5 shadow-sm space-y-2 ${
              isSugarSpike
                ? "bg-rose-50/70 border-rose-300"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-600 block tracking-wider">
                Sugar Load
              </span>
              {isSugarSpike && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
            </div>
            <div
              className={`text-2xl font-black ${
                isSugarSpike ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {consumedSugar}g
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Cap: {sugarCeiling}g ({isSugarSpike ? "Exceeded!" : "Safe"})
            </p>
          </div>
        </div>
      </div>

      {/* Hydration Tracker + Today's Meals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hydration Widget (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Daily Hydration Tracker
              </h3>
            </div>
            <span className="text-xs font-bold text-cyan-600">{waterGlasses} / 8 Glasses</span>
          </div>

          <div className="flex items-center justify-center gap-2 py-2">
            {Array.from({ length: 8 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onUpdateWater(idx + 1)}
                className={`w-7 h-10 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  idx < waterGlasses
                    ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/30 scale-105"
                    : "bg-slate-100 text-slate-400"
                }`}
                title={`Glass ${idx + 1}`}
              >
                💧
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => onUpdateWater(Math.max(0, waterGlasses - 1))}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
            >
              - 1 Glass
            </button>
            <button
              onClick={() => onUpdateWater(waterGlasses + 1)}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              + 1 Glass
            </button>
          </div>
        </div>

        {/* Today's Food Diary (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Today's Food Diary ({meals.length} Meals Eaten)
              </h3>
              <p className="text-xs text-slate-400">
                Log meals via camera scan, smart fridge, or custom entry
              </p>
            </div>
            <button
              onClick={() => setShowAddMealModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Meal</span>
            </button>
          </div>

          {/* Meals List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {meals.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <p className="text-xs">No meals logged for today yet.</p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => onNavigate("meal_scanner")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold"
                  >
                    Scan Plate Now
                  </button>
                  <button
                    onClick={() => onNavigate("truthin_scanner")}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold"
                  >
                    Scan Packaged Food
                  </button>
                </div>
              </div>
            ) : (
              meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {meal.imageUrl && (
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {meal.mealType} • {meal.time}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {meal.name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        <strong className="text-orange-600">{meal.calories} kcal</strong> •{" "}
                        {meal.protein}g protein • {meal.carbs}g carbs • {meal.sugar}g sugar
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    title="Delete meal"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Manual Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Log Custom Food Entry
              </h3>
              <button
                onClick={() => setShowAddMealModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMeal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerala Puttu, Omelette, Biryani..."
                  value={newMealForm.name}
                  onChange={(e) => setNewMealForm({ ...newMealForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Meal Timing
                  </label>
                  <select
                    value={newMealForm.mealType}
                    onChange={(e) => setNewMealForm({ ...newMealForm, mealType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={newMealForm.calories}
                    onChange={(e) => setNewMealForm({ ...newMealForm, calories: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={newMealForm.protein}
                    onChange={(e) => setNewMealForm({ ...newMealForm, protein: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={newMealForm.carbs}
                    onChange={(e) => setNewMealForm({ ...newMealForm, carbs: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Sugar (g)</label>
                  <input
                    type="number"
                    value={newMealForm.sugar}
                    onChange={(e) => setNewMealForm({ ...newMealForm, sugar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMealModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
