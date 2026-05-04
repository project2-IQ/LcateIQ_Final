/* =============================
   LocateIQ - Dashboard Script (FINAL with Backend)
   ============================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const LANG_KEY = "locateiq_lang";
const getSavedLang = () => localStorage.getItem(LANG_KEY) || "ar";
const setSavedLang = (lang) => localStorage.setItem(LANG_KEY, lang);

// ============================================
// إعدادات الباك إند
// ============================================
const API_BASE_URL = new URL("api", window.location.href).href.replace(/\/+$/, "");

// ============================================
// دالة جلب user_id من localStorage
// ============================================
function getUserId() {
  return localStorage.getItem("user_id");
}

// ============================================
// دالة التحقق من تسجيل الدخول
// ============================================
function checkAuth() {
  const userId = getUserId();
  if (!userId) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/** Map API suitability strings to clear display labels (EN). */
function formatSuitabilityDisplay(lang, apiSuitability) {
  if (lang !== "en") return apiSuitability;
  const s = String(apiSuitability || "");
  if (s === "Moderate") return "Moderately Suitable";
  if (s === "Highly Suitable") return "Highly Suitable";
  if (s === "Not Recommended") return "Not Recommended";
  return s;
}

/** Human-readable location for chat (API still receives Arabic hints). */
function displayLocationName(lang, internalLocation) {
  if (lang !== "en") return internalLocation;
  if (internalLocation.includes("أبها") || /abha/i.test(internalLocation)) return "Abha";
  if (internalLocation.includes("خميس") || /khamis/i.test(internalLocation)) return "Khamis Mushait";
  if (internalLocation.includes("أحد") || /ahad|rifaidah/i.test(internalLocation)) return "Ahad Rufaidah";
  if (internalLocation === "عسير") return "Asir region";
  return internalLocation;
}

/** Human-readable project type for chat. */
function displayProjectTypeName(lang, internalType) {
  if (lang !== "en") return internalType;
  const map = {
    مقهى: "Cafe",
    مطعم: "Restaurant",
    متجر: "Retail / Shop",
    عام: "General"
  };
  return map[internalType] || internalType;
}

function normalizeApiResults(data, fallbackLocation) {
  if (Array.isArray(data?.results) && data.results.length) return data.results;
  return [{
    location: data?.location || fallbackLocation,
    suitability: data?.suitability,
    score: data?.score,
    latitude: data?.latitude,
    longitude: data?.longitude
  }];
}

function resolveProjectTypeHeuristic(text) {
  const lower = text.toLowerCase();
  if (text.includes("مقهى") || lower.includes("cafe") || lower.includes("coffee") || lower.includes("café")) return "مقهى";
  if (text.includes("مطعم") || lower.includes("restaurant")) return "مطعم";
  if (text.includes("متجر") || lower.includes("shop") || lower.includes("store")) return "متجر";
  return "عام";
}

function resolveLocationHeuristic(text) {
  if (text.includes("أبها") || /abha/i.test(text)) return "أبها";
  if (text.includes("خميس") || /khamis|mushait/i.test(text)) return "خميس مشيط";
  if (text.includes("أحد رفيدة") || /ahad|rifaidah/i.test(text)) return "أحد رفيدة";
  return "عسير";
}

