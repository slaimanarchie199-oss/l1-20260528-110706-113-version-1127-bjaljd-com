(function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  shells.forEach(function (shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-play-button]');
    var media = shell.getAttribute('data-media');
    var hls = null;
    var ready = false;

    function attachMedia() {
      if (!video || !media || ready) {
        return;
      }
      ready = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(media);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = media;
      } else {
        video.src = media;
      }
    }

    function playVideo() {
      attachMedia();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      if (video) {
        var action = video.play();
        if (action && typeof action.catch === 'function') {
          action.catch(function () {});
        }
      }
    }

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        event.preventDefault();
        playVideo();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        attachMedia();
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
