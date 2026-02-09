// ========================================
// MOBILE UX FIXES - JAVASCRIPT
// ========================================

$(document).ready(function () {

    // ==========================================
    // 1. MOBILE CART DROPDOWN
    // ==========================================

    // Create mobile cart dropdown HTML
    if ($(window).width() <= 991) {
        const cartDropdownHTML = `
            <div class="mobile-cart-dropdown-overlay"></div>
            <div class="mobile-cart-dropdown">
                <div class="mobile-cart-dropdown-header">
                    <h3 class="mobile-cart-dropdown-title">السلة</h3>
                    <button class="mobile-cart-dropdown-close">
                        <i class="fal fa-times"></i>
                    </button>
                </div>
                <div class="mobile-cart-dropdown-content">
                    <div class="mobile-cart-dropdown-empty">
                        <i class="fal fa-shopping-bag"></i>
                        <p>السلة فارغة</p>
                    </div>
                </div>
            </div>
        `;

        // Append to body if not exists
        if ($('.mobile-cart-dropdown').length === 0) {
            $('body').append(cartDropdownHTML);
        }
    }

    // Handle mobile cart trigger
    $(document).on('click', '.mobile-cart-trigger', function (e) {
        e.preventDefault();

        const cartUrl = $(this).data('cart-url');

        // On mobile, show dropdown
        if ($(window).width() <= 991) {
            $('.mobile-cart-dropdown-overlay').addClass('active');
            $('.mobile-cart-dropdown').addClass('active');

            // Load cart content via AJAX
            loadMobileCartContent();
        } else {
            // On desktop, redirect to cart page
            window.location.href = cartUrl;
        }
    });

    // Close mobile cart dropdown
    $(document).on('click', '.mobile-cart-dropdown-close, .mobile-cart-dropdown-overlay', function () {
        $('.mobile-cart-dropdown-overlay').removeClass('active');
        $('.mobile-cart-dropdown').removeClass('active');
    });

    // Load mobile cart content
    function loadMobileCartContent() {
        // Get cart items from existing cart dropdown or make AJAX call
        const $desktopCart = $('.cart-dropdown');

        if ($desktopCart.length > 0) {
            // Clone desktop cart content
            const cartContent = $desktopCart.html();
            $('.mobile-cart-dropdown-content').html(cartContent);
        } else {
            // Show loading or empty state
            $('.mobile-cart-dropdown-content').html(`
                <div class="mobile-cart-dropdown-empty">
                    <i class="fal fa-shopping-bag"></i>
                    <p>السلة فارغة</p>
                </div>
            `);
        }
    }

    // ==========================================
    // 2. PRODUCT GALLERY - MOBILE SWIPE FIX
    // ==========================================

    if ($(window).width() <= 991) {
        // Disable default touch behavior on gallery
        $('.product-single-gallery').on('touchstart touchmove', function (e) {
            // Allow slick slider to handle touch events
            e.stopPropagation();
        });

        // Reinitialize slick on orientation change
        $(window).on('orientationchange', function () {
            setTimeout(function () {
                if ($('.product-single-slider2').hasClass('slick-initialized')) {
                    $('.product-single-slider2').slick('setPosition');
                }
                if ($('.slider-thumbnails2').hasClass('slick-initialized')) {
                    $('.slider-thumbnails2').slick('setPosition');
                }
            }, 200);
        });
    }

    // ==========================================
    // 3. PRICE UPDATE ANIMATION
    // ==========================================

    // Add animation class when price updates
    const originalPriceText = $('#details_new-price').text();

    // Watch for price changes
    const priceObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                // Add animation class
                $('.product-price').addClass('price-updating');

                // Remove after animation
                setTimeout(function () {
                    $('.product-price').removeClass('price-updating');
                }, 300);
            }
        });
    });

    // Start observing price element
    const priceElement = document.getElementById('details_new-price');
    if (priceElement) {
        priceObserver.observe(priceElement, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
});
