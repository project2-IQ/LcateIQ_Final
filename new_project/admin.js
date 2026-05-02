/* =============================
   LocateIQ - Admin Panel (FINAL with Backend)
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

// الترجمة الكاملة
const I18N = {
  ar: {
    admin_title: "LocateIQ | لوحة تحكم الأدمن",
    users_title: "LocateIQ | إدارة المستخدمين",
    data_title: "LocateIQ | إدارة البيانات",
    settings_title: "LocateIQ | إعدادات النظام",
    
    home: "الرئيسية",
    users: "المستخدمين",
    data: "البيانات",
    settings: "الإعدادات",
    user_dashboard: "واجهة المستخدم",
    customize_theme: "تخصيص المظهر",
    logout: "تسجيل الخروج",
    admin_role: "مدير النظام",
    
    admin_dashboard_title: "لوحة تحكم الأدمن",
    admin_dashboard_sub: "مرحباً بك في لوحة التحكم، يمكنك إدارة النظام والإشراف على المستخدمين",
    
    users_sub: "عرض وإدارة جميع مستخدمي المنصة",
    data_sub: "إضافة وتعديل المناطق، المؤشرات، والبيانات الجغرافية",
    settings_sub: "تخصيص إعدادات المنصة والتحكم بالمعايير",
    
    total_users: "إجمالي المستخدمين",
    total_analyses: "إجمالي التحليلات",
    active_now: "نشط الآن",
    
    id: "#",
    name: "الاسم",
    email: "البريد",
    role: "الدور",
    reg_date: "تاريخ التسجيل",
    status: "الحالة",
    actions: "إجراءات",
    user_role: "مستخدم",
    admin_role_table: "أدمن",
    active: "نشط",
    inactive: "غير نشط",
    edit: "تعديل",
    delete: "حذف",
    view: "عرض",
    
    search_users: "بحث عن مستخدم...",
    add_user: "إضافة مستخدم",
    
    // رسائل
    loading_error: "حدث خطأ في تحميل البيانات",
    delete_confirm: "هل أنت متأكد من حذف هذا المستخدم؟",
    delete_success: "تم حذف المستخدم بنجاح",
    delete_error: "حدث خطأ في حذف المستخدم",
    
    footer_rights: "جميع الحقوق محفوظة",
    vs_code_opening: "جاري فتح المشروع في VS Code...",
    vs_code_error: "تعذر فتح VS Code. تأكدي من تثبيته والمسار الصحيح.",
    nav_home: "الرئيسية"
  },
  
  en: {
    admin_title: "LocateIQ | Admin Dashboard",
    users_title: "LocateIQ | Users Management",
    data_title: "LocateIQ | Data Management",
    settings_title: "LocateIQ | System Settings",
    
    home: "Home",
    users: "Users",
    data: "Data",
    settings: "Settings",
    user_dashboard: "User Dashboard",
    customize_theme: "Customize Theme",
    logout: "Logout",
    admin_role: "System Admin",
    
    admin_dashboard_title: "Admin Dashboard",
    admin_dashboard_sub: "Welcome to the admin panel, you can manage the system and oversee users",
    
    users_sub: "View and manage all platform users",
    data_sub: "Add and edit regions, indicators, and geographic data",
    settings_sub: "Customize platform settings and control parameters",
    
    total_users: "Total Users",
    total_analyses: "Total Analyses",
    active_now: "Active Now",
    
    id: "#",
    name: "Name",
    email: "Email",
    role: "Role",
    reg_date: "Reg. Date",
    status: "Status",
    actions: "Actions",
    user_role: "User",
    admin_role_table: "Admin",
    active: "Active",
    inactive: "Inactive",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    
    search_users: "Search users...",
    add_user: "Add User",
    
    // Messages
    loading_error: "Error loading data",
    delete_confirm: "Are you sure you want to delete this user?",
    delete_success: "User deleted successfully",
    delete_error: "Error deleting user",
    
    footer_rights: "All rights reserved",
    vs_code_opening: "Opening project in VS Code...",
    vs_code_error: "Could not open VS Code. Make sure it is installed and the path is correct.",
    nav_home: "Home"
  }
};

// التحقق من صلاحية الأدمن
function checkAdminAccess() {
  const role = localStorage.getItem("user_role");
  const isLoggedIn = localStorage.getItem("is_logged_in");
  
  if (!isLoggedIn || role !== "admin") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// ============================================
// تحديث الإحصائيات من الباك إند
// ============================================
async function updateStats() {
  const lang = getSavedLang();
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const stats = await response.json();
    
    const totalUsers = $("#totalUsers");
    const totalAnalyses = $("#totalAnalyses");
    const activeNow = $("#activeNow");
    
    if (totalUsers) totalUsers.textContent = stats.total_users || "0";
    if (totalAnalyses) totalAnalyses.textContent = stats.total_analyses || "0";
    if (activeNow) activeNow.textContent = stats.active_now || "0";
    
  } catch (error) {
    console.error("Error loading stats:", error);
    // عرض أصفار في حالة الخطأ
    const totalUsers = $("#totalUsers");
    const totalAnalyses = $("#totalAnalyses");
    const activeNow = $("#activeNow");
    
    if (totalUsers) totalUsers.textContent = "0";
    if (totalAnalyses) totalAnalyses.textContent = "0";
    if (activeNow) activeNow.textContent = "0";
  }
}

// ============================================
// جلب قائمة المستخدمين من الباك إند
// ============================================
async function loadUsers() {
  const lang = getSavedLang();
  const tbody = $("#usersTableBody");
  
  if (!tbody) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const users = await response.json();
    
    if (!users || users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>${lang === "ar" ? "لا يوجد مستخدمين بعد" : "No users yet"}</p>
          </td>
        </tr>
      `;
      return;
    }
    
    renderUsersTable(users);
    
  } catch (error) {
    console.error("Error loading users:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-icon">⚠️</div>
          <p>${lang === "ar" ? "حدث خطأ في تحميل البيانات" : "Error loading data"}</p>
        </td>
      </tr>
    `;
  }
}

// ============================================
// عرض المستخدمين في الجدول
// ============================================
function renderUsersTable(users) {
  const tbody = $("#usersTableBody");
  const lang = getSavedLang();
  const isAr = lang === "ar";
  
  if (!tbody) return;
  
  let html = "";
  
  users.forEach(user => {
    const statusClass = user.status === "active" ? "active" : "inactive";
    const statusText = user.status === "active" 
      ? (isAr ? "نشط" : "Active") 
      : (isAr ? "غير نشط" : "Inactive");
    
    const roleText = user.role === "admin" 
      ? (isAr ? "أدمن" : "Admin") 
      : (isAr ? "مستخدم" : "User");
    
    const date = user.created_at ? new Date(user.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US") : "-";
    
    html += `
      <tr data-user-id="${user.id}">
        <td>${user.id}</td>
        <td>${user.name || "-"}</td>
        <td>${user.email || "-"}</td>
        <td><span class="role-badge ${user.role === "admin" ? "admin" : "user"}">${roleText}</span></td>
        <td>${date}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <button class="action-btn edit-user" data-id="${user.id}">
            <span>✏️</span> ${isAr ? "تعديل" : "Edit"}
          </button>
          <button class="action-btn delete-user" data-id="${user.id}">
            <span>🗑️</span> ${isAr ? "حذف" : "Delete"}
          </button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  
  // ربط أحداث الأزرار
  bindUserButtons();
}

// ============================================
// ربط أحداث أزرار المستخدمين
// ============================================
function bindUserButtons() {
  const lang = getSavedLang();
  
  // أزرار التعديل
  $$(".edit-user").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.currentTarget.dataset.id;
      alert(lang === "ar" ? `تعديل المستخدم ${id} (محاكاة)` : `Edit user ${id} (demo)`);
    });
  });
  
  // أزرار الحذف (مع ربط الباك إند)
  $$(".delete-user").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const userId = e.currentTarget.dataset.id;
      
      if (confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?")) {
        try {
          const response = await fetch(`${API_BASE_URL}/admin/user_delete.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: Number(userId) })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          alert(lang === "ar" ? "تم حذف المستخدم بنجاح" : "User deleted successfully");
          
          // إعادة تحميل القائمة
          loadUsers();
          
        } catch (error) {
          console.error("Error deleting user:", error);
          alert(lang === "ar" ? "حدث خطأ في حذف المستخدم" : "Error deleting user");
        }
      }
    });
  });
}

// ============================================
// تحديث اللغة
// ============================================
function applyLanguage(lang) {
  const isAr = lang === "ar";
  
  document.documentElement.lang = isAr ? "ar" : "en";
  document.documentElement.dir = isAr ? "rtl" : "ltr";
  
  const langText = $("#langText");
  if (langText) langText.textContent = isAr ? "English" : "العربية";
  
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (I18N[lang][key]) {
      el.textContent = I18N[lang][key];
    }
  });
  
  $$("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (I18N[lang][key]) {
      el.placeholder = I18N[lang][key];
    }
  });
  
  const titleKey = document.querySelector("title")?.getAttribute("data-i18n");
  if (titleKey && I18N[lang][titleKey]) {
    document.title = I18N[lang][titleKey];
  }
  
  // تحديث المحتوى الديناميكي
  $$(".role-badge.admin").forEach(badge => {
    badge.textContent = isAr ? "أدمن" : "Admin";
  });
  
  $$(".role-badge.user").forEach(badge => {
    badge.textContent = isAr ? "مستخدم" : "User";
  });
  
  $$(".status-badge.active").forEach(badge => {
    badge.textContent = isAr ? "نشط" : "Active";
  });
  
  $$(".status-badge.inactive").forEach(badge => {
    badge.textContent = isAr ? "غير نشط" : "Inactive";
  });
}

// ============================================
// ربط الأحداث العامة
// ============================================
function bindEvents() {
  // زر تخصيص المظهر
  $("#themeCustomizer")?.addEventListener("click", (e) => {
    e.preventDefault();
    const lang = getSavedLang();
    
    try {
      const projectPath = encodeURIComponent('C:\\Users\\jf645\\OneDrive\\سطح المكتب\\Frontend');
      window.location.href = `vscode://file/${projectPath}`;
      alert(I18N[lang].vs_code_opening);
    } catch (error) {
      alert(I18N[lang].vs_code_error);
    }
  });

  // تسجيل الخروج
  $("#logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    window.location.href = "login.html";
  });
}

// ============================================
// تهيئة الصفحة
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAdminAccess()) return;

  const savedLang = getSavedLang();
  applyLanguage(savedLang);

  // تحديث الإحصائيات
  updateStats();
  
  // تحميل قائمة المستخدمين (إذا كانت الصفحة admin-users.html)
  if (document.getElementById("usersTableBody")) {
    loadUsers();
  }

  bindEvents();

  $("#langBtn")?.addEventListener("click", () => {
    const next = getSavedLang() === "en" ? "ar" : "en";
    setSavedLang(next);
    applyLanguage(next);
    // إعادة تحميل البيانات بعد تغيير اللغة
    updateStats();
    if (document.getElementById("usersTableBody")) {
      loadUsers();
    }
  });
});