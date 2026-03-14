'use strict';

var pprice = 0.00;
toastr.options.closeButton = true;
let variants = ``;
let variations = {};
var ffffff = 0;
var $voptions = '';

function totalPrice(qty) {
    qty = qty.toString().length > 0 ? qty : 0;

    $voptions = $("input.voptions:checked");
    let vprice = 0;
    if ($voptions.length > 0) {
        $voptions.each(function () {
            vprice = parseFloat(vprice) + parseFloat($(this).data('price'));
        });
    }

    let total = parseFloat(pprice) + parseFloat(vprice);
    total = total.toFixed(2) * parseInt(qty);
    if ($("#productPrice").length > 0) {
        $("#productPrice").html(total.toFixed(2));
    }

    return total.toFixed(2);
}

function addToCart(url, variant, qty) {
    $('.request-loader').addClass('show');
    let cartUrl = url;
    // button disabled & loader activate (only for modal add to cart button)
    $(".modal-cart-link").addClass('disabled');
    $(".modal-cart-link span").removeClass('d-block');
    $(".modal-cart-link span").addClass('d-none');
    $(".modal-cart-link i").removeClass('d-none');
    $(".modal-cart-link i").addClass('d-inline-block');

    $.get(cartUrl + ',,,' + qty + ',,,' + totalPrice(qty) + ',,,' + JSON.stringify(variant), function (res) {
        $(".request-loader").removeClass("show");

        // button enabled & loader deactivate (only for modal add to cart button)
        $(".modal-cart-link").removeClass('disabled');
        $(".modal-cart-link span").removeClass('d-none');
        $(".modal-cart-link span").addClass('d-block');
        $(".modal-cart-link i").removeClass('d-inline-block');
        $(".modal-cart-link i").addClass('d-none');

        if (res.message) {
            toastr["success"](res.message);
            $("#cartQuantity").load(location.href + " #cartQuantity");
            $("#variationModal").modal('hide');
            $("#cartIconWrapper").load(location.href + " #cartIconWrapper>*", "");
            cartDropdown();
        } else {
            toastr["error"](res.error);
        }
        $('.request-loader').removeClass('show');
    });
}

// wish list
function addTowishList(url, __this) {
    $('.request-loader').addClass('show');
    // button disabled & loader activate (only for modal add to cart button)
    $(".modal-cart-link").addClass('disabled');
    $(".modal-cart-link span").removeClass('d-block');
    $(".modal-cart-link span").addClass('d-none');
    $(".modal-cart-link i").removeClass('d-none');
    $(".modal-cart-link i").addClass('d-inline-block');

    $.get(url, function (res) {
        $(".request-loader").removeClass("show");
        // button enabled & loader deactivate (only for modal add to cart button)
        $(".modal-cart-link").removeClass('disabled');
        $(".modal-cart-link span").removeClass('d-none');
        $(".modal-cart-link span").addClass('d-block');
        $(".modal-cart-link i").removeClass('d-inline-block');
        $(".modal-cart-link i").addClass('d-none');

        if (res.message) {
            __this.addClass('remove-wish active').removeClass('add-to-wish');
            toastr["success"](res.message);
            $("#cartQuantity").load(location.href + " #cartQuantity");
            $("#variationModal").modal('hide');
            $("#cartIconWrapper").load(location.href + " #cartIconWrapper>*", "");
            wishlistCount();
        } else {
            toastr["error"](res.error);
        }
        $('.request-loader').removeClass('show');
    });
}

$('body').on('click', '.btn-wishlist', function (e) {
    e.preventDefault();
    let $this = $(this);
    let url = $this.attr('data-url');
    addTowishList(url, $this);
});

