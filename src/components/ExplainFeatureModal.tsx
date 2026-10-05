"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  HelpCircle,
  Camera,
  ScanBarcode,
  Refrigerator,
  Dumbbell,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Globe
} from "lucide-react";

import { AppLanguage, LANGUAGE_OPTIONS } from "@/lib/translations";

export type FeatureType =
  | "meal_scanner"
  | "packaged_food"
  | "smart_fridge"
  | "diet_dashboard"
  | "exercise_engine"
  | "food_safety";

interface ExplainFeatureModalProps {
  isOpen: boolean;
  feature: FeatureType | null;
  onClose: () => void;
  onNavigateToFeature?: (feature: FeatureType) => void;
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
}

interface LanguageContent {
  title: string;
  tagline: string;
  purpose: string;
  whatToProvide: string[];
  howItWorks: string[];
  stepByStep: string[];
  accuracyTips: string[];
  exampleResult: string;
}

const FEATURE_DATA: Record<FeatureType, {
  icon: any;
  colorClass: string;
  badgeBg: string;
  en: LanguageContent;
  ml: LanguageContent;
  hi: LanguageContent;
}> = {
  meal_scanner: {
    icon: Camera,
    colorClass: "text-emerald-400 border-emerald-500/30",
    badgeBg: "bg-emerald-500/20 text-emerald-300",
    en: {
      title: "AI Meal Photo Recognition (Live Camera & Upload)",
      tagline: "Instant visual intelligence for cooked dishes, fruits, teas, and mixed plates",
      purpose: "Analyzes photos of your meals using computer vision trained on 15,960+ regional Kerala, Indian, and international foods to compute calories, sugar, macros, glycemic index, and diabetic safety.",
      whatToProvide: [
        "A clear photo taken via Live Camera or file upload (tea, coffee, apple, rice meals, snacks, curry, etc.)",
        "Or type the name/ingredients manually if you don't have a photo."
      ],
      howItWorks: [
        "1. Computer Vision detects key food items, portion estimates, and ingredients.",
        "2. Cross-references our clinical Indian nutrition database for exact calories, sugar, carbs, and fat.",
        "3. Computes Glycemic Index and flags diabetic safety (e.g. alerts high sugar in tea or rice).",
        "4. Food Consumption Guard activates: confirms if you actually ate it before adding to calorie budget."
      ],
      stepByStep: [
        "Click 'Live Camera' or 'Upload Food Photo'.",
        "Point camera at plate/cup with good lighting and click Capture.",
        "Wait 2 seconds while AI processes the visual attributes.",
        "Review nutritional card (Calories, Sugar, Protein, Glycemic Index).",
        "Choose: 'Yes, I ate this' (adds to daily intake) or 'Just previewing' (does not add)."
      ],
      accuracyTips: [
        "Ensure good overhead lighting to clearly reveal texture (e.g. distinguish tea vs black tea vs coffee).",
        "Capture the entire plate or cup in frame.",
        "For multi-item thali/meals, keep individual dishes visible."
      ],
      exampleResult: "E.g., Snapping 'Kattan Chaya' detects ~48 kcal with 10.2g sugar alert; snapping 'Kerala Puttu + Kadala' detects ~360 kcal, 12.5g protein, and high satiety rating."
    },
    ml: {
      title: "AI മീൽ ഫോട്ടോ സ്കാനർ (ലൈവ് ക്യാമറ & അപ്‌ലോഡ്)",
      tagline: "ഭക്ഷണത്തിന്റെയും ചായ, കാപ്പി, പഴങ്ങൾ എന്നിവയുടെയും കൃത്യമായ പോഷക വിവരങ്ങൾ",
      purpose: "നിങ്ങൾ കഴിക്കുന്ന ഭക്ഷണത്തിന്റെ ഫോട്ടോ എടുത്താൽ (ചായ, കാപ്പി, ആപ്പിൾ, ചോറ്, കറികൾ, പുട്ട് മുതലായവ) കമ്പ്യൂട്ടർ വിഷൻ വഴി പരിശോധിച്ച് കലോറി, പഞ്ചസാരയുടെ അളവ്, പ്രോട്ടീൻ, പ്രമേഹ രോഗികൾക്ക് സുരക്ഷിതമാണോ എന്നെല്ലാം കൃത്യമായി കണ്ടെത്തുന്ന സംവിധാനം.",
      whatToProvide: [
        "ലൈവ് ക്യാമറ വഴിയോ ഗാലറിയിൽ നിന്നോ ഭക്ഷണത്തിന്റെ വ്യക്തമായ ഫോട്ടോ.",
        "അല്ലെങ്കിൽ ഭക്ഷണത്തിന്റെ പേര് നേരിട്ട് ടൈപ്പ് ചെയ്യാം."
      ],
      howItWorks: [
        "1. കമ്പ്യൂട്ടർ വിഷൻ ഭക്ഷണത്തിന്റെ ഘടനയും അളവും വേർതിരിച്ചറിയുന്നു.",
        "2. ക്ലിനിക്കൽ ഇന്ത്യൻ ന്യൂട്രീഷൻ ഡാറ്റാബേസുമായി ഒത്തുനോക്കി കലോറിയും പഞ്ചസാരയും കണക്കാക്കുന്നു.",
        "3. ഗ്ലൈസെമിക് ഇൻഡക്സും പ്രമേഹ രോഗികൾക്കുള്ള സുരക്ഷയും തിട്ടപ്പെടുത്തുന്നു.",
        "4. 'നിങ്ങൾ ഈ ഭക്ഷണം കഴിച്ചോ?' എന്ന് സ്ഥിരീകരിച്ച ശേഷം മാത്രമേ നിങ്ങളുടെ ദൈനംദിന കലോറി കണക്കിലേക്ക് ചേർക്കൂ."
      ],
      stepByStep: [
        "'Live Camera' അല്ലെങ്കിൽ 'Upload Food Photo' ക്ലിക്ക് ചെയ്യുക.",
        "ഭക്ഷണത്തിന് നേരെ ക്യാമറ വെച്ച് ഫോട്ടോ എടുക്കുക.",
        "2 സെക്കൻഡിനുള്ളിൽ AI പൂർണ്ണ പോഷക വിവരങ്ങൾ കാണിക്കും.",
        "'ഭക്ഷണം കഴിച്ചു' (Yes, I Ate This) എന്ന് നൽകിയാൽ ഇന്നത്തെ ഡയറ്റിലേക്ക് ചേരും.",
        "വെറുതെ നോക്കിയതാണെങ്കിൽ 'Just Checking' നൽകിയാൽ ഡയറ്റിൽ കൂട്ടാതെ സൂക്ഷിക്കും."
      ],
      accuracyTips: [
        "നല്ല വെളിച്ചത്തിൽ ഫോട്ടോ എടുക്കുക (ചായ, കാപ്പി എന്നിവ എളുപ്പം തിരിച്ചറിയാൻ).",
        "പ്ലേറ്റിലെ പ്രധാന ഭക്ഷണങ്ങൾ വ്യക്തമായി കാണണം.",
        "ഒന്നിലധികം വിഭവങ്ങൾ ഉള്ളപ്പോൾ പ്ലേറ്റ് മുഴുവനായും ഉൾക്കൊള്ളിക്കുക."
      ],
      exampleResult: "ഉദാഹരണത്തിന്: കട്ടൻ ചായയുടെ ഫോട്ടോ എടുത്താൽ ~48 kcal കലോറിയും 10.2g പഞ്ചസാരയും കാണിച്ച് മുന്നറിയിപ്പ് നൽകും. പുട്ടും കടലയും എടുത്താൽ ~360 kcal, 12.5g പ്രോട്ടീൻ കണക്കാക്കും."
    },
    hi: {
      title: "एआई भोजन फोटो स्कैनर (लाइव कैमरा व अपलोड)",
      tagline: "पके हुए भोजन, फल, चाय और थाली का त्वरित पोषण विश्लेषण",
      purpose: "यह टूल आपके भोजन की तस्वीर (चाय, कॉफी, सेब, चावल, करी आदि) को स्कैन करके तुरंत कैलोरी, चीनी, प्रोटीन, ग्लाइसेमिक इंडेक्स और डायबिटिक सुरक्षा की गणना करता है।",
      whatToProvide: [
        "लाइव कैमरे या गैलरी से भोजन की स्पष्ट तस्वीर।",
        "या भोजन का नाम मैन्युअल रूप से टाइप करें।"
      ],
      howItWorks: [
        "1. कंप्यूटर विज़न भोजन की पहचान और मात्रा का अनुमान लगाता है।",
        "2. भारतीय पोषण डेटाबेस से सटीक कैलोरी और शुगर की गणना होती है।",
        "3. यह तय करता है कि भोजन डायबिटीज़ के लिए सुरक्षित है या नहीं।",
        "4. 'क्या आपने यह खाया?' पूछकर ही इसे आपके दैनिक कैलोरी बजट में जोड़ता है।"
      ],
      stepByStep: [
        "'Live Camera' या 'Upload' बटन दबाएं।",
        "अच्छी रोशनी में भोजन की तस्वीर खींचें।",
        "2 सेकंड में संपूर्ण पोषण रिपोर्ट देखें।",
        "'हाँ, मैंने खाया' पर क्लिक करने पर ही कैलोरी जोड़ी जाएगी।"
      ],
      accuracyTips: [
        "पर्याप्त रोशनी रखें ताकि पेय पदार्थों (चाय/कॉफी) का रंग साफ दिखे।",
        "थाली को पूरी तरह से फ्रेम में रखें।"
      ],
      exampleResult: "उदाहरण: सेब की तस्वीर लेने पर ~95 kcal व प्राकृतिक फाइबर बताएगा, वहीं मीठी चाय पर उच्च शुगर की चेतावनी देगा।"
    }
  },

  packaged_food: {
    icon: ScanBarcode,
    colorClass: "text-amber-400 border-amber-500/30",
    badgeBg: "bg-amber-500/20 text-amber-300",
    en: {
      title: "Packaged Food, Barcode & Additives Scanner",
      tagline: "Scan ingredients and barcodes to detect toxic E-numbers and hidden sugars",
      purpose: "Decodes chemical additives (E-numbers), trans-fats, and hidden sugars in packaged snacks, beverages, and groceries. Gives an instant health safety score (Safe, Caution, or Dangerous).",
      whatToProvide: [
        "Barcode number (e.g. 8901030383701) OR photo of the product/ingredient list.",
        "Or scan using live camera overlay on packaging."
      ],
      howItWorks: [
        "1. Identifies product from database of 350,000+ Indian packaged consumer items.",
        "2. Runs OCR/Text detection on chemical additive codes (E621 MSG, E102, E150d, palm oil, HFCS).",
        "3. Evaluates clinical toxicity, cancer risks, hyperactivity warnings, and diabetic safety.",
        "4. Confirms consumption decision before updating sugar and calorie metrics."
      ],
      stepByStep: [
        "Enter product barcode or upload image of product label/ingredients.",
        "Click 'Analyze Packaged Food'.",
        "Inspect Safety Grade (A / B / C / D / Hazard).",
        "Read highlighted harmful additives with medical explanations.",
        "Confirm if consumed, or discard if testing in supermarket."
      ],
      accuracyTips: [
        "Take a close, sharp photo of the 'Ingredients' list on the back of the packet.",
        "Avoid glare from plastic packaging."
      ],
      exampleResult: "Scanning potato chips highlights E621 (Monosodium Glutamate) & high palm oil fat; scanning instant noodles flags synthetic flavor enhancers."
    },
    ml: {
      title: "പാക്കറ്റ് ഭക്ഷണവും രാസവസ്തു (E-നമ്പർ) സ്കാനറും",
      tagline: "പാക്കറ്റുകളിലെ അപകടകരമായ കെമിക്കലുകളും ഒളിഞ്ഞിരിക്കുന്ന പഞ്ചസാരയും കണ്ടെത്തുക",
      purpose: "ബിസ്കറ്റ്, ചിപ്സ്, ശീതളപാനീയങ്ങൾ തുടങ്ങിയ പാക്കറ്റ് ഭക്ഷണങ്ങളിലെ അപകടകരമായ പ്രിസർവേറ്റീവുകൾ, E-നമ്പറുകൾ (E621 MSG, ടാർട്രാസിൻ, പാം ഓയിൽ), ഒളിഞ്ഞിരിക്കുന്ന മധുരം എന്നിവ പരിശോധിച്ച് സുരക്ഷാ റേറ്റിംഗ് നൽകുന്നു.",
      whatToProvide: [
        "പാക്കറ്റിലെ ബാർകോഡ് നമ്പർ അല്ലെങ്കിൽ പാക്കറ്റിന്റെ ചേരുവകൾ (Ingredients) കാണിക്കുന്ന ഫോട്ടോ.",
        "ലൈവ് ക്യാമറ ഉപയോഗിച്ചും ബാർകോഡ് സ്കാൻ ചെയ്യാം."
      ],
      howItWorks: [
        "1. 3,50,000+ ഇന്ത്യൻ ഉൽപ്പന്നങ്ങളുടെ ലിസ്റ്റിൽ നിന്ന് വിവരങ്ങൾ കണ്ടെത്തുന്നു.",
        "2. ചേരുവകളിലെ E-നമ്പറുകൾ (കെമിക്കൽ കോഡുകൾ) വിശകലനം ചെയ്യുന്നു.",
        "3. അലർജി, പ്രമേഹം, അർബുദ സാധ്യത എന്നിവ പരിശോധിക്കുന്നു.",
        "4. ഉൽപ്പന്നം സുരക്ഷിതമാണോ (Safe, Caution, Danger) എന്ന് ഗ്രേഡിംഗ് നൽകുന്നു."
      ],
      stepByStep: [
        "ബാർകോഡ് ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ പാക്കറ്റിന്റെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
        "'Analyze Packaged Food' ക്ലിക്ക് ചെയ്യുക.",
        "സുരക്ഷാ ഗ്രേഡും അപകടകരമായ ചേരുവകളും വായിച്ചു മനസ്സിലാക്കുക.",
        "ഭക്ഷണം കഴിച്ചെങ്കിൽ മാത്രം 'Consumed' നൽകുക, അല്ലെങ്കിൽ ഒഴിവാക്കുക."
      ],
      accuracyTips: [
        "പാക്കറ്റിന്റെ പുറകിലെ 'Ingredients' ഭാഗം വ്യക്തമായി ഫോട്ടോ എടുക്കുക.",
        "പ്ലാസ്റ്റിക് കവറിലെ വെളിച്ച പ്രതിഫലനം ഒഴിവാക്കുക."
      ],
      exampleResult: "ഉദാഹരണത്തിന്: ചിപ്സ് സ്കാൻ ചെയ്യുമ്പോൾ അതിലെ E621 (MSG) പ്രിസർവേറ്റീവും പാം ഓയിലും കണ്ടെത്തി ആരോഗ്യത്തിന് ഹാനികരമെന്ന് മുന്നറിയിപ്പ് തരും."
    },
    hi: {
      title: "पैकेज्ड फूड, बारकोड व केमिकल एडिटिव्स स्कैनर",
      tagline: "हानिकारक E-नंबर और छुपी हुई चीनी का तुरंत पता लगाएं",
      purpose: "पैकेज्ड फूड्स में मौजूद खतरनाक रासायनिक एडिटिव्स (E-नंबर्स), पाम ऑयल और चीनी की जांच करके सुरक्षा स्कोर प्रदान करता है।",
      whatToProvide: [
        "बारकोड नंबर या पैकेट के सामग्री (Ingredients) की फोटो।"
      ],
      howItWorks: [
        "1. उत्पाद के अवयवों और एडिटिव्स का विश्लेषण करता है।",
        "2. स्वास्थ्य व एलर्जी खतरों (जैसे E621, E102) की पहचान करता है।",
        "3. डायबिटीज़ और हृदय स्वास्थ्य के लिए ग्रेडिंग देता है।"
      ],
      stepByStep: [
        "बारकोड डालें या पैकेट की फोटो अपलोड करें।",
        "जांच परिणाम में सुरक्षा चेतावनी और एडिटिव्स देखें।"
      ],
      accuracyTips: [
        "पैकेट के पीछे लिखी 'Ingredients' सूची की साफ फोटो लें।"
      ],
      exampleResult: "नमकीन पैकेट स्कैन करने पर अत्यधिक सोडियम व प्रिज़र्वेटिव्स की सीधी जानकारी मिलेगी।"
    }
  },

  smart_fridge: {
    icon: Refrigerator,
    colorClass: "text-cyan-400 border-cyan-500/30",
    badgeBg: "bg-cyan-500/20 text-cyan-300",
    en: {
      title: "Smart Fridge & Voice Chef Assistant",
      tagline: "Group item photo recognition and hands-free spoken cooking guide",
      purpose: "Take a photo of your refrigerator shelves or a group of ingredients on your kitchen counter. AI detects all available vegetables, dairy, and grains, synthesizes healthy recipes to eliminate food waste, and guides you with interactive voice commands.",
      whatToProvide: [
        "A photo of your fridge shelf or group of ingredients (e.g. tomatoes, onions, eggs, milk, curd).",
        "Or type the ingredients you have available separated by commas."
      ],
      howItWorks: [
        "1. Computer Vision performs multi-object detection across the image simultaneously.",
        "2. Identifies all edible items and assesses combination compatibility.",
        "3. Generates zero-waste nutritious recipes tailored to your dietary goals.",
        "4. Voice Chef speaks the recipe steps out loud with hands-free playback."
      ],
      stepByStep: [
        "Snap a photo of your fridge or counter ingredients.",
        "Click 'Analyze Fridge Items'. AI detects all items into an editable tag list.",
        "Add or adjust any detected ingredients.",
        "Click 'Generate Healthy Recipes'.",
        "Pick a recipe and click 'Listen to Step-by-Step Cooking' for voice narration."
      ],
      accuracyTips: [
        "Open fridge doors wide and turn on kitchen lights to avoid dark shelf shadows.",
        "Separate items slightly on the counter so overlapping vegetables are all visible."
      ],
      exampleResult: "Taking a picture with eggs, tomato, and onion suggests 'Kerala Style Egg Roast with Onion Tomato Gravy' with exact prep time, calories, and spoken recipe."
    },
    ml: {
      title: "സ്മാർട്ട് ഫ്രിഡ്ജും വോയ്സ് ഷെഫും",
      tagline: "ഫ്രിഡ്ജിലെ ചേരുവകൾ ഫോട്ടോ എടുത്ത് വേസ്റ്റ് ആവാതെ സ്വാദിഷ്ടമായ വിഭവങ്ങൾ പാചകം ചെയ്യുക",
      purpose: "നിങ്ങളുടെ ഫ്രിഡ്ജിന്റെ തട്ടുകളോ അടുക്കളയിൽ ബാക്കിയുള്ള സാധനങ്ങളോ ഒന്നിച്ച് ഒരു ഫോട്ടോ എടുത്താൽ (മുട്ട, തക്കാളി, ഉള്ളി, പാൽ, പച്ചക്കറികൾ മുതലായവ) അവയെല്ലാം ഒന്നിച്ച് തിരിച്ചറിഞ്ഞ് ആഹാരം പാഴാക്കാതെ ഉണ്ടാക്കാവുന്ന ആരോഗ്യകരമായ വിഭവങ്ങളും ശബ്ദ സന്ദേശത്തോടെയുള്ള പാചകക്കുറിപ്പും നൽകുന്നു.",
      whatToProvide: [
        "ഫ്രിഡ്ജിന്റെ തട്ടുകളുടെയോ അടുക്കളയിലുള്ള ചേരുവകളുടെയോ ഗ്രൂപ്പ് ഫോട്ടോ.",
        "അല്ലെങ്കിൽ നിങ്ങളുടെ പക്കലുള്ള സാധനങ്ങളുടെ പേര് ടൈപ്പ് ചെയ്യാം."
      ],
      howItWorks: [
        "1. മൾട്ടിപ്പിൾ ഒബ്ജക്റ്റ് ഡിറ്റക്ഷൻ വഴി ചിത്രത്തിലുള്ള എല്ലാ സാധനങ്ങളും ഒരേസമയം കണ്ടെത്തുന്നു.",
        "2. അവ കൂട്ടിച്ചേർത്ത് ഉണ്ടാക്കാവുന്ന മികച്ച വിഭവങ്ങളുടെ പാചകക്കുറിപ്പ് തയ്യാറാക്കുന്നു.",
        "3. നിങ്ങൾ തിരഞ്ഞെടുത്ത വിഭവം ഉണ്ടാക്കുന്ന വിധം സ്പീക്കറിലൂടെ പറഞ്ഞുതരുന്നു (Hands-free Voice Chef)."
      ],
      stepByStep: [
        "ഫ്രിഡ്ജിലെ സാധനങ്ങളുടെ ഫോട്ടോ എടുക്കുക.",
        "'Analyze Fridge Items' ക്ലിക്ക് ചെയ്യുക (എല്ലാ ചേരുവകളും ലിസ്റ്റ് ചെയ്യപ്പെടും).",
        "'Generate Healthy Recipes' അമർത്തുക.",
        "വിഭവങ്ങൾ കണ്ട് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക, ശേഷം വോയ്സ് അസിസ്റ്റന്റ് വഴി കേട്ടു പാചകം ചെയ്യുക."
      ],
      accuracyTips: [
        "നല്ല വെളിച്ചത്തിൽ ഫോട്ടോ എടുക്കുക.",
        "സാധനങ്ങൾ ഒന്നിനു പുറകിൽ ഒന്ന് മറഞ്ഞുപോവാതെ കാണത്തക്കവിധം ഫോട്ടോ എടുക്കുക."
      ],
      exampleResult: "ഉദാഹരണത്തിന്: മുട്ട, തക്കാളി, സവാള എന്നിവയുള്ള ഫോട്ടോ എടുത്താൽ 'കേരള മുട്ട റോസ്റ്റ്' ഉണ്ടാക്കുന്ന വിധവും കലോറിയും ശബ്ദത്തിൽ പറഞ്ഞുതരും."
    },
    hi: {
      title: "स्मार्ट फ्रिज व वॉयस शेफ असिस्टेंट",
      tagline: "फ्रिज की सामग्री से जीरो-वेस्ट स्वादिष्ट रेसिपी और बोलकर खाना पकाने में मदद",
      purpose: "अपने फ्रिज या किचन में मौजूद सामान की तस्वीर लें। एआई सभी सामग्रियों को पहचानकर बची हुई चीजों से पौष्टिक रेसिपी बनाता है और बोलकर खाना पकाने में मदद करता है।",
      whatToProvide: [
        "फ्रिज या उपलब्ध सामग्रियों की तस्वीर या नाम।"
      ],
      howItWorks: [
        "1. फोटो में मौजूद सभी खाद्य पदार्थों की एक साथ पहचान करता है।",
        "2. आपके स्वास्थ्य लक्ष्य के अनुसार पौष्टिक रेसिपी तैयार करता है।",
        "3. वॉयस शेफ बोलकर हर स्टेप बताता है।"
      ],
      stepByStep: [
        "फ्रिज या काउंटर की फोटो लें।",
        "'Generate Recipes' दबाएं और अपनी मनपसंद रेसिपी चुनें।",
        "वॉयस असिस्टेंट ऑन करके बिना हाथ लगाए निर्देश सुनें।"
      ],
      accuracyTips: [
        "फ्रिज के अंदर पर्याप्त रोशनी रखें ताकि सभी डिब्बे और सब्जियां साफ दिखें।"
      ],
      exampleResult: "अंडे और टमाटर की फोटो लेने पर 15 मिनट में बनने वाली त्वरित ऑमलेट करी का सुझाव।"
    }
  },

  diet_dashboard: {
    icon: Activity,
    colorClass: "text-emerald-400 border-emerald-500/30",
    badgeBg: "bg-emerald-500/20 text-emerald-300",
    en: {
      title: "Clinical Diet Dashboard & AI Meal Planner",
      tagline: "Precision calorie deficit, sugar limits, and adaptive 4-meal daily routines",
      purpose: "Calculates your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the clinical Mifflin-St Jeor formula. Generates personalized breakfast, lunch, snack, and dinner plans with 1-click category updates.",
      whatToProvide: [
        "Your body metrics: Age, Gender, Weight, Height, Daily Activity level, and Goal (Weight Loss, Muscle Gain, Diabetic Care, Balanced Health).",
        "Logged meals throughout the day (consumed vs planned)."
      ],
      howItWorks: [
        "1. Computes exact daily maintenance calories and required deficit or surplus.",
        "2. Enforces strict clinical sugar ceiling (e.g. 20g/day for diabetic prevention).",
        "3. Formulates 4 routine meals (Breakfast, Lunch, Snack, Dinner) matching your macro split.",
        "4. Lets you switch categories (e.g. from Weight Loss to Muscle Gain) and instantly refreshes meals."
      ],
      stepByStep: [
        "Ensure your health profile details are entered.",
        "View today's Calorie Deficit Progress bar, Sugar Gauge, and Diet Health Score.",
        "In 'AI Meal Plan', change category tabs (Weight Loss, Diabetic Care, Muscle Gain) anytime.",
        "Click 'Refresh AI Meals Plan' to rotate meal variations.",
        "Click 'Ate This' on any recommended meal to log it immediately."
      ],
      accuracyTips: [
        "Keep your weight updated in the profile as you progress.",
        "Log each meal right after eating to maintain accurate real-time sugar tracking."
      ],
      exampleResult: "A 70kg user targeting Weight Loss receives an 1850 kcal target with Appam/Puttu breakfast, Fish Curry lunch, Green Tea snack, and Vegetable Oats dinner."
    },
    ml: {
      title: "ക്ലിനിക്കൽ ഡയറ്റ് ഡാഷ്‌ബോർഡും AI മീൽ പ്ലാനറും",
      tagline: "കൃത്യമായ കലോറി ബജറ്റ്, പഞ്ചസാര പരിധി, കാറ്റഗറി അടിസ്ഥാനമാക്കിയുള്ള 4 നേരത്തെ ഭക്ഷണക്രമം",
      purpose: "നിങ്ങളുടെ പ്രായം, ഉയരം, ഭാരം, ലക്ഷ്യം (തടി കുറയ്ക്കൽ, മസിൽ കൂട്ടൽ, പ്രമേഹ നിയന്ത്രണം) എന്നിവ കണക്കാക്കി Mifflin-St Jeor ഫോർമുല വഴി കൃത്യമായ കലോറി ലക്ഷ്യം നിർണ്ണയിക്കുകയും 4 നേരത്തെ (രാവിലെ, ഉച്ചയ്ക്ക്, വൈകിട്ട്, രാത്രി) സമീകൃതാഹാരം നൽകുകയും ചെയ്യുന്നു.",
      whatToProvide: [
        "നിങ്ങളുടെ ഭാരം, ഉയരം, പ്രായം, ഡയറ്റ് ലക്ഷ്യം (Weight Loss, Muscle Gain, Diabetic Care).",
        "നിങ്ങൾ കഴിക്കുന്ന ഭക്ഷണങ്ങൾ (മീൽ സ്കാനർ വഴിയോ നേരിട്ടോ രേഖപ്പെടുത്തുക)."
      ],
      howItWorks: [
        "1. ബി.എം.ആർ (BMR), ടി.ഡി.ഇ.ഇ (TDEE) എന്നിവ കൃത്യമായി കണക്കാക്കുന്നു.",
        "2. ദിവസേന കഴിക്കാവുന്ന പഞ്ചസാരയുടെ പരമാവധി അളവ് നിശ്ചയിക്കുന്നു.",
        "3. നിങ്ങളുടെ ലക്ഷ്യത്തിനനുസരിച്ചുള്ള 4 നേരത്തെ ഭക്ഷണം സ്വയം തയ്യാറാക്കുന്നു.",
        "4. കാറ്റഗറി (Weight Loss / Muscle Gain / Diabetic) മാറ്റുമ്പോൾ അതിനനുസരിച്ച് ഭക്ഷണക്രമം ഉടൻ റീഫ്രഷ് ചെയ്യപ്പെടുന്നു."
      ],
      stepByStep: [
        "പ്രൊഫൈൽ വിവരങ്ങൾ നൽകുക.",
        "ഡാഷ്‌ബോർഡിൽ ഇന്നത്തെ കലോറിയും പഞ്ചസാരയുടെ അളവും നിരീക്ഷിക്കുക.",
        "'AI Meal Plan' കാർഡിൽ ആവശ്യമുള്ള കാറ്റഗറി തിരഞ്ഞെടുക്കുക.",
        "'Refresh AI Meals Plan' അമർത്തി പുതിയ വിഭവങ്ങൾ കാണുക.",
        "കഴിച്ച ഭക്ഷണങ്ങൾ 'Ate This' ക്ലിക്ക് ചെയ്ത് സ്ഥിരീകരിക്കുക."
      ],
      accuracyTips: [
        "ഭാരത്തിൽ മാറ്റം വരുമ്പോൾ പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്യുക.",
        "ഭക്ഷണം കഴിച്ചയുടൻ ലോഗ് ചെയ്യുക."
      ],
      exampleResult: "തടി കുറയ്ക്കാൻ ആഗ്രഹിക്കുന്ന 70 കിലോ ഉള്ള ഒരാൾക്ക് പ്രതിദിനം 1850 kcal നിശ്ചയിച്ച് പുട്ട്, മീൻ കറി, പച്ചക്കറികൾ എന്നിവ ഉൾപ്പെടുത്തിയ ഡയറ്റ് നൽകുന്നു."
    },
    hi: {
      title: "डाइट डैशबोर्ड व एआई मील प्लानर",
      tagline: "सटीक कैलोरी गणना, शुगर नियंत्रण और 4 समय का संतुलित भोजन प्लान",
      purpose: "आपकी उम्र, वजन और लक्ष्य के अनुसार दैनिक कैलोरी और शुगर की सीमा तय करता है और सुबह से रात तक के 4 पौष्टिक मील का सुझाव देता है।",
      whatToProvide: [
        "उम्र, वजन, लंबाई, गतिविधि स्तर और स्वास्थ्य लक्ष्य।"
      ],
      howItWorks: [
        "1. वैज्ञानिक फॉर्मूले से दैनिक कैलोरी जरूरत तय करता है।",
        "2. ब्रेकफास्ट, लंच, स्नैक और डिनर का मेनू तैयार करता है।",
        "3. लक्ष्य बदलने पर तुरंत नया डाइट चार्ट बनाता है।"
      ],
      stepByStep: [
        "स्वास्थ्य प्रोफाइल पूरा करें।",
        "कैटेगरी चुनें (वजन घटाना, डायबिटीज नियंत्रण आदि)।",
        "'Refresh' दबाकर नई रेसिपीज देखें।"
      ],
      accuracyTips: [
        "वजन में बदलाव होने पर प्रोफाइल तुरंत अपडेट करें।"
      ],
      exampleResult: "डायबिटीज मरीजों के लिए कम ग्लाइसेमिक इंडेक्स और बिना चीनी वाला भोजन प्लान।"
    }
  },

  exercise_engine: {
    icon: Dumbbell,
    colorClass: "text-cyan-400 border-cyan-500/30",
    badgeBg: "bg-cyan-500/20 text-cyan-300",
    en: {
      title: "Targeted Exercise & Calorie Burn Engine",
      tagline: "Photos, targeted muscles, and real-time net calorie balance",
      purpose: "Recommends targeted exercises with realistic photos, muscle targets, and clinical post-meal walking routines. When you complete a workout, calories burned are subtracted directly from consumed food calories.",
      whatToProvide: [
        "Workout completion status or custom sports/exercise logs (mins and calories)."
      ],
      howItWorks: [
        "1. Computes Net Calories = Consumed Calories - Burned Calories.",
        "2. Formulates specific workouts: Post-meal walks for glucose blunting, HIIT for EPOC fat burn, strength circuits for lean mass.",
        "3. Shows visual exercise photo, targeted muscle groups, and step-by-step checklist.",
        "4. Updates your daily calorie deficit tracker in real time upon completion."
      ],
      stepByStep: [
        "Navigate to Diet Dashboard -> 'Exercise & Workouts' tab.",
        "Browse exercises with photos, intensity badges, and muscle targets.",
        "Follow the step-by-step instructions.",
        "Click 'Complete Workout (Mark Done)'.",
        "Watch your Net Calorie balance drop immediately!"
      ],
      accuracyTips: [
        "Perform the 'Post-Meal Glucose Walk' 15–20 minutes after lunch or dinner to blunt insulin spikes.",
        "Stay hydrated before and after any moderate to high intensity workout."
      ],
      exampleResult: "Logging a 20-min Post-Meal Walk burns 95 kcal and reduces blood sugar spikes by up to 34%."
    },
    ml: {
      title: "വ്യായാമവും കലോറി കത്തിക്കലും (Exercise Engine)",
      tagline: "വ്യായാമ ചിത്രങ്ങൾ, മസിലുകൾ, തത്സമയ നെറ്റ് കലോറി ബാലൻസ്",
      purpose: "കഴിച്ച ആഹാരത്തിലെ കലോറി കുറയ്ക്കുന്നതിനായി വ്യായാമങ്ങൾ ചിത്രങ്ങൾ സഹിതം നിർദ്ദേശിക്കുന്നു. വ്യായാമം പൂർത്തിയാക്കുമ്പോൾ കലോറി കുറഞ്ഞ് നെറ്റ് കലോറി അപ്‌ഡേറ്റ് ആകുന്നു.",
      whatToProvide: [
        "ചെയ്ത വ്യായാമം പൂർത്തിയാക്കിയതായി മാർക്ക് ചെയ്യുക അല്ലെങ്കിൽ പുതിയ കായിക വിനോദങ്ങൾ നൽകുക."
      ],
      howItWorks: [
        "1. Net Calories = കഴിച്ച കലോറി - വ്യായാമത്തിലൂടെ കത്തിച്ച കലോറി.",
        "2. ആഹാരം കഴിച്ച ശേഷമുള്ള നടത്തം രക്തത്തിലെ പഞ്ചസാരയുടെ വർദ്ധനവ് തടയുന്നു.",
        "3. ഓരോ വ്യായാമത്തിന്റെയും ഫോട്ടോ, വ്യായാമം ചെയ്യേണ്ട രീതി, സ്വാധീനിക്കുന്ന മസിലുകൾ എന്നിവ കാണിക്കുന്നു.",
        "4. വ്യായാമം പൂർത്തിയാക്കുമ്പോൾ ഡാഷ്‌ബോർഡിലെ കലോറിയിൽ നേരിട്ട് കുറവ് വരുന്നു."
      ],
      stepByStep: [
        "ഡയറ്റ് ഡാഷ്‌ബോർഡിലെ 'Exercise & Workouts' ടാബിൽ പോകുക.",
        "ഫോട്ടോയും നിർദ്ദേശങ്ങളും കണ്ട് വ്യായാമം മനസ്സിലാക്കുക.",
        "'Complete Workout (Mark Done)' ക്ലിക്ക് ചെയ്യുക.",
        "കത്തിച്ച കലോറി ഉടൻ തന്നെ നിങ്ങളുടെ കണക്കിൽ നിന്ന് കുറയ്ക്കപ്പെടും."
      ],
      accuracyTips: [
        "ഉച്ചഭക്ഷണത്തിനോ അത്താഴത്തിനോ ശേഷം 20 മിനിറ്റ് സാവധാനം നടക്കുന്നത് പഞ്ചസാര പെട്ടെന്ന് കൂടുന്നത് തടയും.",
        "വ്യായാമത്തിന് മുൻപും ശേഷവും ആവശ്യത്തിന് വെള്ളം കുടിക്കുക."
      ],
      exampleResult: "20 മിനിറ്റ് നടത്തം പൂർത്തിയാക്കുമ്പോൾ 95 കലോറി കുറയുകയും രക്തത്തിലെ പഞ്ചസാരയുടെ അളവ് 34% വരെ കുറയുകയും ചെയ്യുന്നു."
    },
    hi: {
      title: "व्यायाम व कैलोरी बर्न इंजन",
      tagline: "वर्कआउट तस्वीरें, लक्षित मांसपेशियां और लाइव नेट कैलोरी ट्रैकिंग",
      purpose: "भोजन से प्राप्त कैलोरी को संतुलित करने के लिए व्यायाम सुझाता है। वर्कआउट पूरा करने पर बर्न हुई कैलोरी सीधे घट जाती है।",
      whatToProvide: [
        "पूरा किया गया वर्कआउट या खेल का समय व कैलोरी।"
      ],
      howItWorks: [
        "1. नेट कैलोरी = खाई गई कैलोरी - बर्न की गई कैलोरी।",
        "2. खाने के बाद की वॉक शुगर को नियंत्रित करती है।",
        "3. हर व्यायाम की तस्वीर और स्टेप्स दिखाए जाते हैं।"
      ],
      stepByStep: [
        "'Exercise' सेक्शन में जाएं।",
        "व्यायाम की तस्वीर और निर्देश देखें।",
        "'Complete Workout' दबाएं और अपनी बर्न हुई कैलोरी घटाएं।"
      ],
      accuracyTips: [
        "दोपहर या रात के खाने के 15-20 मिनट बाद हल्की वॉक जरूर करें।"
      ],
      exampleResult: "35 मिनट की तेज वॉक से 180 kcal बर्न होती है।"
    }
  },

  food_safety: {
    icon: ShieldAlert,
    colorClass: "text-rose-400 border-rose-500/30",
    badgeBg: "bg-rose-500/20 text-rose-300",
    en: {
      title: "Food Safety Grievance & Authority Escalation Portal",
      tagline: "Report adulteration and hygiene violations directly to FSSAI & District Food Safety Officers",
      purpose: "Citizens can report stale food, insect contamination, chemical adulteration, or misleading packaging. Includes administrative moderation and official email dispatch to regulatory authorities.",
      whatToProvide: [
        "Restaurant / Vendor Name and Location (City, District).",
        "Nature of violation (Stale food, Foreign matter, Expired stock, Adulteration).",
        "Photographic evidence of adulteration or bill receipt."
      ],
      howItWorks: [
        "1. Grievance is registered with unique Tracking Reference ID.",
        "2. Admin moderation verifies incident evidence and legal merit.",
        "3. Upon admin approval, an official dispatch notice is prepared.",
        "4. In demo mode: Displays complete legal email dispatch receipt to FSSAI & District Officer without spamming external mailboxes."
      ],
      stepByStep: [
        "Open 'Food Safety Portal'.",
        "Fill out Vendor details, incident description, and upload photo evidence.",
        "Submit grievance to get unique tracking ID.",
        "Admin reviews case in the Moderation Queue.",
        "When approved, an official dispatch receipt is generated."
      ],
      accuracyTips: [
        "Capture clear photos of the contaminated food and the cash bill/packaging.",
        "Provide accurate landmark or outlet name for official inspection."
      ],
      exampleResult: "Reporting stale chicken curry in Kozhikode generates reference #FSSAI-KL-2026-904 with official email dispatch receipt to District Food Safety Officer."
    },
    ml: {
      title: "ഭക്ഷണ സുരക്ഷാ പരാതി പരിഹാര പോർട്ടൽ (FSSAI Redressal)",
      tagline: "ഭക്ഷണത്തിലെ മായം, പഴകിയ ഭക്ഷണം എന്നിവയെക്കുറിച്ച് ഉദ്യോഗസ്ഥർക്ക് നേരിട്ട് പരാതി നൽകാം",
      purpose: "ഹോട്ടലുകളിലെ പഴകിയ ഭക്ഷണം, മായം, പ്രാണികൾ, കൃത്രിമ നിറങ്ങൾ എന്നിവയെക്കുറിച്ച് പൊതുജനങ്ങൾക്ക് ഫോട്ടോ സഹിതം നേരിട്ട് പരാതി നൽകാനുള്ള സംവിധാനം. അഡ്മിൻ പരിശോധിച്ച ശേഷം ഔദ്യോഗികമായി ഫുഡ് സേഫ്റ്റി ഓഫീസർമാർക്ക് പരാതി കൈമാറുന്നു.",
      whatToProvide: [
        "സ്ഥാപനത്തിന്റെ പേരും സ്ഥലവും (ജില്ല, സ്ഥലം).",
        "പരാതിയുടെ കാരണം (പഴകിയ ഭക്ഷണം, മായം, പുഴു/പ്രാണി, എക്സ്പെയറി തീയതി കഴിഞ്ഞത്).",
        "ഭക്ഷണത്തിന്റെയോ ബില്ലിന്റെയോ ഫോട്ടോ."
      ],
      howItWorks: [
        "1. പരാതി നൽകിയാൽ ഉടൻ ഒരു ട്രാക്കിംഗ് ഐ.ഡി ലഭിക്കുന്നു.",
        "2. അഡ്മിൻ തെളിവുകളും വിവരങ്ങളും പരിശോധിച്ച് അപ്രൂവൽ നൽകുന്നു.",
        "3. അപ്രൂവ് ചെയ്താൽ ജില്ലാ ഫുഡ് സേഫ്റ്റി ഓഫീസർക്കും FSSAI-ക്കും മെയിൽ അയക്കാനുള്ള അറിയിപ്പ് വരുന്നു.",
        "4. ഡെമോ ആയതിനാൽ നിലവിൽ പുറത്തേക്ക് മെയിൽ പോകാതെ പൂർണ്ണമായ മെയിൽ രസീത് സ്ക്രീനിൽ കാണിക്കും."
      ],
      stepByStep: [
        "'Food Safety Portal' തുറക്കുക.",
        "സ്ഥാപനത്തിന്റെ പേര്, പരാതിയുടെ വിവരങ്ങൾ, ഫോട്ടോ എന്നിവ നൽകുക.",
        "സബ്മിറ്റ് ചെയ്യുമ്പോൾ ട്രാക്കിംഗ് ഐ.ഡി ലഭിക്കും.",
        "അഡ്മിൻ അപ്രൂവ് ചെയ്യുമ്പോൾ 'Send Done' എന്ന പൂർണ്ണമായ ഔദ്യോഗിക രസീത് ലഭിക്കും."
      ],
      accuracyTips: [
        "ഭക്ഷണത്തിലെ മായവും ഹോട്ടൽ ബില്ലും വ്യക്തമായി കാണുന്ന ഫോട്ടോ നൽകുക.",
        "കടയുടെ ശരിയായ പേരും ലൊക്കേഷനും നൽകുക."
      ],
      exampleResult: "ഉദാഹരണത്തിന്: കോഴിക്കോട് ഒരു കടയിൽ നിന്ന് പഴകിയ ബിരിയാണി ലഭിച്ചാൽ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്ത് പരാതി നൽകാം, അഡ്മിൻ അനുമതി നൽകിയാൽ അന്വേഷണത്തിനായി ഫുഡ് സേഫ്റ്റി ഡിപ്പാർട്ട്മെന്റിന് സന്ദേശം എത്തും."
    },
    hi: {
      title: "खाद्य सुरक्षा शिकायत व सरकारी प्राधिकरण पोर्टल",
      tagline: "मिलावट और बासी खाने की शिकायत सीधे FSSAI व खाद्य सुरक्षा अधिकारियों को भेजें",
      purpose: "होटल, रेस्टोरेंट या बाजार में मिलने वाले मिलावटी, बासी या अस्वच्छ भोजन की तस्वीर सहित शिकायत दर्ज करने का आधिकारिक पोर्टल।",
      whatToProvide: [
        "दुकान/रेस्टोरेंट का नाम, शहर और पता।",
        "शिकायत का विवरण व फोटो सबूत।"
      ],
      howItWorks: [
        "1. शिकायत दर्ज होने पर ट्रैकिंग आईडी मिलती है।",
        "2. एडमिन सबूतों की जांच करके स्वीकृति देता है।",
        "3. संबंधित खाद्य सुरक्षा अधिकारी को आधिकारिक ईमेल प्रेषित की जाती है।"
      ],
      stepByStep: [
        "'Food Safety' टैब खोलें।",
        "दुकान का नाम व फोटो अपलोड करें।",
        "एडमिन अप्रूवल के बाद ईमेल प्रेषण की रसीद देखें।"
      ],
      accuracyTips: [
        "भोजन और बिल की स्पष्ट फोटो अवश्य लगाएं।"
      ],
      exampleResult: "बासी भोजन की शिकायत दर्ज होने पर तुरंत FSSAI संदर्भ संख्या जनरेट होती है।"
    }
  }
};

