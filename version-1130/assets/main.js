(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    document.querySelectorAll('.site-header').forEach(function (header) {
      var toggle = header.querySelector('.nav-toggle');
      var menu = header.querySelector('.mobile-menu');
      if (!toggle || !menu) {
        return;
      }
      toggle.addEventListener('click', function () {
        menu.hidden = !menu.hidden;
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var panel = document.querySelector('[data-search-panel]');
    var grid = document.querySelector('[data-filterable]');
    if (!panel || !grid) {
      return;
    }
    var input = panel.querySelector('[data-movie-search]');
    var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var empty = document.querySelector('.filter-empty');
    var active = 'all';

    function cardText(card) {
      return [
        card.dataset.title,
        card.dataset.type,
        card.dataset.year,
        card.dataset.region,
        card.dataset.tags
      ].join(' ').toLowerCase();
    }

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;
      cards.forEach(function (card) {
        var text = cardText(card);
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchFilter = active === 'all' || text.indexOf(active.toLowerCase()) !== -1;
        var show = matchQuery && matchFilter;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (input) {
      input.addEventListener('input', apply);
      try {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
          input.value = q;
        }
      } catch (error) {}
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        active = chip.dataset.filter || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        apply();
      });
    });

    apply();
  }

  function setupPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('.play-overlay');
      var stream = shell.getAttribute('data-stream');
      var hls;
      var loaded = false;

      function load() {
        if (loaded || !video || !stream) {
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function play() {
        load();
        shell.classList.add('is-playing');
        if (button) {
          button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }
      if (video) {
        video.addEventListener('play', function () {
          shell.classList.add('is-playing');
          if (button) {
            button.classList.add('is-hidden');
          }
        });
        video.addEventListener('click', function () {
          if (!loaded) {
            play();
          }
        });
      }
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
