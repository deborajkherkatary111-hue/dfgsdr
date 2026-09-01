import React, { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import {
  Search, ShieldCheck, ChevronDown, MapPin, Users, Check,
  Languages, Sparkles, ArrowRight, Home as HomeIcon
} from "lucide-react";

/* ---------------------------------------------------------
   Design tokens (see inline comments) —
   bg #0F1B2D (night-khadi navy), surface #16233A / #1D2E4A,
   text #F1EEE4, muted #93A1B5, gold #D9A441, rust #C1502E,
   green #4C8C6B, hairline rgba(241,238,228,.14)
---------------------------------------------------------- */

const COLORS = {
  bg: "#0F1B2D",
  surface: "#16233A",
  surfaceAlt: "#1D2E4A",
  text: "#F1EEE4",
  muted: "#93A1B5",
  gold: "#D9A441",
  rust: "#C1502E",
  green: "#4C8C6B",
  hairline: "rgba(241,238,228,0.14)",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

/* ---------------------------------------------------------
   Copy — multilingual strings (demo subset; real product
   would cover all 22 scheduled languages + English)
---------------------------------------------------------- */
const STRINGS = {
  en: {
    langName: "English",
    kicker: "Government of India · Census 2027",
    heroTitle: "India counts itself, digitally, for the first time.",
    heroSub: "A citizen guide to the 16th Census — self-enumeration, timelines, and what the numbers will mean for your district.",
    ctaPrimary: "Start self-enumeration",
    ctaSecondary: "Check my state's dates",
    tickerLabel: "Households self-enumerated so far",
    tickerSource: "Source: Registrar General of India, 10 April 2026",
    phasesEyebrow: "Two phases, one census",
    phasesTitle: "What each phase actually collects",
    stateEyebrow: "State-wise schedule",
    stateTitle: "Find your enumeration window",
    stateSearchPlaceholder: "Search your state or union territory",
    wizardEyebrow: "Self-enumeration",
    wizardTitle: "Walk through the process before you do it for real",
    trustEyebrow: "Trust and safety",
    trustTitle: "What the census does and doesn't do with your data",
    dataEyebrow: "Census data, visualised",
    dataTitle: "A century of counting India",
    footerNote: "This is an independent hackathon prototype built for civic-education purposes. It is not an official Government of India product.",
  },
  hi: {
    langName: "हिन्दी",
    kicker: "भारत सरकार · जनगणना 2027",
    heroTitle: "पहली बार, भारत खुद को डिजिटल तरीके से गिन रहा है।",
    heroSub: "16वीं जनगणना के लिए नागरिक गाइड — स्व-गणना, समय-सीमा, और आपके ज़िले के लिए आंकड़ों का मतलब।",
    ctaPrimary: "स्व-गणना शुरू करें",
    ctaSecondary: "अपने राज्य की तारीखें देखें",
    tickerLabel: "अब तक स्व-गणना करने वाले परिवार",
    tickerSource: "स्रोत: भारत के महापंजीयक, 10 अप्रैल 2026",
    phasesEyebrow: "दो चरण, एक जनगणना",
    phasesTitle: "प्रत्येक चरण में क्या एकत्र किया जाता है",
    stateEyebrow: "राज्यवार समय-सारणी",
    stateTitle: "अपनी गणना अवधि जानें",
    stateSearchPlaceholder: "अपना राज्य या केंद्र शासित प्रदेश खोजें",
    wizardEyebrow: "स्व-गणना",
    wizardTitle: "वास्तव में करने से पहले प्रक्रिया समझें",
    trustEyebrow: "विश्वास और सुरक्षा",
    trustTitle: "जनगणना आपके डेटा के साथ क्या करती है, क्या नहीं",
    dataEyebrow: "जनगणना डेटा, दृश्य रूप में",
    dataTitle: "भारत की गिनती की एक सदी",
    footerNote: "यह नागरिक-शिक्षा हेतु बनाया गया एक स्वतंत्र हैकाथॉन प्रोटोटाइप है। यह भारत सरकार का आधिकारिक उत्पाद नहीं है।",
  },
  ta: {
    langName: "தமிழ்",
    kicker: "இந்திய அரசு · மக்கள் தொகை கணக்கெடுப்பு 2027",
    heroTitle: "முதன்முறையாக, இந்தியா தன்னை டிஜிட்டல் முறையில் எண்ணுகிறது.",
    heroSub: "16வது கணக்கெடுப்புக்கான குடிமக்கள் வழிகாட்டி — சுய-பதிவு, காலவரிசை, உங்கள் மாவட்டத்திற்கான எண்களின் அர்த்தம்.",
    ctaPrimary: "சுய-பதிவைத் தொடங்கு",
    ctaSecondary: "எனது மாநிலத் தேதிகளைப் பார்",
    tickerLabel: "இதுவரை சுய-பதிவு செய்த குடும்பங்கள்",
    tickerSource: "மூலம்: இந்திய பதிவாளர் அலுவலகம், 10 ஏப்ரல் 2026",
    phasesEyebrow: "இரண்டு கட்டங்கள், ஒரு கணக்கெடுப்பு",
    phasesTitle: "ஒவ்வொரு கட்டமும் என்ன சேகரிக்கிறது",
    stateEyebrow: "மாநில வாரியான அட்டவணை",
    stateTitle: "உங்கள் பதிவு காலத்தைக் கண்டறியவும்",
    stateSearchPlaceholder: "உங்கள் மாநிலம் அல்லது யூனியன் பிரதேசத்தைத் தேடுங்கள்",
    wizardEyebrow: "சுய-பதிவு",
    wizardTitle: "நிஜமாகச் செய்யும் முன் செயல்முறையைப் பார்வையிடவும்",
    trustEyebrow: "நம்பிக்கை மற்றும் பாதுகாப்பு",
    trustTitle: "உங்கள் தரவுக்கு கணக்கெடுப்பு என்ன செய்கிறது, என்ன செய்யாது",
    dataEyebrow: "கணக்கெடுப்பு தரவு, காட்சிப்படுத்தப்பட்டது",
    dataTitle: "இந்தியாவை எண்ணிய ஒரு நூற்றாண்டு",
    footerNote: "இது குடிமக்கள் கல்விக்காக உருவாக்கப்பட்ட ஒரு சுயாதீன ஹேக்கத்தான் முன்மாதிரி. இது இந்திய அரசின் அதிகாரப்பூர்வ தயாரிப்பு அல்ல.",
  },
  bn: {
    langName: "বাংলা",
    kicker: "ভারত সরকার · জনগণনা ২০২৭",
    heroTitle: "প্রথমবারের মতো, ভারত নিজেকে ডিজিটালি গণনা করছে।",
    heroSub: "১৬তম জনগণনার জন্য নাগরিক গাইড — স্ব-গণনা, সময়সূচি, এবং আপনার জেলার জন্য সংখ্যাগুলোর অর্থ।",
    ctaPrimary: "স্ব-গণনা শুরু করুন",
    ctaSecondary: "আমার রাজ্যের তারিখ দেখুন",
    tickerLabel: "এখন পর্যন্ত স্ব-গণনাকারী পরিবার",
    tickerSource: "সূত্র: ভারতের রেজিস্ট্রার জেনারেল, ১০ এপ্রিল ২০২৬",
    phasesEyebrow: "দুটি ধাপ, একটি জনগণনা",
    phasesTitle: "প্রতিটি ধাপে কী সংগ্রহ করা হয়",
    stateEyebrow: "রাজ্যভিত্তিক সময়সূচি",
    stateTitle: "আপনার গণনার সময়কাল খুঁজুন",
    stateSearchPlaceholder: "আপনার রাজ্য বা কেন্দ্রশাসিত অঞ্চল খুঁজুন",
    wizardEyebrow: "স্ব-গণনা",
    wizardTitle: "সত্যিই করার আগে প্রক্রিয়াটি দেখে নিন",
    trustEyebrow: "বিশ্বাস ও নিরাপত্তা",
    trustTitle: "আপনার তথ্য নিয়ে জনগণনা কী করে, কী করে না",
    dataEyebrow: "জনগণনার তথ্য, দৃশ্যরূপে",
    dataTitle: "ভারতকে গণনার এক শতাব্দী",
    footerNote: "এটি নাগরিক-শিক্ষার জন্য তৈরি একটি স্বতন্ত্র হ্যাকাথন প্রোটোটাইপ। এটি ভারত সরকারের কোনো আনুষ্ঠানিক পণ্য নয়।",
  },
};
const LANGS = ["en", "hi", "ta", "bn"];

/* ---------------------------------------------------------
   Real, sourced content
--------------------------------------------------------- */
const PHASES = [
  {
    n: "01",
    name: { en: "House Listing & Housing Census", hi: "मकान गणना और आवास जनगणना", ta: "வீட்டுப் பட்டியல் மற்றும் வீட்டு கணக்கெடுப்பு", bn: "গৃহ তালিকা ও গৃহ শুমারি" },
    short: "HLO",
    window: "1 Apr – 30 Sep 2026",
    collects: {
      en: ["Building & structure type, geo-tagged", "Housing conditions and amenities (water, power, toilets)", "Assets owned by the household", "A unique ID assigned to every structure"],
      hi: ["भवन व संरचना का प्रकार, जियो-टैग सहित", "आवास की स्थिति और सुविधाएं (पानी, बिजली, शौचालय)", "परिवार के पास मौजूद संपत्ति", "हर संरचना को एक विशिष्ट पहचान संख्या"],
      ta: ["கட்டிடம் மற்றும் அமைப்பு வகை, ஜியோ-டேக் செய்யப்பட்டது", "வீட்டு நிலைமைகள் மற்றும் வசதிகள் (தண்ணீர், மின்சாரம், கழிப்பறை)", "குடும்பத்திற்கு சொந்தமான சொத்துக்கள்", "ஒவ்வொரு அமைப்பிற்கும் தனித்துவ அடையாள எண்"],
      bn: ["ভবন ও কাঠামোর ধরন, জিও-ট্যাগসহ", "আবাসনের অবস্থা ও সুবিধা (জল, বিদ্যুৎ, শৌচাগার)", "পরিবারের মালিকানাধীন সম্পদ", "প্রতিটি কাঠামোর জন্য অনন্য পরিচিতি সংখ্যা"],
    },
    note: { en: "Includes an optional 15-day self-enumeration window before the door-to-door visit, state by state.", hi: "घर-घर जाने से पहले राज्यवार 15 दिन की वैकल्पिक स्व-गणना अवधि शामिल है।", ta: "வீடு வீடாகச் செல்வதற்கு முன் மாநில வாரியாக 15 நாள் விருப்ப சுய-பதிவு காலம் உள்ளது.", bn: "দ্বারে দ্বারে পরিদর্শনের আগে রাজ্যভিত্তিক ১৫ দিনের ঐচ্ছিক স্ব-গণনার সময়কাল অন্তর্ভুক্ত।" },
  },
  {
    n: "02",
    name: { en: "Population Enumeration", hi: "जनसंख्या गणना", ta: "மக்கள்தொகை கணக்கெடுப்பு", bn: "জনসংখ্যা গণনা" },
    short: "PE",
    window: "February 2027",
    collects: {
      en: ["Demographic details of every individual", "Caste enumeration — first time nationwide since 1931", "Socio-economic, migration and fertility information", "Cultural and linguistic details"],
      hi: ["प्रत्येक व्यक्ति का जनसांख्यिकीय विवरण", "जाति गणना — 1931 के बाद पहली बार राष्ट्रव्यापी", "सामाजिक-आर्थिक, प्रवासन और प्रजनन संबंधी जानकारी", "सांस्कृतिक और भाषाई विवरण"],
      ta: ["ஒவ்வொரு நபரின் மக்கள்தொகை விவரங்கள்", "சாதி கணக்கெடுப்பு — 1931க்குப் பிறகு முதன்முறையாக நாடு தழுவிய", "சமூக-பொருளாதார, இடம்பெயர்வு மற்றும் கருவுறுதல் தகவல்", "கலாச்சார மற்றும் மொழி விவரங்கள்"],
      bn: ["প্রতিটি ব্যক্তির জনতাত্ত্বিক বিবরণ", "বর্ণ গণনা — ১৯৩১ সালের পর প্রথমবার দেশব্যাপী", "আর্থ-সামাজিক, অভিবাসন ও উর্বরতা সংক্রান্ত তথ্য", "সাংস্কৃতিক ও ভাষাগত বিবরণ"],
    },
    note: { en: "Snow-bound regions (Ladakh, J&K, HP, Uttarakhand) complete this phase early, in September–October 2026.", hi: "हिमाच्छादित क्षेत्र (लद्दाख, जम्मू-कश्मीर, हिमाचल, उत्तराखंड) यह चरण सितंबर-अक्टूबर 2026 में जल्दी पूरा करते हैं।", ta: "பனி மூடிய பகுதிகள் (லடாக், ஜம்மு-காஷ்மீர், இமாச்சல், உத்தரகண்ட்) இந்த கட்டத்தை செப்டம்பர்-அக்டோபர் 2026இல் ஏற்கனவே முடிக்கின்றன.", bn: "তুষারাবৃত অঞ্চল (লাদাখ, জম্মু-কাশ্মীর, হিমাচল, উত্তরাখণ্ড) এই ধাপটি সেপ্টেম্বর-অক্টোবর ২০২৬-এ আগেভাগে সম্পন্ন করে।" },
  },
];

// Real batch schedule from PIB press briefings (illustrative subset — not all states have announced dates yet)
const STATE_DATA = [
  { state: "Goa", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Karnataka", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Odisha", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Sikkim", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Mizoram", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Andaman & Nicobar Islands", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Lakshadweep", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Delhi (NDMC & Cantonment areas)", selfEnum: "1–15 Apr 2026", hlo: "16 Apr–15 May 2026", status: "announced" },
  { state: "Madhya Pradesh", selfEnum: "16–30 Apr 2026", hlo: "1–30 May 2026", status: "announced" },
  { state: "Andhra Pradesh", selfEnum: "16–30 Apr 2026", hlo: "1–30 May 2026", status: "announced" },
  { state: "Arunachal Pradesh", selfEnum: "16–30 Apr 2026", hlo: "1–30 May 2026", status: "announced" },
  { state: "Chandigarh", selfEnum: "16–30 Apr 2026", hlo: "1–30 May 2026", status: "announced" },
  { state: "Chhattisgarh", selfEnum: "16–30 Apr 2026", hlo: "1–30 May 2026", status: "announced" },
  { state: "Haryana", selfEnum: "16–30 Apr 2026", hlo: "1–30 May 2026", status: "announced" },
  { state: "Ladakh", selfEnum: "Completed early", hlo: "Sep–Oct 2026 (snow-bound schedule)", status: "snowbound" },
  { state: "Jammu & Kashmir", selfEnum: "Completed early", hlo: "Sep–Oct 2026 (snow-bound schedule)", status: "snowbound" },
  { state: "Himachal Pradesh", selfEnum: "Completed early", hlo: "Sep–Oct 2026 (snow-bound schedule)", status: "snowbound" },
  { state: "Uttarakhand", selfEnum: "Completed early", hlo: "Sep–Oct 2026 (snow-bound schedule)", status: "snowbound" },
  { state: "Maharashtra", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Uttar Pradesh", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Tamil Nadu", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "West Bengal", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Bihar", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Rajasthan", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Kerala", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Punjab", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Telangana", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
  { state: "Gujarat", selfEnum: "To be notified by state", hlo: "Within Apr–Sep 2026 window", status: "pending" },
];

const WIZARD_STEPS = {
  en: [
    { t: "Confirm you're eligible", d: "Any adult household member with a mobile number can self-enumerate on behalf of the household, during the state's open window." },
    { t: "Open the portal, pick your language", d: "The Self-Enumeration portal supports 16 languages. Choose yours before you start — it stays selected throughout." },
    { t: "Verify with OTP", d: "Enter your mobile number and the one-time password sent to it. No Aadhaar or ID upload is required to begin." },
    { t: "Answer the House Listing questions", d: "You'll go through the 33 notified questions about your dwelling, amenities, and assets — about 10–15 minutes." },
    { t: "Review and submit", d: "Check your answers on the summary screen, submit, and save your acknowledgment number for reference." },
  ],
  hi: [
    { t: "पात्रता की पुष्टि करें", d: "मोबाइल नंबर वाला कोई भी वयस्क सदस्य राज्य की खुली अवधि के दौरान परिवार की ओर से स्व-गणना कर सकता है।" },
    { t: "पोर्टल खोलें, भाषा चुनें", d: "स्व-गणना पोर्टल 16 भाषाओं में उपलब्ध है। शुरू करने से पहले अपनी भाषा चुनें।" },
    { t: "OTP से सत्यापित करें", d: "अपना मोबाइल नंबर और भेजा गया वन-टाइम पासवर्ड दर्ज करें। शुरू करने के लिए आधार अपलोड आवश्यक नहीं है।" },
    { t: "मकान गणना के प्रश्नों के उत्तर दें", d: "आप अपने घर, सुविधाओं और संपत्ति से जुड़े 33 अधिसूचित प्रश्नों को पूरा करेंगे — लगभग 10–15 मिनट।" },
    { t: "समीक्षा करें और जमा करें", d: "सारांश स्क्रीन पर अपने उत्तर जांचें, जमा करें, और संदर्भ के लिए अपनी पावती संख्या सहेजें।" },
  ],
  ta: [
    { t: "தகுதியை உறுதிசெய்யவும்", d: "மொபைல் எண் உள்ள எந்த வயது வந்த குடும்ப உறுப்பினரும் மாநிலத்தின் திறந்த காலத்தில் குடும்பத்தின் சார்பாக சுய-பதிவு செய்யலாம்." },
    { t: "போர்ட்டலைத் திறந்து, மொழியைத் தேர்ந்தெடுக்கவும்", d: "சுய-பதிவு போர்ட்டல் 16 மொழிகளை ஆதரிக்கிறது. தொடங்கும் முன் உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்." },
    { t: "OTP மூலம் சரிபார்க்கவும்", d: "உங்கள் மொபைல் எண்ணையும் அனுப்பப்பட்ட ஒரு முறை கடவுச்சொல்லையும் உள்ளிடவும். தொடங்க ஆதார் தேவையில்லை." },
    { t: "வீட்டுப் பட்டியல் கேள்விகளுக்குப் பதிலளிக்கவும்", d: "உங்கள் வீடு, வசதிகள் மற்றும் சொத்துக்கள் பற்றிய 33 அறிவிக்கப்பட்ட கேள்விகளை நிறைவு செய்வீர்கள் — சுமார் 10–15 நிமிடங்கள்." },
    { t: "மதிப்பாய்வு செய்து சமர்ப்பிக்கவும்", d: "சுருக்கத் திரையில் உங்கள் பதில்களைச் சரிபார்த்து, சமர்ப்பித்து, குறிப்புக்கான உங்கள் ஒப்புகை எண்ணைச் சேமிக்கவும்." },
  ],
  bn: [
    { t: "যোগ্যতা নিশ্চিত করুন", d: "মোবাইল নম্বরসহ যেকোনো প্রাপ্তবয়স্ক সদস্য রাজ্যের খোলা সময়ে পরিবারের পক্ষে স্ব-গণনা করতে পারেন।" },
    { t: "পোর্টাল খুলুন, ভাষা বেছে নিন", d: "স্ব-গণনা পোর্টাল ১৬টি ভাষা সমর্থন করে। শুরু করার আগে আপনার ভাষা বেছে নিন।" },
    { t: "OTP দিয়ে যাচাই করুন", d: "আপনার মোবাইল নম্বর এবং পাঠানো ওয়ান-টাইম পাসওয়ার্ড লিখুন। শুরু করতে আধার আপলোডের প্রয়োজন নেই।" },
    { t: "গৃহ তালিকার প্রশ্নের উত্তর দিন", d: "আপনি আপনার বাসস্থান, সুবিধা ও সম্পদ সম্পর্কিত ৩৩টি বিজ্ঞপ্তিত প্রশ্নের মধ্য দিয়ে যাবেন — প্রায় ১০–১৫ মিনিট।" },
    { t: "পর্যালোচনা করে জমা দিন", d: "সারাংশ পর্দায় আপনার উত্তর যাচাই করুন, জমা দিন, এবং রেফারেন্সের জন্য আপনার প্রাপ্তি স্বীকার নম্বর সংরক্ষণ করুন।" },
  ],
};

const TRUST_FAQ = {
  en: [
    { q: "Will census data be used against me — for taxes, loans, or legal action?", a: "By law (Census Act, 1948, Section 15), individual records are confidential and cannot be used as evidence in any court, or shared with tax, police, or loan authorities. Only aggregated, anonymised statistics are published." },
    { q: "Is the self-enumeration portal secure?", a: "The portal uses OTP-based verification and is run by the Office of the Registrar General under the Ministry of Home Affairs. It does not require Aadhaar upload, and enumerators use government-provisioned logins on their own devices." },
    { q: "I heard the census is being used to track religion or caste for political targeting. Is that true?", a: "Caste, along with religion and other socio-cultural details, is collected for policy and welfare planning — as it has been in every census since 1951 for SC/ST — and is published only as aggregated statistics, never as individually identifiable data." },
    { q: "What if I don't self-enumerate — will I be penalised?", a: "Self-enumeration is optional. If you don't complete it in the online window, an enumerator will visit your household in person during the House Listing phase, as in every previous census." },
    { q: "Can anyone impersonate a census enumerator to enter my home?", a: "Official enumerators carry a government-issued ID card and an introduction letter. You can verify their identity against the list published by your local ward or panchayat office before sharing any information in person." },
  ],
  hi: [
    { q: "क्या जनगणना डेटा का इस्तेमाल मेरे खिलाफ — टैक्स, लोन या कानूनी कार्रवाई के लिए होगा?", a: "कानून (जनगणना अधिनियम, 1948, धारा 15) के तहत, व्यक्तिगत रिकॉर्ड गोपनीय होते हैं और किसी भी अदालत में सबूत के रूप में इस्तेमाल नहीं किए जा सकते, न ही टैक्स, पुलिस या लोन अधिकारियों के साथ साझा किए जा सकते हैं। केवल समग्र, गुमनाम आंकड़े प्रकाशित होते हैं।" },
    { q: "क्या स्व-गणना पोर्टल सुरक्षित है?", a: "पोर्टल OTP-आधारित सत्यापन का उपयोग करता है और गृह मंत्रालय के अधीन महापंजीयक कार्यालय द्वारा संचालित है। इसमें आधार अपलोड आवश्यक नहीं है।" },
    { q: "मैंने सुना है कि जनगणना का उपयोग धर्म या जाति को राजनीतिक लक्ष्यीकरण के लिए ट्रैक करने हेतु किया जा रहा है। क्या यह सच है?", a: "जाति, धर्म और अन्य सामाजिक-सांस्कृतिक विवरण नीति और कल्याण योजना के लिए एकत्र किए जाते हैं — जैसा 1951 से हर जनगणना में SC/ST के लिए होता रहा है — और केवल समग्र आंकड़ों के रूप में प्रकाशित होते हैं, कभी भी व्यक्तिगत रूप से पहचान योग्य डेटा के रूप में नहीं।" },
    { q: "अगर मैं स्व-गणना नहीं करता, तो क्या मुझे दंडित किया जाएगा?", a: "स्व-गणना वैकल्पिक है। यदि आप ऑनलाइन अवधि में इसे पूरा नहीं करते हैं, तो मकान गणना चरण के दौरान एक गणनाकार आपके घर व्यक्तिगत रूप से आएगा।" },
    { q: "क्या कोई जनगणना गणनाकार का रूप धारण कर मेरे घर में प्रवेश कर सकता है?", a: "आधिकारिक गणनाकार सरकार द्वारा जारी पहचान पत्र और परिचय पत्र साथ रखते हैं। व्यक्तिगत रूप से जानकारी साझा करने से पहले आप उनकी पहचान अपने स्थानीय वार्ड या पंचायत कार्यालय से सत्यापित कर सकते हैं।" },
  ],
  ta: [
    { q: "கணக்கெடுப்பு தரவு எனக்கு எதிராக — வரி, கடன் அல்லது சட்ட நடவடிக்கைக்குப் பயன்படுத்தப்படுமா?", a: "சட்டப்படி (கணக்கெடுப்பு சட்டம், 1948, பிரிவு 15), தனிநபர் பதிவுகள் ரகசியமானவை, எந்த நீதிமன்றத்திலும் ஆதாரமாகப் பயன்படுத்த முடியாது, வரி, காவல் அல்லது கடன் அதிகாரிகளுடன் பகிரப்படாது. மொத்தமான, அடையாளம் நீக்கப்பட்ட புள்ளிவிவரங்கள் மட்டுமே வெளியிடப்படும்." },
    { q: "சுய-பதிவு போர்ட்டல் பாதுகாப்பானதா?", a: "போர்ட்டல் OTP அடிப்படையிலான சரிபார்ப்பைப் பயன்படுத்துகிறது, உள்துறை அமைச்சகத்தின் கீழ் பதிவாளர் அலுவலகத்தால் இயக்கப்படுகிறது. ஆதார் பதிவேற்றம் தேவையில்லை." },
    { q: "சாதி அல்லது மதத்தை அரசியல் இலக்காக்கத் தடம் பிடிக்கப் பயன்படுத்தப்படுகிறதா?", a: "சாதி, மதம் மற்றும் பிற சமூக-கலாச்சார விவரங்கள் கொள்கை மற்றும் நலத் திட்டமிடலுக்காக சேகரிக்கப்படுகின்றன — 1951 முதல் ஒவ்வொரு கணக்கெடுப்பிலும் SC/ST-க்கு இருந்தது போலவே — மொத்த புள்ளிவிவரங்களாக மட்டுமே வெளியிடப்படும்." },
    { q: "நான் சுய-பதிவு செய்யவில்லை என்றால், தண்டிக்கப்படுவேனா?", a: "சுய-பதிவு விருப்பமானது. ஆன்லைன் காலத்தில் முடிக்கவில்லை என்றால், வீட்டுப் பட்டியல் கட்டத்தில் ஒரு கணக்கெடுப்பாளர் நேரில் வருவார்." },
    { q: "யாராவது கணக்கெடுப்பாளர் போல் நடித்து என் வீட்டிற்குள் நுழையலாமா?", a: "அதிகாரப்பூர்வ கணக்கெடுப்பாளர்கள் அரசு வழங்கிய அடையாள அட்டையையும் அறிமுகக் கடிதத்தையும் வைத்திருப்பார்கள். தகவலைப் பகிர்வதற்கு முன் உங்கள் உள்ளூர் வார்டு அலுவலகத்தில் அவர்களை உறுதிப்படுத்தலாம்." },
  ],
  bn: [
    { q: "জনগণনার তথ্য কি আমার বিরুদ্ধে — কর, ঋণ বা আইনি পদক্ষেপে ব্যবহৃত হবে?", a: "আইন অনুযায়ী (জনগণনা আইন, ১৯৪৮, ধারা ১৫), ব্যক্তিগত রেকর্ড গোপনীয় এবং কোনো আদালতে প্রমাণ হিসেবে ব্যবহার করা যায় না, বা কর, পুলিশ বা ঋণ কর্তৃপক্ষের সাথে শেয়ার করা যায় না। শুধুমাত্র সামগ্রিক, বেনামী পরিসংখ্যান প্রকাশিত হয়।" },
    { q: "স্ব-গণনা পোর্টাল কি নিরাপদ?", a: "পোর্টালটি OTP-ভিত্তিক যাচাইকরণ ব্যবহার করে এবং স্বরাষ্ট্র মন্ত্রকের অধীনে রেজিস্ট্রার জেনারেলের কার্যালয় দ্বারা পরিচালিত। আধার আপলোডের প্রয়োজন নেই।" },
    { q: "ধর্ম বা বর্ণ রাজনৈতিক লক্ষ্যবস্তু করার জন্য ট্র্যাক করা হচ্ছে কি?", a: "বর্ণ, ধর্ম এবং অন্যান্য আর্থ-সামাজিক তথ্য নীতি ও কল্যাণ পরিকল্পনার জন্য সংগ্রহ করা হয় — ১৯৫১ সাল থেকে SC/ST-এর জন্য প্রতিটি জনগণনায় যেমন হয়ে এসেছে — এবং শুধুমাত্র সামগ্রিক পরিসংখ্যান হিসেবে প্রকাশিত হয়।" },
    { q: "আমি স্ব-গণনা না করলে কি শাস্তি হবে?", a: "স্ব-গণনা ঐচ্ছিক। অনলাইন সময়ে সম্পন্ন না করলে, গৃহ তালিকা পর্বে একজন গণনাকারী সশরীরে আপনার বাড়িতে যাবেন।" },
    { q: "কেউ কি গণনাকারী সেজে আমার বাড়িতে প্রবেশ করতে পারে?", a: "সরকারি গণনাকারীরা সরকার প্রদত্ত পরিচয়পত্র ও পরিচিতিপত্র বহন করেন। তথ্য শেয়ার করার আগে আপনি স্থানীয় ওয়ার্ড বা পঞ্চায়েত অফিসে তাদের পরিচয় যাচাই করতে পারেন।" },
  ],
};

// Real historical decadal population of India (Census 1951–2011), in millions
const POP_HISTORY = [
  { year: "1951", pop: 361 },
  { year: "1961", pop: 439 },
  { year: "1971", pop: 548 },
  { year: "1981", pop: 683 },
  { year: "1991", pop: 846 },
  { year: "2001", pop: 1029 },
  { year: "2011", pop: 1210 },
];

const LITERACY_HISTORY = [
  { year: "1951", rate: 18.3 },
  { year: "1961", rate: 28.3 },
  { year: "1971", rate: 34.5 },
  { year: "1981", rate: 43.6 },
  { year: "1991", rate: 52.2 },
  { year: "2001", rate: 64.8 },
  { year: "2011", rate: 74.0 },
];

const SEX_RATIO = [
  { year: "1951", ratio: 946 },
  { year: "1961", ratio: 941 },
  { year: "1971", ratio: 930 },
  { year: "1981", ratio: 934 },
  { year: "1991", ratio: 927 },
  { year: "2001", ratio: 933 },
  { year: "2011", ratio: 943 },
];

/* ---------------------------------------------------------
   Small building blocks
--------------------------------------------------------- */
function Hairline() {
  return <div style={{ height: 1, background: COLORS.hairline, width: "100%" }} />;
}

function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 12.5,
      letterSpacing: "0.02em",
      color: COLORS.gold,
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: "'Newsreader', serif",
      fontWeight: 500,
      fontSize: "clamp(28px, 3.4vw, 42px)",
      lineHeight: 1.15,
      color: COLORS.text,
      margin: 0,
      maxWidth: 640,
    }}>
      {children}
    </h2>
  );
}

