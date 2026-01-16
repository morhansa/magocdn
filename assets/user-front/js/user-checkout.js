'use strict';

if (stripe_key) {
    // Set your Stripe public key
    var stripe = Stripe(stripe_key);
    // Create a Stripe Element for the card field
    var elements = stripe.elements();
    var cardElement = elements.create('card', {
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

    // Add an instance of the card Element into the `card-element` div
    cardElement.mount('#stripe-element');
}


// apply coupon functionality starts
function applyCoupon() {
    $.post(
        coupon_url, {
        coupon: $("input[name='coupon']").val(),
        _token: document.querySelector('meta[name=csrf-token]').getAttribute('content')
    },
        function (data) {
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
    );
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
    let total = 0;
    let subtotal = 0;
    let grantotal = 0;
    let shipping = 0;
    subtotal = parseFloat($('.subtotal').attr('data'));
    grantotal = parseFloat($('.grandTotal').attr('data'));
    shipping = parseFloat($('.shipping').attr('data'));
    var new_grandtotal = grantotal - shipping;
    let shipCharge = parseFloat($(this).attr('data'));
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
})


$('body').on('click', '#differentaddress', function () {
    if ($(this).is(':checked')) {
        $('#collapseAddress').addClass('show');
    } else {
        $('#collapseAddress').removeClass('show');
    }
});

$("#payment-gateway").on('change', function () {
    let offline = offline_gateways;
    let data = [];
    offline.map(({
        id,
        name
    }) => {
        data.push(name);
    });
    let paymentMethod = $("#payment-gateway").val();
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
                let receipt = `<div class="form-element mb-2">
                                      <label>Receipt<span>*</span></label><br>
                                      <input type="file" name="receipt" value="" class="file-input" required>
                                      <p class="mb-0 text-warning">** Receipt image must be .jpg / .jpeg / .png</p>
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
            error: function (data) { }
        })
    } else {
        $('#instructions').fadeOut();
    }
});


$(document).ready(function () {
    $("#userOrderForm").on('submit', function (e) {
        e.preventDefault();
        $(this).find('button[type="submit"]').prop('disabled', true).text(processing_text);
        let val = $("#payment-gateway").val();
        if (val == 'Authorize.net') {
            sendPaymentDataToAnet();
        } else if (val == 'Stripe') {
            stripe.createToken(cardElement).then(function (result) {
                if (result.error) {
                    // Display errors to the customer
                    var errorElement = document.getElementById('stripe-errors');
                    errorElement.textContent = result.error.message;
                    $("#userOrderForm").find('button[type="submit"]').prop('disabled', false).text(place_order);
                } else {
                    // Send the token to your server
                    stripeTokenHandler(result.token);
                }
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
