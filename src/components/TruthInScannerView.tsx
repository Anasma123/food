"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ScanBarcode,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Scale,
  Search,
  Filter,
  Camera,
  RotateCcw,
  Info,
  ChevronRight,
  Heart,
  Droplets,
  Flame,
  Candy,
  Check,
  X,
  Zap,
  MessageSquare,
  Send,
  Bot,
  Upload,
  RefreshCw,
  FileText
} from "lucide-react";
import { 
  PACKAGED_PRODUCTS_DATASET, 
  COMPREHENSIVE_PACKAGED_DATABASE, 
  PackagedProduct 
} from "@/lib/data-science/datasets";

export interface UserHealthProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  gender: string;
  goal: string;
  activityLevel: string;
  dietaryPreference: string;
  allergies: string;
  dailyCalorieTarget: number;
  dailySugarLimitGrams: number;
}

interface AIFoodScannerViewProps {
  userProfile: UserHealthProfile;
  onOpenLiveCamera?: () => void;
  onSelectProductForCompare?: (product: PackagedProduct, productB?: PackagedProduct) => void;
  initialSelectedBarcode?: string;
  externalScannedProduct?: PackagedProduct | null;
}

// Knowledge base of common additives & plain-English translations
const ADDITIVE_KNOWLEDGE_BASE: Record<
  string,
  {
    name: string;
    insCode?: string;
    hazardLevel: "safe" | "caution" | "high";
    plainEnglish: string;
    purpose: string;
    healthImpact: string;
  }
> = {
  E635: {
    name: "Disodium 5'-Ribonucleotides",
    insCode: "INS 635",
    hazardLevel: "high",
    plainEnglish: "Synthetic chemical flavor enhancer that mimics umami and meat flavor.",
    purpose: "Makes junk food addictive and enhances savory taste cheaply without real vegetables or meat.",
    healthImpact: "Can trigger gout attacks by increasing uric acid. Known trigger for asthma flare-ups and itchy rashes."
  },
  E621: {
    name: "Monosodium Glutamate (MSG)",
    insCode: "INS 621",
    hazardLevel: "caution",
    plainEnglish: "Concentrated glutamic acid salt used as an umami flavor enhancer.",
    purpose: "Supercharges flavor sensation on the tongue, creating compulsive eating urges.",
    healthImpact: "May cause headaches, flushing, sweating, or palpitations in sensitive individuals ('Chinese restaurant syndrome')."
  },
  E150d: {
    name: "Caramel Color IV (Sulfite Ammonia Caramel)",
    insCode: "INS 150d",
    hazardLevel: "high",
    plainEnglish: "Dark chemical colorant manufactured by heating sugars with ammonia and sulfites.",
    purpose: "Gives colas, dark gravies, and packaged curries their deep brown hue.",
    healthImpact: "Contains the chemical byproduct 4-MEI (4-methylimidazole), classified as a possible carcinogen by the WHO IARC."
  },
  E503ii: {
    name: "Ammonium Bicarbonate",
    insCode: "INS 503ii",
    hazardLevel: "safe",
    plainEnglish: "Baking powder leavening agent that releases ammonia gas during baking to make biscuits crisp.",
    purpose: "Provides a light, crunchy texture in biscuits and crackers.",
    healthImpact: "Generally safe as ammonia gas evaporates during baking; harmless in normal dietary amounts."
  },
  E500ii: {
    name: "Sodium Bicarbonate",
    insCode: "INS 500ii",
    hazardLevel: "safe",
    plainEnglish: "Common household baking soda used as an acidity regulator and leavening agent.",
    purpose: "Regulates acidity and helps baked goods expand.",
    healthImpact: "Safe, but contributes slightly to total sodium content."
  },
  E501i: {
    name: "Potassium Carbonate",
    insCode: "INS 501i",
    hazardLevel: "safe",
    plainEnglish: "Alkalizing salt used to improve dough elasticity and texture in instant noodles.",
    purpose: "Gives noodles their springy texture and yellow tone.",
    healthImpact: "Considered safe by international food authorities when used in standard amounts."
  },
  PALM_OIL: {
    name: "Refined Palm Oil",
    insCode: "Fat Fraction",
    hazardLevel: "high",
    plainEnglish: "Heavily refined vegetable fat containing ~50% saturated palmitic acid.",
    purpose: "Extremely cheap oil with long shelf life that doesn't spoil easily in packaged snacks.",
    healthImpact: "Consistently linked in clinical studies to elevated LDL (bad) cholesterol and cardiovascular inflammation."
  },
  INVERT_SUGAR: {
    name: "Invert Sugar Syrup",
    insCode: "Liquid Sugar",
    hazardLevel: "high",
    plainEnglish: "Chemically split sucrose broken into free glucose and free fructose molecules.",
    purpose: "Sweeter than regular sugar and keeps packaged snacks moist and soft for months.",
    healthImpact: "Delivers an instant spike to bloodstream glucose and overworks the liver, promoting visceral fat."
  },
  MALTODEXTRIN: {
    name: "Maltodextrin",
    insCode: "Refined Polysaccharide",
    hazardLevel: "high",
    plainEnglish: "Heavily processed white powder derived from corn or wheat starch.",
    purpose: "Acts as a cheap filler, thickener, and flavor carrier.",
    healthImpact: "Glycemic Index of 110-130 (higher than pure table sugar!). Spikes blood sugar rapidly and alters gut bacteria."
  }
};