(function ($) {
    "use strict";
    // ============== add to cart js start =======================//
    $("body").on('click', '.cart-link', function (e) {
        e.preventDefault();
        $('.request-loader').addClass('show');

        variations = $(this).data('variations');
        // set product current price
        pprice = $(this).data('current_price');
        $("#productPrice").html(pprice);

        let title = $(this).data('title');
        let item_id = $(this).data('item_id');
        let language_id = $(this).data('language_id');
        ffffff = $(this).data('item_id');
        // clear all previously loaded variations  input radio & checkboxes
        $(".variation-label").addClass("d-none");
        $("#variants").html("");
        // load variants  in modal if variations  available for this item
        if ((variations == 'yes')) {
            $('.request-loader').addClass('show');
            // load variations radio button input fields
            var data = {
                item_id: item_id,
                language_id: language_id,
            };
            $.get(variation_url, data, function (result) {
                $("#variationModal").modal('show');
                // set modal title & quantity
                $("#variationModal .modal-title > span").html(title);
                $("input[name='cart-amount']").val(1);

                $(".variation-label").removeClass("d-none");
                $("#variants").html(result);
                $(".request-loader").removeClass("show");
            });
            $(".modal-cart-link").attr('data-item_id', item_id);
            $(".modal-cart-link").attr('data-total_variations', $(this).data('totalvari'));
            $('[data-bs-toggle="tooltip"]').tooltip('dispose').tooltip();
        } else {
            $(".request-loader").addClass("show");
            let $this = $(this);
            let url = $this.attr('data-href');
            let qty = $("#detailsQuantity").length > 0 ? $("#detailsQuantity").val() : 1;

            addToCart(url, null, qty, "");
        }
    });
    // ============== add to cart js end =======================//

    //================= cart update js end ==========================//
    $("body").on('click', '.add-to-wish', function (e) {
        e.preventDefault();
        // clear all previously loaded variations  input radio & checkboxes
        $(".variation-label").addClass("d-none");
        $("#variants").html("");
        // load variants  in modal if variations  available for this item
        $(".request-loader").addClass("show");
        let $this = $(this);
        let url = $this.attr('data-href');

        if (typeof url === 'undefined') {
            url = $this.attr('data-url');
        }

        addTowishList(url, $this);
    });

    $('body').on('click', '.remove-wish', function (e) {
        e.preventDefault();
        $(this).addClass('add-to-wish').removeClass('remove-wish active');
        // clear all previously loaded variations  input radio & checkboxes
        $(".variation-label").addClass("d-none");
        $("#variants").html("");
        // load variants  in modal if variations  available for this item
        $(".request-loader").addClass("show");

        let removeItemUrl = $(this).data('removeurl');
        $.get(removeItemUrl, function (res) {
            if (res.status == 'remove_from_wishlist') {
                toastr["error"](res.message);
                wishlistCount();
            }
            $(".request-loader").removeClass("show");
        });
    });

    // ============== variation modal add to cart start =======================//
    $(document).on('click', '.modal-cart-link', function () {
        let totalVariations = $(this).data('total_variations');
        let $voptions = $("input.voptions:checked");
        let variant = {};
        let v_name = ''
        let v_op_name = ''
        let st = 0;
        let stErr = 0;
        let stErrMsg = [];
        if (totalVariations <= $voptions.length) {
            $voptions.each(function () {
                st = parseFloat($(this).data('stock'));
                v_op_name = $(this).data('name');
                v_name = $(this).data('option');
                let $input = $(".modal-quantity input");
                let currval = parseInt($input.val())
                let stock = parseFloat(st);
                if (stock < currval) {
                    stErrMsg.push(v_name + ' : ' + v_op_name + " ; " + stock_unavailable);
                    stErr = 1;
                } else {
                    $input.val(currval);
                    variant[$(this).data('option')] = {
                        'variation_id': $(this).data('variation_id'),
                        'option_id': $(this).data('option_id'),
                        'name': $(this).data('name'),
                        'price': $(this).data('price'),
                        'stock': $(this).data('stock')
                    };
                }
            });
        } else {
            toastr["error"](select_a_variant);
            return;
        }

        if (stErr == 0) {
            let qty = $("input[name='cart-amount']").val();
            let pid = $(this).attr('data-item_id');
            let url = mainurl + "/add-to-cart/" + pid;
            variant = variant;

            addToCart(url, variant, qty);
        } else {
            stErrMsg.forEach(msg => {
                toastr["error"](msg);
            });
        }
    });
    // ============== variation modal add to cart end =======================//
    // ============== modal quantity add / substruct =======================//
    $(document).on("click", ".modal-quantity .plus", function () {
        $voptions = $("input.voptions:checked");
        let $input = $(".modal-quantity input");
        let currval = parseInt($input.val());
        let newval = currval + 1;
        $input.val(newval);
        totalPrice(newval);

    });
    $(document).on("click", ".modal-quantity .minus", function () {
        let $input = $(".modal-quantity input");
        let currval = parseInt($input.val());
        if (currval > 1) {
            let newval = currval - 1;
            $input.val(newval);
            totalPrice(newval);
        }
    });

    // ============== modal quantity add / substruct =======================//
    // ============== variant change js start =======================//
    $(document).on('change', '#variants input', function () {
        totalPrice($("input[name='cart-amount']").val());
    });
    // ============== variant change js end =======================//

    $(document).on('input', "input[name='cart-amount']", function () {
        totalPrice($("input[name='cart-amount']").val());
    });
    //============== addon change js end =======================//

    // ================ cart item remove js start =======================//
    $(document).on('click', '.item-remove', function () {
        $(".request-loader").addClass("show");
        let removeItemUrl = $(this).attr('data-href');
        $.ajax({
            url: removeItemUrl,
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res && res.message == 'remove_from_wishlist') {
                    location.reload();
                    return;
                }
                if (res && res.message) {
                    $("#refreshDiv").load(location.href + " #refreshDiv");
                    $("#refreshButton").load(location.href + " #refreshButton");
                    $("#cartQuantity").load(location.href + " #cartQuantity");
                    $("#cartIconWrapper").load(location.href + " #cartIconWrapper");
                    cartDropdown();
                    toastr["error"](res.message);
                } else {
                    toastr["error"]((res && res.error) ? res.error : (typeof res === 'string' ? res : ''));
                }
                $(".request-loader").removeClass("show");
            },
            error: function (xhr) {
                var msg = (xhr.responseJSON && xhr.responseJSON.error) ? xhr.responseJSON.error : (xhr.statusText || 'Request failed');
                toastr["error"](msg);
                $(".request-loader").removeClass("show");
            }
        });
    });
    // ================ cart item remove js end =======================//

    $('body').on('click', '.addclick', function () {
        let orderamount = $('#detailsQuantity').val();
        $('#order_click_with_qty').val(orderamount);
    });
    $('body').on('click', '.subclick', function () {
        let orderamount = $('#detailsQuantity').val();
        $('#order_click_with_qty').val(orderamount);
    });
}(jQuery));

