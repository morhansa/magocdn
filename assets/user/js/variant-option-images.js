(function () {
  'use strict';

  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if (el.matches(sel)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function setStatus(root, text, isError) {
    var s = root.querySelector('.voi-status');
    if (!s) return;
    s.textContent = text || '';
    s.classList.toggle('text-danger', !!isError);
    s.classList.toggle('text-muted', !isError);
  }

  function setPreview(root, url) {
    var a = root.querySelector('.voi-preview');
    var img = root.querySelector('.voi-thumb');
    var del = root.querySelector('.voi-delete');
    if (!a || !img || !del) return;

    if (url) {
      a.classList.remove('d-none');
      del.classList.remove('d-none');
      a.setAttribute('href', url);
      img.setAttribute('src', url);
    } else {
      a.classList.add('d-none');
      del.classList.add('d-none');
      a.setAttribute('href', '#');
      img.setAttribute('src', '');
    }
  }

  document.addEventListener('change', function (e) {
    var input = e.target;
    if (!input || !input.classList || !input.classList.contains('voi-file')) return;
    var root = closest(input, '.variant-option-image-uploader');
    if (!root) return;

    var file = input.files && input.files[0];
    if (!file) return;

    var itemId = parseInt(root.getAttribute('data-item-id') || '0', 10);
    var optionId = parseInt(root.getAttribute('data-option-id') || '0', 10);
    var uploadUrl = root.getAttribute('data-upload-url');
    var csrf = root.getAttribute('data-csrf');

    if (!uploadUrl || !csrf || itemId < 1 || optionId < 1) return;

    setStatus(root, 'Uploading...', false);

    var fd = new FormData();
    fd.append('item_id', String(itemId));
    fd.append('option_id', String(optionId));
    fd.append('file', file);

    fetch(uploadUrl, {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': csrf, 'Accept': 'application/json' },
      body: fd
    })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { ok: r.ok, json: j, status: r.status }; }); })
      .then(function (res) {
        if (!res.ok || !res.json || !res.json.ok) {
          var msg = (res.json && res.json.message) ? res.json.message : ('Upload failed (' + res.status + ')');
          setStatus(root, msg, true);
          return;
        }
        setPreview(root, res.json.image_url || null);
        setStatus(root, 'Saved', false);
      })
      .catch(function () {
        setStatus(root, 'Upload failed', true);
      })
      .finally(function () {
        input.value = '';
      });
  });

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.voi-delete') : null;
    if (!btn) return;
    var root = closest(btn, '.variant-option-image-uploader');
    if (!root) return;

    var itemId = parseInt(root.getAttribute('data-item-id') || '0', 10);
    var optionId = parseInt(root.getAttribute('data-option-id') || '0', 10);
    var deleteUrl = root.getAttribute('data-delete-url');
    var csrf = root.getAttribute('data-csrf');

    if (!deleteUrl || !csrf || itemId < 1 || optionId < 1) return;

    setStatus(root, 'Removing...', false);

    fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ item_id: itemId, option_id: optionId })
    })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { ok: r.ok, json: j, status: r.status }; }); })
      .then(function (res) {
        if (!res.ok || !res.json || !res.json.ok) {
          var msg = (res.json && res.json.message) ? res.json.message : ('Remove failed (' + res.status + ')');
          setStatus(root, msg, true);
          return;
        }
        setPreview(root, null);
        setStatus(root, 'Removed', false);
      })
      .catch(function () {
        setStatus(root, 'Remove failed', true);
      });
  });
})();

