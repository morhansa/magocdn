// ========================================
// MODERN VARIATIONS - PRICE CALCULATION
// ========================================

/**
 * Calculate total price for modern variation structure
 * Works with .variation-group-modern and .variation-option-card
 */
function totalPriceModernVariations(qty) {
    console.log('=== totalPriceModernVariations called ===', { qty: qty });

    // Get base price from DOM - try both old and new selectors
    var current_detail_new_price = 0;

    // Try #new-price first (original)
    if ($('#new-price').length > 0) {
        current_detail_new_price = parseFloat($('#new-price').attr('data-base_price')) ||
            parseFloat($('#new-price').text()) || 0;
        console.log('Found #new-price:', current_detail_new_price);
    }
    // Fallback to #details_new-price
    else if ($('#details_new-price').length > 0) {
        current_detail_new_price = parseFloat($('#details_new-price').attr('data-base_price')) ||
            parseFloat($('#details_new-price').text()) || 0;
        console.log('Found #details_new-price:', current_detail_new_price);
    }

    var current_detail_old_price = 0;
    // Try #old-price first (original)
    if ($('#old-price').length > 0) {
        current_detail_old_price = parseFloat($('#old-price').attr('data-old_price')) || 0;
    }
    // Fallback to #details_old-price
    else if ($('#details_old-price').length > 0) {
        current_detail_old_price = parseFloat($('#details_old-price').attr('data-old_price')) || 0;
    }

    // Initialize
    qty = parseInt(qty) || 1;
    var variant_price = [];
    var variant = {};

    // Get all variation groups
    var $variation_groups = $('.variation-group-modern');
    console.log('Found variation groups:', $variation_groups.length);

    $variation_groups.each(function (i, group) {
        var variant_name = $(this).data('variant_name');
        var $selected_card = $(this).find('.variation-option-card.selected');

        console.log('Group', i, ':', {
            variant_name: variant_name,
            selected_cards: $selected_card.length
        });

        if ($selected_card.length > 0) {
            var $radio = $selected_card.find('input[type="radio"]:checked');

            console.log('Selected card radio:', {
                radio_found: $radio.length,
                radio_value: $radio.val()
            });

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
                console.log('Added variant price:', parseFloat(v[1]));
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

    console.log('Final calculation:', {
        base_price: current_detail_new_price,
        variant_prices: variant_price,
        qty: qty,
        total: total
    });

    // Update DOM - use BOTH old and new selectors
    // Update #final-price (original)
    if ($('#final-price').length > 0) {
        $('#final-price').val(total);
        console.log('Updated #final-price');
    }
    // Update #details_final-price (new)
    if ($('#details_final-price').length > 0) {
        $('#details_final-price').val(total);
        console.log('Updated #details_final-price');
    }

    // Update new price display - use BOTH selectors
    if ($('#new-price').length > 0) {
        $('#new-price').text(total);
        console.log('Updated #new-price text');
    }
    if ($('#details_new-price').length > 0) {
        $('#details_new-price').text(total);
        console.log('Updated #details_new-price text');
    }

    // Update old price display - use BOTH selectors
    if ($('#old-price').length > 0) {
        var total_old_price = (old_total * qty).toFixed(2);
        $('#old-price').text(total_old_price);
    }
    if ($('#details_old-price').length > 0) {
        var total_old_price = (old_total * qty).toFixed(2);
        $('#details_old-price').text(total_old_price);
    }

    console.log('=== totalPriceModernVariations complete ===');
    return total;
}

// Export to window for global access
window.totalPriceModernVariations = totalPriceModernVariations;
