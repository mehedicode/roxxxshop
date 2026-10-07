const product = {
  name: "Premium Classic Watch",
  image:
    "https://placehold.co/900x900/e2e8f0/0f172a?text=Premium+Classic+Watch",
  price: 1590,
  oldPrice: 1990
};

const quantityEl = document.getElementById("quantity");
const toast = document.getElementById("toast");

let quantity = 1;


// ===============================
// UPDATE QUANTITY
// ===============================

function updateQuantity() {
  quantityEl.textContent = quantity;
}


// ===============================
// MINUS BUTTON
// ===============================

document.getElementById("minusBtn").onclick = () => {
  if (quantity > 1) {
    quantity--;
    updateQuantity();
  }
};


// ===============================
// PLUS BUTTON
// ===============================

document.getElementById("plusBtn").onclick = () => {
  quantity++;
  updateQuantity();
};


// ===============================
// TOAST MESSAGE
// ===============================

function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}


// ===============================
// ADD TO CART
// ===============================

document.getElementById("addCartBtn").onclick = () => {

  const cart = JSON.parse(
    localStorage.getItem("roxxx_cart") || "[]"
  );

  const existing = cart.find(
    item => item.name === product.name
  );

  if (existing) {

    existing.quantity += quantity;

  } else {

    cart.push({
      ...product,
      quantity: quantity
    });

  }

  localStorage.setItem(
    "roxxx_cart",
    JSON.stringify(cart)
  );

  showToast(`${quantity} item added to cart`);
};


// ===============================
// BUY NOW
// ===============================

document.getElementById("buyNowBtn").onclick = () => {

  const buyNowProduct = {
    ...product,
    quantity: quantity
  };

  localStorage.setItem(
    "roxxx_buy_now",
    JSON.stringify(buyNowProduct)
  );

  showToast("Buy Now selected");

};

// ===============================
// STICKY PRODUCT ACTIONS
// ===============================

const stickyAddCartBtn =
  document.getElementById("stickyAddCartBtn");

const stickyBuyNowBtn =
  document.getElementById("stickyBuyNowBtn");


// Sticky Add to Cart
stickyAddCartBtn.onclick = () => {

  const cart = JSON.parse(
    localStorage.getItem("roxxx_cart") || "[]"
  );

  const existing = cart.find(
    item => item.name === product.name
  );

  if (existing) {

    existing.quantity += quantity;

  } else {

    cart.push({
      ...product,
      quantity: quantity
    });

  }

  localStorage.setItem(
    "roxxx_cart",
    JSON.stringify(cart)
  );

  showToast(
    `${quantity} item added to cart`
  );

};

