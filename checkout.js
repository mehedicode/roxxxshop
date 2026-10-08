const purchase = window.RoxxxPurchase;
const cart = purchase.getCart();
const totals = purchase.calculate(cart);
const paymentContent = document.getElementById("paymentContent");
const paymentInstructions = document.getElementById("paymentInstructions");
const paymentSuccess = document.getElementById("paymentSuccess");
const paymentForm = document.getElementById("paymentForm");
const formatPrice = purchase.formatPrice;

function readDeliveryInfo() {
  try {
    return JSON.parse(localStorage.getItem("roxxx_delivery_info") || "null");
  } catch (error) {
    return null;
  }
}

function getOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem("roxxx_orders") || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    return [];
  }
}

function showSubmissionConfirmation(orderId) {
  paymentContent.hidden = true;
  paymentInstructions.hidden = true;
  paymentSuccess.hidden = false;
  document.getElementById("orderId").textContent = orderId;
}

if (!cart.length) {
  const lastOrder = (() => {
    try { return JSON.parse(localStorage.getItem("roxxx_last_order") || "null"); }
    catch (error) { return null; }
  })();
  if (lastOrder && lastOrder.paymentStatus === "pending") showSubmissionConfirmation(lastOrder.orderId);
  else window.location.replace("cart.html");
} else if (cart.some(item => !item.available)) {
  window.location.replace("cart.html");
} else if (totals.allFreeDigital) {
  window.location.replace("free-download.html");
} else if (totals.hasPhysical && !readDeliveryInfo()) {
  window.location.replace("delivery.html?checkout=1");
} else {
  if (!totals.hasPhysical) localStorage.removeItem("roxxx_delivery_info");

  document.getElementById("orderTypeNote").textContent = totals.hasPhysical
    ? "One order and one payment cover all physical and digital items."
    : "Digital products only. No delivery address or delivery charge is needed.";

  const itemsEl = document.getElementById("checkoutItems");
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "checkout-item";
    const image = document.createElement("img");
    image.className = "checkout-item-image";
    image.src = item.image;
    image.alt = item.name;
    const info = document.createElement("div");
    info.className = "checkout-item-info";
    const name = document.createElement("span");
    name.className = "checkout-item-name";
    name.textContent = item.name;
    const qty = document.createElement("span");
    qty.className = "checkout-item-qty";
    qty.textContent = "Qty: " + item.quantity + " × " + (item.free ? "FREE" : formatPrice(item.price));
    const amount = document.createElement("strong");
    amount.className = "checkout-item-total";
    amount.textContent = item.free ? "FREE" : formatPrice(item.price * item.quantity);
    info.append(name, qty);
    row.append(image, info, amount);
    itemsEl.appendChild(row);
  });

  document.getElementById("subtotal").textContent = formatPrice(totals.subtotal);
  document.getElementById("discount").textContent = "−" + formatPrice(totals.discount);
  document.getElementById("discountRow").hidden = totals.discount === 0;
  document.getElementById("deliveryOnline").textContent = formatPrice(totals.deliveryOnline);
  document.getElementById("deliveryNote").textContent = totals.deliveryNote;
  document.getElementById("deliveryAtDoor").textContent = formatPrice(totals.deliveryAtDoor);
  document.getElementById("doorDeliveryRow").hidden = totals.deliveryAtDoor === 0;
  document.getElementById("total").textContent = formatPrice(totals.productPayable);
  document.getElementById("customerTotal").textContent = formatPrice(totals.totalCustomerPayable);

  const merchantNumber = purchase.BKASH_PERSONAL_NUMBER;
  document.getElementById("merchantBkashNumber").textContent = merchantNumber || "Not configured — contact roxxx.shop before sending money";
  const confirmButton = document.getElementById("confirmPaymentButton");
  confirmButton.disabled = !merchantNumber;
  const senderNumber = document.getElementById("senderBkashNumber");
  senderNumber.addEventListener("input", () => {
    senderNumber.value = senderNumber.value.replace(/\D/g, "").slice(0, 11);
  });

  paymentForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!paymentForm.reportValidity()) return;
    if (!merchantNumber) {
      alert("The shop bKash number has not been configured yet. No payment details were submitted.");
      return;
    }
    const senderBkashNumber = senderNumber.value.trim();
    if (!/^01[3-9]\d{8}$/.test(senderBkashNumber)) {
      alert("Please enter a valid 11-digit Bangladeshi bKash number.");
      senderNumber.focus();
      return;
    }

    const delivery = totals.hasPhysical ? readDeliveryInfo() : null;
    if (totals.hasPhysical && (!delivery || !delivery.name?.trim() || !/^01[3-9]\d{8}$/.test(delivery.phone || "") || !delivery.district?.trim() || !delivery.thana?.trim() || !delivery.address?.trim())) {
      window.location.replace("delivery.html?checkout=1");
      return;
    }

    const now = new Date().toISOString();
    const orderId = purchase.createOrderId();
    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      productType: item.productType,
      free: item.free,
      oldPrice: item.oldPrice,
      price: item.price,
      currentPrice: item.price,
      quantity: item.quantity,
      downloadUrl: item.downloadUrl || "",
      downloadLabel: item.downloadLabel || "Download / Read"
    }));
    const order = {
      orderId,
      items,
      subtotal: totals.subtotal,
      discountPercent: totals.discountPercent,
      discount: totals.discount,
      finalPayableAmount: totals.productPayable,
      onlineDeliveryAmount: totals.deliveryOnline,
      deliveryAmountAtDoor: totals.deliveryAtDoor,
      deliveryRule: {
        threshold: purchase.OFFER_THRESHOLD,
        discountPercent: totals.discountPercent,
        freeDelivery: totals.hasPhysical && totals.deliveryAtDoor === 0,
        customerPaysDeliveryPerson: totals.deliveryAtDoor,
        note: totals.deliveryNote
      },
      customer: delivery ? {
        name: delivery.name,
        phone: delivery.phone,
        district: delivery.district,
        thana: delivery.thana,
        address: delivery.address
      } : {name: null, phone: null, district: null, thana: null, address: null},
      delivery: delivery || null,
      bkashNumber: senderBkashNumber,
      trxId: document.getElementById("transactionId").value.trim(),
      paymentMethod: "bkash_manual",
      paymentStatus: "pending",
      orderStatus: "pending_verification",
      createdAt: now,
      timestamp: now
    };

    const orders = getOrders();
    orders.push(order);
    localStorage.setItem("roxxx_orders", JSON.stringify(orders));
    localStorage.setItem("roxxx_last_order", JSON.stringify(order));
    localStorage.removeItem("roxxx_cart");
    localStorage.removeItem("roxxx_delivery_info");
    showSubmissionConfirmation(orderId);
  });
}
