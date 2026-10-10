/* =========================================
   ROXXX.SHOP REFER & EARN
   FRONTEND DEMO ONLY
   Backend will become the source of truth.
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /*
    DEMO DATA

    Later these values will come from backend/database.
  */

  const referralData = {
    referralCode: "ROX12345",

    totalSellAmount: 3200,
    refBonusAmount: 800,
    availableBalance: 800,
    totalWithdraw: 0,

    referredUsers: 8,
    activeBuyers: 3
  };


  /* =========================================
     LEVEL RULES
     ========================================= */

  function getLevel(sales) {

    if (sales >= 20000) {
      return {
        name: "Level 3",
        rate: 35,
        minimum: 20000,
        next: null
      };
    }

    if (sales >= 5000) {
      return {
        name: "Level 2",
        rate: 30,
        minimum: 5000,
        next: 20000
      };
    }

    return {
      name: "Level 1",
      rate: 25,
      minimum: 0,
      next: 5000
    };
  }


  /* =========================================
     MONEY FORMAT
     ========================================= */

  function money(amount) {

    return `৳${Number(amount || 0).toLocaleString("en-BD")}`;

  }


  /* =========================================
     RENDER DASHBOARD
     ========================================= */

  function renderDashboard() {

    const sales =
      Number(referralData.totalSellAmount || 0);

    const level =
      getLevel(sales);


    document.getElementById("totalSellAmount").textContent =
      money(referralData.totalSellAmount);


    document.getElementById("refBonusAmount").textContent =
      money(referralData.refBonusAmount);


    document.getElementById("availableBalance").textContent =
      money(referralData.availableBalance);


    document.getElementById("totalWithdraw").textContent =
      money(referralData.totalWithdraw);


    document.getElementById("withdrawBalance").textContent =
      money(referralData.availableBalance);


    document.getElementById("referredUsers").textContent =
      referralData.referredUsers;


    document.getElementById("activeBuyers").textContent =
      referralData.activeBuyers;


    document.getElementById("levelTitle").textContent =
      level.name;


    document.getElementById("commissionRate").textContent =
      `${level.rate}%`;


    document.getElementById("levelSales").textContent =
      money(sales);


    if (level.next === null) {

      document.getElementById("levelProgress").style.width =
        "100%";

      document.getElementById("nextLevelText").textContent =
        "Highest level reached";

      document.getElementById("remainingAmount").textContent =
        "Level 3 active";

      document.getElementById("levelNote").textContent =
        "You are currently at the highest level with 35% commission.";

      return;
    }


    const progress =
      Math.min(
        100,
        Math.max(
          0,
          ((sales - level.minimum) /
            (level.next - level.minimum)) * 100
        )
      );


    const remaining =
      Math.max(0, level.next - sales);


    document.getElementById("levelProgress").style.width =
      `${progress}%`;


    document.getElementById("nextLevelText").textContent =
      `Next level: ${money(level.next)}`;


    document.getElementById("remainingAmount").textContent =
      `${money(remaining)} remaining`;


    const nextLevel =
      level.name === "Level 1"
        ? "Level 2"
        : "Level 3";


    document.getElementById("levelNote").textContent =
      `Reach ${money(level.next)} in confirmed referral sales to unlock ${nextLevel}.`;

  }


  /* =========================================
     REFERRAL LINK
     ========================================= */

  function setupReferralLink() {

    const link =
      `https://roxxx.shop/?ref=${referralData.referralCode}`;

    document.getElementById("referralLink").value =
      link;

  }


  /* =========================================
     COPY LINK
     ========================================= */

  async function copyReferralLink() {

    const input =
      document.getElementById("referralLink");

    const message =
      document.getElementById("copyMessage");


    try {

      await navigator.clipboard.writeText(
        input.value
      );

    } catch (error) {

      input.select();

      document.execCommand("copy");

    }


    message.textContent =
      "Referral link copied.";


    setTimeout(() => {

      message.textContent = "";

    }, 2200);

  }


  /* =========================================
     WITHDRAWAL FORM
     ========================================= */

  function setupWithdrawal() {

    const form =
      document.getElementById("withdrawForm");

    const message =
      document.getElementById("withdrawMessage");


    form.addEventListener("submit", (event) => {

      event.preventDefault();


      const bkashNumber =
        document.getElementById("bkashNumber")
          .value
          .trim();


      const amount =
        Number(
          document.getElementById("withdrawAmount")
            .value
        );


      message.className =
        "form-message";


      /* bKash number validation */

      if (!/^01[3-9]\d{8}$/.test(bkashNumber)) {

        message.textContent =
          "Enter a valid 11-digit bKash number.";

        message.classList.add("error");

        return;

      }


      /* Minimum withdrawal */

      if (!Number.isFinite(amount) || amount < 50) {

        message.textContent =
          "Minimum withdrawal amount is ৳50.";

        message.classList.add("error");

        return;

      }


      /* Balance validation */

      if (amount > referralData.availableBalance) {

        message.textContent =
          "Withdrawal amount cannot exceed your available balance.";

        message.classList.add("error");

        return;

      }


      /*
        FRONTEND DEMO ONLY

        Later backend will:
        - create withdrawal request
        - validate balance
        - prevent double withdrawal
        - save bKash number
        - set Pending status
        - allow admin to Paid/Rejected
      */


      message.textContent =
        "Demo withdrawal request created.";

      message.classList.add("success");


      form.reset();

    });

  }


  /* =========================================
     EVENTS
     ========================================= */

  document
    .getElementById("copyLinkBtn")
    .addEventListener(
      "click",
      copyReferralLink
    );


  /* =========================================
     INITIALIZE
     ========================================= */

  setupReferralLink();

  renderDashboard();

  setupWithdrawal();

});