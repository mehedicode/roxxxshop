/* =========================================
   ROXXX.SHOP ACCOUNT + LOGIN MODAL
   Frontend demo only — no backend authentication yet.
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Elements ---------- */
  const modal       = document.getElementById("loginModal");
  const overlay     = document.getElementById("loginOverlay");
  const closeBtn    = document.getElementById("loginClose");
  const loginView   = document.getElementById("loginView");
  const registerView= document.getElementById("registerView");
  const loginForm   = document.getElementById("loginForm");
  const registerForm= document.getElementById("registerForm");
  const loginError  = document.getElementById("loginError");
  const registerError = document.getElementById("registerError");
  const loginMobile = document.getElementById("loginMobile");
  const registerMobile = document.getElementById("registerMobile");

  const BKASH_RE = /^01[3-9]\d{8}$/;

  /* ---------- Open / Close ---------- */
  function openLogin(){
    if(!modal) return;
    showView("login");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(()=>loginMobile && loginMobile.focus(), 150);
  }

  function closeLogin(){
    if(!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    loginError.hidden = true;
    registerError.hidden = true;
    loginForm.reset();
    registerForm.reset();
  }

  window.openLogin = openLogin;
  window.closeLogin = closeLogin;

  /* ---------- View switching ---------- */
  function showView(view){
    if(view === "login"){
      loginView.hidden = false;
      registerView.hidden = true;
      document.getElementById("loginModalTitle").textContent = "Sign In";
      document.getElementById("registerModalTitle").textContent = "Create Account";
    } else {
      loginView.hidden = true;
      registerView.hidden = false;
    }
  }

  document.getElementById("goToRegister").addEventListener("click", (e)=>{
    e.preventDefault();
    showView("register");
    setTimeout(()=>registerName && registerName.focus(), 100);
  });

  document.getElementById("goToLogin").addEventListener("click", (e)=>{
    e.preventDefault();
    showView("login");
    setTimeout(()=>loginMobile && loginMobile.focus(), 100);
  });

  /* ---------- Close handlers ---------- */
  closeBtn.addEventListener("click", closeLogin);
  overlay.addEventListener("click", closeLogin);
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && modal && !modal.hidden) closeLogin();
  });

  /* ---------- Mobile input mask ---------- */
  function maskMobile(input){
    input.addEventListener("input", ()=>{
      input.value = input.value.replace(/\D/g, "").slice(0, 11);
    });
  }
  maskMobile(loginMobile);
  maskMobile(registerMobile);

  /* ---------- Login form ---------- */
  loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    loginError.hidden = true;

    const mobile = loginMobile.value.trim();
    const password = loginPassword.value;

    if(!BKASH_RE.test(mobile)){
      showError(loginError, "Please enter a valid 11-digit Bangladeshi mobile number.");
      loginMobile.focus();
      return;
    }
    if(!password){
      showError(loginError, "Please enter your password.");
      loginPassword.focus();
      return;
    }

    /* FRONTEND DEMO — no backend authentication yet. */
    showError(loginError, "Login is not available yet. Backend authentication is not connected.");
  });

  /* ---------- Register form ---------- */
  registerForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    registerError.hidden = true;

    const name = registerName.value.trim();
    const mobile = registerMobile.value.trim();
    const gender = registerGender.value;
    const password = registerPassword.value;
    const terms = registerTerms.checked;

    if(!name){
      showError(registerError, "Please enter your name.");
      registerName.focus();
      return;
    }
    if(!BKASH_RE.test(mobile)){
      showError(registerError, "Please enter a valid 11-digit Bangladeshi mobile number.");
      registerMobile.focus();
      return;
    }
    if(!gender){
      showError(registerError, "Please select your gender.");
      registerGender.focus();
      return;
    }
    if(password.length < 6){
      showError(registerError, "Password must be at least 6 characters.");
      registerPassword.focus();
      return;
    }
    if(!terms){
      showError(registerError, "You must agree to the Terms & Conditions.");
      return;
    }

    /* FRONTEND DEMO — no backend registration yet. */
    showError(registerError, "Registration is not available yet. Backend authentication is not connected.");
  });

  function showError(el, msg){
    el.textContent = msg;
    el.hidden = false;
  }

  /* ---------- Existing login button ---------- */
  const loginBtn = document.getElementById("loginBtn");
  if(loginBtn){
    loginBtn.addEventListener("click", openLogin);
  }

});