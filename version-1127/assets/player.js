(function () {
    function setupPlayer(shell) {
        var video = shell.querySelector('video');
        var button = shell.querySelector('.js-play-button');
        var source = shell.getAttribute('data-video');
        var loaded = false;
        var hls = null;

        function loadVideo() {
            if (loaded || !video || !source) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            loaded = true;
        }

        function playVideo() {
            loadVideo();
            shell.classList.add('is-playing');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    shell.classList.remove('is-playing');
                });
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(setupPlayer);
}());
