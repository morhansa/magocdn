"use strict";
$(document).ready(function () {
  let cropper; // Declare cropper variable globally to access it
  var THUMBNAIL_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB - avoid loading huge files (security-and-scalability)

  $('.thumbnail-input').change(function (event) {
    let file = event.target.files[0];
    if (!file) return;
    if (file.size > THUMBNAIL_MAX_SIZE_BYTES) {
      var msg = (typeof window.thumbnailMaxSizeMessage !== 'undefined' && window.thumbnailMaxSizeMessage) ? window.thumbnailMaxSizeMessage : 'Image must not exceed 5MB.';
      if (typeof bootnotify === 'function') {
        bootnotify(msg, 'Warning', 'warning');
      } else {
        alert(msg);
      }
      $(this).val('');
      return;
    }
    let reader = new FileReader();

    reader.onload = function (e) {
      // Ensure .uploaded-img-2 element exists and set its src attribute
      $('.uploaded-thumbnail-img').attr('src', e.target.result);

      // Initialize Cropper.js only after image is fully loaded
      $('.uploaded-thumbnail-img').one('load', function () {
        // Destroy old Cropper instance if exists
        if (cropper) {
          cropper.destroy();
          cropper = null; // Clear cropper variable
        }

        // Initialize Cropper.js
        cropper = new Cropper(this, {
          aspectRatio: 1 / 1,
          background: false,
          cropBoxResizable: false,
          minCropBoxWidth: 255,
          minCropBoxHeight: 255,
          responsive: true,
          dragMode: 'move',
          cropBoxMovable: false,
          crop(event) {
            // Get cropped canvas
            const canvas = cropper.getCroppedCanvas({
              width: 255, // set output width
              height: 255, // set output height
            });
            // Update the content of #blob_image with cropped image data URL
            $('#blob_image').text('');
            $('#blob_image').text(cropper.getCroppedCanvas().toDataURL());
          }
        });

        $('.destroy-cropper').removeClass('d-none');
        $('.thumbnail-step2-hint').removeClass('d-none');
        $('.thumbnail-zoom-hint').removeClass('d-none');
      });
    };

    reader.readAsDataURL(file);
  });

  $('#thumbnail-image-modal').on('hidden.bs.modal', function () {
    // Check if cropper instance exists
    if (cropper) {
      // Get cropped canvas
      const canvas = cropper.getCroppedCanvas({
        width: 255, // set output width
        height: 255, // set output height
      });
      // Set cropped canvas as src for .cropped-thumbnail-image
      $('.cropped-thumbnail-image').attr('src', canvas.toDataURL());

      $('.uploaded-thumbnail-img').attr('src', $('.uploaded-thumbnail-img').attr('data-no_image'));

      // Destroy cropper instance
      cropper.destroy();
      cropper = null;

      $('.cropped-thumbnail-image').off('load');
      $('.destroy-cropper').addClass('d-none');
      $('.thumbnail-step2-hint').addClass('d-none');
      $('.thumbnail-zoom-hint').addClass('d-none');
    }
    // Reset file input so tenant can choose another image (or same) without errors
    $('.thumbnail-input').val('');
  });
});
