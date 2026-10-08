const freeItemsEl = document.getElementById("freeItems");

function readOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem("roxxx_orders") || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    return [];
  }
}

let freeOrder = null;
try {
  freeOrder = JSON.parse(localStorage.getItem("roxxx_free_checkout") || "null");
} catch (error) {
  freeOrder = null;
}

if (freeOrder && Array.isArray(freeOrder.items) && freeOrder.items.length) {
  const validItems = freeOrder.items.filter(item => item.productType === "digital" && item.free === true);
  if (validItems.length !== freeOrder.items.length) {
    window.location.replace("cart.html");
  } else {
    const orders = readOrders();
    let order = orders.find(item => item.orderId === freeOrder.orderId);
    if (!order) {
      order = {
        orderId: freeOrder.orderId,
        items: validItems.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          productType: "digital",
          free: true,
          oldPrice: item.oldPrice,
          price: item.price,
          currentPrice: item.price,
          quantity: item.quantity,
          downloadUrl: item.downloadUrl || "",
          downloadLabel: item.downloadLabel || "Download / Read"
        })),
        subtotal: 0,
        discount: 0,
        finalPayableAmount: 0,
        discountPercent: 0,
        onlineDeliveryAmount: 0,
        deliveryAmountAtDoor: 0,
        deliveryRule: {note: "Free digital product; delivery does not apply."},
        customer: {name: null, phone: null, district: null, thana: null, address: null},
        delivery: null,
        bkashNumber: null,
        trxId: null,
        paymentMethod: "free",
        paymentStatus: "not_required",
        orderStatus: "available",
        createdAt: freeOrder.createdAt || new Date().toISOString(),
        timestamp: freeOrder.createdAt || new Date().toISOString()
      };
      orders.push(order);
      localStorage.setItem("roxxx_orders", JSON.stringify(orders));
    }
    localStorage.setItem("roxxx_last_free_order", JSON.stringify(order));
    localStorage.removeItem("roxxx_free_checkout");
    localStorage.removeItem("roxxx_cart");
    freeOrder = order;
  }
} else {
  try {
    freeOrder = JSON.parse(localStorage.getItem("roxxx_last_free_order") || "null");
  } catch (error) {
    freeOrder = null;
  }
}

if (!freeOrder || !Array.isArray(freeOrder.items)) {
  freeItemsEl.innerHTML = '<p class="purchase-empty">No free digital products are ready here yet.</p>';
} else {
  freeOrder.items.forEach(item => {
    const product = products.find(entry => Number(entry.id) === Number(item.id));
    const downloadUrl = item.downloadUrl || (product && product.downloadUrl) || "";
    const downloadLabel = item.downloadLabel || (product && product.downloadLabel) || "Download / Read";
    const card = document.createElement("article");
    card.className = "purchase-item";
    const image = document.createElement("img");
    image.src = item.image || "";
    image.alt = item.name || "Digital product";
    const content = document.createElement("div");
    content.className = "purchase-item-content";
    const title = document.createElement("h2");
    title.textContent = item.name;
    const meta = document.createElement("p");
    meta.className = "purchase-meta";
    meta.textContent = "Order reference: " + freeOrder.orderId + " · " + new Date(freeOrder.createdAt).toLocaleDateString();
    const status = document.createElement("span");
    status.className = "purchase-status available";
    status.textContent = "FREE · Available now";
    content.append(title, meta, status);
    if (downloadUrl) {
      const link = document.createElement("a");
      link.className = "purchase-action";
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = downloadLabel;
      content.appendChild(link);
    } else {
      const unavailable = document.createElement("button");
      unavailable.type = "button";
      unavailable.className = "purchase-action disabled";
      unavailable.disabled = true;
      unavailable.textContent = downloadLabel + " — file not available yet";
      content.appendChild(unavailable);
    }
    card.append(image, content);
    freeItemsEl.appendChild(card);
  });
}