/** Short explanation users understand (no technical jargon). */
function whyThisLocationText(lang, apiSuitability, score) {
  const s = String(apiSuitability || "");
  const sc = typeof score === "number" ? score : parseFloat(score) || 0;
  if (lang === "ar") {
    if (s === "مناسب جداً" || sc >= 65) {
      return "تم اختيار هذا الموقع لأنه يتماشى بقوة مع احتياجات مشروعك، مع كثافة سكانية جيدة وخدمات تدعم هذا النوع من الاستثمار.";
    }
    if (s === "مناسب متوسط" || (sc >= 35 && sc < 65)) {
      return "تم اختيار هذا الموقع لأنه يناسب متطلبات مشروعك بشكل معقول، مع الأخذ في الاعتبار الكثافة السكانية والمؤشرات المحيطة.";
    }
    return "أظهر التحليل أن هذا الموقع أقل ملاءمة حالياً مقارنةً بخيارات أخرى؛ راجع الكثافة السكانية والمنافسة قبل اتخاذ القرار النهائي.";
  }
  if (s === "Highly Suitable" || sc >= 65) {
    return "This location was chosen because it aligns strongly with your project—population density and local conditions support this kind of investment.";
  }
  if (s === "Moderate" || s === "Moderately Suitable" || (sc >= 35 && sc < 65)) {
    return "This location was chosen because it suits your project requirements based on population density and the surrounding indicators.";
  }
  return "The analysis suggests this area is a weaker match for now; consider comparing other locations with better population and market signals.";
}

const I18N = {
  ar: {
    dash_title: "LocateIQ | لوحة التحكم",
    nav_home: "الرئيسية",
    dash_h1: "محادثة تحليل الاستثمار",
    dash_sub: "اكتب متطلبات مشروعك، وستظهر النتائج المقترحة على الخريطة.",
    menu_title: "القائمة",
    menu_profile: "الملف الشخصي",
    menu_chat: "الشات",
    menu_past: "النتائج السابقة",
    menu_logout: "تسجيل الخروج",
    chat_title: "محادثة تحليل الاستثمار",
    chat_desc: "اكتب مميزات مشروعك وستظهر النتائج على الخريطة",
    chat_welcome: "أهلًا! اكتب مشروعك في عسير مثل: \"مقهى في أبها\" أو \"مطعم في خميس مشيط\".",
    chat_ph: "صف مشروعك...",
    bot_reply: "تم! هذه نتيجة أولية (تجريبية). لاحقًا بنربطها بالنموذج والخريطة الدقيقة.",
    analyzing: "جاري التحليل...",
    error_msg: "حدث خطأ أثناء التحليل. تأكد من تشغيل الخادم.",
    map_title: "خريطة الاستثمار - عسير",
    map_hint: "الخريطة ستظهر بعد إدخال وصف المشروع",
    lg_high: "مناسب جدًا",
    lg_high_t: "فرصة نجاح عالية بناءً على المؤشرات.",
    lg_mid: "مناسب متوسط",
    lg_mid_t: "مناسب مع بعض عوامل المخاطرة.",
    lg_low: "غير مُوصى به",
    lg_low_t: "إمكانية أقل بسبب السوق/المنافسة.",
    footer_rights: "جميع الحقوق محفوظة",
    result_header: "📊 نتائج التحليل",
    result_location: "📍 الموقع",
    result_type: "🏷️ نوع المشروع",
    result_suitability: "📈 مستوى الملاءمة",
    result_percent: "⭐ النسبة المئوية",
    result_coords: "📐 الإحداثيات (خط العرض، خط الطول)",
    result_map: "🗺️ تم تحديث الخريطة وفقاً للنتائج."
  },
  en: {
    dash_title: "LocateIQ | Dashboard",
    nav_home: "Home",
    dash_h1: "Investment Analysis Chat",
    dash_sub: "Describe your project requirements and results will appear on the map.",
    menu_title: "Menu",
    menu_profile: "Profile",
    menu_chat: "Chat",
    menu_past: "Past Results",
    menu_logout: "Logout",
    chat_title: "Investment Analysis Chat",
    chat_desc: "Describe your project features and results will appear on the map",
    chat_welcome: "Hi! Describe your Asir project like: “Coffee shop in Abha” or “Restaurant in Khamis Mushait”.",
    chat_ph: "Describe your project...",
    bot_reply: "Done! This is a demo output. Next we’ll connect the ML model and the accurate Asir map.",
    analyzing: "Analyzing...",
    error_msg: "Error during analysis. Make sure the server is running.",
    map_title: "Asir Region Investment Map",
    map_hint: "The map will appear after you describe your project",
    lg_high: "Highly Suitable",
    lg_high_t: "High success probability based on indicators.",
    lg_mid: "Moderate Suitability",
    lg_mid_t: "Suitable with some risk factors.",
    lg_low: "Not Recommended",
    lg_low_t: "Lower potential due to market/competition.",
    footer_rights: "All rights reserved",
    result_header: "📊 Analysis Results",
    result_location: "📍 Location",
    result_type: "🏷️ Project Type",
    result_suitability: "📈 Suitability Level",
    result_percent: "⭐ Percentage",
    result_coords: "📐 Coordinates (latitude, longitude)",
    result_map: "🗺️ Map updated according to the results."
  }
};

