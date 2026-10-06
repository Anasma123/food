"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Database,
  Search,
  Filter,
  Flame,
  Candy,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Droplets,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Scale
} from "lucide-react";
import { COMPREHENSIVE_FOOD_DATABASE, NutritionalItem } from "@/lib/data-science/datasets";

export default function FoodDatasetExplorerView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [diabeticOnly, setDiabeticOnly] = useState(false);
  const [highProteinOnly, setHighProteinOnly] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<NutritionalItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(36);

  const allNutritionItems = useMemo(() => {
    return COMPREHENSIVE_FOOD_DATABASE;
  }, []);

  useEffect(() => {
    setVisibleCount(36);
  }, [searchQuery, selectedCategory, diabeticOnly, highProteinOnly]);

  const filteredItems = useMemo(() => {
    return allNutritionItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dietRecommendation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesDiabetic = !diabeticOnly || item.safeForDiabetic;
      const matchesProtein = !highProteinOnly || item.protein >= 15;

      return matchesSearch && matchesCategory && matchesDiabetic && matchesProtein;
    });
  }, [allNutritionItems, searchQuery, selectedCategory, diabeticOnly, highProteinOnly]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Verified Nutrition & Food Science Dataset
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950">
              ICMR / NIN IFCT
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Kerala & Global Food Encyclopedia
          </h1>
          <p className="text-sm text-indigo-100 max-w-2xl leading-relaxed">
            Clinically verified nutrition datasets with accurate calories, glycemic index, diabetic safety, macro
            breakdown, and healthy alternatives for traditional Kerala and Indian dishes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <div className="text-2xl font-black text-white">{allNutritionItems.length.toLocaleString()}+</div>
            <div className="text-[10px] text-indigo-200 uppercase font-bold">Trained Foods</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search food by English or Malayalam name (e.g. Puttu, Porotta, Biryani, Dosa, Sadya)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiabeticOnly(!diabeticOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                diabeticOnly
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Diabetic Safe Only {diabeticOnly ? "✓" : ""}
            </button>
            <button
              onClick={() => setHighProteinOnly(!highProteinOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                highProteinOnly
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              High Protein (15g+) {highProteinOnly ? "✓" : ""}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: `All Items (${allNutritionItems.length})` },
            { id: "kerala_traditional", label: "🌴 Kerala Traditional" },
            { id: "indian_dishes", label: "🍛 Indian Regional" },
            { id: "fruits_veg", label: "🥗 Fruits & Produce" },
            { id: "grains_pulses", label: "🌾 Grains & Pulses" },
            { id: "packaged", label: "📦 Packaged Supermarket" },
            { id: "global_cuisine", label: "🌍 Global & Continental" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.slice(0, visibleCount).map((dish) => (
          <div
            key={dish.id}
            onClick={() => setSelectedItemDetail(dish)}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 group"
          >
            <div className="flex items-start gap-4">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block truncate">
                  {dish.category.replace("_", " ")}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 truncate">
                  {dish.name}
                </h3>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {dish.servingSize}
                </div>
              </div>
            </div>

            {/* Nutrients Row */}
            <div className="grid grid-cols-4 gap-2 text-center p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Kcal</span>
                <span className="font-bold text-orange-600">{dish.calories}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Protein</span>
                <span className="font-bold text-blue-600">{dish.protein}g</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Carbs</span>
                <span className="font-bold text-amber-600">{dish.carbs}g</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">GI</span>
                <span className="font-bold text-teal-600">{dish.glycemicIndex}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  dish.safeForDiabetic
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {dish.safeForDiabetic ? "✓ Diabetic Safe" : "⚠️ High GI Spike"}
              </span>
              <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination / Load More */}
      {filteredItems.length > visibleCount && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-slate-200 rounded-3xl p-5 shadow-sm gap-4">
          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{Math.min(visibleCount, filteredItems.length)}</strong> of <strong className="text-slate-800">{filteredItems.length.toLocaleString()}</strong> trained foods
          </div>
          <button
            onClick={() => setVisibleCount((prev) => prev + 36)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Load 36 More Dishes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal Detail View */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedItemDetail.imageUrl}
                  alt={selectedItemDetail.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedItemDetail.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedItemDetail.servingSize}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Calories</span>
                <span className="font-bold text-orange-600 text-sm">{selectedItemDetail.calories} kcal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Protein</span>
                <span className="font-bold text-blue-600 text-sm">{selectedItemDetail.protein}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Carbs</span>
                <span className="font-bold text-amber-600 text-sm">{selectedItemDetail.carbs}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Fat</span>
                <span className="font-bold text-pink-600 text-sm">{selectedItemDetail.fat}g</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-700 block mb-1">
                  Clinical Recommendation:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedItemDetail.dietRecommendation}
                </p>
              </div>

              {selectedItemDetail.healthyAlternative && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="font-bold block mb-1">Healthy Alternative:</span>
                  <p>{selectedItemDetail.healthyAlternative}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItemDetail(null)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
