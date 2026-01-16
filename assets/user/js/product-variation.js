"use strict";

/****************************************
       * Function to Add Option
       ****************************************/
$(document).ready(function () {

    $('body').on('click', '.add-variant', function (e) {
        e.preventDefault();

        var $parent = $(this).closest('#variant-container');

        // Clone the first .variant-box
        var $variant_box = $parent.find('.variant-box').first().clone();

        // Generate a unique ID
        var unique_id = Math.floor(Date.now() * 100);

        // Clear the values in the cloned inputs and selects
        $variant_box.find('input').val('');
        $variant_box.find('select').val('');
        $variant_box.find('.unique_id').val(unique_id);

        // Clear any previous error messages
        $variant_box.find('.em').each(function () {
            $(this).html('');
        });

        // Update the name attributes with the unique ID prefix
        $variant_box.find('input:not(.unique_id), select').each(function () {
            var originalName = $(this).attr('name');
            var name = originalName.replace(/^[^_]*_/, '');
            $(this).attr('name', unique_id + '_' + name);
        });


        // Clear any previous error messages
        $variant_box.find('.em').each(function () {
            var originalClass = $(this).attr('class');
            var newClass = originalClass.replace(/err[^_]*_/, 'err' + unique_id + '_');
            $(this).attr('class', newClass);
        });

        // Keep only the last .varitant-option and remove the rest
        $variant_box.find('.varitant-option').not(':last').remove();
        $variant_box.find('.varitant-option .remove_option').remove();
        $variant_box.find('.variant-close-btn').remove();

        // Also clear the inputs and selects inside the last .varitant-option
        $variant_box.find('.varitant-option:last input').val('');
        $variant_box.find('.varitant-option:last select').empty();

        $variant_box.find('input[name$="_price[]"]').val(0);
        $variant_box.find('input[name$="_stock[]"]').val(0);

        // Add the remove button to the cloned variant box
        var $removeButton = $(
            '<a href="#" class="btn btn-danger btn-sm variant-close-btn"><i class="fas fa-times"></i></a>');
        $variant_box.append($removeButton);

        // Append the cloned element after the last .variant-box
        $parent.find('.variant-box').last().after($variant_box);
    });



    /****************************************
     * Function to remove a .varitant
     ****************************************/
    $('body').on('click', '.variant-close-btn', function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        var variant_box = $(this).closest('.variant-box');
        $.get(url, function (result) {
            if (result == 'success') {
                variant_box.remove();
            } else {
                if (variant_box.length > 2) {
                    window.location.reload();
                } else {
                    variant_box.remove();
                }
            }
        })
    });

    $('body').on('click', '.add_option', function (e) {
        e.preventDefault();
        var $variant_box = $(this).closest('.variant-box');
        var $unique_id = $variant_box.find('.unique_id').val();


        var $parent = $(this).closest('.col-md-12');
        var $variantOption = $parent.find('.varitant-option').first().clone();

        $variantOption.find('.option_id').remove();
        $variantOption.find('.remove_option').remove();
        $variantOption.find('input').val('');
        $variantOption.find('select').val('');

        $variantOption.find('input[name$="_price[]"]').val(0);
        $variantOption.find('input[name$="_stock[]"]').val(0);
        // Clear any previous error messages
        $variantOption.find('.em').each(function () {
            $(this).html('');
        });

        var $removeButton = $(
            `<input type="hidden" name="${$unique_id}_optionid[]" value="new">
            <a href="#" class="btn btn-danger btn-sm ml-25px remove_option mb-2"><i class="fas fa-times"></i></a>`);
        $variantOption.append($removeButton);
        $parent.find('.varitant-option').last().after($variantOption);
    });

    /****************************************
     * Function to remove a .varitant-option
     ****************************************/
    $('body').on('click', '.remove_option', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var data = {
            id: id
        }
        if (typeof (id) !== 'undefined' && id !== null) {
            var url = variation_option_delete_url;
            $.get(url, data, function (result) {

            })
        }
        $(this).closest('.varitant-option').remove();
    });

    /****************************************
         * Function  to handle variation change
         ****************************************/
    $('body').on('change', '.product_variation', function () {
        var variation_content_id = $(this).val();
        var language_id = $(this).data('language_id');
        var language_code = $(this).data('language_code');

        var url = product_get_all_variation_url;
        var data = {
            language_id: language_id,
            variation_content_id: variation_content_id,
        };

        var $currentCategoryDropdown = $(this);
        var $parentRow = $currentCategoryDropdown.closest('.variant-box');

        var $subcategoryDropdown = $parentRow.find('.varitant-option .' + language_code + '_option_name');

        $.get(url, data, function (result) {
            $subcategoryDropdown.empty();
            $subcategoryDropdown.append('<option value="">Select Option</option>');

            $.each(result, function (index, item) {
                $subcategoryDropdown.append($('<option>', {
                    value: item.id,
                    text: item.option_name
                }));
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
            },
            error: function (error) {
                $(".em").each(function () {
                    $(this).html(''); // Clear previous error messages
                });

                for (let x in error.responseJSON.errors) {
                    // Remove numeric suffixes (e.g., .0, .1) from the field name
                    let sanitizedField = x.replace(/\.\d+$/, '');

                    // Find all error containers for this field
                    let errorFields = document.querySelectorAll('.err' + sanitizedField);

                    errorFields.forEach(function (errorField) {
                        // Find the corresponding input or select field
                        let field = errorField.closest('div').querySelector('input, select');

                        // If the field is empty, display the error message
                        if (!field || !field.value.trim()) {
                            errorField.innerHTML = error.responseJSON.errors[x][0];
                        }
                    });
                }

                $(".request-loader").removeClass("show");
            }
        });
    });
});