function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

function fmtIndian(n) {
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
}

/* ---------------------------------------------------------
   Main component
--------------------------------------------------------- */
export default function Census2027App() {
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [wizardStep, setWizardStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [assistantMsgs, setAssistantMsgs] = useState([]);
  const [assistantInput, setAssistantInput] = useState("");
  const t = STRINGS[lang];
  const ticker = useCountUp(572000, 2000);

  const filteredStates = STATE_DATA.filter(s =>
    s.state.toLowerCase().includes(query.toLowerCase())
  );

  const statusColor = (status) =>
    status === "announced" ? COLORS.green :
    status === "snowbound" ? COLORS.gold :
    COLORS.muted;

  const statusLabel = (status) => {
    const map = {
      en: { announced: "Dates announced", snowbound: "Snow-bound schedule", pending: "Awaiting notification" },
      hi: { announced: "तारीखें घोषित", snowbound: "हिमाच्छादित समय-सारणी", pending: "अधिसूचना की प्रतीक्षा" },
      ta: { announced: "தேதிகள் அறிவிக்கப்பட்டன", snowbound: "பனி காலம்", pending: "அறிவிப்புக்காக காத்திருப்பு" },
      bn: { announced: "তারিখ ঘোষিত", snowbound: "তুষার সময়সূচি", pending: "বিজ্ঞপ্তির অপেক্ষায়" },
    };
    return map[lang][status];
  };

  function askAssistant(qText) {
    if (!qText.trim()) return;
    const canned = [
      { key: /caste|जाति|சாதி|বর্ণ/i, en: "Caste is collected only in Phase II (Population Enumeration, Feb 2027) and published solely as aggregated statistics — never as individually identifiable data." },
      { key: /aadhaar|आधार|ஆதார்|আধার/i, en: "No, Aadhaar upload isn't required. Self-enumeration uses OTP verification on your mobile number." },
      { key: /deadline|last date|तारीख|கடைசி/i, en: "Self-enumeration windows vary by state — 15 days, scheduled between April and September 2026. Check the state lookup above for yours." },
      { key: /.*/i, en: "I can help with phase details, your state's schedule, privacy rules, or the self-enumeration steps — try asking about one of those." },
    ];
    const match = canned.find(c => c.key.test(qText)) || canned[canned.length - 1];
    setAssistantMsgs(m => [...m, { role: "user", text: qText }, { role: "bot", text: match.en }]);
    setAssistantInput("");
  }

  return (
    <div style={{
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'IBM Plex Sans', sans-serif",
      minHeight: "100vh",
      width: "100%",
    }}>
      <style>{FONTS}</style>

      {/* NAV */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 28px", position: "sticky", top: 0, zIndex: 50,
        background: "rgba(15,27,45,0.88)", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${COLORS.hairline}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: COLORS.gold,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <HomeIcon size={16} color={COLORS.bg} />
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: COLORS.muted }}>
            {t.kicker}
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setLangOpen(o => !o)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: `1px solid ${COLORS.hairline}`,
            color: COLORS.text, borderRadius: 8, padding: "7px 12px",
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, cursor: "pointer",
          }}>
            <Languages size={14} color={COLORS.gold} /> {t.langName} <ChevronDown size={14} />
          </button>
          {langOpen && (
            <div style={{
              position: "absolute", right: 0, top: 40, background: COLORS.surface,
              border: `1px solid ${COLORS.hairline}`, borderRadius: 8, overflow: "hidden",
              minWidth: 140, boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
            }}>
              {LANGS.map(l => (
                <div key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                  style={{
                    padding: "9px 14px", cursor: "pointer", fontSize: 13.5,
                    background: l === lang ? COLORS.surfaceAlt : "transparent",
                  }}>
                  {STRINGS[l].langName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: "72px 28px 56px", maxWidth: 1080, margin: "0 auto" }}>
        <Eyebrow>{t.kicker}</Eyebrow>
        <h1 style={{
          fontFamily: "'Newsreader', serif", fontWeight: 500,
          fontSize: "clamp(34px, 5.4vw, 60px)", lineHeight: 1.08,
          margin: "0 0 22px", maxWidth: 780, color: COLORS.text,
        }}>
          {t.heroTitle}
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 17, maxWidth: 560, lineHeight: 1.6, margin: "0 0 34px" }}>
          {t.heroSub}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}>
          <button style={{
            background: COLORS.gold, color: COLORS.bg, border: "none",
            borderRadius: 8, padding: "13px 22px", fontWeight: 600, fontSize: 14.5,
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          }}>
            {t.ctaPrimary} <ArrowRight size={16} />
          </button>
          <button style={{
            background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.hairline}`,
            borderRadius: 8, padding: "13px 22px", fontWeight: 500, fontSize: 14.5, cursor: "pointer",
          }}>
            {t.ctaSecondary}
          </button>
        </div>

        {/* ticker — signature hero moment */}
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(48px, 9vw, 96px)",
            fontWeight: 500, color: COLORS.gold, lineHeight: 1,
            letterSpacing: "-0.01em",
          }}>
            {fmtIndian(ticker)}
          </div>
          <div style={{ color: COLORS.text, fontSize: 15, marginTop: 10 }}>{t.tickerLabel}</div>
          <div style={{ color: COLORS.muted, fontSize: 12.5, marginTop: 4 }}>{t.tickerSource}</div>
        </div>
      </div>

      <Hairline />

      {/* PHASES */}
      <div style={{ padding: "64px 28px", maxWidth: 1080, margin: "0 auto" }}>
        <Eyebrow>{t.phasesEyebrow}</Eyebrow>
        <SectionTitle>{t.phasesTitle}</SectionTitle>
        <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 0 }}>
          {PHASES.map((p, i) => (
            <div key={p.n} style={{
              padding: "0 32px 0 0",
              borderLeft: i === 1 ? `1px solid ${COLORS.hairline}` : "none",
              paddingLeft: i === 1 ? 32 : 0,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: COLORS.gold }}>{p.n}</span>
                <span style={{ fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500 }}>{p.name[lang]}</span>
              </div>
              <div style={{
                display: "inline-block", background: COLORS.surface, borderRadius: 6,
                padding: "5px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5,
                color: COLORS.green, marginBottom: 18,
              }}>
                {p.window}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {p.collects[lang].map((c, ci) => (
                  <li key={ci} style={{
                    display: "flex", gap: 10, alignItems: "flex-start",
                    padding: "10px 0", borderTop: `1px solid ${COLORS.hairline}`,
                    fontSize: 14.5, color: COLORS.text, lineHeight: 1.5,
                  }}>
                    <Check size={15} color={COLORS.green} style={{ marginTop: 3, flexShrink: 0 }} />
                    {c}
                  </li>
                ))}
              </ul>
              <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
                {p.note[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Hairline />

      {/* STATE LOOKUP */}
      <div style={{ padding: "64px 28px", maxWidth: 1080, margin: "0 auto" }}>
        <Eyebrow>{t.stateEyebrow}</Eyebrow>
        <SectionTitle>{t.stateTitle}</SectionTitle>

        <div style={{
          marginTop: 32, display: "flex", alignItems: "center", gap: 10,
          background: COLORS.surface, border: `1px solid ${COLORS.hairline}`,
          borderRadius: 8, padding: "10px 14px", maxWidth: 440,
        }}>
          <Search size={16} color={COLORS.muted} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.stateSearchPlaceholder}
            style={{
              background: "transparent", border: "none", outline: "none",
              color: COLORS.text, fontSize: 14, width: "100%",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          />
        </div>

        <div style={{ marginTop: 28, maxHeight: 420, overflowY: "auto", border: `1px solid ${COLORS.hairline}`, borderRadius: 10 }}>
          {filteredStates.length === 0 && (
            <div style={{ padding: 24, color: COLORS.muted, fontSize: 14 }}>No matches.</div>
          )}
          {filteredStates.map((s, i) => (
            <div key={s.state} style={{
              display: "grid", gridTemplateColumns: "1.3fr 1fr 1.2fr 1fr",
              gap: 12, padding: "14px 18px", alignItems: "center",
              borderTop: i === 0 ? "none" : `1px solid ${COLORS.hairline}`,
              fontSize: 13.5,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                <MapPin size={14} color={COLORS.muted} /> {s.state}
              </div>
              <div style={{ color: COLORS.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}>{s.selfEnum}</div>
              <div style={{ color: COLORS.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}>{s.hlo}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor(s.status) }} />
                <span style={{ color: statusColor(s.status), fontSize: 12.5 }}>{statusLabel(s.status)}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 14 }}>
          Based on Press Information Bureau schedules released as of April 2026. States marked "awaiting notification" had not yet published a window as of this data snapshot — check your state government's gazette for the confirmed date rather than relying on unofficial sources.
        </p>
      </div>

      <Hairline />

      {/* WIZARD + ASSISTANT */}
      <div style={{ padding: "64px 28px", maxWidth: 1080, margin: "0 auto" }}>
        <Eyebrow>{t.wizardEyebrow}</Eyebrow>
        <SectionTitle>{t.wizardTitle}</SectionTitle>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "start" }}>
          {/* stepper */}
          <div>
            {WIZARD_STEPS[lang].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, cursor: "pointer" }} onClick={() => setWizardStep(i)}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                    background: i <= wizardStep ? COLORS.gold : "transparent",
                    color: i <= wizardStep ? COLORS.bg : COLORS.muted,
                    border: i <= wizardStep ? "none" : `1px solid ${COLORS.hairline}`,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  {i < WIZARD_STEPS[lang].length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 28, background: i < wizardStep ? COLORS.gold : COLORS.hairline }} />
                  )}
                </div>
                <div style={{ paddingBottom: 28 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 15,
                    color: i === wizardStep ? COLORS.text : COLORS.muted,
                    marginBottom: 6,
                  }}>
                    {step.t}
                  </div>
                  {i === wizardStep && (
                    <div style={{ color: COLORS.muted, fontSize: 13.5, lineHeight: 1.6, maxWidth: 400 }}>
                      {step.d}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* GenAI assistant */}
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Sparkles size={16} color={COLORS.gold} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Ask the Census assistant</span>
            </div>
            <div style={{ minHeight: 140, maxHeight: 220, overflowY: "auto", marginBottom: 12 }}>
              {assistantMsgs.length === 0 && (
                <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>
                  Try: "Is Aadhaar required?" or "What about caste data?"
                </div>
              )}
              {assistantMsgs.map((m, i) => (
                <div key={i} style={{
                  marginBottom: 10, textAlign: m.role === "user" ? "right" : "left",
                }}>
                  <span style={{
                    display: "inline-block", padding: "8px 12px", borderRadius: 10,
                    fontSize: 13, maxWidth: "85%", lineHeight: 1.5,
                    background: m.role === "user" ? COLORS.surfaceAlt : "rgba(217,164,65,0.12)",
                    color: COLORS.text,
                  }}>
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={assistantInput}
                onChange={e => setAssistantInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askAssistant(assistantInput)}
                placeholder="Ask a question…"
                style={{
                  flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.hairline}`,
                  borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none",
                }}
              />
              <button onClick={() => askAssistant(assistantInput)} style={{
                background: COLORS.gold, border: "none", borderRadius: 8, padding: "0 14px",
                cursor: "pointer",
              }}>
                <ArrowRight size={15} color={COLORS.bg} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Hairline />

      {/* TRUST & PRIVACY */}
      <div style={{ padding: "64px 28px", maxWidth: 1080, margin: "0 auto" }}>
        <Eyebrow>{t.trustEyebrow}</Eyebrow>
        <SectionTitle>{t.trustTitle}</SectionTitle>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: COLORS.green, fontSize: 13 }}>
          <ShieldCheck size={15} /> Census Act, 1948 — Section 15 confidentiality guarantee
        </div>

        <div style={{ marginTop: 32 }}>
          {TRUST_FAQ[lang].map((f, i) => (
            <div key={i} style={{ borderTop: `1px solid ${COLORS.hairline}` }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "18px 0", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, maxWidth: 780 }}>{f.q}</span>
                <ChevronDown size={16} color={COLORS.muted} style={{
                  transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 12,
                }} />
              </div>
              {openFaq === i && (
                <div style={{ paddingBottom: 20, color: COLORS.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 720 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Hairline />

      {/* DATA VIZ */}
      <div style={{ padding: "64px 28px", maxWidth: 1080, margin: "0 auto" }}>
        <Eyebrow>{t.dataEyebrow}</Eyebrow>
        <SectionTitle>{t.dataTitle}</SectionTitle>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          <div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>Population, in millions (1951–2011)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={POP_HISTORY}>
                <CartesianGrid stroke={COLORS.hairline} vertical={false} />
                <XAxis dataKey="year" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={{ stroke: COLORS.hairline }} />
                <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="pop" radius={[4, 4, 0, 0]}>
                  {POP_HISTORY.map((_, i) => (
                    <Cell key={i} fill={i === POP_HISTORY.length - 1 ? COLORS.gold : COLORS.surfaceAlt} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>Literacy rate, % (1951–2011)</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={LITERACY_HISTORY}>
                <CartesianGrid stroke={COLORS.hairline} vertical={false} />
                <XAxis dataKey="year" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={{ stroke: COLORS.hairline }} />
                <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="rate" stroke={COLORS.rust} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.rust }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>Sex ratio, females per 1000 males (1951–2011)</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={SEX_RATIO}>
                <CartesianGrid stroke={COLORS.hairline} vertical={false} />
                <XAxis dataKey="year" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={{ stroke: COLORS.hairline }} />
                <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} domain={[900, 960]} />
                <Tooltip contentStyle={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="ratio" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.green }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 20 }}>
          Historical figures from Census of India, 1951–2011. Census 2027 figures will be added here once the Registrar General publishes provisional totals.
        </p>
      </div>

      <Hairline />

      <div style={{ padding: "40px 28px", maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: COLORS.muted, fontSize: 12.5, maxWidth: 560 }}>{t.footerNote}</span>
        <span style={{ color: COLORS.muted, fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace" }}>PromptWars × ADYPU</span>
      </div>
    </div>
  );
}
