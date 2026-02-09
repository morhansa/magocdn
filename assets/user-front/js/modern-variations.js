// ========================================
// MODERN VARIATION SELECTOR - INTERACTIONS
// ========================================

$(document).ready(function () {
    // Handle variation card selection
    $(document).on('click', '.variation-option-card:not(.out-of-stock)', function () {
        const $card = $(this);
        const $radio = $card.find('input[type="radio"]');

        // Remove selected class from siblings
        $card.closest('.variation-options-grid')
            .find('.variation-option-card')
            .removeClass('selected');

        // Add selected class to clicked card
        $card.addClass('selected');

        // Check the radio button
        $radio.prop('checked', true);

        // Trigger change event for price calculation
        $radio.trigger('change');
    });

    // Prevent click on out-of-stock cards
    $(document).on('click', '.variation-option-card.out-of-stock', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
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