const t = (lang, key) => I18N?.[lang]?.[key] ?? null;

/** إزالة مؤكدة لرسالة "جاري التحليل" (لا تعتمد على مطابقة النص) */
function removeAnalyzingMessage() {
  const chatBody = $("#chatBody");
  if (!chatBody) return;
  chatBody.querySelectorAll(".msg-analyzing").forEach((el) => el.remove());
}

function addAnalyzingMessage(lang) {
  const chatBody = $("#chatBody");
  if (!chatBody) return;
  const wrap = document.createElement("div");
  wrap.className = "msg bot msg-analyzing";
  wrap.setAttribute("role", "status");
  wrap.setAttribute("aria-live", "polite");
  const ic = document.createElement("div");
  ic.className = "msg-ic";
  ic.setAttribute("aria-hidden", "true");
  ic.textContent = "🤖";
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = t(lang, "analyzing") || (lang === "ar" ? "جاري التحليل..." : "Analyzing...");
  wrap.appendChild(ic);
  wrap.appendChild(bubble);
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function applyI18nToDom(lang) {
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(lang, key);
    if (val != null) el.textContent = val;
  });
  $$("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = t(lang, key);
    if (val != null) el.setAttribute("placeholder", val);
  });
  const titleEl = $("title[data-i18n-title]");
  if (titleEl) {
    const key = titleEl.getAttribute("data-i18n-title");
    const val = t(lang, key);
    if (val) document.title = val;
  }
}

function applyLang(lang) {
  const isEnglish = lang === "en";
  document.documentElement.lang = isEnglish ? "en" : "ar";
  document.documentElement.dir = isEnglish ? "ltr" : "rtl";
  const langText = $("#langText");
  if (langText) langText.textContent = isEnglish ? "العربية" : "English";
  applyI18nToDom(lang);
}

// ===== SIDE MENU =====
const menuFab = $("#menuFab");
const menuClose = $("#menuClose");
const sideMenu = $("#sideMenu");
const menuOverlay = $("#menuOverlay");

function openMenu() {
  if (!sideMenu || !menuOverlay) return;
  sideMenu.classList.add("open");
  menuOverlay.classList.add("active");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!sideMenu || !menuOverlay) return;
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("active");
  document.body.classList.remove("menu-open");
}

