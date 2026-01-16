(function ($) {
    "use strict";
    $('input[name="is_trial"]').on('change', function () {
        if ($(this).val() == 1) {
            $('#trial_day').show();
        } else {
            $('#trial_day').hide();
        }
        $('#trial_days').val(null);
        $('#trial_days_2').val(null);
        $('#trial_days_1').val(null);
    });

    $(".selectgroup-input").on('click', function () {
        var val = $(this).val();
        if (val == 'vCard') {
            if ($(this).is(":checked")) {
                $(".v-card-box").removeClass('d-none');
            } else {
                $(".v-card-box").addClass('d-none');
            }
        } else if (val == 'Blog') {
            $("#post_limit").slideToggle();
            if ($(this).is(":checked")) {
            } else {
                $('#post_limit').val(null);
            }
        } else if (val == 'Custom Page') {
            if ($(this).is(":checked")) {
                $(".custom-page-box").removeClass('d-none');
            } else {
                $(".custom-page-box").addClass('d-none');
            }
        }
    });
})(jQuery); 
