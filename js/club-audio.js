/* ============================================================
   PLURP Club Audio — fully synthesized via Web Audio API.
   No licensed tracks: this is the sound design layer for the
   ritual (sub-bass/kick/crowd) and a generative ambient bed per
   genre for the Inner World. Everything starts on a user gesture
   to respect autoplay policy.
   ============================================================ */

(function () {
  var ctx = null;
  var master = null;
  var nodes = {};
  var scheduler = null;
  var currentGenre = null;
  var isPlaying = false;
  var isLooping = true;
  var trackIndex = 0;
  var TRACKS_PER_GENRE = 3;

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ---- Nightclub ambience track — real recording, decoded once and
  // played back via AudioBufferSourceNode so the loop is sample-accurate
  // (no encoder-gap seam like a plain <audio loop> tag would have) ----
  var AMBIENCE_SRC = 'audio/nightclub-ambience.mp3';
  var ambienceBuffer = null;
  var ambienceBufferPromise = null;
  var ambienceGain = null;
  var ambienceActive = false;
  var ambienceTimer = null;
  var ambienceVoices = [];

  function loadAmbienceBuffer() {
    if (ambienceBufferPromise) return ambienceBufferPromise;
    ambienceBufferPromise = fetch(AMBIENCE_SRC)
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (data) { return ensureCtx().decodeAudioData(data); })
      .then(function (buf) { ambienceBuffer = buf; return buf; })
      .catch(function (err) { console.warn('PLURP ambience load failed', err); return null; });
    return ambienceBufferPromise;
  }
  loadAmbienceBuffer();

  // mp3 encoders pad the start/end of every decode with a few dozen ms of
  // silence, so a hard-cut loop() on the raw buffer clicks at the seam.
  // Instead we overlap successive plays and crossfade across the join —
  // that hides the seam regardless of where the encoder padding falls.
  function scheduleAmbienceVoice(buf, when) {
    if (!ambienceActive) return;
    var c = ensureCtx();
    var crossfade = Math.min(0.35, buf.duration / 4);

    var src = c.createBufferSource();
    src.buffer = buf;
    var voiceGain = c.createGain();
    voiceGain.gain.setValueAtTime(0, when);
    voiceGain.gain.linearRampToValueAtTime(1, when + crossfade);
    voiceGain.gain.setValueAtTime(1, when + buf.duration - crossfade);
    voiceGain.gain.linearRampToValueAtTime(0, when + buf.duration);
    src.connect(voiceGain).connect(ambienceGain);
    src.start(when);
    src.stop(when + buf.duration + 0.05);
    ambienceVoices.push(src);

    var nextWhen = when + buf.duration - crossfade;
    var delayMs = Math.max(0, (nextWhen - c.currentTime) * 1000 - 200);
    ambienceTimer = setTimeout(function () {
      scheduleAmbienceVoice(buf, nextWhen);
    }, delayMs);
  }

  function playAmbienceLoop() {
    var c = ensureCtx();
    loadAmbienceBuffer().then(function (buf) {
      if (!buf) return;
      stopAmbienceLoop(0);
      ambienceGain = c.createGain();
      ambienceGain.gain.value = 0;
      ambienceGain.connect(master);
      ambienceActive = true;
      scheduleAmbienceVoice(buf, c.currentTime + 0.05);
      fadeTo(ambienceGain, 0.45, 6);
    });
  }

  function stopAmbienceLoop(fadeTime) {
    if (!ambienceActive) return;
    fadeTime = fadeTime === undefined ? 1.5 : fadeTime;
    ambienceActive = false;
    clearTimeout(ambienceTimer);
    if (ambienceGain) fadeTo(ambienceGain, 0, fadeTime);
    var voices = ambienceVoices;
    ambienceVoices = [];
    setTimeout(function () {
      voices.forEach(function (v) { try { v.stop(); } catch (e) {} });
    }, fadeTime * 1000 + 100);
  }

  function fadeTo(gainNode, value, time) {
    var c = ensureCtx();
    gainNode.gain.cancelScheduledValues(c.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, c.currentTime);
    gainNode.gain.linearRampToValueAtTime(value, c.currentTime + time);
  }

  // ---- Outside-the-club atmosphere: the real nightclub ambience track ----
  function startOutsideAtmosphere() {
    ensureCtx();
    fadeTo(master, 0.55, 3.5);
    playAmbienceLoop();
    nodes.outside = true;
  }

  function stopOutsideAtmosphere(fadeTime) {
    if (!nodes.outside) return;
    fadeTime = fadeTime || 1.5;
    stopAmbienceLoop(fadeTime);
    nodes.outside = null;
  }

  // ---- Genre-specific generative ambient bed for the Inner World ----
  var GENRE_SOUND = {
    techno: { bpm: 132, wave: 'sawtooth', root: 55, filterQ: 8, hue: 'industrial' },
    psy: { bpm: 145, wave: 'sine', root: 65, filterQ: 3, hue: 'organic' },
    house: { bpm: 124, wave: 'triangle', root: 49, filterQ: 4, hue: 'warm' },
    disco: { bpm: 120, wave: 'square', root: 58, filterQ: 5, hue: 'glam' },
    beach: { bpm: 108, wave: 'sine', root: 43, filterQ: 2, hue: 'sunset' }
  };

  var TRACK_NAMES = {
    techno: ['Concrete Pulse', 'Acid Rain Session', 'Warehouse 4AM'],
    psy: ['Forest Frequency', 'Third Eye Loop', 'Trip Cycle One'],
    house: ['Deep End Groove', 'Afterglow Shuffle', 'Sunrise Garage'],
    disco: ['Mirrorball Static', 'Studio 54 Redux', 'Boogie Static'],
    beach: ['Tide Line', 'Golden Hour Set', 'Salt Air Downtempo']
  };

  function stopGenreLoop() {
    if (scheduler) clearInterval(scheduler);
    scheduler = null;
    if (nodes.genre) {
      fadeTo(nodes.genre.gain, 0, 0.6);
      var n = nodes.genre;
      setTimeout(function () { try { n.stop(); } catch (e) {} }, 700);
      nodes.genre = null;
    }
  }

  function playGenreLoop(genreKey) {
    var c = ensureCtx();
    stopGenreLoop();
    currentGenre = genreKey;
    var cfg = GENRE_SOUND[genreKey] || GENRE_SOUND.techno;
    fadeTo(master, 0.5, 2);

    var gain = c.createGain();
    gain.gain.value = 0;
    var filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = cfg.filterQ;
    filter.connect(gain).connect(master);

    var beatMs = 60000 / cfg.bpm;
    var step = 0;
    var activeOscs = [];

    function pluck(freq, dur, type, vol) {
      var t = c.currentTime;
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = type || cfg.wave;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.6, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(filter);
      o.start(t);
      o.stop(t + dur + 0.05);
    }

    function kick() {
      var t = c.currentTime;
      var o = c.createOscillator();
      var g = c.createGain();
      o.frequency.setValueAtTime(110, t);
      o.frequency.exponentialRampToValueAtTime(cfg.root * 0.7, t + 0.12);
      g.gain.setValueAtTime(0.8, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.connect(g).connect(filter);
      o.start(t);
      o.stop(t + 0.3);
    }

    var scale = [0, 3, 5, 7, 10, 12];
    scheduler = setInterval(function () {
      if (step % 1 === 0) kick();
      if (step % 2 === 0) {
        var semis = scale[Math.floor(Math.random() * scale.length)];
        pluck(cfg.root * Math.pow(2, semis / 12), 0.35, cfg.wave, 0.18);
      }
      if (step % 4 === 3) {
        pluck(cfg.root * 2 * Math.pow(2, scale[Math.floor(Math.random() * scale.length)] / 12), 0.5, 'sine', 0.12);
      }
      step++;
    }, beatMs);

    fadeTo(gain, 0.7, 1.5);
    nodes.genre = { gain: gain, stop: function () { fadeTo(gain, 0, 0.3); } };
    isPlaying = true;
  }

  window.ClubAudio = {
    unlock: function () { ensureCtx(); },
    startOutside: function () { ensureCtx(); startOutsideAtmosphere(); },
    stopOutside: function (t) { stopOutsideAtmosphere(t); },
    duckMaster: function (v, t) { if (master) fadeTo(master, v, t || 1); },
    playGenre: function (genreKey) { playGenreLoop(genreKey); },
    stopGenre: stopGenreLoop,
    setLooping: function (v) { isLooping = v; },
    isLooping: function () { return isLooping; },
    nextTrack: function () {
      trackIndex = (trackIndex + 1) % TRACKS_PER_GENRE;
      if (currentGenre) playGenreLoop(currentGenre);
      return this.currentTrackName();
    },
    prevTrack: function () {
      trackIndex = (trackIndex - 1 + TRACKS_PER_GENRE) % TRACKS_PER_GENRE;
      if (currentGenre) playGenreLoop(currentGenre);
      return this.currentTrackName();
    },
    togglePlay: function () {
      if (!master) return isPlaying;
      isPlaying = !isPlaying;
      fadeTo(master, isPlaying ? 0.5 : 0, 0.6);
      return isPlaying;
    },
    isPlaying: function () { return isPlaying; },
    currentTrackName: function () {
      var names = TRACK_NAMES[currentGenre] || TRACK_NAMES.techno;
      return names[trackIndex];
    },
    currentGenre: function () { return currentGenre; },
    currentTrackIndex: function () { return trackIndex; }
  };
})();
