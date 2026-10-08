/* Shared purchasing rules and cart normalization for roxxx.shop. */
window.RoxxxPurchase = (() => {
  const OFFER_THRESHOLD = 2000;
  const OFFER_DISCOUNT_PERCENT = 20;
  const DELIVERY_CHARGE = 60;
  const BKASH_PERSONAL_NUMBER = "";

  function readCart() {
    try {
      const value = JSON.parse(localStorage.getItem("roxxx_cart") || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function getProduct(item) {
    if (typeof products === "undefined" || !Array.isArray(products)) return null;
    return products.find(product =>
      (item.id != null && Number(product.id) === Number(item.id)) ||
      (item.name && product.name === item.name)
    ) || null;
  }

  function normalizeItem(item) {
    if (!item || typeof item !== "object") return null;
    const product = getProduct(item);
    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) return null;

    if (!product) {
      return {
        ...item,
        quantity,
        productType: item.productType === "digital" ? "digital" : "physical",
        free: item.free === true,
        available: false
      };
    }

    return {
      id: product.id,
      name: product.name,
      image: product.image,
      productType: product.productType === "digital" ? "digital" : "physical",
      free: product.productType === "digital" && product.free === true,
      oldPrice: Number(product.oldPrice) || 0,
      price: Number(product.price) || 0,
      quantity,
      offerAvailable: product.offerAvailable !== false,
      downloadUrl: product.downloadUrl || "",
      downloadLabel: product.downloadLabel || "Download / Read",
      available: product.available !== false
    };
  }

  function getCart() {
    const cart = readCart().map(normalizeItem).filter(Boolean);
    localStorage.setItem("roxxx_cart", JSON.stringify(cart));
    return cart;
  }

  function saveCart(cart) {
    localStorage.setItem("roxxx_cart", JSON.stringify(cart.map(normalizeItem).filter(Boolean)));
  }

  function calculate(cart) {
    const items = cart.map(normalizeItem).filter(Boolean);
    const subtotal = items.reduce((sum, item) =>
      sum + (item.free ? 0 : item.price * item.quantity), 0
    );
    const hasPhysical = items.some(item => item.productType === "physical");
    const discountPercent = subtotal >= OFFER_THRESHOLD ? OFFER_DISCOUNT_PERCENT : 0;
    const discount = Math.round(subtotal * discountPercent / 100);
    const productPayable = subtotal - discount;
    const deliveryOnline = 0;
    const deliveryAtDoor = hasPhysical && subtotal < OFFER_THRESHOLD ? DELIVERY_CHARGE : 0;

    return {
      subtotal,
      discountPercent,
      discount,
      productPayable,
      deliveryOnline,
      deliveryAtDoor,
      totalCustomerPayable: productPayable + deliveryAtDoor,
      hasPhysical,
      hasDigital: items.some(item => item.productType === "digital"),
      allFreeDigital: items.length > 0 && items.every(item => item.productType === "digital" && item.free),
      hasPaidDigital: items.some(item => item.productType === "digital" && !item.free),
      deliveryNote: !hasPhysical
        ? "No delivery charge applies to digital products."
        : deliveryAtDoor
          ? "Delivery charge ৳60 — paid separately to the delivery person."
          : "FREE DELIVERY — delivery charge is covered by us."
    };
  }

  function createOrderId() {
    const stamp = Date.now().toString(36).toUpperCase();
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `ROX-${stamp}-${suffix}`;
  }

  function getCheckoutRoute(cart) {
    const totals = calculate(cart);
    if (!cart.length) return "cart.html";
    if (totals.allFreeDigital) return "free-download.html";
    if (totals.hasPhysical) return "delivery.html?checkout=1";
    return "checkout.html";
  }

  function formatPrice(value) {
    return `৳${Number(value || 0).toLocaleString("en-BD")}`;
  }

  return {
    OFFER_THRESHOLD,
    OFFER_DISCOUNT_PERCENT,
    DELIVERY_CHARGE,
    BKASH_PERSONAL_NUMBER,
    getCart,
    saveCart,
    normalizeItem,
    calculate,
    getCheckoutRoute,
    createOrderId,
    formatPrice
  };
})();
