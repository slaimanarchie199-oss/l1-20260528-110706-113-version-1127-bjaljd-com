(function () {
    document.querySelectorAll('[data-video-src]').forEach(function (shell) {
        var video = shell.querySelector('video');
        var overlay = shell.querySelector('.player-cover');
        var source = shell.getAttribute('data-video-src');
        var initialized = false;
        var hlsInstance = null;

        var initialize = function () {
            if (!video || !source || initialized) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }

            initialized = true;
        };

        var startPlayback = function () {
            initialize();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            if (video) {
                video.play().catch(function () {});
            }
        };

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startPlayback();
                }
            });
            video.addEventListener('play', function () {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
            });
            window.addEventListener('pagehide', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        }
    });
})();