function addToCompare(url) {
    $(".request-loader").addClass("show");
    let compareUrl = url;
    $.get(compareUrl, function (res) {
        if (res.message) {
            toastr["success"](res.message);
            compareCount();
        } else if (res.warning) {
            toastr["warning"](res.warning);
        } else {
            toastr["error"](res.error);
        }
        $(".request-loader").removeClass("show");
    });
}


let item_id = $('#item_id').val();
let new_price = parseFloat($('#new-price').text());
let detail_new_price = parseFloat($('#details_new-price').text());
var detail_old_price = parseFloat($('#details_old-price').data('old_price'));
let variant = {};
let stErr = 0;
let stErrMsg = [];

var optionsSingle = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    fade: true,
    cssEase: 'linear',
    asNavFor: ".slider-thumbnails",
    rtl: $('html').attr('dir') === 'rtl'
}

var optionsThumb = {
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.product-image-slider',
    dots: false,
    focusOnSelect: true,
    asNavFor: ".product-single-slider",
    prevArrow: '<button type="button" class="btn-icon slider-btn slider-prev"><i class="fal fa-angle-left"></i></button>',
    nextArrow: '<button type="button" class="btn-icon slider-btn slider-next"><i class="fal fa-angle-left"></i></button>',
}

$("body").on('click', '.quick-view-link', function (e) {
    $(".zoomContainer, .zoomWindowContainer").remove();
    $('#quickViewModal').css('opacity', '0');
    $('.request-loader').addClass('show');

    let url = $(this).data('url');
    let slug = $(this).data('slug');

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: url,
        method: 'POST',
        data: { slug: slug },
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            $("#quickViewModalContent").html('');
            $("#quickViewModalContent").append(data);
            new_price = parseFloat($('#new-price').text());
            totalPriceDetails(1);
            $("#quickViewModal").modal('show');

            setTimeout(function () {
                $(".product-single-slider").slick(optionsSingle);
                $(".slider-thumbnails").slick(optionsThumb);

                $(".product-single-slider").on('setPosition afterChange', function (event, slick, currentSlide) {
                    $(".zoomContainer").remove();
                    $(".product-single-slider .slick-active img").elevateZoom({
                        zoomWindowFadeIn: 500,
                        zoomWindowFadeOut: 750,
                        zoomType: "inner",
                        cursor: "crosshair",
                        scrollZoom: false,
                    });
                });

                $('#quickViewModal').modal('show').animate({ opacity: 1 }, 500);
                $('.request-loader').removeClass('show');

                $('[data-bs-toggle="tooltip"]').tooltip('dispose');

                setTimeout(function () {
                    $('[data-bs-toggle="tooltip"]').each(function () {
                        if ($(this).length) {
                            new bootstrap.Tooltip(this);
                        }
                    });
                }, 100);

            }, 500);
        },
        error: function (error) { }
    });
});

