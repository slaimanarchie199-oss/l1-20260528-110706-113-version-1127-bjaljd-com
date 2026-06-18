(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setStatus(node, text) {
    if (!node) {
      return;
    }
    node.textContent = text || "";
    node.classList.toggle("show", Boolean(text));
  }

  function startPlayer(panel) {
    var video = panel.querySelector("video");
    var button = panel.querySelector("[data-play-button]");
    var status = panel.querySelector("[data-player-status]");
    var stream = video ? video.getAttribute("data-stream") : "";

    if (!video || !stream) {
      setStatus(status, "播放遇到问题，请稍后重试");
      return;
    }

    if (panel.getAttribute("data-ready") !== "1") {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus(status, "");
          video.play().catch(function () {});
        });
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal) {
            return;
          }
          setStatus(status, "播放遇到问题，请稍后重试");
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
        panel.hls = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else {
        video.src = stream;
      }
      panel.setAttribute("data-ready", "1");
    }

    if (button) {
      button.classList.add("hidden");
    }

    video.play().catch(function () {
      setStatus(status, "点击视频控件继续播放");
    });
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (panel) {
      var button = panel.querySelector("[data-play-button]");
      var video = panel.querySelector("video");

      if (button) {
        button.addEventListener("click", function () {
          startPlayer(panel);
        });
      }

      panel.addEventListener("click", function (event) {
        if (event.target === video || event.target === button || (button && button.contains(event.target))) {
          return;
        }
        startPlayer(panel);
      });
    });
  });
})();
