let iconCart = document.querySelector(".icon-cart");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector(".listCart");
let iconCartSpan = document.querySelector(".icon-cart span");
let currentFilter = "all";

let listProducts = [];
let carts = [];

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

const addDataToHTML = () => {
  listProductHTML.innerHTML = "";

  let filteredProducts = listProducts.filter((product) => {
    if (currentFilter === "all") return true;
    return product.category === currentFilter;
  });

  filteredProducts.forEach((product) => {
    let newProduct = document.createElement("div");
    newProduct.classList.add("item");
    newProduct.dataset.id = product.id;
    newProduct.innerHTML = `
      <img src="${product.image}" alt="" />
      <h2>${product.Name}</h2>
      <div class="price">${product.price}$</div>
      <button class="addCart">Add to Cart</button>
    `;
    listProductHTML.appendChild(newProduct);
  });
};

listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id,
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity =
      carts[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory(); //vẫn lưu giỏ hành khi người dùng tắt máy
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  let totalPriceAll = 0;

  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;

      let positionProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id,
      );

      if (positionProduct >= 0) {
        let info = listProducts[positionProduct];
        totalPriceAll += info.price * cart.quantity;

        let newCart = document.createElement("div");
        newCart.classList.add("item");
        newCart.dataset.id = cart.product_id;

        newCart.innerHTML = `
          <div class="image"><img src="${info.image}" alt=""></div>
          <div class="name">${info.Name}</div>
          <div class="totalPrice">${info.price * cart.quantity}$</div>
          <div class="quantity">
            <span class="minus">-</span>
            <span>${cart.quantity}</span>
            <span class="plus">+</span> 
          </div>
        `;

        listCartHTML.appendChild(newCart);
      }
    });
  }

  iconCartSpan.innerText = totalQuantity;

  // CẬP NHẬT THANH SUMMARY
  document.querySelector(".summaryLeft").innerText =
    "Total: " + totalPriceAll + "$";

  document.querySelector(".summaryRight").innerText = totalQuantity + " items";
};
listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let item = positionClick.closest(".item");
    let product_id = item.dataset.id;

    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});
const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id,
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;

      default:
        let valueChange = carts[positionItemInCart].quantity - 1;
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToMemory();
  addCartToHTML();
};
const initApp = () => {
  //get data from json
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;
      addDataToHTML();
      //get cart form memory
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();
let filterButtons = document.querySelectorAll(".categoryFilter button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.type;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    addDataToHTML();
  });
});
let checkOutBtn = document.querySelector(".checkOut");

checkOutBtn.addEventListener("click", () => {
  if (carts.length === 0) {
    alert("Giỏ hàng đang trống!");
    return;
  }
  // Đóng cart sidebar
  body.classList.remove("showCart");
  showCheckoutPage();
});

