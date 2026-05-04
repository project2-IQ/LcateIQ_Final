// login.js (FINAL - مع اتجاه ثابت + ربط الباك إند عبر الشبكة)
document.addEventListener("DOMContentLoaded", () => {
  const LANG_KEY = "locateiq_lang";

  // Elements
  const langBtn  = document.getElementById("langBtn");
  const langText = document.getElementById("langText");

  const welcomeText = document.getElementById("welcomeText");
  const subtitle = document.getElementById("subtitle");
  const emailLabel = document.getElementById("emailLabel");
  const passLabel  = document.getElementById("passLabel");
  const emailInput = document.getElementById("email");
  const passInput  = document.getElementById("password");
  const loginBtn   = document.getElementById("loginBtn");
  const noAccount  = document.getElementById("noAccount");
  const signupLink = document.getElementById("signupLink");
  const navHome = document.getElementById("navHome");
  const footerRights = document.getElementById("footerRights");

  // Forgot Password Elements
  const modal = document.getElementById("forgotModal");
  const forgotLink = document.getElementById("forgotPasswordLink");
  const closeModal = document.querySelector(".close-modal");
  const sendResetBtn = document.getElementById("sendResetBtn");
  const resetEmail = document.getElementById("resetEmail");
  const modalMessage = document.getElementById("modalMessage");

  // ✅ عنوان الباك إند (يُستخدم في كل الطلبات)
  const API_BASE_URL = new URL("api", window.location.href).href.replace(/\/+$/, "");

  const I18N = {
    ar: {
      lang_btn: "English",
      nav_home: "الرئيسية",
      welcome: "مرحباً بك في",
      subtitle: "حيث تبدأ الاستثمارات الذكية",
      email_label: "البريد الإلكتروني",
      pass_label: "كلمة المرور",
      email_ph: "أدخل بريدك الإلكتروني",
      pass_ph: "أدخل كلمة المرور",
      login_btn: "تسجيل الدخول ←",
      no_account: "ليس لديك حساب؟",
      signup: "إنشاء حساب",
      footer_rights: "جميع الحقوق محفوظة",
      invalid_credentials: "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة",
      welcome_admin: "مرحباً أيها الأدمن",
      forgot_password: "نسيت كلمة المرور؟",
      modal_title: "استعادة كلمة المرور",
      modal_desc: "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين",
      modal_btn: "إرسال رابط الاستعادة",
      modal_success: "✅ تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني",
      modal_error: "❌ الرجاء إدخال بريدك الإلكتروني",
      reset_email_ph: "البريد الإلكتروني"
    },
    en: {
      lang_btn: "العربية",
      nav_home: "Home",
      welcome: "Welcome to",
      subtitle: "Where smart investments begin",
      email_label: "Email",
      pass_label: "Password",
      email_ph: "Enter your email",
      pass_ph: "Enter your password",
      login_btn: "Sign In →",
      no_account: "Don't have an account?",
      signup: "Sign Up",
      footer_rights: "All rights reserved",
      invalid_credentials: "❌ Invalid email or password",
      welcome_admin: "Welcome Admin",
      forgot_password: "Forgot password?",
      modal_title: "Reset Password",
      modal_desc: "Enter your email and we'll send you a reset link",
      modal_btn: "Send reset link",
      modal_success: "✅ Password reset link sent to your email",
      modal_error: "❌ Please enter your email",
      reset_email_ph: "Email"
    }
  };

  const getSavedLang = () => localStorage.getItem(LANG_KEY) || "ar";
  const setSavedLang = (lang) => localStorage.setItem(LANG_KEY, lang);

  function applyLang(lang) {
    const isEnglish = lang === "en";
    
    document.documentElement.setAttribute("dir", isEnglish ? "ltr" : "rtl");
    document.documentElement.setAttribute("lang", isEnglish ? "en" : "ar");
    document.body.style.direction = isEnglish ? "ltr" : "rtl";
    
    console.log("Language changed to:", lang, "dir:", document.documentElement.dir);

    if (langText) langText.textContent = I18N[lang].lang_btn;
    if (navHome) navHome.textContent = I18N[lang].nav_home;
    if (welcomeText) welcomeText.textContent = I18N[lang].welcome;
    if (subtitle) subtitle.textContent = I18N[lang].subtitle;
    if (emailLabel) emailLabel.textContent = I18N[lang].email_label;
    if (passLabel) passLabel.textContent = I18N[lang].pass_label;
    if (emailInput) emailInput.placeholder = I18N[lang].email_ph;
    if (passInput)  passInput.placeholder  = I18N[lang].pass_ph;
    if (loginBtn) loginBtn.textContent = I18N[lang].login_btn;
    if (noAccount) noAccount.textContent = I18N[lang].no_account;
    if (signupLink) signupLink.textContent = I18N[lang].signup;
    if (footerRights) footerRights.textContent = I18N[lang].footer_rights;
    
    // ترجمة نافذة Forgot Password
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalBtn = document.getElementById("sendResetBtn");
    const resetEmailInput = document.getElementById("resetEmail");
    
    if (modalTitle) modalTitle.textContent = I18N[lang].modal_title;
    if (modalDesc) modalDesc.textContent = I18N[lang].modal_desc;
    if (modalBtn) modalBtn.textContent = I18N[lang].modal_btn;
    if (resetEmailInput) resetEmailInput.placeholder = I18N[lang].reset_email_ph;
    
    if (forgotLink) forgotLink.textContent = I18N[lang].forgot_password;
  }

  applyLang(getSavedLang());

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = getSavedLang() === "en" ? "ar" : "en";
      setSavedLang(next);
      applyLang(next);
    });
  }

  // ===== تسجيل الدخول (محلي + باك إند) =====
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passInput.value.trim();
      const lang = getSavedLang();

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("is_logged_in", "true");
          localStorage.setItem("user_role", data.role);
          localStorage.setItem("user_email", email);
          localStorage.setItem("user_name", data.name || email.split("@")[0]);
          localStorage.setItem("user_id", String(data.userID));

          if (data.role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "dashboard.html";
          }
        } else {
          alert(data.detail || I18N[lang].invalid_credentials);
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("❌ تعذر الاتصال بالخادم. تأكدي من تشغيل الباك إند.");
      }
    });
  }

  // ===== Forgot Password Modal =====
  if (forgotLink) {
    forgotLink.onclick = function(e) {
      e.preventDefault();
      if (modal) {
        modal.style.display = "flex";
        if (modalMessage) modalMessage.innerHTML = "";
      }
    };
  }

  if (closeModal) {
    closeModal.onclick = function() {
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
    sendResetBtn.onclick = function() {
      const email = resetEmail.value.trim();
      const lang = getSavedLang();
      
      if (!email) {
        modalMessage.innerHTML = I18N[lang].modal_error;
        modalMessage.style.color = "#ff4b4b";
        return;
      }
      
      modalMessage.innerHTML = I18N[lang].modal_success;
      modalMessage.style.color = "#2ee59d";
      resetEmail.value = "";
    };
  }
});