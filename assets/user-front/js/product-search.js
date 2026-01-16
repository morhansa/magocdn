'use strict';

function clickSubmit(type = null) {
    $('#show-products').html('');
    $('#skeleton-loader').removeClass('d-none');

    var formData = $('#filtersForm').serialize();
    $.ajax({
        url: $('#filtersForm').attr('action'),
        type: 'GET',
        data: formData,
        success: function (result) {
            if (type != null) {
                location.reload();
            } else {
                $('#skeleton-loader').addClass('d-none');
                $('#show-products').html(result);
                var tooltipTriggerList = [].slice.call($('[data-bs-toggle="tooltip"]'))
                tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl)
                })
            }
        },
        error: function (xhr, status, error) {
        }
    });
}

function clickSubmitVariation() {
    var frm = $('#filtersForm');

    var data = {
        'variations': {}
    };
    var variation = [];
    var flag = 0;

    $("input.variation-check:checked").each(function () {
        let val = $(this).val();
        let prop = $(this).data('variation_name');
        if (!data['variations'].hasOwnProperty(prop)) {
            Object.assign(data['variations'], {
                [prop]: []
            });
        }
        data['variations'][prop].push(val);
    });

    $("#filtersForm input").each(function (index) {

        if ($(this).data('type') === 'variation') {

        } else {
            data[$(this).attr('name')] = $(this).val();
        }
    })
    $('#page').val('');
    clickSubmit();

}


// search product by category
$('body').on('click', '.category', function (e) {
    e.preventDefault();

    $('#filtersForm input').val('');
    var slug = $(this).data('slug');
    $('#categories .list-dropdown').removeClass('open');
    if (slug) {
        var targetCategory = $('#categories .category').filter(function () {
            return $(this).data('slug') === slug;
        });
        targetCategory.closest('.list-dropdown').addClass('open');
    }
    if (typeof (slug) == 'undefined') {
        $('#category').val('');
        $('#categories .list-dropdown:first').addClass('open');
    }
    $('#subcategory').val('');
    $('#category').val(slug);
    $('#selected-variants').val('');
    $("#rating_div").load(location.href + " #rating_div > *");
    $("#on_sale_div").load(location.href + " #on_sale_div > *");
    $('#page').val('');
    getVariation(slug);
    clickSubmit();

    setTimeout(function () {
        $(window).scrollTop(200);
    }, 500);
});

// search product by subcategory
$('body').on('click', '.subcategory', function (e) {
    e.preventDefault();

    var category_slug = $('#category').val();
    var subcategory_slug = $(this).data('slug');

    $('.subcategory').removeClass('active');
    $(this).addClass('active');

    $('#subcategory').val(subcategory_slug);
    $('#selected-variants').val('');
    $("#rating_div").load(location.href + " #rating_div > *");
    $("#on_sale_div").load(location.href + " #on_sale_div > *");
    $('#page').val('');

    getVariation(category_slug, subcategory_slug);
    clickSubmit();
});

function getVariation(category, subcategory) {
    $('#show-variant').html('');
    var data = {
        category: category,
        subcategory: subcategory,
    }
    $.get(variation_search_url, data, function (result) {
        $('#show-variant').html(result);
    })
}

$('body').on('click', '.view-type', function (e) {
    e.preventDefault();
    $('.view-type').removeClass('active');
    $(this).addClass('active');
    var type = $(this).data('view-type');

    $('#view-type').val(type);
    clickSubmit(type);
});


$("body").on("click", '.produt_ratings', function () {
    var rating = $(this).val();
    $('#selected-ratings').val(rating);
    $('#page').val('');
    clickSubmit();
});

$("body").on("click", '.product_on_sale', function () {
    var on_sale = $(this).val();
    $('#on-sale-id').val(on_sale);
    $('#page').val('');
    clickSubmit();
});

$("body").on("change", '.variants-input', function () {
    // Get all checked checkboxes
    var checkedValues = $('.variants-input:checked').map(function () {
        return $(this).val();
    }).get();

    var jsonVariantOption = JSON.stringify(checkedValues);
    $('#selected-variants').val(jsonVariantOption);
    $('#page').val('');
    clickSubmit();
});


$('#search-input').on('keypress', function (e) {
    if (e.which === 13) {
        let value = $('#search-input').val();
        $('#keyword-id').val(value);
        $('#page').val('');
        clickSubmit();
    }
});


// search course by sorting
$('#sort-type').on('change', function () {
    let value = $(this).val();
    $('#sort-id').val(value);
    clickSubmit();
});

$('body').on('click', '#show-products .page-item', function (e) {
    e.preventDefault();
    var page_url = $(this).find('.page-link').attr('href');
    if (typeof page_url !== 'undefined') {
        var url = new URL(page_url, window.location.origin);
        var page_number = url.searchParams.get('page');
        $('#page').val(page_number);
        clickSubmit();

        setTimeout(function () {
            $(window).scrollTop(200);
        }, 500);
    }
});



var t = document.getElementById("priceSlider");
null != t && (noUiSlider.create(t, {
    start: [curr_min, curr_max],
    connect: !0,
    step: 1,
    margin: 10,
    range: {
        min: min_price,
        max: max_price
    }
}), t.noUiSlider.on("update", function (t, i) {
    $("#filter-price-range").text(symbol + t.join(" - " + symbol))
}),
    t.noUiSlider.on("change", function (t, i) {
        let filterPrice = t;
        let minCost = parseFloat(filterPrice[0]);
        let maxCost = parseFloat(filterPrice[1]);

        $('#min-id').val(minCost);
        $('#max-id').val(maxCost);
        $('#page').val('');
        clickSubmit();
    })
)
