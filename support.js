/* =========================================
   ROXXX.SHOP CUSTOMER SUPPORT
   Frontend demo only — no backend connected.
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const BKASH_RE = /^01[3-9]\d{8}$/;
  const form = document.getElementById("supportForm");
  const mobileInput = document.getElementById("supportMobile");
  const errorEl = document.getElementById("supportError");
  const successEl = document.getElementById("supportSuccess");

  /* Mobile input mask */
  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 11);
  });

  function showError(msg){
    errorEl.textContent = msg;
    errorEl.hidden = false;
    successEl.hidden = true;
  }

  function showSuccess(msg){
    successEl.textContent = msg;
    successEl.hidden = false;
    errorEl.hidden = true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    successEl.hidden = true;

    const name = document.getElementById("supportName").value.trim();
    const mobile = mobileInput.value.trim();
    const subject = document.getElementById("supportSubject").value;
    const message = document.getElementById("supportMessage").value.trim();

    if (!name){
      showError("Please enter your name.");
      document.getElementById("supportName").focus();
      return;
    }
    if (!BKASH_RE.test(mobile)){
      showError("Please enter a valid 11-digit Bangladeshi mobile number.");
      mobileInput.focus();
      return;
    }
    if (!subject){
      showError("Please select a subject.");
      document.getElementById("supportSubject").focus();
      return;
    }
    if (message.length < 10){
      showError("Please write a message (minimum 10 characters).");
      document.getElementById("supportMessage").focus();
      return;
    }

    /* FRONTEND DEMO — no backend submission */
    showSuccess("Your message has been received. Our team will contact you soon. (Demo: no backend connected.)");
    form.reset();
  });

});