// Calculate AIFood 1.0 to 5.0 rating & Clean Score
export function calculateAIFoodScore(product: PackagedProduct) {
  let score = 5.0;
  let deductions: { reason: string; penalty: number }[] = [];

  // NOVA classification penalty
  if (product.novaGroup === 4) {
    score -= 1.4;
    deductions.push({ reason: "Ultra-processed food formulation (NOVA 4)", penalty: 1.4 });
  } else if (product.novaGroup === 3) {
    score -= 0.6;
    deductions.push({ reason: "Processed formulation (NOVA 3)", penalty: 0.6 });
  }

  // Sugar penalty (per 100g)
  if (product.sugarPer100g > 20) {
    score -= 1.2;
    deductions.push({ reason: `Excessive sugar (${product.sugarPer100g}g/100g)`, penalty: 1.2 });
  } else if (product.sugarPer100g > 10) {
    score -= 0.7;
    deductions.push({ reason: `High added sugar (${product.sugarPer100g}g/100g)`, penalty: 0.7 });
  } else if (product.sugarPer100g > 5) {
    score -= 0.3;
    deductions.push({ reason: `Moderate sugar (${product.sugarPer100g}g/100g)`, penalty: 0.3 });
  }

  // Salt / Sodium penalty
  if (product.saltPer100g > 2.0) {
    score -= 1.0;
    deductions.push({ reason: `Hazardous sodium load (${product.saltPer100g}g salt/100g)`, penalty: 1.0 });
  } else if (product.saltPer100g > 1.2) {
    score -= 0.5;
    deductions.push({ reason: `High sodium content (${product.saltPer100g}g salt/100g)`, penalty: 0.5 });
  }

  // Saturated fat / Palm oil penalty
  const hasPalmOil = product.ingredients.some((i) => i.toLowerCase().includes("palm"));
  if (hasPalmOil) {
    score -= 0.6;
    deductions.push({ reason: "Contains refined Palm Oil (saturated palmitic fat)", penalty: 0.6 });
  }

  // Harmful additives count
  const harmfulCount = product.harmfulAdditivesDetected?.length || 0;
  if (harmfulCount > 0) {
    const penalty = Math.min(1.2, harmfulCount * 0.5);
    score -= penalty;
    deductions.push({ reason: `${harmfulCount} flagged additives or synthetic enhancers`, penalty });
  }

  // Nutriscore adjustment
  if (product.nutriscoreGrade === "E") {
    score -= 0.5;
  } else if (product.nutriscoreGrade === "A") {
    score += 0.4;
  }

  const finalScore = Math.max(1.0, Math.min(5.0, +score.toFixed(1)));
  const cleanScore = Math.round((finalScore / 5.0) * 100);

  return {
    score: finalScore,
    cleanScore,
    deductions
  };
}

// Calculate Personal Health Fit personalized MatchMeter
export function calculatePersonalizedMatch(product: PackagedProduct, user: UserHealthProfile) {
  let matchPct = 95;
  const flags: { type: "green" | "yellow" | "red"; title: string; message: string }[] = [];

  // Diabetic check
  const isDiabeticGoal = user.goal === "diabetic_care";
  if (product.sugarPer100g > 10 || product.ingredients.some((i) => i.toLowerCase().includes("invert") || i.toLowerCase().includes("maltodextrin"))) {
    if (isDiabeticGoal) {
      matchPct -= 40;
      flags.push({
        type: "red",
        title: "Diabetic Hazard Flag",
        message: `High glycemic index with ${product.sugarPer100g}g sugar and refined starches. Rapid insulin spike alert!`
      });
    } else {
      matchPct -= 15;
      flags.push({
        type: "yellow",
        title: "Elevated Sugar Alert",
        message: `${product.sugarPer100g}g sugar per 100g exceeds recommended snack threshold.`
      });
    }
  } else {
    flags.push({
      type: "green",
      title: "Glycemic Fit",
      message: "Sugar levels are within controlled parameters."
    });
  }

  // Weight loss check
  const isWeightLoss = user.goal === "weight_loss";
  if (product.caloriesPer100g > 400 || product.fatPer100g > 15) {
    if (isWeightLoss) {
      matchPct -= 30;
      flags.push({
        type: "red",
        title: "Calorie Density Flag",
        message: `${product.caloriesPer100g} kcal/100g with high fat density opposes calorie deficit target.`
      });
    } else {
      matchPct -= 10;
      flags.push({
        type: "yellow",
        title: "Calorie Dense",
        message: "High energy density. Exercise portion restraint."
      });
    }
  }

  // Hypertension / Salt check
  if (product.saltPer100g > 1.5) {
    matchPct -= 20;
    flags.push({
      type: "red",
      title: "Hypertension / Sodium Flag",
      message: `Extremely high salt (${product.saltPer100g}g/100g) strains vascular tone and water retention.`
    });
  }

  // Allergies check
  const userAllergy = (user.allergies || "").toLowerCase();
  if (userAllergy && userAllergy !== "none") {
    const matchedAllergen = product.ingredients.find((i) =>
      i.toLowerCase().includes(userAllergy)
    );
    if (matchedAllergen) {
      matchPct = Math.min(matchPct, 20);
      flags.push({
        type: "red",
        title: `Allergen Warning (${user.allergies})`,
        message: `Product explicitly lists '${matchedAllergen}' which conflicts with your allergy profile!`
      });
    }
  }

  return {
    matchPct: Math.max(10, Math.min(100, matchPct)),
    flags
  };
}

// Clean alternative healthier suggestions for popular items
const CLEAN_SWAPS_DATABASE: Record<
  string,
  {
    name: string;
    brand: string;
    category: string;
    truthInScore: number;
    benefits: string[];
    swappedFromCategory: string;
    barcode?: string;
  }[]
