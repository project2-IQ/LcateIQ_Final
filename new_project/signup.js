// signup.js - النسخة النهائية المضمونة
document.addEventListener("DOMContentLoaded", () => {
  const LANG_KEY = "locateiq_lang";

  // Elements
  const langBtn  = document.getElementById("langBtn");
  const langText = document.getElementById("langText");

  const createText = document.getElementById("createText");
  const subtitle = document.getElementById("subtitle");
  const homeLink = document.getElementById("homeLink");

  const nameLabel = document.getElementById("nameLabel");
  const emailLabel = document.getElementById("emailLabel");
  const passLabel = document.getElementById("passLabel");
  const confirmLabel = document.getElementById("confirmLabel");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const passwordRules = document.getElementById("passwordRules");
  const createBtn = document.getElementById("createBtn");
  const haveAccount = document.getElementById("haveAccount");
  const loginLink = document.getElementById("loginLink");
  const footerRights = document.getElementById("footerRights");

  const form = document.getElementById("signupForm");

  // ============================================
  // ✅ الرابط الثابت والمضمون للسيرفر
  // ============================================
  const API_BASE_URL = new URL("api", window.location.href).href.replace(/\/+$/, "");

  const I18N = {
    ar: {
      lang_btn: "English",
      home: "الرئيسية",
      create: "أنشئ حسابك في",
      subtitle: "ابدأ رحلتك نحو استثمار أذكى",
      name_label: "الاسم الكامل",
      email_label: "البريد الإلكتروني",
      pass_label: "كلمة المرور",
      confirm_label: "تأكيد كلمة المرور",
      name_ph: "أدخل اسمك الكامل",
      email_ph: "أدخل بريدك الإلكتروني",
      pass_ph: "أدخل كلمة المرور",
      confirm_ph: "أعد إدخال كلمة المرور",
      pass_rules: "يجب أن تحتوي كلمة المرور على: 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز.",
      create_btn: "إنشاء حساب",
      have_account: "لديك حساب؟",
      login_link: "سجّل الدخول",
      footer_rights: "جميع الحقوق محفوظة",
      email_exists: "❌ هذا البريد الإلكتروني مسجل مسبقاً",
      signup_error: "❌ حدث خطأ أثناء إنشاء الحساب",
      server_error: "❌ تعذر الاتصال بالخادم. تأكد من تشغيل الباك إند",
      weak_password: "كلمة المرور غير قوية.",
      password_mismatch: "كلمتا المرور غير متطابقتين",
      signup_success: "✅ تم إنشاء الحساب بنجاح!"
    },
    en: {
      lang_btn: "العربية",
      home: "Home",
      create: "Create your account in",
      subtitle: "Start your journey toward smarter investing",
      name_label: "Full Name",
      email_label: "Email",
      pass_label: "Password",
      confirm_label: "Confirm Password",
      name_ph: "Enter your full name",
      email_ph: "Enter your email",
      pass_ph: "Enter your password",
      confirm_ph: "Re-enter your password",
      pass_rules: "Password: 8+ chars, uppercase, lowercase, number, symbol.",
      create_btn: "Create Account",
      have_account: "Already have an account?",
      login_link: "Sign In",
      footer_rights: "All rights reserved",
      email_exists: "❌ This email is already registered",
      signup_error: "❌ An error occurred",
      server_error: "❌ Cannot connect to server.",
      weak_password: "Weak password.",
      password_mismatch: "Passwords do not match",
      signup_success: "✅ Account created!"
    }
  };

  const getSavedLang = () => localStorage.getItem(LANG_KEY) || "ar";
  const setSavedLang = (lang) => localStorage.setItem(LANG_KEY, lang);

  function isStrongPassword(pw) {
    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasDigit = /\d/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    const longEnough = pw.length >= 8;
    return hasLower && hasUpper && hasDigit && hasSymbol && longEnough;
  }

  function applyLang(lang) {
    const isEnglish = lang === "en";
    document.documentElement.lang = isEnglish ? "en" : "ar";
    document.documentElement.dir  = isEnglish ? "ltr" : "rtl";

    if (langText) langText.textContent = I18N[lang].lang_btn;
    if (homeLink) homeLink.textContent = I18N[lang].home;
    if (createText) createText.textContent = I18N[lang].create;
    if (subtitle) subtitle.textContent = I18N[lang].subtitle;
    if (nameLabel) nameLabel.textContent = I18N[lang].name_label;
    if (emailLabel) emailLabel.textContent = I18N[lang].email_label;
    if (passLabel) passLabel.textContent = I18N[lang].pass_label;
    if (confirmLabel) confirmLabel.textContent = I18N[lang].confirm_label;
    if (fullName) fullName.placeholder = I18N[lang].name_ph;
    if (email) email.placeholder = I18N[lang].email_ph;
    if (password) password.placeholder = I18N[lang].pass_ph;
    if (confirmPassword) confirmPassword.placeholder = I18N[lang].confirm_ph;
    if (passwordRules) passwordRules.textContent = I18N[lang].pass_rules;
    if (createBtn) createBtn.textContent = I18N[lang].create_btn;
    if (haveAccount) haveAccount.textContent = I18N[lang].have_account;
    if (loginLink) loginLink.textContent = I18N[lang].login_link;
    if (footerRights) footerRights.textContent = I18N[lang].footer_rights;
  }

  applyLang(getSavedLang());

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = getSavedLang() === "en" ? "ar" : "en";
      setSavedLang(next);
      applyLang(next);
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentLang = getSavedLang();

      const nameValue = fullName.value.trim();
      const emailValue = email.value.trim();
      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value;

      if (!isStrongPassword(passwordValue)) {
        alert(I18N[currentLang].weak_password);
        password.focus();
        return;
      }

      if (passwordValue !== confirmPasswordValue) {
        alert(I18N[currentLang].password_mismatch);
        confirmPassword.focus();
        return;
      }

      if (!nameValue || !emailValue) {
        alert("Please fill all fields");
        return;
      }

      createBtn.disabled = true;
      createBtn.textContent = "جاري الإنشاء...";

      try {
        // ✅ هنا الرابط الصحيح للتسجيل
        const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: nameValue,
            email: emailValue, 
            password: passwordValue 
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert(I18N[currentLang].signup_success);
          localStorage.setItem("is_logged_in", "true");
          localStorage.setItem("user_role", "user");
          localStorage.setItem("user_email", emailValue);
          localStorage.setItem("user_name", nameValue);
          localStorage.setItem("user_id", String(data.userID));
          window.location.href = "dashboard.html";
        } else {
          if (response.status === 400) {
            alert(I18N[currentLang].email_exists);
          } else {
            alert(data.detail || I18N[currentLang].signup_error);
          }
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert(I18N[currentLang].server_error);
      } finally {
        createBtn.disabled = false;
        createBtn.textContent = I18N[currentLang].create_btn;
      }
    });
  }
});