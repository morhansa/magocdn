// ========================================
// MODERN VARIATION SELECTOR - INTERACTIONS
// ========================================

$(document).ready(function () {
    // Handle variation card selection
    $(document).on('click', '.variation-option-card:not(.out-of-stock)', function (e) {
        // Prevent default label behavior
        e.preventDefault();

        const $card = $(this);
        const $radio = $card.find('input[type="radio"]');

        // Don't do anything if already selected
        if ($card.hasClass('selected')) {
            return;
        }

        // Remove selected class from ALL cards in this variation group
        $card.closest('.variation-options-grid')
            .find('.variation-option-card')
            .removeClass('selected');

        // Add selected class to clicked card
        $card.addClass('selected');

        // Uncheck all radio buttons in this group first
        const radioName = $radio.attr('name');
        $('input[name="' + radioName + '"]').prop('checked', false);

        // Check THIS specific radio button
        $radio.prop('checked', true);

        // Trigger change event for price calculation
        $radio.trigger('change');

        // CRITICAL: Trigger the price calculation function
        // Get current quantity
        const qty = parseInt($('.item_quantity_details input').val()) || 1;

        // Use totalPriceModernVariations for the new variation structure
        if (typeof totalPriceModernVariations === 'function') {
            totalPriceModernVariations(qty);
        } else if (typeof totalPriceDetails2 === 'function') {
            totalPriceDetails2(qty);
        } else if (typeof totalPriceDetails === 'function') {
            totalPriceDetails(qty);
        }
    });

    // Prevent click on out-of-stock cards
    $(document).on('click', '.variation-option-card.out-of-stock', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // Handle radio button change (for keyboard navigation)
    $(document).on('change', '.product-variant.input-radio', function () {
        const $radio = $(this);
        const $card = $radio.closest('.variation-option-card');

        // Remove selected from all cards in this group
        $card.closest('.variation-options-grid')
            .find('.variation-option-card')
            .removeClass('selected');

        // Add selected to this card
        $card.addClass('selected');
    });

    // Auto-select first available option if none selected
    $('.variation-group-modern').each(function () {
        const $group = $(this);
        const $selectedCard = $group.find('.variation-option-card.selected');

        if ($selectedCard.length === 0) {
            const $firstAvailable = $group.find('.variation-option-card:not(.out-of-stock)').first();
            if ($firstAvailable.length) {
                $firstAvailable.click();
            }
        }
    });
});
