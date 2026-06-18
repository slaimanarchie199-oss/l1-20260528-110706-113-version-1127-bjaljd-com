(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', mobileNav.classList.contains('is-open'));
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      setSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(activeSlide + 1);
    }, 5200);
  }

  var filterForm = document.querySelector('[data-filter-form]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

  if (filterForm && cards.length) {
    var queryInput = filterForm.querySelector('[data-filter-query]');
    var categoryInput = filterForm.querySelector('[data-filter-category]');
    var yearInput = filterForm.querySelector('[data-filter-year]');
    var regionInput = filterForm.querySelector('[data-filter-region]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (queryInput && initialQuery) {
      queryInput.value = initialQuery;
    }

    function valueOf(input) {
      return input ? input.value.trim().toLowerCase() : '';
    }

    function applyFilters() {
      var query = valueOf(queryInput);
      var category = valueOf(categoryInput);
      var year = valueOf(yearInput);
      var region = valueOf(regionInput);

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-category') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-tags') || ''
        ].join(' ').toLowerCase();
        var ok = true;

        if (query && haystack.indexOf(query) === -1) {
          ok = false;
        }
        if (category && (card.getAttribute('data-category') || '').toLowerCase() !== category) {
          ok = false;
        }
        if (year && (card.getAttribute('data-year') || '').toLowerCase() !== year) {
          ok = false;
        }
        if (region && (card.getAttribute('data-region') || '').toLowerCase() !== region) {
          ok = false;
        }

        card.classList.toggle('hidden-by-filter', !ok);
      });
    }

    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilters();
    });

    [queryInput, categoryInput, yearInput, regionInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilters);
        input.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
