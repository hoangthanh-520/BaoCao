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
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span> 
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

  showCheckoutForm();
});
const showCheckoutForm = () => {
  let checkoutHTML = `
    <div class="checkoutOverlay">
      <div class="checkoutBox">
        <h2>Thanh toán đơn hàng</h2>
        <input type="text" id="customerName" placeholder="Họ và tên">
        <input type="text" id="customerPhone" placeholder="Số điện thoại">
        <input type="text" id="customerAddress" placeholder="Địa chỉ">
        <button id="confirmOrder">Xác nhận</button>
        <button id="cancelOrder">Hủy</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", checkoutHTML);

  document
    .getElementById("confirmOrder")
    .addEventListener("click", confirmOrder);

  document.getElementById("cancelOrder").addEventListener("click", () => {
    document.querySelector(".checkoutOverlay").remove();
  });
};
const confirmOrder = () => {
  let name = document.getElementById("customerName").value;
  let phone = document.getElementById("customerPhone").value;
  let address = document.getElementById("customerAddress").value;

  if (name === "" || phone === "" || address === "") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  alert("Đặt hàng thành công! 🎉");

  // Xóa giỏ hàng
  carts = [];
  localStorage.removeItem("cart");
  addCartToHTML();

  document.querySelector(".checkoutOverlay").remove();
};
