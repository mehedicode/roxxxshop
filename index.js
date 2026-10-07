
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

    /* DEMO ACTIONS */
    let cartCount=0;
    function addToCart(){
      cartCount++;
      document.getElementById("topBadge").textContent=cartCount;
      document.getElementById("bottomBadge").textContent=cartCount;
    }
    function buyNow(name){alert("Buy Now: "+name)}
    function openSearch(){alert("Search will be connected later.")}
    function openCart(){alert("Cart items: "+cartCount)}
    function openAccount(){alert("Account will be connected later.")}
 