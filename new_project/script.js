/* =============================
   LocateIQ - Home Script (i18n + Smooth Scroll) [FIXED]
   ============================= */

/* ---------- Helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const LANG_KEY = "locateiq_lang"; // 'ar' or 'en'
const getSavedLang = () => localStorage.getItem(LANG_KEY) || "ar";
const setSavedLang = (lang) => localStorage.setItem(LANG_KEY, lang);

function safeText(el, value) { if (el) el.textContent = value; }
function safeHTML(el, value) { if (el) el.innerHTML = value; }

/* ---------- i18n Dictionary ---------- */
/* ملاحظة مهمة: المفاتيح هنا لازم تطابق data-i18n في الـ HTML */
const I18N = {
  ar: {
    home_title: "LocateIQ | الصفحة الرئيسية",
    nav_home: "الرئيسية",

    btn_about: "عن LocateIQ",
    btn_login: "تسجيل الدخول",
    btn_how: "كيفية الاستخدام",

    hero_tagline: "قرارات استثمارية مدعومة بالبيانات والذكاء.",
    hero_title: `استثمر بذكاء مع <span class="brand-glow">LocateIQ</span>`,
    hero_subtitle: "اكتشف أفضل المواقع الاستثمارية باستخدام الذكاء الاصطناعي والتحليل المكاني.",

    how_title_prefix: "كيفية استخدام",
    how_subtitle: "اتبع هذه الخطوات البسيطة لاختيار موقع استثماري مناسب بثقة.",

    s1_title: "أنشئ حساب / سجّل الدخول",
    s1_text: "ابدأ بإنشاء حساب جديد أو تسجيل الدخول للوصول للمنصة.",
    s2_title: "حدد نوع مشروعك",
    s2_text: "حدّد النشاط (مطعم، مقهى، متجر… إلخ) لتخصيص التحليل.",
    s3_title: "أدخل متطلباتك وموقع الاهتمام",
    s3_text: "اكتب تفضيلاتك (ميزانية/مساحة/نطاق) وحدد المنطقة المراد دراستها.",
    s4_title: "اعرض التحليل بالذكاء الاصطناعي",
    s4_text: "يعرض النظام نقاط القوة والمخاطر والمؤشرات المكانية بشكل مبسّط.",
    s5_title: "استكشف النتائج على الخريطة",
    s5_text: "شاهد أفضل المواقع المقترحة وتصفّحها ووازن بينها بسهولة",
    s6_title: "احفظ التقرير واتخذ قرارك",
    s6_text: "احفظ النتائج للرجوع لها لاحقاً",

    /* ===== ABOUT (مطابق للـ HTML حقك) ===== */
    about_kicker: "منصة توصية مواقع استثمارية",
    about_title_prefix: "عن",
    about_sub:
      "LocateIQ يساعد المستثمرين على اختيار الموقع الأنسب عبر تحليل مكاني وذكاء اصطناعي مبني على البيانات.",

    about_c1_title: "تركيز على عسير",
    about_c1_text: "توصيات مخصّصة لمدن مثل أبها وخميس مشيط مع مؤشرات مكانية محلية.",

    about_c2_title: "تحليل ذكي",
    about_c2_text: "مقارنة الكثافة السكانية والمنافسين والخدمات لإخراج تقييم واضح ومقنع.",

    about_c3_title: "قرار مدعوم بالخريطة",
    about_c3_text: "عرض النتائج على الخريطة مع مواقع مقترحة قابلة للمقارنة بسرعة.",

    about_mission_title: "مهمتنا",
    about_mission_text:
      "تبسيط اتخاذ القرار الاستثماري عبر منصة تجمع البيانات والتحليل المكاني والذكاء الاصطناعي في تجربة واحدة أنيقة.",

    about_vision_title: "رؤيتنا",
    about_vision_text:
      "أن يكون LocateIQ المرجع الأول لتحديد أفضل المواقع الاستثمارية في منطقة عسير — ثم التوسع لباقي مناطق المملكة.",

    stat1: "تحليل وتوصيات",
    stat2: "مؤشرات مكانية",
    stat3: "تركيز محلي"
  },

  en: {
    home_title: "LocateIQ | Home",
    nav_home: "Home",

    btn_about: "About LocateIQ",
    btn_login: "Sign In",
    btn_how: "How to use",

    hero_tagline: "Data- and intelligence-driven investment decisions.",
    hero_title: `Invest Smart with <span class="brand-glow">LocateIQ</span>`,
    hero_subtitle: "Discover the best investment locations using AI and spatial analysis.",

    how_title_prefix: "How to use",
    how_subtitle: "Follow these simple steps to choose an investment location with confidence.",

    s1_title: "Create an account / Sign in",
    s1_text: "Start by creating a new account or signing in to access the platform.",
    s2_title: "Choose your project type",
    s2_text: "Select your activity (restaurant, café, store, etc.) to tailor the analysis.",
    s3_title: "Enter your requirements & area of interest",
    s3_text: "Provide your preferences (budget/area/range) and pick the area to study.",
    s4_title: "View the AI analysis",
    s4_text: "See strengths, risks, and spatial indicators in a simplified way.",
    s5_title: "Explore results on the map",
    s5_text: "Browse the best suggested locations and compare them easily.",
    s6_title: "Save the report & decide",
    s6_text: "Save your results to revisit them later.",

    /* ===== ABOUT (matches your HTML) ===== */
    about_kicker: "Investment location recommendation platform",
    about_title_prefix: "About",
    about_sub:
      "LocateIQ helps investors choose the best location using data-driven AI and spatial analysis.",

    about_c1_title: "Asir-focused",
    about_c1_text: "Localized recommendations for cities like Abha and Khamis Mushait with local spatial indicators.",

    about_c2_title: "Smart analysis",
    about_c2_text: "Compare population density, competitors, and services to deliver clear, convincing evaluation.",

    about_c3_title: "Map-backed decision",
    about_c3_text: "View results on the map with suggested locations for quick comparison.",

    about_mission_title: "Our Mission",
    about_mission_text:
      "Simplify investment decisions through an elegant platform combining data, GIS, and AI in one experience.",

    about_vision_title: "Our Vision",
    about_vision_text:
      "Make LocateIQ the leading reference for selecting the best investment locations in Asir—then expand across Saudi Arabia.",

    stat1: "Insights & Recommendations",
    stat2: "Spatial Indicators",
    stat3: "Local Focus"
  }
};