$('#quickViewModal').on('hidden.bs.modal', function (e) {
    $.removeData($('.product-single-slider .slick-active img'), 'elevateZoom');
    $('.zoomContainer').remove();
    $('[data-bs-toggle="tooltip"]').tooltip('dispose');
});

$('#quickViewModal').on('shown.bs.modal', function () {
    Object.keys(variant).forEach(key => delete variant[key]);
})

$(document).ready(function () {
    totalPriceDetails(1);
    setTimeout(function () {
        cartDropdown();
    }, 1000);
});

// Helper: get variant parts from input (supports data-* for names with " or :)
function getVariantPartsFromInput($input) {
    var name = $input.data('option-name');
    var price = parseFloat($input.data('price'));
    var stock = parseInt($input.data('stock'), 10);
    var optionId = parseInt($input.data('option-id'), 10);
    var variationId = parseInt($input.data('variation-id'), 10);
    if (name === undefined || isNaN(price)) {
        var v = $input.val().split(":");
        if (v.length >= 5) {
            name = v[0];
            price = parseFloat(v[1]);
            stock = parseFloat(v[2]);
            optionId = parseInt(v[3], 10);
            variationId = parseInt(v[4], 10);
        }
    }
    return { name: name, price: price, stock: stock, option_id: optionId, variation_id: variationId };
}

$('body').on('click', '.product-variant', function () {
    var price = parseFloat($('#details_new-price').attr('data-base_price')) || parseFloat($('#new-price').attr('data-base_price')) || 0;
    if ($('#details_old-price').length > 0) {
        var old_price = $('#details_old-price').attr('data-old_price');
    }
    var quantity = parseInt($("input[name='cart-amount']").val(), 10) || 1;
    let errorCount = 0;
    let errMessage = [];

    var $ul_parent = $('#variantListULDetails');
    var $li_parent = $ul_parent.find('.list-item');
    $li_parent.each(function () {
        var $ul_child = $(this).find('.variantUL');
        var $li_child_input = $ul_child.find('li input:checked');

        $li_child_input.each(function () {
            var parts = getVariantPartsFromInput($(this));
            if (parts.stock < quantity) {
                return false;
            } else {
                price = price + (parts.price || 0);
                if ($('#details_old-price').length > 0) {
                    old_price = parseFloat(old_price) + (parts.price || 0);
                }
            }
        });
    });

    var total_price = price * quantity;
    total_price = total_price.toFixed(2);
    $('#final-price').val(total_price);

    //show total price in as price
    if ($('#new-price').length > 0) {
        $('#new-price').text(total_price);
    }

    //show total old price

    if ($('#details_old-price').length > 0) {
        var total_old_price = old_price * quantity;
        $('#details_old-price').text(total_old_price.toFixed(2));
    }
});


function totalPriceDetails(qty) {
    if ($('#old-price').length > 0) {
        var old_price = parseFloat($('#old-price').attr('data-old_price'));
    }

    qty = qty.toString().length > 0 ? qty : 0;
    var variant_price = [];
    var variant_flag = 0;
    stErr = 0;
    stErrMsg = []

    var $ul_parent = $('#variantListUL');
    var $li_parent = $ul_parent.find('.list-item');

    $li_parent.each(function (i, li) {
        var variant_name = $(this).data('variant_name');
        var $ul_child = $(this).find('.variantUL');
        var $li_child_input = $ul_child.find('li input:checked');

        $li_child_input.each(function (j, li) {
            var selected_variant = $(this).val();
            /*user data-variant_name price to avoid split.*/

            var v = selected_variant.split(":");

            variant[variant_name] = {
                'name': v[0],
                'price': parseFloat(v[1]),
                'stock': parseFloat(v[2]),
                'option_id': parseInt(v[3]),
                'variation_id': parseInt(v[4]),
            };

            variant_price.push(parseFloat(v[1]));
            if (parseFloat(v[2]) < qty) {
                stErrMsg.push(variant_name + ' : ' + v[0] + " ; " + stock_unavailable);
                stErr = 1;
                return false;
            }
            return false;
        });
        variant_flag++;
    });

    var total = new_price;
    for (var i = 0; i < variant_price.length; i++) {
        total += variant_price[i];
        if ($('#old-price').length > 0) {
            old_price += variant_price[i];
        }
    }
    total = total.toFixed(2) * parseInt(qty);
    total = total.toFixed(2);
    $('#final-price').val(total);

    //show total price in as price
    if ($('#new-price').length > 0) {
        $('#new-price').text(total);
    }

    //show total old price
    if ($('#old-price').length > 0) {
        var total_old_price = old_price * parseInt(qty);
        $('#old-price').text('');
        $('#old-price').text(total_old_price.toFixed(2));
    }

    return total;
}

