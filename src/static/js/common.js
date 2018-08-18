var heroTitleElem = document.getElementById("hero-title");

var heroTitleSourceBottom =
    heroTitleElem.getBoundingClientRect().bottom + window.pageYOffset;

window.onscroll = function() {
    if (
        heroTitleElem.classList.contains("fixed") &&
        window.pageYOffset < heroTitleSourceBottom
    ) {
        heroTitleElem.classList.remove("fixed");
    } else if (window.pageYOffset > heroTitleSourceBottom) {
        heroTitleElem.classList.add("fixed");
    }
};


$(document).ready(function() {
    $(".hero__slider").slick({
        asNavFor: ".hero__captions",
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 6000,
        dots: true,
        adaptiveHeight: true,
        fade: true,
        cssEase: "linear",
        arrows: true
    });

    $(".hero__captions").slick({
        asNavFor: ".hero__slider",
        infinite: false,
        speed: 200,
        fade: true,
        appendArrows: $(".pagination"),
        prevArrow: '<div class="pagination__button"><i class="material-icons">keyboard_arrow_left</i></div>',
        nextArrow: '<div class="pagination__button"><i class="material-icons">keyboard_arrow_right</i></div>'
    });
});

var scroll = new SmoothScroll('a[href*="#"]');
var options = { speed: 3000, easing: "easeOutCubic" };

// var loop = anime({
//     targets: '#arrow-down',
//     translateY: 20,
//     duration: 3000,
//     offset: 400,
//     loop: true
// });

// jQuery(document).ready(function($) {
//     $('.fixed .icon__menu').click(function(event) {
//         $('.fixed .nav').toggleClass('.fixed .nav__active');
//     });
// });

$(document).ready(function() {
    $('.mobile__menu--icon').on('touchstart click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $('.mobile__menu--icon').toggleClass('mobile__menu--icon--active')
        $('.nav').toggleClass('nav__active')
        $('.nav__link').toggleClass('fixed__nav-link')
    })
})