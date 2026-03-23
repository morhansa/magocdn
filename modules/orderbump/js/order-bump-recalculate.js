/**
 * Order bump: shared payload for quick + standard checkout recalculate AJAX.
 */
(function () {
  'use strict';

  window.getOrderBumpRecalculateExtra = function () {
    var cb = document.querySelector('input[type="checkbox"][name="has_order_bump"]');
    if (!cb) {
      return {};
    }
    return { has_order_bump: cb.checked ? 1 : 0 };
  };

  function triggerRecalculateFromBump() {
    if (typeof window.debouncedRecalculateQuickCheckoutCart === 'function') {
      window.debouncedRecalculateQuickCheckoutCart();
      return;
    }
    if (typeof window.recalculateCheckoutCart === 'function') {
      window.recalculateCheckoutCart();
    }
  }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('input[type="checkbox"][name="has_order_bump"]')) {
      triggerRecalculateFromBump();
    }
  });
})();
