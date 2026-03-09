'use strict';

// [IMPROVED] Initialize Stripe in global scope (needed for form submission handler)
var stripe, cardElement;
if (typeof stripe_key !== 'undefined' && stripe_key) {
    try {
        // Set your Stripe public key
        stripe = Stripe(stripe_key);
        // Create a Stripe Element for the card field
        var elements = stripe.elements();
        cardElement = elements.create('card', {
            style: {
                base: {
                    iconColor: '#454545',
                    color: '#454545',
                    fontWeight: '500',
                    lineHeight: '50px',
                    fontSmoothing: 'antialiased',
                    backgroundColor: '#f2f2f2',
                    ':-webkit-autofill': {
                        color: '#454545',
                    },
                    '::placeholder': {
                        color: '#454545',
                    },
                }
            },
        });

        // [IMPROVED] Mount Stripe element only when DOM is ready
        $(document).ready(function() {
            if ($('#stripe-element').length > 0) {
                cardElement.mount('#stripe-element');
            }
        });
    } catch (error) {
        // [IMPROVED] Handle Stripe initialization errors gracefully
        console.error('Stripe initialization failed:', error);
        if (typeof toastr !== 'undefined') {
            toastr["error"]('Payment gateway initialization failed. Please refresh the page.');
        }
    }
}


