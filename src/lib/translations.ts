export type AppLanguage = "en" | "en_ml" | "en_hi" | "ml" | "hi";

export interface PageGuideContent {
  title: string;
  tagline: string;
  summary: string;
  steps: {
    number: number;
    title: string;
    description: string;
    actionHint: string;
  }[];
  tips: string[];
  example: string;
}

export const LANGUAGE_OPTIONS: { id: AppLanguage; label: string; flag: string; badge: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧", badge: "Primary" },
  { id: "en_ml", label: "English + മലയാളം", flag: "🇮🇳", badge: "Bilingual" },
  { id: "en_hi", label: "English + हिन्दी", flag: "🇮🇳", badge: "Bilingual" },
  { id: "ml", label: "മലയാളം", flag: "🌴", badge: "Malayalam" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳", badge: "Hindi" }
];

export const UI_TRANSLATIONS: Record<AppLanguage, {
  home: string;
  dashboard: string;
  mealScanner: string;
  packagedFood: string;
  smartFridge: string;
  safetyPortal: string;
  workflowGuide: string;
  pageGuide: string;
  pageGuideDesc: string;
  hideGuide: string;
  showGuide: string;
  explainThisWork: string;
  languageSelect: string;
  login: string;
  register: string;
  logout: string;
  refresh: string;
  liveCamera: string;
  uploadPhoto: string;
  manualSearch: string;
  consumed: string;
  planned: string;
  burned: string;
  target: string;
  netCalories: string;
  sugarCeiling: string;
  ateThis: string;
  completeWorkout: string;
  generateRecipes: string;
  listenRecipe: string;
  submitComplaint: string;
  adminOversight: string;
}> = {
  en: {
    home: "Home Overview",
    dashboard: "Diet Dashboard",
    mealScanner: "AI Meal Scanner",
    packagedFood: "Packaged Food",
    smartFridge: "Smart Fridge",
    safetyPortal: "Safety Portal",
    workflowGuide: "Workflow & Guide",
    pageGuide: "Page Guide",
    pageGuideDesc: "How to use this feature step-by-step",
    hideGuide: "Hide Guide",
    showGuide: "Show Page Guide",
    explainThisWork: "Explain This Feature",
    languageSelect: "Language",
    login: "Login",
    register: "Register Free",
    logout: "Logout",
    refresh: "Refresh",
    liveCamera: "Live Camera",
    uploadPhoto: "Upload Photo",
    manualSearch: "Manual Search",
    consumed: "Consumed",
    planned: "Planned",
    burned: "Burned",
    target: "Target",
    netCalories: "Net Calories",
    sugarCeiling: "Sugar Ceiling",
    ateThis: "✓ I Ate This (Confirm)",
    completeWorkout: "Complete Workout (Mark Done)",
    generateRecipes: "Generate Healthy Recipes",
    listenRecipe: "Listen to Voice Chef",
    submitComplaint: "Submit Grievance to Authority",
    adminOversight: "Admin Oversight"
  },

  en_ml: {
    home: "Home Overview • ഹോം",
    dashboard: "Diet Dashboard • ഡയറ്റ് ഡാഷ്‌ബോർഡ്",
    mealScanner: "AI Meal Scanner • മീൽ സ്കാനർ",
    packagedFood: "Packaged Food • പാക്കറ്റ് ഭക്ഷണം",
    smartFridge: "Smart Fridge • സ്മാർട്ട് ഫ്രിഡ്ജ്",
    safetyPortal: "Safety Portal • സുരക്ഷാ പോർട്ടൽ",
    workflowGuide: "Workflow & Guide • ആപ്പ് ഗൈഡ്",
    pageGuide: "Page Guide • പേജ് ഗൈഡ്",
    pageGuideDesc: "Step-by-step usage instructions • ഉപയോഗിക്കേണ്ട വിധം",
    hideGuide: "Hide Guide • ഗൈഡ് മറയ്ക്കുക",
    showGuide: "Show Page Guide • ഗൈഡ് കാണിക്കുക",
    explainThisWork: "Explain This Feature • പ്രവർത്തനം വിശദീകരിക്കുക",
    languageSelect: "Language • ഭാഷ",
    login: "Login • ലോഗിൻ",
    register: "Register Free • സൗജന്യ രജിസ്ട്രേഷൻ",
    logout: "Logout • ലോഗൗട്ട്",
    refresh: "Refresh • പുതുക്കുക",
    liveCamera: "Live Camera • ലൈവ് ക്യാമറ",
    uploadPhoto: "Upload Photo • ഫോട്ടോ അപ്‌ലോഡ്",
    manualSearch: "Manual Search • സെർച്ച് ചെയ്യുക",
    consumed: "Consumed • കഴിച്ച ആഹാരം",
    planned: "Planned • പ്ലാൻ ചെയ്തവ",
    burned: "Burned • കത്തിച്ച കലോറി",
    target: "Target • നിശ്ചിത കലോറി",
    netCalories: "Net Calories • നെറ്റ് കലോറി",
    sugarCeiling: "Sugar Ceiling • പഞ്ചസാര പരിധി",
    ateThis: "✓ I Ate This • കഴിച്ചു (സ്ഥിരീകരിക്കുക)",
    completeWorkout: "Complete Workout • വ്യായാമം പൂർത്തിയായി",
    generateRecipes: "Generate Recipes • പാചകക്കുറിപ്പ് ഉണ്ടാക്കുക",
    listenRecipe: "Listen Voice Chef • വോയ്സ് കേൾക്കുക",
    submitComplaint: "Submit Grievance • പരാതി നൽകുക",
    adminOversight: "Admin Oversight • അഡ്മിൻ പരിശോധന"
  },

  en_hi: {
    home: "Home Overview • होम",
    dashboard: "Diet Dashboard • डाइट डैशबोर्ड",
    mealScanner: "AI Meal Scanner • भोजन स्कैनर",
    packagedFood: "Packaged Food • पैकेज्ड फूड",
    smartFridge: "Smart Fridge • स्मार्ट फ्रिज",
    safetyPortal: "Safety Portal • सुरक्षा पोर्टल",
    workflowGuide: "Workflow & Guide • संपूर्ण गाइड",
    pageGuide: "Page Guide • पेज गाइड",
    pageGuideDesc: "Step-by-step instructions • इस्तेमाल करने के चरण",
    hideGuide: "Hide Guide • गाइड छुपाएं",
    showGuide: "Show Page Guide • गाइड देखें",
    explainThisWork: "Explain Feature • यह कैसे काम करता है",
    languageSelect: "Language • भाषा",
    login: "Login • लॉगिन",
    register: "Register Free • रजिस्ट्रेशन",
    logout: "Logout • लॉगआउट",
    refresh: "Refresh • रिफ्रेश",
    liveCamera: "Live Camera • लाइव कैमरा",
    uploadPhoto: "Upload Photo • फोटो अपलोड",
    manualSearch: "Manual Search • खोजें",
    consumed: "Consumed • खाई गई कैलोरी",
    planned: "Planned • योजनाबद्ध",
    burned: "Burned • बर्न कैलोरी",
    target: "Target • लक्ष्य",
    netCalories: "Net Calories • नेट कैलोरी",
    sugarCeiling: "Sugar Ceiling • शुगर सीमा",
    ateThis: "✓ I Ate This • हाँ, मैंने खाया",
    completeWorkout: "Complete Workout • वर्कआउट पूरा करें",
    generateRecipes: "Generate Recipes • रेसिपी बनाएं",
    listenRecipe: "Listen Voice Chef • आवाज़ सुनें",
    submitComplaint: "Submit Grievance • शिकायत दर्ज करें",
    adminOversight: "Admin Oversight • एडमिन समीक्षा"
  },

  ml: {
    home: "ഹോം വിവരണം",
    dashboard: "ഡയറ്റ് ഡാഷ്‌ബോർഡ്",
    mealScanner: "AI മീൽ സ്കാനർ",
    packagedFood: "പാക്കറ്റ് ഭക്ഷണം & കെമിക്കലുകൾ",
    smartFridge: "സ്മാർട്ട് ഫ്രിഡ്ജും വോയ്സ് ഷെഫും",
    safetyPortal: "ഭക്ഷണ സുരക്ഷാ പോർട്ടൽ",
    workflowGuide: "ആപ്പിന്റെ വഴികാട്ടി (A-Z)",
    pageGuide: "പേജ് ഗൈഡ്",
    pageGuideDesc: "ഈ പേജ് ഉപയോഗിക്കേണ്ട വിധം ഘട്ടംഘട്ടമായി",
    hideGuide: "ഗൈഡ് മറയ്ക്കുക",
    showGuide: "പേജ് ഗൈഡ് കാണുക",
    explainThisWork: "പ്രവർത്തനം വിശദീകരിക്കുക",
    languageSelect: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    login: "ലോഗിൻ",
    register: "സൗജന്യ രജിസ്ട്രേഷൻ",
    logout: "ലോഗൗട്ട്",
    refresh: "പുതുക്കുക",
    liveCamera: "ലൈവ് ക്യാമറ",
    uploadPhoto: "ഫോട്ടോ അപ്‌ലോഡ്",
    manualSearch: "ഭക്ഷണം ടൈപ്പ് ചെയ്യുക",
    consumed: "കഴിച്ച കലോറി",
    planned: "പ്ലാൻ ചെയ്തവ",
    burned: "കത്തിച്ച കലോറി",
    target: "ലക്ഷ്യ കലോറി",
    netCalories: "നെറ്റ് കലോറി",
    sugarCeiling: "പഞ്ചസാര പരിധി",
    ateThis: "✓ ഞാൻ ഇത് കഴിച്ചു (Confirm)",
    completeWorkout: "വ്യായാമം പൂർത്തിയായി (Done)",
    generateRecipes: "വിഭവങ്ങൾ കണ്ടെത്തുക",
    listenRecipe: "വോയ്സ് ഷെഫ് കേൾക്കുക",
    submitComplaint: "പരാതി നൽകുക",
    adminOversight: "അഡ്മിൻ മേൽനോട്ടം"
  },

  hi: {
    home: "होम अवलोकन",
    dashboard: "डाइट डैशबोर्ड",
    mealScanner: "एआई भोजन स्कैनर",
    packagedFood: "पैकेज्ड फूड व एडिटिव्स",
    smartFridge: "स्मार्ट फ्रिज व शेफ",
    safetyPortal: "खाद्य सुरक्षा पोर्टल",
    workflowGuide: "ऐप संपूर्ण गाइड (A-Z)",
    pageGuide: "पेज गाइड",
    pageGuideDesc: "इस पेज को इस्तेमाल करने की विधि",
    hideGuide: "गाइड छुपाएं",
    showGuide: "पेज गाइड देखें",
    explainThisWork: "यह कैसे काम करता है",
    languageSelect: "भाषा चुनें",
    login: "लॉगिन",
    register: "मुफ़्त रजिस्ट्रेशन",
    logout: "लॉगआउट",
    refresh: "रिफ्रेश",
    liveCamera: "लाइव कैमरा",
    uploadPhoto: "फोटो अपलोड",
    manualSearch: "सर्च करें",
    consumed: "खाई गई कैलोरी",
    planned: "योजनाबद्ध भोजन",
    burned: "बर्न कैलोरी",
    target: "दैनिक लक्ष्य",
    netCalories: "नेट कैलोरी",
    sugarCeiling: "शुगर सीमा",
    ateThis: "✓ हाँ, मैंने खाया",
    completeWorkout: "वर्कआउट पूरा करें",
    generateRecipes: "रेसिपी बनाएं",
    listenRecipe: "वॉयस शेफ सुनें",
    submitComplaint: "शिकायत दर्ज करें",
    adminOversight: "एडमिन समीक्षा"
  }
};

export const PAGE_GUIDES: Record<
  "dashboard" | "meal_scanner" | "barcode_scanner" | "smart_fridge" | "food_safety",
  Record<AppLanguage, PageGuideContent>
> = {
  dashboard: {
    en: {
      title: "Diet Dashboard & Sugar Tracker Guide",
      tagline: "Track Mifflin-St Jeor TDEE, net calories, sugar ceilings, and 4 routine meals",
      summary: "This dashboard balances what you consume with physical activity and keeps your blood sugar within clinical safety limits.",
      steps: [
        {
          number: 1,
          title: "Check Today's Calorie Balance",
          description: "View Food Consumed minus Workouts Burned = Net Calories against your daily goal.",
          actionHint: "Look at the Net Calorie gauge at the top."
        },
        {
          number: 2,
          title: "Select Your Goal Category in AI Meal Plan",
          description: "Use the Category Switcher (Weight Loss, Muscle Gain, Diabetic Care, Maintenance) to instantly adapt your 4 meals.",
          actionHint: "Click the 'AI Meal Plan' tab and choose your category."
        },
        {
          number: 3,
          title: "Rotate & Refresh Meals",
          description: "Click 'Refresh AI Meals Plan' to cycle through high-protein, Kerala traditional, or light options.",
          actionHint: "Tap 'Refresh AI Meals Plan' anytime for variety."
        },
        {
          number: 4,
          title: "Log Completed Workouts",
          description: "In 'Exercise & Burn', browse workouts with exercise photos, targeted muscles, and click 'Complete Workout' to offset calories.",
          actionHint: "Open the 'Exercise & Burn' sub-tab."
        }
      ],
      tips: [
        "Aim to keep Net Calories within ±100 kcal of your daily target.",
        "Take a 20-min Post-Meal walk after high-carb meals to blunt glucose spikes."
      ],
      example: "70kg User on Weight Loss: Target 1850 kcal. Ate 1400 kcal, burned 180 kcal via brisk walk -> Net: 1220 kcal (630 kcal deficit buffer remaining)."
    },
    en_ml: {
      title: "Diet Dashboard Guide • ഡയറ്റ് ഡാഷ്‌ബോർഡ് ഗൈഡ്",
      tagline: "Track calories, sugar, and meals • കലോറിയും പഞ്ചസാരയും ഭക്ഷണക്രമവും നിരീക്ഷിക്കുക",
      summary: "Balances food intake with exercise and ensures safe sugar limits • കഴിക്കുന്ന ഭക്ഷണവും വ്യായാമവും ഒത്തുനോക്കി രക്തത്തിലെ പഞ്ചസാര സുരക്ഷിതമാക്കുന്നു.",
      steps: [
        {
          number: 1,
          title: "Check Net Calories • നെറ്റ് കലോറി പരിശോധിക്കുക",
          description: "Consumed Calories - Burned Calories = Net Calories • കഴിച്ച കലോറിയിൽ നിന്ന് വ്യായാമം കുറച്ച് നെറ്റ് കലോറി അറിയാം.",
          actionHint: "Top gauge shows real-time balance."
        },
        {
          number: 2,
          title: "Switch Goal Category • കാറ്റഗറി തിരഞ്ഞെടുക്കുക",
          description: "Change between Weight Loss, Muscle Gain, Diabetic Care • തടി കുറയ്ക്കൽ, മസിൽ കൂട്ടൽ, പ്രമേഹ പരിചരണം എന്നിവയിൽ ആവശ്യമുള്ളത് മാറ്റാം.",
          actionHint: "Click category buttons in AI Meal Plan."
        },
        {
          number: 3,
          title: "Refresh 4 Daily Meals • മീൽ പ്ലാൻ പുതുക്കുക",
          description: "Rotate breakfast, lunch, snack, dinner suggestions • 4 നേരത്തെ ഭക്ഷണങ്ങൾ പുതിയ വിഭവങ്ങളിലേക്ക് മാറ്റുക.",
          actionHint: "Click 'Refresh AI Meals Plan'."
        },
        {
          number: 4,
          title: "Log Exercises & Offset • വ്യായാമം രേഖപ്പെടുത്തുക",
          description: "View exercise photos and complete workouts • വ്യായാമ ചിത്രങ്ങൾ കണ്ട് പൂർത്തിയാക്കി കലോറി കുറയ്ക്കുക.",
          actionHint: "Open 'Exercise & Burn' sub-tab."
        }
      ],
      tips: [
        "Keep sugar under 20g daily • പഞ്ചസാര ദിവസേന 20 ഗ്രാമിൽ താഴെ നിർത്തുക.",
        "Take post-meal walks • ആഹാരത്തിന് ശേഷം 20 മിനിറ്റ് സാവധാനം നടക്കുക."
      ],
      example: "E.g., 70kg User: Target 1850 kcal. Consumed 1400 kcal - 180 kcal walk = 1220 net kcal."
    },
    en_hi: {
      title: "Diet Dashboard Guide • डाइट डैशबोर्ड गाइड",
      tagline: "Track calories, sugar, and workouts • कैलोरी, शुगर और वर्कआउट ट्रैक करें",
      summary: "Manages your daily caloric budget and sugar ceiling • आपके दैनिक कैलोरी बजट और शुगर को नियंत्रित करता है।",
      steps: [
        {
          number: 1,
          title: "Monitor Net Calories • नेट कैलोरी देखें",
          description: "Food Consumed - Workouts Burned = Net Calories • खाई गई कैलोरी में से बर्न कैलोरी घटाकर संतुलन देखें।",
          actionHint: "Check the top status cards."
        },
        {
          number: 2,
          title: "Choose Your Goal • अपना लक्ष्य चुनें",
          description: "Switch to Weight Loss, Muscle Gain, or Diabetic Care • वजन घटाना, मस्कल गेन या डायबिटीज केयर चुनें।",
          actionHint: "Click categories in AI Meal Plan."
        },
        {
          number: 3,
          title: "Refresh Meal Variations • मील प्लान बदलें",
          description: "Get fresh recipes for breakfast, lunch, snack, dinner • सुबह से रात तक के नए मेनू के लिए रिफ्रेश दबाएं।",
          actionHint: "Click 'Refresh AI Meals Plan'."
        },
        {
          number: 4,
          title: "Complete Workouts • वर्कआउट पूरा करें",
          description: "See exercise photos, targeted muscles, and mark done • व्यायाम की तस्वीरें देखकर वर्कआउट पूरा करें।",
          actionHint: "Go to 'Exercise & Burn' tab."
        }
      ],
      tips: [
        "Keep daily sugar under safe limits • चीनी की मात्रा सीमित रखें।",
        "Walk 20 mins after meals • खाने के बाद 20 मिनट टहलें।"
      ],
      example: "70kg व्यक्ति: 1850 kcal का लक्ष्य, 1400 खाई, 180 बर्न की -> नेट: 1220 kcal."
    },
    ml: {
      title: "ഡയറ്റ് ഡാഷ്‌ബോർഡ് സമഗ്ര വഴികാട്ടി",
      tagline: "കലോറി, പഞ്ചസാര പരിധി, 4 നേരത്തെ സമീകൃതാഹാരം എന്നിവ നിരീക്ഷിക്കുക",
      summary: "നിങ്ങൾ കഴിക്കുന്ന ഭക്ഷണവും ചെയ്യുന്ന വ്യായാമവും കണക്കുകൂട്ടി രക്തത്തിലെ പഞ്ചസാരയും ശരീരഭാരവും സുരക്ഷിതമായി നിലനിർത്തുന്നു.",
      steps: [
        {
          number: 1,
          title: "നെറ്റ് കലോറി നിരീക്ഷിക്കുക",
          description: "കഴിച്ച ആഹാരത്തിൽ നിന്ന് വ്യായാമത്തിലൂടെ കത്തിച്ച കലോറി കുറച്ചാണ് നെറ്റ് കലോറി കണക്കാക്കുന്നത്.",
          actionHint: "മുകളിലെ കലോറി ഗേജ് ശ്രദ്ധിക്കുക."
        },
        {
          number: 2,
          title: "ഡയറ്റ് കാറ്റഗറി തിരഞ്ഞെടുക്കുക",
          description: "തടി കുറയ്ക്കൽ (Weight Loss), മസിൽ കൂട്ടൽ (Muscle Gain), പ്രമേഹം (Diabetic Care), പൊതു ആരോഗ്യം എന്നിവയിൽ നിന്ന് ആവശ്യമുള്ളത് തിരഞ്ഞെടുക്കുക.",
          actionHint: "'AI Meal Plan' കാർഡിലെ ബട്ടണുകൾ ഉപയോഗിക്കുക."
        },
        {
          number: 3,
          title: "4 നേരത്തെ ഭക്ഷണക്രമം പുതുക്കുക",
          description: "'Refresh AI Meals Plan' അമർത്തി പുതിയ വിഭവങ്ങളുടെ കോമ്പിനേഷൻ കാണുക.",
          actionHint: "'Refresh AI Meals Plan' ക്ലിക്ക് ചെയ്യുക."
        },
        {
          number: 4,
          title: "വ്യായാമങ്ങൾ പൂർത്തിയാക്കുക",
          description: "'Exercise & Burn' ടാബിൽ വ്യായാമങ്ങളുടെ ഫോട്ടോയും സ്വാധീനിക്കുന്ന മസിലുകളും കണ്ട് വർക്കൗട്ട് പൂർത്തിയാക്കുക.",
          actionHint: "'Exercise & Burn' ടാബ് തുറക്കുക."
        }
      ],
      tips: [
        "ദിവസേന പഞ്ചസാര 20 ഗ്രാമിൽ താഴെയായി നിലനിർത്താൻ ശ്രദ്ധിക്കുക.",
        "ഭക്ഷണത്തിന് ശേഷം 20 മിനിറ്റ് സാവധാനം നടക്കുന്നത് ഷുഗർ സ്പൈക്ക് 34% കുറയ്ക്കും."
      ],
      example: "ഉദാഹരണം: 70 കിലോ ഉള്ള ഒരാൾ 1400 kcal കഴിച്ചു, 180 kcal നടന്ന് കത്തിച്ചു -> നെറ്റ് കലോറി 1220 kcal മാത്രം!"
    },
    hi: {
      title: "डाइट डैशबोर्ड संपूर्ण गाइड",
      tagline: "कैलोरी बजट, शुगर सीमा और 4 समय का संतुलित भोजन प्लान",
      summary: "यह डैशबोर्ड आपके भोजन और व्यायाम को संतुलित करके आपको फिट और स्वस्थ रखने में मदद करता है।",
      steps: [
        {
          number: 1,
          title: "नेट कैलोरी की जांच करें",
          description: "खाई गई कैलोरी - बर्न की गई कैलोरी = नेट कैलोरी।",
          actionHint: "ऊपर दिए गए स्कोर कार्ड देखें।"
        },
        {
          number: 2,
          title: "अपनी कैटेगरी चुनें",
          description: "वजन घटाना, बॉडीबिल्डिंग या डायबिटीज नियंत्रण में से अपना लक्ष्य चुनें।",
          actionHint: "AI Meal Plan में कैटेगरी चुनें।"
        },
        {
          number: 3,
          title: "मील प्लान रिफ्रेश करें",
          description: "सुबह, दोपहर, शाम और रात के नए मेनू के लिए रिफ्रेश बटन दबाएं।",
          actionHint: "'Refresh AI Meals Plan' दबाएं।"
        },
        {
          number: 4,
          title: "वर्कआउट दर्ज करें",
          description: "व्यायाम की फोटो और निर्देश देखकर 'Complete Workout' मार्क करें।",
          actionHint: "'Exercise & Burn' सेक्शन में जाएं।"
        }
      ],
      tips: [
        "दैनिक चीनी की मात्रा नियंत्रित रखें।",
        "खाने के बाद 20 मिनट टहलना स्वास्थ्य के लिए उत्तम है।"
      ],
      example: "70 किग्रा व्यक्ति: 1850 kcal का लक्ष्य, 1400 खाई, 180 बर्न की -> 1220 kcal नेट।"
    }
  },

  meal_scanner: {
    en: {
      title: "AI Meal Scanner Guide",
      tagline: "Live Camera & Photo Upload Nutrition Intelligence",
      summary: "Identifies cooked dishes, fruits, teas, coffees, and mixed plates to deliver instant calories, sugar spikes, glycemic index, and diabetic safety.",
      steps: [
        {
          number: 1,
          title: "Capture or Upload Plate Photo",
          description: "Click 'Live Camera' to snap directly or upload an existing picture from your phone/PC.",
          actionHint: "Point camera at food under good lighting."
        },
        {
          number: 2,
          title: "Inspect Nutritional Breakdown",
          description: "Review automated calories, sugar, protein, carbs, fat, and diabetic safety badge.",
          actionHint: "Check the Glycemic Index & diabetic warning."
        },
        {
          number: 3,
          title: "Confirm Food Consumption",
          description: "Decision Guard asks: Did you eat this? Click 'Yes, I ate this' to add to your daily calories, or 'Just previewing' to inspect without logging.",
          actionHint: "Choose your answer in the confirmation alert."
        }
      ],
      tips: [
        "Ensure clear lighting on tea/coffee cups to distinguish black tea, milk tea, or coffee.",
        "Keep the full plate inside the frame for multi-item Kerala thali meals."
      ],
      example: "Snapping 'Kattan Chaya' flags ~48 kcal with 10.2g high sugar alert; snapping 'Kerala Puttu + Kadala' detects ~360 kcal and 12.5g protein."
    },
    en_ml: {
      title: "AI Meal Scanner Guide • മീൽ സ്കാനർ ഗൈഡ്",
      tagline: "Live camera food scanning • ലൈവ് ക്യാമറ ഫുഡ് സ്കാനിംഗ്",
      summary: "Snaps tea, coffee, fruit, or plates for instant calories and sugar • ഫോട്ടോ എടുത്ത് കലോറിയും ഷുഗറും അറിയുക.",
      steps: [
        {
          number: 1,
          title: "Snap Plate Photo • ഫോട്ടോ എടുക്കുക",
          description: "Use Live Camera or upload a picture • ലൈവ് ക്യാമറ വഴിയോ ഗാലറിയിൽ നിന്നോ ഫോട്ടോ നൽകുക.",
          actionHint: "Click 'Live Camera'."
        },
        {
          number: 2,
          title: "View Nutritional Card • പോഷക വിവരങ്ങൾ കാണുക",
          description: "See Calories, Sugar, Glycemic Index • കലോറി, പഞ്ചസാര, പ്രമേഹ സുരക്ഷ എന്നിവ പരിശോധിക്കുക.",
          actionHint: "Inspect macro breakdown."
        },
        {
          number: 3,
          title: "Confirm Decision • കഴിച്ചോ എന്ന് സ്ഥിരീകരിക്കുക",
          description: "Click 'Yes, I ate this' to count or 'Just previewing' to check without adding • കഴിച്ചെങ്കിൽ മാത്രം ഡയറ്റിൽ കൂട്ടുക.",
          actionHint: "Tap your choice in popup."
        }
      ],
      tips: [
        "Use good lighting for tea/coffee • നല്ല വെളിച്ചത്തിൽ ഫോട്ടോ എടുക്കുക.",
        "Include entire plate • പ്ലേറ്റ് മുഴുവനായും ഫ്രെയിമിൽ ഉൾപ്പെടുത്തുക."
      ],
      example: "E.g. Kattan Chaya: 48 kcal with 10.2g sugar alert. Puttu + Kadala: 360 kcal, 12.5g protein."
    },
    en_hi: {
      title: "AI Meal Scanner Guide • भोजन स्कैनर गाइड",
      tagline: "Live camera food intelligence • लाइव कैमरा पोषण विश्लेषण",
      summary: "Analyze photos of tea, fruits, and meals • भोजन की फोटो से कैलोरी और शुगर की जानकारी।",
      steps: [
        {
          number: 1,
          title: "Take a Food Photo • भोजन की फोटो लें",
          description: "Use live camera or upload photo • लाइव कैमरा खोलें या फोटो अपलोड करें।",
          actionHint: "Click 'Live Camera'."
        },
        {
          number: 2,
          title: "Check Nutrition • पोषण रिपोर्ट देखें",
          description: "View calories, sugar, protein, and diabetic safety • कैलोरी, शुगर और डायबिटिक सुरक्षा देखें।",
          actionHint: "Review the result card."
        },
        {
          number: 3,
          title: "Confirm Consumption • खाने की पुष्टि करें",
          description: "Select 'Yes, I ate this' to log calories • 'हाँ, मैंने खाया' चुनने पर ही कैलोरी जुड़ेगी।",
          actionHint: "Choose in the popup."
        }
      ],
      tips: [
        "Good lighting gives highest accuracy • पर्याप्त रोशनी में फोटो लें।",
        "Keep the full plate in view • पूरी थाली फ्रेम में रखें।"
      ],
      example: "सेब की फोटो पर ~95 kcal व प्राकृतिक फाइबर बताएगा।"
    },
    ml: {
      title: "AI മീൽ സ്കാനർ സമഗ്ര വഴികാട്ടി",
      tagline: "ലൈവ് ക്യാമറ ഉപയോഗിച്ച് ഭക്ഷണത്തിന്റെ പോഷക വിവരങ്ങൾ തത്സമയം അറിയുക",
      summary: "ചായ, കാപ്പി, പഴങ്ങൾ, ചോറ്, പുട്ട്, കറികൾ എന്നിവയുടെ ഫോട്ടോ എടുത്താൽ കലോറി, പഞ്ചസാര, പ്രമേഹ സുരക്ഷ എന്നിവ കൃത്യമായി കണ്ടെത്തുന്ന സംവിധാനം.",
      steps: [
        {
          number: 1,
          title: "ലൈവ് ക്യാമറ വഴി ഫോട്ടോ എടുക്കുക",
          description: "'Live Camera' ക്ലിക്ക് ചെയ്ത് ഭക്ഷണത്തിന് നേരെ വെച്ച് Capture ചെയ്യുക, അല്ലെങ്കിൽ ഗാലറിയിൽ നിന്ന് ഫോട്ടോ നൽകുക.",
          actionHint: "'Live Camera' ബട്ടൺ അമർത്തുക."
        },
        {
          number: 2,
          title: "പോഷക വിവരങ്ങൾ വിലയിരുത്തുക",
          description: "കലോറി, പഞ്ചസാരയുടെ അളവ്, പ്രോട്ടീൻ, ഗ്ലൈസെമിക് ഇൻഡക്സ് (പ്രമേഹ സുരക്ഷ) എന്നിവ AI കാണിക്കും.",
          actionHint: "ഡയബറ്റിക് മുന്നറിയിപ്പുകൾ പരിശോധിക്കുക."
        },
        {
          number: 3,
          title: "ഭക്ഷണം കഴിച്ചോ എന്ന് സ്ഥിരീകരിക്കുക",
          description: "'കഴിച്ചു' (Yes, I Ate This) നൽകിയാൽ കലോറി കണക്കിൽ കൂട്ടും. 'വെറുതെ നോക്കിയതാണെങ്കിൽ' (Just Previewing) നൽകിയാൽ ഡയറ്റിൽ കൂട്ടാതെ സൂക്ഷിക്കാം.",
          actionHint: "പോപ്പ്അപ്പിൽ ശരിയായ ഓപ്ഷൻ നൽകുക."
        }
      ],
      tips: [
        "നല്ല വെളിച്ചത്തിൽ ഫോട്ടോ എടുത്താൽ ചായ, കാപ്പി എന്നിവയുടെ വ്യത്യാസം പെട്ടെന്ന് തിരിച്ചറിയും.",
        "വിഭവങ്ങൾ മുഴുവനായും കാണത്തക്കവിധം ഫോട്ടോ എടുക്കുക."
      ],
      example: "ഉദാഹരണത്തിന്: കട്ടൻ ചായ സ്കാൻ ചെയ്യുമ്പോൾ 48 kcal കലോറിയും 10.2g പഞ്ചസാരയും കണ്ടെത്തും. പുട്ടും കടലയും സ്കാൻ ചെയ്യുമ്പോൾ 360 kcal കണ്ടെത്തും."
    },
    hi: {
      title: "एआई भोजन स्कैनर गाइड",
      tagline: "लाइव कैमरा से भोजन की फोटो लेकर तुरंत पोषण जानें",
      summary: "चाय, कॉफी, फल, चावल और थाली की फोटो से कैलोरी, शुगर और डायबिटिक सुरक्षा की गणना करता है।",
      steps: [
        {
          number: 1,
          title: "भोजन की फोटो लें",
          description: "लाइव कैमरा खोलकर भोजन की साफ तस्वीर लें या गैलरी से अपलोड करें।",
          actionHint: "'Live Camera' पर क्लिक करें।"
        },
        {
          number: 2,
          title: "पोषण परिणाम देखें",
          description: "कैलोरी, चीनी, प्रोटीन, फैट और ग्लाइसेमिक इंडेक्स रिपोर्ट देखें।",
          actionHint: "डायबिटिक सुरक्षा टैग देखें।"
        },
        {
          number: 3,
          title: "खाने की पुष्टि करें",
          description: "यदि आपने खाया है तो 'हाँ, मैंने खाया' चुनें, अन्यथा 'सिर्फ देख रहे थे' चुनें।",
          actionHint: "पॉपअप में सही विकल्प चुनें।"
        }
      ],
      tips: [
        "अच्छी रोशनी में फोटो लें ताकि पेय पदार्थों का रंग साफ दिखे।",
        "पूरी थाली को कैमरे के फ्रेम में रखें।"
      ],
      example: "मीठी चाय स्कैन करने पर 48 kcal व उच्च चीनी की चेतावनी मिलेगी।"
    }
  },

  barcode_scanner: {
    en: {
      title: "Packaged Food & Additives Scanner Guide",
      tagline: "Detect Harmful E-Numbers, Palm Oil, and Hidden Sugars",
      summary: "Cross-references barcodes and ingredient labels with clinical toxicity indexes to flag cancer risks, hyperactivity warnings, and diabetic hazards.",
      steps: [
        {
          number: 1,
          title: "Scan Barcode or Upload Label Photo",
          description: "Enter product barcode (e.g. 8901030383701) or take a photo of the packet's back ingredient list.",
          actionHint: "Use 'Scan Barcode' or 'Upload Packet Photo'."
        },
        {
          number: 2,
          title: "Inspect Safety Grade & Harmful Additives",
          description: "View Safety Grade (A / B / C / Hazard) and highlighted chemical additive codes (E621 MSG, E102, palm oil).",
          actionHint: "Read chemical warning badges."
        },
        {
          number: 3,
          title: "Confirm Decision",
          description: "Verify if you consumed the snack to update your sugar and calorie totals.",
          actionHint: "Click Consumed or Keep Visible."
        }
      ],
      tips: [
        "Focus camera clearly on the 'Ingredients' section on the back of the packet.",
        "Avoid shiny glare on plastic packaging."
      ],
      example: "Scanning potato chips flags Monosodium Glutamate (E621) flavor enhancer and high saturated fat with a Caution grade."
    },
    en_ml: {
      title: "Packaged Food Scanner Guide • പാക്കറ്റ് ഫുഡ് ഗൈഡ്",
      tagline: "Detect chemical E-numbers • രാസവസ്തുക്കൾ കണ്ടെത്തുക",
      summary: "Scans barcodes and ingredients for harmful additives • പാക്കറ്റുകളിലെ അപകടകരമായ കെമിക്കലുകൾ കണ്ടെത്തുന്നു.",
      steps: [
        {
          number: 1,
          title: "Scan Barcode or Label • ബാർകോഡ് സ്കാൻ ചെയ്യുക",
          description: "Enter barcode or upload ingredient photo • ബാർകോഡോ ചേരുവകളുടെ ഫോട്ടോയോ നൽകുക.",
          actionHint: "Use camera or upload."
        },
        {
          number: 2,
          title: "Review Safety Rating • സുരക്ഷാ ഗ്രേഡ് പരിശോധിക്കുക",
          description: "Check E-numbers (E621 MSG, E102) • E-നമ്പറുകളും ആരോഗ്യ പ്രശ്നങ്ങളും മനസ്സിലാക്കുക.",
          actionHint: "Check Safety Grade."
        },
        {
          number: 3,
          title: "Confirm Intake • കഴിച്ചോ എന്ന് സ്ഥിരീകരിക്കുക",
          description: "Mark consumed only if you ate it • കഴിച്ചെങ്കിൽ മാത്രം ഡയറ്റിൽ ചേർക്കുക.",
          actionHint: "Select decision in popup."
        }
      ],
      tips: [
        "Photograph the Ingredients list • പാക്കറ്റിലെ 'Ingredients' ഭാഗം വ്യക്തമായി ഫോട്ടോ എടുക്കുക.",
        "Avoid plastic glare • വെളിച്ച പ്രതിഫലനം ഒഴിവാക്കുക."
      ],
      example: "E.g., Potato chips scan flags E621 (MSG) and palm oil with Grade C warning."
    },
    en_hi: {
      title: "Packaged Food Guide • पैकेज्ड फूड गाइड",
      tagline: "Scan barcode and toxic E-numbers • बारकोड व केमिकल जांचें",
      summary: "Decodes chemical preservatives and hidden sugars • रासायनिक एडिटिव्स और चीनी की जांच।",
      steps: [
        {
          number: 1,
          title: "Scan Barcode or Photo • बारकोड या फोटो दें",
          description: "Enter barcode or upload packet ingredients photo • बारकोड डालें या पैकेट की फोटो लें।",
          actionHint: "Use Barcode or Upload."
        },
        {
          number: 2,
          title: "Check Safety Grade • सुरक्षा ग्रेड देखें",
          description: "Inspect harmful E-numbers (E621, E102) • खतरनाक रसायनों की सूची देखें।",
          actionHint: "Read additive warnings."
        },
        {
          number: 3,
          title: "Log Consumption • खाने की पुष्टि करें",
          description: "Confirm if consumed or discard • यदि खाया तो पुष्टि करें या छोड़ दें।",
          actionHint: "Choose in prompt."
        }
      ],
      tips: [
        "Capture ingredients list clearly • सामग्री सूची की साफ फोटो लें।"
      ],
      example: "चिप्स पैकेट स्कैन करने पर एमएसजी (E621) व पाम ऑयल की सीधी चेतावनी मिलेगी।"
    },
    ml: {
      title: "പാക്കറ്റ് ഭക്ഷണവും രാസവസ്തു സ്കാനറും - വഴികാട്ടി",
      tagline: "പാക്കറ്റുകളിലെ അപകടകരമായ കെമിക്കലുകളും പ്രിസർവേറ്റീവുകളും കണ്ടെത്തുക",
      summary: "ബിസ്കറ്റ്, ചിപ്സ്, ശീതളപാനീയങ്ങൾ എന്നിവയിലെ പ്രിസർവേറ്റീവുകൾ, E-നമ്പറുകൾ (E621 MSG, ടാർട്രാസിൻ, പാം ഓയിൽ), ഒളിഞ്ഞിരിക്കുന്ന മധുരം എന്നിവ പരിശോധിച്ച് സുരക്ഷാ റേറ്റിംഗ് നൽകുന്നു.",
      steps: [
        {
          number: 1,
          title: "ബാർകോഡോ പാക്കറ്റിന്റെ ഫോട്ടോയോ നൽകുക",
          description: "പാക്കറ്റിലെ ബാർകോഡ് നമ്പർ നൽകുകയോ ചേരുവകൾ (Ingredients) കാണിക്കുന്ന ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുകയോ ചെയ്യുക.",
          actionHint: "'Scan Barcode' അല്ലെങ്കിൽ 'Upload' ഉപയോഗിക്കുക."
        },
        {
          number: 2,
          title: "സുരക്ഷാ ഗ്രേഡും കെമിക്കലുകളും പരിശോധിക്കുക",
          description: "A / B / C / Hazard ഗ്രേഡും അതിലടങ്ങിയിട്ടുള്ള അപകടകരമായ ചേരുവകളും AI കാണിക്കും.",
          actionHint: "ഹെൽത്ത് വാർണിംഗുകൾ വായിക്കുക."
        },
        {
          number: 3,
          title: "തീരുമാനം സ്ഥിരീകരിക്കുക",
          description: "ഭക്ഷണം കഴിച്ചെങ്കിൽ മാത്രം 'Consumed' നൽകുക, അല്ലെങ്കിൽ കലോറിയിൽ കൂട്ടാതെ സൂക്ഷിക്കുക.",
          actionHint: "പോപ്പ്അപ്പിൽ ഉത്തരം തിരഞ്ഞെടുക്കുക."
        }
      ],
      tips: [
        "പാക്കറ്റിന്റെ പുറകിലുള്ള 'Ingredients' ഭാഗം വ്യക്തമായി ഫോട്ടോ എടുക്കുക.",
        "പ്ലാസ്റ്റിക് കവറിലെ വെളിച്ച പ്രതിഫലനം ഒഴിവാക്കുക."
      ],
      example: "ഉദാഹരണത്തിന്: ലെയ്സ് ചിപ്സ് സ്കാൻ ചെയ്യുമ്പോൾ E621 (MSG) പ്രിസർവേറ്റീവും പാം ഓയിലും കണ്ടെത്തി ആരോഗ്യത്തിന് ഹാനികരമെന്ന് മുന്നറിയിപ്പ് തരും."
    },
    hi: {
      title: "पैकेज्ड फूड व केमिकल एडिटिव्स गाइड",
      tagline: "हानिकारक E-नंबर और छुपी हुई चीनी का पता लगाएं",
      summary: "पैकेज्ड फूड्स में मौजूद हानिकारक रासायनिक एडिटिव्स (E-नंबर्स), पाम ऑयल और चीनी की जांच करके सुरक्षा स्कोर प्रदान करता है।",
      steps: [
        {
          number: 1,
          title: "बारकोड या पैकेट की फोटो दें",
          description: "बारकोड नंबर डालें या पैकेट के पीछे लिखी सामग्री (Ingredients) की फोटो अपलोड करें।",
          actionHint: "बारकोड या फोटो अपलोड का उपयोग करें।"
        },
        {
          number: 2,
          title: "सुरक्षा ग्रेड और चेतावनी देखें",
          description: "सुरक्षा ग्रेड (A/B/C/Hazard) और हानिकारक रसायनों (जैसे E621 MSG) की जांच करें।",
          actionHint: "चेतावनी लेबल पढ़ें।"
        },
        {
          number: 3,
          title: "पुष्टि करें",
          description: "यदि आपने खाया है तो पुष्टि करें, नहीं तो सिर्फ जानकारी के लिए रखें।",
          actionHint: "पॉपअप में विकल्प चुनें।"
        }
      ],
      tips: [
        "सामग्री (Ingredients) वाले भाग की साफ फोटो लें।"
      ],
      example: "नमकीन पैकेट स्कैन करने पर अत्यधिक सोडियम व प्रिज़र्वेटिव्स की जानकारी मिलेगी।"
    }
  },

  smart_fridge: {
    en: {
      title: "Smart Fridge & Voice Chef Guide",
      tagline: "Group Photo Multi-Item Recognition & Hands-Free Audio Recipes",
      summary: "Take photos of your fridge shelves or kitchen counter. AI detects all ingredients together, creates healthy zero-waste recipes, and reads steps aloud.",
      steps: [
        {
          number: 1,
          title: "Take a Group Photo of Ingredients",
          description: "Open fridge door or place items on counter (eggs, tomatoes, onions, milk, etc.) and snap a photo.",
          actionHint: "Click 'Live Camera Shelf Scan' or upload photo."
        },
        {
          number: 2,
          title: "Review Detected Ingredients List",
          description: "AI recognizes multiple items simultaneously into editable badges. Add or remove items as needed.",
          actionHint: "Check the ingredients tag list."
        },
        {
          number: 3,
          title: "Generate Zero-Waste Recipes",
          description: "Click 'Generate Healthy Recipes' to synthesize dishes matching your calorie budget.",
          actionHint: "Click 'Generate Healthy Recipes'."
        },
        {
          number: 4,
          title: "Listen to Voice Chef Cooking Steps",
          description: "Choose a recipe and click 'Listen to Step-by-Step Cooking' for hands-free audio narration.",
          actionHint: "Tap 'Listen to Recipe' to start voice playback."
        }
      ],
      tips: [
        "Turn on kitchen lights so lower shelves are well illuminated.",
        "Spread ingredients slightly so overlapping vegetables are visible."
      ],
      example: "Snapping eggs, tomato, and onion suggests 'Kerala Egg Roast' in 15 mins with exact calories and spoken cooking instructions."
    },
    en_ml: {
      title: "Smart Fridge Guide • സ്മാർട്ട് ഫ്രിഡ്ജ് ഗൈഡ്",
      tagline: "Group photo recipe chef • ഗ്രൂപ്പ് ഫോട്ടോ പാചകക്കുറിപ്പ്",
      summary: "Recognizes all fridge items from one photo • ഒരു ഫോട്ടോയിൽ നിന്ന് ഫ്രിഡ്ജിലെ എല്ലാ സാധനങ്ങളും തിരിച്ചറിയുന്നു.",
      steps: [
        {
          number: 1,
          title: "Snap Fridge Items • ഫോട്ടോ എടുക്കുക",
          description: "Take group photo of ingredients • ഫ്രിഡ്ജിലെ സാധനങ്ങളുടെ ഫോട്ടോ എടുക്കുക.",
          actionHint: "Use live camera or upload."
        },
        {
          number: 2,
          title: "Check Detected Items • ചേരുവകൾ പരിശോധിക്കുക",
          description: "Eggs, tomato, onion recognized together • എല്ലാ ചേരുവകളും ഒന്നിച്ച് ലിസ്റ്റ് ചെയ്യുന്നു.",
          actionHint: "Inspect detected tags."
        },
        {
          number: 3,
          title: "Generate Recipes • പാചകക്കുറിപ്പ് ഉണ്ടാക്കുക",
          description: "Synthesize healthy zero-waste dishes • വേസ്റ്റ് ആവാത്ത മികച്ച വിഭവങ്ങൾ ലഭിക്കുന്നു.",
          actionHint: "Click 'Generate Healthy Recipes'."
        },
        {
          number: 4,
          title: "Voice Chef Audio • വോയ്സ് ഷെഫ് കേൾക്കുക",
          description: "Hands-free spoken cooking guide • പാചകം ചെയ്യുമ്പോൾ നിർദ്ദേശങ്ങൾ വോയ്സിൽ കേൾക്കാം.",
          actionHint: "Tap 'Listen to Recipe'."
        }
      ],
      tips: [
        "Good light in fridge • നല്ല വെളിച്ചത്തിൽ ഫോട്ടോ എടുക്കുക.",
        "Separate items • സാധനങ്ങൾ മറയാതെ കാണിക്കുക."
      ],
      example: "E.g., Eggs + Tomato + Onion suggests 15-min Kerala Egg Roast with audio."
    },
    en_hi: {
      title: "Smart Fridge Guide • स्मार्ट फ्रिज गाइड",
      tagline: "Group ingredient photo & voice chef • सामग्री की फोटो व वॉयस रेसिपी",
      summary: "Detects all kitchen ingredients and creates healthy recipes • किचन में मौजूद सामान से पौष्टिक रेसिपी बनाता है।",
      steps: [
        {
          number: 1,
          title: "Take Fridge Photo • फ्रिज की फोटो लें",
          description: "Snap ingredients on shelves or counter • फ्रिज की सब्जियों और सामान की फोटो लें।",
          actionHint: "Click 'Live Camera' or upload."
        },
        {
          number: 2,
          title: "Review Ingredients • पहचानी गई सामग्री देखें",
          description: "AI recognizes multiple items together • सभी खाद्य पदार्थों की एक साथ सूची बनती है।",
          actionHint: "Check the ingredient badges."
        },
        {
          number: 3,
          title: "Generate Recipes • रेसिपी बनाएं",
          description: "Get zero-waste nutritious dishes • बची हुई चीजों से पौष्टिक रेसिपीज बनाएं।",
          actionHint: "Click 'Generate Recipes'."
        },
        {
          number: 4,
          title: "Listen to Voice Chef • वॉयस शेफ सुनें",
          description: "Spoken step-by-step cooking guide • बोलकर खाना पकाने में मदद करता है।",
          actionHint: "Tap 'Listen to Recipe'."
        }
      ],
      tips: [
        "Keep fridge well-lit • फ्रिज के अंदर पर्याप्त रोशनी रखें।"
      ],
      example: "अंडे और टमाटर की फोटो से 15 मिनट की त्वरित ऑमलेट करी का सुझाव।"
    },
    ml: {
      title: "സ്മാർട്ട് ഫ്രിഡ്ജും വോയ്സ് ഷെഫും - വഴികാട്ടി",
      tagline: "ഫ്രിഡ്ജിലെ സാധനങ്ങൾ ഫോട്ടോ എടുത്ത് വേസ്റ്റ് ആവാതെ സ്വാദിഷ്ടമായ വിഭവങ്ങൾ പാചകം ചെയ്യുക",
      summary: "നിങ്ങളുടെ ഫ്രിഡ്ജിന്റെ തട്ടുകളോ അടുക്കളയിൽ ബാക്കിയുള്ള സാധനങ്ങളോ ഒന്നിച്ച് ഒരു ഫോട്ടോ എടുത്താൽ (മുട്ട, തക്കാളി, ഉള്ളി, പാൽ മുതലായവ) അവയെല്ലാം ഒന്നിച്ച് തിരിച്ചറിഞ്ഞ് വിഭവങ്ങളും ശബ്ദ പാചകക്കുറിപ്പും നൽകുന്നു.",
      steps: [
        {
          number: 1,
          title: "ഫ്രിഡ്ജിലെ സാധനങ്ങളുടെ ഫോട്ടോ എടുക്കുക",
          description: "ഫ്രിഡ്ജ് തുറന്ന് തട്ടുകളുടെയോ അടുക്കളയിലുള്ള ചേരുവകളുടെയോ ഗ്രൂപ്പ് ഫോട്ടോ എടുക്കുക.",
          actionHint: "'Live Camera' അല്ലെങ്കിൽ 'Upload' ക്ലിക്ക് ചെയ്യുക."
        },
        {
          number: 2,
          title: "തിരിച്ചറിഞ്ഞ സാധനങ്ങൾ പരിശോധിക്കുക",
          description: "ചിത്രത്തിലുള്ള മുട്ട, തക്കാളി, സവാള തുടങ്ങിയവയെല്ലാം AI ഒന്നിച്ച് തിരിച്ചറിഞ്ഞ് ലിസ്റ്റ് ചെയ്യും.",
          actionHint: "ചേരുവകളുടെ ലിസ്റ്റ് നോക്കുക."
        },
        {
          number: 3,
          title: "ആരോഗ്യകരമായ വിഭവങ്ങൾ തയ്യാറാക്കുക",
          description: "'Generate Healthy Recipes' അമർത്തുമ്പോൾ ഭക്ഷണം പാഴാക്കാതെ ഉണ്ടാക്കാവുന്ന വിഭവങ്ങൾ ലഭിക്കും.",
          actionHint: "'Generate Healthy Recipes' ക്ലിക്ക് ചെയ്യുക."
        },
        {
          number: 4,
          title: "വോയ്സ് ഷെഫ് കേട്ടു പാചകം ചെയ്യുക",
          description: "വിഭവങ്ങൾ തിരഞ്ഞെടുത്ത് 'Listen to Step-by-Step Cooking' നൽകിയാൽ ഫോൺ തൊടാതെ കേട്ടു പാചകം ചെയ്യാം.",
          actionHint: "'Listen to Recipe' അമർത്തുക."
        }
      ],
      tips: [
        "ഫ്രിഡ്ജിൽ നല്ല വെളിച്ചം ഉള്ളപ്പോൾ ഫോട്ടോ എടുക്കുക.",
        "സാധനങ്ങൾ ഒന്നിനു പുറകിൽ ഒന്ന് മറഞ്ഞുപോവാതെ കാണിക്കുക."
      ],
      example: "ഉദാഹരണത്തിന്: മുട്ടയും തക്കാളിയും ഉള്ള ഫോട്ടോ എടുത്താൽ 15 മിനിറ്റിൽ ഉണ്ടാക്കാവുന്ന 'കേരള മുട്ട റോസ്റ്റ്' റെസിപ്പി വോയ്സ് സഹിതം ലഭിക്കും."
    },
    hi: {
      title: "स्मार्ट फ्रिज व वॉयस शेफ संपूर्ण गाइड",
      tagline: "फ्रिज की सामग्री की फोटो से जीरो-वेस्ट रेसिपी और बोलकर खाना पकाने में मदद",
      summary: "किचन में बची हुई सामग्रियों की फोटो से तुरंत स्वादिष्ट रेसिपी तैयार करता है और वॉयस शेफ बोलकर निर्देश देता है।",
      steps: [
        {
          number: 1,
          title: "सामग्री की फोटो लें",
          description: "फ्रिज के अंदर या किचन काउंटर पर रखी सामग्रियों की एक साथ फोटो लें।",
          actionHint: "कैमरा खोलें या फोटो अपलोड करें।"
        },
        {
          number: 2,
          title: "पहचानी गई सामग्री देखें",
          description: "एआई सभी चीजों की सूची बनाता है, जरूरत पड़ने पर आप और जोड़ सकते हैं।",
          actionHint: "सामग्री की लिस्ट देखें।"
        },
        {
          number: 3,
          title: "रेसिपी बनाएं",
          description: "'Generate Recipes' दबाकर पौष्टिक व्यंजनों की सूची देखें।",
          actionHint: "'Generate Recipes' पर क्लिक करें।"
        },
        {
          number: 4,
          title: "वॉयस शेफ से निर्देश सुनें",
          description: "बिना हाथ लगाए बोलकर खाना बनाने के निर्देश सुनें।",
          actionHint: "'Listen' बटन दबाएं।"
        }
      ],
      tips: [
        "सब्जियों और डिब्बों पर रोशनी अच्छी रखें।"
      ],
      example: "अंडे, प्याज और टमाटर से 15 मिनट की अंडा करी का सुझाव।"
    }
  },

  food_safety: {
    en: {
      title: "Food Safety Grievance Portal Guide",
      tagline: "Report Adulteration, Stale Food, & Hygiene Violations to FSSAI & District Authorities",
      summary: "Direct grievance redressal system with photographic evidence, unique tracking IDs, admin moderation, and official regulatory email notices.",
      steps: [
        {
          number: 1,
          title: "Fill Vendor Details & Incident Description",
          description: "Enter restaurant/shop name, city, district, and describe the violation (stale food, insect, expired goods, synthetic coloring).",
          actionHint: "Complete the Grievance Form."
        },
        {
          number: 2,
          title: "Upload Photo Evidence",
          description: "Upload photo of the contaminated dish, bill receipt, or product packaging.",
          actionHint: "Add clear photographic proof."
        },
        {
          number: 3,
          title: "Submit & Receive Tracking ID",
          description: "Receive an official tracking reference (e.g. #FSSAI-KL-2026-904).",
          actionHint: "Save your reference number."
        },
        {
          number: 4,
          title: "Admin Moderation & Authority Email Receipt",
          description: "Admin reviews case and approves dispatch notice. In demo mode, a full verified email dispatch receipt to FSSAI is displayed on screen.",
          actionHint: "View moderation status in the grievance log."
        }
      ],
      tips: [
        "Include the hotel bill or location receipt whenever possible.",
        "Take close-up photos of the foreign object or discoloration."
      ],
      example: "Reporting stale chicken curry in Kozhikode creates reference #FSSAI-KL-2026-904 with official email dispatch receipt to District Food Safety Officer."
    },
    en_ml: {
      title: "Food Safety Grievance Guide • പരാതി പരിഹാര ഗൈഡ്",
      tagline: "Report adulteration to FSSAI • മായം കലർന്ന ഭക്ഷണത്തിനെതിരെ പരാതി നൽകാം",
      summary: "Direct redressal for stale food and hygiene issues • പഴകിയ ഭക്ഷണത്തിനെതിരെ ഉദ്യോഗസ്ഥർക്ക് നേരിട്ട് പരാതി നൽകുക.",
      steps: [
        {
          number: 1,
          title: "Enter Vendor Details • കടയുടെ വിവരങ്ങൾ നൽകുക",
          description: "Hotel name, location, violation details • സ്ഥാപനത്തിന്റെ പേരും സ്ഥലവും പരാതിയുടെ കാരണവും നൽകുക.",
          actionHint: "Fill out grievance form."
        },
        {
          number: 2,
          title: "Upload Photo Proof • ഫോട്ടോ തെളിവ് നൽകുക",
          description: "Upload photo of food or bill • ഭക്ഷണത്തിന്റെയോ ബില്ലിന്റെയോ ഫോട്ടോ നൽകുക.",
          actionHint: "Add photo evidence."
        },
        {
          number: 3,
          title: "Get Tracking ID • ട്രാക്കിംഗ് ഐ.ഡി നേടുക",
          description: "Receive unique reference number • യുണീക്ക് റഫറൻസ് നമ്പർ ലഭിക്കുന്നു.",
          actionHint: "Save your ID."
        },
        {
          number: 4,
          title: "Admin Approval & Mail • അഡ്മിൻ അനുമതിയും മെയിലും",
          description: "Official email dispatch notice prepared • അഡ്മിൻ അപ്രൂവ് ചെയ്യുമ്പോൾ മെയിൽ രസീത് ലഭിക്കും.",
          actionHint: "Check dispatch receipt."
        }
      ],
      tips: [
        "Include hotel cash bill • ഹോട്ടൽ ബിൽ ഉൾപ്പെടുത്തുക.",
        "Clear photo of adulteration • വ്യക്തമായ ഫോട്ടോ നൽകുക."
      ],
      example: "E.g., Stale food complaint in Kozhikode generates #FSSAI-KL-2026-904 with email receipt to Food Safety Officer."
    },
    en_hi: {
      title: "Food Safety Portal Guide • खाद्य सुरक्षा गाइड",
      tagline: "Report adulteration to FSSAI • मिलावटी भोजन की शिकायत दर्ज करें",
      summary: "Direct grievance system with photo proof and official email dispatch • फोटो सबूत के साथ सीधे अधिकारियों को शिकायत भेजें।",
      steps: [
        {
          number: 1,
          title: "Fill Restaurant Details • दुकान/होटल का विवरण दें",
          description: "Vendor name, city, and complaint details • होटल का नाम, शहर व शिकायत का विवरण लिखें।",
          actionHint: "Fill the form."
        },
        {
          number: 2,
          title: "Upload Photo Proof • फोटो सबूत अपलोड करें",
          description: "Upload food or bill picture • खराब भोजन या बिल की फोटो लगाएं।",
          actionHint: "Attach photo."
        },
        {
          number: 3,
          title: "Get Reference ID • ट्रैकिंग आईडी प्राप्त करें",
          description: "Unique tracking number generated • आधिकारिक संदर्भ संख्या प्राप्त करें।",
          actionHint: "Note reference ID."
        },
        {
          number: 4,
          title: "Admin Approval & Email • एडमिन स्वीकृति व ईमेल",
          description: "Official email dispatch receipt generated • खाद्य सुरक्षा अधिकारी को ईमेल प्रेषण की रसीद।",
          actionHint: "View dispatch receipt."
        }
      ],
      tips: [
        "Always attach the bill receipt • होटल का बिल जरूर लगाएं।"
      ],
      example: "बासी भोजन की शिकायत पर तुरंत FSSAI संदर्भ संख्या और ईमेल रसीद तैयार होती है।"
    },
    ml: {
      title: "ഭക്ഷണ സുരക്ഷാ പരാതി പരിഹാര ഗൈഡ്",
      tagline: "ഭക്ഷണത്തിലെ മായം, പഴകിയ ഭക്ഷണം എന്നിവയെക്കുറിച്ച് ഉദ്യോഗസ്ഥർക്ക് നേരിട്ട് പരാതി നൽകാം",
      summary: "ഹോട്ടലുകളിലെ പഴകിയ ഭക്ഷണം, മായം, പ്രാണികൾ, കൃത്രിമ നിറങ്ങൾ എന്നിവയെക്കുറിച്ച് പൊതുജനങ്ങൾക്ക് ഫോട്ടോ സഹിതം നേരിട്ട് പരാതി നൽകാനുള്ള സംവിധാനം.",
      steps: [
        {
          number: 1,
          title: "സ്ഥാപനത്തിന്റെ വിവരങ്ങളും പരാതിയും നൽകുക",
          description: "ഹോട്ടലിന്റെ പേര്, സ്ഥലം, ജില്ല, പരാതിയുടെ കാരണം (പഴകിയ ഭക്ഷണം, മായം, പുഴു/പ്രാണി, എക്സ്പെയറി കഴിഞ്ഞത്) എന്നിവ നൽകുക.",
          actionHint: "പരാതി ഫോം പൂരിപ്പിക്കുക."
        },
        {
          number: 2,
          title: "ഫോട്ടോ തെളിവുകൾ അപ്‌ലോഡ് ചെയ്യുക",
          description: "ഭക്ഷണത്തിലെ മായമോ ഹോട്ടൽ ബില്ലോ വ്യക്തമായി കാണുന്ന ഫോട്ടോ നൽകുക.",
          actionHint: "ഫോട്ടോ തെളിവ് ചേർക്കുക."
        },
        {
          number: 3,
          title: "ട്രാക്കിംഗ് ഐ.ഡി നേടുക",
          description: "പരാതി സമർപ്പിക്കുമ്പോൾ ഒരു യുണീക്ക് റഫറൻസ് നമ്പർ (#FSSAI-KL-2026-xxx) ലഭിക്കും.",
          actionHint: "നമ്പർ കുറിച്ചുവെക്കുക."
        },
        {
          number: 4,
          title: "അഡ്മിൻ പരിശോധനയും മെയിൽ രസീതും",
          description: "അഡ്മിൻ പരിശോധിച്ച് അപ്രൂവൽ നൽകിയാൽ ജില്ലാ ഫുഡ് സേഫ്റ്റി ഓഫീസർക്കുള്ള ഔദ്യോഗിക മെയിൽ രസീത് സ്ക്രീനിൽ തയ്യാറാകും.",
          actionHint: "അപ്രൂവൽ നില പരിശോധിക്കുക."
        }
      ],
      tips: [
        "ഹോട്ടൽ ക്യാഷ് ബില്ലിന്റെ ഫോട്ടോ നിർബന്ധമായും ഉൾപ്പെടുത്താൻ ശ്രമിക്കുക.",
        "ഭക്ഷണത്തിലെ മായം വ്യക്തമായി കാണുന്ന ക്ലോസ്-അപ്പ് ഫോട്ടോ നൽകുക."
      ],
      example: "ഉദാഹരണത്തിന്: കോഴിക്കോട് ഒരു കടയിൽ നിന്ന് പഴകിയ ബിരിയാണി ലഭിച്ചാൽ പരാതി നൽകാം, അഡ്മിൻ അപ്രൂവ് ചെയ്താൽ ജില്ലാ ഫുഡ് സേഫ്റ്റി ഓഫീസർക്കുള്ള മെയിൽ രസീത് സ്ക്രീനിൽ കാണിക്കും."
    },
    hi: {
      title: "खाद्य सुरक्षा शिकायत पोर्टल गाइड",
      tagline: "मिलावट और बासी खाने की शिकायत सीधे FSSAI व खाद्य सुरक्षा अधिकारियों को भेजें",
      summary: "होटल या रेस्टोरेंट में मिलने वाले मिलावटी, बासी या अस्वच्छ भोजन की तस्वीर सहित आधिकारिक शिकायत दर्ज करने का पोर्टल।",
      steps: [
        {
          number: 1,
          title: "दुकान/रेस्टोरेंट का विवरण भरें",
          description: "दुकान का नाम, शहर, पता और शिकायत का कारण (बासी खाना, मिलावट, एक्सपायरी आदि) दर्ज करें।",
          actionHint: "शिकायत फॉर्म पूरा करें।"
        },
        {
          number: 2,
          title: "फोटो सबूत अपलोड करें",
          description: "खराब भोजन या कैश बिल की साफ फोटो अपलोड करें।",
          actionHint: "फोटो सबूत जोड़ें।"
        },
        {
          number: 3,
          title: "ट्रैकिंग आईडी प्राप्त करें",
          description: "शिकायत दर्ज होते ही आपको एक यूनीक संदर्भ संख्या (#FSSAI-KL-2026-xxx) मिलेगी।",
          actionHint: "आईडी सुरक्षित रखें।"
        },
        {
          number: 4,
          title: "एडमिन अप्रूवल और ईमेल प्रेषण",
          description: "एडमिन द्वारा स्वीकृत होने पर संबंधित खाद्य सुरक्षा अधिकारी को ईमेल भेजने की रसीद तैयार होती है।",
          actionHint: "प्रेषण रसीद देखें।"
        }
      ],
      tips: [
        "दुकान का कैश बिल जरूर लगाएं।",
        "खराब भोजन की स्पष्ट फोटो लें।"
      ],
      example: "बासी खाने की शिकायत पर सीधे FSSAI संदर्भ संख्या जनरेट होती है।"
    }
  }
};
