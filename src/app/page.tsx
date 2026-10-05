"use client";

import React, { useState, useEffect } from "react";
import {
  Utensils,
  Camera,
  ScanBarcode,
  Refrigerator,
  ShieldAlert,
  BrainCircuit,
  UserCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Flame,
  Candy,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  PlusCircle,
  TrendingDown,
  Info,
  Clock,
  Layers,
  ChefHat,
  Building2,
  Sliders,
  X,
  FileText,
  Activity,
  Home,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Eye,
  Menu,
  Check,
  HeartPulse,
  Database,
  Search,
  Lock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Calendar,
  ArrowUpDown,
  Filter,
  Trash2,
  Key,
  Shield,
  SlidersHorizontal,
  Mail,
  ExternalLink,
  Dumbbell,
  Droplets,
  Sun,
  Moon,
  Coffee,
  Award,
  Zap,
  RotateCcw,
  CheckSquare,
  Square,
  Upload,
  Compass,
  HelpCircle,
  Globe,
  BookOpen,
  BarChart3,
  ChevronLeft,
  MoreVertical,
  MoreHorizontal
} from "lucide-react";
import { 
  INDIAN_NUTRITION_DATASET, 
  PACKAGED_PRODUCTS_DATASET,
  VISION_TRAINING_IMAGES_DATASET,
  FRIDGE_RECIPES_DATABASE,
  AUTHORITIES_DIRECTORY
} from "@/lib/data-science/datasets";
import {
  generatePersonalizedMealPlan,
  generatePersonalizedWorkouts,
  RecommendedMeal,
  ExerciseRoutineItem,
  DailyWorkoutLog
} from "@/lib/diet-recommendations";
import CameraCaptureModal from "@/components/CameraCaptureModal";
import VoiceChefAssistant from "@/components/VoiceChefAssistant";
import AppWorkflowGuide from "@/components/AppWorkflowGuide";
import ExplainFeatureModal, { FeatureType } from "@/components/ExplainFeatureModal";
import PageGuideBanner from "@/components/PageGuideBanner";
import DietFullAnalysisView from "@/components/DietFullAnalysisView";
import { AppLanguage, LANGUAGE_OPTIONS, UI_TRANSLATIONS } from "@/lib/translations";

interface MealLogItem {
  id: string;
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;
  date?: string; // YYYY-MM-DD
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

export default function AIFoodProductionApp() {
  // Navigation State: Starts on "home" (Landing Page)
  const [activeTab, setActiveTab] = useState<
    "home" | "dashboard" | "meal_scanner" | "barcode_scanner" | "smart_fridge" | "food_safety" | "workflow_guide"
  >("home");

  // Explain Feature Modal State ("Explain this work" interactive multilingual popup)
  const [explainFeatureKey, setExplainFeatureKey] = useState<FeatureType | null>(null);

  // Global App Language State (English by default as primary; supports en, en_ml, en_hi, ml, hi)
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>("en");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const ui = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  // Exercise category filter state
  const [exerciseCategoryFilter, setExerciseCategoryFilter] = useState<string>("all");

  // Unified 3-dots navigation & tools menu drawer toggle
  const [moreDotsMenuOpen, setMoreDotsMenuOpen] = useState(false);

  // Authentication State (Common Login for everyone: Admin silu/12345 or Regular Users)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authPromptReason, setAuthPromptReason] = useState("");
  const [authErrorMsg, setAuthErrorMsg] = useState("");

  // Clean Initial Auth Form Data (Clean, non-sample placeholders)
  const [authFormData, setAuthFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "male",
    age: "",
    weightKg: "",
    heightCm: "",
    activityLevel: "light",
    goal: "weight_loss",
    dietaryPreference: "non_veg",
    allergies: "none"
  });

  // User Health Profile State (Calculated from Mifflin-St Jeor & TDEE)
  const [userProfile, setUserProfile] = useState({
    name: "User",
    email: "",
    age: 26,
    weightKg: 70,
    heightCm: 172,
    gender: "male",
    goal: "weight_loss",
    activityLevel: "light",
    dietaryPreference: "non_veg",
    allergies: "none",
    dailyCalorieTarget: 1850,
    dailySugarLimitGrams: 20.0
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  // WebRTC Live Camera Capture Modal State
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<"meal_scanner" | "barcode_scanner" | "smart_fridge">("meal_scanner");
  const [cameraTitle, setCameraTitle] = useState("Live Food Photo Capture");
  const [cameraOverlay, setCameraOverlay] = useState<"food" | "barcode" | "fridge">("food");

  // Email Dispatch Modal State for Government Authority
  const [emailDispatchModalOpen, setEmailDispatchModalOpen] = useState(false);
  const [dispatchedEmailReceipt, setDispatchedEmailReceipt] = useState<any>(null);

  // --------------------------------------------------------------------------
  // DATE HELPERS & CHRONOLOGICAL HISTORICAL LOG GENERATOR
  // --------------------------------------------------------------------------
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDayOffsetIso = (offset: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateFriendly = (isoDate: string): string => {
    if (!isoDate) return "";
    const today = getTodayDateStr();
    const yesterday = getDayOffsetIso(-1);
    const dObj = new Date(isoDate + "T00:00:00");
    const formatted = dObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    if (isoDate === today) return `Today (${formatted})`;
    if (isoDate === yesterday) return `Yesterday (${formatted})`;
    return formatted;
  };

  const generateDefaultHistoricalMeals = (): MealLogItem[] => {
    return [
      // Today (0)
      {
        id: "m_hist_0_1",
        name: "Kerala Puttu with Kadala Curry",
        mealType: "Breakfast",
        time: "08:30 AM",
        date: getDayOffsetIso(0),
        calories: 360,
        sugar: 3.2,
        protein: 12.5,
        carbs: 64,
        fat: 6.8,
        safeForDiabetic: true,
        imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
        status: "consumed",
        consumedAt: "08:40 AM",
        aiSummary: "Traditional Kerala steamed rice/ragi cylinder cake with black chickpea curry. Rich in complex dietary fiber."
      },
      {
        id: "m_hist_0_2",
        name: "Kattan Chaya (Black Tea)",
        mealType: "Breakfast",
        time: "09:00 AM",
        date: getDayOffsetIso(0),
        calories: 48,
        sugar: 10.2,
        protein: 0.1,
        carbs: 11.5,
        fat: 0,
        safeForDiabetic: false,
        imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
        status: "consumed",
        consumedAt: "09:05 AM"
      },
      {
        id: "m_hist_0_3",
        name: "Traditional Kerala Fish Curry Meal",
        mealType: "Lunch",
        time: "01:15 PM",
        date: getDayOffsetIso(0),
        calories: 520,
        sugar: 2.1,
        protein: 28.0,
        carbs: 68,
        fat: 14.5,
        safeForDiabetic: true,
        imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
        status: "consumed",
        consumedAt: "01:30 PM"
      },

      // Yesterday (-1)
      {
        id: "m_hist_1_1",
        name: "Appam with Vegetable Stew",
        mealType: "Breakfast",
        time: "08:15 AM",
        date: getDayOffsetIso(-1),
        calories: 290,
        sugar: 4.1,
        protein: 6.2,
        carbs: 48,
        fat: 7.8,
        safeForDiabetic: true,
        imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
        status: "consumed",
        consumedAt: "08:30 AM"
      },
      {
        id: "m_hist_1_2",
        name: "Green Tea with Lemon",
        mealType: "Breakfast",
        time: "09:30 AM",
        date: getDayOffsetIso(-1),
        calories: 5,
        sugar: 0.2,
        protein: 0.2,
        carbs: 1.0,
        fat: 0,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_1_3",
        name: "Grilled Chicken Breast with Brown Rice",
        mealType: "Lunch",
        time: "01:30 PM",
        date: getDayOffsetIso(-1),
        calories: 510,
        sugar: 1.8,
        protein: 42.0,
        carbs: 52,
        fat: 12.0,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_1_4",
        name: "Steamed Vegetable Salad",
        mealType: "Dinner",
        time: "08:00 PM",
        date: getDayOffsetIso(-1),
        calories: 140,
        sugar: 3.5,
        protein: 4.0,
        carbs: 22,
        fat: 3.0,
        safeForDiabetic: true,
        status: "consumed"
      },

      // 2 Days Ago (-2) -> Sugar spike day!
      {
        id: "m_hist_2_1",
        name: "Masala Dosa with Sambar",
        mealType: "Breakfast",
        time: "08:45 AM",
        date: getDayOffsetIso(-2),
        calories: 380,
        sugar: 3.5,
        protein: 8.5,
        carbs: 62,
        fat: 11.0,
        safeForDiabetic: false,
        status: "consumed"
      },
      {
        id: "m_hist_2_2",
        name: "Fresh Sugarcane & Mango Juice",
        mealType: "Snack",
        time: "11:30 AM",
        date: getDayOffsetIso(-2),
        calories: 220,
        sugar: 32.0,
        protein: 1.0,
        carbs: 54,
        fat: 0.2,
        safeForDiabetic: false,
        status: "consumed"
      },
      {
        id: "m_hist_2_3",
        name: "Kerala Moru Curry with Matta Rice",
        mealType: "Lunch",
        time: "01:45 PM",
        date: getDayOffsetIso(-2),
        calories: 460,
        sugar: 2.5,
        protein: 12.0,
        carbs: 76,
        fat: 9.5,
        safeForDiabetic: true,
        status: "consumed"
      },

      // 3 Days Ago (-3)
      {
        id: "m_hist_3_1",
        name: "Ragi Porridge with Crushed Almonds",
        mealType: "Breakfast",
        time: "08:00 AM",
        date: getDayOffsetIso(-3),
        calories: 280,
        sugar: 4.8,
        protein: 9.2,
        carbs: 45,
        fat: 6.5,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_3_2",
        name: "Ayala (Mackerel) Curry with Rice",
        mealType: "Lunch",
        time: "01:00 PM",
        date: getDayOffsetIso(-3),
        calories: 490,
        sugar: 1.4,
        protein: 34.0,
        carbs: 58,
        fat: 13.5,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_3_3",
        name: "Sprouted Moong Salad",
        mealType: "Dinner",
        time: "07:45 PM",
        date: getDayOffsetIso(-3),
        calories: 190,
        sugar: 2.1,
        protein: 14.0,
        carbs: 28,
        fat: 2.0,
        safeForDiabetic: true,
        status: "consumed"
      },

      // 4 Days Ago (-4)
      {
        id: "m_hist_4_1",
        name: "Idli with Coconut Sambar",
        mealType: "Breakfast",
        time: "08:30 AM",
        date: getDayOffsetIso(-4),
        calories: 240,
        sugar: 2.6,
        protein: 7.0,
        carbs: 46,
        fat: 2.5,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_4_2",
        name: "Traditional Kerala Feast / Sadya",
        mealType: "Lunch",
        time: "01:30 PM",
        date: getDayOffsetIso(-4),
        calories: 680,
        sugar: 14.5,
        protein: 16.0,
        carbs: 110,
        fat: 18.0,
        safeForDiabetic: false,
        status: "consumed"
      },
      {
        id: "m_hist_4_3",
        name: "Spiced Buttermilk (Sambharam)",
        mealType: "Snack",
        time: "04:30 PM",
        date: getDayOffsetIso(-4),
        calories: 45,
        sugar: 1.1,
        protein: 2.5,
        carbs: 4.5,
        fat: 1.8,
        safeForDiabetic: true,
        status: "consumed"
      },

      // 5 Days Ago (-5)
      {
        id: "m_hist_5_1",
        name: "Oatmeal with Walnuts and Chia",
        mealType: "Breakfast",
        time: "08:15 AM",
        date: getDayOffsetIso(-5),
        calories: 310,
        sugar: 5.2,
        protein: 11.0,
        carbs: 44,
        fat: 9.5,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_5_2",
        name: "Grilled Paneer & Quinoa Bowl",
        mealType: "Lunch",
        time: "01:15 PM",
        date: getDayOffsetIso(-5),
        calories: 480,
        sugar: 3.8,
        protein: 24.0,
        carbs: 52,
        fat: 18.0,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_5_3",
        name: "Clear Vegetable Broth",
        mealType: "Dinner",
        time: "07:30 PM",
        date: getDayOffsetIso(-5),
        calories: 95,
        sugar: 2.0,
        protein: 3.5,
        carbs: 16,
        fat: 1.0,
        safeForDiabetic: true,
        status: "consumed"
      },

      // 6 Days Ago (-6)
      {
        id: "m_hist_6_1",
        name: "Steamed Kozhukkatta",
        mealType: "Breakfast",
        time: "08:45 AM",
        date: getDayOffsetIso(-6),
        calories: 260,
        sugar: 8.5,
        protein: 4.2,
        carbs: 52,
        fat: 3.8,
        safeForDiabetic: false,
        status: "consumed"
      },
      {
        id: "m_hist_6_2",
        name: "Boiled Matta Rice with Dal Tadka & Cabbage Thoran",
        mealType: "Lunch",
        time: "01:30 PM",
        date: getDayOffsetIso(-6),
        calories: 490,
        sugar: 2.4,
        protein: 15.0,
        carbs: 82,
        fat: 8.5,
        safeForDiabetic: true,
        status: "consumed"
      },
      {
        id: "m_hist_6_3",
        name: "Cucumber and Tomato Slices",
        mealType: "Dinner",
        time: "08:00 PM",
        date: getDayOffsetIso(-6),
        calories: 65,
        sugar: 2.8,
        protein: 2.0,
        carbs: 12,
        fat: 0.5,
        safeForDiabetic: true,
        status: "consumed"
      }
    ];
  };

  const generateDefaultHistoricalWorkouts = (): DailyWorkoutLog[] => {
    return [
      { id: "w_h_0", title: "Brisk Outdoor Walking", durationMinutes: 30, caloriesBurned: 140, completedAt: "07:15 AM", date: getDayOffsetIso(0) },
      { id: "w_h_1", title: "Morning Hatha Yoga & Stretching", durationMinutes: 25, caloriesBurned: 110, completedAt: "06:45 AM", date: getDayOffsetIso(-1) },
      { id: "w_h_2", title: "Cycling & Cardio Burn", durationMinutes: 35, caloriesBurned: 220, completedAt: "05:30 PM", date: getDayOffsetIso(-2) },
      { id: "w_h_3", title: "Brisk Walking & Core", durationMinutes: 30, caloriesBurned: 135, completedAt: "07:00 AM", date: getDayOffsetIso(-3) },
      { id: "w_h_4", title: "Full Body Circuit Training", durationMinutes: 30, caloriesBurned: 210, completedAt: "06:30 PM", date: getDayOffsetIso(-4) },
      { id: "w_h_5", title: "Evening Recovery Walk", durationMinutes: 30, caloriesBurned: 125, completedAt: "06:15 PM", date: getDayOffsetIso(-5) },
      { id: "w_h_6", title: "Jogging & Interval Steps", durationMinutes: 25, caloriesBurned: 180, completedAt: "06:45 AM", date: getDayOffsetIso(-6) }
    ];
  };

  // Persistent session loader
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aifood_user_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUserProfile(parsed);
          setIsLoggedIn(true);
        } catch (e) {
          console.error("Session load error:", e);
        }
      }

      const adminFlag = localStorage.getItem("aifood_is_admin");
      if (adminFlag === "true") {
        setIsAdminLoggedIn(true);
      }

      const savedMeals = localStorage.getItem("aifood_logged_meals");
      if (savedMeals) {
        try {
          const parsed = JSON.parse(savedMeals);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTodayMeals(parsed.map((m: any) => ({ ...m, date: m.date || getTodayDateStr() })));
          } else {
            const defaults = generateDefaultHistoricalMeals();
            setTodayMeals(defaults);
            localStorage.setItem("aifood_logged_meals", JSON.stringify(defaults));
          }
        } catch (e) {
          console.error("Meals load error:", e);
        }
      } else {
        const defaults = generateDefaultHistoricalMeals();
        setTodayMeals(defaults);
        localStorage.setItem("aifood_logged_meals", JSON.stringify(defaults));
      }

      const savedWorkouts = localStorage.getItem("aifood_logged_workouts");
      if (savedWorkouts) {
        try {
          const parsedW = JSON.parse(savedWorkouts);
          if (Array.isArray(parsedW) && parsedW.length > 0) {
            setTodayWorkouts(parsedW.map((w: any) => ({ ...w, date: w.date || getTodayDateStr() })));
          } else {
            const defaultWorkouts = generateDefaultHistoricalWorkouts();
            setTodayWorkouts(defaultWorkouts);
            localStorage.setItem("aifood_logged_workouts", JSON.stringify(defaultWorkouts));
          }
        } catch (e) {
          console.error("Workouts load error:", e);
        }
      } else {
        const defaultWorkouts = generateDefaultHistoricalWorkouts();
        setTodayWorkouts(defaultWorkouts);
        localStorage.setItem("aifood_logged_workouts", JSON.stringify(defaultWorkouts));
      }

      const savedWater = localStorage.getItem("aifood_water_count");
      if (savedWater) {
        setWaterGlassesCount(Number(savedWater) || 4);
      }

