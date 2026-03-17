'use strict';

(function() {
  var COLOR_MAP = {
    'red': '#e53935', 'أحمر': '#e53935', 'احمر': '#e53935',
    'blue': '#1e88e5', 'أزرق': '#1e88e5', 'ازرق': '#1e88e5',
    'green': '#43a047', 'أخضر': '#43a047', 'اخضر': '#43a047',
    'yellow': '#fdd835', 'أصفر': '#fdd835', 'اصفر': '#fdd835',
    'black': '#212121', 'أسود': '#212121', 'اسود': '#212121',
    'white': '#fafafa', 'أبيض': '#fafafa', 'ابيض': '#fafafa',
    'orange': '#fb8c00', 'برتقالي': '#fb8c00', 'برتقالى': '#fb8c00',
    'pink': '#ec407a', 'وردي': '#ec407a', 'وردى': '#ec407a',
    'purple': '#8e24aa', 'بنفسجي': '#8e24aa', 'بنفسجى': '#8e24aa',
    'brown': '#6d4c41', 'بني': '#6d4c41', 'بنى': '#6d4c41',
    'gray': '#757575', 'grey': '#757575', 'رمادي': '#757575', 'رمادى': '#757575', 'رصاصي': '#757575',
    'navy': '#0d47a1', 'كحلي': '#0d47a1', 'نيلي': '#0d47a1',
    'beige': '#d7ccc8', 'بيج': '#d7ccc8', 'كاكي': '#c4a574', 'khaki': '#c4a574',
    'gold': '#ffb300', 'ذهبي': '#ffb300', 'ذهبى': '#ffb300',
    'silver': '#9e9e9e', 'فضي': '#9e9e9e', 'فضى': '#9e9e9e'
  };

  function getColorHex(val) {
    if (!val || typeof val !== 'string') return null;
    var k = val.trim().toLowerCase();
    return COLOR_MAP[k] || null;
  }

  function isColorAttribute(name) {
    if (!name || typeof name !== 'string') return false;
    var n = name.trim().toLowerCase();
    return n === 'لون' || n === 'color' || n === 'colour' || n === 'اللون';
  }

  function isPresetAttribute(name) {
    if (!name || typeof name !== 'string') return false;
    var n = name.trim();
    return n === 'لون' || n === 'مقاس' || n.toLowerCase() === 'color' || n.toLowerCase() === 'size';
  }

  function initQuickVariations() {
    var container = document.getElementById('quick-variations-app');
    if (!container) return;

    var itemId = parseInt(container.getAttribute('data-item-id'), 10) || 0;
    var languageCode = container.getAttribute('data-language-code') || '';
    var currencySymbol = container.getAttribute('data-currency-symbol') || '';
    var saveUrl = container.getAttribute('data-save-url') || '';
    var getUrl = container.getAttribute('data-get-url') || '';
    var formMode = (container.getAttribute('data-form-mode') || 'edit').toLowerCase();
    var t = {};
    try {
      var raw = container.getAttribute('data-translations');
      if (raw) t = JSON.parse(raw);
    } catch (e) {}
    var locale = (container.getAttribute('data-locale') || '').toLowerCase();
    var isRtl = locale === 'ar' || locale === 'user_ar' || locale === 'admin_ar' || locale.indexOf('_ar') !== -1;
    var arFallback = {
      'Attribute name': 'اسم النوع',
      'e.g. Color, Size': 'مثل: لون، مقاس',
      'Options (press Enter to add)': 'الخيارات (اضغط Enter للإضافة)',
      'e.g. Red, Blue': 'مثل: أحمر، أزرق',
      'Option': 'الخيار',
      'Price': 'السعر',
      'Stock': 'الكمية',
      'Remove': 'حذف',
      'Please set attribute name and at least one option for each row.': 'اكتب اسم النوع (مثل اللون) واختر خيارًا واحدًا على الأقل في كل صف.',
      'Saved.': 'تم الحفظ.',
      'Error.': 'حدث خطأ.',
      'Request failed.': 'فشل الاتصال. جرّب مرة أخرى.',
      'Variations saved successfully.': 'تم حفظ الخيارات بنجاح.'
    };
    function tr(key, fallback) {
      var val = (t && t[key]);
      if (val && val !== key && val.indexOf('quickvariations::') !== 0) return val;
      if (isRtl && arFallback[key]) return arFallback[key];
      return fallback || key;
    }

    var attributesContainer = document.getElementById('qv-attributes-container');
    var saveBtn = document.getElementById('qv-save');
    var addAttrBtn = document.getElementById('qv-add-attribute');
    var messageEl = document.getElementById('qv-message');
    var loader = container.querySelector('.request-loader');

    var attributes = [];
    var hiddenInput = document.getElementById('qv_attributes');
    var itemForm = document.getElementById('itemForm');

    // Variant option images (injected via module render hook; edit mode only).
    var optionImageMap = {};
    try {
      var mapEl = document.getElementById('qvVariantOptionImageMap');
      if (mapEl && mapEl.textContent) {
        optionImageMap = JSON.parse(mapEl.textContent) || {};
      }
    } catch (e) { optionImageMap = {}; }
    var optionImageCfg = null;
    try {
      var cfgEl = document.getElementById('qvVariantOptionImageCfg');
      if (cfgEl && cfgEl.textContent) {
        optionImageCfg = JSON.parse(cfgEl.textContent) || null;
      }
    } catch (e) { optionImageCfg = null; }
    var optionImagePickerMount = document.getElementById('qvOptionImageAttributePicker');

    function normAttrName(s) {
      return (s || '').toString().trim().toLowerCase();
    }

    function optionImageAttrStorageKey() {
      return 'qv_option_image_attr_' + String(itemId || 0);
    }

    function getSelectedImageAttrName() {
      try {
        return (localStorage.getItem(optionImageAttrStorageKey()) || '').toString();
      } catch (e) {
        return '';
      }
    }

    function setSelectedImageAttrName(name) {
      try {
        localStorage.setItem(optionImageAttrStorageKey(), String(name || ''));
      } catch (e) {}
    }

    function ensureOptionImagePicker() {
      if (!optionImageCfg || formMode !== 'edit' || !optionImagePickerMount) return;

      // Build attribute list from current attributes state
      var names = [];
      (attributes || []).forEach(function(a) {
        var n = (a && a.name) ? a.name.toString().trim() : '';
        if (!n) return;
        if (names.indexOf(n) === -1) names.push(n);
      });

      // Default: choose Color if exists, else None
      var selected = getSelectedImageAttrName();
      if (!selected) {
        for (var i = 0; i < names.length; i++) {
          if (isColorAttribute(names[i])) {
            selected = names[i];
            break;
          }
        }
        setSelectedImageAttrName(selected);
      }

      // Render minimal picker
      var html = '' +
        '<div class="d-flex align-items-center" style="gap:8px;">' +
          '<label class="small text-muted mb-0">صور للسمة:</label>' +
          '<select id="qv-opt-image-attr-select" class="form-control form-control-sm" style="max-width:240px;">' +
            '<option value="">(بدون)</option>' +
            names.map(function(n) {
              var sel = (n === selected) ? ' selected' : '';
              return '<option value="' + escapeHtml(n) + '"' + sel + '>' + escapeHtml(n) + '</option>';
            }).join('') +
          '</select>' +
          '<small class="text-muted">(اختياري)</small>' +
        '</div>';
      optionImagePickerMount.innerHTML = html;

      var selEl = document.getElementById('qv-opt-image-attr-select');
      if (selEl) {
        selEl.onchange = function() {
          setSelectedImageAttrName(selEl.value || '');
          renderAll();
        };
      }
    }

    function syncHidden() {
      if (!hiddenInput) return;
      try {
        hiddenInput.value = JSON.stringify(attributes || []);
      } catch (e) {
        hiddenInput.value = '[]';
      }
    }

    function syncHiddenFromDom() {
      if (!hiddenInput) return;
      try {
        hiddenInput.value = JSON.stringify(collectAttributes() || []);
      } catch (e) {
        hiddenInput.value = '[]';
      }
    }

    function showMessage(text, isError) {
      if (!messageEl) return;
      messageEl.textContent = text || '';
      messageEl.className = 'mt-2 small ' + (isError ? 'text-danger' : 'text-success');
    }

    function setLoading(loading) {
      if (loader) loader.classList.toggle('d-none', !loading);
      if (saveBtn) saveBtn.disabled = loading;
    }

    function escapeHtml(s) {
      var div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    }

    function optionDisplayHtml(val, isColor) {
      var hex = isColor ? getColorHex(val) : null;
      var text = escapeHtml(val);
      if (hex) {
        return '<span class="qv-swatch" style="background-color:' + hex + ';border:1px solid #dee2e6;" title="' + text + '"></span> ' + text;
      }
      return text;
    }

    function optionImageControlsHtml(optionId, attrName) {
      if (!optionImageCfg || formMode !== 'edit') return '';
      // Only show for chosen attribute (merchant picks which attribute gets images)
      var chosen = getSelectedImageAttrName();
      if (chosen) {
        if (normAttrName(chosen) !== normAttrName(attrName)) return '';
      } else {
        return '';
      }
      optionId = parseInt(optionId || '0', 10) || 0;
      if (optionId < 1) return '';
      var url = optionImageMap[optionId] || '';
      var has = !!url;
      return '' +
        '<span class="qv-opt-img" style="display:inline-flex;align-items:center;gap:6px;">' +
          '<button type="button" class="btn btn-outline-secondary btn-sm qv-opt-image-btn" data-option-id="' + optionId + '" title="Image"><i class="fas fa-image"></i></button>' +
          '<input type="file" class="d-none qv-opt-image-file" data-option-id="' + optionId + '" accept="image/jpeg,image/png,image/webp">' +
          '<a class="qv-opt-image-preview ' + (has ? '' : 'd-none') + '" href="' + (has ? url : '#') + '" target="_blank" rel="noopener">' +
            '<img class="qv-opt-image-thumb" src="' + (has ? url : '') + '" alt="" style="width:26px;height:26px;border-radius:6px;object-fit:cover;">' +
          '</a>' +
          '<button type="button" class="btn btn-outline-danger btn-sm qv-opt-image-delete ' + (has ? '' : 'd-none') + '" data-option-id="' + optionId + '" title="' + escapeHtml(tr('Remove', 'Remove')) + '"><i class="fas fa-times"></i></button>' +
        '</span>';
    }

    function renderAttribute(attrIndex, attr) {
      var name = (attr && attr.name) || '';
      var options = (attr && attr.options) || [];
      var isColor = isColorAttribute(name);
      var isPreset = isPresetAttribute(name);
      var optionsList = options.map(function(o) {
        var optDisplay = optionDisplayHtml(o.value, isColor);
        var optId = parseInt(o.id || '0', 10) || 0;
        var imgCtl = optionImageControlsHtml(optId, name);
        return '<tr data-option-id="' + optId + '"><td class="qv-opt-cell">' + optDisplay + '</td><td><input type="number" step="0.01" min="0" class="form-control form-control-sm qv-opt-price" value="' + (parseFloat(o.price) || 0) + '"></td><td><input type="number" min="0" class="form-control form-control-sm qv-opt-stock" value="' + (parseInt(o.stock, 10) || 0) + '"></td><td class="text-nowrap"><span style="display:inline-flex;align-items:center;gap:6px;"><button type="button" class="btn btn-outline-danger btn-sm qv-remove-opt" title="' + escapeHtml(tr('Remove', 'Remove')) + '"><i class="fas fa-times"></i></button>' + imgCtl + '</span></td></tr>';
      }).join('');
      var optionTagsHtml = options.map(function(o) {
        var optDisplay = optionDisplayHtml(o.value, isColor);
        return '<span class="badge badge-secondary mr-1 mb-1 qv-tag">' + optDisplay + ' <i class="fas fa-times qv-tag-remove"></i></span>';
      }).join('');

      var nameRowHtml;
      if (isPreset) {
        nameRowHtml =
          '<div class="row align-items-end">' +
            '<div class="col">' +
              '<input type="hidden" class="qv-attr-name" value="' + escapeHtml(name) + '">' +
              '<p class="mb-1 font-weight-bold text-primary qv-preset-label">' + escapeHtml(name) + '</p>' +
              '<label class="small text-muted mb-1">' + escapeHtml(tr('Options (press Enter to add)', 'Options (press Enter to add)')) + '</label>' +
              '<input type="text" class="form-control form-control-sm qv-options-input" placeholder="' + escapeHtml(tr('e.g. Red, Blue', 'e.g. Red, Blue')) + '">' +
              '<div class="qv-tags mt-1">' + optionTagsHtml + '</div>' +
            '</div>' +
            '<div class="col-auto">' +
              '<button type="button" class="btn btn-outline-danger btn-sm qv-remove-attr" title="' + escapeHtml(tr('Remove', 'Remove')) + '"><i class="fas fa-trash"></i></button>' +
            '</div>' +
          '</div>';
      } else {
        nameRowHtml =
          '<div class="row align-items-end">' +
            '<div class="col-md-4">' +
              '<label class="small font-weight-bold mb-1">' + escapeHtml(tr('Attribute name', 'Attribute name')) + '</label>' +
              '<input type="text" class="form-control qv-attr-name" value="' + escapeHtml(name) + '" placeholder="' + escapeHtml(tr('e.g. Color, Size', 'e.g. Color, Size')) + '">' +
            '</div>' +
            '<div class="col-md-6">' +
              '<label class="small font-weight-bold mb-1">' + escapeHtml(tr('Options (press Enter to add)', 'Options (press Enter to add)')) + '</label>' +
              '<input type="text" class="form-control qv-options-input" placeholder="' + escapeHtml(tr('e.g. Red, Blue', 'e.g. Red, Blue')) + '">' +
              '<div class="qv-tags mt-2">' + optionTagsHtml + '</div>' +
            '</div>' +
            '<div class="col-md-2 text-right">' +
              '<button type="button" class="btn btn-outline-danger btn-sm qv-remove-attr" title="' + escapeHtml(tr('Remove', 'Remove')) + '"><i class="fas fa-trash"></i></button>' +
            '</div>' +
          '</div>';
      }

      var html =
        '<div class="card mb-3 qv-attribute-box" data-attr-index="' + attrIndex + '">' +
          '<div class="card-body">' +
            nameRowHtml +
            '<div class="table-responsive mt-3">' +
              '<table class="table table-sm table-bordered qv-options-table">' +
                '<thead><tr><th>' + escapeHtml(tr('Option', 'Option')) + '</th><th>' + escapeHtml(tr('Price', 'Price')) + ' (' + escapeHtml(currencySymbol) + ')</th><th>' + escapeHtml(tr('Stock', 'Stock')) + '</th><th></th></tr></thead>' +
                '<tbody>' + optionsList + '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +
        '</div>';
      return html;
    }

  function collectAttributes() {
    var boxes = attributesContainer.querySelectorAll('.qv-attribute-box');
    var result = [];
    boxes.forEach(function(box) {
      var nameInput = box.querySelector('.qv-attr-name');
      var name = (nameInput && nameInput.value.trim()) || '';
      var rows = box.querySelectorAll('.qv-options-table tbody tr');
      var options = [];
      rows.forEach(function(row) {
        var firstCell = row.querySelector('td.qv-opt-cell');
        if (!firstCell) firstCell = row.querySelector('td');
        var value = (firstCell && firstCell.textContent.trim()) || '';
        if (!value) return;
        var priceInp = row.querySelector('.qv-opt-price');
        var stockInp = row.querySelector('.qv-opt-stock');
        options.push({
          value: value,
          price: parseFloat(priceInp && priceInp.value) || 0,
          stock: parseInt(stockInp && stockInp.value, 10) || 0
        });
      });
      if (name || options.length) {
        result.push({ name: name, options: options });
      }
    });
    return result;
  }

  function setOptionRowImage(optionId, url) {
    optionId = parseInt(optionId || '0', 10) || 0;
    if (optionId < 1) return;
    var row = attributesContainer.querySelector('tr[data-option-id=\"' + optionId + '\"]');
    if (!row) return;
    var a = row.querySelector('.qv-opt-image-preview');
    var img = row.querySelector('.qv-opt-image-thumb');
    var del = row.querySelector('.qv-opt-image-delete');
    if (!a || !img || !del) return;

    if (url) {
      optionImageMap[optionId] = url;
      a.classList.remove('d-none');
      del.classList.remove('d-none');
      a.setAttribute('href', url);
      img.setAttribute('src', url);
    } else {
      delete optionImageMap[optionId];
      a.classList.add('d-none');
      del.classList.add('d-none');
      a.setAttribute('href', '#');
      img.setAttribute('src', '');
    }
  }

  function uploadOptionImage(optionId, file) {
    if (!optionImageCfg || !optionImageCfg.uploadUrl || !optionImageCfg.csrf) return;
    optionId = parseInt(optionId || '0', 10) || 0;
    if (itemId < 1 || optionId < 1 || !file) return;

    var fd = new FormData();
    fd.append('item_id', String(itemId));
    fd.append('option_id', String(optionId));
    fd.append('file', file);

    fetch(optionImageCfg.uploadUrl, {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': optionImageCfg.csrf, 'Accept': 'application/json' },
      body: fd
    })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { ok: r.ok, json: j, status: r.status }; }); })
      .then(function (res) {
        if (!res.ok || !res.json || !res.json.ok) return;
        if (res.json.image_url) setOptionRowImage(optionId, res.json.image_url);
      })
      .catch(function () {});
  }

  function deleteOptionImage(optionId) {
    if (!optionImageCfg || !optionImageCfg.deleteUrl || !optionImageCfg.csrf) return;
    optionId = parseInt(optionId || '0', 10) || 0;
    if (itemId < 1 || optionId < 1) return;

    fetch(optionImageCfg.deleteUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': optionImageCfg.csrf, 'Accept': 'application/json' },
      body: JSON.stringify({ item_id: itemId, option_id: optionId })
    })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { ok: r.ok, json: j, status: r.status }; }); })
      .then(function (res) {
        if (!res.ok || !res.json || !res.json.ok) return;
        setOptionRowImage(optionId, null);
      })
      .catch(function () {});
  }

  function renderAll() {
    attributesContainer.innerHTML = '';
    if (attributes.length === 0) {
      syncHidden();
      return;
    }
    ensureOptionImagePicker();
    attributes.forEach(function(attr, i) {
      var div = document.createElement('div');
      div.innerHTML = renderAttribute(i, attr);
      attributesContainer.appendChild(div.firstElementChild);
    });
    bindEvents();
    syncHidden();
  }

  function bindEvents() {
    // Any change in inputs should update hidden JSON in create mode
    if (formMode === 'create') {
      attributesContainer.querySelectorAll('.qv-attr-name, .qv-opt-price, .qv-opt-stock').forEach(function(inp) {
        inp.oninput = function() {
          syncHiddenFromDom();
        };
      });
    }

    attributesContainer.querySelectorAll('.qv-options-input').forEach(function(input) {
      input.onkeydown = function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var val = this.value.trim();
          if (!val) return;
          var box = this.closest('.qv-attribute-box');
          var nameInput = box.querySelector('.qv-attr-name');
          var isColor = isColorAttribute((nameInput && nameInput.value) || '');
          var tagsDiv = box.querySelector('.qv-tags');
          this.value = '';
          var tbody = box.querySelector('.qv-options-table tbody');
          var tr = document.createElement('tr');
          var optDisplay = optionDisplayHtml(val, isColor);
          tr.innerHTML = '<td class="qv-opt-cell">' + optDisplay + '</td><td><input type="number" step="0.01" min="0" class="form-control form-control-sm qv-opt-price" value="0"></td><td><input type="number" min="0" class="form-control form-control-sm qv-opt-stock" value="0"></td><td><button type="button" class="btn btn-outline-danger btn-sm qv-remove-opt"><i class="fas fa-times"></i></button></td>';
          tbody.appendChild(tr);
          var tag = document.createElement('span');
          tag.className = 'badge badge-secondary mr-1 mb-1 qv-tag';
          tag.innerHTML = optDisplay + ' <i class="fas fa-times qv-tag-remove"></i>';
          tagsDiv.appendChild(tag);
          tag.querySelector('.qv-tag-remove').addEventListener('click', function() {
            var idx2 = Array.prototype.indexOf.call(tagsDiv.querySelectorAll('.qv-tag'), tag);
            tag.remove();
            var rows = tbody.querySelectorAll('tr');
            if (rows[idx2]) rows[idx2].remove();
          });
          tr.querySelector('.qv-remove-opt').addEventListener('click', function() {
            tr.remove();
            tag.remove();
            syncHiddenFromDom();
          });
          syncHiddenFromDom();
        }
      };
    });

    // Option image controls (edit mode only; option_id must exist).
    attributesContainer.querySelectorAll('.qv-opt-image-btn').forEach(function(btn) {
      btn.onclick = function() {
        var optionId = parseInt(btn.getAttribute('data-option-id') || '0', 10) || 0;
        var fileInp = attributesContainer.querySelector('.qv-opt-image-file[data-option-id=\"' + optionId + '\"]');
        if (fileInp) fileInp.click();
      };
    });

    attributesContainer.querySelectorAll('.qv-opt-image-file').forEach(function(inp) {
      inp.onchange = function() {
        var optionId = parseInt(inp.getAttribute('data-option-id') || '0', 10) || 0;
        var file = inp.files && inp.files[0];
        if (file) uploadOptionImage(optionId, file);
        inp.value = '';
      };
    });

    attributesContainer.querySelectorAll('.qv-opt-image-delete').forEach(function(btn) {
      btn.onclick = function() {
        var optionId = parseInt(btn.getAttribute('data-option-id') || '0', 10) || 0;
        deleteOptionImage(optionId);
      };
    });

    attributesContainer.querySelectorAll('.qv-remove-attr').forEach(function(btn) {
      btn.onclick = function() {
        var box = this.closest('.qv-attribute-box');
        var i = Array.prototype.indexOf.call(attributesContainer.querySelectorAll('.qv-attribute-box'), box);
        attributes.splice(i, 1);
        box.remove();
        syncHidden();
      };
    });

    attributesContainer.querySelectorAll('.qv-remove-opt').forEach(function(btn) {
      btn.onclick = function() {
        var row = this.closest('tr');
        var box = this.closest('.qv-attribute-box');
        var tbody = box.querySelector('.qv-options-table tbody');
        var tagsDiv = box.querySelector('.qv-tags');
        var idx = Array.prototype.indexOf.call(tbody.querySelectorAll('tr'), row);
        row.remove();
        var tag = tagsDiv.querySelectorAll('.qv-tag')[idx];
        if (tag) tag.remove();
        var attrIndex = Array.prototype.indexOf.call(attributesContainer.querySelectorAll('.qv-attribute-box'), box);
        if (attributes[attrIndex] && attributes[attrIndex].options) attributes[attrIndex].options.splice(idx, 1);
        syncHidden();
      };
    });
  }

  addAttrBtn.addEventListener('click', function() {
    attributes.push({ name: '', options: [] });
    var div = document.createElement('div');
    div.innerHTML = renderAttribute(attributes.length - 1, { name: '', options: [] });
    attributesContainer.appendChild(div.firstElementChild);
    bindEvents();
    syncHidden();
  });

  saveBtn.addEventListener('click', function() {
    var data = collectAttributes();
    var valid = true;
    data.forEach(function(a) {
      if (!a.name.trim()) valid = false;
      if (!a.options || a.options.length === 0) valid = false;
    });
    if (!valid) {
      showMessage(tr('Please set attribute name and at least one option for each row.', 'Please set attribute name and at least one option for each row.'), true);
      return;
    }

    // Create mode: do not call API. Store JSON in hidden input; it will be saved after product creation.
    if (formMode === 'create' || !saveUrl || itemId < 1) {
      attributes = data;
      syncHidden();
      showMessage(tr('Saved.', 'Saved.'));
      return;
    }

    setLoading(true);
    showMessage('');

    var payload = {
      item_id: itemId,
      language_code: languageCode,
      attributes: data
    };

    var csrf = (document.querySelector('meta[name="csrf-token"]') || {}).getAttribute ? document.querySelector('meta[name="csrf-token"]').getAttribute('content') : '';
    if (!csrf && document.cookie) {
      var m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
      if (m) csrf = decodeURIComponent(m[1]);
    }
    fetch(saveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf || '',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    }).then(function(r) {
      return r.json().then(function(j) {
        return { ok: r.ok, status: r.status, json: j };
      });
    }).then(function(result) {
      setLoading(false);
      if (result.ok && result.json.success) {
        var successMsg = result.json.message;
        if (successMsg && (successMsg.indexOf('Variations saved successfully') !== -1 || successMsg.indexOf('quickvariations::') === 0))
          successMsg = tr('Variations saved successfully.', 'Variations saved successfully.');
        showMessage(successMsg || tr('Saved.', 'Saved.'));
      } else {
        var msg = (result.json && result.json.message) || tr('Error.', 'Error.');
        if (result.json && result.json.errors) {
          var errs = [];
          Object.keys(result.json.errors).forEach(function(k) {
            errs.push(result.json.errors[k][0]);
          });
          msg = errs.join(' ');
        }
        showMessage(msg, true);
      }
    }).catch(function() {
      setLoading(false);
      showMessage(tr('Request failed.', 'Request failed.'), true);
    });
  });

  // Create mode safety: ensure hidden JSON is set before submitting the product form,
  // even if merchant never clicked "Apply options".
  if (formMode === 'create' && itemForm && hiddenInput) {
    itemForm.addEventListener('submit', function() {
      syncHiddenFromDom();
    });
  }

  function load() {
    if (itemId < 1 || !getUrl || formMode === 'create') {
      renderAll();
      return;
    }
    setLoading(true);
    fetch(getUrl, {
      method: 'GET',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    }).then(function(r) {
      if (!r.ok) {
        setLoading(false);
        attributes = [];
        renderAll();
        return null;
      }
      return r.json();
    }).then(function(data) {
      setLoading(false);
      if (data && Array.isArray(data.attributes)) {
        attributes = data.attributes;
      } else {
        attributes = [];
      }
      renderAll();
    }).catch(function() {
      setLoading(false);
      attributes = [];
      renderAll();
    });
  }

    function bindPresetButtons() {
      container.querySelectorAll('.qv-preset').forEach(function(btn) {
        btn.onclick = function() {
          var name = this.getAttribute('data-preset-name');
          if (name) {
            attributes.push({ name: name, options: [] });
            renderAll();
          }
        };
      });
    }

    load();
    bindPresetButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickVariations);
  } else {
    initQuickVariations();
  }
})();
