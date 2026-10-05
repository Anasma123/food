"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  TrendingDown,
  TrendingUp,
  Flame,
  Candy,
  Utensils,
  Award,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  Download,
  Eye,
  SlidersHorizontal,
  Clock,
  Sparkles,
  RotateCcw,
  Zap,
  Target,
  Scale,
  ShieldCheck,
  Check,
  Layers,
  LayoutGrid
} from "lucide-react";
import { AppLanguage } from "@/lib/translations";
import { DailyWorkoutLog } from "@/lib/diet-recommendations";

export interface MealLogItem {
  id: string;
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;
  date?: string;
  calories: number;
  sugar: number;
  protein: number;
  carbs: number;
  fat: number;
  safeForDiabetic: boolean;
  imageUrl?: string;
  status: "consumed" | "planned";
  consumedAt?: string;
  aiSummary?: string;
  recipeTip?: string;
  healthyAlternative?: string;
  glycemicIndex?: number;
}

export interface UserHealthProfile {
  name?: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  gender?: string;
  goal?: string;
  dietaryPreference?: string;
  dailyCalorieTarget: number;
  dailySugarLimitGrams: number;
  diabeticRiskLevel?: string;
}

interface DietFullAnalysisViewProps {
  meals: MealLogItem[];
  workouts: DailyWorkoutLog[];
  userProfile: UserHealthProfile;
  language?: AppLanguage;
  onSelectDate: (date: string) => void;
  onBackToOverview?: () => void;
}

export interface DayAnalysisSummary {
  date: string;
  formattedDate: string;
  dayName: string;
  consumedCalories: number;
  burnedCalories: number;
  netCalories: number;
  sugarGrams: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  dietScore: number;
  scoreGrade: string;
  mealsCount: number;
  mealNames: string[];
  workoutsCount: number;
  sugarSpike: boolean;
  targetMet: boolean;
}

