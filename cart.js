// ===============================
// ROXXX.SHOP CART
// ===============================

const cartItemsEl = document.getElementById("cartItems");
const orderSummaryEl = document.getElementById("orderSummary");
const emptyCartEl = document.getElementById("emptyCart");

const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");

const checkoutBtn = document.getElementById("checkoutBtn");


// ===============================
// DELIVERY CHARGE
// ===============================

const DELIVERY_CHARGE = 60;


// ===============================
// GET CART
// ===============================

function getCart() {

  let cart = [];

  try {
    cart = JSON.parse(
      localStorage.getItem("roxxx_cart") || "[]"
    );
  } catch (error) {
    cart = [];
  }

  // Remove invalid/old cart items
  cart = cart.filter(item => {

    return (
      item &&
      typeof item.name === "string" &&
      item.name.trim() !== "" &&
      typeof item.image === "string" &&
      item.image.trim() !== "" &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) >= 0 &&
      Number.isFinite(Number(item.quantity)) &&
      Number(item.quantity) > 0
    );

  });

  // Save cleaned cart
  localStorage.setItem(
    "roxxx_cart",
    JSON.stringify(cart)
  );

  return cart;
}


// ===============================
// SAVE CART
// ===============================

function saveCart(cart) {

  localStorage.setItem(
    "roxxx_cart",
    JSON.stringify(cart)
  );

}


// ===============================
// FORMAT PRICE
// ===============================

function formatPrice(price) {

  return `৳${Number(price).toLocaleString("en-BD")}`;

}


// ===============================
// RENDER CART
// ===============================

function renderCart() {

  const cart = getCart();

  cartItemsEl.innerHTML = "";


  // ===============================
  // EMPTY CART
  // ===============================

  if (cart.length === 0) {

    orderSummaryEl.style.display = "none";

    emptyCartEl.classList.remove("hidden");

    return;
  }


  orderSummaryEl.style.display = "block";

  emptyCartEl.classList.add("hidden");


  // ===============================
  // CART ITEMS
  // ===============================

  cart.forEach((item, index) => {

    const price = Number(item.price);

    const quantity = Number(item.quantity);

    const itemTotal = price * quantity;


    const cartItem = document.createElement("article");

    cartItem.className = "cart-item";


    cartItem.innerHTML = `

      <img
        class="cart-item-image"
        src="${item.image}"
        alt="${item.name}"
      >


      <div class="cart-item-info">

        <h3 class="cart-item-name">
          ${item.name}
        </h3>


        <p class="cart-item-price">

          ${formatPrice(price)}

          ${
            item.oldPrice &&
            Number.isFinite(Number(item.oldPrice))
              ? `
                <span class="cart-item-old-price">
                  ${formatPrice(item.oldPrice)}
                </span>
              `
              : ""
          }

        </p>


        <div class="cart-item-bottom">


          <!-- Quantity -->

          <div class="quantity-control">

            <button
              type="button"
              onclick="decreaseQuantity(${index})"
              aria-label="Decrease quantity"
            >
              −
            </button>


            <span class="quantity-number">
              ${quantity}
            </span>


            <button
              type="button"
              onclick="increaseQuantity(${index})"
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>


          <!-- Item Total -->

          <span
            style="
              font-size: 13px;
              font-weight: 700;
              color: #0f172a;
            "
          >
            ${formatPrice(itemTotal)}
          </span>


          <!-- Remove -->

          <button
            type="button"
            class="remove-button"
            onclick="removeItem(${index})"
          >
            Remove
          </button>


        </div>

      </div>
    `;


    cartItemsEl.appendChild(cartItem);

  });


  updateSummary(cart);

}


// ===============================
// UPDATE SUMMARY
// ===============================

function updateSummary(cart) {

  const subtotal = cart.reduce(
    (sum, item) => {

      const price = Number(item.price);

      const quantity = Number(item.quantity);

      return sum + (price * quantity);

    },
    0
  );


  const delivery =
    subtotal > 0
      ? DELIVERY_CHARGE
      : 0;


  const total = subtotal + delivery;


  subtotalEl.textContent =
    formatPrice(subtotal);


  deliveryEl.textContent =
    formatPrice(delivery);


  totalEl.textContent =
    formatPrice(total);

}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQuantity(index) {

  const cart = getCart();


  if (!cart[index]) {
    return;
  }


  cart[index].quantity =
    Number(cart[index].quantity) + 1;


  saveCart(cart);

  renderCart();

}


// ===============================
// DECREASE QUANTITY
// ===============================

function decreaseQuantity(index) {

  const cart = getCart();


  if (!cart[index]) {
    return;
  }


  if (Number(cart[index].quantity) > 1) {

    cart[index].quantity =
      Number(cart[index].quantity) - 1;

  } else {

    cart.splice(index, 1);

  }


  saveCart(cart);

  renderCart();

}


// ===============================
// REMOVE ITEM
// ===============================

function removeItem(index) {

  const cart = getCart();


  if (!cart[index]) {
    return;
  }


  cart.splice(index, 1);


  saveCart(cart);

  renderCart();

}


// ===============================
// CHECKOUT
// ===============================

checkoutBtn.addEventListener("click", () => {

  const cart = getCart();


  if (cart.length === 0) {
    return;
  }


  window.location.href = "checkout.html";

});


// ===============================
// BOTTOM NAV DEMO
// ===============================

function showComingSoon(event) {

  event.preventDefault();

  alert("This section will be connected soon.");

}


// ===============================
// INITIAL LOAD
// ===============================

renderCart();