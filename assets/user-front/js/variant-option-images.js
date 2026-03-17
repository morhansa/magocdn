(function () {
  'use strict';

  function safeJsonParse(txt) {
    try { return JSON.parse(txt); } catch (e) { return null; }
  }

  function getSelectedOptionIds(root) {
    var ids = [];

    // selects
    root.querySelectorAll('select[name="variant[]"]').forEach(function (sel) {
      var v = parseInt(sel.value || '0', 10);
      if (v > 0) ids.push(v);
    });

    // radio/checkbox
    root.querySelectorAll('input[name="variant[]"]:checked').forEach(function (inp) {
      var v = parseInt(inp.value || '0', 10);
      if (v > 0) ids.push(v);
    });

    // fallback for custom swatches (data-option-id on active)
    root.querySelectorAll('[data-variant-option-id].active,[data-option-id].active').forEach(function (el) {
      var raw = el.getAttribute('data-variant-option-id') || el.getAttribute('data-option-id');
      var v = parseInt(raw || '0', 10);
      if (v > 0) ids.push(v);
    });

    return ids;
  }

  function getActiveSlideImage() {
    var wrapper = document.querySelector('.product-gallery-wrapper');
    if (!wrapper) return null;

    var slide = wrapper.querySelector('.swiper-slide-active') || wrapper.querySelector('.swiper-slide');
    if (!slide) return null;

    var a = slide.querySelector('a') || null;
    var img = slide.querySelector('img') || null;
    if (!img) return null;

    return { wrapper: wrapper, slide: slide, a: a, img: img };
  }

  function swapMainImage(url) {
    if (!url) return;
    var active = getActiveSlideImage();
    if (!active) return;

    var img = active.img;
    if (img.getAttribute('src') === url) return;

    img.setAttribute('src', url);
    if (img.hasAttribute('srcset')) {
      img.removeAttribute('srcset');
    }
    if (active.a) {
      active.a.setAttribute('href', url);
    }
  }

  function resolveMap() {
    var el = document.getElementById('variantOptionImageMap');
    if (!el) return null;
    return safeJsonParse(el.textContent || '') || null;
  }

  var map = resolveMap(); // { optionId: url }
  if (!map) return;

  function onChange() {
    var form = document.querySelector('form#productForm') || document;
    var ids = getSelectedOptionIds(form);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      if (map[id]) {
        swapMainImage(map[id]);
        return;
      }
    }
  }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t) return;
    if ((t.name === 'variant[]') || (t.matches && t.matches('select[name="variant[]"],input[name="variant[]"]'))) {
      onChange();
    }
  });

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    // swatches often are buttons/anchors; any click in variant area should re-check
    if (t.closest && t.closest('.product-variations, .variations, .variation-area, .qc-variations')) {
      window.requestAnimationFrame(onChange);
    }
  });

  // initial
  onChange();
})();

