
document.addEventListener("DOMContentLoaded", function (){

    // ===== LẤY ELEMENT =====
    const minusBtn = document.querySelector(".minus");
    const plusBtn = document.querySelector(".plus");
    const qtyInput = document.querySelector(".qty");

    const addBtn = document.getElementById("addToCart");
    const buyBtn = document.getElementById("buyNow");

    // ===== KIỂM TRA NULL (tránh lỗi)
    if (!minusBtn || !plusBtn || !qtyInput || !addBtn || !buyBtn) {
        console.error("Thiếu class hoặc id trong HTML!");
        return;
    }

    // ===== TĂNG GIẢM SỐ LƯỢNG =====
    minusBtn.onclick = () => {
        let value = parseInt(qtyInput.value) || 1;
        if (value > 1) value--;
        qtyInput.value = value;
    };

    plusBtn.onclick = () => {
        let value = parseInt(qtyInput.value) || 1;
        value++;
        qtyInput.value = value;
    };

    // ===== CẬP NHẬT BADGE =====
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector(".badge").innerText = total;
    }

    // ===== THÊM VÀO GIỎ =====
    addBtn.onclick = function () {

        let product = {
            name: "Baguette",
            price: 30000,
            quantity: parseInt(qtyInput.value),
            image: "../Bánh Nướng/Baguette.png",
            note: document.querySelector(".note-input").value
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existing = cart.find(item => item.name === product.name);

        if (existing) {
            existing.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();
        showToast("Đã thêm Baguette vào giỏ hàng!");
    };

    // ===== MUA NGAY =====
    buyBtn.onclick = function () {
        addBtn.click();
        window.location.href = "../GH.html";
    };

    function showToast(message) {
    const toast = document.getElementById("toast");
    const text = toast.querySelector(".toast-text");

    text.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

    // load khi mở trang
    updateCartCount();

})