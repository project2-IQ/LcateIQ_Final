/* =============================
   LocateIQ - Profile Script (FINAL with Backend)
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

const I18N = {
  ar: {
    profile_title: "LocateIQ | الملف الشخصي",
    nav_home: "الرئيسية",
    profile_sub: "إدارة بياناتك الشخصية وإعدادات الحساب",
    
    menu_title: "القائمة",
    menu_profile: "الملف الشخصي",
    menu_chat: "الشات",
    menu_past: "النتائج السابقة",
    menu_logout: "تسجيل الخروج",

    change_photo: "تغيير الصورة",
    
    personal_info: "المعلومات الشخصية",
    full_name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    national_id: "رقم الهوية",
    birth_date: "تاريخ الميلاد",
    join_date: "تاريخ التسجيل",
    
    change_password: "تغيير كلمة المرور",
    current_password: "كلمة المرور الحالية",
    new_password: "كلمة المرور الجديدة",
    confirm_password: "تأكيد كلمة المرور",
    
    save_changes: "حفظ التغييرات",
    update_password: "تحديث كلمة المرور",
    
    footer_rights: "جميع الحقوق محفوظة",

    // رسائل
    profile_updated: "تم تحديث الملف الشخصي بنجاح",
    password_updated: "تم تحديث كلمة المرور بنجاح",
    password_mismatch: "كلمتا المرور غير متطابقتين",
    weak_password: "كلمة المرور ضعيفة. يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز",
    image_uploaded: "تم رفع الصورة بنجاح",
    image_too_large: "حجم الصورة كبير جدًا. الحد الأقصى 2MB",
    loading_error: "حدث خطأ في تحميل البيانات",
    saving_error: "حدث خطأ في حفظ البيانات",
    
    // Forgot Password
    modal_error: "❌ الرجاء إدخال بريدك الإلكتروني",
    modal_success: "✅ تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني"
  },

  en: {
    profile_title: "LocateIQ | Profile",
    nav_home: "Home",
    profile_sub: "Manage your personal information and account settings",
    
    menu_title: "Menu",
    menu_profile: "Profile",
    menu_chat: "Chat",
    menu_past: "Past Results",
    menu_logout: "Logout",

    change_photo: "Change Photo",
    
    personal_info: "Personal Information",
    full_name: "Full Name",
    email: "Email",
    phone: "Phone Number",
    national_id: "National ID",
    birth_date: "Birth Date",
    join_date: "Join Date",
    
    change_password: "Change Password",
    current_password: "Current Password",
    new_password: "New Password",
    confirm_password: "Confirm Password",
    
    save_changes: "Save Changes",
    update_password: "Update Password",
    
    footer_rights: "All rights reserved",

    // Messages
    profile_updated: "Profile updated successfully",
    password_updated: "Password updated successfully",
    password_mismatch: "Passwords do not match",
    weak_password: "Weak password. Must be at least 8 characters with uppercase, lowercase, number, and symbol",
    image_uploaded: "Image uploaded successfully",
    image_too_large: "Image too large. Maximum size is 2MB",
    loading_error: "Error loading data",
    saving_error: "Error saving data",
    
    // Forgot Password
    modal_error: "❌ Please enter your email",
    modal_success: "✅ Password reset link sent to your email"
  }
};

const t = (lang, key) => I18N?.[lang]?.[key] ?? null;

function applyI18nToDom(lang) {
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(lang, key);
    if (val != null) el.textContent = val;
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

// ===== VALIDATION =====
function isStrongPassword(pw) {
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const longEnough = pw.length >= 8;
  return hasLower && hasUpper && hasDigit && hasSymbol && longEnough;
}

// ============================================
// دالة جلب بيانات الملف الشخصي من الباك إند
// ============================================
async function loadProfile() {
  const userId = getUserId();
  const lang = getSavedLang();
  
  if (!userId) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/investor/profile.php?user_id=${encodeURIComponent(userId)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // تعبئة الحقول بالبيانات المستلمة
    const nameInput = $("#fullName");
    const emailInput = $("#email");
    const joinDateInput = $("#joinDate");
    
    if (nameInput) nameInput.value = data.name || "";
    if (emailInput) emailInput.value = data.email || "";
    if (joinDateInput) joinDateInput.value = data.created_at ? new Date(data.created_at).toLocaleDateString() : "";
    
  } catch (error) {
    console.error("Error loading profile:", error);
    alert(t(lang, "loading_error"));
  }
}

// ============================================
// دالة حفظ الملف الشخصي (إرسال للباك إند)
// ============================================
async function saveProfile() {
  const userId = getUserId();
  const lang = getSavedLang();
  
  if (!userId) return;
  
  const nameInput = $("#fullName");
  const emailInput = $("#email");
  
  const profileData = {
    name: nameInput?.value || "",
    email: emailInput?.value || ""
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/investor/profile.php?user_id=${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    alert(t(lang, "profile_updated"));
    
  } catch (error) {
    console.error("Error saving profile:", error);
    alert(t(lang, "saving_error"));
  }
}

// ============================================
// دالة تغيير كلمة المرور (إرسال للباك إند)
// ============================================
async function changePassword() {
  const userId = getUserId();
  const lang = getSavedLang();
  
  if (!userId) return;
  
  const currentPass = $("#currentPassword");
  const newPass = $("#newPassword");
  const confirmPass = $("#confirmPassword");
  
  if (newPass.value !== confirmPass.value) {
    alert(t(lang, "password_mismatch"));
    return;
  }
  
  if (!isStrongPassword(newPass.value)) {
    alert(t(lang, "weak_password"));
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/investor/password.php?user_id=${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        current_password: currentPass.value,
        new_password: newPass.value
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error");
    }
    
    alert(t(lang, "password_updated"));
    
    // مسح الحقول
    currentPass.value = "";
    newPass.value = "";
    confirmPass.value = "";
    
  } catch (error) {
    console.error("Error changing password:", error);
    alert(error.message || t(lang, "saving_error"));
  }
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // التحقق من تسجيل الدخول
  if (!checkAuth()) return;
  
  // اللغة
  applyLang(getSavedLang());
  
  // جلب بيانات الملف الشخصي
  loadProfile();

  // زر اللغة
  const langBtn = $("#langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = getSavedLang() === "en" ? "ar" : "en";
      setSavedLang(next);
      applyLang(next);
      // إعادة تحميل البيانات بعد تغيير اللغة
      loadProfile();
    });
  }

  // القائمة الجانبية
  if (menuFab) menuFab.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu?.classList.contains("open")) {
      closeMenu();
    }
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

  // رفع الصورة (محاكاة - تبقى محلية)
  const avatarUpload = $("#avatarUpload");
  const avatarImg = $("#avatarImg");

  if (avatarUpload) {
    avatarUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert(t(getSavedLang(), "image_too_large"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (avatarImg) avatarImg.src = e.target.result;
        alert(t(getSavedLang(), "image_uploaded"));
      };
      reader.readAsDataURL(file);
    });
  }

  // حفظ الملف الشخصي (مع ربط الباك إند)
  const saveProfileBtn = $("#saveProfileBtn");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      saveProfile();
    });
  }

  // تغيير كلمة المرور (مع ربط الباك إند)
  const changePasswordBtn = $("#changePasswordBtn");
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      changePassword();
    });
  }

  // ===== Forgot Password in Profile Page =====
  const forgotProfileLink = document.getElementById("forgotPasswordProfile");
  const modal = document.getElementById("forgotModal");
  const closeModalBtn = document.querySelector(".close-modal");
  const sendResetBtn = document.getElementById("sendResetBtn");
  const resetEmail = document.getElementById("resetEmail");
  const modalMessage = document.getElementById("modalMessage");

  if (forgotProfileLink) {
    forgotProfileLink.onclick = function(e) {
      e.preventDefault();
      if (modal) {
        modal.style.display = "flex";
        if (modalMessage) modalMessage.innerHTML = "";
      }
    };
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = function() {
      if (modal) modal.style.display = "none";
      if (modalMessage) modalMessage.innerHTML = "";
      if (resetEmail) resetEmail.value = "";
    };
  }

  window.onclick = function(e) {
    if (e.target === modal) {
      if (modal) modal.style.display = "none";
      if (modalMessage) modalMessage.innerHTML = "";
      if (resetEmail) resetEmail.value = "";
    }
  };

  if (sendResetBtn) {
    sendResetBtn.onclick = async function() {
      const email = resetEmail.value.trim();
      const lang = getSavedLang();
      
      if (!email) {
        modalMessage.innerHTML = I18N[lang].modal_error;
        modalMessage.style.color = "#ff4b4b";
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot_password.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        modalMessage.innerHTML = data.message || I18N[lang].modal_success;
        modalMessage.style.color = "#2ee59d";
        resetEmail.value = "";
        
        setTimeout(() => {
          modal.style.display = "none";
          modalMessage.innerHTML = "";
        }, 3000);
        
      } catch (error) {
        modalMessage.innerHTML = I18N[lang].modal_error;
        modalMessage.style.color = "#ff4b4b";
      }
    };
  }
});