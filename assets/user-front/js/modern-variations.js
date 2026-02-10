// ========================================
// MODERN VARIATION SELECTOR - INTERACTIONS
// ========================================

$(document).ready(function () {
    console.log('=== Modern Variations JS Loaded ===');
    console.log('Variation groups found:', $('.variation-group-modern').length);
    console.log('Variation cards found:', $('.variation-option-card').length);

    // Handle variation card selection
    $(document).on('click', '.variation-option-card:not(.out-of-stock)', function (e) {
        console.log('=== Variation card clicked ===');

        // Prevent default label behavior
        e.preventDefault();

        const $card = $(this);
        const $radio = $card.find('input[type="radio"]');

        console.log('Card clicked:', {
            card_html: $card.html().substring(0, 100),
            radio_found: $radio.length,
            radio_name: $radio.attr('name'),
            radio_value: $radio.val()
        });

        // Don't do anything if already selected
        if ($card.hasClass('selected')) {
            console.log('Card already selected, ignoring');
            return;
        }

        // Remove selected class from ALL cards in this variation group
        $card.closest('.variation-options-grid')
            .find('.variation-option-card')
            .removeClass('selected');

        // Add selected class to clicked card
        $card.addClass('selected');
        console.log('Added selected class to card');

        // Uncheck all radio buttons in this group first
        const radioName = $radio.attr('name');
        $('input[name="' + radioName + '"]').prop('checked', false);

        // Check THIS specific radio button
        $radio.prop('checked', true);
        console.log('Radio button checked:', $radio.is(':checked'));

        // Trigger change event for price calculation
        $radio.trigger('change');

        // CRITICAL: Trigger the price calculation function
        // Get current quantity
        const qty = parseInt($('.item_quantity_details input').val()) || 1;
        console.log('Quantity:', qty);

        // Use totalPriceModernVariations for the new variation structure
        if (typeof totalPriceModernVariations === 'function') {
            console.log('Calling totalPriceModernVariations...');
            totalPriceModernVariations(qty);
        } else if (typeof totalPriceDetails2 === 'function') {
            console.log('Calling totalPriceDetails2...');
            totalPriceDetails2(qty);
        } else if (typeof totalPriceDetails === 'function') {
            console.log('Calling totalPriceDetails...');
            totalPriceDetails(qty);
        } else {
            console.error('No price calculation function found!');
        }
    });

    // Prevent click on out-of-stock cards
    $(document).on('click', '.variation-option-card.out-of-stock', function (e) {
        console.log('Out of stock card clicked - prevented');
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // Handle radio button change (for keyboard navigation)
    $(document).on('change', '.product-variant.input-radio', function () {
        console.log('=== Radio button changed via keyboard ===');
        const $radio = $(this);
        const $card = $radio.closest('.variation-option-card');

        // Remove selected from all cards in this group
        $card.closest('.variation-options-grid')
            .find('.variation-option-card')
            .removeClass('selected');

        // Add selected to this card
        $card.addClass('selected');
        console.log('Updated selected class via keyboard');
    });

    // Auto-select first available option if none selected
    console.log('=== Auto-selecting first options ===');
    $('.variation-group-modern').each(function () {
        const $group = $(this);
        const $selectedCard = $group.find('.variation-option-card.selected');

        console.log('Group:', {
            variant_name: $group.data('variant_name'),
            has_selected: $selectedCard.length > 0
        });

        if ($selectedCard.length === 0) {
            const $firstAvailable = $group.find('.variation-option-card:not(.out-of-stock)').first();
            if ($firstAvailable.length) {
                console.log('Auto-selecting first available option');
                $firstAvailable.click();
            }
        }
    });

    console.log('=== Modern Variations JS Ready ===');
});
