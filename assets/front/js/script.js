!(function ($) {
    "use strict";

    // Mean Menu
    $(".mean-menu").meanmenu({
        meanScreenWidth: "1199",
    });

    // Sticky Header
    $(window).on("scroll", function () {
        var header = $(".header-area");
        // If window scroll down .is-sticky class will added to header
        if ($(window).scrollTop() >= 100) {
            header.addClass("is-sticky");
        } else {
            header.removeClass("is-sticky");
        }
    });

    $(window).on('load', function () {
        if ($(".popup-wrapper").length > 0) {
            let $firstPopup = $(".popup-wrapper").eq(0);
            popupAnnouncement($firstPopup);
        }
    });

    $(document).ready(function () {
        $(".has-submenu .sf-with-ul").click(function (event) {
            event.preventDefault();
            var submenu = $(this).next(".submenu");
            $(submenu).slideToggle();
            $(this).find("i").toggleClass("fa-plus fa-minus");
        });
    });





    $('.offer-timer').each(function () {
        let $this = $(this);
        let d = new Date($this.data('end_date'));
        let ye = parseInt(new Intl.DateTimeFormat('en', {
            year: 'numeric'
        }).format(d));
        let mo = parseInt(new Intl.DateTimeFormat('en', {
            month: 'numeric'
        }).format(d));
        let da = parseInt(new Intl.DateTimeFormat('en', {
            day: '2-digit'
        }).format(d));
        let t = $this.data('end_time');
        let time = t.split(":");
        let hr = parseInt(time[0]);
        let min = parseInt(time[1]);
        $this.syotimer({
            year: ye,
            month: mo,
            day: da,
            hour: hr,
            minute: min,
        });
    });

    // Sponsor Slider - Optimized for speed
    var sponsorSlider = new Swiper(".sponsor-slider", {
        speed: 200, // Reduced from 400 for faster transitions
        spaceBetween: 30,
        loop: true,
        preloadImages: true, // Preload images for faster display
        lazy: false, // Disable lazy loading for better performance
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 576px
            576: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            // when window width is >= 640px
            768: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    });

    // User Slider - Optimized for speed
    var sponsorSlider = new Swiper(".user-slider", {
        speed: 200, // Reduced from 400 for faster transitions
        spaceBetween: 30,
        loop: true,
        preloadImages: true, // Preload images for faster display
        lazy: false, // Disable lazy loading for better performance
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // when window width is >= 576px
            576: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            // when window width is >= 640px
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });

    // Testimonial Slider - Optimized for speed
    new Swiper(".testimonial-slider", {
        speed: 200, // Faster transitions
        spaceBetween: 15,
        slidesPerView: 1,
        autoHeight: true,
        preloadImages: true, // Preload images
        lazy: false, // Disable lazy loading
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    // Youtube Popup
    $(".youtube-popup").magnificPopup({
        disableOn: 300,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    })

    // Preloader
    $("#preLoader").delay(1000).queue(function () {
        $(this).remove();
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


    // Lazy-load Image
    function lazyLoad() {
        window.lazySizesConfig = window.lazySizesConfig || {};
        window.lazySizesConfig.loadMode = 2;
        lazySizesConfig.preloadAfterLoad = true;
    }

        lazyLoad();

    // AOS Init - Disabled for better performance (removed animations)
    // AOS.init({
    //     easing: "ease-out",
    //     duration: 600
    // });

    // Nice Select
    $("select").niceSelect();

    $('#footerSubscriber').on('submit', function (e) {
        e.preventDefault();
        var url = $(this).attr('action');
        var method = $(this).attr('method');
        var fd = new FormData($(this)[0]);

        $.ajax({
            url: url,
            method: method,
            data: fd,
            processData: false,
            contentType: false,
            success: function (response) {
                $('input[name="email"]').val('');

                toastr['success'](response.success);
            },
            error: function (errorData) {
                toastr['error'](errorData.responseJSON.error.email[0]);
            }
        });
    })
    $('body').on('submit', '.subscribeForm', function (e) {
        e.preventDefault();
        var url = $(this).attr('action');
        var method = $(this).attr('method');
        var fd = new FormData($(this)[0]);

        $.ajax({
            url: url,
            method: method,
            data: fd,
            processData: false,
            contentType: false,
            success: function (response) {
                $('input[name="email"]').val('');

                toastr['success'](response.success);
            },
            error: function (errorData) {
                toastr['error'](errorData.responseJSON.error.email[0]);
            }
        });
    })



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

    $('#quickViewModal').on('hidden.bs.modal', function (e) {
        $('.zoomContainer').remove();
    })


    $("[data-toggle-list]").each(function () {
        var list = $(this).children(); // Get all the list items within the parent.
        var listShow = $(this).data("toggle-show"); // Get the number of items to show initially.
        var listShowBtn = $(this).next("[data-toggle-btn]"); // Get the "Show More" button.

        var showMoreText = show_more + ' +'; // Text for "Show More".
        var showLessText = show_less + ' -'; // Text for "Show Less".

        // Check if there are more items than what should be initially shown.
        if (list.length > listShow) {
            listShowBtn.show(); // Show the "Show More" button.
            list.slice(listShow).hide(); // Hide items that should not be displayed initially.

            // Add a click event to the button for toggling the list items.
            listShowBtn.on("click", function () {
                var isExpanded = listShowBtn.text() === showLessText; // Check if list is expanded.

                // Toggle the visibility of the extra items.
                list.slice(listShow).slideToggle(300);

                // Change the button text based on whether the list is expanded or collapsed.
                listShowBtn.text(isExpanded ? showMoreText : showLessText);
            });
        } else {
            listShowBtn.hide(); // Hide the button if there are no extra items to show.
        }
    });

})(jQuery);



function popupAnnouncement($this) {
    let closedPopups = [];
    if (sessionStorage.getItem('closedPopups')) {
        closedPopups = JSON.parse(sessionStorage.getItem('closedPopups'));
    }

    // if the popup is not in closedPopups Array
    if (closedPopups.indexOf($this.data('popup_id')) == -1) {
        $('#' + $this.attr('id')).show();
        let popupDelay = $this.data('popup_delay');

        setTimeout(function () {
            jQuery.magnificPopup.open({
                items: {
                    src: '#' + $this.attr('id')
                },
                type: 'inline',
                callbacks: {
                    afterClose: function () {
                        // after the popup is closed, store it in the sessionStorage & show next popup
                        closedPopups.push($this.data('popup_id'));
                        sessionStorage.setItem('closedPopups', JSON.stringify(closedPopups));


                        if ($this.next('.popup-wrapper').length > 0) {
                            popupAnnouncement($this.next('.popup-wrapper'));
                        }
                    }
                }
            }, 0);
        }, popupDelay);
    } else {
        if ($this.next('.popup-wrapper').length > 0) {
            popupAnnouncement($this.next('.popup-wrapper'));
        }
    }
}
