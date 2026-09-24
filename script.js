document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     1. 商品数据
  ========================= */

  const products = [
    {
      id: 1,
      name: "天然磨牙骨",
      category: "狗狗",
      price: 39,
      emoji: "🦴",
      description: "帮助狗狗磨牙洁齿，适合日常咀嚼。"
    },
    {
      id: 2,
      name: "智能宠物食碗",
      category: "用品",
      price: 89,
      emoji: "🥣",
      description: "方便清洁的宠物食碗，适合日常喂食。"
    },
    {
      id: 3,
      name: "互动毛绒玩具",
      category: "玩具",
      price: 29,
      emoji: "🧸",
      description: "适合宠物互动玩耍，帮助减少无聊。"
    },
    {
      id: 4,
      name: "宠物牵引绳",
      category: "狗狗",
      price: 59,
      emoji: "🦮",
      description: "日常遛狗使用，舒适耐用。"
    },
    {
      id: 5,
      name: "猫咪逗猫棒",
      category: "猫咪",
      price: 25,
      emoji: "🐱",
      description: "增加猫咪运动量，适合互动玩耍。"
    },
    {
      id: 6,
      name: "宠物舒适软垫",
      category: "用品",
      price: 99,
      emoji: "🛏️",
      description: "柔软舒适的宠物休息垫。"
    },
    {
      id: 7,
      name: "洁齿小零食",
      category: "零食",
      price: 45,
      emoji: "🍖",
      description: "适合日常奖励和训练。"
    },
    {
      id: 8,
      name: "耐咬橡胶球",
      category: "玩具",
      price: 35,
      emoji: "⚽",
      description: "耐咬互动玩具，适合狗狗日常玩耍。"
    },
    {
      id: 9,
      name: "猫咪营养罐头",
      category: "猫咪",
      price: 16,
      emoji: "🥫",
      description: "猫咪日常营养补充食品。"
    },
    {
      id: 10,
      name: "宠物湿巾",
      category: "用品",
      price: 19,
      emoji: "🧻",
      description: "外出或日常清洁使用。"
    },
    {
      id: 11,
      name: "冻干鸡肉粒",
      category: "零食",
      price: 59,
      emoji: "🍗",
      description: "适合训练奖励和日常零食。"
    },
    {
      id: 12,
      name: "宠物梳毛刷",
      category: "用品",
      price: 35,
      emoji: "🪮",
      description: "帮助清理浮毛，保持毛发整洁。"
    }
  ];

  /* =========================
     2. 状态
  ========================= */

  let cart = [];

  let currentCategory = "全部";

  let searchKeyword = "";

  let selectedProduct = null;

  let detailQuantity = 1;

  /* =========================
     3. 基础工具
  ========================= */

  const $ = (id) => document.getElementById(id);

  function money(number) {
    return Number(number).toFixed(2);
  }

  function toast(message) {

    const box = $("toast");

    if (!box) {
      alert(message);
      return;
    }

    const messageBox = $("toastMessage");

    if (messageBox) {
      messageBox.textContent = message;
    }

    box.classList.remove("hidden");

    setTimeout(() => {
      box.classList.add("hidden");
    }, 2000);
  }

  /* =========================
     4. 商品商城
  ========================= */

  function renderProducts() {

    const grid = $("productGrid");

    if (!grid) {
      console.error("找不到 #productGrid");
      return;
    }

    let list = [...products];

    // 分类
    if (currentCategory !== "全部") {

      list = list.filter(product => {
        return product.category === currentCategory;
      });

    }

    // 搜索
    if (searchKeyword.trim()) {

      const keyword =
        searchKeyword.trim().toLowerCase();

      list = list.filter(product => {

        return (
          product.name.toLowerCase().includes(keyword) ||
          product.category.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword)
        );

      });

    }

    grid.innerHTML = "";

    if (list.length === 0) {

      const empty = $("emptyProducts");

      if (empty) {
        empty.classList.remove("hidden");
      }

      return;
    }

    const empty = $("emptyProducts");

    if (empty) {
      empty.classList.add("hidden");
    }

    list.forEach(product => {

      const card =
        document.createElement("div");

      card.className = "product-card";

      card.innerHTML = `

        <div class="product-image">
          <span>${product.emoji}</span>
        </div>

        <div class="product-info">

          <div class="product-category">
            ${product.category}
          </div>

          <h3>
            ${product.name}
          </h3>

          <p class="product-description">
            ${product.description}
          </p>

          <div class="product-bottom">

            <div class="product-price">
              ¥${money(product.price)}
            </div>

            <button
              type="button"
              class="product-add-btn"
            >
              +
            </button>

          </div>

        </div>

      `;

      // 点击商品
      card.addEventListener("click", (event) => {

        if (
          event.target.closest(".product-add-btn")
        ) {
          return;
        }

        openProduct(product.id);

      });

      // 加入购物车
      const addButton =
        card.querySelector(".product-add-btn");

      addButton.addEventListener("click", () => {

        addToCart(product.id, 1);

      });

      grid.appendChild(card);

    });

  }

  /* =========================
     5. 分类按钮
  ========================= */

  document
    .querySelectorAll("[data-category]")
    .forEach(button => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll("[data-category]")
          .forEach(item => {
            item.classList.remove("active");
          });

        button.classList.add("active");

        currentCategory =
          button.dataset.category || "全部";

        renderProducts();

      });

    });

  /* =========================
     6. 商品详情
  ========================= */

  function openProduct(productId) {

    const product =
      products.find(
        item => item.id === Number(productId)
      );

    if (!product) return;

    selectedProduct = product;

    detailQuantity = 1;

    if ($("detailImage")) {
      $("detailImage").textContent =
        product.emoji;
    }

    if ($("detailCategory")) {
      $("detailCategory").textContent =
        product.category;
    }

    if ($("detailName")) {
      $("detailName").textContent =
        product.name;
    }

    if ($("detailDescription")) {
      $("detailDescription").textContent =
        product.description;
    }

    if ($("detailPrice")) {
      $("detailPrice").textContent =
        money(product.price);
    }

    if ($("detailQuantity")) {
      $("detailQuantity").value = 1;
    }

    const modal = $("productModal");

    if (modal) {
      modal.classList.remove("hidden");
    }

  }

  /* =========================
     7. 商品详情数量
  ========================= */

  $("detailMinus")?.addEventListener(
    "click",
    () => {

      detailQuantity =
        Math.max(1, detailQuantity - 1);

      if ($("detailQuantity")) {
        $("detailQuantity").value =
          detailQuantity;
      }

    }
  );

  $("detailPlus")?.addEventListener(
    "click",
    () => {

      detailQuantity++;

      if ($("detailQuantity")) {
        $("detailQuantity").value =
          detailQuantity;
      }

    }
  );

  $("detailQuantity")?.addEventListener(
    "change",
    () => {

      let value =
        parseInt(
          $("detailQuantity").value,
          10
        );

      if (!value || value < 1) {
        value = 1;
      }

      detailQuantity = value;

      $("detailQuantity").value =
        value;

    }
  );

  $("detailAddCart")?.addEventListener(
    "click",
    () => {

      if (!selectedProduct) return;

      addToCart(
        selectedProduct.id,
        detailQuantity
      );

      closeModal("productModal");

    }
  );

  /* =========================
     8. 购物车
     只修改这里
  ========================= */

  function addToCart(productId, quantity = 1) {

    const product =
      products.find(
        item => item.id === Number(productId)
      );

    if (!product) return;

    const existing =
      cart.find(
        item => item.id === product.id
      );

    if (existing) {

      existing.quantity += Number(quantity);

    } else {

      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        emoji: product.emoji,
        description: product.description,
        quantity: Number(quantity)
      });

    }

    renderCart();

    toast(
      `${product.name} 已加入购物车`
    );

  }


  function changeQuantity(productId, change) {

    const item =
      cart.find(
        item => item.id === Number(productId)
      );

    if (!item) return;

    item.quantity =
      Number(item.quantity) +
      Number(change);

    if (item.quantity <= 0) {

      cart =
        cart.filter(
          item =>
            item.id !== Number(productId)
        );

    }

    renderCart();

  }


  function removeFromCart(productId) {

    cart =
      cart.filter(
        item =>
          item.id !== Number(productId)
      );

    renderCart();

    toast("商品已删除");

  }


  function getCartCount() {

    return cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  }


  function getCartTotal() {

    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
        Number(item.quantity || 0),
      0
    );

  }


  /* =========================
     9. 渲染购物车
     只修改这里
  ========================= */

  function renderCart() {

    const count =
      getCartCount();

    const total =
      getCartTotal();


    // 顶部购物车数量
    if ($("cartCount")) {
      $("cartCount").textContent =
        count;
    }


    // 购物车里面的数量
    if ($("cartItemCount")) {
      $("cartItemCount").textContent =
        count;
    }


    // 总金额
    if ($("cartTotal")) {
      $("cartTotal").textContent =
        `¥${money(total)}`;
    }


    const cartItems =
      $("cartItems");

    const cartEmpty =
      $("cartEmpty");


    // 找不到商品容器
    if (!cartItems) {

      console.error(
        "找不到 #cartItems"
      );

      return;
    }


    // 购物车为空
    if (cart.length === 0) {

      cartItems.innerHTML = "";

      cartItems.style.display =
        "none";

      if (cartEmpty) {

        cartEmpty.classList.remove(
          "hidden"
        );

        cartEmpty.style.display =
          "block";

      }

      return;
    }


    // 购物车有商品
    if (cartEmpty) {

      cartEmpty.classList.add(
        "hidden"
      );

      cartEmpty.style.display =
        "none";

    }


    cartItems.style.display =
      "block";


    cartItems.innerHTML = "";


    // 一个一个显示商品
    cart.forEach(item => {

      const quantity =
        Number(item.quantity || 1);

      const price =
        Number(item.price || 0);

      const subtotal =
        price * quantity;


      const row =
        document.createElement("div");

      row.className =
        "cart-item";


      row.innerHTML = `

        <div class="cart-item-image">
          <span>${item.emoji}</span>
        </div>

        <div class="cart-item-info">

          <h4 class="cart-item-name">
            ${item.name}
          </h4>

          <div class="cart-item-price">
            单价：¥${money(price)}
          </div>

          <div class="cart-item-actions">

            <div class="cart-quantity">

              <button
                type="button"
                class="cart-minus"
              >
                −
              </button>

              <span class="cart-quantity-number">
                ${quantity}
              </span>

              <button
                type="button"
                class="cart-plus"
              >
                +
              </button>

            </div>

            <button
              type="button"
              class="remove-cart"
            >
              删除
            </button>

          </div>

          <div class="cart-subtotal">
            小计：¥${money(subtotal)}
          </div>

        </div>

      `;


      // 减少数量
      const minus =
        row.querySelector(".cart-minus");

      if (minus) {

        minus.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            changeQuantity(
              item.id,
              -1
            );

          }
        );

      }


      // 增加数量
      const plus =
        row.querySelector(".cart-plus");

      if (plus) {

        plus.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            changeQuantity(
              item.id,
              1
            );

          }
        );

      }


      // 删除
      const remove =
        row.querySelector(".remove-cart");

      if (remove) {

        remove.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            removeFromCart(
              item.id
            );

          }
        );

      }


      cartItems.appendChild(row);

    });


    // 最后再次更新总金额
    if ($("cartTotal")) {

      $("cartTotal").textContent =
        `¥${money(getCartTotal())}`;

    }

  }


  /* =========================
     10. 打开 / 关闭购物车
     只修改这里
  ========================= */

  $("openCart")?.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();


      const panel =
        $("cartPanel");


      if (!panel) {

        console.error(
          "找不到 #cartPanel"
        );

        return;
      }


      // 打开前先刷新购物车
      renderCart();


      panel.classList.remove(
        "hidden"
      );


      // 确保购物车面板显示
      panel.style.display =
        "flex";

    }
  );


  $("closeCart")?.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();


      const panel =
        $("cartPanel");


      if (!panel) return;


      panel.classList.add(
        "hidden"
      );


      panel.style.display =
        "none";

    }
  );


  /* =========================
     11. 搜索
  ========================= */

  $("searchButton")?.addEventListener(
    "click",
    () => {

      searchKeyword =
        $("searchInput")?.value || "";

      renderProducts();

    }
  );

  $("searchInput")?.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {

        searchKeyword =
          $("searchInput").value;

        renderProducts();

      }

    }
  );

  $("clearSearch")?.addEventListener(
    "click",
    () => {

      searchKeyword = "";

      if ($("searchInput")) {
        $("searchInput").value = "";
      }

      renderProducts();

    }
  );

  $("openSearch")?.addEventListener(
    "click",
    () => {

      $("searchPanel")
        ?.classList.toggle("hidden");

    }
  );

  /* =========================
     12. 通用弹窗关闭
  ========================= */

  function closeModal(id) {

    $(id)?.classList.add("hidden");

  }

  document
    .querySelectorAll("[data-close]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const target =
          button.dataset.close;

        closeModal(target);

      });

    });

  document
    .querySelectorAll(".modal-overlay")
    .forEach(overlay => {

      overlay.addEventListener("click", () => {

        const modal =
          overlay.closest(".modal");

        if (modal) {
          modal.classList.add("hidden");
        }

      });

    });

  /* =========================
     13. 登录
  ========================= */

  $("openLogin")?.addEventListener(
    "click",
    () => {

      $("loginModal")
        ?.classList.remove("hidden");

    }
  );

  $("switchLoginMode")?.addEventListener(
    "click",
    () => {

      const loginForm =
        $("loginForm");

      const registerForm =
        $("registerForm");

      if (!loginForm || !registerForm) {
        return;
      }

      const loginHidden =
        loginForm.classList.contains("hidden");

      if (loginHidden) {

        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

      } else {

        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");

      }

    }
  );

  /* =========================
     14. 注册
  ========================= */

  $("registerForm")?.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const phone =
        $("registerPhone")?.value.trim();

      const password =
        $("registerPassword")?.value;

      const confirm =
        $("registerPasswordConfirm")?.value;

      if (!phone || !password) {

        toast("请填写注册信息");

        return;
      }

      if (password !== confirm) {

        toast("两次密码不一致");

        return;
      }

      localStorage.setItem(
        "pawHouseUser",
        JSON.stringify({
          phone: phone,
          name: "Paw House 会员",
          level: "普通会员"
        })
      );

      toast("注册成功");

      setTimeout(() => {

        $("loginForm")
          ?.classList.remove("hidden");

        $("registerForm")
          ?.classList.add("hidden");

      }, 500);

    }
  );

  /* =========================
     15. 登录提交
  ========================= */

  $("loginForm")?.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const phone =
        $("loginPhone")?.value.trim();

      const password =
        $("loginPassword")?.value;

      if (!phone || !password) {

        toast("请输入手机号和密码");

        return;
      }

      const user = {
        phone: phone,
        name: "Paw House 会员",
        level: "普通会员"
      };

      localStorage.setItem(
        "pawHouseUser",
        JSON.stringify(user)
      );

      updateMember(user);

      closeModal("loginModal");

      toast("登录成功");

    }
  );

  /* =========================
     16. 会员状态
  ========================= */

  function updateMember(user) {

    if (!user) return;

    if ($("memberDisplayName")) {
      $("memberDisplayName").textContent =
        user.name;
    }

    if ($("memberDisplayLevel")) {
      $("memberDisplayLevel").textContent =
        user.level;
    }

    if ($("modalMemberName")) {
      $("modalMemberName").textContent =
        user.name;
    }

    if ($("modalMemberLevel")) {
      $("modalMemberLevel").textContent =
        user.level;
    }

    const openLogin =
      $("openLogin");

    const openMember =
      $("openMember");

    if (openLogin) {
      openLogin.classList.add("hidden");
    }

    if (openMember) {
      openMember.classList.remove("hidden");
    }

  }

  /* =========================
     17. 会员中心
  ========================= */

  $("openMember")?.addEventListener(
    "click",
    () => {

      $("memberModal")
        ?.classList.remove("hidden");

    }
  );

  $("memberSummaryButton")?.addEventListener(
    "click",
    () => {

      $("memberModal")
        ?.classList.remove("hidden");

    }
  );

  $("memberRechargeButton")?.addEventListener(
    "click",
    () => {

      $("memberModal")
        ?.classList.add("hidden");

      $("rechargeModal")
        ?.classList.remove("hidden");

    }
  );

  $("logoutButton")?.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "pawHouseUser"
      );

      $("memberModal")
        ?.classList.add("hidden");

      $("openMember")
        ?.classList.add("hidden");

      $("openLogin")
        ?.classList.remove("hidden");

      toast("已退出登录");

    }
  );

  /* =========================
     18. 储值
  ========================= */

  document
    .querySelectorAll(".recharge-option")
    .forEach(option => {

      option.addEventListener("click", () => {

        const amount =
          Number(option.dataset.recharge);

        const bonus =
          Number(option.dataset.bonus);

        if ($("rechargePay")) {
          $("rechargePay").textContent =
            money(amount);
        }

        if ($("rechargeBonus")) {
          $("rechargeBonus").textContent =
            money(bonus);
        }

        if ($("rechargeTotal")) {
          $("rechargeTotal").textContent =
            money(amount + bonus);
        }

        document
          .querySelectorAll(".recharge-option")
          .forEach(item => {
            item.classList.remove("selected");
          });

        option.classList.add("selected");

        selectedRecharge = {
          amount,
          bonus
        };

      });

    });

  document
    .querySelectorAll("[data-recharge]")
    .forEach(card => {

      card.addEventListener("click", () => {

        const amount =
          Number(card.dataset.recharge);

        const bonus =
          Number(card.dataset.bonus);

        if ($("rechargePay")) {
          $("rechargePay").textContent =
            money(amount);
        }

        if ($("rechargeBonus")) {
          $("rechargeBonus").textContent =
            money(bonus);
        }

        if ($("rechargeTotal")) {
          $("rechargeTotal").textContent =
            money(amount + bonus);
        }

        selectedRecharge = {
          amount,
          bonus
        };

        $("rechargeModal")
          ?.classList.remove("hidden");

      });

    });

  $("confirmRecharge")?.addEventListener(
    "click",
    () => {

      if (
        !selectedRecharge ||
        selectedRecharge.amount <= 0
      ) {

        toast("请选择储值金额");

        return;
      }

      const oldBalance =
        Number(
          localStorage.getItem(
            "pawHouseBalance"
          ) || 0
        );

      const newBalance =
        oldBalance +
        selectedRecharge.amount +
        selectedRecharge.bonus;

      localStorage.setItem(
        "pawHouseBalance",
        newBalance
      );

      $("rechargeModal")
        ?.classList.add("hidden");

      if ($("memberBalance")) {
        $("memberBalance").textContent =
          money(newBalance);
      }

      if ($("modalMemberBalance")) {
        $("modalMemberBalance").textContent =
          money(newBalance);
      }

      toast(
        `充值成功，余额 ¥${money(newBalance)}`
      );

    }
  );

  /* =========================
     19. 服务预约
  ========================= */

  document
    .querySelectorAll(".service-book-btn")
    .forEach(button => {

      button.addEventListener("click", () => {

        const service =
          button.dataset.service || "";

        if ($("bookingService")) {
          $("bookingService").value =
            service;
        }

        $("bookingModal")
          ?.classList.remove("hidden");

      });

    });

  $("bookingForm")?.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const service =
        $("bookingService")?.value;

      const date =
        $("bookingDate")?.value;

      const time =
        $("bookingTime")?.value;

      const owner =
        $("ownerName")?.value.trim();

      const phone =
        $("ownerPhone")?.value.trim();

      const pet =
        $("petName")?.value.trim();

      if (
        !service ||
        !date ||
        !time ||
        !owner ||
        !phone ||
        !pet
      ) {

        toast("请把预约信息填写完整");

        return;
      }

      $("bookingModal")
        ?.classList.add("hidden");

      $("bookingForm").reset();

      toast(
        "预约成功，请等待门店确认"
      );

    }
  );

  /* =========================
     20. 移动端菜单
  ========================= */

  $("openMobileMenu")?.addEventListener(
    "click",
    () => {

      $("mobileMenu")
        ?.classList.remove("hidden");

    }
  );

  $("closeMobileMenu")?.addEventListener(
    "click",
    () => {

      $("mobileMenu")
        ?.classList.add("hidden");

    }
  );

  /* =========================
     21. 订单结算
  ========================= */

  $("checkoutButton")?.addEventListener(
    "click",
    () => {

      if (cart.length === 0) {

        toast("购物车是空的");

        return;
      }

      const checkoutItems =
        $("checkoutItems");

      if (checkoutItems) {

        checkoutItems.innerHTML = "";

        cart.forEach(item => {

          const div =
            document.createElement("div");

          div.innerHTML = `

            <div style="
              display:flex;
              justify-content:space-between;
              margin-bottom:10px;
            ">

              <span>
                ${item.name} × ${item.quantity}
              </span>

              <strong>
                ¥${money(
                  item.price * item.quantity
                )}
              </strong>

            </div>

          `;

          checkoutItems.appendChild(div);

        });

      }

      if ($("checkoutTotal")) {

        $("checkoutTotal").textContent =
          money(getCartTotal());

      }

      $("cartPanel")
        ?.classList.add("hidden");

      $("checkoutModal")
        ?.classList.remove("hidden");

    }
  );

  $("submitOrder")?.addEventListener(
    "click",
    () => {

      if (cart.length === 0) {

        toast("购物车是空的");

        return;
      }

      const order = {

        id:
          "PH" +
          Date.now()
            .toString()
            .slice(-8),

        total:
          getCartTotal(),

        items:
          [...cart],

        status:
          "待支付",

        time:
          new Date().toLocaleString("zh-CN")

      };

      let savedOrders =
        JSON.parse(
          localStorage.getItem(
            "pawHouseOrders"
          ) || "[]"
        );

      savedOrders.unshift(order);

      localStorage.setItem(
        "pawHouseOrders",
        JSON.stringify(savedOrders)
      );

      cart = [];

      renderCart();

      $("checkoutModal")
        ?.classList.add("hidden");

      toast(
        `订单 ${order.id} 已创建`
      );

    }
  );

  /* =========================
     22. 查看订单
  ========================= */

  $("viewOrders")?.addEventListener(
    "click",
    () => {

      const savedOrders =
        JSON.parse(
          localStorage.getItem(
            "pawHouseOrders"
          ) || "[]"
        );

      const list =
        $("ordersList");

      const empty =
        $("ordersEmpty");

      if (!list || !empty) return;

      if (savedOrders.length === 0) {

        empty.classList.remove("hidden");
        list.classList.add("hidden");

        return;
      }

      empty.classList.add("hidden");
      list.classList.remove("hidden");

      list.innerHTML = "";

      savedOrders.forEach(order => {

        const card =
          document.createElement("div");

        card.className =
          "order-card";

        card.innerHTML = `

          <div>

            <strong>
              订单号：${order.id}
            </strong>

            <span>
              ${order.status}
            </span>

          </div>

          <p>
            ¥${money(order.total)}
          </p>

          <small>
            ${order.time}
          </small>

        `;

        list.appendChild(card);

      });

    }
  );

  /* =========================
     23. 首页查看商品
  ========================= */

  document
    .querySelectorAll('a[href="#shop"]')
    .forEach(link => {

      link.addEventListener("click", () => {

        setTimeout(() => {
          renderProducts();
        }, 50);

      });

    });

  /* =========================
     24. 初始化会员
  ========================= */

  const savedUser =
    localStorage.getItem(
      "pawHouseUser"
    );

  if (savedUser) {

    try {

      const user =
        JSON.parse(savedUser);

      updateMember(user);

    } catch (error) {

      console.log(
        "会员数据读取失败"
      );

    }

  }

  /* =========================
     25. 初始化余额
  ========================= */

  const savedBalance =
    Number(
      localStorage.getItem(
        "pawHouseBalance"
      ) || 0
    );

  if ($("memberBalance")) {
    $("memberBalance").textContent =
      money(savedBalance);
  }

  if ($("modalMemberBalance")) {
    $("modalMemberBalance").textContent =
      money(savedBalance);
  }

  /* =========================
     26. 最重要：启动商城
  ========================= */

  renderProducts();

  renderCart();

  console.log(
    "Paw House 宠物商城已启动",
    products
  );

});
