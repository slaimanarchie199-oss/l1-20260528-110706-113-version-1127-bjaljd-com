function setupMoviePlayer(source) {
  var video = document.getElementById("movie-player");
  var cover = document.getElementById("player-cover");
  var started = false;
  var hls = null;

  if (!video || !cover || !source) {
    return;
  }

  function prepare() {
    if (started) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    started = true;
  }

  function play() {
    prepare();
    cover.classList.add("is-hidden");
    video.setAttribute("controls", "controls");
    var result = video.play();

    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  cover.addEventListener("click", play);

  video.addEventListener("click", function () {
    if (!started || video.paused) {
      play();
    } else {
      video.pause();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
