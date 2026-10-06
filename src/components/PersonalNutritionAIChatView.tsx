"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Flame,
  Candy,
  Droplets,
  Refrigerator,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  User,
  Heart,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import {
  COMPREHENSIVE_FOOD_DATABASE,
  INDIAN_NUTRITION_DATASET,
  USDA_GLOBAL_DATASET,
  PACKAGED_PRODUCTS_DATASET,
  NutritionalItem,
  PackagedProduct,
  searchNutritionalDatasets,
  lookupPackagedProduct
} from "@/lib/data-science/datasets";
import { UserHealthProfile } from "./TruthInScannerView";

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
  status: "consumed" | "planned";
}

interface PersonalNutritionAIChatViewProps {
  userProfile: UserHealthProfile;
  meals: MealLogItem[];
  waterGlasses: number;
  availableFridgeItems?: string[];
  onLogMeal?: (meal: any) => void;
  onNavigateTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  foodCards?: NutritionalItem[];
  productCards?: PackagedProduct[];
  suggestedAction?: {
    label: string;
    tab: string;
  };
}

export default function PersonalNutritionAIChatView({
  userProfile,
  meals,
  waterGlasses,
  availableFridgeItems = ["Eggs", "Onion", "Tomato", "Coconut Oil", "Curd", "Dal", "Curry Leaves"],
  onLogMeal,
  onNavigateTab
}: PersonalNutritionAIChatViewProps) {
  // Compute consumed numbers
  const consumedCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const remainingCalories = Math.max(0, userProfile.dailyCalorieTarget - consumedCalories);
  const consumedSugar = +meals.reduce((sum, m) => sum + (m.sugar || 0), 0).toFixed(1);
  const remainingSugar = Math.max(0, +(userProfile.dailySugarLimitGrams - consumedSugar).toFixed(1));
  const consumedProtein = +meals.reduce((sum, m) => sum + (m.protein || 0), 0).toFixed(1);

  // Initial welcome message tailored to this specific user's metrics
  const initialGreeting = `Hello ${userProfile.name || "there"}! 👋 I am your **Personal AIFood Nutritionist & Health Assistant**. 

I have full real-time access to your personal health metrics:
• **Daily Target:** ${userProfile.dailyCalorieTarget} kcal (${remainingCalories} kcal left today)
• **Sugar Limit:** ${userProfile.dailySugarLimitGrams}g (${remainingSugar}g budget remaining)
• **Goal:** ${userProfile.goal.replace("_", " ").toUpperCase()} (${userProfile.weightKg} kg, BMI: ${(userProfile.weightKg / Math.pow(userProfile.heightCm / 100, 2)).toFixed(1)})
• **Today Eaten:** ${meals.length} meals logged (${consumedCalories} kcal, ${consumedProtein}g protein)
• **Hydration:** ${waterGlasses} / 8 glasses of water

Ask me anything in English, Malayalam, or Manglish! You can ask about what to eat, analyze Kerala dishes, check food safety, or ask what to cook from your fridge.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      role: "assistant",
      text: initialGreeting,
      time: "Just now"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // AI Knowledge & Context Reasoning Engine
  const generateAIResponse = (userPrompt: string): {
    text: string;
    foodCards?: NutritionalItem[];
    productCards?: PackagedProduct[];
    suggestedAction?: { label: string; tab: string };
  } => {
    const q = userPrompt.toLowerCase().trim();

    // 1. Remaining Calorie / Dinner recommendation
    if (q.includes("remaining") || q.includes("dinner") || q.includes("baki") || q.includes("what should i eat") || q.includes("kazhikkam")) {
      const suitableDishes = COMPREHENSIVE_FOOD_DATABASE.filter(
        (f) => f.calories <= remainingCalories && (!userProfile.goal.includes("diabetic") || f.safeForDiabetic)
      ).slice(0, 3);

      return {
        text: `Based on your remaining budget of **${remainingCalories} kcal** and your goal of **${userProfile.goal.replace("_", " ")}**, here are the best meals you can safely eat today without exceeding your targets:

${suitableDishes.map(d => `• **${d.name}** (${d.calories} kcal, ${d.protein}g protein, Sugar: ${d.sugar}g) - *${d.dietRecommendation}*`).join("\n\n")}

💡 **Clinical Tip:** ${remainingCalories < 300 ? "You have limited calorie budget left; choose high-fiber steamed items or light vegetable soup." : "You have plenty of budget left; include a high-protein item to support muscle maintenance."}`,
        foodCards: suitableDishes,
        suggestedAction: { label: "Log to Food Diary", tab: "dashboard" }
      };
    }

    // 2. Fridge items query / What can I cook?
    if (q.includes("fridge") || q.includes("cook") || q.includes("undakkan") || q.includes("ingredients") || q.includes("sadhanangal")) {
      return {
        text: `I inspected your **Smart Fridge Inventory**! You currently have: **${availableFridgeItems.join(", ")}**.

Here are 2 nutritious dishes you can make right now without buying anything extra:

1. **Kerala Nadan Egg Masala Scramble / Roast**
   • **Ingredients:** Eggs + Onion + Tomato + Green Chili + Coconut Oil + Curry Leaves
   • **Nutrition:** ~210 kcal, 14g Protein, 2.1g Carbs, Glycemic Index: 15 (Super low glycemic!)
   • **Why it fits you:** Zero sugar spike, high satiety, and perfectly aligns with your ${userProfile.goal.replace("_", " ")} goal.

2. **Spiced Dal Tadka with Tempered Curry Leaves**
   • **Ingredients:** Dal / Lentils + Tomato + Onion + Coconut Oil
   • **Nutrition:** ~185 kcal, 9.5g Protein, 6.2g Fiber

Would you like step-by-step voice guidance for cooking?`,
        suggestedAction: { label: "Open Smart Fridge", tab: "smart_fridge" }
      };
    }

    // 3. Diabetic queries (Kappa, Porotta, Sugar)
    if (q.includes("diabet") || q.includes("sugar") || q.includes("kappa") || q.includes("porotta") || q.includes("glucose")) {
      const kappa = COMPREHENSIVE_FOOD_DATABASE.find(f => f.name.toLowerCase().includes("kappa"));
      const porotta = COMPREHENSIVE_FOOD_DATABASE.find(f => f.name.toLowerCase().includes("porotta"));

      return {
        text: `🩸 **Diabetic & Glycemic Health Assessment:**

• **Kerala Porotta with Beef Roast:** ⚠️ **High Hazard**. 1 porotta + curry contains ~790 kcal, 82g refined carbs, and rapid GI spike (78). The refined bleached maida causes rapid blood glucose spikes followed by reactive insulin crashes.
• **Kappa & Meen Curry:** ⚠️ **Caution**. Tapioca (Kappa) has 88g starchy carbohydrates and a Glycemic Index of 70. While the spicy Kudampuli fish curry provides lean protein, diabetic individuals should restrict kappa portion to 1/2 cup or swap with vegetable thoran.
• **Safe Traditional Alternatives:** Kerala Puttu with Kadala Curry (Glycemic Index 58), Karimeen Pollichathu (GI 15), or Steamed Idli with Sambar (GI 55).

Your personal daily sugar ceiling is **${userProfile.dailySugarLimitGrams}g**; you have consumed **${consumedSugar}g** so far today.`,
        foodCards: [kappa, porotta].filter(Boolean) as NutritionalItem[]
      };
    }

    // 4. Kerala traditional foods inquiry (Puttu, Karimeen, Sadya, Biryani)
    if (q.includes("puttu") || q.includes("karimeen") || q.includes("sadya") || q.includes("biryani") || q.includes("kerala")) {
      const matches = searchNutritionalDatasets(q);
      const topMatches = matches.length > 0 ? matches.slice(0, 2) : COMPREHENSIVE_FOOD_DATABASE.slice(0, 2);

      return {
        text: `🌴 **Kerala Food Nutrition Breakdown from ICMR Database:**

${topMatches.map(m => `• **${m.name}**
  - **Calories:** ${m.calories} kcal
  - **Protein:** ${m.protein}g | **Carbs:** ${m.carbs}g | **Fat:** ${m.fat}g | **Sugar:** ${m.sugar}g
  - **Glycemic Index:** ${m.glycemicIndex} (0-100)
  - **Diabetic Safe:** ${m.safeForDiabetic ? "✅ Yes" : "⚠️ Moderate/Caution"}
  - **Clinical Recommendation:** ${m.dietRecommendation}
  - **Healthy Alternative:** ${m.healthyAlternative || "Enjoy as prepared!"}`).join("\n\n")}

Our database contains **1,000+ certified food items** (including 100+ authentic Kerala traditional recipes, regional Indian dishes, fresh produce, and global foods) fully pre-trained and verified!`,
        foodCards: topMatches
      };
    }

    // 5. Packaged food or additive query (Maggi, Bournvita, E635, palm oil, additives)
    if (q.includes("maggi") || q.includes("bournvita") || q.includes("additive") || q.includes("e635") || q.includes("palm oil") || q.includes("ketchup") || q.includes("snack")) {
      const prod = lookupPackagedProduct(q) || PACKAGED_PRODUCTS_DATASET[0];

      return {
        text: `🏷️ **Packaged Food & Chemical Additive Intelligence:**

Analyzing: **${prod.productName}** (${prod.brand})
• **Clean Health Score:** ${prod.nutriscoreGrade} Grade (Nova Group ${prod.novaGroup} Ultra-Processed)
• **Calories:** ${prod.caloriesPer100g} kcal/100g | **Sugar:** ${prod.sugarPer100g}g/100g | **Salt:** ${prod.saltPer100g}g/100g
• **Additives Found:** ${prod.additives.join(", ") || "None"}
• **Harmful Chemicals Flagged:**
${prod.harmfulAdditivesDetected.map(h => `  ⚠️ ${h}`).join("\n")}
• **Health Warnings:**
${prod.healthWarnings.map(w => `  • ${w}`).join("\n")}

💡 **Clean Swap Recommendation:** Slurrp Farm Foxtail Millet Noodles or Pure Rolled Oats (Zero palm oil, zero chemical E-numbers).`,
        productCards: [prod],
        suggestedAction: { label: "Scan Barcode with Camera", tab: "truthin_scanner" }
      };
    }

    // 6. Water & Hydration
    if (q.includes("water") || q.includes("vellam") || q.includes("hydration") || q.includes("drink")) {
      const remainingGlasses = Math.max(0, 8 - waterGlasses);
      return {
        text: `💧 **Daily Hydration Report for ${userProfile.name}:**

You have recorded **${waterGlasses} / 8 glasses** of water today (~${waterGlasses * 250} ml).
${remainingGlasses > 0 ? `You still need **${remainingGlasses} more glasses** to hit your daily 2-Liter optimal metabolic threshold!` : "🎉 Excellent job! You have achieved your 8-glass hydration target for today."}

Drinking clean water 30 minutes before meals improves calorie burn by 24% and prevents deceptive thirst-induced overeating.`,
        suggestedAction: { label: "Log Water Glass (+1)", tab: "dashboard" }
      };
    }

    // 7. Malayalam / Manglish general response
    if (q.includes("nammale") || q.includes("sughamano") || q.includes("entha") || q.includes("malayalam") || q.includes("visakkunnu") || q.includes("kazhikkanam")) {
      return {
        text: `ഹലോ ${userProfile.name}! സുഖമായി ഇരിക്കുന്നു 😊

നിങ്ങളുടെ വ്യക്തിഗത ആരോഗ്യ വിവരങ്ങൾ വെച്ച് ഞാൻ പരിശോധിച്ചപ്പോൾ:
• ഇന്നത്തെ കലോറി ടാർഗെറ്റ്: **${userProfile.dailyCalorieTarget} kcal**
• ബാക്കിയുള്ള കലോറി: **${remainingCalories} kcal**
• ഇന്നത്തെ പഞ്ചസാര പരിധി: **${userProfile.dailySugarLimitGrams}g** (കഴിച്ചത്: ${consumedSugar}g)
• ഫ്രിഡ്ജിൽ ലഭ്യമായ സാധനങ്ങൾ: ${availableFridgeItems.slice(0, 5).join(", ")}

എന്ത് ഭക്ഷണത്തെക്കുറിച്ചും (പുട്ട്, കടല, ബിരിയാണി, മീൻകറി, പാക്കേജ്ഡ് ഫുഡ്സ്, E-നമ്പറുകൾ) എന്നോട് ചോദിക്കാം. ഞാൻ കൃത്യമായ ന്യൂട്രീഷൻ വിവരങ്ങൾ പറഞ്ഞുതരാം!`,
        suggestedAction: { label: "Explore Datasets", tab: "datasets" }
      };
    }

    // Default intelligent diet response
    const matched = searchNutritionalDatasets(q);
    if (matched.length > 0) {
      const item = matched[0];
      return {
        text: `I found **${item.name}** in our clinical dataset!

• **Serving Size:** ${item.servingSize}
• **Calories:** ${item.calories} kcal
• **Macronutrients:** Protein ${item.protein}g | Carbs ${item.carbs}g | Fat ${item.fat}g | Sugar ${item.sugar}g
• **Glycemic Index:** ${item.glycemicIndex}
• **Diabetic Suitability:** ${item.safeForDiabetic ? "Safe" : "Monitor Portion Size"}
• **Recommendation:** ${item.dietRecommendation}
${item.healthyAlternative ? `• **Healthy Alternative:** ${item.healthyAlternative}` : ""}

Would you like to log this dish into today's diary?`,
        foodCards: [item]
      };
    }

    return {
      text: `Thank you for your question, **${userProfile.name}**! 

Based on your profile (${userProfile.weightKg} kg, ${userProfile.gender}, goal: ${userProfile.goal.replace("_", " ")}):
• You have **${remainingCalories} kcal** remaining out of your **${userProfile.dailyCalorieTarget} kcal** budget today.
• Your safe sugar ceiling is **${userProfile.dailySugarLimitGrams}g** (Consumed: ${consumedSugar}g).
• Our dataset contains complete nutritional profiles for traditional Kerala foods (Puttu, Karimeen, Sadya, Biryani, Mathi, Kappa) as well as packaged groceries and global foods.

Try asking:
1. *"What should I eat for dinner with my remaining calories?"*
2. *"Can I eat Kerala Porotta and Beef Roast on a diet?"*
3. *"What can I cook right now using my fridge ingredients?"*
4. *"Explain the health hazard of E635 additive in noodles."*`
    };
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate intelligent response delay
    setTimeout(() => {
      const aiReply = generateAIResponse(userText);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        text: aiReply.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        foodCards: aiReply.foodCards,
        productCards: aiReply.productCards,
        suggestedAction: aiReply.suggestedAction
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        text: prompt,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const aiReply = generateAIResponse(prompt);
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: "assistant",
          text: aiReply.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          foodCards: aiReply.foodCards,
          productCards: aiReply.productCards,
          suggestedAction: aiReply.suggestedAction
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 450);
    }, 50);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Top Banner Card: Personal Nutrition Engine */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              Personal Clinical AI Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800">
              Personalized to {userProfile.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Personal AI Nutritionist & Health Assistant
          </h1>
          <p className="text-sm text-emerald-50 max-w-2xl leading-relaxed">
            Connected live to your body metrics, consumed calorie diary, fridge inventory, and our pre-trained Kerala & global food datasets.
          </p>
        </div>

        {/* Live Personal Budget Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
          <div className="px-2">
            <div className="text-lg font-black text-white">{remainingCalories}</div>
            <div className="text-[10px] text-emerald-100 font-semibold uppercase">kcal left</div>
          </div>
          <div className="px-2 border-l border-white/20">
            <div className="text-lg font-black text-amber-200">{remainingSugar}g</div>
            <div className="text-[10px] text-emerald-100 font-semibold uppercase">Sugar Left</div>
          </div>
          <div className="px-2 border-l border-white/20 col-span-2 sm:col-span-1">
            <div className="text-lg font-black text-cyan-200">{waterGlasses}/8</div>
            <div className="text-[10px] text-emerald-100 font-semibold uppercase">Water</div>
          </div>
        </div>
      </div>

      {/* Quick Interactive Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          "🍛 What can I eat with my remaining calories?",
          "🥗 Suggest healthy recipes from my fridge",
          "⚠️ Can a diabetic eat Kappa & Fish Curry?",
          "🍗 Is Kerala Porotta safe for weight loss?",
          "🏷️ Tell me about harmful food additive E635",
          "💧 How much water should I drink today?",
          "മലയാളത്തിൽ എൻ്റെ ഡയറ്റ് പറഞ്ഞുതരുമോ?"
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-semibold whitespace-nowrap shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[620px]">
        {/* Chat History Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">AIFood Clinical Bot</h2>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Context: {userProfile.name} • {userProfile.goal.replace("_", " ")}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: "msg_reset",
                  role: "assistant",
                  text: initialGreeting,
                  time: "Just now"
                }
              ])
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#f8fafc]">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2.5`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-xs ${
                      isUser
                        ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                        : "bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Attached Food Cards (if AI suggested dishes) */}
                  {msg.foodCards && msg.foodCards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {msg.foodCards.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3 hover:border-emerald-300 transition-colors"
                        >
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {food.name}
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              {food.calories} kcal • {food.protein}g Protein
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  food.safeForDiabetic
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {food.safeForDiabetic ? "Diabetic Safe" : "Sugar Caution"}
                              </span>
                              {onLogMeal && (
                                <button
                                  onClick={() => onLogMeal(food)}
                                  className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                                >
                                  + Log
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Attached Product Cards */}
                  {msg.productCards && msg.productCards.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {msg.productCards.map((prod) => (
                        <div
                          key={prod.barcode}
                          className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3"
                        >
                          <img
                            src={prod.imageUrl}
                            alt={prod.productName}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase font-bold text-slate-400">
                              {prod.brand}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {prod.productName}
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              {prod.caloriesPer100g} kcal • {prod.sugarPer100g}g sugar
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Button */}
                  {msg.suggestedAction && onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab(msg.suggestedAction!.tab)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div
                    className={`text-[9px] text-slate-400 px-1 ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>AI Nutritionist analyzing your health data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={handleSendMessage}
          className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask about your diet, remaining calories, fridge recipes, or Kerala foods...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
