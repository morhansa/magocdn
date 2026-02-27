/**
 * Product details gallery: Swiper 11 (main + thumbs) + PhotoSwipe 5 (tap to open lightbox).
 * Loaded only on product details page. Uses .swiper-product-* classes so shop.js (Slick) ignores this block.
 */
(function () {
  'use strict';

  var container = document.querySelector('.product-gallery-wrapper');
  if (!container) return;

  var isRTL = document.documentElement.getAttribute('dir') === 'rtl';

  var mainEl = container.querySelector('.swiper-product-main');
  var thumbsEl = container.querySelector('.swiper-product-thumbs');
  if (!mainEl || !thumbsEl) return;

  var thumbsSwiper = null;
  var mainSwiper = null;

  function initSwipers() {
    // Thumbs: horizontal slider – عدد محدود ظاهر، الباقي بالسحب (لا يتكدس تحت بعض)
    thumbsSwiper = new window.Swiper('.swiper-product-thumbs', {
      direction: 'horizontal',
      spaceBetween: 8,
      slidesPerView: 'auto',
      freeMode: true,
      watchSlidesProgress: true,
      touchReleaseOnEdges: true,
      resistanceRatio: 0.85,
      rtl: isRTL,
      breakpoints: {
        320: { slidesPerView: 4 },
        576: { slidesPerView: 5 },
        768: { slidesPerView: 6 },
        992: { slidesPerView: 7 }
      }
    });

    // Main: full width, one slide, linked to thumbs, tap opens PhotoSwipe
    mainSwiper = new window.Swiper('.swiper-product-main', {
      spaceBetween: 0,
      thumbs: { swiper: thumbsSwiper },
      touchReleaseOnEdges: true,
      resistanceRatio: 0.85,
      rtl: isRTL,
      noSwipingClass: 'pswp-trigger',
      allowTouchMove: true
    });
  }

  function initPhotoSwipe() {
    if (typeof window.PhotoSwipeLightbox === 'undefined') return;
    var lightbox = new window.PhotoSwipeLightbox({
      gallery: '.swiper-product-main',
      children: 'a.pswp-trigger',
      pswpModule: window.PhotoSwipe,
      pswpCSS: false
    });
    lightbox.init();
  }

  function init() {
    if (!window.Swiper) return;
    initSwipers();
    initPhotoSwipe();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
