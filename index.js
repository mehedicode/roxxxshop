
    /* HERO: 4 seconds */
    const heroTrack=document.getElementById("heroTrack");
    const heroSlides=document.querySelectorAll(".hero-slide");
    const heroDots=document.getElementById("heroDots");
    let heroIndex=0;

    heroSlides.forEach((_,i)=>{
      const d=document.createElement("button");
      d.className="w-2 h-2 rounded-full bg-slate-300";
      d.onclick=()=>{heroIndex=i;updateHero()};
      heroDots.appendChild(d);
    });

    function updateHero(){
      heroTrack.style.transform=`translateX(-${heroIndex*100}%)`;
      [...heroDots.children].forEach((d,i)=>{
        d.className=i===heroIndex
          ?"w-5 h-2 rounded-full bg-brand-primary"
          :"w-2 h-2 rounded-full bg-slate-300";
      });
    }
    updateHero();
    setInterval(()=>{
      heroIndex=(heroIndex+1)%heroSlides.length;
      updateHero();
    },4000);

    /* HOT DEAL: 2 cards mobile, 4 desktop; every 2 seconds */
    const hotTrack=document.getElementById("hotTrack");
    const hotCards=document.querySelectorAll(".hot-card");
    let hotIndex=0;

    function updateHot(){
      const visible=innerWidth>=768?4:2;
      const max=Math.max(0,hotCards.length-visible);
      if(hotIndex>max)hotIndex=0;
      const w=hotCards[0].getBoundingClientRect().width;
      hotTrack.style.transform=`translateX(-${hotIndex*(w+12)}px)`;
    }
    updateHot();
    setInterval(()=>{
      const visible=innerWidth>=768?4:2;
      const max=Math.max(0,hotCards.length-visible);
      hotIndex=hotIndex>=max?0:hotIndex+1;
      updateHot();
    },2000);
    addEventListener("resize",updateHot);

    function updateHomeCardPrices(){
      document.querySelectorAll(".card").forEach(card => {
        const detailsButton = card.querySelector("button.buy");
        const match = detailsButton && detailsButton.getAttribute("onclick").match(/buyNow\((\d+)\)/);
        const product = match && products.find(item => item.id === Number(match[1]));
        const current = card.querySelector(".current");
        const old = card.querySelector(".old");
        const discount = card.querySelector(".discount");
        const name = card.querySelector(".name");
        const image = card.querySelector(".product-img img");
        if(!product || !current) return;

        const cartButton = card.querySelector("button.cart");
        if(detailsButton) detailsButton.disabled = product.available === false;
        if(cartButton) cartButton.disabled = product.available === false;

        if(name) name.textContent = product.name;
        if(image){
          image.src = product.image;
          image.alt = product.name;
        }
        const rating = card.querySelector(".rating b");
        const sold = card.querySelector(".sold");
        if(rating) rating.textContent = product.rating;
        if(sold) sold.textContent = `(${product.sold} sold)`;

        if(product.productType === "digital" && product.free){
          current.textContent = "FREE";
          current.classList.add("free-label");
          if(old) old.hidden = true;
          if(discount) discount.hidden = true;
          return;
        }

        current.textContent = `৳ ${Number(product.price).toLocaleString("en-BD")}`;
        current.classList.remove("free-label");
        if(old){
          old.textContent = `৳ ${Number(product.oldPrice).toLocaleString("en-BD")}`;
          old.hidden = product.offerAvailable === false || Number(product.oldPrice) <= Number(product.price);
        }
        if(discount){
          discount.textContent = `-${product.discount}%`;
          discount.hidden = product.offerAvailable === false || product.free === true;
        }
      });
    }
    updateHomeCardPrices();

    /* CART ACTIONS */
    function updateCartBadges(){
      const cart = JSON.parse(localStorage.getItem("roxxx_cart") || "[]");
      const count = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      );

      document.getElementById("topBadge").textContent = count;
      document.getElementById("bottomBadge").textContent = count;
    }

    const cartSuccessModal = document.getElementById("cartSuccessModal");
    const cartSuccessProduct = document.getElementById("cartSuccessProduct");
    const continueShoppingButton = document.getElementById("continueShoppingButton");

    function showCartSuccess(productName){
      cartSuccessProduct.textContent = productName;
      cartSuccessModal.hidden = false;
      document.body.style.overflow = "hidden";
      continueShoppingButton.focus();
    }

    function hideCartSuccess(){
      cartSuccessModal.hidden = true;
      document.body.style.overflow = "";
    }

    continueShoppingButton.addEventListener("click", hideCartSuccess);
    cartSuccessModal.addEventListener("click", event => {
      if(event.target === cartSuccessModal) hideCartSuccess();
    });
    document.addEventListener("keydown", event => {
      if(event.key === "Escape" && !cartSuccessModal.hidden) hideCartSuccess();
    });

    function addToCart(id){
      const product = products.find(item => item.id === id);
      if(!product) return;

      const cart = JSON.parse(localStorage.getItem("roxxx_cart") || "[]");
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
        cart.push({...cartProduct, quantity: 1});
      }

      localStorage.setItem("roxxx_cart", JSON.stringify(cart));
      updateCartBadges();
      showCartSuccess(product.name);
    }

    updateCartBadges();


    function buyNow(id){

  const product = products.find(
    item => item.id === id
  );

  if(!product){
    alert("Product not found.");
    return;
  }

  window.location.href = `product.html?id=${product.id}`;
}

    function openCart(){window.location.href = "cart.html";}
    function openAccount(){window.location.href = "account.html";}

