/* ============================================================
   PLURP YouTube Audio — plays a genre's real YouTube playlist
   through a hidden IFrame player, driven by the miniplayer.
   Used only for genres that carry a `playlist` id in club-data.js;
   everything else stays on the synthesized ClubAudio bed.
   ============================================================ */

(function () {
  var player = null;
  var apiReady = false;
  var readyCallbacks = [];
  var currentTitle = '';
  var currentVideoId = '';
  var isLooping = true;
  var onTrackChange = null;
  var currentPlaylistId = null;
  var playlistLength = 0;
  var playedIndices = [];

  function playlistLen() {
    if (player && player.getPlaylist) {
      var list = player.getPlaylist();
      if (list && list.length) playlistLength = list.length;
    }
    return playlistLength;
  }

  // Pick a random index, never repeating one already played this pass
  // unless loop is on — once every track has played, the pool refills.
  function pickIndex() {
    var len = playlistLen();
    if (!len) return 0;
    if (isLooping) return Math.floor(Math.random() * len);
    var pool = [];
    for (var i = 0; i < len; i++) {
      if (playedIndices.indexOf(i) === -1) pool.push(i);
    }
    if (pool.length === 0) {
      playedIndices = [];
      for (var j = 0; j < len; j++) pool.push(j);
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    readyCallbacks.forEach(function (cb) { cb(); });
    readyCallbacks = [];
  };

  function loadApiScript() {
    if (document.getElementById('yt-iframe-api')) return;
    var tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
  loadApiScript();

  function whenReady(cb) {
    if (apiReady && window.YT && window.YT.Player) cb();
    else readyCallbacks.push(cb);
  }

  function updateTitle() {
    if (!player || !player.getVideoData) return;
    var d = player.getVideoData();
    currentTitle = (d && d.title) || currentTitle;
    currentVideoId = (d && d.video_id) || currentVideoId;
    if (onTrackChange) onTrackChange(currentTitle, currentVideoId);
  }

  window.YTAudio = {
    init: function (playlistId, trackChangeCb) {
      onTrackChange = trackChangeCb;
      currentPlaylistId = playlistId;
      playlistLength = 0;
      playedIndices = [];
      whenReady(function () {
        player = new YT.Player('yt-miniplayer', {
          height: '1',
          width: '1',
          playerVars: {
            listType: 'playlist',
            list: playlistId,
            autoplay: 0,
            controls: 0,
            playsinline: 1
          },
          events: {
            onReady: function () {
              if (player.setLoop) player.setLoop(isLooping);
              var len = playlistLen();
              if (len) {
                var idx = Math.floor(Math.random() * len);
                playedIndices = [idx];
                player.cuePlaylist({ listType: 'playlist', list: currentPlaylistId, index: idx });
              }
            },
            onStateChange: function (e) {
              if (e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.CUED) {
                updateTitle();
              }
            }
          }
        });
      });
    },
    play: function () { if (player && player.playVideo) player.playVideo(); },
    pause: function () { if (player && player.pauseVideo) player.pauseVideo(); },
    toggle: function () {
      if (!player || !player.getPlayerState) return false;
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        return false;
      }
      player.playVideo();
      return true;
    },
    next: function () {
      if (!player || !player.playVideoAt) return;
      var idx = pickIndex();
      playedIndices.push(idx);
      player.playVideoAt(idx);
    },
    prev: function () { if (player && player.previousVideo) player.previousVideo(); },
    setLooping: function (v) {
      isLooping = v;
      if (player && player.setLoop) player.setLoop(v);
    },
    isLooping: function () { return isLooping; },
    isPlaying: function () {
      return !!(player && player.getPlayerState && player.getPlayerState() === YT.PlayerState.PLAYING);
    },
    currentTrackName: function () { return currentTitle; },
    currentVideoId: function () { return currentVideoId; },
    ready: function () { return !!player; }
  };
})();
