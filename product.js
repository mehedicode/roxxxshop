

/* =========================================
   LOAD PRODUCT FROM CENTRAL DATA
========================================= */

const params = new URLSearchParams(
  window.location.search
);

const productId = Number(
  params.get("id")
);

const product = products.find(
  item => item.id === productId
);


/* =========================================
   PRODUCT UI
========================================= */

if (!product) {

  alert("Product not found.");

  window.location.href = "shop.html";

} else {

  const productNameEl =
    document.getElementById("productName");

  const productImageEl =
    document.getElementById("productImage");

  const productPriceEl =
    document.getElementById("currentPrice");

  const productOldPriceEl =
    document.getElementById("oldPrice");

  const ratingEl =
    document.getElementById("rating");

  const soldEl =
    document.getElementById("sold");

  const discountBadgeEl =
    document.getElementById("discountBadge");

  const descriptionEl =
    document.querySelector(".description p");


  if (productNameEl) {
    productNameEl.textContent =
      product.name;
  }


  if (productImageEl) {
    productImageEl.src =
      product.image;

    productImageEl.alt =
      product.name;
  }


  if (productPriceEl) {
    productPriceEl.textContent =
      product.productType === "digital" && product.free
        ? "FREE"
        : `৳${Number(product.price).toLocaleString("en-BD")}`;

    if (product.productType === "digital" && product.free) {
      productPriceEl.classList.add("free-label");
    }
  }


  if (productOldPriceEl) {
    productOldPriceEl.textContent =
      `৳${Number(product.oldPrice).toLocaleString("en-BD")}`;
    productOldPriceEl.hidden = product.free === true || product.offerAvailable === false || Number(product.oldPrice) <= Number(product.price);
  }


  if (ratingEl) {
    ratingEl.textContent =
      product.rating;
  }


  if (soldEl) {
    soldEl.textContent =
      `${product.sold} sold`;
  }


  if (discountBadgeEl) {
    discountBadgeEl.textContent =
      `-${product.discount}%`;
    discountBadgeEl.hidden = product.free === true || product.offerAvailable === false;
  }


  if (descriptionEl) {
    descriptionEl.textContent =
      product.description;
  }

}

/* =========================================
   QUANTITY
========================================= */

const quantityEl =
  document.getElementById("quantity");

const toast =
  document.getElementById("toast");

let quantity = Number(product && product.quantity) || 1;


function updateQuantity() {

  if (quantityEl) {
    quantityEl.textContent = quantity;
  }

}


updateQuantity();


/* =========================================
   MINUS BUTTON
========================================= */

const minusBtn =
  document.getElementById("minusBtn");


if (minusBtn) {

  minusBtn.onclick = () => {

    if (quantity > 1) {
      quantity--;
      updateQuantity();
    }

  };

}


/* =========================================
   PLUS BUTTON
========================================= */

const plusBtn =
  document.getElementById("plusBtn");


if (plusBtn) {

  plusBtn.onclick = () => {

    quantity++;
    updateQuantity();

  };

}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);

}


/* =========================================
   ADD TO CART
========================================= */

const addCartBtn =
  document.getElementById("addCartBtn");


if (addCartBtn) {

  addCartBtn.disabled = product.available === false;

  addCartBtn.onclick = () => {

    if(!product) return;
    if(product.available === false) return;

    const cart = JSON.parse(
      localStorage.getItem("roxxx_cart") || "[]"
    );


    const existing = cart.find(
      item => Number(item.id) === product.id || item.name === product.name
    );


    if (existing) {

      Object.assign(existing, {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        oldPrice: product.oldPrice,
        productType: product.productType,
        free: product.free === true,
        offerAvailable: product.offerAvailable !== false,
        downloadUrl: product.downloadUrl || "",
        quantity: Number(existing.quantity || 0) + quantity
      });

    } else {

      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        oldPrice: product.oldPrice,
        productType: product.productType,
        free: product.free === true,
        offerAvailable: product.offerAvailable !== false,
        downloadUrl: product.downloadUrl || "",
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

}


/* =========================================
   BUY NOW
========================================= */

const buyNowBtn =
  document.getElementById("buyNowBtn");


if (buyNowBtn) {

  buyNowBtn.disabled = product.available === false;

  buyNowBtn.onclick = () => {

    if(!product) return;
    if(product.available === false) return;

    localStorage.setItem(
      "roxxx_buy_now",
      JSON.stringify({
        id: product.id,
        quantity: quantity
      })
    );


    showToast("Buy Now selected");

  };

}