const t = (lang, key) => I18N?.[lang]?.[key] ?? null;

/* ---------- Apply i18n ---------- */
function applyI18nToDom(lang) {
  // translate elements with data-i18n
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(lang, key);
    if (val == null) return;

    // hero title only needs HTML (span brand-glow)
    if (key === "hero_title") safeHTML(el, val);
    else safeText(el, val);
  });

  // fallback for hero if not using data-i18n on them
  const heroTitle = $(".title");
  const heroSub   = $(".subtitle");
  const heroTag   = $(".tagline");

  const h1Val  = t(lang, "hero_title");
  const subVal = t(lang, "hero_subtitle");
  const tagVal = t(lang, "hero_tagline");

  if (heroTitle && h1Val) safeHTML(heroTitle, h1Val);
  if (heroSub && subVal)  safeText(heroSub, subVal);
  if (heroTag && tagVal)  safeText(heroTag, tagVal);

  // page title (supports <title data-i18n-title="home_title">)
  const titleEl = document.querySelector("title[data-i18n-title]");
  if (titleEl) {
    const k = titleEl.getAttribute("data-i18n-title");
    const v = t(lang, k);
    if (v) document.title = v;
  } else {
    const pageTitle = t(lang, "home_title");
    if (pageTitle) document.title = pageTitle;
  }
}

/* ---------- Language apply ---------- */
/* --- Language apply (محدث مع دعم how page) --- */
function applyLang(lang) {
  const isEnglish = lang === "en";
  document.documentElement.lang = isEnglish ? "en" : "ar";
  document.documentElement.dir  = isEnglish ? "ltr" : "rtl";

  // تبديل نص زر اللغة
  const langText = document.getElementById("langText");
  if (langText) {
    langText.textContent = isEnglish ? "العربية" : "English";
  }

  // إخفاء/إظهار العناصر حسب اللغة
  // كل العناصر العربية
  const arElements = document.querySelectorAll(`
    [data-i18n$="_ar"], 
    .how-hero-title-arabic, 
    .how-hero-sub-arabic, 
    .step-title-arabic, 
    .step-text-arabic, 
    .cta-title-arabic,
    .how-title-arabic,
    .how-sub-arabic
    
  `);
  
  // كل العناصر الإنجليزية
  const enElements = document.querySelectorAll(`
    [data-i18n$="_en"], 
    .how-hero-title-english, 
    .how-hero-sub-english, 
    .step-title-english, 
    .step-text-english, 
    .cta-title-english,
    .how-title-english,
    .how-sub-english
  `);

  arElements.forEach(el => el.style.display = isEnglish ? 'none' : 'block');
  enElements.forEach(el => el.style.display = isEnglish ? 'block' : 'none');

  // تحديث باقي النصوص
  applyI18nToDom(lang);


  applyI18nToDom(lang);
}

/* ---------- Smooth Scroll (Offset topbar) ---------- */
function getTopbarOffset() {
  const topbar = document.querySelector(".topbar");
  return topbar ? Math.ceil(topbar.getBoundingClientRect().height) + 12 : 12;
}

function smoothToHash(hash) {
  const id = (hash || "").replace("#", "");
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - getTopbarOffset();
  window.scrollTo({ top: y, behavior: "smooth" });
}

function wireSmoothLinks() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      history.pushState(null, "", href);
      smoothToHash(href);
    });
  });

  if (location.hash) {
    setTimeout(() => smoothToHash(location.hash), 50);
  }

  window.addEventListener("popstate", () => {
    if (location.hash) smoothToHash(location.hash);
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyLang(getSavedLang());
  wireSmoothLinks();

  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = getSavedLang() === "en" ? "ar" : "en";
      setSavedLang(next);
      applyLang(next);
    });
  }
});