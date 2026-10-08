/* =========================================
   ROXXX.SHOP - ALL PRODUCTS
========================================= */



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

        ${product.offerAvailable !== false && !product.free ? `<span class="discount">-${product.discount}%</span>` : ""}

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
          <span class="current-price ${product.free && product.productType === "digital" ? "free-label" : ""}">
            ${product.free && product.productType === "digital" ? "FREE" : `৳ ${product.price.toLocaleString("en-BD")}`}
          </span>
          ${!product.free && product.offerAvailable !== false && Number(product.oldPrice) > Number(product.price) ? `<span class="old-price">৳ ${product.oldPrice.toLocaleString("en-BD")}</span>` : ""}
        </div>


        <div class="card-actions">

          <button
            class="buy-button"
            type="button"
            ${product.available === false ? "disabled" : ""}
            onclick="buyProduct(${product.id})"
          >
            Details
          </button>

          <button
            class="cart-button"
            type="button"
            ${product.available === false ? "disabled" : ""}
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

  if(product.available === false) return;


  const cart = JSON.parse(
    localStorage.getItem("roxxx_cart") || "[]"
  );


  const existing = cart.find(
    item => Number(item.id) === product.id || item.name === product.name
  );


  const cartProduct = {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    oldPrice: product.oldPrice,
    productType: product.productType,
    free: product.free === true,
    offerAvailable: product.offerAvailable !== false,
    downloadUrl: product.downloadUrl || ""
  };


  if(existing){

    Object.assign(existing, cartProduct, {
      quantity: Number(existing.quantity || 0) + 1
    });

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

alert(`${product.name} added to cart!`);

}


/* =========================================
   BUY NOW
========================================= */
function buyProduct(id){

  const product = products.find(
    item => item.id === id
  );

  if(!product) return;

  window.location.href = `product.html?id=${product.id}`;

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
