"use strict";

$(document).ready(function () {
    $(".bannerEditBtn").on('click', function () {
        let datas = $(this).data();
        delete datas['toggle'];

        for (let x in datas) {
            if ($("#in" + x).hasClass('image')) {
                $("#in" + x).attr('src', datas[x]);
            } else {
                $("#in" + x).val(datas[x]);
            }
            if (x == 'subtitle') {
                if (isEmpty($('#insubtitle').val())) {
                    _hideSubtitle();
                } else {
                    _showSubtitle();
                }
            }
        }
    });

    function _hideSubtitle() {
        $('.subtitle').addClass('d-none');
    }
    function _showSubtitle() {
        $('.subtitle').removeClass('d-none');
    }


    $('body').on('change', '.banner_position', function () {
        let _value = $(this).val();

        if (theme == 'kids') {
            switch (_value) {
                case 'middle_right':
                case 'left':
                    $('.note-text').html(`${reco700_375}`);
                    _showSubtitle();
                    break;
                case 'middle':
                    $('.note-text').html(`${reco700_850}`);
                    _showSubtitle();
                    break;
                case 'right':
                    _hideSubtitle();
                    break;
                default:
                    $('.note-text').html(`${reco_860_1150}`);
            }
        } else if (theme == 'electronics') {
            switch (_value) {
                case 'bottom':
                case 'middle':
                    $('.note-text').html(`${reco860_400}`);
                    _showSubtitle();
                    break;
                case 'left':
                    $('.note-text').html(`${reco860_1320}`);
                    _hideSubtitle();
                    break;
                default:
                    $('.note-text').html(`${reco445_195}`);
                    _showSubtitle();
            }
        } else if (theme == 'furniture') {
            switch (_value) {
                case 'bottom_middle':
                    $('.note-text').html(`${reco490_730}`);
                    _showSubtitle();
                    break;
                case 'top_middle':
                    $('.note-text').html(`${reco700_280}`);
                    _showSubtitle();
                    break;
                case 'middle':
                    $('.note-text').html(`${reco750_330}`);
                    _hideSubtitle();
                    break;
                default:
                    $('.note-text').html(`${reco700_280}`);
                    _showSubtitle();
            }
        } else if (theme == 'vegetables') {
            switch (_value) {
                case 'middle':
                    $('.note-text').html(`${reco450_240}`);
                    _hideSubtitle();
                    break;
                case 'bottom_left':
                    $('.note-text').html(`${reco485_730}`);
                    _hideSubtitle();
                    break;
                case 'top_right':
                    _showSubtitle();
                    break;
                default:
                    $('.note-text').html(`${reco500_265}`);
                    _showSubtitle();
            }
        } else if (theme == 'manti') {
            switch (_value) {
                case 'middle':
                    $('.note-text').html(`${reco688_320}`);
                    break;
                default:
                    $('.note-text').html(`${reco625_570}`);
            }
        }
    });

    function isEmpty(value) {
        return value === null || value === undefined || value === '';
    }
});


