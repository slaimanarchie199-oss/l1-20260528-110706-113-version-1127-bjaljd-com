(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var toggle = qs('[data-menu-toggle]');
    var panel = qs('[data-mobile-panel]');

    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupSiteSearchForms() {
    qsa('[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = qs('input[name="q"]', form);
        var target = form.getAttribute('data-search-url') || 'search.html';
        var query = input ? input.value.trim() : '';
        var url = query ? target + '?q=' + encodeURIComponent(query) : target;
        window.location.href = url;
      });
    });
  }

  function setupHero() {
    var slides = qsa('[data-hero-slide]');
    var dots = qsa('[data-hero-dot]');

    if (!slides.length || !dots.length) {
      return;
    }

    var active = 0;

    function show(index) {
      active = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    window.setInterval(function () {
      show((active + 1) % slides.length);
    }, 6200);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilters() {
    var panels = qsa('[data-filter-panel]');

    panels.forEach(function (panel) {
      var input = qs('[data-filter-input]', panel);
      var year = qs('[data-filter-year]', panel);
      var type = qs('[data-filter-type]', panel);
      var targetSelector = panel.getAttribute('data-filter-target');
      var target = targetSelector ? qs(targetSelector) : null;
      var cards = target ? qsa('.movie-card', target) : [];
      var empty = qs('[data-filter-empty]', panel);

      function apply() {
        var keyword = normalize(input ? input.value : '');
        var yearValue = normalize(year ? year.value : '');
        var typeValue = normalize(type ? type.value : '');
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search') || card.textContent);
          var cardYear = normalize(card.getAttribute('data-year'));
          var cardType = normalize(card.getAttribute('data-type'));
          var matched = true;

          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }

          if (yearValue && cardYear !== yearValue) {
            matched = false;
          }

          if (typeValue && cardType !== typeValue) {
            matched = false;
          }

          card.hidden = !matched;

          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [input, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  }

  function movieCard(movie) {
    var tags = Array.isArray(movie.tags) ? movie.tags.join(' ') : '';
    return [
      '<article class="movie-card card-grid" data-title="' + escapeHtml(movie.title) + '" data-genre="' + escapeHtml(movie.genre) + '" data-region="' + escapeHtml(movie.region) + '" data-type="' + escapeHtml(movie.type) + '" data-year="' + escapeHtml(movie.year) + '" data-tags="' + escapeHtml(tags) + '">',
      '  <a class="poster-link" href="movies/movie-' + escapeHtml(movie.id) + '.html">',
      '    <img src="' + escapeHtml(movie.poster) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="duration-badge">' + escapeHtml(movie.duration) + '</span>',
      '    <span class="play-float">▶</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <div class="card-category">' + escapeHtml(movie.genre) + '</div>',
      '    <h3><a href="movies/movie-' + escapeHtml(movie.id) + '.html">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.summary).slice(0, 90) + '</p>',
      '    <div class="card-foot">',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>评分 ' + escapeHtml(movie.score) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function setupSearchPage() {
    var form = qs('[data-search-page-form]');
    var input = qs('[data-search-page-input]');
    var results = qs('[data-search-results]');
    var status = qs('[data-search-status]');

    if (!form || !input || !results || !status || !window.MOVIES) {
      return;
    }

    function render(query) {
      var value = normalize(query);
      var movies = window.MOVIES || [];
      var matched = value
        ? movies.filter(function (movie) {
            var text = normalize([
              movie.title,
              movie.region,
              movie.type,
              movie.year,
              movie.genre,
              Array.isArray(movie.tags) ? movie.tags.join(' ') : '',
              movie.summary
            ].join(' '));
            return text.indexOf(value) !== -1;
          })
        : movies.slice(0, 48);

      var limited = matched.slice(0, 96);
      results.innerHTML = limited.map(movieCard).join('');
      status.textContent = value
        ? '找到 ' + matched.length + ' 部相关影片，当前显示前 ' + limited.length + ' 部。'
        : '默认展示 48 部精选影片，输入关键词可搜索全部片库。';

      if (!limited.length) {
        results.innerHTML = '<div class="search-empty">暂未找到匹配内容，请尝试更换关键词。</div>';
      }
    }

    var initialQuery = getQueryParam('q');
    input.value = initialQuery;
    render(initialQuery);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = input.value.trim();
      var url = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
      window.history.replaceState(null, '', url);
      render(query);
    });

    input.addEventListener('input', function () {
      render(input.value);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupSiteSearchForms();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
