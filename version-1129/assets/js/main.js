(function () {
    var navToggle = document.getElementById('mobileNavToggle');
    var mobileNav = document.getElementById('mobileNav');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-site-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[type="search"]');
            var value = input ? input.value.trim() : '';
            var target = value ? 'all.html?q=' + encodeURIComponent(value) : 'all.html';
            window.location.href = target;
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var active = 0;
        var timer = null;

        var showSlide = function (index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        };

        var start = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    var filterInput = document.querySelector('[data-card-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var count = document.querySelector('[data-filter-count]');

    var applyFilter = function (value) {
        var words = value.toLowerCase().split(/\s+/).filter(Boolean);
        var visible = 0;

        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-region') || '',
                card.getAttribute('data-genre') || '',
                card.getAttribute('data-year') || '',
                card.getAttribute('data-type') || '',
                card.textContent || ''
            ].join(' ').toLowerCase();
            var matched = words.every(function (word) {
                return text.indexOf(word) !== -1;
            });
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });

        if (count) {
            count.textContent = visible + ' 部影片';
        }
    };

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (query) {
            filterInput.value = query;
        }
        applyFilter(filterInput.value);
        filterInput.addEventListener('input', function () {
            applyFilter(filterInput.value);
        });
    }
})();
