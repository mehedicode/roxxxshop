/* =========================================
   ROXXX.SHOP DELIVERY PAGE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     FAQ ACCORDION
     ----------------------------------------- */

  const faqButtons = document.querySelectorAll(".faq-item");

  faqButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const answer = button.nextElementSibling;
      const icon = button.querySelector("b");

      if (!answer) return;


      const isOpen = answer.classList.contains("open");


      /* Close all other answers */

      document.querySelectorAll(".faq-answer").forEach((item) => {
        item.classList.remove("open");
      });

      document.querySelectorAll(".faq-item b").forEach((item) => {
        item.textContent = "+";
      });


      /* Open selected answer */

      if (!isOpen) {

        answer.classList.add("open");

        if (icon) {
          icon.textContent = "−";
        }

      }

    });

  });


  /* -----------------------------------------
     SUPPORT BUTTON
     ----------------------------------------- */

  const supportBtn = document.getElementById("supportBtn");

  if (supportBtn) {

    supportBtn.addEventListener("click", () => {

      alert("Customer support will be connected later.");

    });

  }

});