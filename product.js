/* =========================================
   LOAD PRODUCT
========================================= */

const defaultProduct = {
  name: "Premium Classic Watch",
  image:
    "https://placehold.co/900x900/e2e8f0/0f172a?text=Premium+Classic+Watch",
  price: 1590,
  oldPrice: 1990,
  quantity: 1
};


const savedProduct = localStorage.getItem("roxxx_buy_now");

let product = defaultProduct;

if (savedProduct) {
  try {
    const parsedProduct = JSON.parse(savedProduct);

    if (
      parsedProduct &&
      parsedProduct.name &&
      parsedProduct.image &&
      typeof parsedProduct.price === "number"
    ) {
      product = {
        ...defaultProduct,
        ...parsedProduct
      };
    }

  } catch (error) {
    console.error("Invalid product data:", error);
  }
}


/* =========================================
   PRODUCT UI
========================================= */

const productNameEl =
  document.getElementById("productName");

const productImageEl =
  document.getElementById("productImage");

const productPriceEl =
  document.getElementById("currentPrice");

const productOldPriceEl =
  document.getElementById("oldPrice");


if (productNameEl) {
  productNameEl.textContent = product.name;
}

if (productImageEl) {
  productImageEl.src = product.image;
  productImageEl.alt = product.name;
}

if (productPriceEl) {
  productPriceEl.textContent = `৳${product.price}`;
}

if (productOldPriceEl) {
  productOldPriceEl.textContent = `৳${product.oldPrice}`;
}


/* =========================================
   QUANTITY
========================================= */

const quantityEl =
  document.getElementById("quantity");

const toast =
  document.getElementById("toast");

let quantity = Number(product.quantity) || 1;


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

  addCartBtn.onclick = () => {

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

}


/* =========================================
   BUY NOW
========================================= */

const buyNowBtn =
  document.getElementById("buyNowBtn");


if (buyNowBtn) {

  buyNowBtn.onclick = () => {

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

}