// ===== CHAT =====
function addMessage(type, text) {
  const chatBody = $("#chatBody");
  if (!chatBody) return;
  const wrap = document.createElement("div");
  wrap.className = "msg " + (type === "user" ? "user" : "bot");
  const ic = document.createElement("div");
  ic.className = "msg-ic";
  ic.setAttribute("aria-hidden", "true");
  ic.textContent = type === "user" ? "🧑" : "🤖";
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;
  wrap.appendChild(ic);
  wrap.appendChild(bubble);
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ============================================
// دالة تحليل المشروع (ربط مع الباك إند)
// ============================================
async function analyzeProject(projectText) {
  const lang = getSavedLang();
  const userId = getUserId();

  if (!userId) {
    addMessage("bot", lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
    window.location.href = "login.html";
    return;
  }

  addAnalyzingMessage(lang);

  try {
    const projectType = resolveProjectTypeHeuristic(projectText);
    const location = resolveLocationHeuristic(projectText);

    const response = await fetch(`${API_BASE_URL}/investor/analyze.php?userID=${encodeURIComponent(userId)}&lang=${encodeURIComponent(lang)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_name: projectText,
        project_type: projectType,
        location: location
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(typeof data?.detail === "string" ? data.detail : `HTTP ${response.status}`);
    }

    removeAnalyzingMessage();

    const typeDisplay = displayProjectTypeName(lang, projectType);
    const results = normalizeApiResults(data, location).slice(0, 3);
    const best = results[0] || {};
    const bestScoreNum = typeof best.score === "number" ? best.score : parseFloat(best.score);
    const why = whyThisLocationText(lang, best.suitability, bestScoreNum);
    const lines = results.map((item, idx) => {
      const locDisplay = displayLocationName(lang, item.location || location);
      const suitDisplay = formatSuitabilityDisplay(lang, item.suitability);
      const scoreNum = typeof item.score === "number" ? item.score : parseFloat(item.score);
      const scoreStr = Number.isFinite(scoreNum) ? scoreNum.toFixed(2) : String(item.score ?? "");
      const latNum = typeof item.latitude === "number" ? item.latitude : parseFloat(item.latitude);
      const lngNum = typeof item.longitude === "number" ? item.longitude : parseFloat(item.longitude);
      const coordsLine =
        Number.isFinite(latNum) && Number.isFinite(lngNum)
          ? `\n${t(lang, "result_coords")}: ${latNum.toFixed(5)}, ${lngNum.toFixed(5)}`
          : "";
      return `${idx + 1}) ${t(lang, "result_location")}: ${locDisplay}\n${t(lang, "result_suitability")}: ${suitDisplay}\n${t(lang, "result_percent")}: ${scoreStr}%${coordsLine}`;
    });

    const resultText =
      `${why}\n\n` +
      `${t(lang, "result_header")}\n` +
      `${t(lang, "result_type")}: ${typeDisplay}\n\n` +
      `${lines.join("\n\n")}\n\n` +
      `${t(lang, "result_map")}`;

    addMessage("bot", resultText);
    updateMapWithResults(results, location);
  } catch (error) {
    console.error("Analysis error:", error);
    removeAnalyzingMessage();
    addMessage("bot", (t(lang, "error_msg") || "") + (error.message ? "\n" + error.message : ""));
  } finally {
    removeAnalyzingMessage();
  }
}

// ============================================
// تحديث الخريطة حسب نتيجة التحليل (حتى 3 مواقع)
// ============================================
function updateMapWithResults(results, fallbackLocation) {
  const map = window.locateiqMap;
  if (!map || typeof L === "undefined") return;

  if (window.analysisLayer) {
    window.analysisLayer.clearLayers();
  } else {
    window.analysisLayer = L.layerGroup().addTo(map);
  }

  const lang = getSavedLang();
  const bounds = [];
  normalizeApiResults({ results }, fallbackLocation).slice(0, 3).forEach((item) => {
    let color = "#ef4444";
    if (item.suitability === "مناسب جداً" || item.suitability === "Highly Suitable") color = "#22c55e";
    else if (item.suitability === "مناسب متوسط" || item.suitability === "Moderate") color = "#facc15";

    const dLat = typeof item.latitude === "number" ? item.latitude : parseFloat(item.latitude);
    const dLng = typeof item.longitude === "number" ? item.longitude : parseFloat(item.longitude);
    let lat = 18.2164;
    let lng = 42.5053;
    const location = item.location || fallbackLocation;

    if (Number.isFinite(dLat) && Number.isFinite(dLng)) {
      lat = dLat;
      lng = dLng;
    } else if (location === "خميس مشيط") {
      lat = 18.3000;
      lng = 42.7333;
    } else if (location === "أحد رفيدة") {
      lat = 18.2000;
      lng = 42.9500;
    }

    const placeName = displayLocationName(lang, location);
    const suitLabel = formatSuitabilityDisplay(lang, item.suitability);
    const scoreNum = typeof item.score === "number" ? item.score : parseFloat(item.score);
    const scoreLabel = Number.isFinite(scoreNum) ? scoreNum.toFixed(2) : String(item.score ?? "");
    const label = `${suitLabel} (${scoreLabel}%)`;
    const coordText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const popupHtml =
      `<b>${placeName}</b><br>${label}<br><small>${lang === "ar" ? "إحداثيات" : "Coords"}: ${coordText}</small>`;

    L.circleMarker([lat, lng], {
      radius: 12,
      color: color,
      fillColor: color,
      fillOpacity: 0.9,
      weight: 2
    }).addTo(window.analysisLayer).bindPopup(popupHtml);
    bounds.push([lat, lng]);
  });

  if (bounds.length === 1) {
    map.setView(bounds[0], 10);
  } else if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
}

// ============================================
// تهيئة الخريطة (Leaflet)
// ============================================
function initMap() {
  const mapElement = document.getElementById("asirMap");
  if (!mapElement || typeof L === "undefined") return;
  const map = L.map("asirMap").setView([18.2164, 42.5053], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  window.locateiqMap = map;
  const cities = [
    { name: "أبها", nameEn: "Abha", lat: 18.2164, lng: 42.5053 },
    { name: "خميس مشيط", nameEn: "Khamis Mushait", lat: 18.3000, lng: 42.7333 },
    { name: "أحد رفيدة", nameEn: "Ahad Rufaidah", lat: 18.2000, lng: 42.9500 }
  ];
  const lang = getSavedLang();
  cities.forEach(city => {
    const cityName = lang === "ar" ? city.name : city.nameEn;
    L.marker([city.lat, city.lng]).addTo(map).bindPopup(`<b>${cityName}</b>`);
  });
  setTimeout(() => map.invalidateSize(), 300);
}

/**
 * فتح لوحة التحكم من النتائج السابقة: ?location=...&score=...
 * يضع دائرة ملونة على الخريطة حسب النسبة (نفس منطق التحليل المباشر).
 */
function applyPastResultFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const loc = (params.get("location") || "").trim();
  if (!loc) return;

  const score = parseFloat(params.get("score") || "0");
  const lang = getSavedLang();
  let suitability;
  if (score >= 65) {
    suitability = lang === "ar" ? "مناسب جداً" : "Highly Suitable";
  } else if (score >= 35) {
    suitability = lang === "ar" ? "مناسب متوسط" : "Moderate";
  } else {
    suitability = lang === "ar" ? "غير مُوصى به" : "Not Recommended";
  }

  const displayLoc = displayLocationName(lang, loc);
  const sc = Number.isFinite(score) ? score : 0;
  updateMapWithResults([{ location: loc, suitability, score: sc, latitude: NaN, longitude: NaN }], loc);

  const mapOverlay = $("#mapOverlay");
  if (mapOverlay) mapOverlay.style.display = "none";
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) return;
  applyLang(getSavedLang());
  initMap();
  applyPastResultFromQueryString();

  const langBtn = $("#langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = getSavedLang() === "en" ? "ar" : "en";
      setSavedLang(next);
      applyLang(next);
      if (window.locateiqMap) window.locateiqMap.remove();
      initMap();
    });
  }

  if (menuFab) menuFab.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu?.classList.contains("open")) closeMenu();
  });

  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      window.location.href = "login.html";
    });
  }

  const attachBtn = $("#attachBtn");
  if (attachBtn) {
    attachBtn.addEventListener("click", () => {
      alert(getSavedLang() === "ar" ? "سيتم إضافة خاصية رفع الصور قريبًا" : "Image upload feature coming soon");
    });
  }

  const chatForm = $("#chatForm");
  const chatInput = $("#chatText");
  const mapOverlay = $("#mapOverlay");
  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const txt = (chatInput?.value || "").trim();
      if (!txt) return;
      addMessage("user", txt);
      if (chatInput) chatInput.value = "";
      if (mapOverlay) mapOverlay.style.display = "none";
      await analyzeProject(txt);
    });
  }
});