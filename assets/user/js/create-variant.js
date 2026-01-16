"use strict";
$(document).ready(function () {
    let variants = [];

    // Function to generate unique ID
    function generateUniqueId() {
        let n = Math.floor(Math.random() * 11);
        let k = Math.floor(Math.random() * 1000000);
        return n + k;
    }

    // Function to render an option


    // Add option button click event
    $(document).on('click', '.add-option', function () {
        let vIndex = $(this).closest('.variant-box').data('index');
        let uniqid = generateUniqueId();
        let newOption = {
            uniqid: uniqid,
            name: '',
        };

        // Ensure that the variant exists in the array
        if (!variants[vIndex]) {
            variants[vIndex] = {
                options: []
            };
        }

        variants[vIndex].options.push(newOption);
        renderOption(newOption, vIndex);
    });

    // Remove variant button click event
    $(document).on('click', '.remove-variant', function () {
        let vIndex = $(this).closest('.variant-box').data('index');
        variants.splice(vIndex, 1);
        $(this).closest('.variant-box').remove();
    });

    // Remove option button click event
    $(document).on('click', '.remove-option', function () {
        let vIndex = $(this).closest('.option-box').data('vindex');
        let oIndex = $(this).closest('.option-box').data('oindex');
        variants[vIndex].options = variants[vIndex].options.filter(opt => opt.uniqid !== oIndex);
        $(this).closest('.option-box').remove();
    });

    // Handle change event for category dropdowns
    $('body').on('change', '.variation_category', function () {
        var language_id = $(this).data('language_id');
        var language_code = $(this).data('language_code');
        var category_id = $(this).val();
        var url = get_subcategory_url;
        var data = {
            language_id: language_id,
            category_id: category_id,
        };

        var $currentCategoryDropdown = $(this);

        // Find the closest parent that contains both the category and subcategory dropdowns
        var $parentRow = $currentCategoryDropdown.closest('.variant-box');

        // Find the corresponding subcategory dropdown within the same row and language
        var $subcategoryDropdown = $parentRow.find(
            `.subcategory_dropdown .variation_subcategory[name="sub_category_id"]`);

        // Make the AJAX request
        $.get(url, data, function (result) {
            $subcategoryDropdown.empty();
            $subcategoryDropdown.append('<option value="">Select Subcategory</option>');

            $.each(result, function (index, item) {
                $subcategoryDropdown.append(
                    $('<option>', {
                        value: item.id,
                        text: item.name
                    })
                );
            });
        });
    });


    $('#itemVariationForm').on('submit', function (e) {
        $('.request-loader').addClass('show');
        e.preventDefault();

        let action = $('#itemVariationForm').attr('action');
        let fd = new FormData(document.querySelector('#itemVariationForm'));

        $.ajax({
            url: action,
            method: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (data) {
                $('.request-loader').removeClass('show');


                if (data == 'success') {
                    location.reload();
                }
                if (data == "downgrade") {
                    $('.modal').modal('hide');
                    "use strict";
                    var content = {};
                    content.message = downgradText;
                    content.title = WarningText;
                    content.icon = 'fa fa-bell';
                    $.notify(content, {
                        type: 'warning',
                        placement: {
                            from: 'top',
                            align: 'right'
                        },
                        showProgressbar: true,
                        time: 1000,
                        delay: 4000,
                    });
                    $("#limitModal").modal('show');
                }
            },
            error: function (error) {
                $(".em").each(function () {
                    $(this).html('');
                })
                for (let x in error.responseJSON.errors) {
                    let sanitizedField = x.replace(/\.\d+$/, ''); // Removes .0, .1, etc.
                    let errorFields = document.getElementsByClassName('err' + sanitizedField);

                    for (let i = 0; i < errorFields.length; i++) {
                        // Check if the field is empty before showing the error
                        let field = errorFields[i].closest('div').querySelector('input, select');
                        if (!field.value.trim()) {
                            errorFields[i].innerHTML = error.responseJSON.errors[x][0];
                        }
                    }
                }
                $(".request-loader").removeClass("show");
            }
        });
    });
});
