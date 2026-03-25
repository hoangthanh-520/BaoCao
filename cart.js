document.addEventListener("DOMContentLoaded", function () {

    const minusBtn = document.querySelector(".minus");
    const plusBtn = document.querySelector(".plus");
    const qtyInput = document.querySelector(".qty");

    const addBtn = document.getElementById("addToCart");
    const buyBtn = document.getElementById("buyNow");

    // ===== TĂNG GIẢM SỐ LƯỢNG =====
    if (minusBtn && plusBtn && qtyInput) {
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
    }

    // ===== CẬP NHẬT BADGE =====
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.querySelector(".badge");
        if (badge) badge.innerText = total;
    }

    // ===== LẤY THÔNG TIN SẢN PHẨM (TỰ ĐỘNG) =====
    function getProduct() {
        return {
            name: document.querySelector("h1")?.innerText || "Sản phẩm",
            price: parseInt(document.querySelector(".price")?.innerText.replace(/[^\d]/g, "")) || 0,
            quantity: parseInt(qtyInput?.value) || 1,
            image: document.querySelector(".product-image img")?.getAttribute("src") || "",
            note: document.querySelector(".note input")?.value || ""
        };
    }

    // ===== TOAST =====
    function showToast(message) {
        const toast = document.getElementById("toast");
        if (!toast) return;

        const text = toast.querySelector(".toast-text");
        text.innerText = message;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }

    // ===== THÊM VÀO GIỎ =====
    if (addBtn) {
        addBtn.onclick = function () {

            let product = getProduct();
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            let existing = cart.find(item => item.name === product.name);

            if (existing) {
                existing.quantity += product.quantity;
            } else {
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            updateCartCount();
            showToast("Đã thêm vào giỏ hàng!");
        };
    }

    // ===== MUA NGAY =====
    if (buyBtn) {
        buyBtn.onclick = function () {
            addBtn?.click();
            window.location.href = "../GH.html";
        };
    }

    updateCartCount();

});