$(document).ready(function () {
  let variants = [];

  function generateUniqueId() {
    let n = Math.floor(Math.random() * 11);
    let k = Math.floor(Math.random() * 1000000);
    return String.fromCharCode(n) + k;
  }

  $(document).on('click', '.add-option', function () {
    let vIndex = $(this).closest('.variant-box').data('index');
    let uniqid = generateUniqueId();
    let newOption = {
      uniqid: uniqid,
      name: '',
    };

    if (!variants[vIndex]) {
      variants[vIndex] = {
        options: []
      };
    }

    variants[vIndex].options.push(newOption);
    renderOption(newOption, vIndex);
  });

  $(document).on('click', '.remove-option', function () {
    let vIndex = $(this).closest('.option-box').data('vindex');
    let oIndex = $(this).closest('.option-box').data('oindex');
    $(this).closest('.option-box').remove();
  });

  $(document).on('click', '.delete-option', function () {
    var url = delete_option_url;
    let index = $(this).data('oindex');

    var $option_box = $(this).closest('.option-box');
    var data = {
      index: index
    };
    $.get(url, data, function (result) {
      if (result == 'success') {
        $option_box.remove();
      }
    });
  });

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
    var $parentRow = $currentCategoryDropdown.closest('.variant-box');
    var $subcategoryDropdown = $parentRow.find(
      `.subcategory_dropdown .variation_subcategory[name="sub_category_id"]`);

    $.get(url, data, function (result) {
      $subcategoryDropdown.empty();
      $subcategoryDropdown.append('<option value="">Select Subcategory</option>');

      $.each(result, function (index, item) {
        $subcategoryDropdown.append($('<option>', {
          value: item.id,
          text: item.name
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