export default function ExplainFeatureModal({
  isOpen,
  feature,
  onClose,
  onNavigateToFeature,
  language = "en",
  onLanguageChange
}: ExplainFeatureModalProps) {
  const [currentLang, setCurrentLang] = useState<AppLanguage>(language);

  // Sync if prop changes
  React.useEffect(() => {
    if (language) setCurrentLang(language);
  }, [language]);

  if (!isOpen || !feature) return null;

  const config = FEATURE_DATA[feature];
  if (!config) return null;

  // Resolve content based on language
  const getContent = (): LanguageContent => {
    if (currentLang === "ml") return config.ml;
    if (currentLang === "hi") return config.hi;
    if (currentLang === "en_ml") {
      return {
        title: `${config.en.title} • ${config.ml.title}`,
        tagline: `${config.en.tagline} • ${config.ml.tagline}`,
        purpose: `${config.en.purpose}\n\n📌 മലയാളം: ${config.ml.purpose}`,
        whatToProvide: config.en.whatToProvide.map((item, idx) =>
          `${item} [മലയാളം: ${config.ml.whatToProvide[idx] || ""}]`
        ),
        howItWorks: config.en.howItWorks.map((item, idx) =>
          `${item} [മലയാളം: ${config.ml.howItWorks[idx] || ""}]`
        ),
        stepByStep: config.en.stepByStep.map((item, idx) =>
          `${item} [മലയാളം: ${config.ml.stepByStep[idx] || ""}]`
        ),
        accuracyTips: config.en.accuracyTips.map((item, idx) =>
          `${item} [മലയാളം: ${config.ml.accuracyTips[idx] || ""}]`
        ),
        exampleResult: `${config.en.exampleResult}\n\n[ഉദാഹരണം]: ${config.ml.exampleResult}`
      };
    }
    if (currentLang === "en_hi") {
      return {
        title: `${config.en.title} • ${config.hi.title}`,
        tagline: `${config.en.tagline} • ${config.hi.tagline}`,
        purpose: `${config.en.purpose}\n\n📌 हिन्दी: ${config.hi.purpose}`,
        whatToProvide: config.en.whatToProvide.map((item, idx) =>
          `${item} [हिन्दी: ${config.hi.whatToProvide[idx] || ""}]`
        ),
        howItWorks: config.en.howItWorks.map((item, idx) =>
          `${item} [हिन्दी: ${config.hi.howItWorks[idx] || ""}]`
        ),
        stepByStep: config.en.stepByStep.map((item, idx) =>
          `${item} [हिन्दी: ${config.hi.stepByStep[idx] || ""}]`
        ),
        accuracyTips: config.en.accuracyTips.map((item, idx) =>
          `${item} [हिन्दी: ${config.hi.accuracyTips[idx] || ""}]`
        ),
        exampleResult: `${config.en.exampleResult}\n\n[उदाहरण]: ${config.hi.exampleResult}`
      };
    }
    return config.en;
  };

  const content = getContent();
  const IconComponent = config.icon;

  const handleSelectLang = (newLang: AppLanguage) => {
    setCurrentLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-white/[0.03] flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${config.colorClass} bg-white/5`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
                  Feature Workflow Guide
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {feature.toUpperCase().replace("_", " ")}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {content.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Language Switcher Bar */}
            <div className="flex items-center bg-black/60 border border-white/15 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => handleSelectLang("en")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLang === "en" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
                }`}
                title="English (Primary)"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("en_ml")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLang === "en_ml" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
                }`}
                title="English + Malayalam"
              >
                EN+ML
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("en_hi")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLang === "en_hi" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
                }`}
                title="English + Hindi"
              >
                EN+HI
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("ml")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLang === "ml" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
                }`}
                title="മലയാളം"
              >
                മലയാളം
              </button>
              <button
                type="button"
                onClick={() => handleSelectLang("hi")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLang === "hi" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Tagline & Purpose */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <p className="text-emerald-400 font-semibold text-xs tracking-wide">
              {content.tagline}
            </p>
            <p className="text-white text-sm sm:text-base leading-relaxed">
              {content.purpose}
            </p>
          </div>

          {/* Grid: What to Provide & Behind the Scenes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What to provide */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                {language === "ml" ? "നൽകേണ്ട വിവരങ്ങൾ (Inputs)" : language === "hi" ? "क्या इनपुट दें (Inputs)" : "What to Provide (Inputs)"}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {content.whatToProvide.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How AI works behind scenes */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {language === "ml" ? "AI പ്രവർത്തിക്കുന്ന വിധം (Mechanics)" : language === "hi" ? "एआई कैसे काम करता है (Mechanics)" : "How AI Works (Mechanics)"}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {content.howItWorks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step-by-Step Practical Usage */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {language === "ml" ? "ഉപയോഗിക്കേണ്ട ക്രമം (Step-by-Step Guide)" : language === "hi" ? "इस्तेमाल करने के चरण (Step-by-Step)" : "Step-by-Step Usage Guide"}
            </h4>
            <div className="space-y-2">
              {content.stepByStep.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips for Accuracy & Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                {language === "ml" ? "മികച്ച കൃത്യതയ്ക്കുള്ള ടിപ്പുകൾ" : language === "hi" ? "सटीकता के लिए सुझाव" : "Tips for Highest Accuracy"}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {content.accuracyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {language === "ml" ? "യഥാർത്ഥ ഉദാഹരണം" : language === "hi" ? "वास्तविक उदाहरण" : "Real-World Example"}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-white/10">
                {content.exampleResult}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {language === "ml" ? "ആപ്പ് ഉപയോഗിക്കാൻ ഇപ്പോൾ തയ്യറാണ്" : language === "hi" ? "आप इस फीचर का उपयोग कर सकते हैं" : "Ready to try this feature?"}
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
            >
              {language === "ml" ? "അടയ്ക്കുക" : language === "hi" ? "बंद करें" : "Close"}
            </button>
            {onNavigateToFeature && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFeature(feature);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>{language === "ml" ? "ഈ ഫീച്ചർ തുറക്കുക" : language === "hi" ? "यह फीचर खोलें" : "Open This Feature"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
