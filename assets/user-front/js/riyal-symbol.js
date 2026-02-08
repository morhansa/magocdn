/**
 * استبدال كلمة "ريال" برمز الريال (SVG) في الواجهة.
 * يشمل المحتوى الديناميكي (مثل .qc-total-row-value) عبر MutationObserver مع تخفيف الحمل.
 */
(function () {
  var RIAL_WORD = 'ريال';
  var RIAL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" aria-hidden="true"><path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg>';

  var styleInjected = false;
  var re = new RegExp(RIAL_WORD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

  function ensureStyle() {
    if (styleInjected) return;
    styleInjected = true;
    var style = document.createElement('style');
    style.textContent = '.riyal-symbol{display:inline-block;vertical-align:middle;width:1em;height:1em;margin:0 .2em;line-height:1}.riyal-symbol svg{width:100%;height:100%;display:block}';
    document.head.appendChild(style);
  }

  function replaceInNode(node) {
    if (!node.textContent || node.textContent.indexOf(RIAL_WORD) === -1) return;
    var parent = node.parentNode;
    if (!parent || parent.closest('script') || parent.closest('style') || parent.closest('noscript')) return;
    // CRITICAL FIX: Don't replace inside elements that already have riyal-symbol class
    if (parent.closest('.riyal-symbol')) return;
    var parts = node.textContent.split(re);
    if (parts.length < 2) return;
    ensureStyle();
    var frag = document.createDocumentFragment();
    for (var i = 0; i < parts.length; i++) {
      frag.appendChild(document.createTextNode(parts[i]));
      if (i < parts.length - 1) {
        var span = document.createElement('span');
        span.className = 'riyal-symbol';
        span.setAttribute('aria-label', RIAL_WORD);
        span.innerHTML = RIAL_SVG;
        frag.appendChild(span);
      }
    }
    parent.replaceChild(frag, node);
  }

  function processElement(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var toReplace = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.indexOf(RIAL_WORD) !== -1) {
        var p = node.parentNode;
        // CRITICAL FIX: Skip nodes inside riyal-symbol elements
        if (p && !p.closest('script') && !p.closest('style') && !p.closest('noscript') && !p.closest('.riyal-symbol')) toReplace.push(node);
      }
    }
    for (var j = 0; j < toReplace.length; j++) replaceInNode(toReplace[j]);
  }

  function run() {
    if (!document.body) return;
    ensureStyle();
    processElement(document.body);
  }

  function runOnQcTotals() {
    var sel = '.qc-total-row-value, .qc-total-price, #qc_subtotal_excl_vat, #qc_shipping_amount, #qc_vat_amount, #qc_total_price';
    var els = document.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) processElement(els[i]);
  }

  var debounceTimer;
  function debouncedRunOnQc() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      runOnQcTotals();
    }, 120);
  }

  function start() {
    requestAnimationFrame(run);
    setTimeout(runOnQcTotals, 400);
    setTimeout(runOnQcTotals, 1200);
    try {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.type === 'characterData' || m.type === 'childList') {
            debouncedRunOnQc();
            break;
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true, characterDataOldValue: false });
    } catch (e) { }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
