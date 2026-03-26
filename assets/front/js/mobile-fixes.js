/**
 * Mobile Product Gallery & Cart Fixes
 * Fixes:
 * 1. Product gallery zoom issue on mobile (prevents unwanted zoom on scroll)
 * 2. Mobile cart button click handler
 * 3. Slick Slider Mobile Optimization (Error Proof)
 */

(function ($) {
    'use strict';

    $(document).ready(function () {

        // ========================================
        // FIX 1: Mobile Cart Button
        // ========================================
        $('.mobile-cart-trigger').on('click', function (e) {
            e.preventDefault();
            var cartUrl = $(this).data('cart-url');
            if (cartUrl) {
                window.location.href = cartUrl;
            }
        });

        // ========================================
        // FIX 2: Product Gallery - Disable Zoom on Mobile
        // ========================================
        if ($(window).width() <= 768) {
            // Disable pinch-to-zoom on product images
            $('.product-single-slider2, .slider-thumbnails2').on('touchstart touchmove', function (e) {
                // Allow single touch (swipe) but prevent multi-touch (zoom)
                if (e.originalEvent.touches.length > 1) {
                    e.preventDefault();
                }
            });

            // Prevent double-tap zoom on product images
            $('.product-single-slider2 img, .slider-thumbnails2 img').on('touchend', function (e) {
                var now = Date.now();
                var lastTouch = $(this).data('lastTouch') || 0;
                var delta = now - lastTouch;

                if (delta < 300 && delta > 0) {
                    // Double tap detected - prevent default zoom
                    e.preventDefault();
                }

                $(this).data('lastTouch', now);
            });

            // ========================================
            // FIX 3: Optimize Slick Slider (Safe Initialization)
            // ========================================

            // Wait a moment to ensure DOM is fully ready and other scripts are done
            setTimeout(function () {
                // Function to safe init slick
                function safeInitSlick(selector, options) {
                    var $el = $(selector);

                    // Critical Check: Element must exist AND have children
                    if ($el.length > 0 && $el.children().length > 0) {

                        // Check if already initialized
                        if (!$el.hasClass('slick-initialized')) {
                            try {
                                $el.slick(options);
                            } catch (e) {
                                console.error('Slick Init Error on ' + selector + ':', e);
                            }
                        }
                    }
                }

                // Main Product Slider
                safeInitSlick('.product-single-slider2', {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: false,
                    speed: 300,
                    cssEase: 'ease-out',
                    touchThreshold: 10,
                    swipeToSlide: true,
                    asNavFor: '.slider-thumbnails2',
                    lazyLoad: 'ondemand',
                    adaptiveHeight: true,
                    accessibility: false, // Critical to prevent "add" error
                    focusOnSelect: false  // Critical to prevent "add" error
                });

                // Thumbnail Slider
                safeInitSlick('.slider-thumbnails2', {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    asNavFor: '.product-single-slider2',
                    dots: false,
                    arrows: false,
                    centerMode: false,
                    focusOnSelect: true,
                    speed: 200,
                    touchThreshold: 10,
                    swipeToSlide: true,
                    accessibility: false, // Critical
                    responsive: [
                        {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 3
                            }
                        }
                    ]
                });
            }, 100); // 100ms delay to be safe
        }

        // ========================================
        // FIX 4: Smooth Scroll for Mobile
        // ========================================
        if ($(window).width() <= 768) {
            // Enable smooth scrolling on mobile
            $('html').css({
                '-webkit-overflow-scrolling': 'touch',
                'overflow-scrolling': 'touch'
            });
        }

    });

})(jQuery);