export default function DietFullAnalysisView({
  meals,
  workouts,
  userProfile,
  language = "en",
  onSelectDate,
  onBackToOverview
}: DietFullAnalysisViewProps) {
  // Helper to format Date objects as YYYY-MM-DD
  const formatDateToIso = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayIso = useMemo(() => formatDateToIso(new Date()), []);

  // Default date range: Last 14 Days to Today
  const defaultStartIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 13);
    return formatDateToIso(d);
  }, []);

  const [startDate, setStartDate] = useState<string>(defaultStartIso);
  const [endDate, setEndDate] = useState<string>(todayIso);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [activeChartTab, setActiveChartTab] = useState<
    "overview" | "calories" | "sugar" | "deficit" | "macros" | "meals" | "score" | "glycemic"
  >("overview");
  const [hoveredDay, setHoveredDay] = useState<DayAnalysisSummary | null>(null);

  // Quick Preset ranges
  const applyPreset = (preset: "7d" | "14d" | "30d" | "month" | "all") => {
    const now = new Date();
    const end = formatDateToIso(now);
    setEndDate(end);

    if (preset === "7d") {
      const start = new Date();
      start.setDate(now.getDate() - 6);
      setStartDate(formatDateToIso(start));
    } else if (preset === "14d") {
      const start = new Date();
      start.setDate(now.getDate() - 13);
      setStartDate(formatDateToIso(start));
    } else if (preset === "30d") {
      const start = new Date();
      start.setDate(now.getDate() - 29);
      setStartDate(formatDateToIso(start));
    } else if (preset === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(formatDateToIso(start));
    } else if (preset === "all") {
      let oldest = defaultStartIso;
      meals.forEach((m) => {
        if (m.date && m.date < oldest) oldest = m.date;
      });
      workouts.forEach((w) => {
        if (w.date && w.date < oldest) oldest = w.date;
      });
      setStartDate(oldest);
    }
  };

  // Place 2 Reset Filter handler
  const handleResetFilter = () => {
    setStartDate(defaultStartIso);
    setEndDate(todayIso);
    setSortOrder("desc");
  };

  // Group meals and workouts by date
  const aggregatedDays: DayAnalysisSummary[] = useMemo(() => {
    const dateMap: Record<string, { meals: MealLogItem[]; workouts: DailyWorkoutLog[] }> = {};

    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    const effectiveStart = startObj <= endObj ? startObj : endObj;
    const effectiveEnd = startObj <= endObj ? endObj : startObj;

    const curr = new Date(effectiveStart);
    while (curr <= effectiveEnd) {
      const iso = formatDateToIso(curr);
      dateMap[iso] = { meals: [], workouts: [] };
      curr.setDate(curr.getDate() + 1);
    }

    meals.forEach((m) => {
      const mealDate = m.date || todayIso;
      if (dateMap[mealDate]) {
        if (m.status === "consumed" || !m.status) {
          dateMap[mealDate].meals.push(m);
        }
      }
    });

    workouts.forEach((w) => {
      const workoutDate = w.date || todayIso;
      if (dateMap[workoutDate]) {
        dateMap[workoutDate].workouts.push(w);
      }
    });

    const dayKeys = Object.keys(dateMap);
    const results: DayAnalysisSummary[] = dayKeys.map((dateStr) => {
      const entry = dateMap[dateStr];
      const consumedCal = entry.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      const burnedCal = entry.workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      const netCal = Math.max(0, consumedCal - burnedCal);
      const sugar = +(entry.meals.reduce((sum, m) => sum + (m.sugar || 0), 0)).toFixed(1);
      const protein = +(entry.meals.reduce((sum, m) => sum + (m.protein || 0), 0)).toFixed(1);
      const carbs = +(entry.meals.reduce((sum, m) => sum + (m.carbs || 0), 0)).toFixed(1);
      const fat = +(entry.meals.reduce((sum, m) => sum + (m.fat || 0), 0)).toFixed(1);

      let score = 75;
      if (consumedCal > 0) {
        const diff = Math.abs(netCal - userProfile.dailyCalorieTarget);
        if (diff < 200) score += 12;
        else if (diff < 400) score += 5;
        else score -= 10;

        if (sugar <= userProfile.dailySugarLimitGrams) score += 8;
        else score -= 12;

        if (entry.workouts.length > 0) score += 5;
      } else {
        score = 0;
      }
      const finalScore = consumedCal > 0 ? Math.min(100, Math.max(25, score)) : 0;

      let grade = "Unrecorded";
      if (finalScore >= 85) grade = "Grade A+ (Superb Balance)";
      else if (finalScore >= 75) grade = "Grade A (Optimal Target)";
      else if (finalScore >= 60) grade = "Grade B (Good Balance)";
      else if (finalScore > 0) grade = "Grade C (Attention Needed)";

      const dObj = new Date(dateStr + "T00:00:00");
      const dayName = dObj.toLocaleDateString("en-US", { weekday: "short" });
      const formattedDate = dObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const sugarSpike = sugar > userProfile.dailySugarLimitGrams;
      const targetMet = consumedCal > 0 && Math.abs(netCal - userProfile.dailyCalorieTarget) <= 300;

      return {
        date: dateStr,
        formattedDate,
        dayName,
        consumedCalories: consumedCal,
        burnedCalories: burnedCal,
        netCalories: netCal,
        sugarGrams: sugar,
        proteinGrams: protein,
        carbsGrams: carbs,
        fatGrams: fat,
        dietScore: finalScore,
        scoreGrade: grade,
        mealsCount: entry.meals.length,
        mealNames: entry.meals.map((m) => m.name),
        workoutsCount: entry.workouts.length,
        sugarSpike,
        targetMet
      };
    });

    results.sort((a, b) => {
      if (sortOrder === "desc") return b.date.localeCompare(a.date);
      return a.date.localeCompare(b.date);
    });

    return results;
  }, [startDate, endDate, meals, workouts, sortOrder, userProfile, todayIso]);

  // Period High-Level Statistics
  const periodStats = useMemo(() => {
    const daysWithData = aggregatedDays.filter((d) => d.consumedCalories > 0);
    const count = daysWithData.length || 1;

    const totalConsumed = daysWithData.reduce((acc, d) => acc + d.consumedCalories, 0);
    const totalBurned = daysWithData.reduce((acc, d) => acc + d.burnedCalories, 0);
    const totalNet = daysWithData.reduce((acc, d) => acc + d.netCalories, 0);
    const totalSugar = daysWithData.reduce((acc, d) => acc + d.sugarGrams, 0);
    const totalProtein = daysWithData.reduce((acc, d) => acc + d.proteinGrams, 0);
    const totalCarbs = daysWithData.reduce((acc, d) => acc + d.carbsGrams, 0);
    const totalFat = daysWithData.reduce((acc, d) => acc + d.fatGrams, 0);
    const totalScore = daysWithData.reduce((acc, d) => acc + d.dietScore, 0);

    const avgCalories = Math.round(totalConsumed / count);
    const avgNet = Math.round(totalNet / count);
    const avgSugar = +(totalSugar / count).toFixed(1);
    const avgProtein = +(totalProtein / count).toFixed(1);
    const avgCarbs = +(totalCarbs / count).toFixed(1);
    const avgFat = +(totalFat / count).toFixed(1);
    const avgScore = Math.round(totalScore / count);

    const spikeDaysCount = daysWithData.filter((d) => d.sugarSpike).length;
    const targetMetCount = daysWithData.filter((d) => d.targetMet).length;

    // Macro energy percentage (Protein=4kcal/g, Carbs=4kcal/g, Fat=9kcal/g)
    const totalMacroKcal = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9) || 1;
    const proteinPct = Math.round(((totalProtein * 4) / totalMacroKcal) * 100);
    const carbsPct = Math.round(((totalCarbs * 4) / totalMacroKcal) * 100);
    const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

    return {
      daysTracked: daysWithData.length,
      totalDaysInRange: aggregatedDays.length,
      avgCalories,
      avgNet,
      totalBurned,
      avgSugar,
      avgProtein,
      avgCarbs,
      avgFat,
      avgScore,
      spikeDaysCount,
      targetMetCount,
      proteinPct,
      carbsPct,
      fatPct
    };
  }, [aggregatedDays]);

  // Meal Timing & Type Distribution Stats (For Meal Donut Chart)
  const mealTypeStats = useMemo(() => {
    let breakfastCal = 0, breakfastCount = 0;
    let lunchCal = 0, lunchCount = 0;
    let dinnerCal = 0, dinnerCount = 0;
    let snackCal = 0, snackCount = 0;
    let totalMeals = 0;
    let diabeticSafeCount = 0;

    const filteredMeals = meals.filter((m) => {
      const mDate = m.date || todayIso;
      return mDate >= startDate && mDate <= endDate;
    });

    filteredMeals.forEach((m) => {
      totalMeals++;
      if (m.safeForDiabetic) diabeticSafeCount++;
      const cal = m.calories || 0;
      const type = (m.mealType || "Lunch").toLowerCase();
      if (type.includes("breakfast")) {
        breakfastCal += cal;
        breakfastCount++;
      } else if (type.includes("lunch")) {
        lunchCal += cal;
        lunchCount++;
      } else if (type.includes("dinner")) {
        dinnerCal += cal;
        dinnerCount++;
      } else {
        snackCal += cal;
        snackCount++;
      }
    });

    const totalMealCal = breakfastCal + lunchCal + dinnerCal + snackCal || 1;
    const breakfastPct = Math.round((breakfastCal / totalMealCal) * 100);
    const lunchPct = Math.round((lunchCal / totalMealCal) * 100);
    const dinnerPct = Math.round((dinnerCal / totalMealCal) * 100);
    const snackPct = Math.max(0, 100 - breakfastPct - lunchPct - dinnerPct);

    return {
      totalMeals,
      diabeticSafeCount,
      diabeticSafePct: totalMeals > 0 ? Math.round((diabeticSafeCount / totalMeals) * 100) : 100,
      breakfast: { calories: breakfastCal, count: breakfastCount, pct: breakfastPct },
      lunch: { calories: lunchCal, count: lunchCount, pct: lunchPct },
      dinner: { calories: dinnerCal, count: dinnerCount, pct: dinnerPct },
      snack: { calories: snackCal, count: snackCount, pct: snackPct },
    };
  }, [meals, startDate, endDate, todayIso]);

  // Chronological order for chart rendering (oldest -> newest for nice left-to-right graphs)
  const chartDays = useMemo(() => {
    return [...aggregatedDays].sort((a, b) => a.date.localeCompare(b.date));
  }, [aggregatedDays]);

  // Calorie Deficit / Surplus Analytics
  const deficitSurplusStats = useMemo(() => {
    let totalSurplusKcal = 0;
    let totalDeficitKcal = 0;
    let deficitDaysCount = 0;
    let surplusDaysCount = 0;

    chartDays.forEach((d) => {
      if (d.consumedCalories > 0) {
        const net = d.netCalories;
        const target = userProfile.dailyCalorieTarget;
        const diff = net - target;
        if (diff > 0) {
          totalSurplusKcal += diff;
          surplusDaysCount++;
        } else {
          totalDeficitKcal += Math.abs(diff);
          deficitDaysCount++;
        }
      }
    });

    const netCumulativeDeviation = totalSurplusKcal - totalDeficitKcal;
    const estimatedKgChange = +(netCumulativeDeviation / 7700).toFixed(2);

    return {
      totalSurplusKcal,
      totalDeficitKcal,
      deficitDaysCount,
      surplusDaysCount,
      netCumulativeDeviation,
      estimatedKgChange
    };
  }, [chartDays, userProfile.dailyCalorieTarget]);

  const maxCalorieInChart = useMemo(() => {
    const maxVal = Math.max(...chartDays.map((d) => Math.max(d.consumedCalories, userProfile.dailyCalorieTarget)));
    return Math.max(maxVal * 1.15, 2500);
  }, [chartDays, userProfile.dailyCalorieTarget]);

  const maxSugarInChart = useMemo(() => {
    const maxVal = Math.max(...chartDays.map((d) => d.sugarGrams));
    return Math.max(maxVal * 1.25, userProfile.dailySugarLimitGrams * 1.5, 35);
  }, [chartDays, userProfile.dailySugarLimitGrams]);

  // Labels based on language
  const isMalayalam = language === "ml" || language === "en_ml";
  const isHindi = language === "hi" || language === "en_hi";

  const labels = {
    title: isMalayalam ? "സമ്പൂർണ്ണ ഡയറ്റ് & ന്യൂട്രീഷ്യൻ വിശകലനം" : isHindi ? "संपूर्ण डाइट और पोषण विश्लेषण" : "Full Nutritional Analysis & Clinical Trends",
    subtitle: isMalayalam
      ? "തീയതി തിരിച്ചുള്ള സമ്പൂർണ്ണ കലോറി, പഞ്ചസാര, വ്യായാമം, മാക്രോ വിശകലന വിവരങ്ങൾ"
      : isHindi
      ? "दिनांक अनुसार संपूर्ण कैलोरी, चीनी, व्यायाम और मैक्रो विश्लेषण चार्ट"
      : "Comprehensive chronological diet intelligence, sugar spikes, exercise deficits, and clinical graphs",
    dateFilter: isMalayalam ? "തീയതി ക്രമീകരണം (Date Range)" : isHindi ? "दिनांक फ़िल्टर (Date Range)" : "Date Range Filter",
    from: isMalayalam ? "തുടക്കം (From):" : isHindi ? "प्रारंभ (From):" : "From:",
    to: isMalayalam ? "അവസാനം (To):" : isHindi ? "अंतिम (To):" : "To:",
    resetFilter: isMalayalam ? "റീസെറ്റ് / ക്ലിയർ" : isHindi ? "रीसेट / साफ़ करें" : "Reset / Clear Filter",
    backBtn: isMalayalam ? "← തിരികെ ഡാഷ്‌ബോർഡിലേക്ക്" : isHindi ? "← वापस डैशबोर्ड पर" : "← Back to Dashboard Overview",
    viewDayBtn: isMalayalam ? "ഈ ദിവസത്തെ വിവരങ്ങൾ കാണുക" : isHindi ? "यह दिन देखें" : "Inspect Day",
    allCharts: isMalayalam ? "എല്ലാ ഗ്രാഫുകളും (All Charts)" : isHindi ? "सभी चार्ट (All Charts)" : "All Charts Grid",
    calTrend: isMalayalam ? "കലോറി ബാർ ചാർട്ട് (Calories)" : isHindi ? "कैलोरी बार चार्ट (Calories)" : "Calorie Balance (Bar)",
    sugarTrend: isMalayalam ? "പഞ്ചസാര ബാർ ചാർട്ട് (Sugar)" : isHindi ? "चीनी बार चार्ट (Sugar)" : "Sugar & Spikes (Bar)",
    deficitTrend: isMalayalam ? "ഡെഫിസിറ്റ് / സർപ്ലസ് (Deficit/Surplus)" : isHindi ? "घाटा / अधिशेष (Deficit/Surplus)" : "Deficit / Surplus (Bar)",
    macroTrend: isMalayalam ? "മാക്രോ പൈ ചാർട്ട് (Macros Pie)" : isHindi ? "मैक्रो पाई चार्ट (Macros Pie)" : "Macro Energy (Pie)",
    mealTrend: isMalayalam ? "മീൽ ടൈമിംഗ് പൈ ചാർട്ട് (Meals Pie)" : isHindi ? "भोजन समय पाई चार्ट (Meals Pie)" : "Meal Types (Pie)",
    scoreTrend: isMalayalam ? "ഡയറ്റ് സ്കോർ ട്രെൻഡ് (Score Area)" : isHindi ? "डाइट स्कोर ट्रेंड (Score Area)" : "Diet Score (Trend)",
    glycemicTrend: isMalayalam ? "ഡയബറ്റിക് & ഗ്ലൈസെമിക് (Glycemic)" : isHindi ? "मधुमेह और ग्लाइसेमिक (Glycemic)" : "Glycemic Safety Matrix"
  };

  // SVG Calculations for Score Line Chart
  const scoreChartSvgData = useMemo(() => {
    const width = 640;
    const height = 180;
    const xPad = 35;
    const yPad = 25;
    const plotWidth = width - xPad * 2;
    const plotHeight = height - yPad * 2;

    const points = chartDays.map((d, idx) => {
      const x = xPad + (chartDays.length > 1 ? (idx / (chartDays.length - 1)) * plotWidth : plotWidth / 2);
      const score = Math.max(0, Math.min(100, d.dietScore));
      const y = height - yPad - (score / 100) * plotHeight;
      return { x, y, day: d, score };
    });

    const polylineStr = points.map((p) => `${p.x},${p.y}`).join(" ");
    const areaPathStr = points.length > 0
      ? `M ${points[0].x},${height - yPad} L ${polylineStr} L ${points[points.length - 1].x},${height - yPad} Z`
      : "";

    return { width, height, points, polylineStr, areaPathStr, yPad, xPad, plotWidth, plotHeight };
  }, [chartDays]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Header Bar with Back navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Analysis & Graphs Engine</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {periodStats.daysTracked} / {periodStats.totalDaysInRange} days logged
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {labels.title}
          </h2>
          <p className="text-xs text-slate-400">
            {labels.subtitle}
          </p>
        </div>

        {onBackToOverview && (
          <button
            onClick={onBackToOverview}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-emerald-500/40 shrink-0"
          >
            <span>{labels.backBtn}</span>
          </button>
        )}
      </div>

      {/* =================================================================== */}
      {/* PLACE 2: DATE RANGE SORTING & FILTER CONTROLS (WITH CLEAR / RESET)  */}
      {/* =================================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Date Range Inputs */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {labels.dateFilter}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-black/40 p-2 sm:p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-1.5 px-2">
                <span className="text-[11px] text-slate-400 font-medium shrink-0">{labels.from}</span>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-emerald-400 cursor-pointer"
                />
              </div>

              <span className="hidden sm:inline text-slate-500 font-bold">→</span>

              <div className="flex items-center justify-between sm:justify-start gap-1.5 px-2">
                <span className="text-[11px] text-slate-400 font-medium shrink-0">{labels.to}</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={todayIso}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Sort order toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Toggle Chronological Sorting Order"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{sortOrder === "desc" ? "Newest ⬇️" : "Oldest ⬆️"}</span>
              </button>

              {/* PLACE 2: RESET / CLEAR DATE FILTER BUTTON */}
              <button
                onClick={handleResetFilter}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-xs font-bold text-rose-300 hover:text-rose-200 transition-all cursor-pointer shadow-sm shadow-rose-500/10 shrink-0"
                title="Reset date filter and sort order to default (Last 14 Days, Newest First)"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{labels.resetFilter}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 w-full lg:w-auto">
            <span className="text-[11px] text-slate-400 font-medium mr-1 shrink-0">Presets:</span>
            {[
              { id: "7d", label: "7 Days" },
              { id: "14d", label: "14 Days" },
              { id: "30d", label: "30 Days" },
              { id: "month", label: "This Month" },
              { id: "all", label: "All Time" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id as any)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 transition-all cursor-pointer whitespace-nowrap text-slate-300 shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Period Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Consumed</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-white">{periodStats.avgCalories}</span>
              <span className="text-[10px] text-slate-400">kcal/d</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Budget: {userProfile.dailyCalorieTarget}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold block">Total Burned</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-cyan-300">-{periodStats.totalBurned}</span>
              <span className="text-[10px] text-slate-400">kcal</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Net Avg: {periodStats.avgNet}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-amber-400 uppercase font-semibold block">Avg Sugar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-black ${periodStats.avgSugar > userProfile.dailySugarLimitGrams ? "text-rose-400" : "text-amber-300"}`}>
                {periodStats.avgSugar}g
              </span>
              <span className="text-[10px] text-slate-400">/ {userProfile.dailySugarLimitGrams}g</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {periodStats.spikeDaysCount > 0 ? `⚠️ ${periodStats.spikeDaysCount} spike days` : "✓ Safe range"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-indigo-400 uppercase font-semibold block">Avg Protein</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-indigo-300">{periodStats.avgProtein}g</span>
              <span className="text-[10px] text-slate-400">/day</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">~{periodStats.proteinPct}% energy</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Target Compliance</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-emerald-400">
                {periodStats.daysTracked > 0 ? Math.round((periodStats.targetMetCount / periodStats.daysTracked) * 100) : 0}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{periodStats.targetMetCount} of {periodStats.daysTracked} days</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Avg Diet Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-emerald-400">{periodStats.avgScore}</span>
              <span className="text-[10px] text-slate-400">/100</span>
            </div>
            <span className="text-[10px] text-emerald-300/80 font-medium">
              {periodStats.avgScore >= 75 ? "Optimal Balance" : "Moderate Tracking"}
            </span>
          </div>
        </div>

        {/* Clinical Dietitian Assessment Note */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white">AI Clinical Dietitian Synopsis:</strong>
            <p className="text-slate-300 leading-relaxed">
              Between <span className="text-white font-mono">{startDate}</span> and <span className="text-white font-mono">{endDate}</span>, your daily average intake was <strong className="text-white">{periodStats.avgCalories} kcal</strong> against a personalized target of <strong className="text-emerald-400">{userProfile.dailyCalorieTarget} kcal</strong>.
              {periodStats.avgSugar <= userProfile.dailySugarLimitGrams ? (
                <span> Sugar compliance remained within the safe threshold at <strong className="text-amber-300">{periodStats.avgSugar}g/day</strong>, mitigating glycemic volatility.</span>
              ) : (
                <span> Average sugar intake exceeded safe WHO parameters on <strong className="text-rose-400">{periodStats.spikeDaysCount} days</strong>, increasing metabolic fatigue risk.</span>
              )}
              {periodStats.totalBurned > 0 && (
                <span> Exercise routines contributed <strong className="text-cyan-400">-{periodStats.totalBurned} kcal</strong> in cumulative expenditure, supporting your <strong className="capitalize">{(userProfile.goal || "maintenance").replace("_", " ")}</strong> objective.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RICH VISUAL GRAPHS & COMPREHENSIVE CHARTS SUITE                    */}
      {/* =================================================================== */}
      <div className="space-y-4">
        {/* Navigation Tabs for Charts */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto scrollbar-none max-w-full">
            <button
              onClick={() => setActiveChartTab("overview")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "overview"
                  ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{labels.allCharts}</span>
            </button>

            <button
              onClick={() => setActiveChartTab("calories")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "calories"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{labels.calTrend}</span>
            </button>

            <button
              onClick={() => setActiveChartTab("sugar")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "sugar"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Candy className="w-3.5 h-3.5" />
              <span>{labels.sugarTrend}</span>
            </button>

            <button
              onClick={() => setActiveChartTab("deficit")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "deficit"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{labels.deficitTrend}</span>
            </button>

            <button
              onClick={() => setActiveChartTab("macros")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "macros"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>{labels.macroTrend}</span>
            </button>

            <button
              onClick={() => setActiveChartTab("meals")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "meals"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{labels.mealTrend}</span>
            </button>

            <button
              onClick={() => setActiveChartTab("score")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "score"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{labels.scoreTrend}</span>
            </button>

            <button
              onClick={() => setActiveChartTab("glycemic")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeChartTab === "glycemic"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{labels.glycemicTrend}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Intake
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Workouts
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> WHO Limit
            </span>
          </div>
        </div>

        {/* Hover Inspection Banner */}
        {hoveredDay && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-black to-slate-900 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                {hoveredDay.formattedDate} ({hoveredDay.dayName})
              </span>
              <span className="text-slate-300">
                Intake: <strong className="text-white">{hoveredDay.consumedCalories} kcal</strong>
              </span>
              <span className="text-cyan-400">
                Burned: <strong>-{hoveredDay.burnedCalories} kcal</strong>
              </span>
              <span className="text-amber-300 font-mono">
                Sugar: <strong>{hoveredDay.sugarGrams}g</strong>
              </span>
              <span className="text-emerald-400 font-mono">
                Diet Score: <strong>{hoveredDay.dietScore}/100</strong>
              </span>
            </div>
            <button
              onClick={() => onSelectDate(hoveredDay.date)}
              className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30 font-bold transition-all cursor-pointer"
            >
              Open in Dashboard →
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 0: ALL CHARTS OVERVIEW GRID (BARS + PIES + TRENDS ALL AT ONCE) */}
        {/* =================================================================== */}
        {activeChartTab === "overview" && (
          <div className="space-y-6">
            {/* ROW 1: TWO PIE/DONUT CHARTS SIDE BY SIDE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PIE CHART 1: MACRONUTRIENT ENERGY DONUT */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">Pie Chart: Macronutrient Energy Split</h4>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Energy Ratio
                  </span>
                </div>
                {renderMacroDonut()}
              </div>

              {/* PIE CHART 2: MEAL TIMING DISTRIBUTION DONUT */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Pie Chart: Meal Time & Types Spread</h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {mealTypeStats.totalMeals} Meals
                  </span>
                </div>
                {renderMealTypeDonut()}
              </div>
            </div>

            {/* ROW 2: TWO BAR CHARTS SIDE BY SIDE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BAR CHART 1: CALORIE BALANCE */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Bar Chart: Calorie Balance</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Target: {userProfile.dailyCalorieTarget} kcal
                  </span>
                </div>
                {renderCalorieBarChart()}
              </div>

              {/* BAR CHART 2: SUGAR INTAKE & SPIKES */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Candy className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Bar Chart: Sugar Tracker vs 25g Limit</h4>
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono">
                    {periodStats.spikeDaysCount} Spikes
                  </span>
                </div>
                {renderSugarBarChart()}
              </div>
            </div>

            {/* ROW 3: METABOLIC DEFICIT/SURPLUS BAR & DIET SCORE AREA TREND */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BAR CHART 3: METABOLIC DEFICIT / SURPLUS */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Bar Chart: Energy Deficit / Surplus</h4>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono">
                    {deficitSurplusStats.deficitDaysCount} Deficit Days
                  </span>
                </div>
                {renderDeficitSurplusBarChart()}
              </div>

              {/* ANALYSIS CHART: DIET SCORE PROGRESSION TREND */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Analysis Chart: Daily Diet Score Trend</h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Avg: {periodStats.avgScore}/100
                  </span>
                </div>
                {renderScoreAreaChart()}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* INDIVIDUAL FULL-WIDTH TABS FOR DEEP ANALYSIS                        */}
        {/* =================================================================== */}
        {activeChartTab === "calories" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Daily Calorie Balance: Consumed vs Burned vs Target</h4>
                <p className="text-xs text-slate-400">Target Line: {userProfile.dailyCalorieTarget} kcal/day</p>
              </div>
            </div>
            {renderCalorieBarChart()}
          </div>
        )}

        {activeChartTab === "sugar" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Sugar Intake vs Clinical Limit (WHO: 25g/day)</h4>
                <p className="text-xs text-slate-400">Limit: {userProfile.dailySugarLimitGrams}g safe daily ceiling</p>
              </div>
            </div>
            {renderSugarBarChart()}
          </div>
        )}

        {activeChartTab === "deficit" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Daily Calorie Deficit vs Surplus Impact</h4>
                <p className="text-xs text-slate-400">Below target = Fat Burn Deficit; Above target = Energy Surplus</p>
              </div>
            </div>
            {renderDeficitSurplusBarChart()}
          </div>
        )}

        {activeChartTab === "macros" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Macronutrient Energy Balance (Pie Chart)</h4>
                <p className="text-xs text-slate-400">Cumulative energy distribution across selected date range</p>
              </div>
            </div>
            {renderMacroDonut()}

            {/* Stacked macro bar */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-indigo-400">Protein: {periodStats.proteinPct}% ({periodStats.avgProtein}g avg)</span>
                <span className="text-amber-400">Carbs: {periodStats.carbsPct}% ({periodStats.avgCarbs}g avg)</span>
                <span className="text-rose-400">Fats: {periodStats.fatPct}% ({periodStats.avgFat}g avg)</span>
              </div>
              <div className="w-full h-6 rounded-2xl bg-black/50 overflow-hidden flex border border-white/10 p-0.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-l-xl transition-all duration-500"
                  style={{ width: `${periodStats.proteinPct}%` }}
                />
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500"
                  style={{ width: `${periodStats.carbsPct}%` }}
                />
                <div
                  className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-r-xl transition-all duration-500"
                  style={{ width: `${periodStats.fatPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {activeChartTab === "meals" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Meal Timing & Chrono-Nutrition Distribution (Pie Chart)</h4>
                <p className="text-xs text-slate-400">Proportion of calories distributed across Breakfast, Lunch, Dinner, and Snacks</p>
              </div>
            </div>
            {renderMealTypeDonut()}
          </div>
        )}

        {activeChartTab === "score" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Daily Diet Score Progression (0 - 100 Area Trend)</h4>
                <p className="text-xs text-slate-400">Evaluates calorie budget, sugar safety limit, and workouts</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                Avg: {periodStats.avgScore} / 100
              </span>
            </div>
            {renderScoreAreaChart()}
          </div>
        )}

        {activeChartTab === "glycemic" && (
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Clinical Glycemic & Diabetic Safety Matrix</h4>
                <p className="text-xs text-slate-400">Insulin stability, glycemic index safety, and diabetic risk control</p>
              </div>
            </div>
            {renderGlycemicMatrix()}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* COMPREHENSIVE DAY-BY-DAY HISTORICAL LOG TABLE                       */}
      {/* =================================================================== */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Day-by-Day Historical Records ({aggregatedDays.length} Days)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &quot;Inspect Day&quot; on any date to load that exact day&apos;s food log and workouts in your Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Showing:</span>
            <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono">
              {startDate} ~ {endDate}
            </span>
          </div>
        </div>

        {/* Responsive Table / Cards */}
        <div className="sm:hidden text-[10px] text-slate-400 flex items-center justify-end gap-1 font-mono">
          <span>👈 Scroll table horizontally for all metrics 👉</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 pb-2">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Food Eaten</th>
                <th className="py-3 px-3">Consumed</th>
                <th className="py-3 px-3">Burned</th>
                <th className="py-3 px-3">Net Calories</th>
                <th className="py-3 px-3">Sugar (Limit: {userProfile.dailySugarLimitGrams}g)</th>
                <th className="py-3 px-3">Macros (P / C / F)</th>
                <th className="py-3 px-3">Diet Score</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {aggregatedDays.map((day) => {
                const isToday = day.date === todayIso;

                return (
                  <tr
                    key={day.date}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      isToday ? "bg-emerald-500/[0.04]" : ""
                    }`}
                  >
                    {/* Date */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white font-medium">{day.formattedDate}</strong>
                        {isToday && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            TODAY
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{day.dayName}</span>
                    </td>

                    {/* Food Eaten */}
                    <td className="py-3 px-3 max-w-xs">
                      {day.mealsCount > 0 ? (
                        <div>
                          <span className="font-semibold text-white">{day.mealsCount} Meals</span>
                          <p className="text-[10px] text-slate-400 truncate" title={day.mealNames.join(", ")}>
                            {day.mealNames.slice(0, 2).join(", ")}
                            {day.mealNames.length > 2 ? ` +${day.mealNames.length - 2} more` : ""}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No food logged</span>
                      )}
                    </td>

                    {/* Consumed */}
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {day.consumedCalories > 0 ? `${day.consumedCalories} kcal` : "-"}
                    </td>

                    {/* Burned */}
                    <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                      {day.burnedCalories > 0 ? `-${day.burnedCalories} kcal` : "-"}
                    </td>

                    {/* Net Calories */}
                    <td className="py-3 px-3 font-mono">
                      {day.consumedCalories > 0 ? (
                        <span className={day.netCalories > userProfile.dailyCalorieTarget ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                          {day.netCalories} kcal
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Sugar */}
                    <td className="py-3 px-3 font-mono">
                      {day.consumedCalories > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className={day.sugarSpike ? "text-rose-400 font-black" : "text-amber-300 font-medium"}>
                            {day.sugarGrams}g
                          </span>
                          {day.sugarSpike && (
                            <span className="text-[10px] text-rose-400 font-bold" title="Sugar spike warning!">
                              ⚠️ Spike
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Macros */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                      {day.consumedCalories > 0 ? (
                        <span>
                          <strong className="text-indigo-300">{day.proteinGrams}p</strong> •{" "}
                          <strong className="text-amber-300">{day.carbsGrams}c</strong> •{" "}
                          <strong className="text-rose-300">{day.fatGrams}f</strong>
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Diet Score */}
                    <td className="py-3 px-3">
                      {day.dietScore > 0 ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            day.dietScore >= 75
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : day.dietScore >= 50
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          }`}
                        >
                          {day.dietScore}/100
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">-</span>
                      )}
                    </td>

                    {/* Action: Open in Dashboard */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectDate(day.date);
                          if (onBackToOverview) onBackToOverview();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 text-slate-300 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{labels.viewDayBtn}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // SUB-RENDER FUNCTIONS FOR CHARTS
  // =========================================================================

  // 1. MACRONUTRIENT DONUT / PIE CHART
  function renderMacroDonut() {
    const r = 58;
    const c = 2 * Math.PI * r;
    const pLen = (periodStats.proteinPct / 100) * c;
    const cLen = (periodStats.carbsPct / 100) * c;
    const fLen = (periodStats.fatPct / 100) * c;

    const pOffset = 0;
    const cOffset = -pLen;
    const fOffset = -(pLen + cLen);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#818cf8"
              strokeWidth="20"
              strokeDasharray={`${pLen} ${c}`}
              strokeDashoffset={pOffset}
              className="transition-all duration-700"
            />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#fbbf24"
              strokeWidth="20"
              strokeDasharray={`${cLen} ${c}`}
              strokeDashoffset={cOffset}
              className="transition-all duration-700"
            />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth="20"
              strokeDasharray={`${fLen} ${c}`}
              strokeDashoffset={fOffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-black text-white">{periodStats.avgCalories}</span>
            <span className="text-[9px] text-slate-400 font-mono uppercase">kcal/day</span>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full mt-0.5">
              Macros Pie
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-indigo-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Protein</span>
                <span className="text-[10px] text-indigo-300 font-mono">{periodStats.avgProtein}g • {Math.round(periodStats.avgProtein * 4)} kcal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-indigo-300">{periodStats.proteinPct}%</span>
              <span className="text-[9px] text-slate-400 block">Goal: 15-25%</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Carbohydrates</span>
                <span className="text-[10px] text-amber-300 font-mono">{periodStats.avgCarbs}g • {Math.round(periodStats.avgCarbs * 4)} kcal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-amber-300">{periodStats.carbsPct}%</span>
              <span className="text-[9px] text-slate-400 block">Goal: 45-60%</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-rose-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Healthy Fats</span>
                <span className="text-[10px] text-rose-300 font-mono">{periodStats.avgFat}g • {Math.round(periodStats.avgFat * 9)} kcal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-rose-300">{periodStats.fatPct}%</span>
              <span className="text-[9px] text-slate-400 block">Goal: 20-30%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. MEAL TYPE & TIMING DONUT / PIE CHART
  function renderMealTypeDonut() {
    const r = 58;
    const c = 2 * Math.PI * r;
    const bLen = (mealTypeStats.breakfast.pct / 100) * c;
    const lLen = (mealTypeStats.lunch.pct / 100) * c;
    const dLen = (mealTypeStats.dinner.pct / 100) * c;
    const sLen = (mealTypeStats.snack.pct / 100) * c;

    const bOffset = 0;
    const lOffset = -bLen;
    const dOffset = -(bLen + lLen);
    const sOffset = -(bLen + lLen + dLen);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray={`${bLen} ${c}`}
              strokeDashoffset={bOffset}
              className="transition-all duration-700"
            />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="20"
              strokeDasharray={`${lLen} ${c}`}
              strokeDashoffset={lOffset}
              className="transition-all duration-700"
            />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#8b5cf6"
              strokeWidth="20"
              strokeDasharray={`${dLen} ${c}`}
              strokeDashoffset={dOffset}
              className="transition-all duration-700"
            />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#06b6d4"
              strokeWidth="20"
              strokeDasharray={`${sLen} ${c}`}
              strokeDashoffset={sOffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-black text-white">{mealTypeStats.totalMeals}</span>
            <span className="text-[9px] text-slate-400 font-mono uppercase">Total Meals</span>
            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full mt-0.5">
              Timing Pie
            </span>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Breakfast
              </span>
              <span className="text-xs font-black text-white">{mealTypeStats.breakfast.pct}%</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{mealTypeStats.breakfast.count} logs</span>
              <span>{mealTypeStats.breakfast.calories} kcal</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Lunch
              </span>
              <span className="text-xs font-black text-white">{mealTypeStats.lunch.pct}%</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{mealTypeStats.lunch.count} logs</span>
              <span>{mealTypeStats.lunch.calories} kcal</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Dinner
              </span>
              <span className="text-xs font-black text-white">{mealTypeStats.dinner.pct}%</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{mealTypeStats.dinner.count} logs</span>
              <span>{mealTypeStats.dinner.calories} kcal</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Snacks
              </span>
              <span className="text-xs font-black text-white">{mealTypeStats.snack.pct}%</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{mealTypeStats.snack.count} logs</span>
              <span>{mealTypeStats.snack.calories} kcal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CALORIE BALANCE BAR CHART
  function renderCalorieBarChart() {
    return (
      <div className="w-full">
        <div className="sm:hidden text-[10px] text-slate-400 flex items-center justify-end gap-1 mb-1 font-mono">
          <span>👈 Swipe dates horizontally 👉</span>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 pb-2">
          <div className="h-60 min-w-[500px] sm:min-w-0 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-white/10 relative">
            {/* Horizontal Target Line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-400/50 flex justify-end pr-2 text-[10px] text-emerald-400 font-mono z-10"
              style={{
                bottom: `${Math.min(95, (userProfile.dailyCalorieTarget / maxCalorieInChart) * 100)}%`
              }}
            >
              <span className="bg-[#0b1222]/90 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Target: {userProfile.dailyCalorieTarget} kcal
              </span>
            </div>

            {chartDays.map((day) => {
              const consumedHeight = Math.min(100, (day.consumedCalories / maxCalorieInChart) * 100);
              const burnedHeight = Math.min(60, (day.burnedCalories / maxCalorieInChart) * 100);
              const isOver = day.consumedCalories > userProfile.dailyCalorieTarget;

              return (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => onSelectDate(day.date)}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                >
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      className={`w-3/5 rounded-t-lg transition-all duration-300 group-hover:brightness-125 ${
                        isOver
                          ? "bg-gradient-to-t from-rose-600 to-rose-400"
                          : day.consumedCalories > 0
                          ? "bg-gradient-to-t from-emerald-600 to-teal-400"
                          : "bg-white/5"
                      }`}
                      style={{ height: `${Math.max(4, consumedHeight)}%` }}
                    />
                    {day.burnedCalories > 0 && (
                      <div
                        className="w-2/5 rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-300"
                        style={{ height: `${Math.max(4, burnedHeight)}%` }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2 group-hover:text-emerald-400 transition-colors">
                    {day.date.slice(8)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 4. SUGAR INTAKE & SPIKES BAR CHART
  function renderSugarBarChart() {
    return (
      <div className="w-full">
        <div className="sm:hidden text-[10px] text-slate-400 flex items-center justify-end gap-1 mb-1 font-mono">
          <span>👈 Swipe dates horizontally 👉</span>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 pb-2">
          <div className="h-60 min-w-[500px] sm:min-w-0 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-white/10 relative">
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400/60 flex justify-end pr-2 text-[10px] text-amber-400 font-mono z-10"
              style={{
                bottom: `${Math.min(95, (userProfile.dailySugarLimitGrams / maxSugarInChart) * 100)}%`
              }}
            >
              <span className="bg-[#0b1222]/90 px-1.5 py-0.5 rounded border border-amber-500/30">
                WHO Safe Limit: {userProfile.dailySugarLimitGrams}g
              </span>
            </div>

            {chartDays.map((day) => {
              const sugarHeight = Math.min(100, (day.sugarGrams / maxSugarInChart) * 100);
              const isSpike = day.sugarSpike;

              return (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => onSelectDate(day.date)}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 group-hover:brightness-125 ${
                      isSpike
                        ? "bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 shadow-lg shadow-rose-500/20"
                        : day.sugarGrams > 0
                        ? "bg-gradient-to-t from-emerald-600 to-teal-400"
                        : "bg-white/5"
                    }`}
                    style={{ height: `${Math.max(4, sugarHeight)}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 mt-2 group-hover:text-amber-400">
                    {day.date.slice(8)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 5. METABOLIC CALORIE DEFICIT / SURPLUS BAR CHART
  function renderDeficitSurplusBarChart() {
    const maxDeviation = 800;

    return (
      <div className="space-y-3">
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Cumulative Deviation:</span>
            <strong className={`ml-1.5 ${deficitSurplusStats.netCumulativeDeviation <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {deficitSurplusStats.netCumulativeDeviation > 0 ? `+${deficitSurplusStats.netCumulativeDeviation}` : deficitSurplusStats.netCumulativeDeviation} kcal
            </strong>
          </div>
          <span className="text-[11px] font-mono text-cyan-300">
            Est. Fat Equiv: {deficitSurplusStats.estimatedKgChange > 0 ? `+${deficitSurplusStats.estimatedKgChange}` : deficitSurplusStats.estimatedKgChange} kg
          </span>
        </div>

        <div className="w-full">
          <div className="sm:hidden text-[10px] text-slate-400 flex items-center justify-end gap-1 mb-1 font-mono">
            <span>👈 Swipe dates horizontally 👉</span>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 pb-2">
            <div className="h-48 min-w-[500px] sm:min-w-0 flex items-center gap-2 py-2 px-2 border-b border-white/10 relative">
              {/* Center 0 baseline */}
              <div className="absolute left-0 right-0 border-t border-white/20 top-1/2 z-10" />

              {chartDays.map((day) => {
                if (day.consumedCalories === 0) {
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center justify-center h-full">
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] font-mono text-slate-500 mt-auto">{day.date.slice(8)}</span>
                    </div>
                  );
                }

                const diff = day.netCalories - userProfile.dailyCalorieTarget;
                const isSurplus = diff > 0;
                const heightPct = Math.min(48, (Math.abs(diff) / maxDeviation) * 48);

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => onSelectDate(day.date)}
                    className="flex-1 flex flex-col items-center justify-between h-full group cursor-pointer relative"
                  >
                    {/* Top Half: Surplus */}
                    <div className="w-full flex-1 flex items-end justify-center">
                      {isSurplus && (
                        <div
                          className="w-full max-w-[24px] rounded-t bg-gradient-to-t from-amber-500 to-rose-500 transition-all group-hover:brightness-125"
                          style={{ height: `${Math.max(6, heightPct * 2)}%` }}
                          title={`Surplus: +${diff} kcal`}
                        />
                      )}
                    </div>

                    {/* Bottom Half: Deficit */}
                    <div className="w-full flex-1 flex items-start justify-center">
                      {!isSurplus && (
                        <div
                          className="w-full max-w-[24px] rounded-b bg-gradient-to-b from-cyan-500 to-emerald-500 transition-all group-hover:brightness-125"
                          style={{ height: `${Math.max(6, heightPct * 2)}%` }}
                          title={`Deficit: ${diff} kcal`}
                        />
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
                      {day.date.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. DIET SCORE AREA / LINE TREND CHART
  function renderScoreAreaChart() {
    return (
      <div className="w-full">
        <div className="sm:hidden text-[10px] text-slate-400 flex items-center justify-end gap-1 mb-1 font-mono">
          <span>👈 Swipe dates horizontally 👉</span>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 pb-2">
          <div className="h-60 min-w-[520px] sm:min-w-0 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${scoreChartSvgData.width} ${scoreChartSvgData.height}`}>
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Target Zone Horizontal Lines */}
              <line
                x1={scoreChartSvgData.xPad}
                y1={scoreChartSvgData.height - scoreChartSvgData.yPad - 0.75 * scoreChartSvgData.plotHeight}
                x2={scoreChartSvgData.width - scoreChartSvgData.xPad}
                y2={scoreChartSvgData.height - scoreChartSvgData.yPad - 0.75 * scoreChartSvgData.plotHeight}
                stroke="rgba(16, 185, 129, 0.4)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={scoreChartSvgData.width - scoreChartSvgData.xPad - 5}
                y={scoreChartSvgData.height - scoreChartSvgData.yPad - 0.75 * scoreChartSvgData.plotHeight - 4}
                fill="#10b981"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                Target (75+)
              </text>

              {/* Area under curve */}
              {scoreChartSvgData.areaPathStr && (
                <path d={scoreChartSvgData.areaPathStr} fill="url(#scoreAreaGradient)" />
              )}

              {/* Score line */}
              {scoreChartSvgData.polylineStr && (
                <polyline
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={scoreChartSvgData.polylineStr}
                />
              )}

              {/* Data Points */}
              {scoreChartSvgData.points.map((p) => (
                <g
                  key={p.day.date}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredDay(p.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => onSelectDate(p.day.date)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#0f172a"
                    stroke={p.score >= 75 ? "#10b981" : p.score >= 50 ? "#f59e0b" : "#f43f5e"}
                    strokeWidth="2.5"
                    className="transition-transform group-hover:scale-150"
                  />
                  <text
                    x={p.x}
                    y={scoreChartSvgData.height - 5}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {p.day.date.slice(8)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // 7. GLYCEMIC & CLINICAL MATRIX
  function renderGlycemicMatrix() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Diabetic-Safe Meal Ratio</span>
          </div>
          <div className="text-2xl font-black text-white">
            {mealTypeStats.diabeticSafePct}%
          </div>
          <p className="text-[11px] text-slate-300">
            {mealTypeStats.diabeticSafeCount} of {mealTypeStats.totalMeals} meals logged maintain a low glycemic impact with safe carbohydrate composition.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <Candy className="w-4 h-4" />
            <span>Sugar Spike Exposure</span>
          </div>
          <div className="text-2xl font-black text-white">
            {periodStats.spikeDaysCount} Days
          </div>
          <p className="text-[11px] text-slate-300">
            Days where total added sugar exceeded the WHO clinical recommendation of 25g/day.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
            <Activity className="w-4 h-4" />
            <span>Exercise Glycemic Clearance</span>
          </div>
          <div className="text-2xl font-black text-white">
            {periodStats.totalBurned} kcal
          </div>
          <p className="text-[11px] text-slate-300">
            Physical exertion accelerates glucose disposal via GLUT4 transporters, reducing blood sugar spikes.
          </p>
        </div>
      </div>
    );
  }
}
