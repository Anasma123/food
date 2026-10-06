"use client";

import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Camera,
  ScanBarcode,
  Refrigerator,
  Dumbbell,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Lock,
  Layers,
  ChefHat,
  Eye,
  Info,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Clock,
  Check,
  FileText
} from "lucide-react";
import { AppLanguage, LANGUAGE_OPTIONS } from "@/lib/translations";

interface AppWorkflowGuideProps {
  onNavigateTab: (tab: any) => void;
  isLoggedIn: boolean;
  onOpenRegister: () => void;
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
}

export default function AppWorkflowGuide({
  onNavigateTab,
  isLoggedIn,
  onOpenRegister,
  language = "en",
  onLanguageChange
}: AppWorkflowGuideProps) {
  const [lang, setLang] = useState<AppLanguage>(language);

  React.useEffect(() => {
    if (language) setLang(language);
  }, [language]);

  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  const t = {
    en: {
      badge: "Complete App Architecture & Step-by-Step Workflow",
      heroTitle: "How AIFood Works: A to Z Interactive Guide",
      heroSubtitle: "A comprehensive walk-through for new and returning users. Learn how our clinical AI engine turns plate photos, packaged barcodes, and fridge shelves into precision health intelligence and public safety action.",
      languageSelector: "Select Language:",
      architectureOverview: "End-to-End System Pipeline",
      allStepsTitle: "The 7 Connected Modules (Click any step to inspect):",
      tryFeatureBtn: "Try This Feature Now",
      requiresLoginNote: "Requires registration / login to access personalized metrics.",
      quickStartBadge: "Quick Start Guide",
      faqTitle: "Frequently Asked Questions",
      steps: [
        {
          id: 1,
          tag: "Step 1",
          title: "Personal Health Profile & Calorie Target Setup",
          icon: Activity,
          color: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          bgGradient: "from-emerald-500/10 to-teal-500/5",
          summary: "Establish your clinical baseline before logging foods or planning routines.",
          imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "You enter Age, Gender, Weight (kg), Height (cm), and Goal (Weight Loss, Muscle Gain, Diabetic Care).",
            "The app runs the clinical Mifflin-St Jeor formula to determine Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).",
            "Sets an automated daily calorie target (e.g., 1850 kcal for a 500 kcal deficit) and a strict 20.0g daily sugar limit."
          ],
          example: "Example: 26yo Male, 70kg, 172cm, Light activity -> TDEE 2350 kcal -> Daily Target 1850 kcal (deficit for healthy 0.5kg/week fat loss).",
          userAction: "Open Profile or click Register to fill your metrics once.",
          navTarget: "dashboard"
        },
        {
          id: 2,
          tag: "Step 2",
          title: "AI Meal Scanner (Live Camera & Image Recognition)",
          icon: Camera,
          color: "text-teal-400",
          borderColor: "border-teal-500/30",
          bgGradient: "from-teal-500/10 to-cyan-500/5",
          summary: "Snap photos of cooked dishes, fruits, teas, or mixed plates with live camera.",
          imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "Use Live Camera or upload a picture of whatever you eat (Tea, Coffee, Apple, Kerala Meals, etc.).",
            "Our vision engine is trained on 15,960+ Indian and global food items with precise portion estimation.",
            "Outputs exact calories, sugar, protein, carbs, fat, and a Diabetic Glycemic Index rating."
          ],
          example: "Example: Snapping 'Kattan Chaya' detects ~48 kcal with 10.2g sugar alert; snapping 'Kerala Puttu + Kadala' detects ~360 kcal and 12.5g protein.",
          userAction: "Open AI Meal Scanner, click 'Live Camera' or upload a photo, and let AI analyze.",
          navTarget: "meal_scanner"
        },
        {
          id: 3,
          tag: "Step 3",
          title: "Food Consumption Decision Guard (Did You Actually Eat?)",
          icon: CheckCircle2,
          color: "text-amber-400",
          borderColor: "border-amber-500/30",
          bgGradient: "from-amber-500/10 to-orange-500/5",
          summary: "Prevents accidental calorie counting when you only want to inspect nutritional facts.",
          imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "Whenever you scan a meal or packaged food, an alert popup asks: 'Did you actually consume this item today?'",
            "Option A: 'Yes, I Ate This' -> Officially marks item as Consumed and adds calories & sugar to today's intake.",
            "Option B: 'No, Just Checking' -> Leaves data visible on screen in preview mode without altering calorie totals.",
            "Option C: 'Discard' -> Clears the scan completely."
          ],
          example: "Example: You scan a slice of cake at a bakery to check its sugar (24g). You decide NOT to eat it, so you tap 'Just Checking' — zero false calories logged!",
          userAction: "Simply choose your answer whenever the confirmation prompt appears.",
          navTarget: "dashboard"
        },
        {
          id: 4,
          tag: "Step 4",
          title: "Packaged Food & Toxic E-Number Additives Scanner",
          icon: ScanBarcode,
          color: "text-rose-400",
          borderColor: "border-rose-500/30",
          bgGradient: "from-rose-500/10 to-pink-500/5",
          summary: "Expose hidden chemical preservatives, palm oil, and high fructose corn syrup.",
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "Scan the product barcode or upload a photo of the packet's back ingredient list.",
            "OCR extracts chemical codes (e.g., E621 MSG, E102 Tartrazine, E150d, palm oil, sodium nitrates).",
            "Assigns a clinical Safety Grade (A / B / C / Hazard) and highlights toxicity concerns."
          ],
          example: "Example: Scanning potato chips detects Monosodium Glutamate (E621) and high saturated fat, giving a 'Grade C / Caution' recommendation.",
          userAction: "Open Packaged Food Scanner and enter barcode or upload packet picture.",
          navTarget: "barcode_scanner"
        },
        {
          id: 5,
          tag: "Step 5",
          title: "Smart Fridge & Hands-Free Voice Chef",
          icon: Refrigerator,
          color: "text-cyan-400",
          borderColor: "border-cyan-500/30",
          bgGradient: "from-cyan-500/10 to-blue-500/5",
          summary: "Zero-waste cooking from group photos of fridge shelves and pantry items.",
          imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "Snap a picture of your refrigerator or countertop containing multiple ingredients at once.",
            "AI multi-object detection identifies all ingredients (e.g., eggs, tomato, onion, milk, curd).",
            "Synthesizes healthy recipes matching your calorie deficit and plays step-by-step audio instructions."
          ],
          example: "Example: A group photo with eggs, tomato, and onion suggests 'Kerala Egg Roast' in 15 minutes with voice-guided cooking.",
          userAction: "Open Smart Fridge, snap your ingredients, and click 'Generate Healthy Recipes'.",
          navTarget: "smart_fridge"
        },
        {
          id: 6,
          tag: "Step 6",
          title: "Targeted Exercise & Calorie Burn Offset Engine",
          icon: Dumbbell,
          color: "text-indigo-400",
          borderColor: "border-indigo-500/30",
          bgGradient: "from-indigo-500/10 to-purple-500/5",
          summary: "Exercise photos, muscle targets, and clinical post-meal walking routines.",
          imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "Computes Net Calories = Consumed Calories - Burned Calories in real time.",
            "Recommends targeted routines: Post-Meal Glucose Blunting Walks, Morning Brisk Walks, HIIT, and Yoga.",
            "Each workout includes exercise photography, muscle group badges, and full step-by-step instructions.",
            "Clicking 'Complete Workout' instantly subtracts burned calories from your daily total."
          ],
          example: "Example: After a 520 kcal lunch, completing the 20-min Post-Meal Walk burns 95 kcal and cuts glucose spikes by up to 34%.",
          userAction: "Go to Diet Dashboard -> Exercise tab, choose a routine, and click 'Complete Workout'.",
          navTarget: "dashboard"
        },
        {
          id: 7,
          tag: "Step 7",
          title: "Food Safety Grievance & Authority Escalation Portal",
          icon: ShieldAlert,
          color: "text-red-400",
          borderColor: "border-red-500/30",
          bgGradient: "from-red-500/10 to-rose-500/5",
          summary: "Citizens report adulteration, expired goods, or hygiene violations with evidence.",
          imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "Citizens upload photographic proof of adulterated food, stale items, or restaurant hygiene issues.",
            "System generates a unique Tracking Reference ID (e.g., #FSSAI-KL-2026-904).",
            "Admin reviews the grievance in the Moderation Queue.",
            "Upon approval, an official dispatch notice is prepared for FSSAI & District Food Safety Officers (in demo mode, a full verified email receipt is shown)."
          ],
          example: "Example: Reporting stale shawarma in Ernakulam creates an official incident dossier ready for regulatory action.",
          userAction: "Open Food Safety Portal, enter vendor details and photo proof, and submit.",
          navTarget: "food_safety"
        }
      ]
    },

    ml: {
      badge: "ആപ്പിന്റെ പൂർണ്ണ ഘടനയും ഉപയോഗിക്കേണ്ട വിധവും (A to Z Guide)",
      heroTitle: "AIFood എങ്ങനെ പ്രവർത്തിക്കുന്നു: സമ്പൂർണ്ണ വഴികാട്ടി",
      heroSubtitle: "പുതിയ ഉപയോക്താക്കൾക്കായി ആപ്പിന്റെ 7 പ്രധാന ഭാഗങ്ങളും അവ പരസ്പരം ബന്ധപ്പെട്ടു പ്രവർത്തിക്കുന്ന രീതിയും വിശദീകരിക്കുന്ന പേജ്. ഫോട്ടോകൾ എടുത്ത് കലോറി അറിയുന്നതു മുതൽ ഫുഡ് സേഫ്റ്റി പരാതി നൽകുന്നതുവരെയുള്ള എല്ലാ കാര്യങ്ങളും മലയാളത്തിൽ മനസ്സിലാക്കാം.",
      languageSelector: "ഭാഷ തിരഞ്ഞെടുക്കുക:",
      architectureOverview: "ആപ്പിന്റെ സമ്പൂർണ്ണ പ്രവർത്തന ശൃംഖല",
      allStepsTitle: "7 പ്രധാന ഘട്ടങ്ങൾ (വിശദമായി കാണാൻ ക്ലിക്ക് ചെയ്യുക):",
      tryFeatureBtn: "ഈ ഫീച്ചർ ഇപ്പോൾ ഉപയോഗിക്കുക",
      requiresLoginNote: "വ്യക്തിഗത കലോറി കണക്കാക്കാൻ രജിസ്ട്രേഷൻ / ലോഗിൻ ആവശ്യമാണ്.",
      quickStartBadge: "ലളിതമായ ഗൈഡ്",
      faqTitle: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ",
      steps: [
        {
          id: 1,
          tag: "ഘട്ടം 1",
          title: "ആരോഗ്യ പ്രൊഫൈലും ദൈനംദിന കലോറി ബജറ്റും",
          icon: Activity,
          color: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          bgGradient: "from-emerald-500/10 to-teal-500/5",
          summary: "നിങ്ങളുടെ ശരീരത്തിന് അനുയോജ്യമായ കൃത്യമായ കലോറിയും പഞ്ചസാര പരിധിയും നിശ്ചയിക്കുക.",
          imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "നിങ്ങളുടെ പ്രായം, ഉയരം, ഭാരം, ലക്ഷ്യം (തടി കുറയ്ക്കൽ, മസിൽ കൂട്ടൽ, പ്രമേഹ പരിചരണം) എന്നിവ നൽകുക.",
            "Mifflin-St Jeor ശാസ്ത്രീയ ഫോർമുല വഴി ബി.എം.ആറും (BMR) ടി.ഡി.ഇ.ഇയും (TDEE) സ്വയം കണക്കാക്കുന്നു.",
            "ദിവസേന കഴിക്കാവുന്ന കൃത്യമായ കലോറി ലക്ഷ്യവും പരമാവധി 20 ഗ്രാം പഞ്ചസാര പരിധിയും നിശ്ചയിക്കുന്നു."
          ],
          example: "ഉദാഹരണം: 26 വയസ്സ്, 70 കിലോ, 172 സെ.മീ ഉള്ള ഒരാൾക്ക് തടി കുറയ്ക്കാൻ 1850 kcal കലോറി ബജറ്റ് നിശ്ചയിക്കുന്നു.",
          userAction: "പ്രൊഫൈൽ തുറന്ന് വിവരങ്ങൾ ഒരിക്കൽ നൽകുക.",
          navTarget: "dashboard"
        },
        {
          id: 2,
          tag: "ഘട്ടം 2",
          title: "AI മീൽ സ്കാനർ (ലൈവ് ക്യാമറ & ഇമേജ് റെക്കഗ്നിഷൻ)",
          icon: Camera,
          color: "text-teal-400",
          borderColor: "border-teal-500/30",
          bgGradient: "from-teal-500/10 to-cyan-500/5",
          summary: "ചായ, കാപ്പി, ആപ്പിൾ, ചോറ്, പുട്ട്, കറികൾ എന്നിവയുടെ ഫോട്ടോ എടുത്ത് കലോറി കണ്ടെത്തുക.",
          imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "ലൈവ് ക്യാമറ ഉപയോഗിച്ചോ ഗാലറിയിൽ നിന്നോ ഭക്ഷണത്തിന്റെ ഫോട്ടോ എടുക്കുക.",
            "15,960+ കേരള, ഇന്ത്യൻ ഭക്ഷണങ്ങൾ കൃത്യമായി തിരിച്ചറിയാൻ പരിശീലിപ്പിച്ച AI വിഷൻ എൻജിൻ.",
            "കലോറി, പഞ്ചസാര, പ്രോട്ടീൻ, പ്രമേഹ സുരക്ഷ (Glycemic Index) എന്നിവ തത്സമയം കാണിച്ച് തരുന്നു."
          ],
          example: "ഉദാഹരണം: കട്ടൻ ചായയുടെ ഫോട്ടോ എടുത്താൽ 48 kcal കലോറിയും 10.2g പഞ്ചസാരയും കൃത്യമായി കണ്ടെത്തും. പുട്ടും കടലയും എടുത്താൽ 360 kcal കണ്ടെത്തും.",
          userAction: "AI Meal Scanner തുറക്കുക, ലൈവ് ക്യാമറ വഴി ഫോട്ടോ എടുക്കുക.",
          navTarget: "meal_scanner"
        },
        {
          id: 3,
          tag: "ഘട്ടം 3",
          title: "ഭക്ഷണം കഴിച്ചോ എന്ന് സ്ഥിരീകരിക്കൽ (Decision Guard)",
          icon: CheckCircle2,
          color: "text-amber-400",
          borderColor: "border-amber-500/30",
          bgGradient: "from-amber-500/10 to-orange-500/5",
          summary: "വെറുതെ നോക്കിയ ഭക്ഷണങ്ങൾ ഡയറ്റിൽ കൂട്ടാതെ സൂക്ഷിക്കാനുള്ള സുരക്ഷാ സംവിധാനം.",
          imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "ഫോട്ടോ സ്കാൻ ചെയ്ത ശേഷം 'നിങ്ങൾ ഇത് കഴിച്ചോ?' എന്ന പോപ്പ്അപ്പ് വരുന്നു.",
            "'കഴിച്ചു' (Yes, I Ate This) നൽകിയാൽ മാത്രമേ ഇന്നത്തെ കലോറിയിലേക്ക് കൂട്ടുകയുള്ളൂ.",
            "'വെറുതെ നോക്കിയതാണ്' (Just Checking) നൽകിയാൽ കലോറിയിൽ കൂട്ടാതെ സ്ക്രീനിൽ വിവരം കാണാം.",
            "'Discard' നൽകിയാൽ ഡാറ്റ ഒഴിവാക്കി സ്ക്രീൻ ക്ലിയർ ചെയ്യാം."
          ],
          example: "ഉദാഹരണം: ബേക്കറിയിലെ കേക്കിന്റെ ഫോട്ടോ എടുത്ത് മധുരം നോക്കി, കഴിക്കാതിരുന്നാൽ 'Just Checking' നൽകാം — കലോറി തെറ്റായി രേഖപ്പെടുത്തില്ല!",
          userAction: "പോപ്പ്അപ്പ് വരുമ്പോൾ നിങ്ങളുടെ ശരിയായ തീരുമാനം ക്ലിക്ക് ചെയ്യുക.",
          navTarget: "dashboard"
        },
        {
          id: 4,
          tag: "ഘട്ടം 4",
          title: "പാക്കറ്റ് ഭക്ഷണവും രാസവസ്തു (E-നമ്പർ) സ്കാനറും",
          icon: ScanBarcode,
          color: "text-rose-400",
          borderColor: "border-rose-500/30",
          bgGradient: "from-rose-500/10 to-pink-500/5",
          summary: "ബിസ്കറ്റ്, ചിപ്സ് എന്നിവയിലെ അപകടകരമായ പ്രിസർവേറ്റീവുകളും പാം ഓയിലും കണ്ടെത്തുക.",
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "പാക്കറ്റിലെ ബാർകോഡ് നൽകുകയോ ചേരുവകളുടെ (Ingredients) ഫോട്ടോ എടുക്കുകയോ ചെയ്യുക.",
            "E621 (MSG), ടാർട്രാസിൻ, പാം ഓയിൽ തുടങ്ങിയ രാസവസ്തുക്കൾ OCR വഴി സ്കാൻ ചെയ്യുന്നു.",
            "ആരോഗ്യ സുരക്ഷാ ഗ്രേഡ് (A / B / C / Hazard) നൽകി മുന്നറിയിപ്പ് നൽകുന്നു."
          ],
          example: "ഉദാഹരണം: ലെയ്സ് ചിപ്സ് സ്കാൻ ചെയ്യുമ്പോൾ E621 ഫ്ലേവർ എൻഹാൻസറും ഉയർന്ന ഫാറ്റും കണ്ടെത്തി മുന്നറിയിപ്പ് നൽകും.",
          userAction: "Packaged Food Scanner തുറന്ന് ബാർകോഡോ ഫോട്ടോയോ നൽകുക.",
          navTarget: "barcode_scanner"
        },
        {
          id: 5,
          tag: "ഘട്ടം 5",
          title: "സ്മാർട്ട് ഫ്രിഡ്ജും ഹാൻഡ്സ്-ഫ്രീ വോയ്സ് ഷെഫും",
          icon: Refrigerator,
          color: "text-cyan-400",
          borderColor: "border-cyan-500/30",
          bgGradient: "from-cyan-500/10 to-blue-500/5",
          summary: "ഫ്രിഡ്ജിലെ ചേരുവകൾ ഫോട്ടോ എടുത്ത് വേസ്റ്റ് ആവാതെ വിഭവങ്ങൾ ഉണ്ടാക്കുക.",
          imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "ഫ്രിഡ്ജിന്റെ തട്ടുകളുടെയോ അടുക്കളയിലുള്ള ചേരുവകളുടെയോ ഗ്രൂപ്പ് ഫോട്ടോ എടുക്കുക.",
            "ചിത്രത്തിലുള്ള മുട്ട, തക്കാളി, ഉള്ളി, പാൽ എന്നിവയെല്ലാം AI ഒന്നിച്ച് തിരിച്ചറിയുന്നു.",
            "ആരോഗ്യകരമായ പാചകക്കുറിപ്പ് നിർമ്മിക്കുകയും സ്പീക്കറിലൂടെ ഘട്ടംഘട്ടമായി പറഞ്ഞുതരികയും ചെയ്യുന്നു."
          ],
          example: "ഉദാഹരണം: മുട്ടയും തക്കാളിയും ഉള്ള ഫോട്ടോ എടുത്താൽ 15 മിനിറ്റിൽ ഉണ്ടാക്കാവുന്ന മുട്ട റോസ്റ്റ് റെസിപ്പി വോയ്സ് സഹിതം ലഭിക്കും.",
          userAction: "Smart Fridge തുറന്ന് ഫോട്ടോ എടുത്ത് 'Generate Recipes' ക്ലിക്ക് ചെയ്യുക.",
          navTarget: "smart_fridge"
        },
        {
          id: 6,
          tag: "ഘട്ടം 6",
          title: "വ്യായാമവും കലോറി കത്തിക്കലും (Exercise Engine)",
          icon: Dumbbell,
          color: "text-indigo-400",
          borderColor: "border-indigo-500/30",
          bgGradient: "from-indigo-500/10 to-purple-500/5",
          summary: "വ്യായാമ ചിത്രങ്ങൾ, മസിലുകൾ, തത്സമയ നെറ്റ് കലോറി കുറയ്ക്കൽ.",
          imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "Net Calories = കഴിച്ച കലോറി - വ്യായാമത്തിലൂടെ കത്തിച്ച കലോറി.",
            "ആഹാരം കഴിച്ച ശേഷമുള്ള 20 മിനിറ്റ് നടത്തം രക്തത്തിലെ പഞ്ചസാര പെട്ടെന്ന് കൂടുന്നത് 34% വരെ തടയുന്നു.",
            "ഓരോ വ്യായാമത്തിന്റെയും ഫോട്ടോയും, മസിൽ ടാർഗറ്റും, നിർദ്ദേശങ്ങളും കാണിക്കുന്നു.",
            "'Complete Workout' ക്ലിക്ക് ചെയ്യുമ്പോൾ കത്തിച്ച കലോറി ഡാഷ്‌ബോർഡിൽ നിന്ന് കുറയ്ക്കപ്പെടുന്നു."
          ],
          example: "ഉദാഹരണം: ചോറ് കഴിച്ച ശേഷം 20 മിനിറ്റ് നടക്കുമ്പോൾ 95 കലോറി കുറയുകയും ദഹനം എളുപ്പമാവുകയും ചെയ്യുന്നു.",
          userAction: "Diet Dashboard -> Exercise ടാബിൽ പോയി വ്യായാമം തിരഞ്ഞെടുത്ത് കംപ്ലീറ്റ് ചെയ്യുക.",
          navTarget: "dashboard"
        },
        {
          id: 7,
          tag: "ഘട്ടം 7",
          title: "ഭക്ഷണ സുരക്ഷാ പരാതി പരിഹാര പോർട്ടൽ (FSSAI Redressal)",
          icon: ShieldAlert,
          color: "text-red-400",
          borderColor: "border-red-500/30",
          bgGradient: "from-red-500/10 to-rose-500/5",
          summary: "ഭക്ഷണത്തിലെ മായം, പഴകിയ ഭക്ഷണം എന്നിവയെക്കുറിച്ച് ഉദ്യോഗസ്ഥർക്ക് പരാതി നൽകാം.",
          imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "പഴകിയ ഭക്ഷണമോ മായമോ ഉള്ള ഹോട്ടലുകളുടെ ഫോട്ടോയും ബില്ലും പരാതിയായി നൽകാം.",
            "ഓരോ പരാതിക്കും യുണീക്ക് ട്രാക്കിംഗ് നമ്പർ ലഭിക്കുന്നു.",
            "അഡ്മിൻ പരിശോധിച്ച് അപ്രൂവൽ നൽകുന്നു.",
            "ഡെമോ ആയതിനാൽ പുറത്തേക്ക് മെയിൽ പോകാതെ പൂർണ്ണമായ മെയിൽ രസീത് സ്ക്രീനിൽ കാണിക്കും."
          ],
          example: "ഉദാഹരണം: കോഴിക്കോട് ഒരു കടയിൽ നിന്ന് പഴകിയ ഭക്ഷണം ലഭിച്ചാൽ പരാതി നൽകാം, അഡ്മിൻ അപ്രൂവ് ചെയ്താൽ ജില്ലാ ഫുഡ് സേഫ്റ്റി ഓഫീസർക്കുള്ള മെയിൽ രസീത് തയ്യാറാകും.",
          userAction: "Food Safety പോർട്ടൽ തുറന്ന് കടയുടെ വിവരങ്ങളും ഫോട്ടോയും നൽകി സബ്മിറ്റ് ചെയ്യുക.",
          navTarget: "food_safety"
        }
      ]
    },

    hi: {
      badge: "ऐप की संपूर्ण संरचना और कार्यप्रणाली (A to Z गाइड)",
      heroTitle: "AIFood कैसे काम करता है: चरण-दर-चरण गाइड",
      heroSubtitle: "नए उपयोगकर्ताओं के लिए संपूर्ण गाइड। भोजन की तस्वीर से लेकर कैलोरी गणना, फ्रिज की सामग्री से खाना पकाने और खाद्य सुरक्षा शिकायत तक की हर जानकारी हिंदी में समझें।",
      languageSelector: "भाषा चुनें:",
      architectureOverview: "सिस्टम की संपूर्ण प्रक्रिया",
      allStepsTitle: "7 मुख्य मॉड्यूल (विस्तार से देखने के लिए क्लिक करें):",
      tryFeatureBtn: "यह फीचर अभी आज़माएं",
      requiresLoginNote: "व्यक्तिगत स्वास्थ्य डेटा के लिए लॉगिन आवश्यक है।",
      quickStartBadge: "त्वरित गाइड",
      faqTitle: "अक्सर पूछे जाने वाले सवाल",
      steps: [
        {
          id: 1,
          tag: "चरण 1",
          title: "स्वास्थ्य प्रोफाइल व दैनिक कैलोरी लक्ष्य",
          icon: Activity,
          color: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          bgGradient: "from-emerald-500/10 to-teal-500/5",
          summary: "अपनी उम्र, वजन और लक्ष्य के अनुसार सही कैलोरी और शुगर सीमा तय करें।",
          imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "उम्र, वजन, लंबाई और लक्ष्य (वजन घटाना, डायबिटीज नियंत्रण) दर्ज करें।",
            "Mifflin-St Jeor फॉर्मूले से सटीक दैनिक कैलोरी बजट निर्धारित होता है।",
            "दैनिक शुगर की सुरक्षित सीमा तय की जाती है।"
          ],
          example: "उदाहरण: 70 किग्रा व्यक्ति के लिए वजन घटाने हेतु 1850 kcal का दैनिक बजट।",
          userAction: "प्रोफाइल खोलकर एक बार जानकारी भरें।",
          navTarget: "dashboard"
        },
        {
          id: 2,
          tag: "चरण 2",
          title: "एआई भोजन स्कैनर (लाइव कैमरा व फोटो पहचान)",
          icon: Camera,
          color: "text-teal-400",
          borderColor: "border-teal-500/30",
          bgGradient: "from-teal-500/10 to-cyan-500/5",
          summary: "चाय, कॉफी, सेब, चावल या थाली की फोटो लेकर तुरंत पोषण जानें।",
          imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "लाइव कैमरे या गैलरी से भोजन की फोटो लें।",
            "एआई विज़न इंजन भारतीय और वैश्विक व्यंजनों को पहचानता है।",
            "कैलोरी, चीनी, प्रोटीन और ग्लाइसेमिक इंडेक्स रिपोर्ट देता है।"
          ],
          example: "उदाहरण: मीठी चाय की फोटो लेने पर 48 kcal व शुगर चेतावनी दिखाई देगी।",
          userAction: "Meal Scanner खोलें और फोटो खींचें।",
          navTarget: "meal_scanner"
        },
        {
          id: 3,
          tag: "चरण 3",
          title: "भोजन उपभोग पुष्टि (क्या आपने वास्तव में खाया?)",
          icon: CheckCircle2,
          color: "text-amber-400",
          borderColor: "border-amber-500/30",
          bgGradient: "from-amber-500/10 to-orange-500/5",
          summary: "केवल जानकारी देखने पर गलती से कैलोरी जुड़ने से रोकने वाला सुरक्षा फीचर।",
          imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "स्कैन के बाद पॉपअप पूछता है: 'क्या आपने यह खाया?'",
            "'हाँ, खाया' चुनने पर ही दैनिक कैलोरी में जुड़ेगा।",
            "'सिर्फ देख रहे थे' चुनने पर कैलोरी नहीं जुड़ेगी।"
          ],
          example: "उदाहरण: मिठाई की कैलोरी देखकर नहीं खाने पर 'Just Checking' चुनें।",
          userAction: "पॉपअप में अपना सही विकल्प चुनें।",
          navTarget: "dashboard"
        },
        {
          id: 4,
          tag: "चरण 4",
          title: "पैकेज्ड फूड व हानिकारक E-नंबर स्कैनर",
          icon: ScanBarcode,
          color: "text-rose-400",
          borderColor: "border-rose-500/30",
          bgGradient: "from-rose-500/10 to-pink-500/5",
          summary: "चिप्स, बिस्कुट में छुपे प्रिज़र्वेटिव्स और पाम ऑयल का पता लगाएं।",
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "बारकोड स्कैन करें या पैकेट की सामग्री की फोटो अपलोड करें।",
            "हानिकारक एडिटिव्स (E621, पाम ऑयल) की जांच होती है।",
            "स्वास्थ्य सुरक्षा ग्रेड मिलता है।"
          ],
          example: "उदाहरण: चिप्स पैकेट स्कैन करने पर एमएसजी और पाम ऑयल की चेतावनी।",
          userAction: "बारकोड डालें या पैकेट की फोटो अपलोड करें।",
          navTarget: "barcode_scanner"
        },
        {
          id: 5,
          tag: "चरण 5",
          title: "स्मार्ट फ्रिज व वॉयस शेफ असिस्टेंट",
          icon: Refrigerator,
          color: "text-cyan-400",
          borderColor: "border-cyan-500/30",
          bgGradient: "from-cyan-500/10 to-blue-500/5",
          summary: "फ्रिज में बची सब्जियों की फोटो से पौष्टिक रेसिपी बनाएं।",
          imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "फ्रिज की सामग्रियों की एक साथ फोटो लें।",
            "एआई बची हुई चीजों से जीरो-वेस्ट रेसिपी तैयार करता है।",
            "वॉयस असिस्टेंट बोलकर खाना बनाने में मदद करता है।"
          ],
          example: "उदाहरण: अंडे व टमाटर की फोटो से 15 मिनट की अंडा करी का सुझाव।",
          userAction: "फ्रिज की फोटो लें और रेसिपी जनरेट करें।",
          navTarget: "smart_fridge"
        },
        {
          id: 6,
          tag: "चरण 6",
          title: "व्यायाम व कैलोरी बर्न इंजन",
          icon: Dumbbell,
          color: "text-indigo-400",
          borderColor: "border-indigo-500/30",
          bgGradient: "from-indigo-500/10 to-purple-500/5",
          summary: "वर्कआउट तस्वीरें, लक्षित मांसपेशियां और लाइव कैलोरी कटौती।",
          imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "नेट कैलोरी = खाई गई कैलोरी - वर्कआउट कैलोरी।",
            "भोजन के बाद 20 मिनट की वॉक शुगर को नियंत्रित करती है।",
            "व्यायाम पूरा करने पर बर्न हुई कैलोरी तुरंत घट जाती है।"
          ],
          example: "उदाहरण: 20 मिनट टहलने से 95 kcal घटती है।",
          userAction: "Exercise टैब में जाकर व्यायाम पूरा करें।",
          navTarget: "dashboard"
        },
        {
          id: 7,
          tag: "चरण 7",
          title: "खाद्य सुरक्षा शिकायत व सरकारी प्राधिकरण पोर्टल",
          icon: ShieldAlert,
          color: "text-red-400",
          borderColor: "border-red-500/30",
          bgGradient: "from-red-500/10 to-rose-500/5",
          summary: "मिलावटी या बासी भोजन की शिकायत सीधे अधिकारियों को भेजें।",
          imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
          howItWorks: [
            "बासी भोजन या बिल की फोटो अपलोड करके शिकायत दर्ज करें।",
            "ट्रैकिंग आईडी जनरेट होती है।",
            "एडमिन द्वारा अप्रूव होने पर आधिकारिक ईमेल रसीद तैयार होती है।"
          ],
          example: "उदाहरण: होटल में बासी भोजन मिलने पर तुरंत शिकायत दर्ज कर सकते हैं।",
          userAction: "Food Safety टैब में शिकायत और फोटो दर्ज करें।",
          navTarget: "food_safety"
        }
      ]
    }
  };

  const resolveGuideContent = () => {
    if (lang === "ml") return t.ml;
    if (lang === "hi") return t.hi;
    if (lang === "en_ml") {
      return {
        badge: `${t.en.badge} • മലയാളം`,
        heroTitle: `${t.en.heroTitle}`,
        heroSubtitle: `${t.en.heroSubtitle} — മലയാളം: ${t.ml.heroSubtitle}`,
        languageSelector: `${t.en.languageSelector} / ഭാഷ:`,
        architectureOverview: `${t.en.architectureOverview} • പ്രവർത്തന ശൃംഖല`,
        allStepsTitle: `${t.en.allStepsTitle} • എല്ലാ ഘട്ടങ്ങളും`,
        tryFeatureBtn: `${t.en.tryFeatureBtn} • തുറക്കുക`,
        requiresLoginNote: `${t.en.requiresLoginNote} • രജിസ്ട്രേഷൻ ആവശ്യമാണ്.`,
        quickStartBadge: `${t.en.quickStartBadge} • ഗൈഡ്`,
        faqTitle: `${t.en.faqTitle}`,
        steps: t.en.steps.map((st, idx) => ({
          ...st,
          title: `${st.title} • ${t.ml.steps[idx]?.title || ""}`,
          summary: `${st.summary} • ${t.ml.steps[idx]?.summary || ""}`,
          example: `${st.example} [മലയാളം: ${t.ml.steps[idx]?.example || ""}]`
        }))
      };
    }
    if (lang === "en_hi") {
      return {
        badge: `${t.en.badge} • हिन्दी`,
        heroTitle: `${t.en.heroTitle}`,
        heroSubtitle: `${t.en.heroSubtitle} — हिन्दी: ${t.hi.heroSubtitle}`,
        languageSelector: `${t.en.languageSelector} / भाषा:`,
        architectureOverview: `${t.en.architectureOverview} • सम्पूर्ण प्रक्रिया`,
        allStepsTitle: `${t.en.allStepsTitle} • सभी चरण`,
        tryFeatureBtn: `${t.en.tryFeatureBtn} • फीचर खोलें`,
        requiresLoginNote: `${t.en.requiresLoginNote} • लॉगिन आवश्यक है।`,
        quickStartBadge: `${t.en.quickStartBadge} • गाइड`,
        faqTitle: `${t.en.faqTitle}`,
        steps: t.en.steps.map((st, idx) => ({
          ...st,
          title: `${st.title} • ${t.hi.steps[idx]?.title || ""}`,
          summary: `${st.summary} • ${t.hi.steps[idx]?.summary || ""}`,
          example: `${st.example} [हिन्दी: ${t.hi.steps[idx]?.example || ""}]`
        }))
      };
    }
    return t.en;
  };

  const currentT = resolveGuideContent();
  const activeStep = currentT.steps[activeStepTab] || currentT.steps[0];
  const ActiveIcon = activeStep.icon;

  const handleSelectLang = (newLang: AppLanguage) => {
    setLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-16 max-w-7xl mx-auto">
      {/* HEADER WITH LANGUAGE SELECTOR */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentT.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {currentT.heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {currentT.heroSubtitle}
            </p>
          </div>

          {/* LANGUAGE SELECTOR BAR */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/15 backdrop-blur-md shrink-0 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{currentT.languageSelector}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectLang("en")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
                title="English (Primary)"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("en_ml")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lang === "en_ml"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
                title="English + Malayalam"
              >
                EN + ML
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("en_hi")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lang === "en_hi"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
                title="English + Hindi"
              >
                EN + HI
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("ml")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lang === "ml"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
                title="മലയാളം"
              >
                മലയാളം
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("hi")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  lang === "hi"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SYSTEM PIPELINE OVERVIEW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            {currentT.architectureOverview}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Clinical AI • Computer Vision • FSSAI Redressal
          </span>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {currentT.steps.map((st, i) => {
            const StIcon = st.icon;
            const isSelected = activeStepTab === i;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStepTab(i)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-white/10 border-emerald-400 ring-2 ring-emerald-500/30 scale-[1.02]"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? "bg-emerald-500 text-slate-950" : "bg-white/10 text-slate-300"}`}>
                    {st.tag}
                  </span>
                  <StIcon className={`w-4 h-4 ${st.color}`} />
                </div>
                <p className={`text-xs font-bold line-clamp-2 ${isSelected ? "text-white" : "text-slate-300"}`}>
                  {st.title.split("(")[0]}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* DETAILED ACTIVE STEP SHOWCASE */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Step Text Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeStep.tag} of 7
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {activeStep.summary}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <ActiveIcon className={`w-5 h-5 ${activeStep.color}`} />
                </div>
                <span>{activeStep.title}</span>
              </h3>
            </div>

            {/* How it works breakdown */}
            <div className="space-y-2.5 bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-white/10">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {lang === "ml" ? "പ്രവർത്തന രീതി" : lang === "hi" ? "कार्य प्रणाली" : "How It Works Under the Hood"}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {activeStep.howItWorks.map((hw, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{hw}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example Highlight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 text-xs sm:text-sm text-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                {lang === "ml" ? "യഥാർത്ഥ ഉദാഹരണം" : lang === "hi" ? "वास्तविक उदाहरण" : "Real-World Example"}
              </span>
              <p className="font-mono text-xs sm:text-[13px] text-white">
                {activeStep.example}
              </p>
            </div>

            {/* User Action & CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab(activeStep.navTarget)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <span>{currentT.tryFeatureBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{activeStep.userAction}</span>
              </div>
            </div>
          </div>

          {/* Step Visual Image with Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
              <img
                src={activeStep.imageUrl}
                alt={activeStep.title}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md">
                    {activeStep.tag} Showcase
                  </span>
                  <p className="text-sm font-bold text-white leading-tight">
                    {activeStep.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation buttons: Prev / Next Step */}
            <div className="flex items-center justify-between mt-3 text-xs">
              <button
                type="button"
                disabled={activeStepTab === 0}
                onClick={() => setActiveStepTab(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                ← {lang === "ml" ? "മുൻപത്തെ ഘട്ടം" : lang === "hi" ? "पिछला चरण" : "Previous Step"}
              </button>

              <span className="text-slate-400 font-mono text-xs">
                {activeStepTab + 1} / 7
              </span>

              <button
                type="button"
                disabled={activeStepTab === currentT.steps.length - 1}
                onClick={() => setActiveStepTab(prev => Math.min(currentT.steps.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {lang === "ml" ? "അടുത്ത ഘട്ടം" : lang === "hi" ? "अगला चरण" : "Next Step"} →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7 FULL STEP CARDS IN ONE PLACE FOR EASY READING */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            A to Z Full Reference
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {currentT.allStepsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentT.steps.map((st, i) => {
            const StepIcon = st.icon;
            return (
              <div
                key={st.id}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white">
                      {st.tag}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                      <StepIcon className={`w-4 h-4 ${st.color}`} />
                    </div>
                  </div>

                  <img
                    src={st.imageUrl}
                    alt={st.title}
                    className="w-full h-36 rounded-2xl object-cover border border-white/10 group-hover:scale-[1.02] transition-transform"
                  />

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {st.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-[11px] text-slate-300 font-mono">
                    {st.example}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab(st.navTarget)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all cursor-pointer"
                >
                  <span>{currentT.tryFeatureBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* REGISTRATION NOTICE BANNER FOR NEW VISITORS */}
      {!isLoggedIn && (
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>{currentT.quickStartBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {lang === "ml"
                ? "നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ രജിസ്റ്റർ ചെയ്യൂ"
                : lang === "hi"
                ? "अपनी स्वास्थ्य प्रोफाइल बनाएं"
                : "Register Your Health Profile to Start"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {currentT.requiresLoginNote}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 shrink-0 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === "ml"
                ? "സൗജന്യമായി രജിസ്റ്റർ ചെയ്യുക"
                : lang === "hi"
                ? "मुफ़्त रजिस्ट्रेशन करें"
                : "Register & Set Up Health Profile"}
            </span>
          </button>
        </section>
      )}
    </div>
  );
}