function addToCartDetails() {
    $(".request-loader").addClass("show");
    let $input = $(".item_quantity input");
    let qty = parseInt($input.val());
    let item_id = $('#item_id').val();
    let url = mainurl + "/add-to-cart/" + item_id;
    let final_price = totalPriceDetails(qty);

    if (stErr > 0) {
        stErrMsg.forEach(msg => {
            toastr["error"](msg);
        });
        $(".request-loader").removeClass("show");
    } else {
        let cartUrl = url;

        $.get(cartUrl + ',,,' + qty + ',,,' + final_price + ',,,' + JSON.stringify(variant), function (res) {
            if (res.message) {
                toastr["success"](res.message);
                $("#cartQuantity").load(location.href + " #cartQuantity");
                $("#quickViewModal").modal('hide');
                $("#variationModal").modal('hide');
                $("#cartIconWrapper").load(location.href + " #cartIconWrapper>*", "");
                cartDropdown();
            } else {
                toastr["error"](res.error);
            }
            $(".request-loader").removeClass("show");
        });
    }
}

//for product detail page
function addToCartDetails2() {
    $(".request-loader").addClass("show");

    // CRITICAL FIX: Initialize detail_new_price from DOM inside function
    // This ensures the value is always fresh and not undefined
    let detail_new_price_element = $('#details_new-price');
    if (detail_new_price_element.length > 0) {
        detail_new_price = parseFloat(detail_new_price_element.attr('data-base_price')) || parseFloat(detail_new_price_element.text()) || 0;
    } else {
        console.error('Add to Cart Error: #details_new-price element not found');
        toastr["error"]("حدث خطأ في تحميل السعر. يرجى تحديث الصفحة.");
        $(".request-loader").removeClass("show");
        return;
    }

    let $input = $(".item_quantity_details input");
    let qty = parseInt($input.val()) || 1;
    let item_id = $('#details_item_id').val();

    if (!item_id) {
        console.error('Add to Cart Error: item_id not found');
        toastr["error"]("حدث خطأ. يرجى تحديث الصفحة.");
        $(".request-loader").removeClass("show");
        return;
    }

    let url = mainurl + "/add-to-cart/" + item_id;
    let final_price = totalPriceDetails2(qty);

    // Validate final_price is a valid number
    if (isNaN(final_price) || final_price <= 0) {
        console.error('Add to Cart Error: Invalid final_price', final_price);
        toastr["error"]("حدث خطأ في حساب السعر. يرجى تحديث الصفحة.");
        $(".request-loader").removeClass("show");
        return;
    }

    if (stErr > 0) {
        stErrMsg.forEach(msg => {
            toastr["error"](msg);
        });
        $(".request-loader").removeClass("show");
    } else {
        let cartUrl = url;

        $.get(cartUrl + ',,,' + qty + ',,,' + final_price + ',,,' + JSON.stringify(variant), function (res) {
            if (res.message) {
                toastr["success"](res.message);
                $("#cartQuantity").load(location.href + " #cartQuantity");
                $("#quickViewModal").modal('hide');
                $("#variationModal").modal('hide');
                $("#cartIconWrapper").load(location.href + " #cartIconWrapper>*", "");
                cartDropdown();
            } else {
                toastr["error"](res.error);
            }
            $(".request-loader").removeClass("show");
        }).fail(function (xhr, status, error) {
            console.error('Add to Cart AJAX Error:', error, xhr.responseText);
            toastr["error"]("حدث خطأ أثناء إضافة المنتج للسلة. يرجى المحاولة مرة أخرى.");
            $(".request-loader").removeClass("show");
        });
    }
}

