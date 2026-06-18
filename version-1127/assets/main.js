(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5800);
    }

    Array.prototype.slice.call(document.querySelectorAll('.filter-block')).forEach(function (block) {
        var input = block.querySelector('[data-search-input]');
        var clear = block.querySelector('[data-search-clear]');
        var buttons = Array.prototype.slice.call(block.querySelectorAll('[data-filter-value]'));
        var scope = block.parentElement || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var activeFilter = '';

        function cardText(card) {
            return [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-region') || '',
                card.getAttribute('data-year') || '',
                card.getAttribute('data-genre') || '',
                card.getAttribute('data-type') || '',
                card.getAttribute('data-tags') || ''
            ].join(' ').toLowerCase();
        }

        function applyFilter() {
            var query = input ? input.value.trim().toLowerCase() : '';
            cards.forEach(function (card) {
                var text = cardText(card);
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchFilter = !activeFilter || text.indexOf(activeFilter.toLowerCase()) !== -1;
                card.classList.toggle('is-hidden', !(matchQuery && matchFilter));
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        if (clear && input) {
            clear.addEventListener('click', function () {
                input.value = '';
                applyFilter();
                input.focus();
            });
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeFilter = button.getAttribute('data-filter-value') || '';
                buttons.forEach(function (item) {
                    item.classList.toggle('active', item === button);
                });
                applyFilter();
            });
        });
    });
}());
