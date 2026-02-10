// ========================================
// MODERN VARIATION PRICE CALCULATOR 2
// ========================================

/**
 * Calculate total price for modern variations
 * @param {number} quantity - Product quantity
 */
function totalPriceModernVariations(quantity) {
    console.log('=== totalPriceModernVariations called ===');
    console.log('Quantity:', quantity);

    // Get base price from data attribute
    const basePriceElement = document.getElementById('details_new-price');
    if (!basePriceElement) {
        console.error('Base price element not found!');
        return;
    }

    const basePrice = parseFloat(basePriceElement.getAttribute('data-base_price')) || 0;
    console.log('Base price:', basePrice);

    // Get old price for discount calculation
    const oldPriceElement = document.getElementById('details_old-price');
    const oldPrice = oldPriceElement ? parseFloat(oldPriceElement.getAttribute('data-old_price')) || 0 : 0;
    console.log('Old price:', oldPrice);

    // Calculate total variation price from all selected options
    let totalVariationPrice = 0;
    const selectedVariations = [];

    // Find all checked radio buttons in modern variations
    const checkedRadios = document.querySelectorAll('.product-variant.input-radio:checked');
    console.log('Checked radios found:', checkedRadios.length);

    checkedRadios.forEach(function(radio) {
        const value = radio.value; // Format: "name:price:stock:id:variant_id"
        console.log('Radio value:', value);

        if (value) {
            const parts = value.split(':');
            if (parts.length >= 2) {
                const varPrice = parseFloat(parts[1]) || 0;
                totalVariationPrice += varPrice;
                selectedVariations.push({
                    name: parts[0],
                    price: varPrice,
                    stock: parts[2],
                    id: parts[3]
                });
                console.log('Added variation price:', varPrice);
            }
        }
    });

    console.log('Total variation price:', totalVariationPrice);
    console.log('Selected variations:', selectedVariations);

    // Calculate final price
    const finalPrice = (basePrice + totalVariationPrice) * quantity;
    console.log('Final price:', finalPrice);

    // Calculate final old price if discount exists
    let finalOldPrice = 0;
    if (oldPrice > 0) {
        const oldVariationPrice = (oldPrice > basePrice) ? (oldPrice - basePrice) : 0;
        finalOldPrice = (oldPrice + totalVariationPrice) * quantity;
        console.log('Final old price:', finalOldPrice);
    }

    // Update displayed prices
    updateDisplayedPrice('details_new-price', finalPrice);
    
    if (oldPrice > 0 && finalOldPrice > finalPrice) {
        updateDisplayedPrice('details_old-price', finalOldPrice);
        // Show old price container
        const oldPriceArea = document.querySelector('.old-price-area');
        if (oldPriceArea) {
            oldPriceArea.style.display = 'flex';
        }
        
        // Update discount percentage
        const discountPercent = Math.round(((finalOldPrice - finalPrice) / finalOldPrice) * 100);
        const discountElements = document.querySelectorAll('.discountoff, .percentage-text span');
        discountElements.forEach(function(el) {
            if (el.classList.contains('percentage-text')) {
                el.querySelector('span').textContent = discountPercent + '%';
            } else {
                el.textContent = discountPercent + '% خصم';
            }
        });
    }

    // Update hidden final price input
    const finalPriceInput = document.getElementById('details_final-price');
    if (finalPriceInput) {
        finalPriceInput.value = finalPrice.toFixed(2);
        console.log('Updated hidden final price input:', finalPrice.toFixed(2));
    }

    // Update stock availability
    updateStockAvailability(selectedVariations);

    console.log('=== Price calculation complete ===');
}

/**
 * Update displayed price element
 * @param {string} elementId - Element ID
 * @param {number} price - Price to display
 */
function updateDisplayedPrice(elementId, price) {
    const element = document.getElementById(elementId);
    if (element) {
        // Format price with 2 decimal places
        element.textContent = price.toFixed(2);
        console.log('Updated', elementId, 'to:', price.toFixed(2));
    }
}

/**
 * Update stock availability based on selected variations
 * @param {Array} selectedVariations - Array of selected variation objects
 */
function updateStockAvailability(selectedVariations) {
    if (selectedVariations.length === 0) {
        return;
    }

    // Find minimum stock from all selected variations
    let minStock = Infinity;
    selectedVariations.forEach(function(variation) {
        const stock = parseInt(variation.stock) || 0;
        if (stock < minStock) {
            minStock = stock;
        }
    });

    console.log('Minimum stock available:', minStock);

    // Update stock status
    const stockStatus = document.querySelector('.stock-status');
    if (stockStatus) {
        const badge = stockStatus.querySelector('.badge');
        if (badge) {
            if (minStock > 0) {
                badge.className = 'badge bg-success';
                badge.innerHTML = '<i class="fa fa-check"></i> متوفر';
            } else {
                badge.className = 'badge bg-danger';
                badge.innerHTML = '<i class="fa fa-times"></i> غير متوفر';
            }
        }
    }

    // Update quantity input max
    const qtyInput = document.querySelector('.item_quantity_details input[type="number"]');
    if (qtyInput && minStock > 0) {
        qtyInput.setAttribute('max', minStock);
        // Reset quantity if current value exceeds stock
        if (parseInt(qtyInput.value) > minStock) {
            qtyInput.value = minStock;
        }
    }
}

/**
 * Legacy function for backward compatibility
 */
function totalPriceDetails2(quantity) {
    console.log('totalPriceDetails2 called - redirecting to totalPriceModernVariations');
    totalPriceModernVariations(quantity);
}

/**
 * Legacy function for backward compatibility
 */
function totalPriceDetails(quantity) {
    console.log('totalPriceDetails called - redirecting to totalPriceModernVariations');
    totalPriceModernVariations(quantity);
}

// Initialize on DOM ready
$(document).ready(function() {
    console.log('=== Modern Variations Price Calculator Ready ===');
    
    // Listen for quantity changes
    $(document).on('change', '.item_quantity_details input[type="number"]', function() {
        const qty = parseInt($(this).val()) || 1;
        console.log('Quantity changed to:', qty);
        totalPriceModernVariations(qty);
    });

    // Listen for +/- buttons
    $(document).on('click', '.quantity-btn', function() {
        setTimeout(function() {
            const qty = parseInt($('.item_quantity_details input[type="number"]').val()) || 1;
            console.log('Quantity button clicked, new qty:', qty);
            totalPriceModernVariations(qty);
        }, 100);
    });
});