> = {
  Snacks: [
    {
      name: "The Whole Truth Vacuum-Fried Sweet Potato Chips",
      brand: "The Whole Truth",
      category: "Snacks",
      truthInScore: 4.8,
      benefits: [
        "70% less oil absorption via vacuum-frying at low temperature",
        "Cooked in cold-pressed groundnut oil (100% Zero Palm Oil)",
        "Zero MSG or chemical enhancers (Zero E627, Zero E631)",
        "Rich in natural prebiotic dietary fiber & complex beta-carotene"
      ],
      swappedFromCategory: "Snacks",
      barcode: "8906033770209"
    },
    {
      name: "Farmley Slow-Roasted Himalayan Salt Makhana (Foxnuts)",
      brand: "Farmley",
      category: "Snacks",
      truthInScore: 4.9,
      benefits: [
        "100% Non-fried, slow dry-roasted whole lotus seed crunch",
        "Zero palm oil, zero trans fat, zero cholesterol",
        "High natural plant protein (9.7g) & rich in bone calcium",
        "Low Glycemic Index (GI 35) — prevents sharp glucose spikes"
      ],
      swappedFromCategory: "Snacks",
      barcode: "8906123450012"
    },
    {
      name: "Beyond Snack Air-Cooked Kerala Raw Banana Chips",
      brand: "Beyond Snack",
      category: "Snacks",
      truthInScore: 4.7,
      benefits: [
        "Cooked in 100% pure virgin coconut oil (Zero Palm Oil / Palmolein)",
        "Zero artificial synthetic food colors or chemical preservatives",
        "Authentic Kerala Nendran raw banana rich in resistant starch",
        "40% lower saturated fat than commercial potato chips"
      ],
      swappedFromCategory: "Snacks",
      barcode: "8908012345019"
    },
    {
      name: "Slurrp Farm 100% Baked Ragi & Beetroot Millet Crunchies",
      brand: "Slurrp Farm",
      category: "Snacks",
      truthInScore: 4.8,
      benefits: [
        "100% Baked whole millets (Finger millet / Ragi & Jowar)",
        "Zero Maida, zero Palm Oil, zero chemical leavening agents",
        "Natural beetroot color & iron rich micronutrients",
        "Gluten-free certified with 3x higher calcium"
      ],
      swappedFromCategory: "Snacks",
      barcode: "8906107380029"
    },
    {
      name: "TagZ Foods Italian Cheese Popped Potato Chips (Never Fried)",
      brand: "TagZ Foods",
      category: "Snacks",
      truthInScore: 4.5,
      benefits: [
        "Crafted using intense popping tech — 50% less fat than Lay's",
        "Zero palm oil, zero trans fat, zero synthetic enhancers",
        "Real European cheese seasoning without synthetic E621/E635",
        "Light crunch without heavy oxidized oil residue"
      ],
      swappedFromCategory: "Snacks",
      barcode: "8908009876543"
    }
  ],
  "Instant Noodles": [
    {
      name: "100% Foxtail Millet Noodles (Sun-Dried)",
      brand: "Slurrp Farm / Native",
      category: "Instant Noodles",
      truthInScore: 4.8,
      benefits: ["Zero Palm Oil", "Zero MSG / E635", "100% Whole Millet Grain", "Low Glycemic Index"],
      swappedFromCategory: "Instant Noodles",
      barcode: "8906107380012"
    },
    {
      name: "Brown Rice & Quinoa Vermicelli",
      brand: "Conscious Food",
      category: "Instant Noodles",
      truthInScore: 4.6,
      benefits: ["High dietary fiber (8g)", "Cold-pressed seasoning", "Gluten-Free certified"],
      swappedFromCategory: "Instant Noodles"
    }
  ],
  Biscuits: [
    {
      name: "Whole Wheat Rolled Oats & Jaggery Cookies",
      brand: "The Whole Truth",
      category: "Biscuits",
      truthInScore: 4.7,
      benefits: ["No refined sugar (Sweetened with date powder)", "No palm oil or invert syrup", "100% Whole Grain"],
      swappedFromCategory: "Biscuits"
    },
    {
      name: "Ragi & Almond Digestive Cookies",
      brand: "Manna",
      category: "Biscuits",
      truthInScore: 4.4,
      benefits: ["Rich in Calcium & Plant Protein", "Zero Maida", "Zero artificial leavening chemicals"],
      swappedFromCategory: "Biscuits"
    }
  ],
  "Carbonated Drinks": [
    {
      name: "Pure Tender Coconut Water (No Added Sugar)",
      brand: "Paper Boat Nature / Raw",
      category: "Carbonated Drinks",
      truthInScore: 4.9,
      benefits: ["100% natural electrolytes", "Zero chemical colors (No E150d)", "Zero added sugar"],
      swappedFromCategory: "Carbonated Drinks",
      barcode: "8906001020015"
    },
    {
      name: "Live Fermented Kombucha (Ginger Lemon)",
      brand: "Atmosphere",
      category: "Carbonated Drinks",
      truthInScore: 4.5,
      benefits: ["Live probiotic cultures for gut microbiome", "Under 3g natural sugar", "Natural effervescence"],
      swappedFromCategory: "Carbonated Drinks"
    }
  ],
  Confectionery: [
    {
      name: "Paul and Mike 72% Single Origin Kerala Dark Chocolate",
      brand: "Paul and Mike",
      category: "Confectionery",
      truthInScore: 4.8,
      benefits: ["72% Pure farm-grown Kerala cocoa", "Zero Palm Oil or synthetic vegetable fats", "Zero E476 chemical emulsifiers"],
      swappedFromCategory: "Confectionery"
    },
    {
      name: "The Whole Truth 71% Dark Chocolate Bar with Dates",
      brand: "The Whole Truth",
      category: "Confectionery",
      truthInScore: 4.9,
      benefits: ["Zero refined cane sugar (Sweetened 100% with dates)", "Just 2 ingredients: Cocoa + Dates", "High natural antioxidants"],
      swappedFromCategory: "Confectionery"
    }
  ],
  "Health Drinks": [
    {
      name: "Slurrp Farm Sprouted Ragi & Almond Milk Powder",
      brand: "Slurrp Farm",
      category: "Health Drinks",
      truthInScore: 4.8,
      benefits: ["Sprouted millets with maximum nutrient bioavailability", "Zero white sugar / liquid glucose", "Real almond & cardamom power"],
      swappedFromCategory: "Health Drinks"
    },
    {
      name: "Early Foods Sprouted Sathumaavu Multi-Grain Health Drink",
      brand: "Early Foods",
      category: "Health Drinks",
      truthInScore: 4.9,
      benefits: ["Traditional Kerala porridge recipe with 14 sprouted grains", "Zero chemical maltodextrin or caramel color", "100% clean whole food nutrition"],
      swappedFromCategory: "Health Drinks"
    }
  ],
  Condiments: [
    {
      name: "Farmdidi 100% Homemade Country Tomato Chutney",
      brand: "Farmdidi",
      category: "Condiments",
      truthInScore: 4.8,
      benefits: ["Zero high-fructose corn syrup or refined sugar load", "Preserved with natural vinegar and cold-pressed mustard oil", "Zero E211 sodium benzoate"],
      swappedFromCategory: "Condiments"
    },
    {
      name: "The Whole Truth 100% Roasted Peanut Butter (Unsweetened)",
      brand: "The Whole Truth",
      category: "Condiments",
      truthInScore: 4.9,
      benefits: ["Single ingredient: 100% slow-roasted slow-ground peanuts", "Zero hydrogenated palm oil or emulsifiers", "30g protein per 100g"],
      swappedFromCategory: "Condiments"
    }
  ],
  Dairy: [
    {
      name: "Milma Pure Organic Desi Cow A2 Ghee",
      brand: "Milma",
      category: "Dairy",
      truthInScore: 4.8,
      benefits: ["Traditional bilona churned from grass-fed cows", "Zero adulterants, zero trans fats", "Rich in butyric acid and gut healing fat-soluble vitamins"],
      swappedFromCategory: "Dairy",
      barcode: "8908003120013"
    },
    {
      name: "Epigamia Natural Greek Yogurt (No Added Sugar)",
      brand: "Epigamia",
      category: "Dairy",
      truthInScore: 4.9,
      benefits: ["2x Protein (10g) vs regular curd", "Zero added sugar, zero artificial thickening agents", "Live active probiotic gut cultures"],
      swappedFromCategory: "Dairy"
    }
  ],
  Beverages: [
    {
      name: "Raw Pressery 100% Cold-Pressed Valencia Orange Juice",
      brand: "Raw Pressery",
      category: "Beverages",
      truthInScore: 4.8,
      benefits: ["Zero added sugar, zero preservatives (High Pressure Processed)", "100% Pure fruit with natural Vitamin C", "Not from chemical concentrate"],
      swappedFromCategory: "Beverages"
    },
    {
      name: "Paper Boat Pure Tender Coconut Water",
      brand: "Paper Boat",
      category: "Beverages",
      truthInScore: 4.9,
      benefits: ["100% Natural isotonic hydration", "Zero added sugar, zero synthetic colors", "Rich in natural potassium and bio-electrolytes"],
      swappedFromCategory: "Beverages",
      barcode: "8906001020015"
    }
  ],
  "Breakfast Cereals": [
    {
      name: "True Elements 100% Rolled Wholegrain Oats",
      brand: "True Elements",
      category: "Breakfast Cereals",
      truthInScore: 4.9,
      benefits: ["Zero added sugar or invert syrups (unlike commercial flakes)", "High soluble beta-glucan fiber to lower LDL cholesterol", "Zero artificial food colorings"],
      swappedFromCategory: "Breakfast Cereals"
    },
    {
      name: "The Whole Truth 5-Grain Muesli with Seeds & Nuts",
      brand: "The Whole Truth",
      category: "Breakfast Cereals",
      truthInScore: 4.8,
      benefits: ["Sweetened only with freeze-dried fruits and dates", "Zero refined sugars, zero maltodextrin", "100% Wholegrain complex carbs"],
      swappedFromCategory: "Breakfast Cereals"
    }
  ],
  "Ready to Cook": [
    {
      name: "ID 100% Natural Fermented Idly & Dosa Batter",
      brand: "ID Fresh Food",
      category: "Ready to Cook",
      truthInScore: 4.9,
      benefits: ["100% Traditional fermented whole grain batter", "Zero preservatives, zero synthetic soda/chemicals", "Clean live gut cultures"],
      swappedFromCategory: "Ready to Cook",
      barcode: "8906047010019"
    },
    {
      name: "Akshayakalpa Organic Multi-Millet Chapati Dough",
      brand: "Akshayakalpa",
      category: "Ready to Cook",
      truthInScore: 4.7,
      benefits: ["Whole grain atta + finger millet base", "Zero hydrogenated palmolein fat", "High fiber & low glycemic response"],
      swappedFromCategory: "Ready to Cook"
    }
  ]
};

