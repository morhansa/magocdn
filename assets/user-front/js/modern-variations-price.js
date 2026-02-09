// ========================================
// MODERN VARIATIONS - PRICE CALCULATION
// ========================================

/**
 * Calculate total price for modern variation structure
 * Works with .variation-group-modern and .variation-option-card
 */
function totalPriceModernVariations(qty) {
    // Get base price from DOM
    var detail_new_price_element = $('#details_new-price');
    var detail_old_price_element = $('#details_old-price');

    // Get base price
    var current_detail_new_price = 0;
    if (detail_new_price_element.length > 0) {
        current_detail_new_price = parseFloat(detail_new_price_element.attr('data-base_price')) ||
            parseFloat(detail_new_price_element.text()) || 0;
    }

    var current_detail_old_price = 0;
    if (detail_old_price_element.length > 0) {
        current_detail_old_price = parseFloat(detail_old_price_element.attr('data-old_price')) || 0;
    }

    // Initialize
    qty = parseInt(qty) || 1;
    var variant_price = [];
    var variant = {};

    // Get all variation groups
    var $variation_groups = $('.variation-group-modern');

    $variation_groups.each(function (i, group) {
        var variant_name = $(this).data('variant_name');
        var $selected_card = $(this).find('.variation-option-card.selected');

        if ($selected_card.length > 0) {
            var $radio = $selected_card.find('input[type="radio"]:checked');

            if ($radio.length > 0) {
                var selected_variant = $radio.val();

                // Parse value: "name:price:stock:option_id:variation_id"
                var v = selected_variant.split(":");

                variant[variant_name] = {
                    'name': v[0],
                    'price': parseFloat(v[1]),
                    'stock': parseFloat(v[2]),
                    'option_id': parseInt(v[3]),
                    'variation_id': parseInt(v[4]),
                };

                variant_price.push(parseFloat(v[1]));
            }
        }
    });

    // Calculate total
    var total = current_detail_new_price;
    var old_total = current_detail_old_price;

    for (var i = 0; i < variant_price.length; i++) {
        total += variant_price[i];
        old_total += variant_price[i];
    }

    total = (total * qty).toFixed(2);

    // Update DOM
    $('#details_final-price').val(total);

    // Update new price
    if ($('#details_new-price').length > 0) {
        $('#details_new-price').text(total);
    }

    // Update old price
    if ($('#details_old-price').length > 0) {
        var total_old_price = (old_total * qty).toFixed(2);
        $('#details_old-price').text(total_old_price);
    }

    return total;
}

// Export to window for global access
window.totalPriceModernVariations = totalPriceModernVariations;
