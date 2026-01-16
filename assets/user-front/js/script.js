// ====== preloader =====
$(window).on("load", function () {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const skeletonSections = document.querySelectorAll('.lazy');
    const sections = document.querySelectorAll('.actual-content');

    skeletonSections.forEach((skeleton, index) => {
        skeleton.dataset.index = index; //this will add dynamic data-index to each skeleton
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    const skeleton = entry.target;
                    const index = skeleton.dataset.index;
                    const actualContent = sections[index];

                    if (!actualContent) return; // Skip if no content found

                    const productSlider = actualContent.querySelector('.product-slider');
                    const productSlider2 = actualContent.querySelector('.product-list-slider');
                    const productSlider3 = actualContent.querySelector('#product-list-slider-2');
                    const productSlider4 = actualContent.querySelector('#pro-slider-fashion');
                    const productSlider5 = actualContent.querySelector(".product-slider-md");
                    const productSlider6 = actualContent.querySelector(".flash-slider");
                    const productSlider7 = actualContent.querySelector(".product-inline-slider");

                    // Show the actual content by changing display first
                    actualContent.style.display = "block";

                    // Allow browser to recognize display change before transitioning opacity
                    setTimeout(() => {
                        actualContent.classList.add('visible'); // Apply fade-in effect
                    }, 50);

                    // Handle Slick slider position reset
                    if (productSlider4 && productSlider4.classList.contains('slick-initialized')) {
                        $(productSlider4).slick('setPosition');
                    }

                    if (productSlider && productSlider.classList.contains('slick-initialized')) {
                        $(productSlider).slick('setPosition');
                    }
                    if (productSlider2 && productSlider2.classList.contains('slick-initialized')) {
                        $(productSlider2).slick('setPosition');
                    }
                    if (productSlider3 && productSlider3.classList.contains('slick-initialized')) {
                        $(productSlider3).slick('setPosition');
                    }
                    if (productSlider4 && productSlider4.classList.contains('slick-initialized')) {
                        $(productSlider4).slick('setPosition');
                    }
                    if (productSlider4 && productSlider4.classList.contains('slick-initialized')) {
                        $(productSlider4).slick('setPosition');
                    }
                    if (productSlider4 && productSlider4.classList.contains('slick-initialized')) {
                        $(productSlider4).slick('setPosition');
                    }
                    if (productSlider5 && productSlider5.classList.contains('slick-initialized')) {
                        $(productSlider5).slick('setPosition');
                    }
                    if (productSlider6 && productSlider6.classList.contains('slick-initialized')) {
                        $(productSlider6).slick('setPosition');
                    }
                    if (productSlider7 && productSlider7.classList.contains('slick-initialized')) {
                        $(productSlider7).slick('setPosition');
                    }

                    // Hide skeleton after content is fully visible
                    setTimeout(() => {
                        skeleton.classList.add('hide');
                        skeleton.style.display = "none";
                        skeleton.remove();
                    }, 300);

                    observer.unobserve(skeleton);
                }, 1000);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px 50px 0px'
    });

    skeletonSections.forEach(skeleton => {
        observer.observe(skeleton);
    });
});



