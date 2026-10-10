/* =========================================
   ROXXX.SHOP DELIVERY PAGE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const checkoutMode = new URLSearchParams(window.location.search).get("checkout") === "1";
  if (checkoutMode) {
    const purchase = window.RoxxxPurchase;
    const checkoutView = document.getElementById("deliveryCheckout");
    const informationView = document.getElementById("deliveryInformation");
    const cart = purchase.getCart();
    const totals = purchase.calculate(cart);

    if (!cart.length || cart.some(item => !item.available)) {
      window.location.replace("cart.html");
      return;
    }
    if (totals.allFreeDigital) {
      window.location.replace("free-download.html");
      return;
    }
    if (!totals.hasPhysical) {
      window.location.replace("checkout.html");
      return;
    }

    informationView.hidden = true;
    checkoutView.hidden = false;
    document.title = "Delivery Information | roxxx.shop";
document.getElementById("deliverySubtotal").textContent = purchase.formatPrice(totals.subtotal);
    document.getElementById("deliveryDiscount").textContent = `−${purchase.formatPrice(totals.discount)}`;
    document.getElementById("deliveryOnline").textContent = purchase.formatPrice(totals.deliveryOnline);
    document.getElementById("deliveryOfferNote").textContent = totals.deliveryNote;
    document.getElementById("deliveryPayable").textContent = purchase.formatPrice(totals.productPayable);
    document.getElementById("deliveryDoorAmount").textContent = purchase.formatPrice(totals.deliveryAtDoor);
    document.getElementById("deliveryDoorSummaryRow").hidden = totals.deliveryAtDoor === 0;
    document.getElementById("deliveryCustomerTotal").textContent = purchase.formatPrice(totals.totalCustomerPayable);

    const phoneInput = document.getElementById("deliveryPhone");
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    });

    document.getElementById("deliveryForm").addEventListener("submit", event => {
      event.preventDefault();
      if (!event.currentTarget.reportValidity()) return;

      const phone = phoneInput.value.trim();
      if (!/^01[3-9]\d{8}$/.test(phone)) {
        alert("Please enter a valid 11-digit Bangladeshi mobile number.");
        phoneInput.focus();
        return;
      }

      localStorage.setItem("roxxx_delivery_info", JSON.stringify({
        name: document.getElementById("deliveryName").value.trim(),
        phone,
        district: document.getElementById("deliveryDistrict").value.trim(),
        thana: document.getElementById("deliveryThana").value.trim(),
        address: document.getElementById("deliveryAddress").value.trim()
      }));
      window.location.href = "checkout.html";
    });
    return;
  }

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
