/**
 * Salla Modern: mobile drawer (menu + search) and cart dropdown
 */
(function () {
  "use strict";

  var drawerOverlay = document.getElementById("salla-drawer-overlay");
  var drawer = document.getElementById("salla-mobile-drawer");
  var menuTrigger = document.getElementById("salla-mobile-menu-trigger");
  var searchTrigger = document.getElementById("salla-mobile-search-trigger");
  var drawerClose = document.getElementById("salla-drawer-close");
  var drawerSearchInput = document.getElementById("salla-drawer-search-input");

  function openDrawer(focusSearch) {
    if (drawerOverlay) drawerOverlay.classList.add("salla-drawer-open");
    if (drawer) {
      drawer.classList.add("salla-drawer-open");
      drawer.setAttribute("aria-hidden", "false");
    }
    if (focusSearch && drawerSearchInput) {
      setTimeout(function () {
        drawerSearchInput.focus();
      }, 300);
    }
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (drawerOverlay) drawerOverlay.classList.remove("salla-drawer-open");
    if (drawer) {
      drawer.classList.remove("salla-drawer-open");
      drawer.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
  }

  if (menuTrigger) {
    menuTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openDrawer(false);
    });
  }
  if (searchTrigger) {
    searchTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openDrawer(true);
    });
  }
  if (drawerClose) {
    drawerClose.addEventListener("click", closeDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawer);
  }

  // Cart dropdown: hover on desktop; click toggle on touch/mobile
  var cartWrapper = document.querySelector(".salla-cart-dropdown-wrapper");
  var cartTrigger = document.querySelector(".salla-cart-trigger");
  if (cartWrapper && cartTrigger) {
    cartTrigger.addEventListener("click", function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        cartWrapper.classList.toggle("salla-cart-open");
      }
    });
    document.addEventListener("click", function (e) {
      if (cartWrapper.classList.contains("salla-cart-open") && !cartWrapper.contains(e.target)) {
        cartWrapper.classList.remove("salla-cart-open");
      }
    });
  }
})();
