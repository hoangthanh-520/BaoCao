const listImg = document.querySelector('.list-img');
const imgs = document.getElementsByClassName('img');
const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');
const length = imgs.length;
let current = 0;

const handleChangeSlide = () => {
    if (current == length - 1) {
        current = 0;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(0px)`;
        document.querySelector('.active').classList.remove('active');
        document.querySelector('.index-item-' + current).classList.add('active');

    } else {
        current++;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(${width * -1 * current}px)`;
        document.querySelector('.active').classList.remove('active');
        document.querySelector('.index-item-' + current).classList.add('active');
    }
};
let handleEventChangeSlide = setInterval(handleChangeSlide, 4000);

btnRight.addEventListener('click', () => {
    clearInterval(handleEventChangeSlide);
    handleChangeSlide();
    handleEventChangeSlide = setInterval(handleChangeSlide, 4000);
})

btnLeft.addEventListener('click', () => {
    clearInterval(handleEventChangeSlide);
    if (current == 0) {
        current = length - 1;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(${width * -1 * current}px)`;
        document.querySelector('.active').classList.remove('active');
        document.querySelector('.index-item-' + current).classList.add('active');
    } else {
        current--;
        let width = imgs[0].offsetWidth;
        listImg.style.transform = `translateX(${width * -1 * current}px)`;
        document.querySelector('.active').classList.remove('active');
        document.querySelector('.index-item-' + current).classList.add('active');
    }
    handleEventChangeSlide = setInterval(handleChangeSlide, 4000);
})


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
        if (card.dataset.category === category) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });

    currentIndex = 0;
    track.style.transform = "translateX(0)";
}

/* Reset khi resize */
window.addEventListener('resize', () => {
    currentIndex = 0;
    document.getElementById('carouselTrack')
        .style.transform = 'translateX(0)';
});