"use strict";
$('.remove-img').on('click', function () {
    swal({
        title: are_you_sure,
        text: wont_revert_text,
        type: 'warning',
        buttons: {
            confirm: {
                text: yes_delete_it,
                className: 'btn btn-success'
            },
            cancel: {
                visible: true,
                text: cancel,
                className: 'btn btn-danger'
            }
        }
    }).then((Delete) => {
        if (Delete) {
            $(".request-loader").addClass('show');
            let url = $(this).data('url');
            let name = $(this).data('name');

            $.get(url, { name: name }, function (response) {
                if (response.status == 'success') {
                    location.reload();
                }
            }).fail(function (error) {
                console.error("Error removing image:", error);
            });
        } else {
            swal.close();
        }
    });

});
