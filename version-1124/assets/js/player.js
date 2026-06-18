(function () {
  function setupPlayer() {
    var player = document.querySelector('[data-player]');

    if (!player) {
      return;
    }

    var button = player.querySelector('[data-player-button]');
    var note = player.querySelector('[data-player-note]');
    var title = player.getAttribute('data-title') || '影片';

    if (!button || !note) {
      return;
    }

    button.addEventListener('click', function () {
      button.textContent = '✓';
      note.textContent = '正在为您加载《' + title + '》播放信息。';
    });
  }

  document.addEventListener('DOMContentLoaded', setupPlayer);
})();
