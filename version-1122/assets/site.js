(function() {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function toggleMobileNav() {
        var button = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }

        button.addEventListener("click", function() {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function() {
                show(index + 1);
            }, 5600);
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener("click", function() {
                show(dotIndex);
                restart();
            });
        });

        if (previous) {
            previous.addEventListener("click", function() {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                show(index + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function setupFilters() {
        var roots = Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]"));

        roots.forEach(function(root) {
            var searchInput = root.querySelector("[data-filter-search]");
            var yearSelect = root.querySelector("[data-filter-year]");
            var typeSelect = root.querySelector("[data-filter-type]");
            var categorySelect = root.querySelector("[data-filter-category]");
            var count = root.querySelector("[data-result-count]");
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));

            function apply() {
                var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var type = typeSelect ? typeSelect.value : "";
                var category = categorySelect ? categorySelect.value : "";
                var shown = 0;

                cards.forEach(function(card) {
                    var matched = true;

                    if (query && (card.dataset.search || "").indexOf(query) === -1) {
                        matched = false;
                    }

                    if (year && card.dataset.year !== year) {
                        matched = false;
                    }

                    if (type && card.dataset.type !== type) {
                        matched = false;
                    }

                    if (category && card.dataset.category !== category) {
                        matched = false;
                    }

                    card.classList.toggle("hidden-by-filter", !matched);

                    if (matched) {
                        shown += 1;
                    }
                });

                if (count) {
                    count.textContent = String(shown);
                }
            }

            [searchInput, yearSelect, typeSelect, categorySelect].forEach(function(control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            if (searchInput && params.get("q")) {
                searchInput.value = params.get("q");
            }

            apply();
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-video-src]"));

        players.forEach(function(player) {
            if (player.dataset.initialized === "1") {
                return;
            }

            player.dataset.initialized = "1";

            var video = player.querySelector("video");
            var source = player.getAttribute("data-video-src");
            var playButtons = Array.prototype.slice.call(player.querySelectorAll("[data-play-toggle]"));
            var muteButton = player.querySelector("[data-mute-toggle]");
            var fullButton = player.querySelector("[data-fullscreen-toggle]");
            var status = player.querySelector("[data-player-status]");
            var message = player.querySelector("[data-player-message]");
            var hlsInstance = null;

            function setStatus(text) {
                if (status) {
                    status.textContent = text;
                }
            }

            function showMessage(text) {
                if (message) {
                    message.textContent = text;
                    message.classList.add("is-visible");
                }
            }

            function hideMessage() {
                if (message) {
                    message.classList.remove("is-visible");
                }
            }

            function initializeSource() {
                if (!video || !source) {
                    showMessage("当前条目暂无可用播放源");
                    setStatus("无播放源");
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });

                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);

                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
                        setStatus("已就绪");
                    });

                    hlsInstance.on(window.Hls.Events.ERROR, function(event, data) {
                        if (data && data.fatal) {
                            showMessage("视频加载失败，请稍后重试");
                            setStatus("加载失败");
                        }
                    });
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    video.addEventListener("loadedmetadata", function() {
                        setStatus("已就绪");
                    });
                    video.addEventListener("error", function() {
                        showMessage("视频加载失败，请稍后重试");
                        setStatus("加载失败");
                    });
                } else {
                    showMessage("当前浏览器需要 HLS 支持脚本后播放");
                    setStatus("等待支持");
                }
            }

            function togglePlay() {
                if (!video) {
                    return;
                }

                hideMessage();

                if (video.paused) {
                    var result = video.play();

                    if (result && typeof result.catch === "function") {
                        result.catch(function() {
                            showMessage("浏览器阻止了自动播放，请再次点击播放");
                        });
                    }
                } else {
                    video.pause();
                }
            }

            playButtons.forEach(function(button) {
                button.addEventListener("click", togglePlay);
            });

            if (video) {
                video.addEventListener("click", togglePlay);
                video.addEventListener("play", function() {
                    player.classList.add("is-playing");
                    setStatus("播放中");
                });
                video.addEventListener("pause", function() {
                    player.classList.remove("is-playing");
                    setStatus("已暂停");
                });
                video.addEventListener("waiting", function() {
                    setStatus("缓冲中");
                });
                video.addEventListener("canplay", function() {
                    setStatus(video.paused ? "已就绪" : "播放中");
                });
                video.addEventListener("ended", function() {
                    player.classList.remove("is-playing");
                    setStatus("播放结束");
                });
            }

            if (muteButton && video) {
                muteButton.addEventListener("click", function() {
                    video.muted = !video.muted;
                    muteButton.textContent = video.muted ? "取消静音" : "静音";
                });
            }

            if (fullButton) {
                fullButton.addEventListener("click", function() {
                    if (!document.fullscreenElement) {
                        player.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                });
            }

            initializeSource();
        });
    }

    ready(function() {
        toggleMobileNav();
        setupHero();
        setupFilters();
        setupPlayers();
    });
})();
