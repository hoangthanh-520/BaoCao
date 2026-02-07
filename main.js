const sidebar = document.getElementById("sidebar");
const pages = document.querySelectorAll(".page");

const productsData = {
  "banh-nuong": [
    {
      id: 1,
      name: "Tart Trứng",
      price: 35000,
      image: "tartTrung.png",
    },
    { id: 2, name: "Tart Chocolate", price: 38000 },
  ],
  cookies: [{ id: 3, name: "Cookie Bơ", price: 25000 }],
};

let cart = [];

document.getElementById("menuBtn").onclick = () => {
  sidebar.classList.add("active");
};

document.getElementById("closeBtn").onclick = () => {
  sidebar.classList.remove("active");
};

function toggleSubMenu() {
  const sub = document.getElementById("subMenu");
  sub.style.display = sub.style.display === "block" ? "none" : "block";
}

function showPage(pageId) {
  pages.forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  sidebar.classList.remove("active");
}

function showProducts(type) {
  showPage("products");
  const section = document.getElementById("products");

  section.innerHTML = `<h2>Sản phẩm</h2>`;
  productsData[type].forEach((p) => {
    section.innerHTML += `
      <div>
        <h3 onclick="showProductDetail(${p.id}, '${type}')">${p.name}</h3>
        <p>${p.price.toLocaleString()}đ</p>
      </div>
    `;
  });
}

function showProductDetail(id, type) {
  showPage("product-detail");
  const product = productsData[type].find((p) => p.id === id);

  document.getElementById("product-detail").innerHTML = `
    <h2>${product.name}</h2>
    <p>Giá: ${product.price.toLocaleString()}đ</p>
    <button onclick="addToCart(${product.id}, '${type}')">Thêm vào giỏ</button>
  `;
}

function addToCart(id, type) {
  const product = productsData[type].find((p) => p.id === id);
  cart.push(product);
  alert("Đã thêm vào giỏ hàng 🛒");
  console.log(cart);
}
