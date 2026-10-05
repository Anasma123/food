// ============================================================================
// AIFOOD PERSONALIZED DIET RECOMMENDATION & EXERCISE ENGINE
// Tailored to User Profile (BMR, TDEE, Goal, Diet Preference, Allergies)
// ============================================================================

export interface UserHealthProfile {
  name: string;
  email: string;
  age: number;
  weightKg: number;
  heightCm: number;
  gender: string;
  goal: "weight_loss" | "muscle_gain" | "diabetic_care" | "maintenance" | string;
  activityLevel: string;
  dietaryPreference: "veg" | "non_veg" | "keto" | string;
  allergies?: string;
  dailyCalorieTarget: number;
  dailySugarLimitGrams: number;
}

export interface RecommendedMeal {
  id: string;
  mealType: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  name: string;
  idealTime: string;
  imageUrl: string;
  calories: number;
  sugar: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  safeForDiabetic: boolean;
  glycemicIndex: number;
  whyRecommended: string;
  recipeSummary: string;
  alternatives: {
    name: string;
    calories: number;
    protein: number;
    sugar: number;
    description: string;
  }[];
}

export interface ExerciseRoutineItem {
  id: string;
  title: string;
  durationMinutes: number;
  estimatedCaloriesBurned: number;
  intensity: "Low" | "Moderate" | "High";
  targetTime: "Morning" | "Afternoon" | "Evening" | "Post-Meal";
  category: "Cardio" | "Strength" | "Flexibility / Yoga" | "Recovery Walk";
  iconName: "walk" | "flame" | "dumbbell" | "bike" | "heart";
  imageUrl: string;
  muscleTargets: string[];
  benefitText: string;
  instructions: string[];
}

export interface DailyWorkoutLog {
  id: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  completedAt: string;
  date?: string; // YYYY-MM-DD
}

