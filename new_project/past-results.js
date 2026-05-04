/* =============================
   LocateIQ - Past Results Script (FINAL with Backend)
   ============================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** آخر قائمة تحليلات معروضة (للبحث عن السجل عند النقر) */
let historyRecords = [];

function escapeHtml(text) {
  if (text == null) return "";
  const d = document.createElement("div");
  d.textContent = String(text);
  return d.innerHTML;
}

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

const I18N = {
  ar: {
    past_title: "النتائج السابقة",
    past_sub: "آخر 10 تحليلات قمت بها",
    nav_home: "الرئيسية",
    
    menu_title: "القائمة",
    menu_profile: "الملف الشخصي",
    menu_chat: "الشات",
    menu_past: "النتائج السابقة",
    menu_logout: "تسجيل الخروج",
    
    filter_all: "الكل",
    filter_high: "مناسب جداً",
    filter_medium: "مناسب متوسط",
    filter_low: "غير موصى به",
    
    search_placeholder: "بحث بالاسم...",
    
    location_label: "الموقع",
    date_label: "التاريخ",
    
    view_details: "عرض التفاصيل",
    view_map: "عرض على الخريطة",

    detail_location: "الموقع",
    detail_date: "التاريخ",
    detail_score: "النسبة",
    detail_cluster: "المجموعة",
    detail_user_msg: "طلبك",
    detail_ai_response: "نتيجة التحليل",
    detail_close: "إغلاق",
    
    no_results: "لا توجد نتائج سابقة بعد. قم بتحليل مشروعك الأول!",
    welcome_title: "مرحباً بك في عالم التحليلات!",
    start_analysis: "🚀 ابدأ التحليل الآن",
    loading_error: "حدث خطأ في تحميل البيانات",
    
    footer_rights: "جميع الحقوق محفوظة"
  },
  
  en: {
    past_title: "Past Results",
    past_sub: "Last 10 analyses you performed",
    nav_home: "Home",
    
    menu_title: "Menu",
    menu_profile: "Profile",
    menu_chat: "Chat",
    menu_past: "Past Results",
    menu_logout: "Logout",
    
    filter_all: "All",
    filter_high: "Highly Suitable",
    filter_medium: "Moderate",
    filter_low: "Not Recommended",
    
    search_placeholder: "Search by name...",
    
    location_label: "Location",
    date_label: "Date",
    
    view_details: "View Details",
    view_map: "View on Map",

    detail_location: "Location",
    detail_date: "Date",
    detail_score: "Score",
    detail_cluster: "Cluster",
    detail_user_msg: "Your request",
    detail_ai_response: "Analysis result",
    detail_close: "Close",
    
    no_results: "No past results yet. Start by analyzing your first project!",
    welcome_title: "Welcome to the world of analytics!",
    start_analysis: "🚀 Start Analyzing Now",
    loading_error: "Error loading data",
    
    footer_rights: "All rights reserved"
  }
};

const t = (lang, key) => I18N?.[lang]?.[key] ?? null;

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

// ============================================
// دالة جلب التحليلات السابقة من الباك إند
// ============================================
async function loadHistory() {
  const userId = getUserId();
  const lang = getSavedLang();
  const grid = $("#resultsGrid");
  
  if (!userId) return;
  if (!grid) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/investor/history.php?user_id=${encodeURIComponent(userId)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const analyses = await response.json();
    
    if (!analyses || analyses.length === 0) {
      renderEmptyState();
      return;
    }
    
    renderResults(analyses);
    
  } catch (error) {
    console.error("Error loading history:", error);
    grid.innerHTML = `
      <div class="no-results">
        <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
        <div style="font-size: 1.2rem; color: var(--orange); margin-bottom: 10px;">
          ${t(lang, "loading_error")}
        </div>
        <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 20px;">
          🔄 ${lang === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    `;
  }
}

