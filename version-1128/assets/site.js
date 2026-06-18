document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, position) {
      slide.classList.toggle("is-active", position === activeIndex);
    });

    dots.forEach(function (dot, position) {
      dot.classList.toggle("is-active", position === activeIndex);
    });
  }

  dots.forEach(function (dot, position) {
    dot.addEventListener("click", function () {
      showSlide(position);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector("[data-filter-input]");
  var filterYear = document.querySelector("[data-filter-year]");
  var filterType = document.querySelector("[data-filter-type]");
  var filterRegion = document.querySelector("[data-filter-region]");
  var filterStatus = document.querySelector("[data-filter-status]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
  var emptyState = document.querySelector("[data-empty-state]");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function cardText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-type"),
      card.getAttribute("data-region"),
      card.getAttribute("data-category"),
      card.getAttribute("data-genre"),
      card.textContent
    ].join(" "));
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var keyword = normalize(filterInput ? filterInput.value : "");
    var year = normalize(filterYear ? filterYear.value : "");
    var type = normalize(filterType ? filterType.value : "");
    var region = normalize(filterRegion ? filterRegion.value : "");
    var visible = 0;

    cards.forEach(function (card) {
      var matchedKeyword = !keyword || cardText(card).indexOf(keyword) !== -1;
      var matchedYear = !year || normalize(card.getAttribute("data-year")) === year;
      var matchedType = !type || normalize(card.getAttribute("data-type")) === type;
      var matchedRegion = !region || normalize(card.getAttribute("data-region")) === region;
      var matched = matchedKeyword && matchedYear && matchedType && matchedRegion;

      card.classList.toggle("is-hidden", !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (filterStatus) {
      filterStatus.textContent = keyword || year || type || region ? "匹配结果已更新" : "输入关键词即可筛选影片";
    }

    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
    }
  }

  [filterInput, filterYear, filterType, filterRegion].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });
});