      const savedLang = localStorage.getItem("aifood_app_language") as AppLanguage;
      if (savedLang && ["en", "en_ml", "en_hi", "ml", "hi"].includes(savedLang)) {
        setCurrentLanguage(savedLang);
      }
    }
  }, []);

  const changeLanguage = (newLang: AppLanguage) => {
    setCurrentLanguage(newLang);
    setLanguageDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("aifood_app_language", newLang);
    }
    const langLabels: Record<AppLanguage, string> = {
      en: "English (Default Primary)",
      en_ml: "English + Malayalam (മലയാളം)",
      en_hi: "English + Hindi (हिन्दी)",
      ml: "മലയാളം (Pure Malayalam)",
      hi: "हिन्दी (Pure Hindi)"
    };
    triggerToast(`🌐 Language set to: ${langLabels[newLang]}!`);
  };

  // Strict Navigation Guard: Function access requires registration/login (except Home and Workflow Guide)
  const navigateTab = (targetTab: "home" | "dashboard" | "meal_scanner" | "barcode_scanner" | "smart_fridge" | "food_safety" | "workflow_guide") => {
    if (targetTab === "home" || targetTab === "workflow_guide") {
      setActiveTab(targetTab);
      return;
    }

    if (!isLoggedIn) {
      setAuthMode("register");
      const featureNames: Record<string, string> = {
        dashboard: "Diet Dashboard & Sugar Tracker",
        meal_scanner: "AI Meal Photo Recognition",
        barcode_scanner: "Packaged Food & Additives Scanner",
        smart_fridge: "Smart Fridge AI Recipe Chef",
        food_safety: "Food Safety Grievance Portal"
      };
      setAuthPromptReason(`To use the ${featureNames[targetTab] || "app features"}, please register your health details first so AI can prepare your personalized calorie budget and safety recommendations!`);
      setAuthModalOpen(true);
      return;
    }

    setActiveTab(targetTab);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("aifood_user_session");
      localStorage.removeItem("aifood_is_admin");
      localStorage.removeItem("aifood_logged_workouts");
      localStorage.removeItem("aifood_water_count");
    }
    setShowProfileModal(false);
    setActiveTab("home");
  };

  // --------------------------------------------------------------------------
  // DIET DASHBOARD: TIME-RANGE, SUB-TABS, WORKOUTS & MEAL STATUS STATE
  // --------------------------------------------------------------------------
  const [dashboardTimeframe, setDashboardTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [dietDashboardSubTab, setDietDashboardSubTab] = useState<"overview" | "recommendations" | "routine_exercise" | "food_log" | "full_analysis">("overview");
  const [selectedDashboardDate, setSelectedDashboardDate] = useState<string>(getTodayDateStr());

  const handleNavigateDay = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setSelectedDashboardDate(getTodayDateStr());
      return;
    }
    const parts = selectedDashboardDate.split("-");
    const curr = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (direction === "prev") {
      curr.setDate(curr.getDate() - 1);
    } else {
      curr.setDate(curr.getDate() + 1);
    }
    const year = curr.getFullYear();
    const month = String(curr.getMonth() + 1).padStart(2, "0");
    const day = String(curr.getDate()).padStart(2, "0");
    setSelectedDashboardDate(`${year}-${month}-${day}`);
  };
  const [mealSortBy, setMealSortBy] = useState<"time" | "calories_desc" | "calories_asc" | "sugar_desc" | "sugar_asc">("time");
  const [mealFilterType, setMealFilterType] = useState<"all" | "consumed_only" | "planned_only" | "Breakfast" | "Lunch" | "Dinner" | "Snack">("all");
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedMealDetailModal, setSelectedMealDetailModal] = useState<MealLogItem | null>(null);
  const [dashboardToastMsg, setDashboardToastMsg] = useState("");

  const [customMealForm, setCustomMealForm] = useState({
    name: "",
    mealType: "Breakfast" as "Breakfast" | "Lunch" | "Dinner" | "Snack",
    calories: "",
    sugar: "",
    protein: "",
    carbs: "",
    fat: "",
    status: "consumed" as "consumed" | "planned"
  });

  const [todayMeals, setTodayMeals] = useState<MealLogItem[]>([]);
  const [todayWorkouts, setTodayWorkouts] = useState<DailyWorkoutLog[]>([]);
  const [waterGlassesCount, setWaterGlassesCount] = useState<number>(4);

  const [customWorkoutForm, setCustomWorkoutForm] = useState({
    title: "Brisk Outdoor Walking",
    durationMinutes: 30,
    caloriesBurned: 140
  });

  const saveMealsToStorage = (meals: MealLogItem[]) => {
    setTodayMeals(meals);
    if (typeof window !== "undefined") {
      localStorage.setItem("aifood_logged_meals", JSON.stringify(meals));
    }
  };

  const saveWorkoutsToStorage = (workouts: DailyWorkoutLog[]) => {
    setTodayWorkouts(workouts);
    if (typeof window !== "undefined") {
      localStorage.setItem("aifood_logged_workouts", JSON.stringify(workouts));
    }
  };

  const saveWaterToStorage = (count: number) => {
    const validCount = Math.max(0, Math.min(20, count));
    setWaterGlassesCount(validCount);
    if (typeof window !== "undefined") {
      localStorage.setItem("aifood_water_count", String(validCount));
    }
  };

  // Trigger temporary toast notification
  const triggerToast = (msg: string) => {
    setDashboardToastMsg(msg);
    setTimeout(() => {
      setDashboardToastMsg("");
    }, 4500);
  };

  // MARK A MEAL AS OFFICIALLY CONSUMED / EATEN ("Done")
  const handleMarkMealConsumed = (id: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const targetMeal = todayMeals.find(m => m.id === id);
    const updated = todayMeals.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: "consumed" as const,
          consumedAt: nowTime
        };
      }
      return m;
    });
    saveMealsToStorage(updated);
    triggerToast(`✓ Confirmed! You ate "${targetMeal?.name || "this meal"}". Added ${targetMeal?.calories || 0} kcal to your consumed total.`);
  };

  // TOGGLE MEAL STATUS BETWEEN CONSUMED AND PLANNED
  const handleToggleMealStatus = (id: string) => {
    const updated = todayMeals.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === "consumed" ? "planned" : "consumed";
        return {
          ...m,
          status: nextStatus as any,
          consumedAt: nextStatus === "consumed" ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined
        };
      }
      return m;
    });
    saveMealsToStorage(updated);
  };

  // UNIFIED CONSUMPTION FINAL DECISION MODAL STATE
  const [consumptionDecisionModal, setConsumptionDecisionModal] = useState<{
    isOpen: boolean;
    source: "meal_scanner" | "barcode_scanner" | "smart_fridge" | "diet_dashboard";
    foodItem: {
      id?: string;
      name: string;
      mealType?: "Breakfast" | "Lunch" | "Snack" | "Dinner";
      time?: string;
      calories: number;
      sugar: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      servingSize?: string;
      imageUrl?: string;
      safeForDiabetic?: boolean;
      glycemicIndex?: number;
      aiSummary?: string;
      healthyAlternative?: string;
    };
  } | null>(null);

  const handleConfirmConsumptionDecision = (decision: "consumed" | "preview" | "discard") => {
    if (!consumptionDecisionModal) return;
    const { source, foodItem } = consumptionDecisionModal;

    if (decision === "consumed") {
      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newMeal: MealLogItem = {
        id: foodItem.id || `meal_${Date.now()}`,
        name: foodItem.name,
        mealType: foodItem.mealType || "Lunch",
        time: foodItem.time || nowTime,
        date: selectedDashboardDate || getTodayDateStr(),
        calories: Number(foodItem.calories) || 0,
        sugar: Number(foodItem.sugar) || 0,
        protein: Number(foodItem.protein) || 0,
        carbs: Number(foodItem.carbs) || 0,
        fat: Number(foodItem.fat) || 0,
        safeForDiabetic: Boolean(foodItem.safeForDiabetic),
        imageUrl: foodItem.imageUrl,
        status: "consumed",
        consumedAt: nowTime,
        aiSummary: foodItem.aiSummary,
        healthyAlternative: foodItem.healthyAlternative,
        glycemicIndex: foodItem.glycemicIndex || 50
      };
      saveMealsToStorage([newMeal, ...todayMeals]);
      triggerToast(`✓ Confirmed! You ate "${foodItem.name}". Added ${newMeal.calories} kcal to your consumed total.`);
      setConsumptionDecisionModal(null);
    } else if (decision === "preview") {
      triggerToast(`👁️ Saved in preview mode. Not added to consumed calories.`);
      setConsumptionDecisionModal(null);
    } else if (decision === "discard") {
      if (source === "meal_scanner") {
        setAnalyzedMealResult(null);
        setMealImageBase64(null);
        setManualFoodText("");
      } else if (source === "barcode_scanner") {
        setScannedProductResult(null);
        setPackageImageBase64(null);
        setBarcodeInput("");
      } else if (source === "smart_fridge") {
        setFridgeResults(null);
        setFridgeImageBase64(null);
        setFridgeInputText("");
      } else if (source === "diet_dashboard" && foodItem.id) {
        const updated = todayMeals.filter(m => m.id !== foodItem.id);
        saveMealsToStorage(updated);
      }
      triggerToast(`🗑️ Discarded and cleared from screen.`);
      setConsumptionDecisionModal(null);
    }
  };

  // ADD RECOMMENDED MEAL (1-Click Consumption or Planning)
  const handleAddRecommendedMeal = (rec: RecommendedMeal, isConsumed: boolean = true) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMeal: MealLogItem = {
      id: `rec_log_${Date.now()}`,
      name: rec.name,
      mealType: rec.mealType,
      time: rec.idealTime,
      date: selectedDashboardDate || getTodayDateStr(),
      calories: rec.calories,
      sugar: rec.sugar,
      protein: rec.protein,
      carbs: rec.carbs,
      fat: rec.fat,
      safeForDiabetic: rec.safeForDiabetic,
      imageUrl: rec.imageUrl,
      status: isConsumed ? "consumed" : "planned",
      consumedAt: isConsumed ? nowTime : undefined,
      aiSummary: `${rec.whyRecommended} ${rec.recipeSummary}`,
      healthyAlternative: rec.alternatives?.map(a => a.name).join(" • "),
      glycemicIndex: rec.glycemicIndex
    };
    saveMealsToStorage([newMeal, ...todayMeals]);
    triggerToast(
      isConsumed
        ? `✓ Excellent choice! "${rec.name}" marked as Consumed (${rec.calories} kcal).`
        : `📋 Saved! "${rec.name}" added to Today's Planned Meals.`
    );
  };

  // LOG COMPLETED WORKOUT
  const handleCompleteWorkout = (workout: ExerciseRoutineItem) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newLog: DailyWorkoutLog = {
      id: `w_${Date.now()}`,
      title: workout.title,
      durationMinutes: workout.durationMinutes,
      caloriesBurned: workout.estimatedCaloriesBurned,
      completedAt: nowTime,
      date: selectedDashboardDate || getTodayDateStr()
    };
    const updated = [newLog, ...todayWorkouts];
    saveWorkoutsToStorage(updated);
    triggerToast(`🔥 Workout Completed! Burned ${workout.estimatedCaloriesBurned} kcal. Net calories updated for ${selectedDashboardDate}!`);
  };

  const handleDeleteWorkout = (id: string) => {
    const updated = todayWorkouts.filter(w => w.id !== id);
    saveWorkoutsToStorage(updated);
  };

  const handleAddCustomWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWorkoutForm.title) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newLog: DailyWorkoutLog = {
      id: `cw_${Date.now()}`,
      title: customWorkoutForm.title,
      durationMinutes: Number(customWorkoutForm.durationMinutes) || 20,
      caloriesBurned: Number(customWorkoutForm.caloriesBurned) || 120,
      completedAt: nowTime,
      date: selectedDashboardDate || getTodayDateStr()
    };
    saveWorkoutsToStorage([newLog, ...todayWorkouts]);
    triggerToast(`✓ Workout Logged: "${newLog.title}" (${newLog.caloriesBurned} kcal burned)!`);
  };

  const handleLoadSampleMeals = () => {
    const historicalMeals = generateDefaultHistoricalMeals();
    const historicalWorkouts = generateDefaultHistoricalWorkouts();
    saveMealsToStorage(historicalMeals);
    saveWorkoutsToStorage(historicalWorkouts);
    triggerToast("✓ Loaded 7 days of comprehensive nutritional history (Kerala meals & workouts)!");
  };

  const handleAddCustomMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMealForm.name || !customMealForm.calories) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const isConsumed = customMealForm.status === "consumed";

    const newMeal: MealLogItem = {
      id: `m_${Date.now()}`,
      name: customMealForm.name,
      mealType: customMealForm.mealType,
      time: nowTime,
      date: selectedDashboardDate || getTodayDateStr(),
      calories: Number(customMealForm.calories),
      sugar: Number(customMealForm.sugar || 0),
      protein: Number(customMealForm.protein || 0),
      carbs: Number(customMealForm.carbs || 0),
      fat: Number(customMealForm.fat || 0),
      safeForDiabetic: Number(customMealForm.sugar || 0) <= 6.0,
      status: customMealForm.status,
      consumedAt: isConsumed ? nowTime : undefined,
      aiSummary: "Manually registered meal item.",
      glycemicIndex: Number(customMealForm.sugar || 0) > 10 ? 68 : 45
    };

    saveMealsToStorage([newMeal, ...todayMeals]);
    setShowAddMealModal(false);
    triggerToast(isConsumed ? `✓ Added "${newMeal.name}" as Consumed!` : `📋 Added "${newMeal.name}" to Planned Meals.`);
    setCustomMealForm({
      name: "",
      mealType: "Breakfast",
      calories: "",
      sugar: "",
      protein: "",
      carbs: "",
      fat: "",
      status: "consumed"
    });
  };

  const handleDeleteMeal = (id: string) => {
    const updated = todayMeals.filter(m => m.id !== id);
    saveMealsToStorage(updated);
  };

  // Filter meals and workouts for the currently selected dashboard date!
  const mealsForDate = todayMeals.filter(m => (m.date || getTodayDateStr()) === selectedDashboardDate);
  const workoutsForDate = todayWorkouts.filter(w => (w.date || getTodayDateStr()) === selectedDashboardDate);

  // Filtered & Sorted Meals for the selected date
  const filteredMeals = mealsForDate
    .filter(m => {
      if (mealFilterType === "all") return true;
      if (mealFilterType === "consumed_only") return m.status === "consumed" || !m.status;
      if (mealFilterType === "planned_only") return m.status === "planned";
      return m.mealType === mealFilterType;
    })
    .sort((a, b) => {
      if (mealSortBy === "calories_desc") return b.calories - a.calories;
      if (mealSortBy === "calories_asc") return a.calories - b.calories;
      if (mealSortBy === "sugar_desc") return b.sugar - a.sugar;
      if (mealSortBy === "sugar_asc") return a.sugar - b.sugar;
      return 0;
    });

  // Consumed vs Planned Breakdown for selected date
  const consumedMeals = mealsForDate.filter(m => m.status === "consumed" || !m.status);
  const plannedMeals = mealsForDate.filter(m => m.status === "planned");

  const totalCaloriesConsumed = consumedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalCaloriesToday = totalCaloriesConsumed;
  const totalCaloriesPlanned = plannedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalCaloriesBurned = workoutsForDate.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);
  const netCalories = Math.max(0, totalCaloriesConsumed - totalCaloriesBurned);

  const totalSugarToday = +(consumedMeals.reduce((acc, m) => acc + (m.sugar || 0), 0)).toFixed(1);
  const totalProteinToday = +(consumedMeals.reduce((acc, m) => acc + (m.protein || 0), 0)).toFixed(1);
  const totalCarbsToday = +(consumedMeals.reduce((acc, m) => acc + (m.carbs || 0), 0)).toFixed(1);
  const totalFatToday = +(consumedMeals.reduce((acc, m) => acc + (m.fat || 0), 0)).toFixed(1);

  // Dynamic Diet Health Score for selected date (0 - 100)
  const calculateDietHealthScore = () => {
    if (consumedMeals.length === 0) return 70;
    let score = 75;
    const diff = Math.abs(netCalories - userProfile.dailyCalorieTarget);
    if (diff < 200) score += 12;
    else if (diff < 400) score += 5;
    else score -= 10;

    if (totalSugarToday <= userProfile.dailySugarLimitGrams) score += 8;
    else score -= 12;

    if (workoutsForDate.length > 0) score += 5;
    return Math.min(100, Math.max(25, score));
  };
  const dietHealthScore = calculateDietHealthScore();

  // Personalized dynamic recommendations with refresh rotation:
  const [mealPlanVariation, setMealPlanVariation] = useState<number>(0);
  const recommendedDailyMeals: RecommendedMeal[] = generatePersonalizedMealPlan(userProfile, mealPlanVariation);
  const recommendedWorkouts: ExerciseRoutineItem[] = generatePersonalizedWorkouts(
    userProfile,
    totalCaloriesConsumed,
    totalCaloriesBurned
  );

  // --------------------------------------------------------------------------
  // TAB 1: MEAL SCANNER & ANALYSIS STATE
  // --------------------------------------------------------------------------
  const [mealInputType, setMealInputType] = useState<"upload" | "manual">("upload");
  const [mealImageBase64, setMealImageBase64] = useState<string | null>(null);
  const [manualFoodText, setManualFoodText] = useState("");
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
  const [analyzedMealResult, setAnalyzedMealResult] = useState<any>(null);

  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionName, setCorrectionName] = useState("");
  const [correctionCalories, setCorrectionCalories] = useState("");
  const [correctionSugar, setCorrectionSugar] = useState("");
  const [correctionStatusMsg, setCorrectionStatusMsg] = useState("");

  const handleMealImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMealImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeMealAnalysis = async (presetItem?: any) => {
    setIsAnalyzingMeal(true);
    setAnalyzedMealResult(null);
    setCorrectionStatusMsg("");

    const foodQuery = typeof presetItem === "string" ? presetItem : presetItem?.name || manualFoodText;

    try {
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: presetItem?.imageUrl || mealImageBase64,
          manualFoodName: foodQuery,
          userGoal: userProfile.goal,
          userAllergies: userProfile.allergies,
          dailyCalorieTarget: userProfile.dailyCalorieTarget,
          dailySugarLimitGrams: userProfile.dailySugarLimitGrams,
          currentTotalCaloriesToday: totalCaloriesToday,
          currentTotalSugarToday: totalSugarToday
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalyzedMealResult({
          ...json.data,
          imageUrl: presetItem?.imageUrl || mealImageBase64 || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingMeal(false);
    }
  };

  const handleSaveCorrectionToML = async () => {
    if (!correctionName || !correctionCalories) return;
    try {
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isCorrection: true,
          correctedDetails: {
            originalName: analyzedMealResult?.foodName,
            name: correctionName,
            calories: Number(correctionCalories),
            sugar: Number(correctionSugar || 0)
          }
        })
      });
      const json = await res.json();
      if (json.success) {
        setCorrectionStatusMsg("✓ AI model weights updated with your feedback!");
        if (analyzedMealResult) {
          setAnalyzedMealResult({
            ...analyzedMealResult,
            foodName: correctionName,
            calories: Number(correctionCalories),
            sugar: Number(correctionSugar || 0)
          });
        }
        setTimeout(() => setShowCorrectionModal(false), 1600);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAnalyzedMealToDiet = (isConsumed: boolean = true) => {
    if (!analyzedMealResult) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMeal: MealLogItem = {
      id: `m_${Date.now()}`,
      name: analyzedMealResult.foodName,
      mealType: "Lunch",
      time: nowTime,
      date: selectedDashboardDate || getTodayDateStr(),
      calories: Number(analyzedMealResult.calories || 300),
      sugar: Number(analyzedMealResult.sugar || 3),
      protein: Number(analyzedMealResult.protein || 10),
      carbs: Number(analyzedMealResult.carbs || 40),
      fat: Number(analyzedMealResult.fat || 8),
      safeForDiabetic: analyzedMealResult.safeForDiabetic,
      imageUrl: analyzedMealResult.imageUrl,
      status: isConsumed ? "consumed" : "planned",
      consumedAt: isConsumed ? nowTime : undefined,
      aiSummary: analyzedMealResult.dietRecommendation,
      healthyAlternative: analyzedMealResult.healthyAlternative,
      glycemicIndex: analyzedMealResult.glycemicIndex || 50
    };
    saveMealsToStorage([newMeal, ...todayMeals]);
    triggerToast(
      isConsumed
        ? `✓ Confirmed! You ate "${analyzedMealResult.foodName}". Added ${newMeal.calories} kcal to your consumed total!`
        : `📋 Saved! "${analyzedMealResult.foodName}" added to Today's Planned Meals.`
    );
    setDietDashboardSubTab("food_log");
    setActiveTab("dashboard");
  };

  // --------------------------------------------------------------------------
  // TAB 2: PACKAGED FOOD & BARCODE SCANNER STATE
  // --------------------------------------------------------------------------
  const [barcodeInput, setBarcodeInput] = useState("");
  const [packageImageBase64, setPackageImageBase64] = useState<string | null>(null);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [scannedProductResult, setScannedProductResult] = useState<any>(null);

  const handlePackageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPackageImageBase64(result);
        executeBarcodeScan(undefined, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeBarcodeScan = async (codeToUse?: string, imgBase64?: string) => {
    setIsScanningBarcode(true);
    const targetCode = codeToUse || barcodeInput || (imgBase64 || packageImageBase64 ? undefined : "8901058852301");
    const imageToSend = imgBase64 || packageImageBase64;
    try {
      const res = await fetch("/api/scan-barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: targetCode, imageBase64: imageToSend })
      });
      const json = await res.json();
      if (json.success) {
        setScannedProductResult(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanningBarcode(false);
    }
  };

  // --------------------------------------------------------------------------
  // TAB 3: SMART FRIDGE RECIPE GENERATOR STATE
  // --------------------------------------------------------------------------
  const [fridgeInputText, setFridgeInputText] = useState("");
  const [fridgeImageBase64, setFridgeImageBase64] = useState<string | null>(null);
  const [isAnalyzingFridge, setIsAnalyzingFridge] = useState(false);
  const [fridgeResults, setFridgeResults] = useState<any>(null);

  const handleFridgeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFridgeImageBase64(result);
        executeFridgeScan(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeFridgeScan = async (imgBase64?: string) => {
    setIsAnalyzingFridge(true);
    const imageToSend = imgBase64 || fridgeImageBase64;
    try {
      const res = await fetch("/api/analyze-fridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageBase64: imageToSend,
          manualItems: fridgeInputText.trim(),
          userDietPreference: userProfile.dietaryPreference,
          userAllergies: userProfile.allergies
        })
      });
      const json = await res.json();
      if (json.success) {
        setFridgeResults(json);
        if (json.detectedIngredients?.length > 0) {
          setFridgeInputText(json.detectedIngredients.join(", "));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingFridge(false);
    }
  };

  // --------------------------------------------------------------------------
  // TAB 4: FOOD SAFETY & GOVT COMPLAINT PORTAL STATE
  // --------------------------------------------------------------------------
  const [complaintForm, setComplaintForm] = useState({
    productName: "",
    brandOrEstablishment: "",
    batchNumber: "",
    expiryDate: "",
    selectedAuthorityId: "auth_kerala_cfs",
    issueType: "spoilage_mold",
    description: "",
    complainantName: "",
    complainantPhone: ""
  });
  const [complaintsList, setComplaintsList] = useState<any[]>([]);
  const [authoritiesList, setAuthoritiesList] = useState<any[]>([]);
  const [complaintSuccessNotice, setComplaintSuccessNotice] = useState("");
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<"complaints" | "ml_datasets">("complaints");

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/food-safety-report");
      const json = await res.json();
      if (json.success) {
        setComplaintsList(json.complaints);
        setAuthoritiesList(json.authorities);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/food-safety-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...complaintForm,
          complainantName: complaintForm.complainantName || userProfile.name
        })
      });
      const json = await res.json();
      if (json.success) {
        setComplaintSuccessNotice(`✓ Registered! Tracking Reference: ${json.complaint.trackingNumber}. Waiting for Food Safety Officer Review.`);
        fetchComplaints();
        setComplaintForm({
          productName: "",
          brandOrEstablishment: "",
          batchNumber: "",
          expiryDate: "",
          selectedAuthorityId: "auth_kerala_cfs",
          issueType: "spoilage_mold",
          description: "",
          complainantName: "",
          complainantPhone: ""
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ADMIN ACTION: APPROVE AND TRANSMIT FORMAL NOTICE EMAIL TO REGULATORY AUTHORITY
  const handleAdminApproveAndDispatchEmail = async (complaintId: string) => {
    try {
      const res = await fetch("/api/food-safety-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admin_approve_and_dispatch_email",
          complaintId,
          adminNotes: "Evidence verified by Chief Safety Admin (Silu). Status marked: Send Done (Demo simulation mode - Real outbound email disabled)."
        })
      });
      const json = await res.json();
      if (json.success && json.emailDispatch) {
        setDispatchedEmailReceipt(json.emailDispatch);
        setEmailDispatchModalOpen(true);
        fetchComplaints();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Backend ML Metrics for Admin View
  const [mlData, setMlData] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingNotice, setTrainingNotice] = useState("");

  const fetchMlMetrics = async () => {
    try {
      const res = await fetch("/api/data-science-metrics");
      const json = await res.json();
      if (json.success) {
        setMlData(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchMlMetrics();
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && moreDotsMenuOpen) {
        setMoreDotsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moreDotsMenuOpen]);

  const handleRunTraining = async () => {
    setIsTraining(true);
    setTrainingNotice("Training epoch across 10 internal datasets & 15,960+ food photos...");
    try {
      const res = await fetch("/api/data-science-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "train_epoch", epochs: 5 })
      });
      const json = await res.json();
      if (json.success) {
        setTrainingNotice("✓ 5 Epochs completed! Accuracy boosted to " + json.metrics.currentAccuracy + "%, loss reduced.");
        fetchMlMetrics();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTraining(false);
    }
  };

  const openCamera = (
    target: "meal_scanner" | "barcode_scanner" | "smart_fridge",
    title: string,
    overlay: "food" | "barcode" | "fridge"
  ) => {
    setCameraTarget(target);
    setCameraTitle(title);
    setCameraOverlay(overlay);
    setCameraModalOpen(true);
  };

  const handleCameraCapture = (base64Image: string) => {
    if (cameraTarget === "meal_scanner") {
      setMealImageBase64(base64Image);
      setMealInputType("upload");
      executeMealAnalysis({ imageUrl: base64Image });
    } else if (cameraTarget === "barcode_scanner") {
      setPackageImageBase64(base64Image);
      executeBarcodeScan(undefined, base64Image);
    } else if (cameraTarget === "smart_fridge") {
      setFridgeImageBase64(base64Image);
      executeFridgeScan(base64Image);
    }
  };

  // COMMON AUTHENTICATION HANDLER (Handles both regular users and Admin silu / 12345)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMsg("");

    const inputEmailOrUser = authFormData.email.trim().toLowerCase();
    const inputPassword = authFormData.password.trim();

    // 1. Check if user is logging in as Admin (silu / 12345) via the common login!
    if ((inputEmailOrUser === "silu" || inputEmailOrUser === "silu@admin.com") && inputPassword === "12345") {
      const adminProfile = {
        name: "Silu (Chief Admin)",
        email: "silu@foodsafety.gov.in",
        age: 32,
        weightKg: 74,
        heightCm: 176,
        gender: "male",
        goal: "maintenance",
        activityLevel: "moderate",
        dietaryPreference: "non_veg",
        allergies: "none",
        dailyCalorieTarget: 2150,
        dailySugarLimitGrams: 25.0
      };
      setIsAdminLoggedIn(true);
      setIsLoggedIn(true);
      setUserProfile(adminProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("aifood_user_session", JSON.stringify(adminProfile));
        localStorage.setItem("aifood_is_admin", "true");
      }
      setAuthModalOpen(false);
      setActiveTab("food_safety");
      return;
    }

    // 2. Regular User Login or Register
    const weight = Number(authFormData.weightKg) || 70;
    const height = Number(authFormData.heightCm) || 170;
    const age = Number(authFormData.age) || 25;
    const isFemale = authFormData.gender === "female";

    const bmr = isFemale
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5;

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725
    };
    const multiplier = activityMultipliers[authFormData.activityLevel || "light"] || 1.35;
    const tdee = Math.round(bmr * multiplier);

    let dailyCal = tdee;
    let dailySugar = 25.0;

    if (authFormData.goal === "weight_loss") {
      dailyCal = Math.max(1200, Math.round(tdee - 450));
      dailySugar = 20.0;
    } else if (authFormData.goal === "diabetic_care") {
      dailyCal = Math.round(tdee - 150);
      dailySugar = 15.0;
    } else if (authFormData.goal === "muscle_gain") {
      dailyCal = Math.round(tdee + 350);
      dailySugar = 35.0;
    } else {
      dailyCal = tdee;
      dailySugar = 25.0;
    }

    const calculatedProfile = {
      name: authFormData.name || "Healthy User",
      email: authFormData.email,
      age: age,
      weightKg: weight,
      heightCm: height,
      gender: authFormData.gender || "male",
      goal: authFormData.goal,
      activityLevel: authFormData.activityLevel || "light",
      dietaryPreference: authFormData.dietaryPreference || "non_veg",
      allergies: authFormData.allergies || "none",
      dailyCalorieTarget: dailyCal,
      dailySugarLimitGrams: dailySugar
    };

    setIsAdminLoggedIn(false);
    setIsLoggedIn(true);
    setUserProfile(calculatedProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem("aifood_user_session", JSON.stringify(calculatedProfile));
      localStorage.removeItem("aifood_is_admin");
    }
    setAuthModalOpen(false);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-24 md:pb-8">
      {/* Background Dynamic Light Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-teal-600/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-cyan-800/10 rounded-full blur-[170px]" />
      </div>

      {/* =================================================================== */}
      {/* TOP HEADER / APP BAR */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080d19]/90 border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl group-hover:scale-105 transition-transform">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  AIFood<span className="text-emerald-400">.</span>
                </span>
                {isAdminLoggedIn ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    Admin Access
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Production
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Clinical Diet Intelligence & Safety Redressal Platform
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            onClick={() => navigateTab("home")}
            className={`hover:text-emerald-400 transition-colors ${activeTab === "home" ? "text-emerald-400" : ""}`}
          >
            {ui.home}
          </button>
          <button
            onClick={() => navigateTab("workflow_guide")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              activeTab === "workflow_guide"
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                : "text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>{ui.workflowGuide}</span>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-mono">A-Z</span>
          </button>
          <button
            onClick={() => navigateTab("dashboard")}
            className={`hover:text-emerald-400 transition-colors ${activeTab === "dashboard" ? "text-emerald-400" : ""}`}
          >
            {ui.dashboard}
          </button>
          <button
            onClick={() => navigateTab("meal_scanner")}
            className={`hover:text-emerald-400 transition-colors ${activeTab === "meal_scanner" ? "text-emerald-400" : ""}`}
          >
            {ui.mealScanner}
          </button>
          <button
            onClick={() => navigateTab("barcode_scanner")}
            className={`hover:text-emerald-400 transition-colors ${activeTab === "barcode_scanner" ? "text-emerald-400" : ""}`}
          >
            {ui.packagedFood}
          </button>
          <button
            onClick={() => navigateTab("smart_fridge")}
            className={`hover:text-emerald-400 transition-colors ${activeTab === "smart_fridge" ? "text-emerald-400" : ""}`}
          >
            {ui.smartFridge}
          </button>
          <button
            onClick={() => navigateTab("food_safety")}
            className={`hover:text-emerald-400 transition-colors ${activeTab === "food_safety" ? "text-emerald-400" : ""}`}
          >
            {ui.safetyPortal}
          </button>
        </div>

        {/* Header Actions: Language Switcher, Auth & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
              title="Change Language / ഭാഷ മാറ്റുക / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sm">{(LANGUAGE_OPTIONS.find((l) => l.id === currentLanguage) || LANGUAGE_OPTIONS[0]).flag}</span>
              <span className="hidden sm:inline font-medium">
                {(LANGUAGE_OPTIONS.find((l) => l.id === currentLanguage) || LANGUAGE_OPTIONS[0]).label}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#090e1c] border border-white/20 shadow-2xl p-2 z-50 animate-fadeIn backdrop-blur-2xl">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>Language Selection</span>
                  </span>
                  <span className="text-emerald-400 text-[9px] font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Default: English
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isSelected = currentLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => changeLanguage(lang.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <div className="text-xs font-semibold">{lang.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{lang.badge}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                  isAdminLoggedIn
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-200"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isAdminLoggedIn ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
                <span className="font-semibold">{userProfile.name}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono hidden sm:inline">
                  {userProfile.dailyCalorieTarget} kcal
                </span>
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 text-slate-400 hover:text-rose-300 text-xs transition-colors"
                title="Sign Out"
              >
                {ui.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthPromptReason("");
                  setAuthErrorMsg("");
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {ui.login}
              </button>
              <button
                onClick={() => {
                  setAuthMode("register");
                  setAuthPromptReason("Register your health details so AI can calculate your personalized calorie targets and food suggestions!");
                  setAuthErrorMsg("");
                  setAuthModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
              >
                {ui.register}
              </button>
            </div>
          )}

          {/* UNIFIED 3-DOTS MENU TRIGGER (SINGLE MENU BUTTON FOR ALL SCREENS) */}
          <button
            onClick={() => {
              setMoreDotsMenuOpen(!moreDotsMenuOpen);
              if (languageDropdownOpen) setLanguageDropdownOpen(false);
            }}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              moreDotsMenuOpen
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10"
                : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
            }`}
            aria-label={moreDotsMenuOpen ? "Close Menu" : "Open Navigation Menu (3-Dots)"}
            title={moreDotsMenuOpen ? "Close Menu" : "Menu & Navigation (3-Dots)"}
          >
            {moreDotsMenuOpen ? (
              <>
                <X className="w-5 h-5 text-rose-400" />
                <span className="text-xs font-bold text-rose-300 hidden sm:inline">Close</span>
              </>
            ) : (
              <MoreVertical className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* UNIFIED FULL-PLATFORM 3-DOTS MENU DRAWER WITH EXPLICIT CLOSE BUTTON */}
      {moreDotsMenuOpen && (
        <>
          {/* Dark Glass Backdrop Overlay - Click outside to close */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setMoreDotsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Container */}
          <div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#090e1d] border-l border-white/15 z-50 flex flex-col shadow-2xl overflow-hidden animate-slideLeft"
            role="dialog"
            aria-modal="true"
            aria-label="AIFood Platform Menu"
          >
            {/* Drawer Header with Title and EXPLICIT CLOSE BUTTON */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#070b16] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20">
                  AI
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">AIFood Menu</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Unified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Navigation, clinical tools & settings</p>
                </div>
              </div>

              {/* EXPLICIT CLOSE BUTTON REQUESTED BY USER */}
              <button
                onClick={() => setMoreDotsMenuOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/25 text-slate-200 hover:text-rose-300 border border-white/15 hover:border-rose-500/40 transition-all flex items-center gap-1.5 text-xs font-bold shadow cursor-pointer group"
                title="Close Menu (Esc)"
                aria-label="Close Menu"
              >
                <X className="w-4 h-4 text-slate-300 group-hover:text-rose-400 transition-colors" />
                <span>Close</span>
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin">

              {/* USER PROFILE & SESSION CARD */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${
                      isAdminLoggedIn 
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}>
                      {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{userProfile.name}</span>
                        {isAdminLoggedIn ? (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-bold">
                            Admin
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                            User
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {userProfile.dailyCalorieTarget} kcal • {userProfile.dailySugarLimitGrams}g sugar limit
                      </div>
                    </div>
                  </div>

                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setMoreDotsMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-semibold transition-all cursor-pointer"
                    >
                      {ui.logout}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setMoreDotsMenuOpen(false);
                          setAuthMode("login");
                          setAuthModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                      >
                        {ui.login}
                      </button>
                      <button
                        onClick={() => {
                          setMoreDotsMenuOpen(false);
                          setAuthMode("register");
                          setAuthModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 cursor-pointer"
                      >
                        {ui.register}
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Settings Shortcut Button */}
                <button
                  onClick={() => {
                    setMoreDotsMenuOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Customize Health Targets & Profile</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              {/* CLINICAL TOOLS & SHORTCUTS SECTION */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Clinical Intelligence Shortcuts</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Full Nutrition Analysis */}
                  <button
                    onClick={() => {
                      setMoreDotsMenuOpen(false);
                      navigateTab("dashboard");
                      setDietDashboardSubTab("full_analysis");
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 hover:from-emerald-500/25 hover:to-teal-500/20 border border-emerald-500/30 text-left transition-all group cursor-pointer"
                  >
                    <BarChart3 className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Full Analysis</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Date charts & macro pies</div>
                  </button>

                  {/* Current Page Guidance */}
                  <button
                    onClick={() => {
                      setMoreDotsMenuOpen(false);
                      const keyMap: Record<string, FeatureType> = {
                        dashboard: "diet_dashboard",
                        meal_scanner: "meal_scanner",
                        barcode_scanner: "packaged_food",
                        smart_fridge: "smart_fridge",
                        food_safety: "food_safety"
                      };
                      setExplainFeatureKey(keyMap[activeTab] || "diet_dashboard");
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 hover:from-cyan-500/25 hover:to-blue-500/20 border border-cyan-500/30 text-left transition-all group cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Page Guidance</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Audio & guide for this page</div>
                  </button>
                </div>
              </div>

              {/* COMPLETE PLATFORM MODULE NAVIGATION */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Platform Modules & Views
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: "home", label: `🏠 ${ui.home}`, desc: "Website introduction & clinical nutrition vision", icon: Home, color: "text-emerald-400" },
                    { id: "workflow_guide", label: `📖 ${ui.workflowGuide} (A-Z)`, desc: "Multi-language visual guide & system architecture", icon: Compass, color: "text-teal-400" },
                    { id: "dashboard", label: `📊 ${ui.dashboard}`, desc: "Daily calorie budget, macro tracker & workouts", icon: Activity, color: "text-cyan-400" },
                    { id: "meal_scanner", label: `📸 ${ui.mealScanner}`, desc: "Live camera nutrition intelligence & calorie estimation", icon: Camera, color: "text-indigo-400" },
                    { id: "barcode_scanner", label: `🔍 ${ui.packagedFood}`, desc: "E-numbers & toxic chemical additives detector", icon: ScanBarcode, color: "text-amber-400" },
                    { id: "smart_fridge", label: `❄️ ${ui.smartFridge}`, desc: "Shelf camera scanning & voice-guided chef", icon: Refrigerator, color: "text-purple-400" },
                    { id: "food_safety", label: `⚖️ ${ui.safetyPortal}`, desc: "Adulteration reporting & authority email dispatch", icon: ShieldAlert, color: "text-rose-400" }
                  ].map((item) => {
                    const isCurrent = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigateTab(item.id as any);
                          setMoreDotsMenuOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
                            : "text-slate-300 hover:text-white bg-white/[0.02] hover:bg-white/5 border border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-4 h-4 shrink-0 ${isCurrent ? "text-emerald-400" : item.color}`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{item.label}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-mono bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Active Now
                                </span>
                              )}
                              {!isLoggedIn && item.id !== "home" && (
                                <Lock className="w-3 h-3 text-amber-400" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5">{item.desc}</div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isCurrent ? "text-emerald-400" : "text-slate-500"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MULTI-LANGUAGE SELECTOR (SEPARATELY & USER-FRIENDLY) */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Select Language / ഭാഷ / भाषा</span>
                  </span>
                  <span className="text-emerald-400 text-[9px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    English Default
                  </span>
                </div>

                <div className="space-y-1.5">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isSelected = currentLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => {
                          changeLanguage(lang.id);
                          setMoreDotsMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm"
                            : "text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <div className="text-left">
                            <div className="text-xs font-semibold text-white">{lang.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{lang.badge}</div>
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Select</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER WITH FULL-WIDTH CLOSE BUTTON */}
            <div className="p-4 border-t border-white/10 bg-[#070b16] shrink-0">
              <button
                onClick={() => setMoreDotsMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/15 hover:border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
              >
                <X className="w-4 h-4 text-slate-300 group-hover:text-rose-400 transition-colors" />
                <span>Close Menu</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* GLOBAL RESPONSIVE SUB-NAVBAR MENU STRIP (ACCESSIBLE ON MOBILE/TABLET) */}
      <div className="border-b border-white/10 bg-[#070b15]/95 sticky top-[61px] sm:top-[65px] z-30 backdrop-blur-xl px-2 sm:px-4 lg:px-8 overflow-x-auto scrollbar-none shadow-md lg:hidden">
        <div className="flex items-center gap-1.5 sm:gap-2 py-2 min-w-max">
          {[
            { id: "home", label: ui.home, icon: Home },
            { id: "workflow_guide", label: `${ui.workflowGuide} (A-Z)`, icon: Compass },
            { id: "dashboard", label: ui.dashboard, icon: Activity },
            { id: "meal_scanner", label: ui.mealScanner, icon: Camera },
            { id: "barcode_scanner", label: ui.packagedFood, icon: ScanBarcode },
            { id: "smart_fridge", label: ui.smartFridge, icon: Refrigerator },
            { id: "food_safety", label: ui.safetyPortal, icon: ShieldAlert }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateTab(tab.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MAIN CONTAINER */}
      {/* =================================================================== */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">

        {/* ================================================================= */}
        {/* VIEW 0: DEDICATED HOME / LANDING PAGE */}
        {/* ================================================================= */}
        {activeTab === "home" && (
          <div className="space-y-16 lg:space-y-24 animate-fadeIn pb-12">
            {/* HERO SECTION */}
            <section className="text-center pt-8 sm:pt-14 pb-4 max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                India's First AI Food Safety & Clinical Diet Redressal Ecosystem
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                Know What You Eat. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Cook Smarter. Report Safety.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Snap photos of tea, coffee, fruits, or meals with live camera for instant calorie & sugar intelligence. Scan packaged foods for harmful E-number toxins, cook with hands-free voice recipes, and report adulteration directly to FSSAI.
              </p>

              {/* Mandatory Registration Notice Banner (When Not Logged In) */}
              {!isLoggedIn && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left max-w-2xl mx-auto text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white text-xs block">Personalized Setup Required for Accurate Food Intelligence:</strong>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        To compute your exact daily calorie deficit, safe sugar limit, and meal preparations, AI requires your body metrics (Age, Weight, Height, Goal).
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setAuthPromptReason("Please register your body metrics (Weight, Height, Age, Goal) so AI can accurately prepare your daily calorie targets and food suggestions!");
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shrink-0 shadow text-xs hover:brightness-110 transition-all"
                  >
                    Register & Setup Profile
                  </button>
                </div>
              )}

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setAuthMode("register");
                      setAuthPromptReason("Create your health profile now so our AI engine can prepare your personalized diet diary!");
                      setAuthModalOpen(true);
                    } else {
                      navigateTab("dashboard");
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 transform hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  {isLoggedIn ? "Open Your Diet Dashboard" : "Register Free & Prepare Health Profile"}
                </button>

                <button
                  onClick={() => navigateTab("meal_scanner")}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer"
                >
                  {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <Camera className="w-4 h-4 text-emerald-400" />
                  Live Camera Food Scanner
                </button>

                <button
                  onClick={() => navigateTab("workflow_guide")}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer group"
                >
                  <Compass className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
                  <span>A-to-Z Workflow Guide</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded font-mono">EN • മലയാളം • हिन्दी</span>
                </button>
              </div>

              {/* Quick Proof Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10 text-left">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-2xl font-black text-emerald-400">100%</span>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Automated Mifflin-St Jeor BMR Math</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-2xl font-black text-cyan-400">15,960+</span>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Trained Food Photography Database</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-2xl font-black text-amber-400">350,000+</span>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Packaged Barcodes & E-Numbers</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-2xl font-black text-rose-400">Direct Email</span>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Dispatch to Regulatory Authorities</p>
                </div>
              </div>

              {/* PROMINENT WORKFLOW & ARCHITECTURE BANNER */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-left">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>New User Interactive Guide (A to Z)</span>
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono">English • മലയാളം • हिन्दी</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    First Time Here? See How Every Feature Works
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Learn how live camera tea/coffee/meal scanning, packaged food E-number detection, smart fridge cooking, workout calorie offsets, and food safety complaint reporting all connect seamlessly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTab("workflow_guide")}
                  className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Open Complete Workflow Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* INTERACTIVE 4-STEP WORKFLOW */}
            <section className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Simple & Automated Workflow
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  How AIFood Powers Your Daily Health
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Four connected steps from body metrics to intelligent plate analysis and kitchen cooking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: "01",
                    title: "Register & Profile",
                    desc: "Enter your age, weight, height, and goal. System computes scientific Mifflin-St Jeor BMR and sets strict sugar caps.",
                    icon: UserPlus,
                    accent: "from-emerald-500/20 to-teal-500/5",
                    border: "border-emerald-500/30",
                    textAccent: "text-emerald-400"
                  },
                  {
                    step: "02",
                    title: "Live Camera Snapshot",
                    desc: "Open live WebRTC camera to snap your meal plate, fridge contents, or packaged snack barcodes in seconds.",
                    icon: Camera,
                    accent: "from-cyan-500/20 to-blue-500/5",
                    border: "border-cyan-500/30",
                    textAccent: "text-cyan-400"
                  },
                  {
                    step: "03",
                    title: "AI Clinical Intelligence",
                    desc: "Computer vision calculates calories, carbs, protein, and sugar spike risks, cross-referencing your personal limits.",
                    icon: BrainCircuit,
                    accent: "from-purple-500/20 to-pink-500/5",
                    border: "border-purple-500/30",
                    textAccent: "text-purple-400"
                  },
                  {
                    step: "04",
                    title: "Voice Chef & Safety",
                    desc: "Turn fridge leftovers into recipes with hands-free voice read aloud, or report adulterated foods directly to FSSAI via email dispatch.",
                    icon: Volume2,
                    accent: "from-amber-500/20 to-orange-500/5",
                    border: "border-amber-500/30",
                    textAccent: "text-amber-400"
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className={`p-6 rounded-3xl bg-gradient-to-b ${item.accent} border ${item.border} space-y-3 relative overflow-hidden`}
                    >
                      <span className="text-4xl font-black text-white/10 absolute top-4 right-4 font-mono">
                        {item.step}
                      </span>
                      <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${item.textAccent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* VISUAL SHOWCASE: REAL FOOD PHOTOGRAPHY */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Recognized Everyday Dishes
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Trained on Authentic Kerala & Global Dishes
                  </h2>
                </div>
                <button
                  onClick={() => navigateTab("meal_scanner")}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  Try live photo scan <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Real Food Photography Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {INDIAN_NUTRITION_DATASET.slice(0, 6).map((food) => (
                  <div
                    key={food.id}
                    onClick={() => {
                      if (!isLoggedIn) {
                        setAuthMode("register");
                        setAuthPromptReason(`To analyze ${food.name} and calculate calories tailored to your weight, height and health goals, please create your profile first!`);
                        setAuthModalOpen(true);
                        return;
                      }
                      navigateTab("meal_scanner");
                      executeMealAnalysis(food);
                    }}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col"
                  >
                    <div className="relative h-28 w-full overflow-hidden">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-emerald-400">
                        {food.calories} kcal
                      </div>
                      {!isLoggedIn && (
                        <div className="absolute top-2 left-2 p-1 rounded-full bg-black/70 backdrop-blur-sm text-amber-400">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {food.name}
                      </h4>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                        <span>Sugar: {food.sugar}g</span>
                        <span className="text-emerald-400 font-medium">Scan →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: COMPREHENSIVE A-TO-Z APP WORKFLOW & ARCHITECTURE GUIDE     */}
        {/* ================================================================= */}
        {activeTab === "workflow_guide" && (
          <AppWorkflowGuide
            onNavigateTab={navigateTab}
            isLoggedIn={isLoggedIn}
            language={currentLanguage}
            onLanguageChange={changeLanguage}
            onOpenRegister={() => {
              setAuthMode("register");
              setAuthPromptReason("Please register your body metrics (Weight, Height, Age, Goal) so AI can accurately prepare your daily calorie targets and food suggestions!");
              setAuthModalOpen(true);
            }}
          />
        )}

        {/* ================================================================= */}
        {/* VIEW 1: ENHANCED DIET DASHBOARD WITH 4 COMPREHENSIVE SUB-TABS     */}
        {/* ================================================================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Toolbar: Greeting & Target Highlights */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Welcome back, {userProfile.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
                    {userProfile.goal.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Daily Budget: <strong className="text-white">{userProfile.dailyCalorieTarget} kcal</strong> • Sugar Ceiling: <strong className="text-amber-400">{userProfile.dailySugarLimitGrams}g</strong> • Diet: <strong className="text-cyan-400 capitalize">{userProfile.dietaryPreference}</strong>
                </p>
              </div>

              {/* 5 Main Diet Sub-Navigation Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setDietDashboardSubTab("overview")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    dietDashboardSubTab === "overview"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Overview & Trends
                </button>

                <button
                  onClick={() => setDietDashboardSubTab("recommendations")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    dietDashboardSubTab === "recommendations"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  AI Meal Plan ({recommendedDailyMeals.length})
                </button>

                <button
                  onClick={() => setDietDashboardSubTab("routine_exercise")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    dietDashboardSubTab === "routine_exercise"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5 text-cyan-300" />
                  Exercise & Burn ({todayWorkouts.length})
                </button>

                <button
                  onClick={() => setDietDashboardSubTab("food_log")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    dietDashboardSubTab === "food_log"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Food Diary ({consumedMeals.length} Eaten)
                </button>

                <button
                  onClick={() => setDietDashboardSubTab("full_analysis")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    dietDashboardSubTab === "full_analysis"
                      ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                      : "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Full Analysis & Graphs</span>
                  <span className="text-[9px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">NEW</span>
                </button>
              </div>
            </div>

            {/* Contextual On-Page Page Guide for Diet Dashboard */}
            <PageGuideBanner
              pageKey="dashboard"
              language={currentLanguage}
              onOpenFullGuide={() => setExplainFeatureKey("diet_dashboard")}
              accentColor="emerald"
            />

            {/* In-Dashboard Floating Toast Alert */}
            {dashboardToastMsg && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/10 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between gap-3 shadow-xl animate-scaleUp">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  {dashboardToastMsg}
                </span>
                <button onClick={() => setDashboardToastMsg("")} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* =============================================================== */}
            {/* SUB-TAB 1: OVERVIEW & NUTRITIONAL TRENDS */}
            {/* =============================================================== */}
            {dietDashboardSubTab === "overview" && (
              <div className="space-y-6">
                {/* DATE SORTING & DAY SELECTION TOOLBAR (PLACE 1) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-lg">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    {/* Previous Day Button */}
                    <button
                      onClick={() => handleNavigateDay("prev")}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
                      title="Previous Day"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Date Picker Input */}
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-black/40 border border-white/15">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <input
                        type="date"
                        value={selectedDashboardDate}
                        max={getTodayDateStr()}
                        onChange={(e) => setSelectedDashboardDate(e.target.value)}
                        className="bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer w-28 sm:w-auto"
                      />
                    </div>

                    {/* Next Day Button */}
                    <button
                      onClick={() => handleNavigateDay("next")}
                      disabled={selectedDashboardDate >= getTodayDateStr()}
                      className={`p-2 rounded-xl border border-white/10 transition-all shrink-0 ${
                        selectedDashboardDate >= getTodayDateStr()
                          ? "bg-white/5 text-slate-600 cursor-not-allowed"
                          : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                      }`}
                      title="Next Day"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Quick Day Jumper Pills & Reset Button */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDashboardDate(getTodayDateStr())}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedDashboardDate === getTodayDateStr()
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                        }`}
                      >
                        Today
                      </button>

                      <button
                        onClick={() => setSelectedDashboardDate(getDayOffsetIso(-1))}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedDashboardDate === getDayOffsetIso(-1)
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                        }`}
                      >
                        Yesterday
                      </button>

                      <button
                        onClick={() => setSelectedDashboardDate(getDayOffsetIso(-2))}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer hidden sm:inline-block ${
                          selectedDashboardDate === getDayOffsetIso(-2)
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                        }`}
                      >
                        2 Days Ago
                      </button>

                      {/* CLEAR / RESET BUTTON (Place 1) */}
                      <button
                        onClick={() => setSelectedDashboardDate(getTodayDateStr())}
                        disabled={selectedDashboardDate === getTodayDateStr()}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedDashboardDate !== getTodayDateStr()
                            ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 shadow-sm shadow-rose-500/20 animate-pulse"
                            : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed opacity-50"
                        }`}
                        title={selectedDashboardDate !== getTodayDateStr() ? "Reset date back to Today" : "Already on Today"}
                      >
                        <RotateCcw className="w-3 h-3 shrink-0" />
                        <span>Reset / Clear</span>
                      </button>
                    </div>
                  </div>

                  {/* RIGHT NEXT TO IT: "FULL ANALYSIS" ACTION BUTTON */}
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => setDietDashboardSubTab("full_analysis")}
                      className="w-full lg:w-auto justify-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer group"
                    >
                      <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
                      <span>📊 Full Analysis & Graphs</span>
                      <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">Date Range</span>
                    </button>
                  </div>
                </div>

                {/* Active Date Context Notice */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs px-1 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Nutrition & Workouts for:{" "}
                      <strong className="text-white font-mono">{formatDateFriendly(selectedDashboardDate)}</strong>
                      {selectedDashboardDate === getTodayDateStr() && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          LIVE TODAY
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {consumedMeals.length} eaten • {workoutsForDate.length} workouts logged
                  </span>
                </div>

                {/* 4 Key Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Card 1: Net Calories Meter */}
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Net Calorie Intake
                      </span>
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Flame className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black tracking-tight text-white">{netCalories}</span>
                      <span className="text-xs text-slate-400 font-medium">/ {userProfile.dailyCalorieTarget} kcal</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          netCalories > userProfile.dailyCalorieTarget
                            ? "bg-rose-500"
                            : "bg-gradient-to-r from-emerald-500 to-teal-400"
                        }`}
                        style={{
                          width: `${Math.min(100, (netCalories / userProfile.dailyCalorieTarget) * 100)}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                      <span>Consumed: {totalCaloriesConsumed}</span>
                      <span className="text-cyan-400">Burned: -{totalCaloriesBurned}</span>
                    </div>
                  </div>

                  {/* Card 2: Sugar Intake Meter */}
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Sugar Intake Meter
                      </span>
                      <div className={`p-2 rounded-lg ${totalSugarToday > userProfile.dailySugarLimitGrams ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                        <Candy className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-black tracking-tight ${totalSugarToday > userProfile.dailySugarLimitGrams ? "text-rose-400" : "text-white"}`}>
                        {totalSugarToday}g
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/ {userProfile.dailySugarLimitGrams}g limit</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          totalSugarToday > userProfile.dailySugarLimitGrams ? "bg-rose-500" : "bg-amber-400"
                        }`}
                        style={{
                          width: `${Math.min(100, (totalSugarToday / userProfile.dailySugarLimitGrams) * 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-[11px] mt-2 font-medium">
                      {totalSugarToday > userProfile.dailySugarLimitGrams ? (
                        <span className="text-rose-400">⚠️ Sugar spike warning! Exceeded safe threshold</span>
                      ) : (
                        <span className="text-emerald-400">✓ Safe within WHO recommended threshold</span>
                      )}
                    </p>
                  </div>

                  {/* Card 3: Protein & Macros */}
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Protein & Macros
                      </span>
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Utensils className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black tracking-tight text-white">{totalProteinToday}g</span>
                      <span className="text-xs text-slate-400 font-medium">/ ~80g goal</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-300">
                      <div className="bg-white/5 p-1.5 rounded-lg">Carbs: <strong className="text-white">{totalCarbsToday}g</strong></div>
                      <div className="bg-white/5 p-1.5 rounded-lg">Fats: <strong className="text-white">{totalFatToday}g</strong></div>
                    </div>
                  </div>

                  {/* Card 4: Diet Health Score */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/30 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Daily Diet Score
                      </span>
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="my-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-400">{dietHealthScore}</span>
                        <span className="text-xs text-slate-400">/ 100</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                        {dietHealthScore >= 85 ? "Grade A+ Elite Nutritional Adherence" : dietHealthScore >= 70 ? "Grade B Good Balance" : "Needs Calorie Adjustment"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Updated live based on meals eaten, sugar limit & workouts
                    </div>
                  </div>
                </div>

                {/* 2 Interactive Widgets: Water Hydration Tracker & Daily Routine Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Widget 1: Water Hydration Tracker */}
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                          <Droplets className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Daily Hydration Tracker</h4>
                          <span className="text-xs text-slate-400">Target: 8 Glasses (2.0 Liters)</span>
                        </div>
                      </div>
                      <span className="text-base font-black text-cyan-400 font-mono">
                        {waterGlassesCount} / 8 <span className="text-xs text-slate-400 font-normal">glasses</span>
                      </span>
                    </div>

                    {/* Visual 8 Glasses Row */}
                    <div className="grid grid-cols-8 gap-1.5 pt-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-12 rounded-xl flex items-center justify-center transition-all ${
                            i < waterGlassesCount
                              ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                              : "bg-white/5 border border-white/10 text-slate-600"
                          }`}
                        >
                          <Droplets className="w-4 h-4" />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => saveWaterToStorage(waterGlassesCount + 1)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Drink 1 Glass (250ml)
                      </button>
                      <button
                        onClick={() => saveWaterToStorage(waterGlassesCount - 1)}
                        disabled={waterGlassesCount <= 0}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold disabled:opacity-30 transition-colors"
                      >
                        - Remove
                      </button>
                    </div>
                  </div>

                  {/* Widget 2: Daily 5-Step Routine Checklist */}
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                          <CheckSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Daily Nutritional Routine</h4>
                          <span className="text-xs text-slate-400">Monitor eating schedule & consistency</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {
                          [
                            waterGlassesCount >= 8,
                            consumedMeals.some(m => m.mealType === "Breakfast"),
                            consumedMeals.some(m => m.mealType === "Lunch"),
                            todayWorkouts.length > 0,
                            consumedMeals.some(m => m.mealType === "Dinner")
                          ].filter(Boolean).length
                        } / 5 Done
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Item 1: Morning Hydration */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                          Hydration Goal (8 glasses)
                        </span>
                        <span className={waterGlassesCount >= 8 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                          {waterGlassesCount >= 8 ? "Completed ✓" : `${waterGlassesCount}/8 in progress`}
                        </span>
                      </div>

                      {/* Item 2: Breakfast */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          Nutritious Breakfast
                        </span>
                        <span className={consumedMeals.some(m => m.mealType === "Breakfast") ? "text-emerald-400 font-bold" : "text-amber-400"}>
                          {consumedMeals.some(m => m.mealType === "Breakfast") ? "Eaten ✓" : "Pending"}
                        </span>
                      </div>

                      {/* Item 3: Lunch */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                          Balanced Lunch
                        </span>
                        <span className={consumedMeals.some(m => m.mealType === "Lunch") ? "text-emerald-400 font-bold" : "text-amber-400"}>
                          {consumedMeals.some(m => m.mealType === "Lunch") ? "Eaten ✓" : "Pending"}
                        </span>
                      </div>

                      {/* Item 4: Exercise */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
                          Physical Exercise Routine
                        </span>
                        <span className={todayWorkouts.length > 0 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                          {todayWorkouts.length > 0 ? `${todayWorkouts.length} Completed ✓ (${totalCaloriesBurned} kcal)` : "Not logged yet"}
                        </span>
                      </div>

                      {/* Item 5: Dinner */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                          Light Digestible Dinner
                        </span>
                        <span className={consumedMeals.some(m => m.mealType === "Dinner") ? "text-emerald-400 font-bold" : "text-amber-400"}>
                          {consumedMeals.some(m => m.mealType === "Dinner") ? "Eaten ✓" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trends Bar: Daily / Weekly / Monthly Switcher */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Caloric & Sugar Adherence History</h4>
                      <p className="text-xs text-slate-400">Review your past performance across different intervals</p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                      {(["daily", "weekly", "monthly"] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setDashboardTimeframe(range)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                            dashboardTimeframe === range
                              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {dashboardTimeframe === "weekly" ? (
                    /* 7 Day Trend Chart */
                    <div className="space-y-4">
                      <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2">
                        {[
                          { day: "Mon", kcal: 1720 },
                          { day: "Tue", kcal: 1840 },
                          { day: "Wed", kcal: 1650 },
                          { day: "Thu", kcal: 1910 },
                          { day: "Fri", kcal: 1780 },
                          { day: "Sat", kcal: 2050 },
                          { day: "Sun (Today)", kcal: netCalories || 1690 }
                        ].map((d, idx) => {
                          const maxScale = 2500;
                          const heightPercent = Math.min(100, Math.round((d.kcal / maxScale) * 100));
                          const isOver = d.kcal > userProfile.dailyCalorieTarget;
                          return (
                            <div key={idx} className="flex flex-col items-center h-full justify-end gap-1.5">
                              <span className="text-[10px] text-slate-400 font-mono">{d.kcal}</span>
                              <div className="w-full max-w-[40px] bg-slate-800/80 rounded-t-xl overflow-hidden relative flex items-end h-32">
                                <div
                                  style={{ height: `${heightPercent}%` }}
                                  className={`w-full rounded-t-xl transition-all duration-700 ${
                                    isOver
                                      ? "bg-gradient-to-t from-rose-600 to-amber-400"
                                      : "bg-gradient-to-t from-teal-600 to-emerald-400"
                                  }`}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-slate-300">{d.day}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-400 text-center">
                        Daily average this week: <strong>1,805 kcal</strong> (Target: {userProfile.dailyCalorieTarget} kcal)
                      </p>
                    </div>
                  ) : dashboardTimeframe === "monthly" ? (
                    /* 30-Day Projections */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                        <span className="text-xs font-bold text-emerald-400">30-Day Deficit Impact</span>
                        <h5 className="text-2xl font-black text-white">-1.35 kg Fat</h5>
                        <p className="text-xs text-slate-300">Consistent deficit creates sustainable body composition change without muscle depletion.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                        <span className="text-xs font-bold text-cyan-400">Glycemic Stability</span>
                        <h5 className="text-2xl font-black text-white">93.3% Optimal</h5>
                        <p className="text-xs text-slate-300">Adhering to {userProfile.dailySugarLimitGrams}g sugar threshold protects beta-cell pancreatic function.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                        <span className="text-xs font-bold text-purple-400">Macro Balance</span>
                        <h5 className="text-2xl font-black text-white">50% C • 25% P • 25% F</h5>
                        <p className="text-xs text-slate-300">Clinically aligns with ICMR & National Institute of Nutrition guidelines.</p>
                      </div>
                    </div>
                  ) : (
                    /* Daily Quick Summary */
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <strong className="text-white">Today's Intake Status:</strong>
                        <p className="text-slate-400">
                          Consumed {totalCaloriesConsumed} kcal across {consumedMeals.length} eaten meals. Burned {totalCaloriesBurned} kcal across {todayWorkouts.length} workouts.
                        </p>
                      </div>
                      <button
                        onClick={() => setDietDashboardSubTab("recommendations")}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors"
                      >
                        Explore Recommended Meals →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* SUB-TAB 2: PERSONALIZED AI MEAL RECOMMENDATIONS */}
            {/* =============================================================== */}
            {dietDashboardSubTab === "recommendations" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          Personalized AI Meal Plan (4 Daily Meals)
                        </h3>
                        <button
                          type="button"
                          onClick={() => setExplainFeatureKey("diet_dashboard")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Explain This Work</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Formulated for: <strong className="text-emerald-400 capitalize">{userProfile.goal.replace("_", " ")}</strong> • Target: <strong className="text-cyan-400">{userProfile.dailyCalorieTarget} kcal</strong> • Sugar Cap: <strong className="text-amber-400">{userProfile.dailySugarLimitGrams}g</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const nextVar = (mealPlanVariation + 1) % 3;
                          setMealPlanVariation(nextVar);
                          triggerToast(`🔄 AI Meal Plan refreshed with fresh variety options (Set #${nextVar + 1})!`);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh AI Meals Plan</span>
                      </button>
                      <span className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                        Set #{mealPlanVariation + 1}
                      </span>
                    </div>
                  </div>

                  {/* Active Category & Diet Switcher Bar */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 mr-1">Switch Category / Goal:</span>
                      {[
                        { id: "weight_loss", label: "Weight Loss (തടി കുറയ്ക്കൽ)", icon: "🔥", target: 1750 },
                        { id: "muscle_gain", label: "Muscle Gain (മസിൽ കൂട്ടൽ)", icon: "💪", target: 2300 },
                        { id: "diabetic_care", label: "Diabetic Care (പ്രമേഹം)", icon: "🩺", target: 1800 },
                        { id: "maintenance", label: "Maintenance (പൊതു ആരോഗ്യം)", icon: "🥗", target: 2000 }
                      ].map((cat) => {
                        const isActive = userProfile.goal === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              const updated = {
                                ...userProfile,
                                goal: cat.id as any,
                                dailyCalorieTarget: cat.target
                              };
                              setUserProfile(updated);
                              if (typeof window !== "undefined") {
                                localStorage.setItem("aifood_user_session", JSON.stringify(updated));
                              }
                              setMealPlanVariation((prev) => (prev + 1) % 3);
                              triggerToast(`✓ Switched Category to "${cat.label}". AI regenerated 4 tailored meals!`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isActive
                                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-[1.02]"
                                : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                            }`}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Veg / Non-Veg preference toggle */}
                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
                      <span className="text-[11px] text-slate-400 px-2 font-medium">Diet:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...userProfile, dietaryPreference: "non_veg" as any };
                          setUserProfile(updated);
                          if (typeof window !== "undefined") {
                            localStorage.setItem("aifood_user_session", JSON.stringify(updated));
                          }
                          setMealPlanVariation((prev) => (prev + 1) % 3);
                          triggerToast("✓ Updated diet to Non-Veg & refreshed meal recommendations!");
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          userProfile.dietaryPreference === "non_veg"
                            ? "bg-emerald-500 text-slate-950 shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Non-Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...userProfile, dietaryPreference: "veg" as any };
                          setUserProfile(updated);
                          if (typeof window !== "undefined") {
                            localStorage.setItem("aifood_user_session", JSON.stringify(updated));
                          }
                          setMealPlanVariation((prev) => (prev + 1) % 3);
                          triggerToast("✓ Updated diet to Vegetarian & refreshed meal recommendations!");
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          userProfile.dietaryPreference === "veg"
                            ? "bg-emerald-500 text-slate-950 shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Vegetarian
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Routine Meal Cards: Breakfast, Lunch, Snack, Dinner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedDailyMeals.map((rec) => {
                    const isAlreadyConsumed = consumedMeals.some(m => m.mealType === rec.mealType);
                    return (
                      <div
                        key={rec.id}
                        className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 group"
                      >
                        <div className="space-y-3">
                          {/* Routine Header Tag */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white flex items-center gap-1.5">
                              {rec.mealType === "Breakfast" && <Sun className="w-3.5 h-3.5 text-amber-400" />}
                              {rec.mealType === "Lunch" && <Utensils className="w-3.5 h-3.5 text-emerald-400" />}
                              {rec.mealType === "Snack" && <Coffee className="w-3.5 h-3.5 text-orange-400" />}
                              {rec.mealType === "Dinner" && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                              {rec.mealType} ({rec.idealTime})
                            </span>

                            {isAlreadyConsumed ? (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                ✓ Eaten Today
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">
                                Ideal Window
                              </span>
                            )}
                          </div>

                          {/* Meal Info & Image */}
                          <div className="flex items-start gap-4">
                            <img
                              src={rec.imageUrl}
                              alt={rec.name}
                              className="w-20 h-20 rounded-2xl object-cover border border-white/15 shadow-md shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1">
                              <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                                {rec.name}
                              </h4>
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-xl font-black text-emerald-400">{rec.calories} kcal</span>
                                <span className="text-xs text-slate-400">Sugar: <strong className="text-amber-400">{rec.sugar}g</strong></span>
                                <span className="text-xs text-slate-400">GI: <strong className="text-cyan-400">{rec.glycemicIndex}</strong></span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                <span>Protein: <strong className="text-white">{rec.protein}g</strong></span>
                                <span>Carbs: <strong className="text-white">{rec.carbs}g</strong></span>
                                <span>Fat: <strong className="text-white">{rec.fat}g</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Why Recommended Clinical Note */}
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
                            <strong className="text-emerald-300 block mb-0.5 font-semibold">Why AI Selected This:</strong>
                            {rec.whyRecommended}
                          </div>

                          {/* Smart Alternatives */}
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs">
                            <span className="text-slate-400 font-semibold block text-[11px]">Smart Alternatives:</span>
                            {rec.alternatives?.map((alt, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[11px] text-slate-300 border-t border-white/5 pt-1">
                                <span>{alt.name}</span>
                                <span className="font-mono text-emerald-400">{alt.calories} kcal • {alt.protein}g P</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons: "I Ate This! (Confirm Done)" vs "Add to Plan" */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => {
                              setConsumptionDecisionModal({
                                isOpen: true,
                                source: "diet_dashboard",
                                foodItem: {
                                  id: `rec_${rec.id}_${Date.now()}`,
                                  name: rec.name,
                                  mealType: rec.mealType,
                                  time: rec.idealTime,
                                  calories: rec.calories,
                                  sugar: rec.sugar,
                                  protein: rec.protein,
                                  carbs: rec.carbs,
                                  fat: rec.fat,
                                  imageUrl: rec.imageUrl,
                                  safeForDiabetic: rec.safeForDiabetic,
                                  glycemicIndex: rec.glycemicIndex,
                                  aiSummary: rec.whyRecommended,
                                  healthyAlternative: rec.alternatives?.map(a => a.name).join(" • ")
                                }
                              });
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            I Ate This! (Confirm Done)
                          </button>

                          <button
                            onClick={() => handleAddRecommendedMeal(rec, false)}
                            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold whitespace-nowrap transition-colors"
                          >
                            📋 Add to Plan
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* SUB-TAB 3: EXERCISE & CALORIE BURN ROUTINE ENGINE */}
            {/* =============================================================== */}
            {dietDashboardSubTab === "routine_exercise" && (
              <div className="space-y-6">
                {/* Net Calorie Formula Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-white/[0.04] to-cyan-500/10 border border-cyan-500/30 backdrop-blur-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-cyan-400" />
                        Exercise & Calorie Burn Engine
                      </h3>
                      <p className="text-xs text-slate-400">
                        Balance your daily food intake with targeted physical activity to accelerate your goal.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs">
                        {todayWorkouts.length} Workouts Logged Today
                      </span>
                    </div>
                  </div>

                  {/* Net Calorie Equation Visual */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase">Food Consumed</span>
                      <p className="text-2xl font-black text-white">{totalCaloriesConsumed} kcal</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-cyan-400 uppercase">Workouts Burned</span>
                      <p className="text-2xl font-black text-cyan-400">-{totalCaloriesBurned} kcal</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-emerald-400 uppercase">Net Calories</span>
                      <p className="text-2xl font-black text-emerald-400">{netCalories} kcal</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-amber-400 uppercase">Daily Target</span>
                      <p className="text-2xl font-black text-amber-400">{userProfile.dailyCalorieTarget} kcal</p>
                    </div>
                  </div>

                  {/* Caloric Guidance Alert */}
                  {netCalories > userProfile.dailyCalorieTarget ? (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                        <strong>Calorie Surplus Alert:</strong> You are currently {netCalories - userProfile.dailyCalorieTarget} kcal above your daily budget. Complete one of the workouts below to return to your deficit target!
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <strong>On Track:</strong> You have {userProfile.dailyCalorieTarget - netCalories} kcal buffer remaining today. Great adherence!
                      </span>
                    </div>
                  )}
                </div>

                {/* 5 Recommended Workouts Grid */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-cyan-400" />
                        Targeted Workouts Formulated for Your Goal ({userProfile.goal.replace("_", " ")})
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Clinical post-meal walks, fat burning cardio, and strength circuits with exercise photography and muscle targets.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExplainFeatureKey("exercise_engine")}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Explain Workout Engine</span>
                    </button>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 border-y border-white/5">
                    <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Routine:
                    </span>
                    {["all", "Recovery Walk", "Cardio", "Strength", "Flexibility / Yoga"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setExerciseCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          exerciseCategoryFilter === cat
                            ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                        }`}
                      >
                        {cat === "all" ? "All Exercises (5)" : cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recommendedWorkouts
                      .filter(w => exerciseCategoryFilter === "all" || w.category === exerciseCategoryFilter)
                      .map((w) => (
                        <div
                          key={w.id}
                          className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group overflow-hidden"
                        >
                          <div className="space-y-3">
                            {/* Exercise Photo with Overlay Tags */}
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-cyan-500/40 transition-colors">
                              <img
                                src={w.imageUrl}
                                alt={w.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
                              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                                {w.category} • {w.targetTime}
                              </div>
                              <div className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                                w.intensity === "High" ? "bg-rose-500/90 text-white" : w.intensity === "Moderate" ? "bg-amber-500/90 text-slate-950" : "bg-emerald-500/90 text-slate-950"
                              }`}>
                                {w.intensity} Intensity
                              </div>
                              <div className="absolute bottom-2 left-2 right-2 flex items-baseline justify-between text-white">
                                <span className="text-xl font-black text-cyan-300">{w.estimatedCaloriesBurned} kcal</span>
                                <span className="text-xs text-slate-200 font-semibold">{w.durationMinutes} minutes</span>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {w.title}
                              </h5>

                              {/* Muscle Targets */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="text-[10px] text-slate-400 font-semibold">Muscles:</span>
                                {w.muscleTargets?.map((m, idx) => (
                                  <span key={idx} className="text-[10px] font-bold bg-white/10 text-cyan-200 px-2 py-0.5 rounded-md border border-white/5">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              {w.benefitText}
                            </p>

                            <div className="space-y-1 text-[11px] text-slate-300 bg-black/30 p-3 rounded-xl border border-white/5">
                              <strong className="text-emerald-400 uppercase tracking-wider block text-[10px]">
                                Step-by-Step Instructions:
                              </strong>
                              <ul className="space-y-1">
                                {w.instructions.map((inst, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-cyan-400 font-bold">•</span>
                                    <span>{inst}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCompleteWorkout(w)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Complete Workout (Mark Done)</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Custom Workout Logging Form & Completed Ledger */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Form: Add Custom Workout */}
                  <form onSubmit={handleAddCustomWorkout} className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white">Log Custom Physical Activity</h4>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Activity / Sport Title</label>
                      <input
                        type="text"
                        required
                        value={customWorkoutForm.title}
                        onChange={(e) => setCustomWorkoutForm({ ...customWorkoutForm, title: e.target.value })}
                        placeholder="e.g. Football match, Gym weight training, Badminton, Swimming"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Duration (Mins)</label>
                        <input
                          type="number"
                          required
                          value={customWorkoutForm.durationMinutes}
                          onChange={(e) => {
                            const mins = Number(e.target.value);
                            setCustomWorkoutForm({
                              ...customWorkoutForm,
                              durationMinutes: mins,
                              caloriesBurned: Math.round(mins * 5.5)
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Est. Calories Burned</label>
                        <input
                          type="number"
                          required
                          value={customWorkoutForm.caloriesBurned}
                          onChange={(e) => setCustomWorkoutForm({ ...customWorkoutForm, caloriesBurned: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      + Log Custom Workout
                    </button>
                  </form>

                  {/* Completed Workouts Ledger */}
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <h4 className="text-sm font-bold text-white">Today's Completed Workouts ({todayWorkouts.length})</h4>
                      {todayWorkouts.length > 0 && (
                        <button
                          onClick={() => saveWorkoutsToStorage([])}
                          className="text-[11px] text-rose-400 hover:underline"
                        >
                          Clear Workouts
                        </button>
                      )}
                    </div>

                    {todayWorkouts.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">
                        No workouts logged today. Complete a recommended routine above or log your exercise!
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none pr-1">
                        {todayWorkouts.map((w) => (
                          <div
                            key={w.id}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <strong className="text-white block">{w.title}</strong>
                              <span className="text-[10px] text-slate-400">
                                {w.durationMinutes} mins • Completed at {w.completedAt}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-cyan-400">-{w.caloriesBurned} kcal</span>
                              <button
                                onClick={() => handleDeleteWorkout(w.id)}
                                className="text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* SUB-TAB 4: FOOD DIARY WITH "I ATE THIS!" STATUS CONFIRMATION */}
            {/* =============================================================== */}
            {dietDashboardSubTab === "food_log" && (
              <div className="space-y-6">
                {/* Filter & Sorting Controls Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {(["all", "consumed_only", "planned_only", "Breakfast", "Lunch", "Dinner", "Snack"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMealFilterType(cat as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                          mealFilterType === cat
                            ? "bg-white/15 text-white"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {cat === "all" ? "All Meals" : cat === "consumed_only" ? "✓ Consumed Only" : cat === "planned_only" ? "⏳ Planned Only" : cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <select
                        value={mealSortBy}
                        onChange={(e) => setMealSortBy(e.target.value as any)}
                        className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="time" className="bg-slate-900">Sort by Time (Default)</option>
                        <option value="calories_desc" className="bg-slate-900">Calories (High to Low)</option>
                        <option value="calories_asc" className="bg-slate-900">Calories (Low to High)</option>
                        <option value="sugar_desc" className="bg-slate-900">Sugar (High to Low)</option>
                        <option value="sugar_asc" className="bg-slate-900">Sugar (Low to High)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setShowAddMealModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Meal
                    </button>
                  </div>
                </div>

                {/* Meals Log List */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Meals Recorded Today ({filteredMeals.length})</span>
                      <span className="text-xs text-emerald-400 font-normal">
                        ({consumedMeals.length} consumed, {plannedMeals.length} planned)
                      </span>
                    </h3>
                    {todayMeals.length > 0 && (
                      <button
                        onClick={() => saveMealsToStorage([])}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Clear Today's Log
                      </button>
                    )}
                  </div>

                  {filteredMeals.length === 0 ? (
                    <div className="p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        No meals match your current filter. Snap your meal plate with the camera, select from AI recommendations, or add a dish manually!
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() => openCamera("meal_scanner", "Live Food Photo Capture", "food")}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Snap Food Photo
                        </button>
                        <button
                          onClick={handleLoadSampleMeals}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all"
                        >
                          ⚡ Load Sample Kerala Meals
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMeals.map((meal) => {
                        const isConsumed = meal.status === "consumed" || !meal.status;
                        return (
                          <div
                            key={meal.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              isConsumed
                                ? "bg-white/[0.02] border-white/10"
                                : "bg-amber-500/5 border-amber-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {meal.imageUrl ? (
                                <img
                                  src={meal.imageUrl}
                                  alt={meal.name}
                                  className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow shrink-0"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                  <Utensils className="w-6 h-6" />
                                </div>
                              )}

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-white text-sm">{meal.name}</h4>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-400">
                                    {meal.mealType} • {meal.time}
                                  </span>

                                  {/* Status Badge */}
                                  {isConsumed ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      Consumed at {meal.consumedAt || meal.time}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                      ⏳ Planned (Not eaten yet)
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                                  <span>Carbs: <strong className="text-slate-200">{meal.carbs}g</strong></span>
                                  <span>Protein: <strong className="text-slate-200">{meal.protein}g</strong></span>
                                  <span>Fat: <strong className="text-slate-200">{meal.fat}g</strong></span>
                                  <span>Sugar: <strong className="text-amber-400">{meal.sugar}g</strong></span>
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Calories, "I Ate This" Button & Actions */}
                            <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                              <div className="text-right">
                                <span className="text-base font-black text-emerald-400">{meal.calories} kcal</span>
                                <div className="text-[11px]">
                                  {meal.safeForDiabetic ? (
                                    <span className="text-emerald-400/80">Diabetic Safe ✓</span>
                                  ) : (
                                    <span className="text-amber-400/80">Sugar Monitor ⚠️</span>
                                  )}
                                </div>
                              </div>

                              {/* Action: Mark as Eaten / Done or Toggle */}
                              {!isConsumed ? (
                                <button
                                  onClick={() => handleMarkMealConsumed(meal.id)}
                                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  I Ate This! (Done)
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleMealStatus(meal.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-semibold transition-colors"
                                  title="Change back to Planned"
                                >
                                  Undo
                                </button>
                              )}

                              {/* View Full AI Analysis & Clinical Advice */}
                              <button
                                onClick={() => setSelectedMealDetailModal(meal)}
                                className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="View Complete AI Nutritional Report"
                              >
                                <Info className="w-3.5 h-3.5" />
                                Report
                              </button>

                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="Delete from Log"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* SUB-TAB 5: FULL COMPREHENSIVE NUTRITIONAL & HISTORICAL ANALYSIS */}
            {/* =============================================================== */}
            {dietDashboardSubTab === "full_analysis" && (
              <DietFullAnalysisView
                meals={todayMeals}
                workouts={todayWorkouts}
                userProfile={userProfile}
                language={currentLanguage}
                onSelectDate={(date) => {
                  setSelectedDashboardDate(date);
                  setDietDashboardSubTab("overview");
                  triggerToast(`Loaded data for ${date} in Dashboard Overview!`);
                }}
                onBackToOverview={() => setDietDashboardSubTab("overview")}
              />
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: AI MEAL SCANNER WITH LIVE CAMERA & TEST PRESETS */}
        {/* ================================================================= */}
        {activeTab === "meal_scanner" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  AI Meal Scanner & Nutrition Breakdown
                </h2>
                <button
                  type="button"
                  onClick={() => setExplainFeatureKey("meal_scanner")}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain This Feature</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Snap photos of tea, coffee, fruits, or meals with live camera or enter dish name. AI recognizes calories, sugar spikes, and provides clinical dietitian recommendations.
              </p>
            </div>

            {/* Contextual On-Page Page Guide for AI Meal Scanner */}
            <PageGuideBanner
              pageKey="meal_scanner"
              language={currentLanguage}
              onOpenFullGuide={() => setExplainFeatureKey("meal_scanner")}
              accentColor="emerald"
            />

            {/* Input Options: Live Camera / Upload / Manual */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
                <button
                  onClick={() => setMealInputType("upload")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    mealInputType === "upload"
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Live Camera / Photo Upload
                </button>
                <button
                  onClick={() => setMealInputType("manual")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    mealInputType === "manual"
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Manual Search / Type Food
                </button>
              </div>

              {mealInputType === "upload" ? (
                <div className="space-y-4">
                  {/* Live Camera Button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => openCamera("meal_scanner", "Live Food Photo Capture", "food")}
                      className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all"
                    >
                      <Camera className="w-5 h-5" />
                      Open Live Camera to Snap Food
                    </button>

                    <label className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      Upload Photo from Device
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMealImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {mealImageBase64 && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={mealImageBase64}
                          alt="Captured food"
                          className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Ready for AI Vision Analysis</span>
                          <span className="text-[11px] text-emerald-400">Photo loaded successfully</span>
                        </div>
                      </div>
                      <button
                        onClick={() => executeMealAnalysis()}
                        disabled={isAnalyzingMeal}
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        {isAnalyzingMeal ? "Analyzing..." : "Re-Analyze"}
                      </button>
                    </div>
                  )}

                  {/* Quick Test Presets (Tea, Coffee, Apple, Boiled Rice) */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-medium text-slate-400">Test Vision & Nutrition on Common Items:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          name: "Chaya / Black Tea",
                          calories: 48,
                          sugar: 10.2,
                          imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
                        },
                        {
                          name: "Hot Filter Coffee",
                          calories: 85,
                          sugar: 7.5,
                          imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
                        },
                        {
                          name: "Fresh Red Apple",
                          calories: 95,
                          sugar: 19.0,
                          imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"
                        },
                        {
                          name: "Boiled Rice (Choru)",
                          calories: 205,
                          sugar: 0.1,
                          imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80"
                        }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => executeMealAnalysis(item)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-2.5 group transition-colors"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="overflow-hidden">
                            <span className="text-[11px] font-bold text-white block truncate">{item.name}</span>
                            <span className="text-[10px] text-emerald-400">{item.calories} kcal</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Enter food name or dish details:
                    </label>
                    <input
                      type="text"
                      value={manualFoodText}
                      onChange={(e) => setManualFoodText(e.target.value)}
                      placeholder="Enter food item or dish name (e.g. Black Tea, Coffee, Apple, Boiled Rice)..."
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                    />
                  </div>

                  <button
                    onClick={() => executeMealAnalysis()}
                    disabled={isAnalyzingMeal || !manualFoodText.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzingMeal ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Searching Datasets & Nutrition Engine...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Calculate Nutritional Values
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Analysis Results Display */}
            {analyzedMealResult && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-emerald-500/30 backdrop-blur-xl space-y-6 shadow-2xl animate-slideUp">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-4">
                    {analyzedMealResult.imageUrl && (
                      <img
                        src={analyzedMealResult.imageUrl}
                        alt={analyzedMealResult.foodName}
                        className="w-16 h-16 rounded-2xl object-cover border border-white/15 shadow-md"
                      />
                    )}
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
                        AI Nutrition Breakdown
                      </span>
                      <h3 className="text-2xl font-black text-white">{analyzedMealResult.foodName}</h3>
                      <p className="text-xs text-slate-400">Serving size: {analyzedMealResult.servingSize}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-3xl font-black text-emerald-400">{analyzedMealResult.calories} kcal</div>
                      <div className="text-[11px] text-slate-400">
                        Sugar: <strong className="text-amber-400">{analyzedMealResult.sugar}g</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Protein</span>
                    <p className="text-lg font-bold text-cyan-300">{analyzedMealResult.protein}g</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Carbohydrates</span>
                    <p className="text-lg font-bold text-amber-300">{analyzedMealResult.carbs}g</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Fats</span>
                    <p className="text-lg font-bold text-rose-300">{analyzedMealResult.fat}g</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Glycemic Index</span>
                    <p className="text-lg font-bold text-emerald-300">{analyzedMealResult.glycemicIndex || 55}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs leading-relaxed text-emerald-200">
                    <strong className="block text-emerald-300 font-semibold mb-1">
                      🥗 Clinical Recommendation (Goal: {userProfile.goal.replace("_", " ")}):
                    </strong>
                    {analyzedMealResult.dietRecommendation}
                  </div>

                  {analyzedMealResult.healthyAlternative && (
                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs leading-relaxed text-cyan-200">
                      <strong className="block text-cyan-300 font-semibold mb-1">
                        💡 Healthier Alternative Suggestion:
                      </strong>
                      {analyzedMealResult.healthyAlternative}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setConsumptionDecisionModal({
                        isOpen: true,
                        source: "meal_scanner",
                        foodItem: {
                          id: `scan_${Date.now()}`,
                          name: analyzedMealResult.foodName,
                          mealType: "Lunch",
                          calories: Number(analyzedMealResult.calories || 0),
                          sugar: Number(analyzedMealResult.sugar || 0),
                          protein: Number(analyzedMealResult.protein || 0),
                          carbs: Number(analyzedMealResult.carbs || 0),
                          fat: Number(analyzedMealResult.fat || 0),
                          servingSize: analyzedMealResult.servingSize,
                          imageUrl: analyzedMealResult.imageUrl,
                          safeForDiabetic: analyzedMealResult.safeForDiabetic,
                          glycemicIndex: analyzedMealResult.glycemicIndex || 50,
                          aiSummary: analyzedMealResult.dietRecommendation,
                          healthyAlternative: analyzedMealResult.healthyAlternative
                        }
                      });
                    }}
                    className="flex-1 min-w-[200px] py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ✓ Did You Eat This Meal? (Final Decision)
                  </button>

                  <button
                    onClick={() => handleAddAnalyzedMealToDiet(false)}
                    className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    📋 Add to Plan (Not Eaten Yet)
                  </button>

                  <button
                    onClick={() => {
                      setCorrectionName(analyzedMealResult.foodName);
                      setCorrectionCalories(String(analyzedMealResult.calories));
                      setCorrectionSugar(String(analyzedMealResult.sugar));
                      setShowCorrectionModal(true);
                    }}
                    className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    Correct AI
                  </button>

                  <button
                    onClick={() => {
                      setAnalyzedMealResult(null);
                      setMealImageBase64(null);
                      setManualFoodText("");
                      triggerToast("🗑️ Meal scan discarded and cleared from screen.");
                    }}
                    className="px-4 py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Discard / Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: PACKAGED FOOD & BARCODE SCANNER */}
        {/* ================================================================= */}
        {activeTab === "barcode_scanner" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Packaged Food & Additives Scanner
                </h2>
                <button
                  type="button"
                  onClick={() => setExplainFeatureKey("packaged_food")}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain This Feature</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Scan barcode or ingredients label with live camera. Correlates with OpenFoodFacts and FSSAI/WHO E-number toxicity index.
              </p>
            </div>

            {/* Contextual On-Page Page Guide for Packaged Food Scanner */}
            <PageGuideBanner
              pageKey="barcode_scanner"
              language={currentLanguage}
              onOpenFullGuide={() => setExplainFeatureKey("packaged_food")}
              accentColor="amber"
            />

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
              {/* Dual Scan & Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => openCamera("barcode_scanner", "Scan Barcode or Label", "barcode")}
                  className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Scan Barcode / Label (Live Camera)
                </button>

                <label
                  htmlFor="package-food-upload-input"
                  className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  Upload Package / Label Photo
                  <input
                    id="package-food-upload-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePackageFileUpload}
                  />
                </label>
              </div>

              {/* Package Photo Preview Card */}
              {packageImageBase64 && (
                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <img
                      src={packageImageBase64}
                      alt="Uploaded Package"
                      className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Package Photo Attached
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Analyzing packaging, barcode OCR & ingredients label with AI vision
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => executeBarcodeScan(undefined, packageImageBase64)}
                      disabled={isScanningBarcode}
                      className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isScanningBarcode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      Re-Analyze
                    </button>
                    <button
                      onClick={() => {
                        setPackageImageBase64(null);
                        setScannedProductResult(null);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                      title="Clear photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Or enter barcode manually</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Enter 13-digit barcode number (e.g. 8901058852301)"
                  className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={() => executeBarcodeScan()}
                  disabled={isScanningBarcode || !barcodeInput.trim()}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isScanningBarcode ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanBarcode className="w-4 h-4" />}
                  Search Barcode
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs text-slate-400">Popular packaged food presets:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PACKAGED_PRODUCTS_DATASET.slice(0, 4).map((prod) => (
                    <button
                      key={prod.barcode}
                      onClick={() => {
                        setBarcodeInput(prod.barcode);
                        executeBarcodeScan(prod.barcode);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-2 group transition-colors cursor-pointer"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.productName}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-bold text-white block truncate">{prod.productName}</span>
                        <span className="text-[10px] text-slate-400">{prod.brand}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {scannedProductResult && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-xl space-y-6 shadow-2xl animate-slideUp">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-4">
                    {(scannedProductResult.product?.imageUrl || packageImageBase64) && (
                      <img
                        src={scannedProductResult.product?.imageUrl || packageImageBase64}
                        alt="Product"
                        className="w-16 h-16 rounded-2xl object-cover border border-white/15 shadow-md"
                      />
                    )}
                    <div>
                      <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest">
                        {scannedProductResult.product?.brand || "Packaged Goods"}
                      </span>
                      <h3 className="text-xl font-bold text-white">{scannedProductResult.product?.productName}</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Barcode: {scannedProductResult.product?.barcode || "Vision OCR Detected"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center min-w-[70px]">
                      <span className="text-[10px] text-slate-400 uppercase block">Nutri-Score</span>
                      <span className={`text-xl font-black ${
                        ["A", "B"].includes(scannedProductResult.product?.nutriscoreGrade || scannedProductResult.product?.nutriScore)
                          ? "text-emerald-400"
                          : ["C"].includes(scannedProductResult.product?.nutriscoreGrade || scannedProductResult.product?.nutriScore)
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}>
                        {scannedProductResult.product?.nutriscoreGrade || scannedProductResult.product?.nutriScore || "C"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center min-w-[70px]">
                      <span className="text-[10px] text-slate-400 uppercase block">NOVA Group</span>
                      <span className={`text-xl font-black ${
                        (scannedProductResult.product?.novaGroup || 4) <= 2
                          ? "text-emerald-400"
                          : (scannedProductResult.product?.novaGroup || 4) === 3
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}>
                        {scannedProductResult.product?.novaGroup || "4"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nutritional Profile per 100g */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Calories / 100g</span>
                    <p className="text-lg font-bold text-emerald-400">{scannedProductResult.product?.caloriesPer100g || 320} kcal</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Sugar / 100g</span>
                    <p className={`text-lg font-bold ${(scannedProductResult.product?.sugarPer100g || 0) > 10 ? "text-rose-400" : "text-amber-300"}`}>
                      {scannedProductResult.product?.sugarPer100g || 0}g
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Fat / 100g</span>
                    <p className="text-lg font-bold text-slate-200">{scannedProductResult.product?.fatPer100g || 0}g</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-slate-400">Salt / Sodium</span>
                    <p className="text-lg font-bold text-cyan-300">{scannedProductResult.product?.saltPer100g || 0}g</p>
                  </div>
                </div>

                {/* Safety Verdict / Health Warning */}
                {scannedProductResult.safetyVerdict && (
                  <div className={`p-4 rounded-xl border space-y-1.5 text-xs leading-relaxed ${
                    scannedProductResult.safetyVerdict.safeToConsumeDaily
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-200"
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      {scannedProductResult.safetyVerdict.safeToConsumeDaily ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>WHO & FSSAI Safety Assessment: Moderate / Safe Profile</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>WHO & FSSAI Safety Warning: Ultra-Processed or High Additive Load</span>
                        </>
                      )}
                    </div>
                    {scannedProductResult.safetyVerdict.ultraProcessedWarning && (
                      <p className="text-slate-300">{scannedProductResult.safetyVerdict.ultraProcessedWarning}</p>
                    )}
                    {scannedProductResult.safetyVerdict.highSugarWarning && (
                      <p className="text-amber-300">{scannedProductResult.safetyVerdict.highSugarWarning}</p>
                    )}
                  </div>
                )}

                {/* Detected Additives & Chemical E-Numbers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Detected Additives & Chemical E-Numbers
                    </h4>
                    <span className="text-xs text-slate-400">
                      {(scannedProductResult.analyzedAdditives || scannedProductResult.flaggedAdditives)?.length || 0} Additives Identified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(scannedProductResult.analyzedAdditives || scannedProductResult.flaggedAdditives)?.map((add: any, idx: number) => {
                      const isDanger = (add.dangerLevel || add.riskLevel) === "DANGER" || (add.dangerLevel || add.riskLevel) === "danger";
                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border space-y-1 ${
                            isDanger
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-white font-mono">{add.code}</strong>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              isDanger ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"
                            }`}>
                              {add.dangerLevel || add.riskLevel}
                            </span>
                          </div>
                          <p className="text-xs font-semibold">{add.name}</p>
                          <p className="text-[11px] text-slate-300">{add.risks || add.healthConcerns}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons: Final Decision, Add to Plan, Discard */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      setConsumptionDecisionModal({
                        isOpen: true,
                        source: "barcode_scanner",
                        foodItem: {
                          id: `prod_${Date.now()}`,
                          name: scannedProductResult.product?.productName || "Packaged Food",
                          mealType: "Snack",
                          calories: Number(scannedProductResult.product?.caloriesPer100g || 250),
                          sugar: Number(scannedProductResult.product?.sugarPer100g || 5),
                          protein: Number(scannedProductResult.product?.proteinPer100g || 3),
                          carbs: Number(scannedProductResult.product?.carbsPer100g || 30),
                          fat: Number(scannedProductResult.product?.fatPer100g || 8),
                          imageUrl: scannedProductResult.product?.imageUrl || packageImageBase64,
                          safeForDiabetic: (scannedProductResult.product?.sugarPer100g || 0) <= 5,
                          glycemicIndex: 65,
                          aiSummary: `Packaged food: ${scannedProductResult.product?.brand || ""}. NutriScore: ${scannedProductResult.product?.nutriscoreGrade || scannedProductResult.product?.nutriScore || "C"}, NOVA: ${scannedProductResult.product?.novaGroup || 4}.`
                        }
                      });
                    }}
                    className="flex-1 min-w-[200px] py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ✓ Did You Eat / Drink This? (Final Decision)
                  </button>

                  <button
                    onClick={() => {
                      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const newMeal: MealLogItem = {
                        id: `prod_plan_${Date.now()}`,
                        name: scannedProductResult.product?.productName || "Packaged Food",
                        mealType: "Snack",
                        time: nowTime,
                        date: selectedDashboardDate || getTodayDateStr(),
                        calories: Number(scannedProductResult.product?.caloriesPer100g || 250),
                        sugar: Number(scannedProductResult.product?.sugarPer100g || 5),
                        protein: Number(scannedProductResult.product?.proteinPer100g || 3),
                        carbs: Number(scannedProductResult.product?.carbsPer100g || 30),
                        fat: Number(scannedProductResult.product?.fatPer100g || 8),
                        safeForDiabetic: (scannedProductResult.product?.sugarPer100g || 0) <= 5,
                        imageUrl: scannedProductResult.product?.imageUrl || packageImageBase64,
                        status: "planned",
                        aiSummary: `Planned consumption of ${scannedProductResult.product?.brand || ""} ${scannedProductResult.product?.productName}.`,
                        glycemicIndex: 65
                      };
                      saveMealsToStorage([newMeal, ...todayMeals]);
                      triggerToast(`📋 Saved! "${newMeal.name}" added to Today's Planned Meals.`);
                    }}
                    className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    📋 Add to Plan (Not Eaten Yet)
                  </button>

                  <button
                    onClick={() => {
                      setScannedProductResult(null);
                      setPackageImageBase64(null);
                      setBarcodeInput("");
                      triggerToast("🗑️ Scanned product discarded and cleared from screen.");
                    }}
                    className="px-4 py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Discard / Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 4: SMART FRIDGE & VOICE CHEF ASSISTANT */}
        {/* ================================================================= */}
        {activeTab === "smart_fridge" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Smart Fridge & AI Voice Chef Assistant
                </h2>
                <button
                  type="button"
                  onClick={() => setExplainFeatureKey("smart_fridge")}
                  className="px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain This Feature</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Scan fridge shelves with live camera or list ingredients. AI generates step-by-step recipes and reads them aloud hands-free while you cook!
              </p>
            </div>

            {/* Contextual On-Page Page Guide for Smart Fridge & Voice Chef */}
            <PageGuideBanner
              pageKey="smart_fridge"
              language={currentLanguage}
              onOpenFullGuide={() => setExplainFeatureKey("smart_fridge")}
              accentColor="cyan"
            />

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
              {/* Dual Scan/Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => openCamera("smart_fridge", "Scan Fridge Shelves", "fridge")}
                  className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  Live Camera Shelf Scan
                </button>

                <label
                  htmlFor="fridge-upload-input"
                  className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  Upload Fridge Group Photo
                  <input
                    id="fridge-upload-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFridgeFileUpload}
                  />
                </label>
              </div>

              {/* Sample Group Photo Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Or test with realistic fridge group photos:
                  </span>
                  <span className="text-[10px] text-emerald-400">Multi-Product Vision Active</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      label: "🥦 Veggies & Greens (15 items)",
                      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                      label: "🥚 Eggs & Pantry Essentials",
                      url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                      label: "🍎 Fresh Fruits & Berries",
                      url: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=600&q=80"
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFridgeImageBase64(preset.url);
                        executeFridgeScan(preset.url);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left group transition-all"
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-8 h-8 rounded-lg object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[11px] font-bold text-slate-200 block truncate">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Fridge Image Preview */}
              {fridgeImageBase64 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <img
                      src={fridgeImageBase64}
                      alt="Fridge Capture"
                      className="w-12 h-12 rounded-lg object-cover border border-emerald-500/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Group Photo Attached</span>
                      <span className="text-[10px] text-emerald-400">Ready for Multi-Item AI Extraction</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFridgeImageBase64(null);
                      setFridgeResults(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Clear Photo
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Or list available ingredients separated by commas:
                </label>
                <textarea
                  rows={2}
                  value={fridgeInputText}
                  onChange={(e) => setFridgeInputText(e.target.value)}
                  placeholder="List available ingredients separated by commas (e.g. egg, onion, tomato, rice)..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-400">Quick fridge presets:</span>
                {[
                  "egg, onion, tomato, green chili",
                  "dal, lentils, garlic, tomato, onion",
                  "carrot, beans, cabbage, onion",
                  "ginger, garlic, pepper, lemon"
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setFridgeInputText(preset);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
                  >
                    {preset.split(",").slice(0, 3).join(", ")}...
                  </button>
                ))}
              </div>

              <button
                onClick={() => executeFridgeScan()}
                disabled={isAnalyzingFridge || (!fridgeInputText.trim() && !fridgeImageBase64)}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
              >
                {isAnalyzingFridge ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Group Photo & Formulating Recipes...
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    Analyze Fridge & Generate Recipes with Voice Chef
                  </>
                )}
              </button>
            </div>

            {fridgeResults && (
              <div className="space-y-6">
                {/* Dedicated Group Photo Recognition Report */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/40 border border-emerald-500/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📸</span>
                      <h4 className="text-sm font-bold text-white">Group Photo Recognition Report</h4>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {fridgeResults.totalItemsDetected || fridgeResults.detectedIngredients?.length} Items Extracted
                      </span>
                    </div>
                    {fridgeImageBase64 && (
                      <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        ✓ Multi-Shelf Vision Scan
                      </span>
                    )}
                  </div>

                  {fridgeResults.groupSummary && (
                    <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                      {fridgeResults.groupSummary}
                    </p>
                  )}

                  {fridgeResults.freshnessInsight && (
                    <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      <span className="text-sm">⏳</span>
                      <span><strong>Freshness Priority:</strong> {fridgeResults.freshnessInsight}</span>
                    </div>
                  )}

                  {/* Interactive Ingredient Chips */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                      Detected group ingredients (click × to remove):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {fridgeResults.detectedIngredients?.map((ing: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                        >
                          {ing}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = fridgeResults.detectedIngredients.filter((_: any, idx: number) => idx !== i);
                              setFridgeResults({ ...fridgeResults, detectedIngredients: updated });
                              setFridgeInputText(updated.join(", "));
                            }}
                            className="hover:text-red-400 transition-colors ml-0.5 text-xs font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Suggested Recipes for You</h3>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {fridgeResults.matchedRecipes?.length || 0} Dishes Formulated
                  </span>
                </div>

                <div className="space-y-6">
                  {fridgeResults.matchedRecipes?.map((rec: any) => (
                    <div
                      key={rec.id}
                      className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-4">
                          {rec.imageUrl && (
                            <img
                              src={rec.imageUrl}
                              alt={rec.title}
                              className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                            />
                          )}
                          <div>
                            <h4 className="text-xl font-bold text-white">{rec.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {rec.prepTimeMinutes} mins prep
                              </span>
                              <span>•</span>
                              <span className="text-emerald-400 font-semibold">{rec.caloriesPerServing} kcal</span>
                              <span>•</span>
                              <span className="text-amber-400">Sugar: {rec.sugarGrams}g</span>
                            </div>
                          </div>
                        </div>

                        {rec.missingIngredientsToElevate?.length > 0 && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-[11px] text-emerald-300">
                            <strong>⭐ Elevator Tip:</strong> Add{" "}
                            <span className="underline font-semibold">
                              {rec.missingIngredientsToElevate.join(", ")}
                            </span>{" "}
                            to boost flavor & antioxidants!
                          </div>
                        )}
                      </div>

                      <VoiceChefAssistant
                        recipeTitle={rec.title}
                        steps={rec.instructions || []}
                      />

                      <div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                          Step-by-Step Cooking Guide:
                        </span>
                        <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                          {rec.instructions?.map((step: string, i: number) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {rec.chefTip && (
                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                          <strong>Chef's Nutritional Secret:</strong> {rec.chefTip}
                        </div>
                      )}

                      {/* Recipe Consumption Decision Actions */}
                      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
                        <button
                          onClick={() => {
                            setConsumptionDecisionModal({
                              isOpen: true,
                              source: "smart_fridge",
                              foodItem: {
                                id: `fridge_rec_${rec.id}_${Date.now()}`,
                                name: rec.title,
                                mealType: "Dinner",
                                calories: Number(rec.caloriesPerServing) || 350,
                                sugar: Number(rec.sugarGrams) || 4,
                                protein: Number(rec.proteinGrams) || 15,
                                carbs: Number(rec.carbsGrams) || 45,
                                fat: Number(rec.fatGrams) || 10,
                                imageUrl: rec.imageUrl,
                                safeForDiabetic: (rec.sugarGrams || 0) <= 6,
                                glycemicIndex: 45,
                                aiSummary: `Smart Fridge Recipe: ${rec.title}. Step-by-step cooked meal. ${rec.chefTip || ""}`
                              }
                            });
                          }}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          ✓ I Cooked & Ate This! (Final Decision)
                        </button>

                        <button
                          onClick={() => {
                            const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            const newMeal: MealLogItem = {
                              id: `fridge_plan_${Date.now()}`,
                              name: rec.title,
                              mealType: "Dinner",
                              time: nowTime,
                              date: selectedDashboardDate || getTodayDateStr(),
                              calories: Number(rec.caloriesPerServing) || 350,
                              sugar: Number(rec.sugarGrams) || 4,
                              protein: Number(rec.proteinGrams) || 15,
                              carbs: Number(rec.carbsGrams) || 45,
                              fat: Number(rec.fatGrams) || 10,
                              safeForDiabetic: (rec.sugarGrams || 0) <= 6,
                              imageUrl: rec.imageUrl,
                              status: "planned",
                              aiSummary: `Planned home recipe: ${rec.title}.`
                            };
                            saveMealsToStorage([newMeal, ...todayMeals]);
                            triggerToast(`📋 Saved! "${rec.title}" added to Today's Planned Meals.`);
                          }}
                          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          📋 Add to Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 5: FOOD SAFETY & GOVERNMENT GRIEVANCE EMAIL DISPATCH */}
        {/* ================================================================= */}
        {activeTab === "food_safety" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Food Safety Grievance & Authority Dispatch
                  </h2>
                  <button
                    type="button"
                    onClick={() => setExplainFeatureKey("food_safety")}
                    className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explain This Feature</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Report substandard or adulterated food directly to official regulatory authorities (FSSAI, Kerala Food Safety, Consumer Forum).
                </p>
              </div>

              {isAdminLoggedIn && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin Oversight (Silu)
                  </span>
                </div>
              )}
            </div>

            {/* Contextual On-Page Page Guide for Food Safety Portal */}
            <PageGuideBanner
              pageKey="food_safety"
              language={currentLanguage}
              onOpenFullGuide={() => setExplainFeatureKey("food_safety")}
              accentColor="rose"
            />

            {complaintSuccessNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold">
                {complaintSuccessNotice}
              </div>
            )}

            {/* ADMIN CONSOLE VIEW (When logged in as silu / 12345 via common login) */}
            {isAdminLoggedIn ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <button
                    onClick={() => setAdminActiveSubTab("complaints")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      adminActiveSubTab === "complaints"
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Grievance Moderation & Email Dispatch ({complaintsList.length})
                  </button>
                  <button
                    onClick={() => setAdminActiveSubTab("ml_datasets")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      adminActiveSubTab === "ml_datasets"
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Backend ML & 10 Datasets Engine
                  </button>
                </div>

                {/* Subtab A: Complaints Moderation with Authority Email Dispatch */}
                {adminActiveSubTab === "complaints" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white">Registered Consumer Complaints</h3>
                      <button onClick={fetchComplaints} className="text-xs text-emerald-400 hover:underline">
                        Refresh List
                      </button>
                    </div>

                    {complaintsList.length === 0 ? (
                      <p className="text-xs text-slate-400">No complaints registered yet.</p>
                    ) : (
                      complaintsList.map((c) => (
                        <div
                          key={c.id}
                          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-amber-400">
                                Tracking Ref: {c.trackingNumber}
                              </span>
                              <h4 className="text-base font-bold text-white">{c.productName}</h4>
                              <span className="text-xs text-slate-400">{c.brandOrEstablishment}</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              c.status === "APPROVED_AND_DISPATCHED"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}>
                              {c.status === "APPROVED_AND_DISPATCHED" ? "✓ APPROVED: SEND DONE (DEMO)" : "PENDING REVIEW"}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white block mb-0.5">Reported Issue:</strong>
                            {c.description}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5">
                            <div>Target Authority: <strong className="text-white">{c.selectedAuthorityName}</strong></div>
                            <div>Authority Email: <strong className="text-amber-300 font-mono">{c.authorityEmail}</strong></div>
                            <div>Complainant: <strong className="text-white">{c.complainantName}</strong></div>
                            <div>Phone: <strong className="text-white">{c.complainantPhone || "Not provided"}</strong></div>
                          </div>

                          {c.adminNotes && (
                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                              <strong>Admin Notice:</strong> {c.adminNotes}
                            </div>
                          )}

                          {c.status !== "APPROVED_AND_DISPATCHED" ? (
                            <button
                              onClick={() => handleAdminApproveAndDispatchEmail(c.id)}
                              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve Complaint & Mark Send Done (Demo Mode)
                            </button>
                          ) : (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Send Done: Official dossier approved for {c.selectedAuthorityName}
                              </span>
                              <button
                                onClick={() => {
                                  setDispatchedEmailReceipt(c.emailDispatch || {
                                    toAuthority: c.selectedAuthorityName,
                                    recipientEmail: c.authorityEmail,
                                    trackingReference: c.trackingNumber,
                                    sentTimestamp: c.timestamp,
                                    subject: `[OFFICIAL NOTICE] Food Safety Violation Dossier - Ref #${c.trackingNumber}`
                                  });
                                  setEmailDispatchModalOpen(true);
                                }}
                                className="text-[11px] underline text-emerald-400 hover:text-white"
                              >
                                View "Send Done" Receipt
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Subtab B: Backend ML & 10 Datasets Engine */}
                {adminActiveSubTab === "ml_datasets" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-base font-bold text-white">Backend Machine Learning Performance</h3>
                          <p className="text-xs text-slate-400">Internal neural weights across 10 datasets & 15,960+ labeled photos</p>
                        </div>
                        <button
                          onClick={handleRunTraining}
                          disabled={isTraining}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
                        >
                          {isTraining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                          Run Training Epochs
                        </button>
                      </div>

                      {trainingNotice && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold">
                          {trainingNotice}
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Model Accuracy</span>
                          <p className="text-xl font-bold text-emerald-400">
                            {mlData?.metrics?.currentAccuracy || 98.4}%
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Loss Metric</span>
                          <p className="text-xl font-bold text-cyan-400">
                            {mlData?.metrics?.lossMetric || 0.018}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Learned Corrections</span>
                          <p className="text-xl font-bold text-amber-400">
                            {mlData?.metrics?.correctionsLearnedCount || 0}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Labeled Photos</span>
                          <p className="text-xl font-bold text-purple-400">15,960+</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Public Grievance Submission Form */
              <form onSubmit={handleSubmitComplaint} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">
                  Register Formal Safety Complaint
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Product or Food Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={complaintForm.productName}
                      onChange={(e) => setComplaintForm({ ...complaintForm, productName: e.target.value })}
                      placeholder="Enter packaged product or restaurant dish name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Brand or Restaurant / Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={complaintForm.brandOrEstablishment}
                      onChange={(e) => setComplaintForm({ ...complaintForm, brandOrEstablishment: e.target.value })}
                      placeholder="Enter manufacturer or hotel name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Batch / Lot Number (From Packaging)
                    </label>
                    <input
                      type="text"
                      value={complaintForm.batchNumber}
                      onChange={(e) => setComplaintForm({ ...complaintForm, batchNumber: e.target.value })}
                      placeholder="Batch / lot number (if printed)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry Date Printed
                    </label>
                    <input
                      type="date"
                      value={complaintForm.expiryDate}
                      onChange={(e) => setComplaintForm({ ...complaintForm, expiryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Regulatory Authority for Submission *
                  </label>
                  <select
                    value={complaintForm.selectedAuthorityId}
                    onChange={(e) => setComplaintForm({ ...complaintForm, selectedAuthorityId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="auth_kerala_cfs">Commissionerate of Food Safety, Kerala (foodsafetykerala@gmail.com)</option>
                    <option value="auth_fssai_national">FSSAI - National Food Safety Authority of India (fssai-enforcement@nic.in)</option>
                    <option value="auth_consumer_nch">National Consumer Helpline (consumer-helpline@nic.in)</option>
                    <option value="auth_legal_metrology">Department of Legal Metrology (legal-metrology@kerala.gov.in)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Issue Description & Incident Details *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    placeholder="Describe the safety violation, contamination, foreign object, foul odor, or defect in detail..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Complainant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={complaintForm.complainantName}
                      onChange={(e) => setComplaintForm({ ...complaintForm, complainantName: e.target.value })}
                      placeholder="Enter complainant name for official records"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number (For Verification)
                    </label>
                    <input
                      type="text"
                      value={complaintForm.complainantPhone}
                      onChange={(e) => setComplaintForm({ ...complaintForm, complainantPhone: e.target.value })}
                      placeholder="Enter active contact number for inspector follow-up"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-rose-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Submit Grievance to Safety Admin for Official Verification & Email Dispatch
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      {/* =================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080d19]/95 backdrop-blur-xl border-t border-white/10 py-2 px-3 flex items-center justify-around md:hidden">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            activeTab === "home" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{currentLanguage === "ml" || currentLanguage === "en_ml" ? "ഹോം" : currentLanguage === "hi" || currentLanguage === "en_hi" ? "होम" : "Home"}</span>
        </button>

        <button
          onClick={() => navigateTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            activeTab === "dashboard" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{currentLanguage === "ml" || currentLanguage === "en_ml" ? "ഡയറ്റ്" : currentLanguage === "hi" || currentLanguage === "en_hi" ? "डाइट" : "Diet"}</span>
        </button>

        <button
          onClick={() => navigateTab("meal_scanner")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            activeTab === "meal_scanner" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{currentLanguage === "ml" || currentLanguage === "en_ml" ? "സ്കാൻ" : currentLanguage === "hi" || currentLanguage === "en_hi" ? "स्कैन" : "Scan"}</span>
        </button>

        <button
          onClick={() => navigateTab("barcode_scanner")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            activeTab === "barcode_scanner" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <ScanBarcode className="w-4 h-4" />
          <span>{currentLanguage === "ml" || currentLanguage === "en_ml" ? "പാക്കറ്റ്" : currentLanguage === "hi" || currentLanguage === "en_hi" ? "पैकेज" : "Package"}</span>
        </button>

        <button
          onClick={() => navigateTab("smart_fridge")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            activeTab === "smart_fridge" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Refrigerator className="w-4 h-4" />
          <span>{currentLanguage === "ml" || currentLanguage === "en_ml" ? "ഫ്രിഡ്ജ്" : currentLanguage === "hi" || currentLanguage === "en_hi" ? "फ्रिज" : "Fridge"}</span>
        </button>

        <button
          onClick={() => navigateTab("food_safety")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            activeTab === "food_safety" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{currentLanguage === "ml" || currentLanguage === "en_ml" ? "സുരക്ഷ" : currentLanguage === "hi" || currentLanguage === "en_hi" ? "सुरक्षा" : "Safety"}</span>
        </button>
      </nav>

      {/* =================================================================== */}
      {/* LIVE CAMERA CAPTURE MODAL */}
      {/* =================================================================== */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        title={cameraTitle}
        overlayType={cameraOverlay}
      />

      {/* =================================================================== */}
      {/* OFFICIAL GOVERNMENT EMAIL DISPATCH RECEIPT MODAL (DEMO SEND DONE) */}
      {/* =================================================================== */}
      {emailDispatchModalOpen && dispatchedEmailReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Authority Notice: Send Done</h3>
                  <span className="text-[10px] font-mono text-emerald-400">Status: Send Done (Demo Mode Simulation)</span>
                </div>
              </div>
              <button onClick={() => setEmailDispatchModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong>Demo Safe Mode:</strong> Status marked as <strong>Send Done</strong>. Real outbound email sending is safely disabled for this presentation.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">TO AUTHORITY:</span>
                <span className="text-emerald-400 font-bold">{dispatchedEmailReceipt.toAuthority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OFFICIAL INBOX:</span>
                <span className="text-amber-300 font-bold">{dispatchedEmailReceipt.recipientEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CC LIST:</span>
                <span className="text-slate-300">district-food-inspector@nic.in, legal-enforcement@fssai.gov.in</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TRACKING REF:</span>
                <span className="text-white font-bold">{dispatchedEmailReceipt.trackingReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">STATUS MARKED:</span>
                <span className="text-emerald-400 font-bold">SEND DONE (DEMO SUCCESS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TIME TRANSMITTED:</span>
                <span className="text-slate-300">{dispatchedEmailReceipt.sentTimestamp || new Date().toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-white/10 text-slate-300 leading-relaxed text-[11px] font-sans">
                <strong>Subject:</strong> {dispatchedEmailReceipt.subject}
                <p className="mt-1 text-slate-400">
                  Full formal legal show-cause notice & complainant evidence dossier have been reviewed by Admin and logged into official records.
                </p>
              </div>
            </div>

            <button
              onClick={() => setEmailDispatchModalOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Done & Close Receipt (Send Done Verified)
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MANUAL ADD MEAL MODAL */}
      {/* =================================================================== */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Log Custom Meal</h3>
                <p className="text-[11px] text-slate-400">Add nutrition directly to today's diary</p>
              </div>
              <button onClick={() => setShowAddMealModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomMeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Meal / Food Name *</label>
                <input
                  type="text"
                  required
                  value={customMealForm.name}
                  onChange={(e) => setCustomMealForm({ ...customMealForm, name: e.target.value })}
                  placeholder="Enter meal or food item name"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Meal Timing</label>
                  <select
                    value={customMealForm.mealType}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, mealType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Calories (kcal) *</label>
                  <input
                    type="number"
                    required
                    value={customMealForm.calories}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, calories: e.target.value })}
                    placeholder="Enter calories in kcal"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Sugar (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMealForm.sugar}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, sugar: e.target.value })}
                    placeholder="Sugar (g)"
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMealForm.protein}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, protein: e.target.value })}
                    placeholder="Protein (g)"
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMealForm.carbs}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, carbs: e.target.value })}
                    placeholder="Carbs (g)"
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMealForm.fat}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, fat: e.target.value })}
                    placeholder="Fat (g)"
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Add Meal to Diary
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* COMMON AUTHENTICATION MODAL (Admin & Regular Users Login/Register) */}
      {/* =================================================================== */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b101c] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-scaleUp my-8">
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">
                    {authMode === "register" ? "Create Your Health Profile" : "Sign In to AIFood"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Unified Access
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {authMode === "register"
                    ? "Enter your body metrics so AI can prepare customized calorie budgets & sugar safety rules!"
                    : "Enter your username/email and password to access your dashboard"}
                </p>
              </div>
              <button onClick={() => setAuthModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {authPromptReason && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Why registration is required:</strong> {authPromptReason}
                </div>
              </div>
            )}

            {authErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {authErrorMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
              {authMode === "register" && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={authFormData.name}
                    onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {authMode === "login" ? "Email Address or Username" : "Email Address"}
                  </label>
                  <input
                    type="text"
                    required
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                    placeholder={authMode === "login" ? "Enter your email or username" : "Enter your email address"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authFormData.password}
                    onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              {authMode === "register" && (
                <>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Gender</label>
                      <select
                        value={authFormData.gender}
                        onChange={(e) => setAuthFormData({ ...authFormData, gender: e.target.value })}
                        className="w-full px-2.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Age</label>
                      <input
                        type="number"
                        required
                        value={authFormData.age}
                        onChange={(e) => setAuthFormData({ ...authFormData, age: e.target.value })}
                        placeholder="Age"
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        required
                        value={authFormData.weightKg}
                        onChange={(e) => setAuthFormData({ ...authFormData, weightKg: e.target.value })}
                        placeholder="Weight in kg"
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Height (cm)</label>
                      <input
                        type="number"
                        required
                        value={authFormData.heightCm}
                        onChange={(e) => setAuthFormData({ ...authFormData, heightCm: e.target.value })}
                        placeholder="Height in cm"
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Daily Activity</label>
                      <select
                        value={authFormData.activityLevel}
                        onChange={(e) => setAuthFormData({ ...authFormData, activityLevel: e.target.value })}
                        className="w-full px-2.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                      >
                        <option value="sedentary">Sedentary (Desk Job)</option>
                        <option value="light">Light Active (1-3 days exercise)</option>
                        <option value="moderate">Moderate Active (3-5 days workout)</option>
                        <option value="active">Very Active (Heavy training)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Primary Dietary Goal</label>
                    <select
                      value={authFormData.goal}
                      onChange={(e) => setAuthFormData({ ...authFormData, goal: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
                    >
                      <option value="weight_loss">Weight Loss (Calorie Deficit & Sugar ≤ 20g)</option>
                      <option value="diabetic_care">Diabetic Care (Glycemic & Insulin Control, Sugar ≤ 15g)</option>
                      <option value="muscle_gain">Muscle Building (High Protein Surplus)</option>
                      <option value="maintenance">Balanced Health Maintenance (Standard BMR)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Diet Preference</label>
                      <select
                        value={authFormData.dietaryPreference}
                        onChange={(e) => setAuthFormData({ ...authFormData, dietaryPreference: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                      >
                        <option value="non_veg">Non-Vegetarian (Halal/General)</option>
                        <option value="veg">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Known Allergies</label>
                      <select
                        value={authFormData.allergies}
                        onChange={(e) => setAuthFormData({ ...authFormData, allergies: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                      >
                        <option value="none">No Allergies</option>
                        <option value="lactose">Lactose / Dairy Intolerant</option>
                        <option value="gluten">Gluten / Celiac Sensitive</option>
                        <option value="peanuts">Peanut / Nut Allergy</option>
                        <option value="seafood">Seafood / Shellfish</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {authMode === "register" ? "Calculate My Body Metrics & Unlock App" : "Sign In to Dashboard"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "register" ? "login" : "register");
                    setAuthPromptReason("");
                    setAuthErrorMsg("");
                  }}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  {authMode === "register"
                    ? "Already registered? Sign In to your account"
                    : "Need a new account? Register & calculate body metrics"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* USER PROFILE MODAL */}
      {/* =================================================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Your Health Profile</h3>
                <span className="text-[11px] text-emerald-400">Scientifically Calculated BMR & Limits</span>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile({ ...userProfile, age: Number(e.target.value) })}
                    placeholder="Years"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={userProfile.weightKg}
                    onChange={(e) => setUserProfile({ ...userProfile, weightKg: Number(e.target.value) })}
                    placeholder="Weight (kg)"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Dietary Goal</label>
                <select
                  value={userProfile.goal}
                  onChange={(e) => {
                    const g = e.target.value;
                    let cal = 1850;
                    let sug = 20.0;
                    if (g === "weight_loss") { cal = 1600; sug = 20.0; }
                    if (g === "diabetic_care") { cal = 1800; sug = 15.0; }
                    if (g === "muscle_gain") { cal = 2400; sug = 35.0; }
                    setUserProfile({
                      ...userProfile,
                      goal: g,
                      dailyCalorieTarget: cal,
                      dailySugarLimitGrams: sug
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                >
                  <option value="weight_loss">Weight Loss (Calorie Deficit)</option>
                  <option value="diabetic_care">Diabetic Care (Low Sugar & Glycemic Control)</option>
                  <option value="muscle_gain">Muscle Building (High Protein)</option>
                  <option value="maintenance">Balanced Maintenance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-slate-400">Daily Calorie Target</span>
                  <p className="text-base font-bold text-emerald-400">{userProfile.dailyCalorieTarget} kcal</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-slate-400">Daily Sugar Limit</span>
                  <p className="text-base font-bold text-amber-400">{userProfile.dailySugarLimitGrams}g</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("aifood_user_session", JSON.stringify(userProfile));
                  }
                  setShowProfileModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Save Profile Changes
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 rotate-180" />
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CORRECTION / REINFORCEMENT LEARNING MODAL */}
      {/* =================================================================== */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Correct & Teach the AI</h3>
                <p className="text-xs text-slate-400">Your feedback fine-tunes our internal neural model</p>
              </div>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {correctionStatusMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold text-center">
                {correctionStatusMsg}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Actual Food / Dish Name</label>
                  <input
                    type="text"
                    value={correctionName}
                    onChange={(e) => setCorrectionName(e.target.value)}
                    placeholder="Enter actual food name"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={correctionCalories}
                      onChange={(e) => setCorrectionCalories(e.target.value)}
                      placeholder="Calories in kcal"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Sugar (grams)</label>
                    <input
                      type="number"
                      value={correctionSugar}
                      onChange={(e) => setCorrectionSugar(e.target.value)}
                      placeholder="Sugar in grams"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveCorrectionToML}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <BrainCircuit className="w-4 h-4" />
                  Save Correction & Update AI Model
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DETAILED AI NUTRITIONAL ANALYSIS & SUMMARY MODAL */}
      {/* =================================================================== */}
      {selectedMealDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                {selectedMealDetailModal.imageUrl ? (
                  <img
                    src={selectedMealDetailModal.imageUrl}
                    alt={selectedMealDetailModal.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/15 shadow shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Utensils className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-white">{selectedMealDetailModal.name}</h3>
                  <span className="text-xs text-slate-400">
                    {selectedMealDetailModal.mealType} • {selectedMealDetailModal.time}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMealDetailModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Consumption Status */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2">
                {selectedMealDetailModal.status === "consumed" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Consumed at {selectedMealDetailModal.consumedAt || selectedMealDetailModal.time}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⏳ Planned (Not eaten yet)
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  handleToggleMealStatus(selectedMealDetailModal.id);
                  setSelectedMealDetailModal({
                    ...selectedMealDetailModal,
                    status: selectedMealDetailModal.status === "consumed" ? "planned" : "consumed",
                    consumedAt: selectedMealDetailModal.status === "consumed" ? undefined : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  });
                }}
                className="text-xs underline text-cyan-400 hover:text-white font-medium"
              >
                {selectedMealDetailModal.status === "consumed" ? "Mark as Planned" : "Mark as Consumed (Done)"}
              </button>
            </div>

            {/* Nutrition Macro Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase">Calories</span>
                <p className="text-lg font-black text-emerald-400">{selectedMealDetailModal.calories} kcal</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase">Sugar</span>
                <p className={`text-lg font-black ${selectedMealDetailModal.sugar > 10 ? "text-rose-400" : "text-amber-400"}`}>
                  {selectedMealDetailModal.sugar}g
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase">Protein</span>
                <p className="text-lg font-black text-cyan-400">{selectedMealDetailModal.protein}g</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase">Carbohydrates</span>
                <p className="text-lg font-black text-white">{selectedMealDetailModal.carbs}g</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase">Fats</span>
                <p className="text-lg font-black text-white">{selectedMealDetailModal.fat}g</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase">Glycemic Index</span>
                <p className="text-lg font-black text-purple-400">{selectedMealDetailModal.glycemicIndex || 50}</p>
              </div>
            </div>

            {/* Diabetic Safety Assessment */}
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
              selectedMealDetailModal.safeForDiabetic
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/20 text-amber-300"
            }`}>
              {selectedMealDetailModal.safeForDiabetic ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span><strong>Diabetic Safe:</strong> Low sugar and moderate glycemic impact. Safe for glycemic management.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span><strong>Monitor Sugar:</strong> Sugar content exceeds 6g. Diabetic users should moderate portion size.</span>
                </>
              )}
            </div>

            {/* Saved AI Clinical Summary & Advice */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs leading-relaxed">
              <strong className="text-white block font-bold">Clinical AI Diet Analysis & Advice:</strong>
              <p className="text-slate-300">
                {selectedMealDetailModal.aiSummary || "Nutritional analysis based on ICMR & NIN food composition database."}
              </p>
              {selectedMealDetailModal.recipeTip && (
                <div className="pt-2 border-t border-white/10 text-cyan-300">
                  <strong>Nutritional Tip:</strong> {selectedMealDetailModal.recipeTip}
                </div>
              )}
            </div>

            {/* Healthier Alternatives */}
            {selectedMealDetailModal.healthyAlternative && (
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                <strong className="block text-cyan-300 font-semibold mb-1">Healthier Alternatives:</strong>
                {selectedMealDetailModal.healthyAlternative}
              </div>
            )}

            <button
              onClick={() => setSelectedMealDetailModal(null)}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close Nutritional Report
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FOOD CONSUMPTION FINAL DECISION ALERT MODAL */}
      {/* =================================================================== */}
      {consumptionDecisionModal && consumptionDecisionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0b1120] border-2 border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl shadow-emerald-950/50 animate-scaleUp">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Final Decision Required
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Did you actually eat or drink this?
                  </h3>
                  <p className="text-xs text-slate-400">
                    ഭക്ഷണം കഴിച്ചോ ഇല്ലയോ എന്ന് ഉറപ്പ് വരുത്തുക (Confirm status)
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleConfirmConsumptionDecision("preview")}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Keep Previewing"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Food Item Summary Preview */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center gap-3.5">
                {consumptionDecisionModal.foodItem.imageUrl ? (
                  <img
                    src={consumptionDecisionModal.foodItem.imageUrl}
                    alt={consumptionDecisionModal.foodItem.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/15 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-2xl shrink-0">
                    🍽️
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {consumptionDecisionModal.source === "meal_scanner"
                      ? "AI Camera / Meal Scan"
                      : consumptionDecisionModal.source === "barcode_scanner"
                      ? "Packaged Food / Additives"
                      : consumptionDecisionModal.source === "smart_fridge"
                      ? "Smart Fridge Recipe"
                      : "Personalized AI Meal Plan"}
                  </span>
                  <h4 className="text-lg font-bold text-white truncate">
                    {consumptionDecisionModal.foodItem.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-emerald-400 font-extrabold text-sm">
                      {consumptionDecisionModal.foodItem.calories} kcal
                    </span>
                    <span className="text-slate-400">
                      Sugar: <strong className="text-amber-400">{consumptionDecisionModal.foodItem.sugar}g</strong>
                    </span>
                    {consumptionDecisionModal.foodItem.protein !== undefined && (
                      <span className="text-slate-400">
                        Protein: <strong className="text-cyan-300">{consumptionDecisionModal.foodItem.protein}g</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {consumptionDecisionModal.foodItem.aiSummary && (
                <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5 line-clamp-2">
                  {consumptionDecisionModal.foodItem.aiSummary}
                </p>
              )}
            </div>

            {/* 3 Decision Actions */}
            <div className="space-y-2.5 pt-1">
              {/* Option 1: YES, I ATE THIS */}
              <button
                onClick={() => handleConfirmConsumptionDecision("consumed")}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-between hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <CheckCircle2 className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block font-black text-sm">✓ Yes, I Ate / Drank This!</span>
                    <span className="block text-[11px] font-semibold text-slate-900/80">
                      Confirm & add +{consumptionDecisionModal.foodItem.calories} kcal to today's consumed total
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Option 2: NO, JUST PREVIEWING / RESEARCHING */}
              <button
                onClick={() => handleConfirmConsumptionDecision("preview")}
                className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Eye className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block font-bold text-xs text-white">👁️ No, Just Previewing / Researching</span>
                    <span className="block text-[11px] text-slate-400">
                      Keep data visible on screen without adding any calories or sugar
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-cyan-400 font-mono">Keep Visible</span>
              </button>

              {/* Option 3: DISCARD / CLEAR FROM SCREEN */}
              <button
                onClick={() => handleConfirmConsumptionDecision("discard")}
                className="w-full p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                🗑️ Discard & Clear From Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPLAIN THIS FEATURE INTERACTIVE MULTILINGUAL MODAL */}
      <ExplainFeatureModal
        isOpen={explainFeatureKey !== null}
        feature={explainFeatureKey}
        language={currentLanguage}
        onLanguageChange={changeLanguage}
        onClose={() => setExplainFeatureKey(null)}
        onNavigateToFeature={(feat) => {
          setExplainFeatureKey(null);
          if (feat === "exercise_engine") {
            setActiveTab("dashboard");
            setDietDashboardSubTab("routine_exercise");
          } else if (feat === "diet_dashboard") {
            setActiveTab("dashboard");
          } else {
            navigateTab(feat as any);
          }
        }}
      />
    </div>
  );
}
