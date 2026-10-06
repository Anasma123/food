"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Scale,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Candy,
  Droplets,
  Layers,
  Sparkles,
  ChevronDown,
  X
} from "lucide-react";
import { PACKAGED_PRODUCTS_DATASET, COMPREHENSIVE_PACKAGED_DATABASE, PackagedProduct } from "@/lib/data-science/datasets";
import { calculateAIFoodScore, calculatePersonalizedMatch, UserHealthProfile } from "./TruthInScannerView";

interface AIFoodCompareViewProps {
  userProfile: UserHealthProfile;
  initialProductA?: PackagedProduct;
  initialProductB?: PackagedProduct;
}

export default function AIFoodCompareView({
  userProfile,
  initialProductA,
  initialProductB
}: AIFoodCompareViewProps) {
  const allCompareProducts = useMemo(() => {
    const map = new Map<string, PackagedProduct>();
    COMPREHENSIVE_PACKAGED_DATABASE.forEach((p) => map.set(p.barcode, p));
    PACKAGED_PRODUCTS_DATASET.forEach((p) => map.set(p.barcode, p));
    return Array.from(map.values());
  }, []);

  const [productA, setProductA] = useState<PackagedProduct>(() => initialProductA || PACKAGED_PRODUCTS_DATASET[0]);
  const [productB, setProductB] = useState<PackagedProduct>(() => initialProductB || PACKAGED_PRODUCTS_DATASET[1]);

  useEffect(() => {
    if (initialProductA) setProductA(initialProductA);
  }, [initialProductA]);

  useEffect(() => {
    if (initialProductB) setProductB(initialProductB);
  }, [initialProductB]);

  const scoreA = useMemo(() => calculateAIFoodScore(productA), [productA]);
  const scoreB = useMemo(() => calculateAIFoodScore(productB), [productB]);

  const matchA = useMemo(() => calculatePersonalizedMatch(productA, userProfile), [productA, userProfile]);
  const matchB = useMemo(() => calculatePersonalizedMatch(productB, userProfile), [productB, userProfile]);

  const winner = useMemo(() => {
    if (scoreA.score > scoreB.score) return { product: productA, isA: true, diff: +(scoreA.score - scoreB.score).toFixed(1) };
    if (scoreB.score > scoreA.score) return { product: productB, isA: false, diff: +(scoreB.score - scoreA.score).toFixed(1) };
    return null; // Tie
  }, [scoreA, scoreB, productA, productB]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              AIFood Head-to-Head Compare
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Compare Foods Side-by-Side
          </h1>
          <p className="text-sm text-orange-50 max-w-2xl leading-relaxed">
            Direct showdown between two packaged groceries. Compare AIFood scores, hidden sugars, synthetic
            chemicals, and see the clear, unbiased winner for your health.
          </p>
        </div>

        {winner && (
          <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center shrink-0">
            <div className="text-[10px] uppercase font-bold text-orange-100 flex items-center justify-center gap-1">
              <Award className="w-4 h-4 text-amber-200" />
              <span>Recommended Winner</span>
            </div>
            <div className="text-base font-black text-white mt-1">{winner.product.productName}</div>
            <div className="text-xs text-amber-200 font-bold mt-0.5">+{winner.diff} pts higher score</div>
          </div>
        )}
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product A Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Select Product A:
          </label>
          <select
            value={productA.barcode}
            onChange={(e) => {
              const found = allCompareProducts.find((p) => p.barcode === e.target.value);
              if (found) setProductA(found);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {allCompareProducts.map((p) => (
              <option key={p.barcode} value={p.barcode}>
                {p.brand} - {p.productName} ({p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Product B Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Select Product B:
          </label>
          <select
            value={productB.barcode}
            onChange={(e) => {
              const found = allCompareProducts.find((p) => p.barcode === e.target.value);
              if (found) setProductB(found);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {allCompareProducts.map((p) => (
              <option key={p.barcode} value={p.barcode}>
                {p.brand} - {p.productName} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item A Card */}
        <div
          className={`bg-white border rounded-3xl p-6 shadow-sm space-y-6 ${
            winner?.isA ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={productA.imageUrl}
              alt={productA.productName}
              className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100 shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {productA.brand}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {productA.productName}
              </h3>
              <div className="text-xs text-slate-500">{productA.category}</div>
            </div>
            {winner?.isA && (
              <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                Winner
              </span>
            )}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                ★ {scoreA.score}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Clean Score</div>
              <div className="text-xl font-black text-emerald-600 mt-1">
                {scoreA.cleanScore}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">MatchMeter</div>
              <div className="text-xl font-black text-teal-600 mt-1">
                {matchA.matchPct}%
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Calories per 100g</span>
              <span className="font-bold text-slate-800">{productA.caloriesPer100g} kcal</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Sugar per 100g</span>
              <span
                className={`font-bold ${
                  productA.sugarPer100g > productB.sugarPer100g ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {productA.sugarPer100g}g
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Salt / Sodium</span>
              <span className="font-bold text-slate-800">{productA.saltPer100g}g</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">NOVA Classification</span>
              <span className="font-bold text-slate-800">
                {productA.isUltraProcessed ? "NOVA 4 (Ultra-Processed)" : "NOVA 3"}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Additives Detected</span>
              <span className="font-bold text-slate-800">
                {productA.additives.length} chemicals
              </span>
            </div>
          </div>
        </div>

        {/* Item B Card */}
        <div
          className={`bg-white border rounded-3xl p-6 shadow-sm space-y-6 ${
            winner && !winner.isA ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={productB.imageUrl}
              alt={productB.productName}
              className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100 shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {productB.brand}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {productB.productName}
              </h3>
              <div className="text-xs text-slate-500">{productB.category}</div>
            </div>
            {winner && !winner.isA && (
              <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                Winner
              </span>
            )}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                ★ {scoreB.score}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Clean Score</div>
              <div className="text-xl font-black text-emerald-600 mt-1">
                {scoreB.cleanScore}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">MatchMeter</div>
              <div className="text-xl font-black text-teal-600 mt-1">
                {matchB.matchPct}%
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Calories per 100g</span>
              <span className="font-bold text-slate-800">{productB.caloriesPer100g} kcal</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Sugar per 100g</span>
              <span
                className={`font-bold ${
                  productB.sugarPer100g > productA.sugarPer100g ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {productB.sugarPer100g}g
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Salt / Sodium</span>
              <span className="font-bold text-slate-800">{productB.saltPer100g}g</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">NOVA Classification</span>
              <span className="font-bold text-slate-800">
                {productB.isUltraProcessed ? "NOVA 4 (Ultra-Processed)" : "NOVA 3"}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Additives Detected</span>
              <span className="font-bold text-slate-800">
                {productB.additives.length} chemicals
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