// apply coupon functionality starts
function applyCoupon() {
    // [IMPROVED] Store original button text and disable button immediately for better UX
    const $couponBtn = $('.couponBtn');
    const originalBtnText = $couponBtn.text();
    $couponBtn.prop('disabled', true).text('Processing...'); // [IMPROVED] Loading state
    
    $.post(
        coupon_url, {
        coupon: $("input[name='coupon']").val(),
        _token: document.querySelector('meta[name=csrf-token]').getAttribute('content')
    },
        function (data) {
            // [IMPROVED] Re-enable button in success callback
            $couponBtn.prop('disabled', false).text(originalBtnText);
            
            if (data.status == 'success') {
                toastr["success"](data.message);
                $("input[name='coupon']").val('');
                $("#cartTotal").load(location.href + " #cartTotal", function () {
                    let scharge = parseFloat($("input[name='shipping_charge']:checked").attr('data'));
                    let total = parseFloat($(".grandTotal").attr('data'));




                    $(".grandTotal").attr('data', total);
                    $(".grandTotal").text(
                        (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                        total +
                        (ucurrency_position == 'right' ? ucurrency_symbol : '')
                    );
                });
            } else {
                toastr["error"](data.message);
            }
        }
    ).fail(function(xhr, status, error) {
        // [IMPROVED] Handle network errors and re-enable button
        $couponBtn.prop('disabled', false).text(originalBtnText);
        
        let errorMessage = 'Network error. Please check your internet connection and try again.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMessage = xhr.responseJSON.message;
        } else if (xhr.status === 0) {
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (xhr.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
        }
        
        if (typeof toastr !== 'undefined') {
            toastr["error"](errorMessage);
        } else {
            alert(errorMessage);
        }
        
        console.error('Coupon application failed:', {
            status: status,
            error: error,
            response: xhr.responseText,
            statusCode: xhr.status
        });
    });
}
$("input[name='coupon']").on('keypress', function (e) {
    let code = e.which;
    if (code == 13) {
        e.preventDefault();
        applyCoupon();
    }
});
$('body').on('click', '.couponBtn', function (e) {
    e.preventDefault();
    applyCoupon();
})
// apply coupon functionality ends
$(document).on('click', '.shipping-charge', function () {
    // Get shipping ID from the radio button value
    const shippingId = $(this).val();
    const shippingCharge = parseFloat($(this).attr('data'));
    const $clickedElement = $(this); // [IMPROVED] Store reference for error handling
    
    // Call server-side recalculation to get accurate tax and totals
    // This ensures tax is calculated correctly: (Subtotal - Discount + Shipping) × TaxRate
    $.ajax({
        url: recalculate_url || '/checkout/recalculate',
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            shipping_id: shippingId,
            shipping_charge: shippingCharge
        },
        success: function(response) {
            if (response.success) {
                // Update subtotal
                if (response.subtotal !== undefined) {
                    $('.subtotal').attr('data', response.subtotal);
                    $('.subtotal').text(
                        (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                        parseFloat(response.subtotal).toFixed(2) +
                        (ucurrency_position == 'right' ? ucurrency_symbol : '')
                    );
                }
                
                // Update discount
                if (response.discount !== undefined) {
                    // Find the discount row in service-charge-list (first li after cart total)
                    const $discountRow = $('.service-charge-list li').first();
                    if ($discountRow.length) {
                        const $discountSpan = $discountRow.find('.price span[data]');
                        if ($discountSpan.length) {
                            $discountSpan.attr('data', response.discount);
                            $discountSpan.text(
                                (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                                parseFloat(response.discount).toFixed(2) +
                                (ucurrency_position == 'right' ? ucurrency_symbol : '')
                            );
                        }
                    }
                }
                
                // Update shipping
                if (response.shipping !== undefined) {
                    $('.shipping').attr('data', response.shipping);
                    $('.shipping').text(
                        (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                        parseFloat(response.shipping).toFixed(2) +
                        (ucurrency_position == 'right' ? ucurrency_symbol : '')
                    );
                }
                
                // Update tax (uses dynamic tax rate from shop settings)
                if (response.tax !== undefined) {
                    $('#tax').attr('data-tax', response.tax);
                    $('#tax').text(
                        (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                        parseFloat(response.tax).toFixed(2) +
                        (ucurrency_position == 'right' ? ucurrency_symbol : '')
                    );
                }
                
                // Update tax rate label
                if (response.tax_rate !== undefined) {
                    const taxLabel = $('#tax_label');
                    if (taxLabel.length) {
                        const taxText = taxLabel.text().replace(/\(\d+%\)/, `(${Math.round(response.tax_rate)}%)`);
                        taxLabel.text(taxText);
                    }
                }
                
                // Update grand total
                if (response.grand_total !== undefined) {
                    $('.grandTotal').attr('data', response.grand_total);
                    $('.grandTotal').text(
                        (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                        parseFloat(response.grand_total).toFixed(2) +
                        (ucurrency_position == 'right' ? ucurrency_symbol : '')
                    );
                }
                
                // Refresh payment gateways if Payment Restrictions plugin is enabled
                refreshPaymentGateways();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error recalculating cart:', error);
            // [IMPROVED] Show user-friendly error message
            let errorMessage = 'Failed to update cart totals. Please try again.';
            if (xhr.status === 0) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (xhr.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            if (typeof toastr !== 'undefined') {
                toastr["error"](errorMessage);
            } else {
                alert(errorMessage);
            }
            
            // Fallback to old calculation method
            let total = 0;
            let subtotal = 0;
            let grantotal = 0;
            let shipping = 0;
            subtotal = parseFloat($('.subtotal').attr('data'));
            grantotal = parseFloat($('.grandTotal').attr('data'));
            shipping = parseFloat($('.shipping').attr('data'));
            var new_grandtotal = grantotal - shipping;
            let shipCharge = parseFloat($clickedElement.attr('data')); // [IMPROVED] Use stored reference
            shipping = parseFloat(shipCharge);

            total = parseFloat(parseFloat(new_grandtotal) + shipping);

            $(".shipping").text(
                (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                shipping +
                (ucurrency_position == 'right' ? ucurrency_symbol : '')
            );

            $(".grandTotal").text(
                (ucurrency_position == 'left' ? ucurrency_symbol : '') +
                total +
                (ucurrency_position == 'right' ? ucurrency_symbol : '')
            );
        }
    }).fail(function(xhr, status, error) {
        // [IMPROVED] Additional fail handler for network errors (complementary to error callback)
        console.error('Recalculation AJAX failed:', {
            status: status,
            error: error,
            response: xhr.responseText,
            statusCode: xhr.status
        });
        
        // Only show toastr if error callback didn't already handle it
        if (xhr.status === 0 && typeof toastr !== 'undefined') {
            toastr["error"]('Network error. Please check your internet connection and try again.');
        }
    });
})


$('body').on('click', '#differentaddress', function () {
    if ($(this).is(':checked')) {
        $('#collapseAddress').addClass('show');
    } else {
        $('#collapseAddress').removeClass('show');
    }
});

// Payment Restrictions: Refresh payment gateways when shipping method or city changes
function refreshPaymentGateways() {
    // Only proceed if Payment Restrictions plugin is available
    if (!paymentRestrictionsRefreshUrl) {
        console.log('Payment Restrictions: URL not defined, skipping refresh');
        return;
    }
    
    const shippingMethodId = $('input[name="shipping_charge"]:checked').val();
    // Get city from shipping first, then billing, then empty
    const city = $('#shipping_city').val() || $('#city').val() || '';
    // Get governorate/state from shipping first, then billing, then empty
    const governorate = $('#shipping_state').val() || $('#billing_state').val() || '';
    
    // If no shipping method and no location, still refresh to apply any default restrictions
    // (Some restrictions may apply even without shipping/location selection)
    
    console.log('Payment Restrictions: Refreshing gateways', {
        shipping_method_id: shippingMethodId,
        city: city,
        governorate: governorate
    });
    
    $.ajax({
        url: paymentRestrictionsRefreshUrl,
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            shipping_method_id: shippingMethodId || null,
            shipping_charge: shippingMethodId || null, // Also send as shipping_charge for compatibility
            city: city || null,
            governorate: governorate || null
        },
        success: function(response) {
            console.log('Payment Restrictions: Refresh response', {
                success: response.success,
                payment_gateways: response.payment_gateways,
                payment_gateways_type: Array.isArray(response.payment_gateways) ? 'array' : typeof response.payment_gateways,
                payment_gateways_count: Array.isArray(response.payment_gateways) ? response.payment_gateways.length : (response.payment_gateways ? Object.keys(response.payment_gateways).length : 0),
                gateway_keywords: response.gateway_keywords
            });
            if (response.success) {
                // Ensure payment_gateways is an array
                let paymentGateways = response.payment_gateways;
                if (!Array.isArray(paymentGateways)) {
                    if (paymentGateways && typeof paymentGateways === 'object') {
                        // Convert object to array
                        paymentGateways = Object.values(paymentGateways);
                    } else {
                        paymentGateways = [];
                    }
                }
                
                console.log('Payment Restrictions: Processed payment gateways', {
                    is_array: Array.isArray(paymentGateways),
                    count: paymentGateways.length,
                    gateways: paymentGateways
                });
                
                // If full gateway objects are returned (modern design), render them
                if (paymentGateways && paymentGateways.length > 0) {
                    const $container = $('.checkout-payment-methods');
                    if ($container.length > 0) {
                        console.log('Payment Restrictions: Rendering', paymentGateways.length, 'gateways');
                        let html = '';
                        paymentGateways.forEach(function(gateway, index) {
                            const gatewayName = gateway.name || 'Unknown';
                            // Use name as value to match backend expectation (same as blade template)
                            const gatewayValue = gateway.name || gateway.keyword || '';
                            const gatewayDesc = gateway.short_description || '';
                            const gatewayType = gateway.type || 'online';
                            const gatewayKeyword = gateway.keyword || '';
                            
                            // Determine icon
                            let iconClass = 'fas fa-credit-card';
                            if (gatewayType === 'offline') {
                                iconClass = 'fas fa-money-bill-wave';
                            } else if (gatewayKeyword && gatewayKeyword.toLowerCase().includes('stripe')) {
                                iconClass = 'fab fa-cc-stripe';
                            } else if (gatewayKeyword && gatewayKeyword.toLowerCase().includes('paypal')) {
                                iconClass = 'fab fa-cc-paypal';
                            } else if (gatewayKeyword && gatewayKeyword.toLowerCase().includes('myfatoorah')) {
                                iconClass = 'fas fa-money-check-alt';
                            }
                            
                            const isSelected = index === 0;
                            
                            html += `
                                <label class="checkout-payment-option ${isSelected ? 'selected' : ''}" data-gateway-keyword="${gatewayKeyword}" data-gateway-type="${gatewayType}">
                                    <input type="radio" name="payment_method" value="${gatewayValue}" ${isSelected ? 'checked' : ''} required>
                                    <div class="checkout-payment-content">
                                        <div class="checkout-payment-icon">
                                            <i class="${iconClass}"></i>
                                        </div>
                                        <div class="checkout-payment-info">
                                            <strong>${gatewayName}</strong>
                                            <small>${gatewayDesc || (gatewayType === 'offline' ? 'الدفع عند الاستلام' : 'الدفع عن طريق البطاقات الائتمانية')}</small>
                                        </div>
                                    </div>
                                    <div class="checkout-payment-check">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                </label>
                            `;
                        });
                        
                        $container.html(html);
                        
                        // Trigger change event on first payment option to initialize gateway details
                        const $firstOption = $container.find('input[type="radio"]:checked').first();
                        if ($firstOption.length) {
                            $firstOption.trigger('change');
                        }
                        
                        // Log final state
                        console.log('Payment Restrictions: HTML rendered successfully', {
                            rendered_count: paymentGateways.length,
                            container_exists: $container.length > 0,
                            options_in_dom: $container.find('.checkout-payment-option').length
                        });
                    } else {
                        console.warn('Payment Restrictions: Container not found!', {
                            selector: '.checkout-payment-methods',
                            container_exists: $('.checkout-payment-methods').length > 0
                        });
                    }
                } else if (response.gateway_keywords) {
                    // Fallback: use keyword-based filtering (backward compatibility)
                    // Only use this if payment_gateways was not available or empty
                    console.log('Payment Restrictions: Using keyword-based filtering fallback', {
                        payment_gateways_available: !!paymentGateways,
                        payment_gateways_count: paymentGateways ? paymentGateways.length : 0,
                        gateway_keywords_available: !!response.gateway_keywords
                    });
                    console.log('Payment Restrictions: Using keyword-based filtering fallback');
                    const allowedKeywords = response.gateway_keywords
                        .filter(function(kw) { return kw != null; }) // Filter out null/undefined values
                        .map(function(kw) {
                            return kw.toLowerCase();
                        });
                    
                    // Show/hide payment gateway options based on restrictions (modern design)
                    $('.checkout-payment-option').each(function() {
                        const $option = $(this);
                        const optionValue = $option.find('input[type="radio"]').val();
                        const gatewayKeyword = $option.data('gateway-keyword') || '';
                        const isOffline = $option.data('gateway-type') === 'offline';
                        
                        // Skip if no value
                        if (!optionValue || optionValue === '') {
                            return;
                        }
                        
                        // Offline gateways are always shown
                        if (isOffline) {
                            $option.show();
                            return;
                        }
                        
                        // Check if this gateway is allowed
                        let isAllowed = false;
                        if (gatewayKeyword) {
                            allowedKeywords.forEach(function(keyword) {
                                if (gatewayKeyword.toLowerCase() === keyword.toLowerCase()) {
                                    isAllowed = true;
                                }
                            });
                        } else {
                            // Fallback: check option value
                            allowedKeywords.forEach(function(keyword) {
                                if (optionValue.toLowerCase().includes(keyword.toLowerCase())) {
                                    isAllowed = true;
                                }
                            });
                        }
                        
                        if (isAllowed) {
                            $option.show();
                        } else {
                            $option.hide();
                        }
                    });
                    
                    // Count visible gateways after filtering
                    const visibleCount = $('.checkout-payment-option:visible').length;
                    console.log('Payment Restrictions: Visible gateways after keyword filtering', visibleCount);
                    
                    // If no gateways are visible, show a warning
                    if (visibleCount === 0) {
                        console.warn('Payment Restrictions: No gateways visible after filtering!', {
                            allowedKeywords: allowedKeywords,
                            totalOptions: $('.checkout-payment-option').length
                        });
                    }
                    
                    // If currently selected gateway is hidden, reset selection
                    const $selectedOption = $('.checkout-payment-option:has(input[type="radio"]:checked)');
                    if ($selectedOption.length && $selectedOption.is(':hidden')) {
                        // Select first visible option
                        const $firstVisible = $('.checkout-payment-option:visible').first();
                        if ($firstVisible.length) {
                            $firstVisible.find('input[type="radio"]').prop('checked', true);
                            $('.checkout-payment-option').removeClass('selected');
                            $firstVisible.addClass('selected');
                            $firstVisible.find('input[type="radio"]').trigger('change');
                        }
                    }
                }
            }
        },
        error: function(xhr, status, error) {
            // Log error for debugging
            console.error('Payment Restrictions: Error refreshing gateways', {
                status: status,
                error: error,
                response: xhr.responseText,
                statusCode: xhr.status
            });
            // Don't break checkout flow - silently fail
        }
    });
}

// Listen to shipping method changes
$(document).on('change', 'input[name="shipping_charge"]', function() {
    refreshPaymentGateways();
});

// Listen to city input changes (with debounce)
let cityChangeTimeout;
$(document).on('input blur', '#shipping_city, #city', function() {
    clearTimeout(cityChangeTimeout);
    cityChangeTimeout = setTimeout(function() {
        refreshPaymentGateways();
    }, 500); // Wait 500ms after user stops typing
});

// Listen to governorate/state changes
$(document).on('change', '#shipping_state, #billing_state', function() {
    refreshPaymentGateways();
});

// Handle payment method selection (modern design)
// Handle both click on label and change on radio button
$(document).on('click', '.checkout-payment-option', function(e) {
    // Don't trigger if clicking directly on the radio button (let native behavior handle it)
    if ($(e.target).is('input[type="radio"]') || $(e.target).closest('input[type="radio"]').length) {
        return;
    }
    
    // Prevent default to avoid any form submission
    e.preventDefault();
    e.stopPropagation();
    
    // Find the radio button inside this option
    const $radio = $(this).find('input[type="radio"]');
    if ($radio.length) {
        // Remove selected class from all options
        $('.checkout-payment-option').removeClass('selected');
        
        // Check this radio button
        $radio.prop('checked', true);
        
        // Add selected class to this option
        $(this).addClass('selected');
        
        // Trigger change event to update form state
        $radio.trigger('change');
    }
});

// Handle change event on radio button
$(document).on('change', '.checkout-payment-option input[type="radio"]', function() {
    $('.checkout-payment-option').removeClass('selected');
    $(this).closest('.checkout-payment-option').addClass('selected');
    
    // Trigger legacy handler for compatibility
    const paymentMethod = $(this).val();
    handlePaymentMethodChange(paymentMethod);
});

// Legacy support for old select (if it exists)
$("#payment-gateway").on('change', function () {
    const paymentMethod = $(this).val();
    handlePaymentMethodChange(paymentMethod);
});

// Unified payment method change handler
function handlePaymentMethodChange(paymentMethod) {
    let offline = offline_gateways;
    let data = [];
    if (offline && Array.isArray(offline)) {
        offline.map(({
            id,
            name
        }) => {
            data.push(name);
        });
    }
    
    // Update hidden input if exists
    $("input[name='payment_method']").val(paymentMethod);

    $(".gateway-details").hide();
    $(".gateway-details input").attr('disabled', true);

    if (paymentMethod == 'Stripe') {
        $("#tab-stripe").show();
        $("#tab-stripe input").removeAttr('disabled');
    } else {
        $("#tab-stripe").hide();
    }

    if (paymentMethod == 'Authorize.net') {
        $("#tab-anet").show();
        $("#tab-anet input").removeAttr('disabled');
    } else {
        $("#tab-anet").hide();
    }
    if (paymentMethod == 'Iyzico') {
        $(".iyzico-element").removeClass('d-none');
    } else {
        $(".iyzico-element").addClass('d-none');
    }

    if (data.indexOf(paymentMethod) != -1) {
        let formData = new FormData();
        formData.append('name', paymentMethod);
        $.ajax({
            url: instruction_url,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: formData,
            success: function (data) {
                let instruction = $("#instructions");
                let instructions =
                    `<div class="gateway-desc">${data.instructions}</div>`;
                if (data.description != null) {
                    var description =
                        `<div class="gateway-desc"><p>${data.description}</p></div>`;
                } else {
                    var description = `<div></div>`;
                }
                var emptyTxt = (typeof receipt_text_empty !== 'undefined' ? receipt_text_empty : 'اضغط لاختيار صورة الإيصال');
                var hasFileTxt = (typeof receipt_text_has_file !== 'undefined' ? receipt_text_has_file : 'تم اختيار الملف');
                var badgeTxt = (typeof receipt_badge !== 'undefined' ? receipt_badge : 'JPG, PNG, WEBP');
                let receipt = `<div class="checkout-receipt-section mt-3">
                    <div class="checkout-receipt-header">
                        <i class="fas fa-file-invoice"></i>
                        <span>${typeof receipt_section_title !== 'undefined' ? receipt_section_title : 'إيصال التحويل'}</span>
                    </div>
                    <div class="checkout-receipt-upload">
                        <input type="file" name="receipt" id="checkout_receipt" class="checkout-receipt-input" accept=".jpg,.jpeg,.png,.webp" required>
                        <label for="checkout_receipt" class="checkout-receipt-zone">
                            <span class="checkout-receipt-icon"><i class="fas fa-cloud-upload-alt"></i></span>
                            <span class="checkout-receipt-text" data-empty="${emptyTxt}" data-has-file="${hasFileTxt}">${emptyTxt}</span>
                            <span class="checkout-receipt-filename" id="checkout_receipt_filename" aria-live="polite"></span>
                            <span class="checkout-receipt-badge">${badgeTxt}</span>
                        </label>
                    </div>
                </div>`;
                if (data.is_receipt == 1) {
                    $("#is_receipt").val(1);
                    let finalInstruction = instructions + description + receipt;
                    instruction.html(finalInstruction);
                } else {
                    $("#is_receipt").val(0);
                    let finalInstruction = instructions + description;
                    instruction.html(finalInstruction);
                }
                $('#instructions').fadeIn();
            },
            error: function (xhr, status, error) {
                // [IMPROVED] Handle errors when loading gateway instructions
                console.error('Error loading gateway instructions:', {
                    status: status,
                    error: error,
                    response: xhr.responseText,
                    statusCode: xhr.status
                });
                // Don't break the flow - just log the error
            }
        })
    } else {
        $('#instructions').fadeOut();
    }
}


$(document).ready(function () {
    // Checkout receipt upload: show filename and zone state (same UX as Quick Checkout)
    $(document).on('change', '#checkout_receipt', function() {
        var $zone = $(this).closest('.checkout-receipt-upload').find('.checkout-receipt-zone');
        var $text = $zone.find('.checkout-receipt-text');
        var $filename = $('#checkout_receipt_filename');
        var files = this.files;
        if (files && files.length > 0) {
            $text.text($text.data('has-file') || 'تم اختيار الملف');
            $filename.text(files[0].name);
        } else {
            $text.text($text.data('empty') || 'اضغط لاختيار صورة الإيصال');
            $filename.text('');
        }
    });
    $(document).on('focus', '#checkout_receipt', function() {
        $(this).closest('.checkout-receipt-upload').find('.checkout-receipt-zone').addClass('focused');
    });
    $(document).on('blur', '#checkout_receipt', function() {
        $(this).closest('.checkout-receipt-upload').find('.checkout-receipt-zone').removeClass('focused');
    });

    // Fix Ghost Shipping Fee: Trigger recalculation if shipping method is pre-selected
    const $selectedShipping = $('input[name="shipping_charge"]:checked');
    if ($selectedShipping.length > 0 && typeof recalculateCheckoutCart === 'function') {
        // Trigger recalculation to update totals with shipping fee
        setTimeout(function() {
            recalculateCheckoutCart();
        }, 100);
    } else if ($selectedShipping.length > 0) {
        // Fallback: Trigger change event on shipping input
        $selectedShipping.trigger('change');
    }
    
    // Refresh payment gateways on page load to apply PaymentRestrictions
    // Always refresh (even without shipping/location) to apply any default restrictions
    // This ensures PaymentRestrictions are applied even on initial page load
    if (typeof refreshPaymentGateways === 'function' && paymentRestrictionsRefreshUrl) {
        setTimeout(function() {
            refreshPaymentGateways();
        }, 1000); // Wait for page to fully load and DOM to be ready
    }
    
    $("#userOrderForm").on('submit', function (e) {
        e.preventDefault();
        $(this).find('button[type="submit"]').prop('disabled', true).text(processing_text);
        // Get payment method from modern design or legacy select
        let val = $('input[name="payment_method"]:checked').val() || $("#payment-gateway").val();
        if (val == 'Authorize.net') {
            sendPaymentDataToAnet();
        } else if (val == 'Stripe') {
            // [IMPROVED] Validate Stripe and cardElement exist before use
            if (typeof stripe === 'undefined' || !stripe || typeof cardElement === 'undefined' || !cardElement) {
                var errorMessage = 'Payment gateway not initialized. Please refresh the page.';
                var errorElement = document.getElementById('stripe-errors');
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                }
                if (typeof toastr !== 'undefined') {
                    toastr["error"](errorMessage);
                } else {
                    alert(errorMessage);
                }
                $("#userOrderForm").find('button[type="submit"]').prop('disabled', false).text(place_order);
                return;
            }
            
            // [IMPROVED] Enhanced error handling for Stripe token creation
            stripe.createToken(cardElement).then(function (result) {
                if (result.error) {
                    // Display errors to the customer
                    var errorElement = document.getElementById('stripe-errors');
                    if (errorElement) {
                        errorElement.textContent = result.error.message;
                    }
                    
                    // [IMPROVED] Also show toastr notification for better visibility
                    if (typeof toastr !== 'undefined') {
                        toastr["error"](result.error.message);
                    }
                    
                    $("#userOrderForm").find('button[type="submit"]').prop('disabled', false).text(place_order);
                } else {
                    // Send the token to your server
                    stripeTokenHandler(result.token);
                }
            }).catch(function(error) {
                // [IMPROVED] Handle network errors and other exceptions
                console.error('Stripe token creation failed:', error);
                
                var errorMessage = 'Payment processing error. Please try again.';
                if (error.type === 'network_error' || error.message && error.message.includes('network')) {
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                }
                
                var errorElement = document.getElementById('stripe-errors');
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                }
                
                if (typeof toastr !== 'undefined') {
                    toastr["error"](errorMessage);
                } else {
                    alert(errorMessage);
                }
                
                $("#userOrderForm").find('button[type="submit"]').prop('disabled', false).text(place_order);
            });
        }
        else {
            $(this).unbind('submit').submit();
        }
    });
});


//stripe token handler
function stripeTokenHandler(token) {
    // Add the token to the form data before submitting to the server
    var form = document.getElementById('userOrderForm');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form to your server
    form.submit();
}


function sendPaymentDataToAnet() {
    // Set up authorisation to access the gateway.
    var authData = {};
    authData.clientKey = anet_public_key;
    authData.apiLoginID = anet_login_id;

    var cardData = {};
    cardData.cardNumber = document.getElementById("anetCardNumber").value;
    cardData.month = document.getElementById("anetExpMonth").value;
    cardData.year = document.getElementById("anetExpYear").value;
    cardData.cardCode = document.getElementById("anetCardCode").value;

    // Now send the card data to the gateway for tokenisation.
    // The responseHandler function will handle the response.
    var secureData = {};
    secureData.authData = authData;
    secureData.cardData = cardData;
    Accept.dispatchData(secureData, responseHandler);
}

function responseHandler(response) {
    if (response.messages.resultCode == "Error") {
        var i = 0;
        let errorLists = ``;
        while (i < response.messages.message.length) {
            errorLists += `<li class="text-danger">${response.messages.message[i].text}</li>`;

            i = i + 1;
        }
        $("#anetErrors").show();
        $("#anetErrors").html(errorLists);
        $("#userOrderForm").find('button[type="submit"]').prop('disabled', false).text(place_order);
    } else {
        paymentFormUpdate(response.opaqueData);
    }
}

function paymentFormUpdate(opaqueData) {
    document.getElementById("opaqueDataDescriptor").value = opaqueData.dataDescriptor;
    document.getElementById("opaqueDataValue").value = opaqueData.dataValue;
    document.getElementById("userOrderForm").submit();
}