$(document).on("click", ".item_quantity .plus", function () {
    let $input = $(".item_quantity input");
    let currval = parseInt($input.val());
    let newval = currval + 1;
    $input.val(newval);
    totalPriceDetails(newval);

});
$(document).on("click", ".item_quantity .minus", function () {
    let $input = $(".item_quantity input");
    let currval = parseInt($input.val());
    if (currval > 1) {
        let newval = currval - 1;
        $input.val(newval);
        totalPriceDetails(newval);
    }
});

$(document).on("click", $("input[type=radio]"), function () {
    let $input = $(".item_quantity input");
    let currval = parseInt($input.val());
    totalPriceDetails(currval);
});


/*************************************
 * for product details
 */
$(document).on("click", ".item_quantity_details .plus", function () {
    let $input = $(".item_quantity_details input");
    let currval = parseInt($input.val());
    let newval = currval + 1;
    $input.val(newval);
    totalPriceDetails2(newval);

});


$(document).on("click", ".item_quantity_details .minus", function () {
    let $input = $(".item_quantity_details input");
    let currval = parseInt($input.val());
    if (currval > 1) {
        let newval = currval - 1;
        $input.val(newval);
        totalPriceDetails2(newval);
    }
});

//function for product details page
function totalPriceDetails2(qty) {
    // CRITICAL FIX: Read prices from DOM elements instead of global variables
    // This prevents undefined/NaN errors
    var detail_new_price_element = $('#details_new-price');
    var detail_old_price_element = $('#details_old-price');

    // Get base price from data attribute or text content
    var current_detail_new_price = 0;
    if (detail_new_price_element.length > 0) {
        current_detail_new_price = parseFloat(detail_new_price_element.attr('data-base_price')) || parseFloat(detail_new_price_element.text()) || 0;
    }

    var current_detail_old_price = 0;
    if (detail_old_price_element.length > 0) {
        current_detail_old_price = parseFloat(detail_old_price_element.attr('data-old_price')) || 0;
    }

    var previous_price = 0;
    qty = qty.toString().length > 0 ? qty : 0;
    var variant_price = [];
    var variant_flag = 0;
    stErr = 0;
    stErrMsg = []

    var $ul_parent = $('#variantListULDetails');
    var $li_parent = $ul_parent.find('.list-item');

    $li_parent.each(function (i, li) {
        var variant_name = $(this).data('variant_name');
        var $ul_child = $(this).find('.variantUL');
        var $li_child_input = $ul_child.find('li input:checked');

        $li_child_input.each(function (j, li) {
            var parts = getVariantPartsFromInput($(this));
            variant[variant_name] = {
                'name': parts.name,
                'price': parts.price,
                'stock': parts.stock,
                'option_id': parts.option_id,
                'variation_id': parts.variation_id,
            };
            variant_price.push(parts.price || 0);
            if ((parts.stock || 0) < qty) {
                stErrMsg.push(variant_name + ' : ' + (parts.name || '') + " ; " + stock_unavailable);
                stErr = 1;
                return false;
            }
            return false;
        });
        variant_flag++;
    });

    var total = current_detail_new_price;
    var old_total = current_detail_old_price;
    for (var i = 0; i < variant_price.length; i++) {
        total += variant_price[i];
        old_total += variant_price[i];
    }
    total = total.toFixed(2) * parseInt(qty);
    total = total.toFixed(2);
    $('#details_final-price').val(total);

    //show total price in as price
    if ($('#details_new-price').length > 0) {
        $('#details_new-price').text(total);
    }

    //show total old price
    if ($('#details_old-price').length > 0) {
        var total_old_price = old_total * parseInt(qty);

        $('#details_old-price').text(total_old_price.toFixed(2));
    }

    return total;
}


$(document).on("click", $("input[type=radio]"), function () {
    let $input = $(".item_quantity_details input");
    let currval = parseInt($input.val());
    totalPriceDetails2(currval);
});
/*************************************
 * for product details end
 *************************************/

function cartDropdown() {
    let route = mainurl + '/cart/dropdown';
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: route,
        method: 'GET',
        success: function (data) {
            cartDropdownCount();
            $("#cart-dropdown-header").html('');
            $("#cart-dropdown-header").append(data);

        },
        error: function (error) {
        }
    });


}


