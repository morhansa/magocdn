'use strict';

function initQuickVariations() {
  var container = document.getElementById('quick-variations-app');
  if (!container) return;

  var itemId = parseInt(container.getAttribute('data-item-id'), 10) || 0;
  var languageCode = container.getAttribute('data-language-code') || '';
  var currencySymbol = container.getAttribute('data-currency-symbol') || '';
  var saveUrl = container.getAttribute('data-save-url') || '';
  var getUrl = container.getAttribute('data-get-url') || '';

  var attributesContainer = document.getElementById('qv-attributes-container');
  var saveBtn = document.getElementById('qv-save');
  var addAttrBtn = document.getElementById('qv-add-attribute');
  var messageEl = document.getElementById('qv-message');
  var loader = container.querySelector('.request-loader');

  var attributes = [];

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

  function renderAttribute(attrIndex, attr) {
    var name = (attr && attr.name) || '';
    var options = (attr && attr.options) || [];
    var optionsList = options.map(function(o) {
      return '<tr><td>' + escapeHtml(o.value) + '</td><td><input type="number" step="0.01" min="0" class="form-control form-control-sm qv-opt-price" value="' + (parseFloat(o.price) || 0) + '"></td><td><input type="number" min="0" class="form-control form-control-sm qv-opt-stock" value="' + (parseInt(o.stock, 10) || 0) + '"></td><td><button type="button" class="btn btn-outline-danger btn-sm qv-remove-opt"><i class="fas fa-times"></i></button></td></tr>';
    }).join('');
    var optionTagsHtml = options.map(function(o) {
      return '<span class="badge badge-secondary mr-1 qv-tag">' + escapeHtml(o.value) + ' <i class="fas fa-times qv-tag-remove"></i></span>';
    }).join('');

    var html =
      '<div class="card mb-3 qv-attribute-box" data-attr-index="' + attrIndex + '">' +
        '<div class="card-body">' +
          '<div class="row align-items-center mb-2">' +
            '<div class="col-md-4">' +
              '<label class="small font-weight-bold">Attribute name</label>' +
              '<input type="text" class="form-control form-control-sm qv-attr-name" value="' + escapeHtml(name) + '" placeholder="e.g. Color, Size">' +
            '</div>' +
            '<div class="col-md-6">' +
              '<label class="small font-weight-bold">Options <span class="text-muted">(press Enter to add)</span></label>' +
              '<input type="text" class="form-control form-control-sm qv-options-input" placeholder="e.g. Red, Blue">' +
              '<div class="qv-tags mt-1">' + optionTagsHtml + '</div>' +
            '</div>' +
            '<div class="col-md-2 text-right">' +
              '<button type="button" class="btn btn-outline-danger btn-sm qv-remove-attr"><i class="fas fa-trash"></i></button>' +
            '</div>' +
          '</div>' +
          '<div class="table-responsive">' +
            '<table class="table table-sm table-bordered qv-options-table">' +
              '<thead><tr><th>Option</th><th>Price (' + escapeHtml(currencySymbol) + ')</th><th>Stock</th><th></th></tr></thead>' +
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
        var firstCell = row.querySelector('td');
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

  function renderAll() {
    attributesContainer.innerHTML = '';
    if (attributes.length === 0) {
      attributes = [{ name: '', options: [] }];
    }
    attributes.forEach(function(attr, i) {
      var div = document.createElement('div');
      div.innerHTML = renderAttribute(i, attr);
      attributesContainer.appendChild(div.firstElementChild);
    });
    bindEvents();
  }

  function bindEvents() {
    attributesContainer.querySelectorAll('.qv-options-input').forEach(function(input) {
      input.onkeydown = function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var val = this.value.trim();
          if (!val) return;
          var box = this.closest('.qv-attribute-box');
          var tagsDiv = box.querySelector('.qv-tags');
          this.value = '';
          var tbody = box.querySelector('.qv-options-table tbody');
          var tr = document.createElement('tr');
          tr.innerHTML = '<td>' + escapeHtml(val) + '</td><td><input type="number" step="0.01" min="0" class="form-control form-control-sm qv-opt-price" value="0"></td><td><input type="number" min="0" class="form-control form-control-sm qv-opt-stock" value="0"></td><td><button type="button" class="btn btn-outline-danger btn-sm qv-remove-opt"><i class="fas fa-times"></i></button></td>';
          tbody.appendChild(tr);
          var tag = document.createElement('span');
          tag.className = 'badge badge-secondary mr-1 qv-tag';
          tag.innerHTML = escapeHtml(val) + ' <i class="fas fa-times qv-tag-remove"></i>';
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
          });
        }
      };
    });

    attributesContainer.querySelectorAll('.qv-remove-attr').forEach(function(btn) {
      btn.onclick = function() {
        var box = this.closest('.qv-attribute-box');
        var i = Array.prototype.indexOf.call(attributesContainer.querySelectorAll('.qv-attribute-box'), box);
        attributes.splice(i, 1);
        box.remove();
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
      };
    });
  }

  addAttrBtn.addEventListener('click', function() {
    attributes.push({ name: '', options: [] });
    var div = document.createElement('div');
    div.innerHTML = renderAttribute(attributes.length - 1, { name: '', options: [] });
    attributesContainer.appendChild(div.firstElementChild);
    bindEvents();
  });

  saveBtn.addEventListener('click', function() {
    var data = collectAttributes();
    var valid = true;
    data.forEach(function(a) {
      if (!a.name.trim()) valid = false;
      if (!a.options || a.options.length === 0) valid = false;
    });
    if (!valid) {
      showMessage('Please set attribute name and at least one option for each row.', true);
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
        showMessage(result.json.message || 'Saved.');
      } else {
        var msg = (result.json && result.json.message) || 'Error.';
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
      showMessage('Request failed.', true);
    });
  });

  function load() {
    if (itemId < 1) {
      renderAll();
      return;
    }
    setLoading(true);
    fetch(getUrl, {
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    }).then(function(r) { return r.json(); }).then(function(data) {
      setLoading(false);
      if (data && data.attributes && data.attributes.length) {
        attributes = data.attributes;
      } else {
        attributes = [{ name: '', options: [] }];
      }
      renderAll();
    }).catch(function() {
      setLoading(false);
      attributes = [{ name: '', options: [] }];
      renderAll();
    });
  }

  load();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuickVariations);
} else {
  initQuickVariations();
}