!(function ($) {
    'use strict';

    /*============================================
        Menu Dropdown
    ============================================*/
    if ($(window).width() > "1199") {
        $(".menu").superfish({
            popUpSelector: "ul, .cart-dropdown",
            hoverClass: "active",
            delay: 100,
            speed: 'fast',
            speedOut: 'fast',
            cssArrows: false,
        })
    }


    /*============================================
        Sticky Header
    ============================================*/
    if ($(window).width() > "576") {
        $(window).on("scroll", function () {
            var header = $(".sticky-header, .mobile-navbar");
            // If window scroll down (.is-sticky) class will be added to header
            if ($(window).scrollTop() >= 180) {
                header.addClass("is-sticky");
            } else {
                header.removeClass("is-sticky");
            }
        });
    }

    if ($(window).width() > "576") {
        $(window).on("scroll", function () {
            var header = $(".sticky-header-2, .mobile-navbar");
            // If window scroll down (.is-sticky) class will be added to header
            if ($(window).scrollTop() >= 80) {
                header.addClass("is-sticky");
            } else {
                header.removeClass("is-sticky");
            }
        });
    }
    if ($(window).width() < "576") {
        $(window).on("scroll", function () {
            var header = $(".sticky-header, .mobile-navbar");
            // If window scroll down (.is-sticky) class will be added to header
            if ($(window).scrollTop() >= 100) {
                header.addClass("is-sticky");
            } else {
                header.removeClass("is-sticky");
            }
        });
    }

    // header-next
    var getHeaderHeight = function () {
        var headerNext = $(".header-next");
        var header = $(".header-mt-fix");
        var headerHeight = header.height();
        headerNext.css({
            "margin-top": headerHeight + "px"
        });
    }
    getHeaderHeight();

    $(window).on('resize', function () {
        getHeaderHeight();
    });




    var menuBtn = $(".mobile-menu-toggler")
    var body = $("body")
    menuBtn.on("click", function (e) {
        $(this).toggleClass("active")
        body.toggleClass("menu-active")
        e.preventDefault();
    })
    $(".mobile-menu-overlay, .mobile-menu-close").on("click", function (e) {
        body.removeClass("menu-active")
        menuBtn.removeClass("active")
        e.preventDefault()
    })

    // Adding main nav into mobile nav
    var mobileMenu = $(".mobile-menu .mobile-menu-wrapper");
    $(".header").find(".mobile-search, .mobile-nav").clone(!0).appendTo(mobileMenu);

    $(".mobile-nav li, .category-toggle").on("click", function (t) {
        var i = $(this).closest("li"),
            o = i.find("ul").eq(0);
        if (i.hasClass("open")) {
            o.slideUp(300, function () {
                i.removeClass("open")
            })
        } else {
            o.slideDown(300, function () {
                i.addClass("open")
            })
        }
        t.stopPropagation()
    })

    /*============================================
        Slick Slider
    ============================================*/
    // Home Slider
    $(".animated-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;

        $(sliderId).slick({
            rtl: $('html').attr('dir') === 'rtl',
            autoplay: true,
            speed: 300,
            autoplaySpeed: 3000,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            dots: false,
            arrows: false,
        })

        $(sliderId).on('init', function (e, slick) {
            var firstAnimatingElements = $('.slider-item:first-child').find('[data-animation]');
            doAnimations(firstAnimatingElements);
        });

        $(sliderId).on('beforeChange', function (e, slick, currentSlide, nextSlide) {
            var animatingElements = $('.slider-item[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
            doAnimations(animatingElements);
        });

        function doAnimations(elements) {
            var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            elements.each(function () {
                var animationDelay = $(this).data('delay');
                var animationType = 'animate__animated ' + $(this).data('animation');
                $(this).css({
                    'animation-delay': animationDelay,
                    '-webkit-animation-delay': animationDelay
                });
                $(this).addClass(animationType).one(animationEndEvents, function () {
                    $(this).removeClass(animationType);
                });
            });
        }
    })

    $(".home-slider-3-thumb").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        focusOnSelect: true,
        asNavFor: '.animated-slider',
        rtl: $('html').attr('dir') === 'rtl'
    });

    // Category Slider
    if ($('.category-slider').length > 0) {
        $(".category-slider").each(function () {
            var id = $(this).attr("id");
            var sliderId = "#" + id;
            var appendArrowsClassName = "#" + id + "-arrows";

            $(sliderId).slick({
                speed: 600,
                arrows: true,
                dots: false,
                autoplay: false,
                slidesToShow: 5,
                loop: true,
                infinite: false,
                rtl: $('html').attr('dir') === 'rtl',
                responsive: [{
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
                ],
                prevArrow: '<button type="button" class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></button>',
                nextArrow: '<button type="button" class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></button>',
                appendArrows: appendArrowsClassName
            });
        });
    }

    if ($('.cat-slider-skinflow').length > 0) {
        $(".cat-slider-skinflow").each(function () {
            var id = $(this).attr("id");
            var sliderId = "#" + id;

            $(sliderId).slick({
                speed: 600,
                arrows: true,
                dots: false,
                autoplay: false,
                slidesToShow: 5,
                loop: true,
                infinite: false,
                rtl: $('html').attr('dir') === 'rtl',
                responsive: [{
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
                ]
            });
        });
    }

    // Product List Slider
    if ($('.product-list-slider').length > 0) {
        $(".product-list-slider").each(function () {
            var id = $(this).attr("id");
            var sliderId = "#" + id;
            var appendArrowsClassName = "#" + id + "-arrows";

            $(sliderId).slick({
                arrows: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                loop: true,
                speed: 600,
                rtl: $('html').attr('dir') === 'rtl',
                prevArrow: '<span class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></span>',
                nextArrow: '<span class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></span>',
                appendArrows: appendArrowsClassName
            });
        });
    }

    /*============================================
        Image Lightbox
    ============================================*/
    $(".lightbox-single").magnificPopup({
        type: "image",
        mainClass: 'mfp-with-zoom',
        zoom: {
            enabled: true,
            duration: 300,
            easing: 'ease-in-out',
            opener: function (openerElement) {
                return openerElement.is('img') ? openerElement : openerElement.find('img');
            }
        },
        gallery: {
            enabled: true
        }
    });

    /*============================================
        Toggle Buttons
    ============================================*/
    $("#textShowToggle").on("click", function () {
        $(".text-collapse").toggleClass("show")
    })

    $(".show-password-field").on("click", function () {
        var showIcon = $(this).find(".show-icon");
        var passwordField = $($(this).attr("toggle"));
        showIcon.toggleClass("show");
        if (passwordField.attr("type") == "password") {
            passwordField.attr("type", "text")
        } else {
            passwordField.attr("type", "password");
        }
    })
    var currentTimeDate = new Date(currentTime);
    //get current time zone wise
    setInterval(function () {
        // Increment the time by one second every time
        currentTimeDate.setSeconds(currentTimeDate.getSeconds() + 1); // Add one second

        $('.product-countdown').each(function () {
            try {
                var endD = $(this).data('end_date');
                var item_id = $(this).data('item_id');

                // Convert endD to Date object
                var endTime = Date.parse(endD) / 1000;

                // Get the current time in seconds
                var now = Math.floor(currentTimeDate.getTime() / 1000);

                // Calculate the time left
                var timeLeft = endTime - now;
                var days = Math.floor(timeLeft / 86400);
                var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
                var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
                var seconds = Math.floor(timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60));

                // Add leading zeros if necessary
                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                // Update countdown display
                var count_value_day = (".days .count-value_" + item_id);
                var count_value_hour = (".hours .count-value_" + item_id);
                var count_value_minutes = (".minutes .count-value_" + item_id);
                var count_value_seconds = (".seconds .count-value_" + item_id);

                $(count_value_day).html(days);
                $(count_value_hour).html(hours);
                $(count_value_minutes).html(minutes);
                $(count_value_seconds).html(seconds);
            } catch (error) {
                // Handle any error that occurs within this function
                console.error(error);
            }
        });
    }, 1000);


    /*============================================
        Tooltip
    ============================================*/
    var tooltipTriggerList = [].slice.call($('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    $('.modal').on('shown.bs.modal', function () {
        // Destroy any existing tooltips
        $('[data-bs-toggle="tooltip"]').tooltip('dispose');
        // Initialize tooltips
        $('[data-bs-toggle="tooltip"]').tooltip();
    });

    /*===========================================
        Image to Background Image
    ============================================*/

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".bg-img").forEach(function (el) {
            var parent = el.parentElement;

            // Add classes for blur effect and lazy loading
            parent.classList.add('blur-up', 'lazyload');

            // Use lazysizes to handle lazy loading
            el.classList.add('lazyload');

            el.addEventListener("lazyloaded", function () {

                // When the image is loaded, set it as the parent's background and hide the img tag
                parent.style.background = `url(${el.dataset.src}) no-repeat center bottom / cover`;
                el.style.display = "none";
            });
        });
    });

    /*===========================================
        Lazyload Image
    ============================================*/
    function lazyLoad() {
        window.lazySizesConfig = window.lazySizesConfig || {};
        window.lazySizesConfig.loadMode = 2;
        lazySizesConfig.preloadAfterLoad = true;
    }

    /*============================================
        Youtube Popup
    ============================================*/
    $(".youtube-popup").magnificPopup({
        disableOn: 300,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    })


    /*===========================================
        Nice Select
    ============================================*/
    $("select").niceSelect();


    lazyLoad();
    $("#myTable").DataTable({
        ordering: false,
        pagingType: 'numbers',
        "language": {
            "search": Search + ':',
            "lengthMenu": `${showText} _MENU_ ${entriesText}`,
            "info": `${Showing} _START_ ${to} _END_ ${ofText} _TOTAL_ ${entriesText}`,
            "paginate": {
                "next": nextText,
                "previous": previousText
            }
        }
    });


    // Go to Top
    $(window).on("scroll", function () {
        // If window scroll down .active class will added to go-top
        var goTop = $(".go-top");
        if ($(window).scrollTop() >= 200) {
            goTop.addClass("active");
        } else {
            goTop.removeClass("active")
        }
    })
    $(".go-top").on("click", function (e) {
        $("html, body").animate({
            scrollTop: 0,
        }, 0);
    });

    $('body').on('submit', '.newsletter-form', function (e) {
        $('.request-loader').addClass('show');
        e.preventDefault();
        let formURL = $(this).attr('action');
        var formMethod = $(this).attr('method');
        let formData = new FormData($(this)[0]);
        if (typeof formMethod == 'undefined') {
            var formMethod = 'POST';
        }

        $.ajax({
            url: formURL,
            method: formMethod,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (response) {
                $('.request-loader').removeClass('show');
                $('input[name="email"]').val('');
                toastr['success'](response.success);
            },
            error: function (errorData) {
                $('.request-loader').removeClass('show');
                toastr['error'](errorData.responseJSON.error.email[0]);
            }
        });
    })

    // product Slider
    if ($('.product-slider').length > 0) {
        $(".product-slider").each(function () {
            var $this = $(this);
            if ($this.length > 0) {
                var id = $this.attr("id");
                if (id) {
                    var sliderId = "#" + id;
                    var appendArrowsClassName = "#" + id + "-arrows";

                    $(sliderId).slick({
                        speed: 600,
                        arrows: true,
                        dots: false,
                        autoplay: false,
                        slidesToShow: 5,
                        infinite: false,
                        rtl: $('html').attr('dir') === 'rtl',
                        responsive: [{
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 575,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                        ],
                        prevArrow: '<button type="button" class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></button>',
                        nextArrow: '<button type="button" class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></button>',
                        appendArrows: appendArrowsClassName
                    });

                    $('[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                        $(sliderId).slick('setPosition');
                    });
                } else {
                    console.error("Product slider element is missing an ID.");
                }
            }
        });
    }

    // product order table
    if ($('#order_table').length > 0) {
        $('#order_table').DataTable({
            responsive: true,
            ordering: false,
            "language": {
                "search": Search + ':',
                "lengthMenu": `${showText} _MENU_ ${entriesText}`,
                "info": `${Showing} _START_ ${to} _END_ ${ofText} _TOTAL_ ${entriesText}`,
                "paginate": {
                    "next": nextText,
                    "previous": previousText
                }
            }
        });
    }

    // product sldier 2
    if ($('.product-slider-2').length > 0) {
        $(".product-slider-2").each(function () {
            var id = $(this).attr("id");
            var sliderId = "#" + id;
            var appendArrowsClassName = "#" + id + "-arrows";

            $(sliderId).slick({
                rtl: $('html').attr('dir') === 'rtl',
                speed: 600,
                arrows: false,
                dots: false,
                autoplay: false,
                draggable: true,
                slidesToShow: 5,
                infinite: false,
                responsive: [{
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 9,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 8,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 6,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 380,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
                ],
                prevArrow: '#product-slider-arrows .slider-prev',  // Link to the custom prev button
                nextArrow: '#product-slider-arrows .slider-next',  // Link to the custom next button
            });
        });
    }

    /*============================================
        Toggle List
    ============================================*/
    $("[data-toggle-list]").each(function () {
        var list = $(this).children();
        var listShow = $(this).data("toggle-show");
        var listShowBtn = $(this).next("[data-toggle-btn]");

        var showMoreText = show_more + ' +';
        var showLessText = show_less + ' -';

        if (list.length > listShow) {
            listShowBtn.show();
            list.slice(listShow).hide();
            listShowBtn.on("click", function () {
                var isExpanded = listShowBtn.text() === showLessText;
                list.slice(listShow).slideToggle(300);
                listShowBtn.text(isExpanded ? showMoreText : showLessText);
            });
        } else {
            listShowBtn.hide();
        }
    });

    // order-summery-list collapse
    $('.show-variation').each(function () {
        var showMoreText = show_variations;
        var showLessText = less_variations;
        var variationArea = $(this).siblings('.variation-area');
        if (variationArea.length > 0) {
            variationArea.hide();
            $(this).on('click', function () {
                var isExpanded = $(this).text() === showLessText;
                variationArea.slideToggle('slow');
                $(this).text(isExpanded ? showMoreText : showLessText);
            });
        }
    });

    // odometer CountDown
    if ($('.odometer').length > 0) {
        $('.odometer').appear(function (e) {
            var odo = $(".odometer");
            odo.each(function () {
                var countNumber = $(this).attr("data-count");
                var odometer = new Odometer({
                    el: this,
                    value: 0,
                    format: '',
                    duration: 1500,
                });
                odometer.update(countNumber);
            });
        });
    };

    //testimonial slider
    $(".testimonial-slider").slick({
        slidesToShow: 3,
        infinite: true,
        slidesToScroll: 1,
        dots: true,
        rtl: $('html').attr('dir') === 'rtl',
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    adaptiveHeight: true,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ],
    });


    $(document).ready(function () {
        $(".menu-action-item a").on('click', function () {
            var target = $(this).parent().children(".setting-dropdown");
            // Slide toggle the dropdown menu
            $(target).slideToggle();
            // Toggle between fa-plus and fa-minus
            $(this).find(".plus-icon i").toggleClass("fa-plus fa-minus");
        });
    });

    $(document).ready(function () {
        $(".has-submenu .sf-with-ul").on('click', function (event) {
            var submenu = $(this).next(".submenu");
            $(submenu).slideToggle();
            $(this).find("i").toggleClass("fa-plus fa-minus");
        });
    });

    // Widget Categories
    $(document).ready(function () {
        function widgetcategories() {
            if ($(window).width() <= 992.99) {
                $(".menu-collapse").hide();
                $(".widget-categories .category").off("click").on("click", function (e) {
                    e.preventDefault();
                    const $menuCollapse = $(this).siblings(".menu-collapse");
                    $(".menu-collapse").not($menuCollapse).slideUp();
                    $menuCollapse.slideToggle();
                });
            } else {
                $(".menu-collapse").show();
                $(".category").off("click");
            }
        }
        widgetcategories();
        $(window).resize(function () {
            widgetcategories();
        });
    });

    /*============================================
        footerdescription
    ============================================*/
    document.addEventListener('DOMContentLoaded', function () {
        const content = document.querySelector('.footer_description');
        const showMoreButton = document.querySelector('.show-more-footer');

        if (content && showMoreButton) {
            content.style.maxHeight = "165px";
            showMoreButton.addEventListener('click', function () {
                if (content.style.maxHeight === "165px") {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    showMoreButton.innerHTML = show_less + ' -';
                } else {
                    content.style.maxHeight = "165px";
                    showMoreButton.innerHTML = show_more + ' +';
                }
            });
        }
    });

    //banner slider
    if ($('.banner-slider').length > 0) {
        $(".banner-slider").each(function () {
            var id = $(this).attr("id");
            var sliderId = "#" + id;

            $(sliderId).slick({
                rtl: $('html').attr('dir') === 'rtl',
                speed: 600,
                arrows: false,
                dots: true,
                autoplay: false,
                draggable: true,
                slidesToShow: 2,
                infinite: false,

                responsive: [{
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }],

            });
        });
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').attr('src', e.target.result);
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        readURL(this);
    });


    /*============================================
    Tabs mouse hover animation
    ============================================*/
    $("[data-hover='fancyHover']").mouseHover();

    /*============================================
    AOS js init
    ============================================*/
    if (typeof AOS !== "undefined") {
        AOS.init({
            easing: "ease",
            duration: 1200,
            once: true,
            offset: 60,
            disable: "mobile"
        });
    }

    // product Flash Slider
    $(".flash-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var appendArrowsClassName = "#" + id + "-arrows";

        $(sliderId).slick({
            rtl: $('html').attr('dir') === 'rtl',
            speed: 600,
            arrows: false,
            dots: false,
            autoplay: false,
            slidesToShow: 2,
            infinite: false,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            ],
            prevArrow: '<button type="button" class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></button>',
            nextArrow: '<button type="button" class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></button>',
            appendArrows: appendArrowsClassName
        });

    });

    // product Slider Md
    $(".product-slider-md").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var appendArrowsClassName = "#" + id + "-arrows";

        $(sliderId).slick({
            rtl: $('html').attr('dir') === 'rtl',
            speed: 600,
            arrows: false,
            dots: false,
            autoplay: false,
            slidesToShow: 2,
            infinite: false,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            ],
            prevArrow: '<button type="button" class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></button>',
            nextArrow: '<button type="button" class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></button>',
            appendArrows: appendArrowsClassName
        });

    });

    $(".hero-center-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var appendArrowsClassName = "#" + id + "-arrows";

        $(sliderId).slick({
            rtl: $('html').attr('dir') === 'rtl',
            speed: 600,
            arrows: true,
            dots: false,
            autoplay: false,
            infinite: true,
            centerMode: true,
            centerPadding: '25%',
            slidesToShow: 1,
            prevArrow: '<button type="button" class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></button>',
            nextArrow: '<button type="button" class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></button>',
            appendArrows: appendArrowsClassName,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        centerPadding: '15%',
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        centerPadding: '0',
                        slidesToShow: 1
                    }
                }
            ]
        });
    });

    // Product List Slider
    $(".product-inline-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var appendArrowsClassName = "#" + id + "-arrows";

        $(sliderId).slick({
            rtl: $('html').attr('dir') === 'rtl',
            arrows: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: false,
            loop: true,
            dots: false,
            speed: 600,
            prevArrow: '<span class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></span>',
            nextArrow: '<span class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></span>',
            appendArrows: appendArrowsClassName
        });
    });

    $(".featured-single-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var appendArrowsClassName = "#" + id + "-arrows";

        $(sliderId).slick({
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            loop: true,
            dots: false,
            speed: 600,
            prevArrow: '<span class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></span>',
            nextArrow: '<span class="btn-icon slider-btn slider-next"><i class="fal fa-angle-right"></i></span>',
            appendArrows: appendArrowsClassName
        });
    });


    if ($(".announcement-slider").length > 0) {
        $('.announcement-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 0,
            speed: 5000,
            cssEase: 'linear',
            rtl: $('html').attr('dir') === 'rtl',
            arrows: false,
            dots: false,
            pauseOnHover: false,
            variableWidth: true
        });
    }


    /*============================================
        Search Box
    ============================================*/
    if ($(".menu-search").length > 0) {
        const menuSearch = document.querySelector('.menu-search');
        const searchBtn = document.querySelector('.search-btn');
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            menuSearch.classList.toggle('menuSearchactive');
        });
        document.addEventListener('click', function (e) {
            if (!menuSearch.contains(e.target)) {
                menuSearch.classList.remove('menuSearchactive');
            }
        });
    }


})(jQuery);