// ----------------------------------------------------------------------------
// MEAL RECOMMENDATION BUILDER
// ----------------------------------------------------------------------------
export function generatePersonalizedMealPlan(profile: UserHealthProfile, variationIndex: number = 0): RecommendedMeal[] {
  const isDiabetic = profile.goal === "diabetic_care";
  const isWeightLoss = profile.goal === "weight_loss";
  const isMuscleGain = profile.goal === "muscle_gain";
  const isVeg = profile.dietaryPreference === "veg";

  // Target calorie slices:
  // Breakfast ~25%, Lunch ~35%, Snack ~15%, Dinner ~25%
  const total = profile.dailyCalorieTarget || 2000;
  const cycle = Math.abs(variationIndex) % 3;

  // 1. BREAKFAST
  let breakfast: RecommendedMeal;
  if (isDiabetic) {
    breakfast = {
      id: `rec_bf_diabetic_${cycle}`,
      mealType: "Breakfast",
      name: cycle === 1 ? "Kerala Vegetable Oats Upma with Peanuts" : cycle === 2 ? "Besan Chilla (Gram Flour Crepe) with Mint Curd" : "Ragi & Sprouted Moong Idli with Tomato-Mint Chutney",
      idealTime: "07:30 AM - 08:30 AM",
      imageUrl: cycle === 1 ? "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80" : cycle === 2 ? "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80" : "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      calories: cycle === 1 ? 310 : cycle === 2 ? 290 : Math.round(total * 0.22),
      sugar: 1.8,
      protein: cycle === 1 ? 12 : cycle === 2 ? 15 : 16,
      carbs: 48,
      fat: 4.5,
      fiber: 9.0,
      safeForDiabetic: true,
      glycemicIndex: 42,
      whyRecommended: "Low Glycemic Index (42) with high soluble fiber that stabilizes morning fasting blood sugar.",
      recipeSummary: "Steamed fermented ragi and sprouted green gram cakes served with antioxidant-rich fresh mint chutney.",
      alternatives: [
        { name: "Kerala Vegetable Oats Upma with Peanuts", calories: 310, protein: 12, sugar: 2.2, description: "Fiber-rich oats sautéed with mustard, curry leaves, and beans." },
        { name: "Besan Chilla (Gram Flour Crepe) with Curd", calories: 290, protein: 15, sugar: 1.5, description: "Gluten-free protein crepe with coriander and jeera." }
      ]
    };
  } else if (isMuscleGain) {
    breakfast = {
      id: `rec_bf_muscle_${cycle}`,
      mealType: "Breakfast",
      name: cycle === 1 
        ? "Peanut Butter Rolled Oats with Chia Seeds & Sliced Banana" 
        : cycle === 2 
        ? "Paneer & Soya Chunks Scramble with 3 Whole Wheat Rotis" 
        : (isVeg ? "Paneer Bhurji with 3 Multigrain Rotis & Almond Shake" : "3-Egg Whites Masala Omelette + Rolled Oats with Banana & Honey"),
      idealTime: "07:30 AM - 08:45 AM",
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
      calories: cycle === 1 ? 480 : cycle === 2 ? 460 : Math.round(total * 0.28),
      sugar: 8.5,
      protein: cycle === 1 ? 26 : cycle === 2 ? 36 : 34,
      carbs: 62,
      fat: 14.0,
      fiber: 7.2,
      safeForDiabetic: false,
      glycemicIndex: 56,
      whyRecommended: "High protein (34g) with bioavailable amino acids to trigger post-sleep muscle protein synthesis.",
      recipeSummary: "Wholesome morning protein fuel seasoned with aromatic spices for sustained athletic energy.",
      alternatives: [
        { name: "Peanut Butter Oatmeal with Chia Seeds & Milk", calories: 480, protein: 22, sugar: 9.0, description: "Dense healthy fats and sustained complex carbohydrates." },
        { name: "Soya Chunks Stir Fry with Whole Wheat Toast", calories: 440, protein: 32, sugar: 3.5, description: "Ultra high-protein vegetarian breakfast powerhouse." }
      ]
    };
  } else {
    // Default / Weight Loss
    breakfast = {
      id: `rec_bf_weightloss_${cycle}`,
      mealType: "Breakfast",
      name: cycle === 1 
        ? "Steamed Appam (2) with Mild Vegetable Stew" 
        : cycle === 2 
        ? "Boiled Eggs (2) with Sliced Cucumber & Fresh Papaya Bowl" 
        : "Steamed Kerala Puttu with Black Kadala Curry (Light Coconut)",
      idealTime: "08:00 AM - 09:00 AM",
      imageUrl: cycle === 1 
        ? "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80" 
        : cycle === 2 
        ? "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80" 
        : "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
      calories: cycle === 1 ? 290 : cycle === 2 ? 280 : Math.round(total * 0.24),
      sugar: 2.8,
      protein: cycle === 1 ? 8 : cycle === 2 ? 18 : 14,
      carbs: 58,
      fat: 6.2,
      fiber: 8.5,
      safeForDiabetic: true,
      glycemicIndex: 52,
      whyRecommended: "High satiety index keeps you full for 4+ hours, curbing mid-morning hunger pangs.",
      recipeSummary: "Traditional Kerala steamed cylindrical rice/ragi cake served with aromatic Bengal gram curry.",
      alternatives: [
        { name: "Appam with Light Vegetable Stew", calories: 290, protein: 8, sugar: 3.1, description: "Fermented rice pancake with mild coconut milk vegetable broth." },
        { name: "Boiled Eggs (2) + Whole Wheat Toast + Papaya Bowl", calories: 310, protein: 18, sugar: 6.0, description: "Lean protein breakfast paired with digestive papain enzymes." }
      ]
    };
  }

  // 2. LUNCH
  let lunch: RecommendedMeal;
  if (isDiabetic) {
    lunch = {
      id: `rec_lunch_diabetic_${cycle}`,
      mealType: "Lunch",
      name: cycle === 1 
        ? "Quinoa & Moong Dal Khichdi with Spinach & Cucumber Raita" 
        : cycle === 2 
        ? "Millet Pulao with Sprouted Moong Salad & Curd" 
        : "Matta Brown Rice (1 cup) with Grilled Kerala Fish Curry & Cabbage Thoran",
      idealTime: "12:45 PM - 01:45 PM",
      imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.35),
      sugar: 2.4,
      protein: 30,
      carbs: 62,
      fat: 11.0,
      fiber: 9.8,
      safeForDiabetic: true,
      glycemicIndex: 48,
      whyRecommended: "Unpolished grain prevents post-prandial glucose spike; high omega-3 fatty acids reduce vascular inflammation.",
      recipeSummary: "Portion-controlled unpolished red rice or ancient grains paired with tangier Kudampuli fish curry, yellow lentil moru, and stir-fried greens.",
      alternatives: [
        { name: isVeg ? "Quinoa Bowl with Paneer & Spinach Dal" : "Grilled Chicken Breast with Steamed French Beans & Brown Rice", calories: 480, protein: 32, sugar: 2.0, description: "Low starch, protein forward balanced lunch." },
        { name: "Millet Pulao with Sprouted Moong Salad", calories: 440, protein: 18, sugar: 1.8, description: "Ancient grain lunch with high zinc and magnesium." }
      ]
    };
  } else if (isMuscleGain) {
    lunch = {
      id: `rec_lunch_muscle_${cycle}`,
      mealType: "Lunch",
      name: cycle === 1 
        ? "Malabar Fish Biryani with Boiled Egg & Mint Raita" 
        : cycle === 2 
        ? "Rajma (Red Kidney Beans) with Brown Rice & Sprout Bowl" 
        : (isVeg ? "Tofu/Paneer Tikka with 4 Rotis, Tadka Dal & Greek Yogurt" : "Kerala Roast Chicken with Steamed Matta Rice, Parippu & Cucumber Pachadi"),
      idealTime: "01:00 PM - 02:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.38),
      sugar: 4.2,
      protein: 42,
      carbs: 85,
      fat: 16.5,
      fiber: 8.0,
      safeForDiabetic: true,
      glycemicIndex: 58,
      whyRecommended: "42g protein loading combined with clean carbohydrates to replenish liver and muscle glycogen stores.",
      recipeSummary: "Lean biological protein paired with clean grains, lentil curry, and probiotic curd salad.",
      alternatives: [
        { name: "Malabar Fish Biryani with Boiled Egg & Raita", calories: 650, protein: 38, sugar: 5.0, description: "High-density balanced meal with quality coastal seafood." },
        { name: "Rajma (Red Kidney Beans) Chawal with Sprout Bowl", calories: 580, protein: 26, sugar: 3.8, description: "Complete vegetarian amino acid profile." }
      ]
    };
  } else {
    // Weight Loss
    lunch = {
      id: `rec_lunch_weightloss_${cycle}`,
      mealType: "Lunch",
      name: cycle === 1 
        ? "Grilled Fish Fillet with Steamed Broccoli & Long Beans Thoran" 
        : cycle === 2 
        ? "Whole Wheat Phulka (3) with Yellow Moong Dal & Bhindi Masala" 
        : "Kerala Traditional Veg/Fish Meal (Half-Matta Rice, Moru Curry, Beans Thoran & Salad)",
      idealTime: "01:00 PM - 02:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.32),
      sugar: 2.1,
      protein: 24,
      carbs: 56,
      fat: 8.5,
      fiber: 10.2,
      safeForDiabetic: true,
      glycemicIndex: 49,
      whyRecommended: "Volume eating with dense dietary fiber keeps daily caloric deficit intact effortlessly.",
      recipeSummary: "Clean portion of wholesome grain or fish paired with spiced buttermilk moru and fiber-rich vegetable thoran.",
      alternatives: [
        { name: "Grilled Fish with Stir-Fried Broccoli & Carrots", calories: 390, protein: 32, sugar: 2.0, description: "Ultra-lean high protein low carb plate." },
        { name: "Whole Wheat Phulka (3) with Yellow Dal & Bhindi Masala", calories: 420, protein: 16, sugar: 2.5, description: "Low oil traditional homestyle vegetarian meal." }
      ]
    };
  }

  // 3. EVENING SNACK
  let snack: RecommendedMeal;
  if (isDiabetic) {
    snack = {
      id: `rec_snack_diabetic_${cycle}`,
      mealType: "Snack",
      name: cycle === 1 
        ? "Handful of Raw Walnuts & Almonds (25g) + Ginger Black Tea" 
        : cycle === 2 
        ? "Steamed Kadala (Bengal Gram) Sundal with Mustard Tempering" 
        : "Roasted Spiced Makhana (Foxnuts) + Sugar-Free Kattan Chaya",
      idealTime: "04:30 PM - 05:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.12),
      sugar: 0.4,
      protein: 6.5,
      carbs: 22,
      fat: 2.5,
      fiber: 4.8,
      safeForDiabetic: true,
      glycemicIndex: 35,
      whyRecommended: "Extremely low glycemic load with high polyphenol antioxidants from freshly brewed black tea.",
      recipeSummary: "Low GI crunchy snack paired with un-sweetened cardamom black tea.",
      alternatives: [
        { name: "Handful of Raw Walnuts & Almonds (25g)", calories: 160, protein: 5, sugar: 1.0, description: "Omega-3 rich healthy fats for brain and heart health." },
        { name: "Steamed Kadala (Bengal Gram) Sundal with Mustard Tempering", calories: 180, protein: 9, sugar: 1.2, description: "Savory boiled legume snack rich in zinc and folate." }
      ]
    };
  } else if (isMuscleGain) {
    snack = {
      id: `rec_snack_muscle_${cycle}`,
      mealType: "Snack",
      name: cycle === 1 
        ? "Boiled Eggs (3 whites + 1 whole) with Pepper + Filter Coffee" 
        : cycle === 2 
        ? "Peanut Butter Toast on Multi-Seed Bread with Almond Milk" 
        : "Greek Yogurt Bowl with Honey, Walnuts & Banana Slices",
      idealTime: "04:30 PM - 05:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.16),
      sugar: 12.0,
      protein: 20,
      carbs: 38,
      fat: 7.0,
      fiber: 3.5,
      safeForDiabetic: false,
      glycemicIndex: 50,
      whyRecommended: "Slow-digesting casein protein combined with natural carbs creates optimal pre/post workout energy.",
      recipeSummary: "Protein-rich evening fuel delivering bioavailable amino acids before evening training.",
      alternatives: [
        { name: "Boiled Eggs (3 whites + 1 whole) + Masala Chai", calories: 230, protein: 18, sugar: 4.0, description: "Clean real-food protein boost." },
        { name: "Peanut Butter Sandwich on Multi-Seed Bread", calories: 280, protein: 12, sugar: 3.5, description: "Plant-based energy punch with monounsaturated fats." }
      ]
    };
  } else {
    // Weight Loss
    snack = {
      id: `rec_snack_weightloss_${cycle}`,
      mealType: "Snack",
      name: cycle === 1 
        ? "Kerala Kattan Coffee (Black Coffee) + Roasted Moong Dal" 
        : cycle === 2 
        ? "Crispy Cucumber & Carrot Sticks with Fresh Lime & Pepper" 
        : "Fresh Green Tea with Steamed Corn & Pomegranate Chaat",
      idealTime: "04:30 PM - 05:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1558818498-28c1e002b655?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.12),
      sugar: 5.5,
      protein: 4.5,
      carbs: 26,
      fat: 1.2,
      fiber: 5.0,
      safeForDiabetic: true,
      glycemicIndex: 45,
      whyRecommended: "EGCG catechins in green tea elevate resting metabolic rate; crunchy produce satisfies sensory snacking urge.",
      recipeSummary: "Hydrating, low-calorie evening snack that keeps digestive enzymes active without calorie spike.",
      alternatives: [
        { name: "Kerala Kattan Coffee (Black Coffee) + Roasted Moong Dal", calories: 140, protein: 6, sugar: 0.5, description: "Zero-sugar appetite suppressant." },
        { name: "Crispy Cucumber & Carrot Sticks with Hummus Dip", calories: 150, protein: 5, sugar: 2.0, description: "Hydrating low calorie crunch." }
      ]
    };
  }

  // 4. DINNER / NIGHT MEAL
  let dinner: RecommendedMeal;
  if (isDiabetic) {
    dinner = {
      id: `rec_dinner_diabetic_${cycle}`,
      mealType: "Dinner",
      name: cycle === 1 
        ? "Steamed Wheat Dosa (2) with Vegetable Sambar & Tomato Chutney" 
        : cycle === 2 
        ? "Clear Vegetable Garlic Soup with Grilled Tofu / Paneer Cubes" 
        : "2 Multigrain Rotis with Palak Dal & Grilled Mushroom Stir-fry",
      idealTime: "07:30 PM - 08:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.28),
      sugar: 1.5,
      protein: 18,
      carbs: 52,
      fat: 7.0,
      fiber: 9.5,
      safeForDiabetic: true,
      glycemicIndex: 40,
      whyRecommended: "Night carbohydrates are kept slow-releasing to avoid dawn phenomenon (morning fasting hyperglycemia).",
      recipeSummary: "Light, low-glycemic evening dinner served with gut-friendly warm vegetables and lentils.",
      alternatives: [
        { name: "Steamed Wheat Dosa (2) with Sambar", calories: 340, protein: 11, sugar: 2.2, description: "Light fermented dinner easy on nighttime digestion." },
        { name: "Clear Vegetable Soup with Tofu / Paneer Cubes", calories: 260, protein: 16, sugar: 1.8, description: "Ultra-low carb dinner for effortless overnight blood glucose regulation." }
      ]
    };
  } else if (isMuscleGain) {
    dinner = {
      id: `rec_dinner_muscle_${cycle}`,
      mealType: "Dinner",
      name: cycle === 1 
        ? "Kerala Pepper Chicken Roast with 2 Whole Wheat Chapatis & Dal" 
        : cycle === 2 
        ? "Chana Masala with 3 Multigrain Phulkas & Cucumber Raita" 
        : (isVeg ? "Paneer Butter Masala (Light) with 3 Rotis & Sprouted Salad" : "Grilled Fish / Chicken Breast with Mashed Sweet Potato & Steamed Peas"),
      idealTime: "08:00 PM - 09:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.32),
      sugar: 3.5,
      protein: 38,
      carbs: 64,
      fat: 12.0,
      fiber: 7.5,
      safeForDiabetic: true,
      glycemicIndex: 54,
      whyRecommended: "Provides overnight amino acid pool to facilitate tissue repair and anabolic hormone release during deep sleep.",
      recipeSummary: "High-protein recovery dinner prepared with light spices to encourage restful restorative sleep.",
      alternatives: [
        { name: "Kerala Chicken Curry with 2 Kerala Parotta / Appam", calories: 590, protein: 32, sugar: 4.0, description: "Authentic coastal comfort meal with high protein." },
        { name: "Chana Masala with 3 Multigrain Phulkas & Raita", calories: 510, protein: 22, sugar: 3.0, description: "Wholesome legume protein dinner." }
      ]
    };
  } else {
    // Weight Loss
    dinner = {
      id: `rec_dinner_weightloss_${cycle}`,
      mealType: "Dinner",
      name: cycle === 1 
        ? "Mixed Vegetable Dalia (Broken Wheat Khichdi) with Lemon" 
        : cycle === 2 
        ? "Warm Tomato Basil Soup with Grilled Paneer / Chicken Skewer" 
        : "Light Vegetable Stew with 2 Steamed Appams",
      idealTime: "07:30 PM - 08:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      calories: Math.round(total * 0.26),
      sugar: 2.2,
      protein: 10,
      carbs: 48,
      fat: 6.0,
      fiber: 7.0,
      safeForDiabetic: true,
      glycemicIndex: 46,
      whyRecommended: "Light and easily assimilable meal finished at least 2.5 hours prior to bed prevents acid reflux and fat storage.",
      recipeSummary: "Digestive evening bowl rich in soluble fiber and mild soothing herbs.",
      alternatives: [
        { name: "Mixed Vegetable Dalia (Broken Wheat Khichdi)", calories: 320, protein: 12, sugar: 1.5, description: "Warm, soothing high-fiber digestive comfort dinner." },
        { name: "Warm Tomato Basil Soup with Grilled Chicken / Paneer Skewers", calories: 340, protein: 24, sugar: 2.8, description: "High protein, minimal starch evening option." }
      ]
    };
  }

  return [breakfast, lunch, snack, dinner];
}

