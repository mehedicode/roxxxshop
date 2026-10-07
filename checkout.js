// ===============================
// ROXXX.SHOP CHECKOUT
// ===============================

const DELIVERY_CHARGE = 60;


// ===============================
// ELEMENTS
// ===============================

const checkoutForm =
  document.getElementById("checkoutForm");

const checkoutItemsEl =
  document.getElementById("checkoutItems");

const subtotalEl =
  document.getElementById("subtotal");

const deliveryEl =
  document.getElementById("delivery");

const totalEl =
  document.getElementById("total");

const placeOrderBtn =
  document.getElementById("placeOrderBtn");

const successModal =
  document.getElementById("successModal");

const orderIdEl =
  document.getElementById("orderId");

const continueShoppingBtn =
  document.getElementById("continueShoppingBtn");

const bkashInfo =
  document.getElementById("bkashInfo");


// ===============================
// GET CART
// ===============================

function getCart() {

  try {

    return JSON.parse(
      localStorage.getItem("roxxx_cart") || "[]"
    );

  } catch (error) {

    return [];

  }

}


// ===============================
// FORMAT PRICE
// ===============================

function formatPrice(price) {

  return `৳${Number(price).toLocaleString("en-BD")}`;

}


// ===============================
// RENDER CHECKOUT
// ===============================

function renderCheckout() {

  const cart = getCart();

  checkoutItemsEl.innerHTML = "";


  // No cart items
  if (cart.length === 0) {

    window.location.href = "cart.html";

    return;
  }


  let subtotal = 0;


  cart.forEach(item => {

    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 0;

    const itemTotal = price * quantity;

    subtotal += itemTotal;


    const itemEl =
      document.createElement("div");

    itemEl.className = "checkout-item";


    itemEl.innerHTML = `

      <img
        class="checkout-item-image"
        src="${item.image}"
        alt="${item.name}"
      >

      <div class="checkout-item-info">

        <p class="checkout-item-name">
          ${item.name}
        </p>

        <span class="checkout-item-qty">
          Qty: ${quantity} × ${formatPrice(price)}
        </span>

      </div>

      <strong class="checkout-item-total">
        ${formatPrice(itemTotal)}
      </strong>

    `;


    checkoutItemsEl.appendChild(itemEl);

  });


  const delivery =
    subtotal > 0
      ? DELIVERY_CHARGE
      : 0;

  const total =
    subtotal + delivery;


  subtotalEl.textContent =
    formatPrice(subtotal);

  deliveryEl.textContent =
    formatPrice(delivery);

  totalEl.textContent =
    formatPrice(total);

}


// ===============================
// PAYMENT METHOD
// ===============================

const paymentMethods =
  document.querySelectorAll(
    'input[name="paymentMethod"]'
  );


paymentMethods.forEach(input => {

  input.addEventListener("change", () => {

    if (input.value === "bkash") {

      bkashInfo.classList.remove("hidden");

    } else {

      bkashInfo.classList.add("hidden");

    }

  });

});


// ===============================
// PHONE VALIDATION
// ===============================

const phoneInput =
  document.getElementById("phone");


phoneInput.addEventListener("input", () => {

  phoneInput.value =
    phoneInput.value
      .replace(/\D/g, "")
      .slice(0, 11);

});


// ===============================
// CREATE ORDER ID
// ===============================

function createOrderId() {

  const randomNumber =
    Math.floor(
      100000 +
      Math.random() * 900000
    );

  return `ROX-${randomNumber}`;

}


// ===============================
// PLACE ORDER
// ===============================

placeOrderBtn.addEventListener("click", () => {

  // Browser form validation
  if (!checkoutForm.reportValidity()) {
    return;
  }


  const phone =
    phoneInput.value.trim();


  // Bangladesh mobile number check
  if (!/^01\d{9}$/.test(phone)) {

    alert(
      "Please enter a valid 11-digit Bangladeshi mobile number."
    );

    phoneInput.focus();

    return;
  }


  const cart = getCart();


  if (cart.length === 0) {

    alert("Your cart is empty.");

    window.location.href = "cart.html";

    return;
  }


  // Selected payment method
  const paymentMethod =
    document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).value;


  // Create order ID
  const orderId =
    createOrderId();


  // ===============================
  // SAVE ORDER
  // ===============================

  const order = {

    orderId: orderId,

    customer: {

      name:
        document
          .getElementById("customerName")
          .value
          .trim(),

      phone: phone,

      district:
        document
          .getElementById("district")
          .value,

      thana:
        document
          .getElementById("thana")
          .value
          .trim(),

      address:
        document
          .getElementById("areaAddress")
          .value
          .trim()

    },

    paymentMethod: paymentMethod,

    items: cart,

    createdAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "roxxx_last_order",
    JSON.stringify(order)
  );


  // ===============================
  // SHOW SUCCESS MODAL
  // ===============================

  orderIdEl.textContent =
    orderId;

  successModal.classList.remove(
    "hidden"
  );

});


// ===============================
// CONTINUE SHOPPING
// ===============================

continueShoppingBtn.addEventListener(
  "click",
  () => {

    // Clear cart
    localStorage.removeItem(
      "roxxx_cart"
    );

    // Go homepage
    window.location.href =
      "index.html";

  }
);


// ===============================
// INITIAL LOAD
// ===============================

renderCheckout();