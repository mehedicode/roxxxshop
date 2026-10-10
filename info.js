/* =========================================
   ROXXX.SHOP INFO PAGES
   FAQ accordion behavior only.
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const faqButtons = document.querySelectorAll(".faq-item");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector("b");
      if (!answer) return;

      const isOpen = answer.classList.contains("open");

      document.querySelectorAll(".faq-answer").forEach((item) => {
        item.classList.remove("open");
      });
      document.querySelectorAll(".faq-item b").forEach((item) => {
        item.textContent = "+";
      });

      if (!isOpen) {
        answer.classList.add("open");
        if (icon) icon.textContent = "−";
      }
    });
  });

});