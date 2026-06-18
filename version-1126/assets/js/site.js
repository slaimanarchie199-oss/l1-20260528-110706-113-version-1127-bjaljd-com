(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var thumbs = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-thumb]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, idx) {
          slide.classList.toggle("active", idx === current);
        });
        dots.forEach(function (dot, idx) {
          dot.classList.toggle("active", idx === current);
        });
        thumbs.forEach(function (thumb, idx) {
          thumb.classList.toggle("active", idx === current);
        });
      }

      function schedule() {
        clearInterval(timer);
        timer = setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot, idx) {
        dot.addEventListener("click", function () {
          show(idx);
          schedule();
        });
      });

      thumbs.forEach(function (thumb, idx) {
        thumb.addEventListener("mouseenter", function () {
          show(idx);
          schedule();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          schedule();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          schedule();
        });
      }

      show(0);
      schedule();
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function (panel) {
      var section = panel.parentElement || document;
      var input = panel.querySelector("[data-filter-input]");
      var chips = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-value]"));
      var cards = Array.prototype.slice.call(section.querySelectorAll("[data-card]"));
      var chipValue = "";

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-search") || "").toLowerCase();
          var matchesText = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesChip = !chipValue || haystack.indexOf(chipValue.toLowerCase()) !== -1;
          card.classList.toggle("is-hidden", !(matchesText && matchesChip));
        });
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chipValue = chip.getAttribute("data-filter-value") || "";
          chips.forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
          applyFilter();
        });
      });

      applyFilter();
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q) {
      document.querySelectorAll("[data-filter-input]").forEach(function (input) {
        input.value = q;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
  });
})();
