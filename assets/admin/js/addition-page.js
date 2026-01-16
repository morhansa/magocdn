"use strict";
$('#pageForm').on('submit', function (e) {
    $('.request-loader').addClass('show');
    e.preventDefault();

    let action = $(this).attr('action');
    let fd = new FormData($(this)[0]);
    if ($("#pageForm .summernote").length > 0) {
        $("#pageForm .summernote").each(function (i) {
            let index = i;
            let $toInput = $('.summernote').eq(index);

            let tmcId = $toInput.attr('id');
            let content = tinyMCE.get(tmcId).getContent();

            fd.delete($(this).attr('name'));
            fd.append($(this).attr('name'), content);
        });
    }

    $.ajax({
        url: action,
        method: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success: function (data) {
            $('.request-loader').removeClass('show');

            if (data.status == 'success') {
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
            let errors = ``;

            for (let x in error.responseJSON.errors) {
                errors += `<li>
                <p class="text-danger mb-0">${error.responseJSON.errors[x][0]}</p>
              </li>`;
            }

            $('#pageErrors ul').html(errors);
            $('#pageErrors').show();

            $('.request-loader').removeClass('show');

            $('html, body').animate({
                scrollTop: $('#pageErrors').offset().top - 100
            }, 1000);
        }
    });
});
