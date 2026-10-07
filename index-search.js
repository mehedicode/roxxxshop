/* =====================================================
   ROXXX.SHOP SEARCH SYSTEM
   Separate file - index.js remains untouched
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const overlay = document.getElementById("searchOverlay");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const empty = document.getElementById("searchEmpty");
  const closeBtn = document.getElementById("searchClose");
  const clearBtn = document.getElementById("searchClear");

  if (!overlay || !input || !results) return;

  /* ---------------------------------------------
     Get products from homepage
     --------------------------------------------- */

  function getProducts() {
    const cards = document.querySelectorAll(".card");
    const products = [];

    cards.forEach((card) => {

      const nameEl = card.querySelector(".name");
      const imageEl = card.querySelector(".product-img img");
      const currentEl = card.querySelector(".current");
      const oldEl = card.querySelector(".old");

      if (!nameEl || !imageEl || !currentEl) return;

      products.push({
        name: nameEl.textContent.trim(),
        image: imageEl.src,
        price: currentEl.textContent.trim(),
        oldPrice: oldEl ? oldEl.textContent.trim() : ""
      });

    });

    return products;
  }


  /* ---------------------------------------------
     Open Search
     --------------------------------------------- */

  window.openSearch = function () {

    overlay.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      input.focus();
    }, 100);

    showAllProducts();
  };


  /* ---------------------------------------------
     Close Search
     --------------------------------------------- */

  window.closeSearch = function () {

    overlay.classList.add("hidden");

    document.body.style.overflow = "";

    input.value = "";

    if (clearBtn) {
      clearBtn.classList.add("hidden");
    }

  };


  /* ---------------------------------------------
     Clear Search
     --------------------------------------------- */

  window.clearSearch = function () {

    input.value = "";

    clearBtn.classList.add("hidden");

    input.focus();

    showAllProducts();

  };


  /* ---------------------------------------------
     Display products
     --------------------------------------------- */

  function renderProducts(products) {

    results.innerHTML = "";

    if (products.length === 0) {

      empty.classList.remove("hidden");

      return;

    }

    empty.classList.add("hidden");


    products.forEach((product) => {

      const item = document.createElement("button");

      item.type = "button";

      item.className =
        "w-full flex items-center gap-3 p-3 text-left border-b border-brand-border last:border-b-0 hover:bg-slate-50 active:bg-slate-100";


      item.innerHTML = `
        <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="w-full h-full object-cover"
          >
        </div>

        <div class="min-w-0 flex-1">

          <h3 class="text-[14px] font-bold text-brand-dark truncate">
            ${product.name}
          </h3>

          <div class="mt-1 flex items-center gap-2">

            <span class="text-[14px] font-extrabold text-brand-primary">
              ${product.price}
            </span>

            ${
              product.oldPrice
                ? `<span class="text-[11px] text-slate-400 line-through">
                    ${product.oldPrice}
                  </span>`
                : ""
            }

          </div>

        </div>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-slate-400 flex-shrink-0"
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>
      `;


      item.addEventListener("click", () => {

        /*
          For now every product opens product.html.
          Later we will connect real product IDs.
        */

        window.location.href = "product.html";

      });


      results.appendChild(item);

    });

  }


  /* ---------------------------------------------
     Show all products
     --------------------------------------------- */

  function showAllProducts() {

    const products = getProducts();

    renderProducts(products);

  }


  /* ---------------------------------------------
     Search products
     --------------------------------------------- */

  function searchProducts() {

    const query = input.value.trim().toLowerCase();

    if (query.length > 0) {

      clearBtn.classList.remove("hidden");

    } else {

      clearBtn.classList.add("hidden");

    }


    const products = getProducts();


    if (!query) {

      renderProducts(products);

      return;

    }


    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );


    renderProducts(filtered);

  }


  /* ---------------------------------------------
     Events
     --------------------------------------------- */

  input.addEventListener("input", searchProducts);


  closeBtn.addEventListener("click", closeSearch);


  clearBtn.addEventListener("click", clearSearch);


  /* ---------------------------------------------
     Close when clicking outside search box
     --------------------------------------------- */

  overlay.addEventListener("click", (event) => {

    if (event.target === overlay) {

      closeSearch();

    }

  });


  /* ---------------------------------------------
     ESC key
     --------------------------------------------- */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && !overlay.classList.contains("hidden")) {

      closeSearch();

    }

  });

});