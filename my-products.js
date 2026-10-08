const list = document.getElementById("myProductsList");

function readOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem("roxxx_orders") || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    return [];
  }
}

const digitalPurchases = [];
readOrders().forEach(order => {
  (Array.isArray(order.items) ? order.items : []).forEach(item => {
    if (item.productType === "digital") digitalPurchases.push({order, item});
  });
});

digitalPurchases.sort((a, b) => new Date(b.order.createdAt) - new Date(a.order.createdAt));

if (!digitalPurchases.length) {
  list.innerHTML = '<p class="purchase-empty">No digital products yet. Free downloads and paid digital purchases will appear here.</p>';
} else {
  digitalPurchases.forEach(({order, item}) => {
    const product = products.find(entry => Number(entry.id) === Number(item.id));
    const downloadUrl = item.downloadUrl || (product && product.downloadUrl) || "";
    const downloadLabel = item.downloadLabel || (product && product.downloadLabel) || "Download PDF";
    const isAvailable = order.paymentStatus === "verified" ||
      (item.free === true && order.paymentStatus === "not_required");
    const card = document.createElement("article");
    card.className = "purchase-item";
    const image = document.createElement("img");
    image.src = item.image || "";
    image.alt = item.name || "Digital product";
    const content = document.createElement("div");
    content.className = "purchase-item-content";
    const title = document.createElement("h2");
    title.textContent = item.name;
    const purchaseDate = new Date(order.createdAt);
    const meta = document.createElement("p");
    meta.className = "purchase-meta";
    meta.textContent = "Order " + order.orderId + " · Purchased " +
      (Number.isNaN(purchaseDate.getTime()) ? "date unavailable" : purchaseDate.toLocaleDateString());
    const status = document.createElement("span");
    status.className = "purchase-status" + (isAvailable ? " available" : "");
    status.textContent = isAvailable
      ? (item.free ? "FREE · Available now" : "Payment verified · Available")
      : "Payment verification pending";
    content.append(title, meta, status);

    if (isAvailable) {
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
    }

    card.append(image, content);
    list.appendChild(card);
  });
}