// ----------------------------------------------------------------------------
// EXERCISE & ROUTINE RECOMMENDATION BUILDER
// ----------------------------------------------------------------------------
export function generatePersonalizedWorkouts(
  profile: UserHealthProfile,
  consumedCalories: number,
  burnedCalories: number
): ExerciseRoutineItem[] {
  const isWeightLoss = profile.goal === "weight_loss";
  const isMuscleGain = profile.goal === "muscle_gain";
  const isDiabetic = profile.goal === "diabetic_care";

  const target = profile.dailyCalorieTarget || 2000;
  const netCalories = consumedCalories - burnedCalories;
  const isCalorieSurplus = netCalories > target;

  const routines: ExerciseRoutineItem[] = [
    {
      id: "ex_walk_postmeal",
      title: "Post-Meal Glucose Blunting Walk",
      durationMinutes: 20,
      estimatedCaloriesBurned: 95,
      intensity: "Low",
      targetTime: "Post-Meal",
      category: "Recovery Walk",
      iconName: "walk",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80",
      muscleTargets: ["Calves", "Glutes", "Core Stabilizers"],
      benefitText: isDiabetic
        ? "Activates GLUT-4 glucose transporters in leg muscles without requiring insulin, dropping post-meal sugar spikes by up to 34%."
        : "Stimulates gastric motility, curbs acid reflux, and prevents post-lunch drowsiness.",
      instructions: [
        "Begin walking 15–20 minutes after completing your lunch or dinner.",
        "Maintain a steady, relaxed pace (around 4 km/h) without breaking into heavy sweat.",
        "Keep spine upright to allow effortless diaphragmatic breathing.",
        "Walk for at least 2,500 steps (approx 20 min) to activate fat oxidation.",
        "Hydrate with 1 glass of water before and after walking."
      ]
    },
    {
      id: "ex_brisk_morning",
      title: "Brisk Cardio Walk / Light Jog",
      durationMinutes: 35,
      estimatedCaloriesBurned: 180,
      intensity: "Moderate",
      targetTime: "Morning",
      category: "Cardio",
      iconName: "flame",
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
      muscleTargets: ["Quadriceps", "Hamstrings", "Calves", "Heart"],
      benefitText: isWeightLoss
        ? "Burns primary fat stores when performed in the morning; burns approx 180 kcal toward your daily deficit."
        : "Enhances cardiovascular aerobic capacity and lowers resting heart rate.",
      instructions: [
        "Warm up with 3 minutes of gentle ankle rolls and hamstring stretches.",
        "Start with 5 minutes of normal-pace walking to gradually elevate heart rate.",
        "Increase to brisk cadence of 110–120 steps per minute where conversation requires slight effort.",
        "Maintain brisk pace for 25 minutes continuously.",
        "Cool down with 2 minutes of relaxed walking and hydration.",
        "Track distance: target 3–4 km per session for optimal fat burning."
      ]
    },
    {
      id: "ex_strength_circuit",
      title: isMuscleGain ? "Hypertrophy Push-Pull Resistance Circuit" : "Bodyweight Functional Strength Circuit",
      durationMinutes: 25,
      estimatedCaloriesBurned: 195,
      intensity: "Moderate",
      targetTime: "Evening",
      category: "Strength",
      iconName: "dumbbell",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
      muscleTargets: ["Chest", "Shoulders", "Quadriceps", "Core", "Triceps"],
      benefitText: isMuscleGain
        ? "Maximizes mechanical tension to stimulate myofibrillar hypertrophy and increase metabolic rate."
        : "Preserves lean muscle mass so weight lost is pure body fat rather than metabolically active tissue.",
      instructions: [
        "Warm up: 2 min jumping jacks + 1 min arm circles.",
        "Set 1: 12 bodyweight squats (or goblet squats with water bottle).",
        "Set 2: 10 push-ups (modify to knee push-ups if needed).",
        "Set 3: 15 reverse lunges (alternating legs).",
        "Set 4: 30-second plank hold (forearm position).",
        "Set 5: 12 Superman back extensions (lying face down).",
        "Rest 45 seconds between sets. Repeat full circuit 3 times.",
        "Cool down: 3 min gentle stretching and deep breaths."
      ]
    },
    {
      id: "ex_hiit_fatburn",
      title: "Express Calorie Burner (HIIT)",
      durationMinutes: 18,
      estimatedCaloriesBurned: 215,
      intensity: "High",
      targetTime: "Evening",
      category: "Cardio",
      iconName: "flame",
      imageUrl: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=600&q=80",
      muscleTargets: ["Full Body", "Heart", "Core", "Legs"],
      benefitText: isCalorieSurplus
        ? "Surplus Alert: Burns 215 kcal rapidly and triggers the EPOC (afterburn effect) for the next 12 hours."
        : "High metabolic efficiency: burns twice the calories of steady-state jogging in half the time.",
      instructions: [
        "Warm up: 2 min light jogging in place.",
        "Round 1: 40s Jumping Jacks → 20s Rest.",
        "Round 2: 40s Mountain Climbers → 20s Rest.",
        "Round 3: 40s High Knees → 20s Rest.",
        "Round 4: 40s Burpees (modify: step-back burpee) → 20s Rest.",
        "Round 5: 40s Speed Squats → 20s Rest.",
        "Round 6: 40s Plank to Push-Up → 20s Rest.",
        "Repeat all 6 rounds 3 times. 1 min water break between full rounds.",
        "Cool down: 2 min slow walking + deep breaths."
      ]
    },
    {
      id: "ex_yoga_stretching",
      title: "Restorative Yoga & Deep Breathing (Pranayama)",
      durationMinutes: 15,
      estimatedCaloriesBurned: 55,
      intensity: "Low",
      targetTime: "Evening",
      category: "Flexibility / Yoga",
      iconName: "heart",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
      muscleTargets: ["Spine", "Hips", "Shoulders", "Nervous System"],
      benefitText: "Suppresses cortisol (stress hormone) that drives abdominal visceral fat storage and nighttime emotional eating.",
      instructions: [
        "Find a quiet space and lay a mat or towel.",
        "Cat-Cow pose: 2 minutes — alternate arching and rounding the spine on hands and knees.",
        "Child's pose (Balasana): Hold for 3 minutes to calm the nervous system.",
        "Seated forward fold (Paschimottanasana): Hold for 2 minutes.",
        "Supine twist: 1 minute each side, letting gravity pull the knees.",
        "Anulom-Vilom (Alternate Nostril Breathing): 5 minutes — inhale left, exhale right, inhale right, exhale left.",
        "Savasana (Corpse pose): 2 minutes of complete stillness and deep breathing."
      ]
    }
  ];

  return routines;
}
