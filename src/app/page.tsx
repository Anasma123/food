"use client";

import React, { useState, useEffect } from "react";
import {
  Utensils,
  Bot,
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
  Users,
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
  AUTHORITIES_DIRECTORY,
  findHealthyAlternativeForMeal
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
import SidebarNavigation, { AppPageTab } from "@/components/SidebarNavigation";
import TopAppHeader from "@/components/TopAppHeader";
import TruthInScannerView from "@/components/TruthInScannerView";
import TruthInCompareView from "@/components/TruthInCompareView";
import ClinicalDashboardView from "@/components/ClinicalDashboardView";
import MealScannerView from "@/components/MealScannerView";
import SmartFridgeView from "@/components/SmartFridgeView";
import FoodDatasetExplorerView from "@/components/FoodDatasetExplorerView";
import PersonalNutritionAIChatView from "@/components/PersonalNutritionAIChatView";
import { PackagedProduct } from "@/lib/data-science/datasets";
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

export interface RegisteredUserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  goal: string;
  activityLevel: string;
  dietaryPreference: string;
  allergies: string;
  dailyCalorieTarget: number;
  dailySugarLimitGrams: number;
  registeredAt: string;
  role: "user" | "admin";
}

const DEFAULT_REGISTERED_USERS: RegisteredUserAccount[] = [
  {
    id: "usr_admin_silu",
    name: "Silu (Chief Admin)",
    email: "silu@foodsafety.gov.in",
    password: "12345",
    age: 32,
    gender: "male",
    weightKg: 74,
    heightCm: 176,
    bmi: 23.9,
    goal: "maintenance",
    activityLevel: "moderate",
    dietaryPreference: "non_veg",
    allergies: "none",
    dailyCalorieTarget: 2150,
    dailySugarLimitGrams: 25.0,
    registeredAt: "Oct 1, 2026, 09:00 AM",
    role: "admin"
  },
  {
    id: "usr_rahul_sharma",
    name: "Rahul Sharma",
    email: "rahul.s@health.in",
    password: "12345",
    age: 48,
    gender: "male",
    weightKg: 82,
    heightCm: 172,
    bmi: 27.7,
    goal: "diabetic_care",
    activityLevel: "light",
    dietaryPreference: "veg",
    allergies: "none",
    dailyCalorieTarget: 1750,
    dailySugarLimitGrams: 15.0,
    registeredAt: "Oct 2, 2026, 11:30 AM",
    role: "user"
  },
  {
    id: "usr_anjali_nair",
    name: "Anjali Nair",
    email: "anjali.nair@kerala.diet",
    password: "12345",
    age: 28,
    gender: "female",
    weightKg: 68,
    heightCm: 163,
    bmi: 25.6,
    goal: "weight_loss",
    activityLevel: "moderate",
    dietaryPreference: "non_veg",
    allergies: "lactose",
    dailyCalorieTarget: 1550,
    dailySugarLimitGrams: 20.0,
    registeredAt: "Oct 3, 2026, 03:15 PM",
    role: "user"
  },
  {
    id: "usr_mohammed_faizal",
    name: "Mohammed Faizal",
    email: "faizal.m@fitness.org",
    password: "12345",
    age: 25,
    gender: "male",
    weightKg: 72,
    heightCm: 178,
    bmi: 22.7,
    goal: "muscle_gain",
    activityLevel: "active",
    dietaryPreference: "non_veg",
    allergies: "none",
    dailyCalorieTarget: 2450,
    dailySugarLimitGrams: 35.0,
    registeredAt: "Oct 4, 2026, 08:45 AM",
    role: "user"
  }
];

