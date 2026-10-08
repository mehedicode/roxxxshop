/* =========================================
   ROXXX.SHOP - ALL PRODUCTS
========================================= */


const products = [

  {
    id: 1,
    name: "Premium Classic Watch",
    category: "watch",
    image: "https://placehold.co/700x700/e2e8f0/0f172a?text=Classic+Watch",
    price: 1590,
    oldPrice: 1990,
    discount: 20,
    rating: 4.8,
    sold: 128,
    newest: 5,
    description: "A premium classic watch with an elegant design, suitable for everyday wear and special occasions."
  },

  {
    id: 2,
    name: "Elegant Premium Watch",
    category: "watch",
    image: "https://placehold.co/700x700/dbeafe/0f172a?text=Premium+Watch",
    price: 1890,
    oldPrice: 2290,
    discount: 17,
    rating: 4.7,
    sold: 96,
    newest: 4,
    description: "An elegant premium watch designed with a refined look for everyday style and special occasions."
  },

  {
    id: 3,
    name: "Classic Leather Watch",
    category: "watch",
    image: "https://placehold.co/700x700/f1f5f9/0f172a?text=Leather+Watch",
    price: 1490,
    oldPrice: 1790,
    discount: 17,
    rating: 4.6,
    sold: 84,
    newest: 3,
    description: "A classic leather watch featuring a timeless design and comfortable style for daily use."
  },

  {
    id: 4,
    name: "Premium Dark Chocolate",
    category: "chocolate",
    image: "https://placehold.co/700x700/fef3c7/0f172a?text=Dark+Chocolate",
    price: 590,
    oldPrice: 690,
    discount: 14,
    rating: 4.8,
    sold: 215,
    newest: 6,
    description: "Premium dark chocolate with a rich taste, carefully selected for chocolate lovers."
  },

  {
    id: 5,
    name: "Luxury Chocolate Gift Box",
    category: "chocolate",
    image: "https://placehold.co/700x700/fce7f3/0f172a?text=Chocolate+Gift",
    price: 890,
    oldPrice: 1090,
    discount: 18,
    rating: 4.7,
    sold: 167,
    newest: 7,
    description: "A luxurious chocolate gift box made for special occasions, celebrations and thoughtful gifting."
  },

  {
    id: 6,
    name: "Premium Digital Book",
    category: "book",
    image: "https://placehold.co/700x700/e0f2fe/0f172a?text=Digital+Book",
    price: 490,
    oldPrice: 690,
    discount: 29,
    rating: 4.9,
    sold: 302,
    newest: 8,
    description: "A premium digital book with useful and engaging content, delivered instantly after purchase."
  },

  {
    id: 7,
    name: "Special Selection Watch",
    category: "watch",
    image: "https://placehold.co/700x700/ede9fe/0f172a?text=Special+Watch",
    price: 1680,
    oldPrice: 2000,
    discount: 16,
    rating: 4.6,
    sold: 64,
    newest: 2,
    description: "A specially selected watch combining a stylish appearance with a premium everyday look."
  },

  {
    id: 8,
    name: "Premium Gift Collection",
    category: "chocolate",
    image: "https://placehold.co/700x700/fef2f2/0f172a?text=Gift+Collection",
    price: 1290,
    oldPrice: 1590,
    discount: 19,
    rating: 4.5,
    sold: 53,
    newest: 1,
    description: "A premium gift collection featuring carefully selected items, perfect for gifting and special moments."
  }

];


const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const noProducts = document.getElementById("noProducts");

const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const closeFilter = document.getElementById("closeFilter");
const applyFilter = document.getElementById("applyFilter");

const sortSelect = document.getElementById("sortSelect");
const cartBadge = document.getElementById("cartBadge");


let selectedCategory = "all";


/* =========================================
   CART COUNT
========================================= */

function updateCartBadge(){

  const cart = JSON.parse(
    localStorage.getItem("roxxx_cart") || "[]"
  );

  const count = cart.reduce(
    (total,item) => total + Number(item.quantity || 0),
    0
  );

  cartBadge.textContent = count;

}