// ============================================
// نافذة تفاصيل التحليل
// ============================================
function closeDetailsModal() {
  const modal = $("#detailsModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function openDetailsModal(analysis) {
  const lang = getSavedLang();
  const modal = $("#detailsModal");
  const title = $("#detailsModalTitle");
  const body = $("#detailsModalBody");
  const dismiss = $("#detailsModalDismiss");
  if (!modal || !title || !body) return;

  title.textContent = analysis.project_name || (lang === "ar" ? "تفاصيل التحليل" : "Analysis details");

  const dateStr = analysis.date
    ? new Date(analysis.date).toLocaleString(lang === "ar" ? "ar-SA" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : "—";

  const sc = typeof analysis.score === "number" ? analysis.score : parseFloat(analysis.score) || 0;
  const scoreStr = Number.isFinite(sc) ? `${sc.toFixed(2)}%` : "—";

  body.innerHTML = `
    <div class="details-modal__section">
      <div class="details-modal__meta-row">
        <span>📍 ${escapeHtml(t(lang, "detail_location"))}: ${escapeHtml(analysis.location || "—")}</span>
        <span>📅 ${escapeHtml(t(lang, "detail_date"))}: ${escapeHtml(dateStr)}</span>
      </div>
      <div class="details-modal__meta-row">
        <span>⭐ ${escapeHtml(t(lang, "detail_score"))}: ${escapeHtml(scoreStr)}</span>
        <span>🎯 ${escapeHtml(t(lang, "detail_cluster"))}: ${escapeHtml(String(analysis.cluster ?? "—"))}</span>
      </div>
    </div>
    <div class="details-modal__section">
      <span class="details-modal__label">${escapeHtml(t(lang, "detail_user_msg"))}</span>
      <p class="details-modal__text">${escapeHtml(analysis.message || "") || "—"}</p>
    </div>
    <div class="details-modal__section">
      <span class="details-modal__label">${escapeHtml(t(lang, "detail_ai_response"))}</span>
      <p class="details-modal__text">${escapeHtml(analysis.response || "") || "—"}</p>
    </div>
  `;

  if (dismiss) dismiss.textContent = t(lang, "detail_close") || "OK";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

// ============================================
// عرض النتائج في الجدول
// ============================================
function renderResults(analyses) {
  const grid = $("#resultsGrid");
  const lang = getSavedLang();
  
  if (!grid) return;
  
  // ترتيب حسب التاريخ (الأحدث أولاً)
  const sorted = [...analyses].sort((a, b) => new Date(b.date) - new Date(a.date));
  historyRecords = sorted;
  
  let html = '<div class="results-list">';
  
  sorted.forEach(analysis => {
    // تحديد درجة الملاءمة
    let suitabilityClass = "badge-low";
    let suitabilityText = "";
    
    const sc = typeof analysis.score === "number" ? analysis.score : parseFloat(analysis.score) || 0;
    if (sc >= 65) {
      suitabilityClass = "badge-high";
      suitabilityText = lang === "ar" ? "مناسب جداً" : "Highly Suitable";
    } else if (sc >= 35) {
      suitabilityClass = "badge-medium";
      suitabilityText = lang === "ar" ? "مناسب متوسط" : "Moderate";
    } else {
      suitabilityClass = "badge-low";
      suitabilityText = lang === "ar" ? "غير موصى به" : "Not Recommended";
    }
    
    const date = new Date(analysis.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US");
    const locationLabel = t(lang, "location_label");
    const dateLabel = t(lang, "date_label");
    const viewDetails = t(lang, "view_details");
    const viewMap = t(lang, "view_map");
    
    html += `
      <div class="result-card" data-id="${analysis.id}">
        <div class="result-info">
          <div class="result-title">${analysis.project_name}</div>
          <div class="result-meta">
            <span><span class="meta-ic">📍</span> ${locationLabel}: ${analysis.location}</span>
            <span><span class="meta-ic">📅</span> ${dateLabel}: ${date}</span>
            <span><span class="meta-ic">🎯</span> ${lang === "ar" ? "المجموعة" : "Cluster"}: ${analysis.cluster}</span>
          </div>
        </div>
        <div class="result-badge ${suitabilityClass}">
          <span>●</span>
          <span>${suitabilityText}</span>
        </div>
        <div class="result-actions">
          <button class="result-btn view-details" data-id="${analysis.id}">
            <span>🔍</span>
            <span>${viewDetails}</span>
          </button>
          <button class="result-btn view-map" data-id="${analysis.id}" data-location="${analysis.location}">
            <span>🗺️</span>
            <span>${viewMap}</span>
          </button>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  grid.innerHTML = html;
  
  // إضافة event listeners للأزرار
  $$(".view-details").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const row = historyRecords.find(r => String(r.id) === String(id));
      if (row) openDetailsModal(row);
    });
  });
  
  $$(".view-map").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const row = historyRecords.find(r => String(r.id) === String(id));
      const loc = row?.location ?? e.currentTarget.dataset.location ?? "";
      const score = row != null && row.score != null ? String(row.score) : "0";
      const qs = new URLSearchParams();
      qs.set("location", loc);
      qs.set("score", score);
      window.location.href = `dashboard.html?${qs.toString()}`;
    });
  });
}

// ============================================
// عرض الحالة الفارغة (عند عدم وجود نتائج)
// ============================================
function renderEmptyState() {
  const grid = $("#resultsGrid");
  if (!grid) return;

  const lang = getSavedLang();
  const message = t(lang, "no_results");
  const welcome = t(lang, "welcome_title");
  const startBtn = t(lang, "start_analysis");

  grid.innerHTML = `
    <div class="no-results">
      <div style="font-size: 4rem; margin-bottom: 20px;">📊</div>
      <div style="font-size: 1.5rem; font-weight: 900; margin-bottom: 10px; color: var(--orange);">
        ${welcome}
      </div>
      <div style="font-size: 1.1rem; color: var(--muted); line-height: 1.8; margin-bottom: 20px;">
        ${message}
      </div>
      <a href="dashboard.html" class="btn btn-primary" style="display: inline-flex; text-decoration: none;">
        <span>${startBtn}</span>
      </a>
    </div>
  `;
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // التحقق من تسجيل الدخول
  if (!checkAuth()) return;
  
  // اللغة
  applyLang(getSavedLang());

  // جلب التحليلات السابقة
  loadHistory();

  // زر اللغة
  const langBtn = $("#langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = getSavedLang() === "en" ? "ar" : "en";
      setSavedLang(next);
      applyLang(next);
      // إعادة تحميل البيانات بعد تغيير اللغة
      loadHistory();
    });
  }

  // القائمة الجانبية
  if (menuFab) menuFab.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const dm = $("#detailsModal");
      if (dm?.classList.contains("is-open")) {
        closeDetailsModal();
        return;
      }
      if (sideMenu?.classList.contains("open")) closeMenu();
    }
  });

  const detailsModalBackdrop = $("#detailsModalBackdrop");
  const detailsModalClose = $("#detailsModalClose");
  const detailsModalDismiss = $("#detailsModalDismiss");
  [detailsModalBackdrop, detailsModalClose, detailsModalDismiss].forEach(el => {
    if (el) el.addEventListener("click", closeDetailsModal);
  });

  // تسجيل الخروج
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

  // الفلاتر (للتحميل مستقبلاً)
  $$(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const filter = e.currentTarget.dataset.filter;
      console.log("Filter clicked:", filter);
      // TODO: إضافة فلترة للنتائج
    });
  });
});