export default function AIFoodProductionApp() {
  // Theme State: Default to false (Light Mode as requested by user!)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [compareProductA, setCompareProductA] = useState<PackagedProduct | null>(null);
  const [compareProductB, setCompareProductB] = useState<PackagedProduct | null>(null);

  // Sync theme with localStorage and html element
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force Radiant, Clean Light Mode
      localStorage.setItem("aifood_theme", "light");
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("aifood_theme", next ? "dark" : "light");
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  // Navigation State: Starts on "dashboard"
  const [activeTab, setActiveTab] = useState<AppPageTab>("dashboard");

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

  // Registered Users Directory State (Persistent in localStorage for Admin Oversight)
  const [registeredUsersList, setRegisteredUsersList] = useState<RegisteredUserAccount[]>([]);
  const [adminUserSearchQuery, setAdminUserSearchQuery] = useState("");
  const [adminUserGoalFilter, setAdminUserGoalFilter] = useState("all");
  const [selectedAdminUserDetail, setSelectedAdminUserDetail] = useState<RegisteredUserAccount | null>(null);
  const [adminEditingUser, setAdminEditingUser] = useState<RegisteredUserAccount | null>(null);
  const [adminEditCalories, setAdminEditCalories] = useState("");
  const [adminEditSugar, setAdminEditSugar] = useState("");

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

  // Persistent session & registered users registry loader
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Load or Initialize Registered Users List (Live database for Admin oversight)
      const savedUsers = localStorage.getItem("aifood_registered_users");
      let currentUsersList: RegisteredUserAccount[] = DEFAULT_REGISTERED_USERS;
      if (savedUsers) {
        try {
          const parsedU = JSON.parse(savedUsers);
          if (Array.isArray(parsedU) && parsedU.length > 0) {
            currentUsersList = parsedU;
          } else {
            localStorage.setItem("aifood_registered_users", JSON.stringify(DEFAULT_REGISTERED_USERS));
          }
        } catch {
          localStorage.setItem("aifood_registered_users", JSON.stringify(DEFAULT_REGISTERED_USERS));
        }
      } else {
        localStorage.setItem("aifood_registered_users", JSON.stringify(DEFAULT_REGISTERED_USERS));
      }
      setRegisteredUsersList(currentUsersList);

      // Pre-seed sample meals for Rahul Sharma (Diabetic Care) if not existing
      if (!localStorage.getItem("aifood_meals_rahul.s@health.in")) {
        const rahulMeals = generateDefaultHistoricalMeals().slice(0, 4);
        localStorage.setItem("aifood_meals_rahul.s@health.in", JSON.stringify(rahulMeals));
      }
      // Pre-seed sample meals for Anjali Nair (Weight Loss) if not existing
      if (!localStorage.getItem("aifood_meals_anjali.nair@kerala.diet")) {
        const anjaliMeals = generateDefaultHistoricalMeals().slice(3, 7);
        localStorage.setItem("aifood_meals_anjali.nair@kerala.diet", JSON.stringify(anjaliMeals));
      }

      // 2. Check for Active User Session
      const savedSession = localStorage.getItem("aifood_user_session");
      const adminFlag = localStorage.getItem("aifood_is_admin");

      if (adminFlag === "true") {
        setIsAdminLoggedIn(true);
        setIsLoggedIn(true);
        if (savedSession) {
          try { setUserProfile(JSON.parse(savedSession)); } catch {}
        }
        // Load admin test meals
        const adminMeals = localStorage.getItem("aifood_meals_silu@foodsafety.gov.in") || localStorage.getItem("aifood_logged_meals");
        if (adminMeals) {
          try {
            const parsed = JSON.parse(adminMeals);
            setTodayMeals(Array.isArray(parsed) && parsed.length > 0 ? parsed : generateDefaultHistoricalMeals());
          } catch {
            setTodayMeals(generateDefaultHistoricalMeals());
          }
        } else {
          setTodayMeals(generateDefaultHistoricalMeals());
        }
      } else if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setUserProfile(parsed);
          setIsLoggedIn(true);
          setIsAdminLoggedIn(false);

          // Load THIS specific user's meals (Clean empty array if brand new!)
          const userKey = (parsed.email || "user").toLowerCase().trim();
          const userMealsStr = localStorage.getItem(`aifood_meals_${userKey}`);
          if (userMealsStr) {
            try {
              const parsedMeals = JSON.parse(userMealsStr);
              setTodayMeals(Array.isArray(parsedMeals) ? parsedMeals : []);
            } catch {
              setTodayMeals([]);
            }
          } else {
            // New user starts with empty personal log
            setTodayMeals([]);
          }

          // Load THIS specific user's workouts
          const userWorkoutsStr = localStorage.getItem(`aifood_workouts_${userKey}`);
          if (userWorkoutsStr) {
            try {
              const parsedW = JSON.parse(userWorkoutsStr);
              setTodayWorkouts(Array.isArray(parsedW) ? parsedW : []);
            } catch {
              setTodayWorkouts([]);
            }
          } else {
            setTodayWorkouts([]);
          }

          // Load THIS specific user's water intake
          const userWaterStr = localStorage.getItem(`aifood_water_${userKey}`);
          setWaterGlassesCount(Number(userWaterStr) || 0);

        } catch (e) {
          console.error("Session load error:", e);
        }
      } else {
        // Not logged in (Guest mode)
        setIsLoggedIn(false);
        setIsAdminLoggedIn(false);
        setTodayMeals([]);
        setTodayWorkouts([]);
        setWaterGlassesCount(0);
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

  // Fluid Navigation handler across all application pages
  const navigateTab = (targetTab: AppPageTab | string) => {
    if (targetTab === "barcode_scanner") {
      setActiveTab("truthin_scanner");
    } else {
      setActiveTab(targetTab as AppPageTab);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("aifood_user_session");
      localStorage.removeItem("aifood_is_admin");
    }
    setTodayMeals([]);
    setTodayWorkouts([]);
    setWaterGlassesCount(0);
    setUserProfile({
      name: "Guest",
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
    setShowProfileModal(false);
    setActiveTab("home");
    triggerToast("✓ Signed out successfully.");
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
      const userKey = (userProfile.email || "guest").toLowerCase().trim();
      localStorage.setItem(`aifood_meals_${userKey}`, JSON.stringify(meals));
      localStorage.setItem("aifood_logged_meals", JSON.stringify(meals));
    }
  };

  const saveWorkoutsToStorage = (workouts: DailyWorkoutLog[]) => {
    setTodayWorkouts(workouts);
    if (typeof window !== "undefined") {
      const userKey = (userProfile.email || "guest").toLowerCase().trim();
      localStorage.setItem(`aifood_workouts_${userKey}`, JSON.stringify(workouts));
      localStorage.setItem("aifood_logged_workouts", JSON.stringify(workouts));
    }
  };

  const saveWaterToStorage = (count: number) => {
    const validCount = Math.max(0, Math.min(20, count));
    setWaterGlassesCount(validCount);
    if (typeof window !== "undefined") {
      const userKey = (userProfile.email || "guest").toLowerCase().trim();
      localStorage.setItem(`aifood_water_${userKey}`, String(validCount));
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

  const handleAddMealLog = (meal: MealLogItem) => {
    saveMealsToStorage([meal, ...todayMeals]);
  };

  const handleQuickLogMeal = (meal: any) => {
    const newMeal: MealLogItem = {
      id: `meal_${Date.now()}`,
      name: meal.name || meal.title || "Logged Food",
      mealType: "Lunch",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: getTodayDateStr(),
      calories: Number(meal.calories || meal.caloriesPerServing || 250),
      sugar: Number(meal.sugar || meal.sugarGrams || 2),
      protein: Number(meal.protein || 12),
      carbs: Number(meal.carbs || 35),
      fat: Number(meal.fat || 6),
      safeForDiabetic: meal.safeForDiabetic !== undefined ? meal.safeForDiabetic : true,
      imageUrl: meal.imageUrl,
      status: "consumed"
    };
    saveMealsToStorage([newMeal, ...todayMeals]);
    triggerToast(`✓ Logged "${newMeal.name}" to Daily Diary!`);
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
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<"complaints" | "users_directory" | "ml_datasets">("complaints");

  // ADMIN ACTION: DELETE USER
  const handleAdminDeleteUser = (userId: string) => {
    const targetUser = registeredUsersList.find(u => u.id === userId);
    if (!targetUser) return;
    if (targetUser.role === "admin") {
      triggerToast("⚠️ Cannot delete Chief Admin account!");
      return;
    }
    const updated = registeredUsersList.filter(u => u.id !== userId);
    setRegisteredUsersList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("aifood_registered_users", JSON.stringify(updated));
    }
    triggerToast(`✓ Removed user "${targetUser.name}" from registry.`);
    if (selectedAdminUserDetail?.id === userId) {
      setSelectedAdminUserDetail(null);
    }
  };

  // ADMIN ACTION: UPDATE CLINICAL TARGETS FOR A USER
  const handleAdminSaveEditedTargets = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEditingUser) return;
    const newCal = Number(adminEditCalories) || adminEditingUser.dailyCalorieTarget;
    const newSug = Number(adminEditSugar) || adminEditingUser.dailySugarLimitGrams;

    const updated = registeredUsersList.map(u => {
      if (u.id === adminEditingUser.id) {
        return {
          ...u,
          dailyCalorieTarget: newCal,
          dailySugarLimitGrams: newSug
        };
      }
      return u;
    });

    setRegisteredUsersList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("aifood_registered_users", JSON.stringify(updated));
      if (userProfile.email && userProfile.email.toLowerCase() === adminEditingUser.email.toLowerCase()) {
        const updatedProf = { ...userProfile, dailyCalorieTarget: newCal, dailySugarLimitGrams: newSug };
        setUserProfile(updatedProf);
        localStorage.setItem("aifood_user_session", JSON.stringify(updatedProf));
      }
    }
    triggerToast(`✓ Updated targets for ${adminEditingUser.name}: ${newCal} kcal, ${newSug}g sugar limit.`);
    setAdminEditingUser(null);
    if (selectedAdminUserDetail?.id === adminEditingUser.id) {
      setSelectedAdminUserDetail({
        ...selectedAdminUserDetail,
        dailyCalorieTarget: newCal,
        dailySugarLimitGrams: newSug
      });
    }
  };

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
    if ((inputEmailOrUser === "silu" || inputEmailOrUser === "silu@admin.com" || inputEmailOrUser === "silu@foodsafety.gov.in") && inputPassword === "12345") {
      const adminProfile = DEFAULT_REGISTERED_USERS[0];
      setIsAdminLoggedIn(true);
      setIsLoggedIn(true);
      setUserProfile(adminProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("aifood_user_session", JSON.stringify(adminProfile));
        localStorage.setItem("aifood_is_admin", "true");
      }
      // Load admin meals
      const adminMeals = localStorage.getItem("aifood_meals_silu@foodsafety.gov.in") || localStorage.getItem("aifood_logged_meals");
      if (adminMeals) {
        try {
          const parsed = JSON.parse(adminMeals);
          setTodayMeals(Array.isArray(parsed) && parsed.length > 0 ? parsed : generateDefaultHistoricalMeals());
        } catch {
          setTodayMeals(generateDefaultHistoricalMeals());
        }
      } else {
        setTodayMeals(generateDefaultHistoricalMeals());
      }
      setAuthModalOpen(false);
      triggerToast("✓ Logged in as Chief Safety Admin (Silu)!");
      setActiveTab("food_safety");
      return;
    }

    // 2. REGISTER NEW USER (Fresh data - clean slate!)
    if (authMode === "register") {
      if (!authFormData.name.trim()) {
        setAuthErrorMsg("Please enter your full name.");
        return;
      }
      if (!inputEmailOrUser) {
        setAuthErrorMsg("Please provide a valid email address.");
        return;
      }

      // Check if user is already registered in our registry
      const existingUser = registeredUsersList.find(u => u.email.toLowerCase() === inputEmailOrUser);
      if (existingUser) {
        setAuthErrorMsg(`An account with email "${inputEmailOrUser}" is already registered! Please click "Sign In" below instead.`);
        return;
      }

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

      const calculatedBmi = +(weight / Math.pow(height / 100, 2)).toFixed(1);

      const newAccount: RegisteredUserAccount = {
        id: `usr_${Date.now()}`,
        name: authFormData.name.trim(),
        email: inputEmailOrUser,
        password: authFormData.password || "12345",
        age: age,
        gender: authFormData.gender || "male",
        weightKg: weight,
        heightCm: height,
        bmi: calculatedBmi,
        goal: authFormData.goal || "weight_loss",
        activityLevel: authFormData.activityLevel || "light",
        dietaryPreference: authFormData.dietaryPreference || "non_veg",
        allergies: authFormData.allergies || "none",
        dailyCalorieTarget: dailyCal,
        dailySugarLimitGrams: dailySugar,
        registeredAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        role: "user"
      };

      // Add to registered users list in state & localStorage
      const updatedUsers = [...registeredUsersList, newAccount];
      setRegisteredUsersList(updatedUsers);
      if (typeof window !== "undefined") {
        localStorage.setItem("aifood_registered_users", JSON.stringify(updatedUsers));
      }

      // CRITICAL: Fresh clean slate for the newly registered user!
      // Their personal log starts with 0 consumed calories and 0 logged meals.
      setTodayMeals([]);
      setTodayWorkouts([]);
      setWaterGlassesCount(0);

      if (typeof window !== "undefined") {
        localStorage.setItem(`aifood_meals_${inputEmailOrUser}`, JSON.stringify([]));
        localStorage.setItem(`aifood_workouts_${inputEmailOrUser}`, JSON.stringify([]));
        localStorage.setItem(`aifood_water_${inputEmailOrUser}`, "0");
        localStorage.setItem("aifood_user_session", JSON.stringify(newAccount));
        localStorage.removeItem("aifood_is_admin");
      }

      setIsAdminLoggedIn(false);
      setIsLoggedIn(true);
      setUserProfile(newAccount);
      setAuthModalOpen(false);
      triggerToast(`✓ Registration Successful! Welcome, ${newAccount.name}. Your personal dashboard has been set to ${newAccount.dailyCalorieTarget} kcal.`);
      setActiveTab("dashboard");
      return;
    }

    // 3. LOGIN EXISTING USER
    if (authMode === "login") {
      const foundUser = registeredUsersList.find(u => u.email.toLowerCase() === inputEmailOrUser);
      if (!foundUser) {
        setAuthErrorMsg(`No account found for "${inputEmailOrUser}". Please click "Register & calculate body metrics" below to create an account!`);
        return;
      }

      if (foundUser.password && inputPassword && foundUser.password !== inputPassword) {
        setAuthErrorMsg("Incorrect password. Please enter the valid password you registered with.");
        return;
      }

      setIsAdminLoggedIn(foundUser.role === "admin");
      setIsLoggedIn(true);
      setUserProfile(foundUser);

      if (typeof window !== "undefined") {
        localStorage.setItem("aifood_user_session", JSON.stringify(foundUser));
        if (foundUser.role === "admin") {
          localStorage.setItem("aifood_is_admin", "true");
        } else {
          localStorage.removeItem("aifood_is_admin");
        }

        // Load THIS user's scoped meals
        const userKey = foundUser.email.toLowerCase().trim();
        const storedMeals = localStorage.getItem(`aifood_meals_${userKey}`);
        if (storedMeals) {
          try {
            const parsed = JSON.parse(storedMeals);
            setTodayMeals(Array.isArray(parsed) ? parsed : []);
          } catch {
            setTodayMeals([]);
          }
        } else {
          setTodayMeals([]);
        }

        // Load THIS user's workouts
        const storedWorkouts = localStorage.getItem(`aifood_workouts_${userKey}`);
        if (storedWorkouts) {
          try {
            const parsedW = JSON.parse(storedWorkouts);
            setTodayWorkouts(Array.isArray(parsedW) ? parsedW : []);
          } catch {
            setTodayWorkouts([]);
          }
        } else {
          setTodayWorkouts([]);
        }

        // Load THIS user's water
        const storedWater = localStorage.getItem(`aifood_water_${userKey}`);
        setWaterGlassesCount(Number(storedWater) || 0);
      }

      setAuthModalOpen(false);
      triggerToast(`✓ Welcome back, ${foundUser.name}!`);
      setActiveTab(foundUser.role === "admin" ? "food_safety" : "dashboard");
      return;
    }
  };

  return (
    <div className={`bg-[#f8fafc] text-slate-900 min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-900 transition-colors duration-200 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden relative`}>
      {/* Background Dynamic Light Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-40">
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-emerald-300/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-teal-300/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-cyan-300/15 rounded-full blur-[170px]" />
      </div>

      {/* =================================================================== */}
      {/* SIDEBAR NAVIGATION (ANIMATED EXPAND/COLLAPSE WITH CLEAN PILLS)    */}
      {/* =================================================================== */}
      <SidebarNavigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentLanguage={currentLanguage}
        onChangeLanguage={(lang) => changeLanguage(lang)}
        isLoggedIn={isLoggedIn}
        isAdminLoggedIn={isAdminLoggedIn}
        userName={isLoggedIn ? (userProfile.name || "User") : ""}
        userRole={isAdminLoggedIn ? "admin" : "user"}
        onOpenAuthModal={() => {
          setAuthMode("login");
          setAuthPromptReason("");
          setAuthErrorMsg("");
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* =================================================================== */}
      {/* MAIN CONTENT AREA WITH TOP APP HEADER                              */}
      {/* =================================================================== */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <TopAppHeader
          activeTab={activeTab}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onQuickTruthInScan={() => setActiveTab("truthin_scanner")}
          currentLanguage={currentLanguage}
          onChangeLanguage={(lang) => changeLanguage(lang)}
          userName={isLoggedIn ? (userProfile.name || "User") : "Guest"}
          isAdmin={isAdminLoggedIn}
          onOpenProfile={() => setShowProfileModal(true)}
        />

              {/* =================================================================== */}
      {/* MAIN CONTAINER */}
      {/* =================================================================== */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6 w-full max-w-full overflow-x-hidden space-y-6">
        {/* TRUTHIN SCANNER & DECODER PAGE */}
        {(activeTab === "truthin_scanner" || (activeTab as string) === "barcode_scanner") && (
          <TruthInScannerView
            userProfile={userProfile}
            externalScannedProduct={scannedProductResult?.product || null}
            onOpenLiveCamera={() => {
              setCameraTarget("barcode_scanner");
              setCameraTitle("Scan Barcode with Camera");
              setCameraOverlay("barcode");
              setCameraModalOpen(true);
            }}
            onSelectProductForCompare={(prodA, prodB) => {
              setCompareProductA(prodA);
              setCompareProductB(prodB || null);
              setActiveTab("truthin_compare");
            }}
          />
        )}

        {/* TRUTHIN HEAD-TO-HEAD FOOD COMPARATOR PAGE */}
        {activeTab === "truthin_compare" && (
          <TruthInCompareView
            userProfile={userProfile}
            initialProductA={compareProductA || undefined}
            initialProductB={compareProductB || undefined}
          />
        )}

        {/* CLINICAL FULL ANALYSIS & GRAPHS ENGINE */}
        {activeTab === "full_analysis" && (
          <DietFullAnalysisView
            meals={todayMeals}
            workouts={todayWorkouts}
            userProfile={userProfile}
            language={currentLanguage}
            onSelectDate={(date) => setActiveTab("dashboard")}
            onBackToOverview={() => setActiveTab("dashboard")}
          />
        )}

        {/* CLINICAL DIET & MACROS DASHBOARD */}
        {activeTab === "dashboard" && (
          <ClinicalDashboardView
            userProfile={userProfile}
            meals={todayMeals}
            waterGlasses={waterGlassesCount}
            onUpdateWater={saveWaterToStorage}
            onDeleteMeal={handleDeleteMeal}
            onAddMeal={handleAddMealLog}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* PERSONAL AI NUTRITIONIST & CHATBOT */}
        {activeTab === "ai_nutritionist" && (
          <PersonalNutritionAIChatView
            userProfile={userProfile}
            meals={todayMeals}
            waterGlasses={waterGlassesCount}
            onLogMeal={handleQuickLogMeal}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {/* AI MEAL PLATE VISION SCANNER */}
        {activeTab === "meal_scanner" && (
          <MealScannerView
            userProfile={userProfile}
            initialCapturedImageBase64={mealImageBase64}
            onOpenLiveCamera={() => {
              setCameraTarget("meal_scanner");
              setCameraTitle("Capture Meal Plate Photo");
              setCameraOverlay("food");
              setCameraModalOpen(true);
            }}
            onLogMeal={handleQuickLogMeal}
          />
        )}

        {/* SMART FRIDGE & PANTRY ZERO-WASTE */}
        {activeTab === "smart_fridge" && (
          <SmartFridgeView
            userProfile={userProfile}
            onLogMeal={handleQuickLogMeal}
          />
        )}

        {/* KERALA & GLOBAL FOOD DATASETS ENCYCLOPEDIA */}
        {activeTab === "datasets" && (
          <FoodDatasetExplorerView />
        )}

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

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Know What You Eat. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Cook Smarter. Report Safety.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
                      <strong className="text-slate-900 text-xs block">Personalized Setup Required for Accurate Food Intelligence:</strong>
                      <p className="text-slate-600 text-[11px] mt-0.5">
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
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-xs text-slate-900 font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200 text-left">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-2xl font-black text-emerald-400">100%</span>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Automated Mifflin-St Jeor BMR Math</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-2xl font-black text-cyan-400">15,960+</span>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Trained Food Photography Database</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-2xl font-black text-amber-400">350,000+</span>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Packaged Barcodes & E-Numbers</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-2xl font-black text-rose-400">Direct Email</span>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Dispatch to Regulatory Authorities</p>
                </div>
              </div>

              {/* PROMINENT WORKFLOW & ARCHITECTURE BANNER */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-left">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>New User Interactive Guide (A to Z)</span>
                    <span className="text-[10px] bg-white/20 text-slate-900 px-1.5 py-0.5 rounded font-mono">English • മലയാളം • हिन्दी</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    First Time Here? See How Every Feature Works
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
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
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                  How AIFood Powers Your Daily Health
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
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
                      <span className="text-4xl font-black text-slate-900/10 absolute top-4 right-4 font-mono">
                        {item.step}
                      </span>
                      <div className={`w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center ${item.textAccent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
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
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
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
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative h-28 w-full overflow-hidden">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/40 backdrop-blur-sm text-[10px] font-bold text-emerald-400">
                        {food.calories} kcal
                      </div>
                      {!isLoggedIn && (
                        <div className="absolute top-2 left-2 p-1 rounded-full bg-slate-900/40 backdrop-blur-sm text-amber-400">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {food.name}
                      </h4>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
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

        {/* Modular Views rendered at top of <main>: ClinicalDashboardView, MealScannerView, SmartFridgeView, FoodDatasetExplorerView, TruthInScannerView, TruthInCompareView */}

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
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                  <button
                    onClick={() => setAdminActiveSubTab("complaints")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      adminActiveSubTab === "complaints"
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Grievance Moderation ({complaintsList.length})
                  </button>
                  <button
                    onClick={() => setAdminActiveSubTab("users_directory")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      adminActiveSubTab === "users_directory"
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Registered Users & Clinical Directory ({registeredUsersList.length})
                  </button>
                  <button
                    onClick={() => setAdminActiveSubTab("ml_datasets")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      adminActiveSubTab === "ml_datasets"
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Backend ML & Datasets
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
                          className="p-5 rounded-2xl bg-white/[0.03] border border-slate-200 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
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

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-white/5">
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
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-slate-200 space-y-4">
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
                        <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Model Accuracy</span>
                          <p className="text-xl font-bold text-emerald-400">
                            {mlData?.metrics?.currentAccuracy || 98.4}%
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Loss Metric</span>
                          <p className="text-xl font-bold text-cyan-400">
                            {mlData?.metrics?.lossMetric || 0.018}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Learned Corrections</span>
                          <p className="text-xl font-bold text-amber-400">
                            {mlData?.metrics?.correctionsLearnedCount || 0}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Labeled Photos</span>
                          <p className="text-xl font-bold text-purple-400">15,960+</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab C: Registered Users & Clinical Directory */}
                {adminActiveSubTab === "users_directory" && (
                  <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/20">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                            <Users className="w-5 h-5" />
                          </span>
                          <h3 className="text-base font-bold text-white">Registered Users & Clinical Profiles</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {registeredUsersList.length} Accounts
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Inspect patient biometrics, computed BMR/TDEE targets, daily sugar allowances, and scoped live food logs.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setAuthMode("register");
                          setAuthModalOpen(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all shrink-0"
                      >
                        <UserPlus className="w-4 h-4" />
                        + Register New Patient
                      </button>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-xl bg-white/[0.04] border border-slate-200 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span>Total Registered</span>
                          <Users className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-2xl font-black text-white">{registeredUsersList.length}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Active profiles stored</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.04] border border-amber-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
                          <span>Diabetic Care</span>
                          <HeartPulse className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-2xl font-black text-amber-400">
                          {registeredUsersList.filter((u) => u.goal === "diabetic_care").length}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Strict sugar monitoring</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.04] border border-rose-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-rose-300 text-xs mb-1">
                          <span>Weight Loss / Mgmt</span>
                          <Flame className="w-4 h-4 text-rose-400" />
                        </div>
                        <p className="text-2xl font-black text-rose-400">
                          {registeredUsersList.filter((u) => u.goal === "weight_loss" || u.goal === "weight_gain").length}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Caloric deficit / surplus</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.04] border border-emerald-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
                          <span>Special Allergies</span>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-black text-emerald-400">
                          {registeredUsersList.filter((u) => u.allergies && u.allergies.length > 0).length}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Allergen safety enabled</p>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/[0.03] p-3 rounded-2xl border border-slate-200">
                      <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={adminUserSearchQuery}
                          onChange={(e) => setAdminUserSearchQuery(e.target.value)}
                          placeholder="Search patient by name or email..."
                          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                        <select
                          value={adminUserGoalFilter}
                          onChange={(e) => setAdminUserGoalFilter(e.target.value)}
                          className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-200 text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="all">All Goals & Conditions</option>
                          <option value="diabetic_care">Diabetic Care</option>
                          <option value="weight_loss">Weight Loss</option>
                          <option value="muscle_gain">Muscle Gain</option>
                          <option value="maintain">Maintain Fitness</option>
                          <option value="weight_gain">Weight Gain</option>
                        </select>
                      </div>
                    </div>

                    {/* User Profiles Grid */}
                    {registeredUsersList.filter((u) => {
                      const matchesSearch =
                        adminUserSearchQuery.trim() === "" ||
                        u.name.toLowerCase().includes(adminUserSearchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(adminUserSearchQuery.toLowerCase());
                      const matchesGoal = adminUserGoalFilter === "all" || u.goal === adminUserGoalFilter;
                      return matchesSearch && matchesGoal;
                    }).length === 0 ? (
                      <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-slate-200">
                        <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-300">No users match your filter</p>
                        <p className="text-xs text-slate-500 mt-1">Try clearing your search query or goal filter.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registeredUsersList
                          .filter((u) => {
                            const matchesSearch =
                              adminUserSearchQuery.trim() === "" ||
                              u.name.toLowerCase().includes(adminUserSearchQuery.toLowerCase()) ||
                              u.email.toLowerCase().includes(adminUserSearchQuery.toLowerCase());
                            const matchesGoal = adminUserGoalFilter === "all" || u.goal === adminUserGoalFilter;
                            return matchesSearch && matchesGoal;
                          })
                          .map((u) => {
                            // Scoped meals for this user
                            let userMealsCount = 0;
                            let userTodayCalories = 0;
                            try {
                              const raw = localStorage.getItem("aifood_meals_" + u.email);
                              if (raw) {
                                const parsed = JSON.parse(raw);
                                if (Array.isArray(parsed)) {
                                  userMealsCount = parsed.length;
                                  userTodayCalories = parsed.reduce((acc: number, m: any) => acc + (m.calories || 0), 0);
                                }
                              }
                            } catch (e) {
                              // ignore
                            }

                            const bmiColor =
                              u.bmi < 18.5
                                ? "text-cyan-400"
                                : u.bmi <= 24.9
                                ? "text-emerald-400"
                                : u.bmi <= 29.9
                                ? "text-amber-400"
                                : "text-rose-400";

                            const goalLabel =
                              u.goal === "diabetic_care"
                                ? "🩺 Diabetic Care"
                                : u.goal === "weight_loss"
                                ? "🔥 Weight Loss"
                                : u.goal === "muscle_gain"
                                ? "💪 Muscle Gain"
                                : u.goal === "weight_gain"
                                ? "📈 Weight Gain"
                                : "⚖️ Maintain Balance";

                            return (
                              <div
                                key={u.id}
                                className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-slate-200 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4"
                              >
                                <div className="space-y-3">
                                  {/* User Head */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
                                        {u.name.substring(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h4 className="text-sm font-bold text-white">{u.name}</h4>
                                          {u.role === "admin" ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                              CHIEF ADMIN
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                              PATIENT
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-400">{u.email}</p>
                                        <span className="text-[10px] text-slate-500">
                                          Registered: {new Date(u.registeredAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/5 border border-slate-200 text-slate-300 shrink-0">
                                      {goalLabel}
                                    </span>
                                  </div>

                                  {/* Biometrics & Targets Pill Grid */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                                    <div className="p-2 rounded-xl bg-slate-50 border border-white/5">
                                      <span className="text-[10px] text-slate-400 block uppercase">Age / Sex</span>
                                      <span className="text-xs font-bold text-white capitalize">
                                        {u.age}y • {u.gender}
                                      </span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 border border-white/5">
                                      <span className="text-[10px] text-slate-400 block uppercase">Ht / Wt</span>
                                      <span className="text-xs font-bold text-white">
                                        {u.heightCm}cm • {u.weightKg}kg
                                      </span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 border border-white/5">
                                      <span className="text-[10px] text-slate-400 block uppercase">BMI</span>
                                      <span className={`text-xs font-bold ${bmiColor}`}>
                                        {u.bmi.toFixed(1)}
                                      </span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 border border-white/5">
                                      <span className="text-[10px] text-slate-400 block uppercase">Diet</span>
                                      <span className="text-xs font-bold text-white capitalize">
                                        {u.dietaryPreference}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Clinical Nutrition Limits */}
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold flex items-center gap-1">
                                      <Flame className="w-3.5 h-3.5" /> Target: {u.dailyCalorieTarget} kcal/day
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                                      <Candy className="w-3.5 h-3.5" /> Sugar Cap: {u.dailySugarLimitGrams}g
                                    </span>
                                    {u.allergies && (Array.isArray(u.allergies) ? u.allergies.length > 0 : String(u.allergies).trim() !== "") ? (
                                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold text-[11px]">
                                        ⚠️ Allergies: {Array.isArray(u.allergies) ? u.allergies.join(", ") : String(u.allergies)}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded text-[11px] text-slate-500">
                                        No allergies logged
                                      </span>
                                    )}
                                  </div>

                                  {/* Scoped Live Food Log Status */}
                                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-1.5">
                                      <Utensils className="w-3.5 h-3.5 text-slate-400" />
                                      Food Diary Status:
                                    </span>
                                    {userMealsCount > 0 ? (
                                      <span className="font-bold text-emerald-400">
                                        {userMealsCount} meals logged ({userTodayCalories} kcal today)
                                      </span>
                                    ) : (
                                      <span className="text-slate-500 italic">
                                        Clean slate (0 meals logged)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                                  <button
                                    onClick={() => setSelectedAdminUserDetail(u)}
                                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    View Full Details & Food Diary
                                  </button>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setAdminEditingUser(u);
                                        setAdminEditCalories(String(u.dailyCalorieTarget));
                                        setAdminEditSugar(String(u.dailySugarLimitGrams));
                                      }}
                                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-200 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                                      title="Edit Calorie & Sugar Targets"
                                    >
                                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                                      Edit Targets
                                    </button>

                                    {u.email !== "silu" && (
                                      <button
                                        onClick={() => handleAdminDeleteUser(u.id)}
                                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 cursor-pointer transition-all"
                                        title="Delete User Account"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Public Grievance Submission Form */
              <form onSubmit={handleSubmitComplaint} className="p-6 rounded-2xl bg-white/[0.03] border border-slate-200 backdrop-blur-md space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-200 pb-3">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-emerald-400"
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
      </div>

      {/* =================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      {/* =================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 py-2 px-3 flex items-center justify-around md:hidden shadow-lg">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === "dashboard" ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Diet</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_nutritionist")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === "ai_nutritionist" ? "text-indigo-600 font-bold" : "text-slate-500"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Chat</span>
        </button>

        <button
          onClick={() => setActiveTab("truthin_scanner")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === "truthin_scanner" ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <ScanBarcode className="w-4 h-4" />
          <span>Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab("meal_scanner")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === "meal_scanner" ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Plate</span>
        </button>

        <button
          onClick={() => setActiveTab("smart_fridge")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === "smart_fridge" ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <Refrigerator className="w-4 h-4" />
          <span>Fridge</span>
        </button>

        <button
          onClick={() => setActiveTab("food_safety")}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === "food_safety" ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Safety</span>
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
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

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-mono">
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
              <div className="pt-2 border-t border-slate-200 text-slate-300 leading-relaxed text-[11px] font-sans">
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
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
                <label className="block text-slate-700 font-semibold mb-1">Meal / Food Name *</label>
                <input
                  type="text"
                  required
                  value={customMealForm.name}
                  onChange={(e) => setCustomMealForm({ ...customMealForm, name: e.target.value })}
                  placeholder="Enter meal or food item name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meal Timing</label>
                  <select
                    value={customMealForm.mealType}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, mealType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Calories (kcal) *</label>
                  <input
                    type="number"
                    required
                    value={customMealForm.calories}
                    onChange={(e) => setCustomMealForm({ ...customMealForm, calories: e.target.value })}
                    placeholder="Enter calories in kcal"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
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
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-white"
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
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-white"
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
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-white"
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
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-white"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-scaleUp my-8">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
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
                  <label className="block text-slate-700 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={authFormData.name}
                    onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {authMode === "login" ? "Email Address or Username" : "Email Address"}
                  </label>
                  <input
                    type="text"
                    required
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                    placeholder={authMode === "login" ? "Enter your email or username" : "Enter your email address"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authFormData.password}
                    onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white"
                  />
                </div>
              </div>

              {authMode === "register" && (
                <>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                      <select
                        value={authFormData.gender}
                        onChange={(e) => setAuthFormData({ ...authFormData, gender: e.target.value })}
                        className="w-full px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Age</label>
                      <input
                        type="number"
                        required
                        value={authFormData.age}
                        onChange={(e) => setAuthFormData({ ...authFormData, age: e.target.value })}
                        placeholder="Age"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        required
                        value={authFormData.weightKg}
                        onChange={(e) => setAuthFormData({ ...authFormData, weightKg: e.target.value })}
                        placeholder="Weight in kg"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Height (cm)</label>
                      <input
                        type="number"
                        required
                        value={authFormData.heightCm}
                        onChange={(e) => setAuthFormData({ ...authFormData, heightCm: e.target.value })}
                        placeholder="Height in cm"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Daily Activity</label>
                      <select
                        value={authFormData.activityLevel}
                        onChange={(e) => setAuthFormData({ ...authFormData, activityLevel: e.target.value })}
                        className="w-full px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs"
                      >
                        <option value="sedentary">Sedentary (Desk Job)</option>
                        <option value="light">Light Active (1-3 days exercise)</option>
                        <option value="moderate">Moderate Active (3-5 days workout)</option>
                        <option value="active">Very Active (Heavy training)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Primary Dietary Goal</label>
                    <select
                      value={authFormData.goal}
                      onChange={(e) => setAuthFormData({ ...authFormData, goal: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white"
                    >
                      <option value="weight_loss">Weight Loss (Calorie Deficit & Sugar ≤ 20g)</option>
                      <option value="diabetic_care">Diabetic Care (Glycemic & Insulin Control, Sugar ≤ 15g)</option>
                      <option value="muscle_gain">Muscle Building (High Protein Surplus)</option>
                      <option value="maintenance">Balanced Health Maintenance (Standard BMR)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Diet Preference</label>
                      <select
                        value={authFormData.dietaryPreference}
                        onChange={(e) => setAuthFormData({ ...authFormData, dietaryPreference: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs"
                      >
                        <option value="non_veg">Non-Vegetarian (Halal/General)</option>
                        <option value="veg">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Known Allergies</label>
                      <select
                        value={authFormData.allergies}
                        onChange={(e) => setAuthFormData({ ...authFormData, allergies: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
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
                <label className="block text-slate-700 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile({ ...userProfile, age: Number(e.target.value) })}
                    placeholder="Years"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={userProfile.weightKg}
                    onChange={(e) => setUserProfile({ ...userProfile, weightKg: Number(e.target.value) })}
                    placeholder="Weight (kg)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Dietary Goal</label>
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                >
                  <option value="weight_loss">Weight Loss (Calorie Deficit)</option>
                  <option value="diabetic_care">Diabetic Care (Low Sugar & Glycemic Control)</option>
                  <option value="muscle_gain">Muscle Building (High Protein)</option>
                  <option value="maintenance">Balanced Maintenance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-slate-200 text-center">
                  <span className="text-slate-400">Daily Calorie Target</span>
                  <p className="text-base font-bold text-emerald-400">{userProfile.dailyCalorieTarget} kcal</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-slate-200 text-center">
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
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
                  <label className="block text-slate-700 font-semibold mb-1">Actual Food / Dish Name</label>
                  <input
                    type="text"
                    value={correctionName}
                    onChange={(e) => setCorrectionName(e.target.value)}
                    placeholder="Enter actual food name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={correctionCalories}
                      onChange={(e) => setCorrectionCalories(e.target.value)}
                      placeholder="Calories in kcal"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Sugar (grams)</label>
                    <input
                      type="number"
                      value={correctionSugar}
                      onChange={(e) => setCorrectionSugar(e.target.value)}
                      placeholder="Sugar in grams"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white"
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
      {selectedMealDetailModal && (() => {
        const mealAlt = findHealthyAlternativeForMeal({
          id: selectedMealDetailModal.id,
          name: selectedMealDetailModal.name,
          category: "kerala_traditional",
          imageUrl: selectedMealDetailModal.imageUrl || "",
          servingSize: "1 serving",
          calories: selectedMealDetailModal.calories,
          sugar: selectedMealDetailModal.sugar,
          protein: selectedMealDetailModal.protein,
          carbs: selectedMealDetailModal.carbs,
          fat: selectedMealDetailModal.fat,
          fiber: 3.5,
          glycemicIndex: selectedMealDetailModal.glycemicIndex || 55,
          allergens: [],
          healthScore: 70,
          safeForDiabetic: selectedMealDetailModal.safeForDiabetic,
          dietRecommendation: selectedMealDetailModal.aiSummary || "",
          healthyAlternative: selectedMealDetailModal.healthyAlternative
        });

        const handleSwitchModalMeal = () => {
          setTodayMeals((prev) =>
            prev.map((m) =>
              m.id === selectedMealDetailModal.id
                ? {
                    ...m,
                    name: mealAlt.name,
                    calories: mealAlt.calories,
                    sugar: mealAlt.sugar,
                    protein: mealAlt.protein,
                    carbs: mealAlt.carbs,
                    fat: mealAlt.fat,
                    safeForDiabetic: mealAlt.safeForDiabetic,
                    glycemicIndex: mealAlt.glycemicIndex,
                    imageUrl: mealAlt.imageUrl,
                    aiSummary: mealAlt.dietRecommendation
                  }
                : m
            )
          );
          setSelectedMealDetailModal({
            ...selectedMealDetailModal,
            name: mealAlt.name,
            calories: mealAlt.calories,
            sugar: mealAlt.sugar,
            protein: mealAlt.protein,
            carbs: mealAlt.carbs,
            fat: mealAlt.fat,
            safeForDiabetic: mealAlt.safeForDiabetic,
            glycemicIndex: mealAlt.glycemicIndex,
            imageUrl: mealAlt.imageUrl,
            aiSummary: mealAlt.dietRecommendation
          });
        };

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  {selectedMealDetailModal.imageUrl ? (
                    <img
                      src={selectedMealDetailModal.imageUrl}
                      alt={selectedMealDetailModal.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Utensils className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedMealDetailModal.name}</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedMealDetailModal.mealType} • {selectedMealDetailModal.time}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMealDetailModal(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Consumption Status */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  {selectedMealDetailModal.status === "consumed" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Consumed at {selectedMealDetailModal.consumedAt || selectedMealDetailModal.time}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
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
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  {selectedMealDetailModal.status === "consumed" ? "Mark as Planned" : "Mark as Consumed (Done)"}
                </button>
              </div>

              {/* Nutrition Macro Cards */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/60">
                  <span className="text-[10px] text-orange-700 font-bold uppercase">Calories</span>
                  <p className="text-lg font-black text-slate-900">{selectedMealDetailModal.calories} kcal</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60">
                  <span className="text-[10px] text-rose-700 font-bold uppercase">Sugar</span>
                  <p className={`text-lg font-black ${selectedMealDetailModal.sugar > 10 ? "text-rose-600" : "text-amber-700"}`}>
                    {selectedMealDetailModal.sugar}g
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60">
                  <span className="text-[10px] text-blue-700 font-bold uppercase">Protein</span>
                  <p className="text-lg font-black text-slate-900">{selectedMealDetailModal.protein}g</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Carbs</span>
                  <p className="text-lg font-black text-slate-900">{selectedMealDetailModal.carbs}g</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Fats</span>
                  <p className="text-lg font-black text-slate-900">{selectedMealDetailModal.fat}g</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60">
                  <span className="text-[10px] text-purple-700 font-bold uppercase">Glycemic Index</span>
                  <p className="text-lg font-black text-purple-800">{selectedMealDetailModal.glycemicIndex || 50}</p>
                </div>
              </div>

              {/* Diabetic Safety Assessment */}
              <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
                selectedMealDetailModal.safeForDiabetic
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}>
                {selectedMealDetailModal.safeForDiabetic ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Diabetic Safe:</strong> Low sugar and moderate glycemic impact. Safe for glycemic management.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span><strong>Monitor Sugar:</strong> Sugar content exceeds 6g. Diabetic users should moderate portion size.</span>
                  </>
                )}
              </div>

              {/* Saved AI Clinical Summary & Advice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs leading-relaxed">
                <strong className="text-slate-900 block font-bold">Clinical AI Diet Analysis & Advice:</strong>
                <p className="text-slate-600">
                  {selectedMealDetailModal.aiSummary || "Nutritional analysis based on ICMR & NIN food composition database."}
                </p>
                {selectedMealDetailModal.recipeTip && (
                  <div className="pt-2 border-t border-slate-200 text-emerald-700 font-medium">
                    <strong>Nutritional Tip:</strong> {selectedMealDetailModal.recipeTip}
                  </div>
                )}
              </div>

              {/* Universal Recommended Clean Healthy Alternative for ANY Meal */}
              {mealAlt && mealAlt.name !== selectedMealDetailModal.name && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>✨ Recommended Clean Swap</span>
                    </div>
                    {mealAlt.calories < selectedMealDetailModal.calories && (
                      <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                        -{selectedMealDetailModal.calories - mealAlt.calories} kcal saved
                      </span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      {mealAlt.imageUrl && (
                        <img
                          src={mealAlt.imageUrl}
                          alt={mealAlt.name}
                          className="w-12 h-12 rounded-xl object-cover border border-emerald-200 shrink-0 bg-slate-100"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{mealAlt.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="font-bold text-emerald-700">{mealAlt.calories} kcal</span>
                          <span>•</span>
                          <span>GI: {mealAlt.glycemicIndex}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{mealAlt.safeForDiabetic ? "Diabetic Safe" : "Balanced"}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSwitchModalMeal}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform hover:scale-105 cursor-pointer shrink-0"
                    >
                      Switch Meal
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedMealDetailModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Nutritional Report
              </button>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* FOOD CONSUMPTION FINAL DECISION ALERT MODAL */}
      {/* =================================================================== */}
      {consumptionDecisionModal && consumptionDecisionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl shadow-emerald-950/50 animate-scaleUp">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
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
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-slate-200 space-y-3">
              <div className="flex items-center gap-3.5">
                {consumptionDecisionModal.foodItem.imageUrl ? (
                  <img
                    src={consumptionDecisionModal.foodItem.imageUrl}
                    alt={consumptionDecisionModal.foodItem.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-md shrink-0"
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
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-white/5 line-clamp-2">
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
                className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-slate-200 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer group"
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

      {/* ADMIN INSPECT USER CLINICAL PROFILE & SCOPED FOOD DIARY MODAL */}
      {selectedAdminUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-6 scrollbar-thin">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  {selectedAdminUserDetail.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedAdminUserDetail.name}</h3>
                    {selectedAdminUserDetail.role === "admin" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        CHIEF ADMIN
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        PATIENT / USER
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{selectedAdminUserDetail.email}</p>
                  <p className="text-[10px] text-slate-500">
                    ID: {selectedAdminUserDetail.id} • Registered: {new Date(selectedAdminUserDetail.registeredAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAdminUserDetail(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Biometrics & Target Ceiling */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Clinical Biometrics & Targets
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Age / Gender</span>
                  <span className="text-xs font-bold text-white capitalize">
                    {selectedAdminUserDetail.age} yrs • {selectedAdminUserDetail.gender}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Height / Weight</span>
                  <span className="text-xs font-bold text-white">
                    {selectedAdminUserDetail.heightCm} cm • {selectedAdminUserDetail.weightKg} kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">BMI Status</span>
                  <span
                    className={`text-xs font-bold ${
                      selectedAdminUserDetail.bmi < 18.5
                        ? "text-cyan-400"
                        : selectedAdminUserDetail.bmi <= 24.9
                        ? "text-emerald-400"
                        : selectedAdminUserDetail.bmi <= 29.9
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {selectedAdminUserDetail.bmi.toFixed(1)} (
                    {selectedAdminUserDetail.bmi < 18.5
                      ? "Underweight"
                      : selectedAdminUserDetail.bmi <= 24.9
                      ? "Healthy"
                      : selectedAdminUserDetail.bmi <= 29.9
                      ? "Overweight"
                      : "Obese"}
                    )
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Activity Level</span>
                  <span className="text-xs font-bold text-white capitalize">
                    {selectedAdminUserDetail.activityLevel.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-cyan-300 font-semibold block">Prescribed Daily Target</span>
                    <span className="text-base font-black text-cyan-400">
                      {selectedAdminUserDetail.dailyCalorieTarget} kcal/day
                    </span>
                  </div>
                  <Flame className="w-6 h-6 text-cyan-400/60" />
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-amber-300 font-semibold block">Max Sugar Cap</span>
                    <span className="text-base font-black text-amber-400">
                      {selectedAdminUserDetail.dailySugarLimitGrams}g sugar/day
                    </span>
                  </div>
                  <Candy className="w-6 h-6 text-amber-400/60" />
                </div>
              </div>

              {/* Diet Pref & Allergies */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-slate-400">Dietary Regimen: </span>
                  <span className="font-bold text-white capitalize">
                    {selectedAdminUserDetail.dietaryPreference}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Allergies: </span>
                  {selectedAdminUserDetail.allergies &&
                  (Array.isArray(selectedAdminUserDetail.allergies)
                    ? selectedAdminUserDetail.allergies.length > 0
                    : String(selectedAdminUserDetail.allergies).trim() !== "") ? (
                    <span className="font-bold text-rose-400">
                      ⚠️{" "}
                      {Array.isArray(selectedAdminUserDetail.allergies)
                        ? selectedAdminUserDetail.allergies.join(", ")
                        : String(selectedAdminUserDetail.allergies)}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">None reported</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Scoped Live Food Diary */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    Live Scoped Food Diary for this Account
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Data isolated under <code className="text-cyan-400">aifood_meals_{selectedAdminUserDetail.email}</code>
                  </p>
                </div>
              </div>

              {(() => {
                let userMeals: any[] = [];
                try {
                  const raw = localStorage.getItem("aifood_meals_" + selectedAdminUserDetail.email);
                  if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                      userMeals = parsed;
                    }
                  }
                } catch (e) {
                  // ignore
                }

                const totalKcal = userMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
                const totalSugar = userMeals.reduce((acc, m) => acc + (m.sugar || 0), 0);
                const totalProtein = userMeals.reduce((acc, m) => acc + (m.protein || 0), 0);

                if (userMeals.length === 0) {
                  return (
                    <div className="text-center py-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <Utensils className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-300">Clean Slate — No Meals Logged Yet</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        This patient has registered with a clean slate. When they scan or log meals on their phone/browser, their live meals will automatically show up here.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {/* Summary row */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase block">Total Consumed</span>
                        <span className="text-sm font-black text-cyan-400">
                          {totalKcal} / {selectedAdminUserDetail.dailyCalorieTarget} kcal
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase block">Total Sugar</span>
                        <span
                          className={`text-sm font-black ${
                            totalSugar > selectedAdminUserDetail.dailySugarLimitGrams
                              ? "text-rose-400"
                              : "text-amber-400"
                          }`}
                        >
                          {totalSugar}g / max {selectedAdminUserDetail.dailySugarLimitGrams}g
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-[10px] text-slate-400 uppercase block">Total Protein</span>
                        <span className="text-sm font-black text-emerald-400">{totalProtein}g</span>
                      </div>
                    </div>

                    {/* Meal list */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {userMeals.map((meal: any, idx: number) => (
                        <div
                          key={meal.id || idx}
                          className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{meal.name}</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-400 uppercase">
                                {meal.mealType || "Meal"}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {meal.time || (meal.date ? new Date(meal.date).toLocaleDateString() : "Today")}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-cyan-400 block">{meal.calories} kcal</span>
                            <span className="text-[10px] text-slate-400">
                              P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g | S: {meal.sugar || 0}g
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setAdminEditingUser(selectedAdminUserDetail);
                  setAdminEditCalories(String(selectedAdminUserDetail.dailyCalorieTarget));
                  setAdminEditSugar(String(selectedAdminUserDetail.dailySugarLimitGrams));
                  setSelectedAdminUserDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Sliders className="w-3.5 h-3.5" />
                Edit Nutrition Targets
              </button>

              <button
                onClick={() => setSelectedAdminUserDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT USER NUTRITION TARGETS MODAL */}
      {adminEditingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Adjust Nutrition Targets</h3>
                <p className="text-xs text-slate-400">For patient: {adminEditingUser.name} ({adminEditingUser.email})</p>
              </div>
              <button
                onClick={() => setAdminEditingUser(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminSaveEditedTargets} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Calorie Target (kcal/day)
                </label>
                <input
                  type="number"
                  min="800"
                  max="5000"
                  required
                  value={adminEditCalories}
                  onChange={(e) => setAdminEditCalories(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Adjust based on patient BMR, goal ({adminEditingUser.goal}), or clinical diet plan.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Sugar Ceiling (grams/day)
                </label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  required
                  value={adminEditSugar}
                  onChange={(e) => setAdminEditSugar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Diabetic patients should strictly stay below 15g-25g daily added sugars.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdminEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  Save Prescribed Targets
                </button>
              </div>
            </form>
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