export default function AIFoodScannerView({
  userProfile,
  onOpenLiveCamera,
  onSelectProductForCompare,
  initialSelectedBarcode,
  externalScannedProduct
}: AIFoodScannerViewProps) {
  const [customScannedProducts, setCustomScannedProducts] = useState<PackagedProduct[]>([]);
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<PackagedProduct>(() => {
    if (initialSelectedBarcode) {
      const match = PACKAGED_PRODUCTS_DATASET.find((p) => p.barcode === initialSelectedBarcode);
      if (match) return match;
    }
    return PACKAGED_PRODUCTS_DATASET[0];
  });

  useEffect(() => {
    if (externalScannedProduct) {
      setSelectedProduct(externalScannedProduct);
      setCustomScannedProducts((prev) => [
        externalScannedProduct,
        ...prev.filter((p) => p.barcode !== externalScannedProduct.barcode)
      ]);
    }
  }, [externalScannedProduct]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsScanningLive(true);
      setScanStatusMessage("Scanning photo & analyzing nutrition label with AI Vision...");
      try {
        const res = await fetch("/api/scan-barcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 })
        });
        const data = await res.json();
        if (data.success && data.product) {
          setSelectedProduct(data.product);
          setCustomScannedProducts((prev) => [
            data.product,
            ...prev.filter((p: any) => p.barcode !== data.product.barcode)
          ]);
        }
      } catch (err) {
        console.error("Scan error:", err);
      } finally {
        setIsScanningLive(false);
        setScanStatusMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLookupBarcode = async (codeToLookup?: string) => {
    const query = (codeToLookup || searchQuery).trim();
    if (!query) return;

    // First check local and comprehensive products
    const localMatch = allAvailableProducts.find(
      (p) => p.barcode === query || p.productName.toLowerCase().includes(query.toLowerCase())
    );
    if (localMatch) {
      setSelectedProduct(localMatch);
      return;
    }

    setIsScanningLive(true);
    setScanStatusMessage(`Querying Global Barcode Database (OpenFoodFacts) for #${query}...`);
    try {
      const res = await fetch("/api/scan-barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: query })
      });
      const data = await res.json();
      if (data.success && data.product) {
        setSelectedProduct(data.product);
        setCustomScannedProducts((prev) => [
          data.product,
          ...prev.filter((p: any) => p.barcode !== data.product.barcode)
        ]);
      }
    } catch (err) {
      console.error("Barcode lookup error:", err);
    } finally {
      setIsScanningLive(false);
      setScanStatusMessage(null);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeSubTab, setActiveSubTab] = useState<"score" | "additives" | "plus" | "swaps" | "ask_tia">("score");

  // TIA Assistant state
  const [tiaMessages, setTiaMessages] = useState<
    { role: "user" | "assistant"; text: string; time: string }[]
  >([
    {
      role: "assistant",
      text: "Hello! I am TIA (AIFood Nutrition Assistant). I translate complicated food labels, decode chemical numbers, and expose hidden marketing tricks. What ingredient or food product would you like to know about today?",
      time: "Just now"
    }
  ]);
  const [tiaInput, setTiaInput] = useState("");

  const allAvailableProducts = useMemo(() => {
    const map = new Map<string, PackagedProduct>();
    customScannedProducts.forEach((p) => map.set(p.barcode, p));
    COMPREHENSIVE_PACKAGED_DATABASE.forEach((p) => {
      if (!map.has(p.barcode)) map.set(p.barcode, p);
    });
    PACKAGED_PRODUCTS_DATASET.forEach((p) => {
      if (!map.has(p.barcode)) map.set(p.barcode, p);
    });
    return Array.from(map.values());
  }, [customScannedProducts]);

  const filteredProducts = useMemo(() => {
    return allAvailableProducts.filter((p) => {
      const matchesSearch =
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.includes(searchQuery);
      const matchesCategory =
        categoryFilter === "all" || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [allAvailableProducts, searchQuery, categoryFilter]);

  // Calculations for currently selected product
  const ratingData = useMemo(() => calculateAIFoodScore(selectedProduct), [selectedProduct]);
  const matchData = useMemo(() => calculatePersonalizedMatch(selectedProduct, userProfile), [
    selectedProduct,
    userProfile
  ]);

  const cleanSwaps = useMemo(() => {
    const pName = (selectedProduct.productName || "").toLowerCase();
    const pCat = (selectedProduct.category || "").toLowerCase();

    // Check Snacks & Potato Chips
    if (
      pCat.includes("snack") ||
      pCat.includes("chip") ||
      pCat.includes("crisp") ||
      pName.includes("chip") ||
      pName.includes("crisp") ||
      pName.includes("potato") ||
      pName.includes("lay") ||
      pName.includes("kurkure") ||
      pName.includes("bingo") ||
      pName.includes("dorito") ||
      pName.includes("pringles") ||
      pName.includes("namkeen") ||
      pName.includes("bhujia") ||
      pName.includes("puff")
    ) {
      return CLEAN_SWAPS_DATABASE["Snacks"] || [];
    }

    // Check Instant Noodles
    if (
      pCat.includes("noodle") ||
      pName.includes("noodle") ||
      pName.includes("maggi") ||
      pName.includes("ramen") ||
      pName.includes("pasta")
    ) {
      return CLEAN_SWAPS_DATABASE["Instant Noodles"] || [];
    }

    // Check Biscuits & Cookies
    if (
      pCat.includes("biscuit") ||
      pCat.includes("cookie") ||
      pName.includes("biscuit") ||
      pName.includes("cookie") ||
      pName.includes("parle") ||
      pName.includes("britannia") ||
      pName.includes("cracker")
    ) {
      return CLEAN_SWAPS_DATABASE["Biscuits"] || [];
    }

    // Check Carbonated Drinks / Colas / Sodas
    if (
      pCat.includes("carbonated") ||
      pCat.includes("drink") ||
      pCat.includes("cola") ||
      pCat.includes("beverage") ||
      pName.includes("cola") ||
      pName.includes("coke") ||
      pName.includes("pepsi") ||
      pName.includes("sprite") ||
      pName.includes("soda") ||
      pName.includes("thums")
    ) {
      return CLEAN_SWAPS_DATABASE["Carbonated Drinks"] || [];
    }

    // Check Confectionery / Chocolates
    if (
      pCat.includes("confectionery") ||
      pCat.includes("chocolate") ||
      pName.includes("chocolate") ||
      pName.includes("kitkat") ||
      pName.includes("dairy milk") ||
      pName.includes("nutella") ||
      pName.includes("cadbury")
    ) {
      return CLEAN_SWAPS_DATABASE["Confectionery"] || [];
    }

    // Check Health Drinks / Malt Drinks
    if (
      pCat.includes("health") ||
      pName.includes("bournvita") ||
      pName.includes("horlicks") ||
      pName.includes("boost") ||
      pName.includes("complan")
    ) {
      return CLEAN_SWAPS_DATABASE["Health Drinks"] || [];
    }

    // Check Condiments & Sauces
    if (
      pCat.includes("condiment") ||
      pCat.includes("sauce") ||
      pName.includes("ketchup") ||
      pName.includes("sauce") ||
      pName.includes("kissan") ||
      pName.includes("mayo")
    ) {
      return CLEAN_SWAPS_DATABASE["Condiments"] || [];
    }

    // Check Dairy
    if (
      pCat.includes("dairy") ||
      pCat.includes("milk") ||
      pName.includes("ghee") ||
      pName.includes("butter") ||
      pName.includes("curd") ||
      pName.includes("yogurt") ||
      pName.includes("cheese") ||
      pName.includes("paneer")
    ) {
      return CLEAN_SWAPS_DATABASE["Dairy"] || [];
    }

    // Check Breakfast Cereals
    if (
      pCat.includes("cereal") ||
      pName.includes("flakes") ||
      pName.includes("muesli") ||
      pName.includes("granola") ||
      pName.includes("kellogg") ||
      pName.includes("chocos")
    ) {
      return CLEAN_SWAPS_DATABASE["Breakfast Cereals"] || [];
    }

    // Check Ready to Cook
    if (
      pCat.includes("ready") ||
      pCat.includes("instant") ||
      pName.includes("batter") ||
      pName.includes("mix") ||
      pName.includes("idli mix") ||
      pName.includes("dosa mix")
    ) {
      return CLEAN_SWAPS_DATABASE["Ready to Cook"] || [];
    }

    if (CLEAN_SWAPS_DATABASE[selectedProduct.category]) {
      return CLEAN_SWAPS_DATABASE[selectedProduct.category];
    }

    return CLEAN_SWAPS_DATABASE["Snacks"] || [];
  }, [selectedProduct]);

  const handleSelectCleanSwap = (swap: (typeof CLEAN_SWAPS_DATABASE)["Snacks"][0]) => {
    const match = allAvailableProducts.find(
      (p) =>
        (swap.barcode && p.barcode === swap.barcode) ||
        p.productName.toLowerCase().includes(swap.name.toLowerCase().slice(0, 15))
    );
    if (match) {
      setSelectedProduct(match);
    } else {
      const syntheticProduct: PackagedProduct = {
        barcode: swap.barcode || `SWAP-${Date.now()}`,
        brand: swap.brand,
        productName: swap.name,
        category: swap.category,
        imageUrl:
          "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
        nutriscoreGrade: "A",
        novaGroup: 1,
        sugarPer100g: 3.5,
        caloriesPer100g: 390,
        fatPer100g: 11.2,
        saltPer100g: 0.4,
        ingredients: ["Whole Raw Produce", "Cold-Pressed Oil", "Rock Salt", "Natural Herbs & Spices"],
        additives: [],
        isUltraProcessed: false,
        harmfulAdditivesDetected: [],
        healthWarnings: ["Clean label: Zero palm oil, zero chemical preservatives, zero synthetic flavor enhancers."]
      };
      setSelectedProduct(syntheticProduct);
    }
  };

  const handleCompareWithSwap = (swap: (typeof CLEAN_SWAPS_DATABASE)["Snacks"][0]) => {
    if (!onSelectProductForCompare) return;
    const match = allAvailableProducts.find(
      (p) =>
        (swap.barcode && p.barcode === swap.barcode) ||
        p.productName.toLowerCase().includes(swap.name.toLowerCase().slice(0, 15))
    );
    const targetProduct: PackagedProduct = match || {
      barcode: swap.barcode || `SWAP-${Date.now()}`,
      brand: swap.brand,
      productName: swap.name,
      category: swap.category,
      imageUrl:
        "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
      nutriscoreGrade: "A",
      novaGroup: 1,
      sugarPer100g: 3.5,
      caloriesPer100g: 390,
      fatPer100g: 11.2,
      saltPer100g: 0.4,
      ingredients: ["Whole Raw Produce", "Cold-Pressed Oil", "Rock Salt", "Natural Herbs & Spices"],
      additives: [],
      isUltraProcessed: false,
      harmfulAdditivesDetected: [],
      healthWarnings: ["Clean label: Zero palm oil, zero chemical preservatives, zero synthetic flavor enhancers."]
    };
    onSelectProductForCompare(selectedProduct, targetProduct);
  };

  // Decode additives in product
  const decodedAdditives = useMemo(() => {
    const list: {
      code: string;
      info: typeof ADDITIVE_KNOWLEDGE_BASE[string];
    }[] = [];

    selectedProduct.additives.forEach((add) => {
      const cleanKey = add.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      let matchedInfo = ADDITIVE_KNOWLEDGE_BASE[cleanKey] || ADDITIVE_KNOWLEDGE_BASE[add];

      if (!matchedInfo) {
        // Fallback decoder
        matchedInfo = {
          name: add,
          hazardLevel: add.includes("6") ? "high" : add.includes("15") ? "high" : "caution",
          plainEnglish: `Food additive formulation classified as ${add}.`,
          purpose: "Industrial texture, shelf stability, or synthetic preservation.",
          healthImpact: "Synthetic additive. Consuming multiple processed foods with additives compounds chemical intake."
        };
      }
      list.push({ code: add, info: matchedInfo });
    });

    // Check for palm oil or invert sugar in ingredients
    if (selectedProduct.ingredients.some((i) => i.toLowerCase().includes("palm"))) {
      list.push({ code: "Palm Oil", info: ADDITIVE_KNOWLEDGE_BASE["PALM_OIL"] });
    }
    if (selectedProduct.ingredients.some((i) => i.toLowerCase().includes("invert"))) {
      list.push({ code: "Invert Sugar", info: ADDITIVE_KNOWLEDGE_BASE["INVERT_SUGAR"] });
    }

    return list;
  }, [selectedProduct]);

  const handleSendTia = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tiaInput.trim()) return;

    const query = tiaInput.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsgs = [...tiaMessages, { role: "user" as const, text: query, time: timeStr }];
    setTiaMessages(newMsgs);
    setTiaInput("");

    // Simulate smart TIA nutrition engine response
    setTimeout(() => {
      let reply = `Based on independent nutritional analysis of ${selectedProduct.productName}: `;
      const lower = query.toLowerCase();

      if (lower.includes("palm oil") || lower.includes("oil")) {
        reply = `Refined Palm Oil in ${selectedProduct.productName} is heavily processed and oxidized. It has about 50% saturated fat (palmitic acid), which raises LDL cholesterol and arterial stiffness. Choosing products with cold-pressed mustard, coconut, or olive oil is far healthier!`;
      } else if (lower.includes("diabetic") || lower.includes("sugar")) {
        reply = `${selectedProduct.productName} contains ${selectedProduct.sugarPer100g}g sugar per 100g. ${
          selectedProduct.sugarPer100g > 10
            ? "⚠️ For diabetic or pre-diabetic individuals, this will trigger a fast glucose spike due to high glycemic index."
            : "✓ The sugar content is relatively low, but watch out for refined maida starches."
        }`;
      } else if (lower.includes("safe") || lower.includes("kids") || lower.includes("healthy")) {
        reply = `Clean Food Score for this product is ${ratingData.score}/5.0 (Clean Score: ${ratingData.cleanScore}%). ${
          ratingData.score < 3.0
            ? "We do NOT recommend regular consumption. It is ultra-processed with synthetic additives."
            : "It has a decent nutritional profile, but enjoy as part of a varied, whole-food diet."
        }`;
      } else {
        reply = `Examining ${selectedProduct.productName}: It has a Clean Food Score of ${ratingData.score}/5.0 with ${selectedProduct.additives.length} industrial additives. For your profile goal of '${userProfile.goal}', your MatchMeter is ${matchData.matchPct}%. We recommend checking the 'Clean Swaps' tab for healthier alternatives.`;
      }

      setTiaMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 600);
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 4.0) return "bg-emerald-500 text-white";
    if (score >= 3.0) return "bg-amber-500 text-white";
    return "bg-rose-500 text-white";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 4.0) return { label: "Clean & Healthy", desc: "Minimal or zero harmful additives. Wholesome profile." };
    if (score >= 3.0) return { label: "Moderate / Fair", desc: "Consume occasionally. Some added sugars or sodium." };
    return { label: "Ultra-Processed / Avoid", desc: "High hazard additives, hidden sugars, or palm oil." };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Banner / AIFood Title Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-teal-500/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
                <ScanBarcode className="w-3.5 h-3.5" />
                AIFood Product Intelligence Suite
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                100% Unbiased
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              AIFood Food Scanner & Ingredient Decoder
            </h1>
            <p className="text-sm text-teal-50 leading-relaxed">
              Decode complex packaged food labels, expose hidden sugars and chemical INS codes, see your
              personalized MatchMeter score, and discover clean-label healthier swaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <label className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs flex items-center gap-2 backdrop-blur-md border border-white/30 shadow-lg cursor-pointer transition-all hover:scale-105">
              <Upload className="w-4 h-4 text-emerald-300" />
              <span>Upload Product Photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {onOpenLiveCamera && (
              <button
                onClick={onOpenLiveCamera}
                className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Live Barcode Camera</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Selection & Catalog (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Select or Scan Product</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {filteredProducts.length} items
              </span>
            </div>

            {/* Search Input & Global Barcode Scanner */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter any barcode (e.g. 3017620422003) or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLookupBarcode();
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleLookupBarcode()}
                  disabled={isScanningLive || !searchQuery.trim()}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ScanBarcode className="w-3.5 h-3.5" />
                  <span>Scan Worldwide Barcode</span>
                </button>
                <label className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Live Scanning Progress */}
              {isScanningLive && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-pulse">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                  <span>{scanStatusMessage || "Deciphering product with AI..."}</span>
                </div>
              )}
            </div>

            {/* Category Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {["all", "Snacks", "Noodles", "Biscuits", "Drinks", "Confectionery"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat === "Snacks" ? "Snacks & Chips" : cat}
                </button>
              ))}
            </div>

            {/* Product List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct.barcode === p.barcode;
                const pRating = calculateAIFoodScore(p);
                return (
                  <button
                    key={p.barcode}
                    onClick={() => setSelectedProduct(p)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 shadow-sm"
                        : "bg-white border-slate-200/70 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                        {p.brand} • {p.category}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {p.productName}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-black ${getScoreBadgeColor(
                            pRating.score
                          )}`}
                        >
                          ★ {pRating.score}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {p.isUltraProcessed ? "NOVA 4 Ultra-processed" : "NOVA 3"}
                        </span>
                        {pRating.score < 3.8 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            ✨ Swaps Available
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed AIFood Intelligence Card (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Product Header & Score Summary Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.productName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md border border-slate-200 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    {selectedProduct.brand} • Barcode: {selectedProduct.barcode}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {selectedProduct.productName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      Category: {selectedProduct.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        selectedProduct.isUltraProcessed
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {selectedProduct.isUltraProcessed ? "NOVA Group 4 (Ultra-Processed)" : "Processed (NOVA 3)"}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-white">
                      Nutri-Score: {selectedProduct.nutriscoreGrade}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compare Button */}
              {onSelectProductForCompare && (
                <button
                  onClick={() => onSelectProductForCompare(selectedProduct)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform hover:scale-105 shrink-0 cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare Head-to-Head</span>
                </button>
              )}
            </div>

            {/* Score & Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Clean Food Score Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Clean Health Rating
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200 text-slate-700">
                    Out of 5.0
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {ratingData.score}
                  </span>
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(Math.round(ratingData.score))}
                    {"☆".repeat(5 - Math.round(ratingData.score))}
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {getScoreDescription(ratingData.score).label}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {getScoreDescription(ratingData.score).desc}
                </p>
              </div>

              {/* Clean Score Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Clean Food Score
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Lab Verified
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-black ${
                      ratingData.cleanScore > 70
                        ? "text-emerald-600"
                        : ratingData.cleanScore > 40
                        ? "text-amber-500"
                        : "text-rose-600"
                    }`}
                  >
                    {ratingData.cleanScore}
                    <span className="text-sm font-normal text-slate-400">/100</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ratingData.cleanScore > 70
                        ? "bg-emerald-500"
                        : ratingData.cleanScore > 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${ratingData.cleanScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Based on ingredient purity, additives hazard, and processing intensity.
                </p>
              </div>

              {/* MatchMeter Card (Personal Health Fit) */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Your MatchMeter
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {userProfile.goal.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-black ${
                      matchData.matchPct > 75
                        ? "text-emerald-600"
                        : matchData.matchPct > 50
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {matchData.matchPct}%
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Fit</span>
                </div>
                <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      matchData.matchPct > 75
                        ? "bg-emerald-500"
                        : matchData.matchPct > 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${matchData.matchPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Personalized match for {userProfile.name} ({userProfile.dailySugarLimitGrams}g daily sugar cap).
                </p>
              </div>
            </div>

            {/* Nutrition per 100g Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    Calories
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {selectedProduct.caloriesPer100g} <span className="text-xs font-normal">kcal/100g</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Candy className="w-3 h-3 text-pink-500" />
                    Sugar
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {selectedProduct.sugarPer100g}g{" "}
                    <span
                      className={`text-[10px] font-bold ${
                        selectedProduct.sugarPer100g > 15 ? "text-rose-500" : "text-emerald-500"
                      }`}
                    >
                      ({selectedProduct.sugarPer100g > 15 ? "High" : "Low"})
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-amber-500" />
                    Fat
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {selectedProduct.fatPer100g}g
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Salt / Sodium</div>
                  <div className="text-sm font-black text-slate-900">
                    {selectedProduct.saltPer100g}g
                  </div>
                </div>
              </div>

              {selectedProduct.healthWarnings.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{selectedProduct.healthWarnings[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Automatic Clean Swap Alert & Recommendations (Instant Suggestions for Low Rated Products like Potato Chips) */}
          {ratingData.score < 3.8 && cleanSwaps.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                        ✨ Smart Clean-Label Alternatives Available
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900">
                        +{(cleanSwaps[0].truthInScore - ratingData.score > 0 ? (cleanSwaps[0].truthInScore - ratingData.score).toFixed(1) : "3.0")} Higher Score
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">
                      {selectedProduct.productName} has a low clean score ({ratingData.score}/5.0). Here are top recommended alternatives in the same food category with Zero Palm Oil:
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubTab("swaps")}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Explore All ({cleanSwaps.length}) Swaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clean Swaps Quick Cards Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {cleanSwaps.slice(0, 2).map((swap, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-white/95 rounded-2xl p-4 border border-emerald-200/90 shadow-2xs hover:shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                          {swap.brand}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                          ★ {swap.truthInScore}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1">
                        {swap.name}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {swap.benefits.slice(0, 2).map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60"
                          >
                            ✓ {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                      <button
                        onClick={() => handleSelectCleanSwap(swap)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-colors cursor-pointer"
                      >
                        Select Alternative
                      </button>
                      {onSelectProductForCompare && (
                        <button
                          onClick={() => handleCompareWithSwap(swap)}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                          title="Compare side-by-side"
                        >
                          <Scale className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Compare</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Navigation Tabs for Deep Breakdown */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab("score")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeSubTab === "score"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Score Breakdown ({ratingData.deductions.length} Factors)
            </button>
            <button
              onClick={() => setActiveSubTab("additives")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "additives"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>Ingredient & Additive Decoder</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-black">
                {decodedAdditives.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab("plus")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "plus"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>Personalized Flags (Personal Health Fit)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black">
                {matchData.flags.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab("swaps")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "swaps"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Clean Swaps & Better Choices ({cleanSwaps.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab("ask_tia")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "ask_tia"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask TIA Assistant</span>
            </button>
          </div>

          {/* SubTab Content 1: Score Deductions */}
          {activeSubTab === "score" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>How AIFood Computed this {ratingData.score}/5.0 Score</span>
              </h3>
              <p className="text-xs text-slate-500">
                Unlike sponsored ratings, AIFood evaluates products on scientific clinical consensus: NOVA
                processing group, added sugar load, sodium thresholds, and verified additive toxicology.
              </p>

              <div className="space-y-2.5">
                {ratingData.deductions.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">
                        {d.reason}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-rose-600 font-mono shrink-0">
                      -{d.penalty.toFixed(1)} pts
                    </span>
                  </div>
                ))}
              </div>

              {/* Complete Ingredients List */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700">
                  Full Decoded Ingredients on Package:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.ingredients.map((ing, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SubTab Content 2: Plain-Language Additives & Chemicals Decoder */}
          {activeSubTab === "additives" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Plain-Language Chemical & Additive Decoder</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No more fine-print confusion. Here is what is actually inside this product and why it was used.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {decodedAdditives.map((item, idx) => {
                  const isHigh = item.info.hazardLevel === "high";
                  const isCaution = item.info.hazardLevel === "caution";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isHigh
                          ? "bg-rose-50/50 border-rose-200"
                          : isCaution
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {item.info.name}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {item.code}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {item.info.plainEnglish}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                            isHigh
                              ? "bg-rose-500 text-white"
                              : isCaution
                              ? "bg-amber-500 text-white"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          {item.info.hazardLevel} Hazard
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Why it is used by makers:
                          </span>
                          <span className="text-slate-700">{item.info.purpose}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Clinical Health Impact:
                          </span>
                          <span
                            className={
                              isHigh
                                ? "text-rose-600 font-semibold"
                                : "text-slate-700"
                            }
                          >
                            {item.info.healthImpact}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab Content 3: Personal Health Fit Personalized Health Flags */}
          {activeSubTab === "plus" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span>Personal Health Fit: Personalized Health Flags for {userProfile.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Custom flags generated based on your profile goal ({userProfile.goal}), age ({userProfile.age}y), and
                  allergies ({userProfile.allergies}).
                </p>
              </div>

              <div className="space-y-3">
                {matchData.flags.map((flag, idx) => {
                  const isRed = flag.type === "red";
                  const isYellow = flag.type === "yellow";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                        isRed
                          ? "bg-rose-50 border-rose-300 text-rose-900"
                          : isYellow
                          ? "bg-amber-50 border-amber-300 text-amber-900"
                          : "bg-emerald-50 border-emerald-300 text-emerald-900"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isRed ? (
                          <AlertTriangle className="w-5 h-5 text-rose-500" />
                        ) : isYellow ? (
                          <Info className="w-5 h-5 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider">{flag.title}</div>
                        <div className="text-xs mt-0.5 leading-relaxed">{flag.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab Content 4: Clean Swaps & Better Choices */}
          {activeSubTab === "swaps" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AIFood Recommended Clean-Label Swaps</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instead of eating ultra-processed foods with harmful additives, switch to these clean-label
                  alternatives in the same food category.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cleanSwaps.map((swap, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-200/80 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          {swap.brand}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {swap.name}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shrink-0">
                        ★ {swap.truthInScore}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Why it is better:</span>
                      {swap.benefits.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleSelectCleanSwap(swap)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-colors cursor-pointer"
                      >
                        Select & Inspect
                      </button>
                      {onSelectProductForCompare && (
                        <button
                          onClick={() => handleCompareWithSwap(swap)}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                          title="Compare side-by-side"
                        >
                          <Scale className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Compare</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab Content 5: TIA Assistant Interactive Chat */}
          {activeSubTab === "ask_tia" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    TIA (AIFood AI) Nutrition Assistant
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ask any question about chemicals, ingredients, brand marketing claims, or diet safety.
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {tiaMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-teal-600 text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="block text-[9px] opacity-70 mt-1 text-right">{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendTia} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Ask TIA about ${selectedProduct.productName} or additives...`}
                  value={tiaInput}
                  onChange={(e) => setTiaInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