function cartDropdownCount() {
    var route = mainurl + '/cart/dropdown/count';
    var token = (typeof $ !== 'undefined' && $('meta[name="csrf-token"]').length) ? $('meta[name="csrf-token"]').attr('content') : '';
    $.ajax({
        url: route,
        method: 'POST',
        headers: token ? { 'X-CSRF-TOKEN': token } : {},
        data: token ? { _token: token } : {},
        success: function (data) {
            $(".cart-dropdown-count").text(data);
        },
        error: function (xhr) {
            if (xhr.status === 419) {
                // Session/CSRF expired — optionally reload to refresh token
                if (typeof window.__cartDropdownCountReload !== 'undefined' && window.__cartDropdownCountReload) {
                    window.location.reload();
                }
            }
        }
    });
}


function compareCount() {
    let route = mainurl + '/compare/count';
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: route,
        method: 'POST',
        success: function (data) {
            $("#compare-count").text(data);
        },
        error: function (error) {
        }
    });
}

function wishlistCount() {
    let route = mainurl + '/wishlist/count';
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: route,
        method: 'POST',
        success: function (data) {
            $(".wishlist-count").text(data);
        },
        error: function (error) {
        }
    });
}


function currency_changer(value, item_id) {

    var result = 0;
    $.get(mainurl + '/item-variation-converter/' + value + '/' + item_id, function (data) {
        result = parseFloat(data);
    });
    return result;
}

function cccc(value) {
    return value;
}

/* *************************************
 * Cart page start
 * *************************************/
$(document).on('click', '.shopping-area .shopping-table .quantity-down', function () {
    // Find the input field in the same container
    let $input = $(this).siblings('input.cart_qty');
    let currval = parseInt($input.val());

    // Decrease the quantity if it's greater than 1
    if (currval > 1) {
        let newval = currval - 1;
        $input.val(newval);
        var url = $("#cartUpdate").attr('data-href');
        updateQuantity(url);
    }
});

$(document).on('click', '.shopping-area .shopping-table .quantity-up', function () {
    let $input = $(this).siblings('input.cart_qty');
    let currval = parseInt($input.val());
    let newval = currval + 1;
    $input.val(newval);
    var url = $("#cartUpdate").attr('data-href');
    updateQuantity(url);
});

//=============== cart update js start ==========================//
$(document).on('click', '#cartUpdate', function (e) {
    e.preventDefault();
    $('.request-loader').addClass('show');
    let cartqty = [];
    let cartUpdateUrl = $(this).attr('data-href');
    $(".cart_qty").each(function () {
        cartqty.push($(this).val());
    })
    let formData = new FormData();
    let i = 0;
    for (i = 0; i < cartqty.length; i++) {
        formData.append('qty[]', cartqty[i]);
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: cartUpdateUrl,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            $(".request-loader").removeClass("show");
            if (data.message) {
                $("#refreshDiv").load(location.href + " #refreshDiv");
                $("#cartQuantity").load(location.href + " #cartQuantity");
                $("#cartIconWrapper").load(location.href + " #cartIconWrapper");
                toastr["success"](data.message);
            } else {
                $("#refreshDiv").load(location.href + " #refreshDiv");
                $("#cartQuantity").load(location.href + " #cartQuantity");
                $("#cartIconWrapper").load(location.href + " #cartIconWrapper");
                data.forEach(msg => {
                    toastr["error"](msg);
                });
            }
            $('.request-loader').removeClass('show');
        }
    });
})

$(document).on('blur', '.cart_qty', function () {
    var url = $("#cartUpdate").attr('data-href');
    updateQuantity(url);
})

function updateQuantity(url) {
    let cartqty = [];
    let cartUpdateUrl = url;
    $(".cart_qty").each(function () {
        cartqty.push($(this).val());
    })
    let formData = new FormData();
    let i = 0;
    for (i = 0; i < cartqty.length; i++) {
        formData.append('qty[]', cartqty[i]);
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: cartUpdateUrl,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.message) {
                $("#refreshDiv").load(location.href + " #refreshDiv");
                $("#cartQuantity").load(location.href + " #cartQuantity");
                $("#cartIconWrapper").load(location.href + " #cartIconWrapper");
            } else {
                $("#refreshDiv").load(location.href + " #refreshDiv");
                $("#cartQuantity").load(location.href + " #cartQuantity");
                $("#cartIconWrapper").load(location.href + " #cartIconWrapper");
                data.forEach(msg => {
                    toastr["error"](msg);
                });
            }
        }
    });
}

/* *************************************
 * Cart page end
 * *************************************/
