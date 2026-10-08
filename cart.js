const cartItemsEl = document.getElementById("cartItems");
const orderSummaryEl = document.getElementById("orderSummary");
const emptyCartEl = document.getElementById("emptyCart");
const subtotalEl = document.getElementById("subtotal");
const discountRowEl = document.getElementById("discountRow");
const discountEl = document.getElementById("discount");
const deliveryEl = document.getElementById("delivery");
const deliveryAtDoorRow = document.getElementById("deliveryAtDoorRow");
const deliveryAtDoorEl = document.getElementById("deliveryAtDoor");
const deliveryNoteEl = document.getElementById("deliveryNote");
const totalEl = document.getElementById("total");
const customerTotalEl = document.getElementById("customerTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartAvailabilityNote = document.getElementById("cartAvailabilityNote");

const purchase = window.RoxxxPurchase;
const formatPrice = purchase.formatPrice;

function renderCart() {
  const cart = purchase.getCart();
  const totals = purchase.calculate(cart);
  const hasUnavailable = cart.some(item => !item.available);
  checkoutBtn.disabled = hasUnavailable;
  cartAvailabilityNote.hidden = !hasUnavailable;
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    orderSummaryEl.style.display = "none";
    emptyCartEl.classList.remove("hidden");
    return;
  }

  orderSummaryEl.style.display = "block";
  emptyCartEl.classList.add("hidden");

  cart.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "cart-item";

    const image = document.createElement("img");
    image.className = "cart-item-image";
    image.src = item.image;
    image.alt = item.name;

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "cart-item-price";
    if (item.free) {
      price.textContent = "FREE";
      price.classList.add("free-label");
    } else {
      price.textContent = formatPrice(item.price);
      if (item.offerAvailable && item.oldPrice > item.price) {
        const oldPrice = document.createElement("span");
        oldPrice.className = "cart-item-old-price";
        oldPrice.textContent = formatPrice(item.oldPrice);
        price.appendChild(oldPrice);
      }
    }

    const controls = document.createElement("div");
    controls.className = "cart-item-bottom";
    controls.innerHTML = `
      <div class="quantity-control">
        <button type="button" onclick="decreaseQuantity(${index})" aria-label="Decrease quantity">−</button>
        <span class="quantity-number">${item.quantity}</span>
        <button type="button" onclick="increaseQuantity(${index})" aria-label="Increase quantity">+</button>
      </div>
      <span class="cart-line-total">${item.free ? "FREE" : formatPrice(item.price * item.quantity)}</span>
      <button type="button" class="remove-button" onclick="removeItem(${index})">Remove</button>
    `;

    info.append(name, price, controls);
    article.append(image, info);
    cartItemsEl.appendChild(article);
  });

  subtotalEl.textContent = formatPrice(totals.subtotal);
  discountRowEl.hidden = totals.discount === 0;
  discountEl.textContent = `−${formatPrice(totals.discount)}`;
  deliveryEl.textContent = formatPrice(totals.deliveryOnline);
  deliveryAtDoorRow.hidden = totals.deliveryAtDoor === 0;
  deliveryAtDoorEl.textContent = formatPrice(totals.deliveryAtDoor);
  deliveryNoteEl.textContent = totals.deliveryNote;
  totalEl.textContent = formatPrice(totals.productPayable);
  customerTotalEl.textContent = formatPrice(totals.totalCustomerPayable);
}

function saveAndRender(cart) {
  purchase.saveCart(cart);
  renderCart();
}

function increaseQuantity(index) {
  const cart = purchase.getCart();
  if (!cart[index]) return;
  cart[index].quantity += 1;
  saveAndRender(cart);
}

function decreaseQuantity(index) {
  const cart = purchase.getCart();
  if (!cart[index]) return;
  if (cart[index].quantity > 1) cart[index].quantity -= 1;
  else cart.splice(index, 1);
  saveAndRender(cart);
}

function removeItem(index) {
  const cart = purchase.getCart();
  if (!cart[index]) return;
  cart.splice(index, 1);
  saveAndRender(cart);
}

checkoutBtn.addEventListener("click", () => {
  const cart = purchase.getCart();
  if (!cart.length || cart.some(item => !item.available)) return;

  const route = purchase.getCheckoutRoute(cart);
  if (route === "free-download.html") {
    localStorage.setItem("roxxx_free_checkout", JSON.stringify({
      orderId: purchase.createOrderId(),
      items: cart,
      createdAt: new Date().toISOString()
    }));
  }
  window.location.href = route;
});

renderCart();