/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts(list){

  productGrid.innerHTML = "";

  productCount.textContent =
    `${list.length} product${list.length !== 1 ? "s" : ""}`;


  if(list.length === 0){

    noProducts.classList.add("show");

    return;

  }


  noProducts.classList.remove("show");


  list.forEach(product => {

    const card = document.createElement("article");

    card.className = "product-card";


    card.innerHTML = `

      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <span class="discount">
          -${product.discount}%
        </span>

      </div>


      <div class="product-info">

        <h2 class="product-name">
          ${product.name}
        </h2>


        <div class="rating">

          <span class="stars">
            ★★★★★
          </span>

          <b>${product.rating}</b>

          <span class="sold">
            (${product.sold} sold)
          </span>

        </div>


        <div class="price-row">

          <span class="current-price">
            ৳ ${product.price.toLocaleString("en-BD")}
          </span>

          <span class="old-price">
            ৳ ${product.oldPrice.toLocaleString("en-BD")}
          </span>

        </div>


        <div class="card-actions">

          <button
            class="buy-button"
            type="button"
            onclick="buyProduct(${product.id})"
          >
            Details
          </button>

          <button
            class="cart-button"
            type="button"
            onclick="addProductToCart(${product.id})"
            aria-label="Add to cart"
          >
            🛒
          </button>

        </div>

      </div>

    `;


    productGrid.appendChild(card);

  });

}


/* =========================================
   FILTER + SORT
========================================= */

function refreshProducts(){

  let list = [...products];


  if(selectedCategory !== "all"){

    list = list.filter(
      product => product.category === selectedCategory
    );

  }


  const sortValue = sortSelect.value;


  if(sortValue === "price-low"){

    list.sort(
      (a,b) => a.price - b.price
    );

  }


  if(sortValue === "price-high"){

    list.sort(
      (a,b) => b.price - a.price
    );

  }


  if(sortValue === "best"){

    list.sort(
      (a,b) => b.sold - a.sold
    );

  }


  if(sortValue === "newest"){

    list.sort(
      (a,b) => b.newest - a.newest
    );

  }


  renderProducts(list);

}


/* =========================================
   ADD TO CART
========================================= */

function addProductToCart(id){

  const product = products.find(
    item => item.id === id
  );

  if(!product) return;


  const cart = JSON.parse(
    localStorage.getItem("roxxx_cart") || "[]"
  );


  const existing = cart.find(
    item => item.name === product.name
  );


  const cartProduct = {
    name: product.name,
    image: product.image,
    price: product.price,
    oldPrice: product.oldPrice
  };


  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({
      ...cartProduct,
      quantity: 1
    });

  }


  localStorage.setItem(
    "roxxx_cart",
    JSON.stringify(cart)
  );


  updateCartBadge();

}


/* =========================================
   BUY NOW
========================================= */

function buyProduct(id){

  const product = products.find(
    item => item.id === id
  );

  if(!product) return;


  localStorage.setItem(
    "roxxx_buy_now",
    JSON.stringify({
      name: product.name,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      sold: product.sold,
      discount: product.discount,
      description: product.description,
      quantity: 1
    })
  );


  window.location.href = "product.html";

}

/* =========================================
   FILTER PANEL
========================================= */

filterBtn.addEventListener("click", () => {

  filterPanel.classList.toggle("open");

});


closeFilter.addEventListener("click", () => {

  filterPanel.classList.remove("open");

});


applyFilter.addEventListener("click", () => {

  const selected =
    document.querySelector(
      'input[name="category"]:checked'
    );

  selectedCategory =
    selected ? selected.value : "all";


  refreshProducts();

  filterPanel.classList.remove("open");

});


/* =========================================
   SORT
========================================= */

sortSelect.addEventListener("change", refreshProducts);


/* =========================================
   INITIAL LOAD
========================================= */

refreshProducts();

updateCartBadge();