// ─── Render trang checkout full-page ───────────────────────
const showCheckoutPage = () => {
  // Tính tổng
  let subtotal = 0;
  carts.forEach((cart) => {
    let p = listProducts.find((v) => v.id == cart.product_id);
    if (p) subtotal += p.price * cart.quantity;
  });

  // Build danh sách sản phẩm
  const buildCartRows = () => {
    if (carts.length === 0) {
      return `<div class="co-empty">🛒 Giỏ hàng đang trống</div>`;
    }
    return carts
      .map((cart) => {
        let p = listProducts.find((v) => v.id == cart.product_id);
        if (!p) return "";
        let lineTotal = p.price * cart.quantity;
        return `
        <div class="co-cart-item" data-id="${cart.product_id}">
          <img src="${p.image}" alt="${p.Name}">
          <div>
            <div class="co-item-name">${p.Name}</div>
            <div class="co-item-sku">SKU: ${p.id}</div>
          </div>
          <div class="co-item-price">${p.price.toLocaleString()}$</div>
          <div class="co-qty-ctrl">
            <button class="co-minus">−</button>
            <span>${cart.quantity}</span>
            <button class="co-plus">+</button>
          </div>
          <div class="co-item-total">${lineTotal.toLocaleString()}$</div>
          <button class="co-remove-btn" title="Xóa">✕</button>
        </div>`;
      })
      .join("");
  };

  const html = `
  <div class="checkoutPage" id="checkoutPage">

    <!-- Header -->
    <div class="co-header">
      <button class="co-back-btn" id="coBackBtn">← Quay lại</button>
      <span class="co-breadcrumb">TRANG CHỦ &rsaquo; <span>GIỎ HÀNG</span></span>
    </div>

    <!-- Body -->
    <div class="co-body">

      <!-- LEFT -->
      <div class="co-left">

        <!-- Danh sách sản phẩm -->
        <div class="co-section">
          <h3 class="co-section-title">🧁 Sản phẩm trong giỏ</h3>
          <div class="co-cart-head">
            <span></span>
            <span>SẢN PHẨM</span>
            <span style="text-align:center">ĐƠN GIÁ</span>
            <span style="text-align:center">SỐ LƯỢNG</span>
            <span style="text-align:center">TỔNG</span>
            <span></span>
          </div>
          <div id="coCartRows">${buildCartRows()}</div>
        </div>

        <!-- Thông tin khách hàng -->
        <div class="co-section">
          <h3 class="co-section-title">👤 Thông tin nhận hàng</h3>
          <div class="co-info-body">
            <input type="text"  id="coName"    placeholder="Họ và tên *">
            <input type="tel"   id="coPhone"   placeholder="Số điện thoại *">
            <input type="text"  id="coAddress" placeholder="Địa chỉ giao hàng *">
          </div>
        </div>

        <!-- Ghi chú -->
        <div class="co-section">
          <h3 class="co-section-title" id="coNoteToggle" style="cursor:pointer">
            📝 Thêm ghi chú đặt bánh
            <span id="coNoteArrow" style="margin-left:auto;font-size:14px;transition:transform 0.3s">▼</span>
          </h3>
          <div id="coNoteBody" class="co-note-body" style="display:none">
            <textarea id="coNote" placeholder="Ví dụ: Viết chữ lên bánh, yêu cầu đặc biệt..."></textarea>
          </div>
        </div>

      </div>

      <!-- RIGHT: Thanh toán -->
      <div class="co-right">
        <div class="co-summary">
          <h3 class="co-summary-title">Thanh Toán</h3>
          <div class="co-summary-body">

            <div class="co-summary-row">
              <span class="label">Tạm tính</span>
              <span class="value" id="coSubtotal">${subtotal.toLocaleString()}$</span>
            </div>

            <!-- Mã giảm giá -->
            <div class="co-discount-label">
              <i class="fa-solid fa-percent"></i>
              Mã giảm giá (nếu có)
            </div>
            <div class="co-discount-input">
              <input type="text" id="coDiscountCode" placeholder="Nhập mã giảm giá">
              <button id="coApplyDiscount" title="Áp dụng">➤</button>
            </div>

            <!-- Badge khi áp dụng thành công -->
            <div class="co-discount-badge" id="coDiscountBadge">
              <i class="fa-solid fa-tag"></i>
              <span id="coDiscountText"></span>
              <button class="remove-discount" id="coRemoveDiscount" title="Hủy mã">✕</button>
            </div>

            <!-- Tiết kiệm -->
            <div class="co-saving-row" id="coSavingRow">
              <span>Tiết kiệm</span>
              <span id="coSavingAmt"></span>
            </div>

            <div class="co-summary-row total">
              <span class="label">Tổng tiền</span>
              <span class="value" id="coTotal">${subtotal.toLocaleString()}$</span>
            </div>

            <button class="co-confirm-btn" id="coConfirmBtn">Tiến hành thanh toán</button>

          </div>
        </div>
      </div>

    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  bindCheckoutEvents();
};

// ─── Bind events cho trang checkout ───────────────────────
const bindCheckoutEvents = () => {
  const page = document.getElementById("checkoutPage");

  // Quay lại
  document.getElementById("coBackBtn").addEventListener("click", () => {
    page.remove();
  });

  // Toggle ghi chú
  document.getElementById("coNoteToggle").addEventListener("click", () => {
    const body = document.getElementById("coNoteBody");
    const arrow = document.getElementById("coNoteArrow");
    const isOpen = body.style.display !== "none";
    body.style.display = isOpen ? "none" : "block";
    arrow.style.transform = isOpen ? "" : "rotate(180deg)";
  });

  // Tăng/giảm/xóa sản phẩm trong checkout
  document.getElementById("coCartRows").addEventListener("click", (e) => {
    const item = e.target.closest(".co-cart-item");
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.classList.contains("co-plus")) changeQtyInCheckout(id, "plus");
    if (e.target.classList.contains("co-minus"))
      changeQtyInCheckout(id, "minus");
    if (e.target.classList.contains("co-remove-btn")) removeFromCheckout(id);
  });

  // Mã giảm giá
  let discountPercent = 0;
  const DISCOUNT_CODES = { BANH10: 10, SALE20: 20, VIP30: 30 };

  document.getElementById("coApplyDiscount").addEventListener("click", () => {
    const code = document
      .getElementById("coDiscountCode")
      .value.trim()
      .toUpperCase();
    if (!code) return;

    if (DISCOUNT_CODES[code]) {
      discountPercent = DISCOUNT_CODES[code];
      document.getElementById("coDiscountBadge").classList.add("show");
      document.getElementById("coDiscountText").textContent =
        `Mã "${code}" — giảm ${discountPercent}%`;
      updateCheckoutTotal(discountPercent);
    } else {
      alert("Mã giảm giá không hợp lệ!");
    }
  });

  document.getElementById("coRemoveDiscount").addEventListener("click", () => {
    discountPercent = 0;
    document.getElementById("coDiscountBadge").classList.remove("show");
    document.getElementById("coDiscountCode").value = "";
    document.getElementById("coSavingRow").classList.remove("show");
    updateCheckoutTotal(0);
  });

  // Xác nhận đặt hàng
  document.getElementById("coConfirmBtn").addEventListener("click", () => {
    const name = document.getElementById("coName").value.trim();
    const phone = document.getElementById("coPhone").value.trim();
    const address = document.getElementById("coAddress").value.trim();

    if (!name || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
      return;
    }

    alert(
      `🎉 Đặt hàng thành công!\nCảm ơn ${name}, đơn hàng sẽ được giao đến:\n${address}`,
    );

    // Reset giỏ hàng
    carts = [];
    localStorage.removeItem("cart");
    addCartToHTML();
    document.getElementById("checkoutPage").remove();
  });
};

// ─── Cập nhật số lượng từ trang checkout ──────────────────
const changeQtyInCheckout = (product_id, type) => {
  let idx = carts.findIndex((v) => v.product_id == product_id);
  if (idx < 0) return;

  if (type === "plus") {
    carts[idx].quantity += 1;
  } else {
    carts[idx].quantity -= 1;
    if (carts[idx].quantity <= 0) carts.splice(idx, 1);
  }

  addCartToMemory();
  addCartToHTML();
  refreshCheckoutRows();
};

const removeFromCheckout = (product_id) => {
  carts = carts.filter((v) => v.product_id != product_id);
  addCartToMemory();
  addCartToHTML();
  refreshCheckoutRows();
};

// ─── Refresh rows + tổng tiền ─────────────────────────────
const refreshCheckoutRows = () => {
  const rowsEl = document.getElementById("coCartRows");
  if (!rowsEl) return;

  let subtotal = 0;
  const rows =
    carts
      .map((cart) => {
        let p = listProducts.find((v) => v.id == cart.product_id);
        if (!p) return "";
        let lineTotal = p.price * cart.quantity;
        subtotal += lineTotal;
        return `
    <div class="co-cart-item" data-id="${cart.product_id}">
      <img src="${p.image}" alt="${p.Name}">
      <div>
        <div class="co-item-name">${p.Name}</div>
        <div class="co-item-sku">SKU: ${p.id}</div>
      </div>
      <div class="co-item-price">${p.price.toLocaleString()}$</div>
      <div class="co-qty-ctrl">
        <button class="co-minus">−</button>
        <span>${cart.quantity}</span>
        <button class="co-plus">+</button>
      </div>
      <div class="co-item-total">${lineTotal.toLocaleString()}$</div>
      <button class="co-remove-btn" title="Xóa">✕</button>
    </div>`;
      })
      .join("") || `<div class="co-empty">🛒 Giỏ hàng đang trống</div>`;

  rowsEl.innerHTML = rows;

  document.getElementById("coSubtotal").textContent =
    subtotal.toLocaleString() + "$";
  updateCheckoutTotal(0); // reset discount khi xóa item
};

// ─── Tính tổng có / không có giảm giá ─────────────────────
const updateCheckoutTotal = (discountPercent) => {
  let subtotal = 0;
  carts.forEach((cart) => {
    let p = listProducts.find((v) => v.id == cart.product_id);
    if (p) subtotal += p.price * cart.quantity;
  });

  document.getElementById("coSubtotal").textContent =
    subtotal.toLocaleString() + "$";

  if (discountPercent > 0) {
    let saving = Math.round((subtotal * discountPercent) / 100);
    let total = subtotal - saving;
    document.getElementById("coSavingRow").classList.add("show");
    document.getElementById("coSavingAmt").textContent =
      "-" + saving.toLocaleString() + "$";
    document.getElementById("coTotal").textContent =
      total.toLocaleString() + "$";
  } else {
    document.getElementById("coSavingRow").classList.remove("show");
    document.getElementById("coTotal").textContent =
      subtotal.toLocaleString() + "$";
  }
};
