// ===== SLIDESHOW =====
const listImg = document.querySelector('.list-img');
const imgs = document.getElementsByClassName('img');
const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');
const length = imgs.length;
let currentSlide = 0; // ← đổi từ current thành currentSlide

const handleChangeSlide = () => {
    if (currentSlide == length - 1) {
        currentSlide = 0;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(0px)`;
        document.querySelector('.index-item.active').classList.remove('active'); // ← thêm .index-item
        document.querySelector('.index-item-' + currentSlide).classList.add('active');
    } else {
        currentSlide++;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(${width * -1 * currentSlide}px)`;
        document.querySelector('.index-item.active').classList.remove('active'); // ← thêm .index-item
        document.querySelector('.index-item-' + currentSlide).classList.add('active');
    }
};
let handleEventChangeSlide = setInterval(handleChangeSlide, 4000);

btnRight.addEventListener('click', () => {
    clearInterval(handleEventChangeSlide);
    handleChangeSlide();
    handleEventChangeSlide = setInterval(handleChangeSlide, 4000);
});

btnLeft.addEventListener('click', () => {
    clearInterval(handleEventChangeSlide);
    if (currentSlide == 0) {
        currentSlide = length - 1;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(${width * -1 * currentSlide}px)`;
        document.querySelector('.index-item.active').classList.remove('active'); // ← thêm .index-item
        document.querySelector('.index-item-' + currentSlide).classList.add('active');
    } else {
        currentSlide--;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(${width * -1 * currentSlide}px)`;
        document.querySelector('.index-item.active').classList.remove('active'); // ← thêm .index-item
        document.querySelector('.index-item-' + currentSlide).classList.add('active');
    }
    handleEventChangeSlide = setInterval(handleChangeSlide, 4000);
});


// ===== CAROUSEL =====
let currentIndex = 0;

function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 480) return 1;
    if (w < 768) return 2;
    return 4;
}

function getVisibleCards() {
    const track = document.getElementById('carouselTrack');
    return [...track.querySelectorAll('.product-card')]
        .filter(card => card.style.display !== 'none');
}

function slide(dir) {
    const track = document.getElementById('carouselTrack');
    const cards = getVisibleCards();
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);

    currentIndex += dir;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    if (cards.length > 0) {
        const cardWidth = cards[0].offsetWidth + 24;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
}

function setTab(el, category) {
    document.querySelectorAll('.tab')
        .forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    const track = document.getElementById('carouselTrack');
    const cards = track.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.style.display = card.dataset.category === category ? "" : "none";
    });

    currentIndex = 0;
    track.style.transform = "translateX(0)";
}

window.addEventListener('resize', () => {
    currentIndex = 0;
    document.getElementById('carouselTrack').style.transform = 'translateX(0)';
});


// ===== SEARCH =====
let Search = document.querySelector('.search-dropdown');

document.querySelector('#search').onclick = () => {
    Search.classList.toggle('active');
}

// Đồng bộ badge giỏ hàng từ localStorage
const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector(".icon-cart .badge, .icon-cart span, .cart .badge");
    if (badge) badge.innerText = totalQuantity;
};

updateCartBadge();

// Cập nhật lại khi tab được focus (người dùng quay lại từ trang sản phẩm)
window.addEventListener("focus", updateCartBadge);
window.addEventListener("storage", updateCartBadge);

