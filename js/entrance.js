/* ============================================================
   THE ENTRANCE — OUTSIDE -> VALUES -> PASSWORD -> FOYER ->
   GENRE -> LOBBY -> SUB-GENRE -> ENTER.
   One continuous ritual on a single black stage. State machine
   swaps scenes; sound and flashes ride alongside.
   ============================================================ */

(function () {
  var stage = document.getElementById('stage');
  var scenes = {};
  ['outside', 'password', 'flashes', 'headed', 'foyer', 'lobby', 'threshold'].forEach(function (id) {
    scenes[id] = document.getElementById('scene-' + id);
  });

  function showScene(id) {
    Object.keys(scenes).forEach(function (k) {
      scenes[k].classList.toggle('is-active', k === id);
    });
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Set true the moment "skip ritual" fires. Every async continuation
  // in the outside/password/flashes chain checks this before acting,
  // so a skip clicked mid-sequence can't keep firing behind the foyer.
  var skipped = false;

  // ---------------------------------------------------------
  // STAGE 1 — OUTSIDE: PLURP values, one letter at a time
  // ---------------------------------------------------------
  var VALUES = [
    { letter: 'P', word: 'Peace', scale: 1.15, blur: 1, y: -4, duration: 0.24 },
    { letter: 'L', word: 'Love', scale: 1.3, blur: 1.5, y: -6, duration: 0.27 },
    { letter: 'U', word: 'Unity', scale: 1.45, blur: 2.5, y: -8, duration: 0.3 },
    { letter: 'R', word: 'Respect', scale: 1.6, blur: 3.5, y: -10, duration: 0.33 },
    { letter: 'P', word: 'Party', scale: 1.75, blur: 4.5, y: -12, duration: 0.36 }
  ];

  var wordEl = document.getElementById('values-word');
  var trailEl = document.getElementById('values-trail');

  VALUES.forEach(function (v, i) {
    var span = document.createElement('span');
    span.textContent = v.letter;
    span.dataset.index = i;
    span.dataset.letter = v.letter;
    trailEl.appendChild(span);
  });

  function runValuesSequence(step) {
    if (skipped) return;
    if (step >= VALUES.length) {
      var lastSpan = trailEl.querySelector('[data-index="' + (VALUES.length - 1) + '"]');
      if (lastSpan) {
        lastSpan.classList.remove('current');
        lastSpan.classList.add('done');
      }
      setTimeout(function () { if (!skipped) runPassword(); }, 400);
      return;
    }
    var v = VALUES[step];
    wordEl.classList.remove('shown', 'hiding');
    void wordEl.offsetWidth;
    wordEl.style.setProperty('--crash-scale-start', v.scale);
    wordEl.style.setProperty('--crash-blur', v.blur + 'px');
    wordEl.style.setProperty('--crash-y', v.y + 'px');
    wordEl.style.setProperty('--crash-duration', v.duration + 's');
    wordEl.innerHTML = '<span class="values-word-initial" data-letter="' + v.letter + '">' + v.word.charAt(0) + '</span>' + v.word.slice(1);

    requestAnimationFrame(function () {
      wordEl.classList.add('shown');
    });

    var initialSpan = wordEl.querySelector('.values-word-initial');
    var LIT_DELAY = 50;   // quick pause after landing before the first letter colors in
    var LIT_MS = 110;     // how long the color-in takes
    var POST_LIT_HOLD = 60; // brief hold once colored, before the whole word goes
    var HIDE_MS = 120;    // whole word fades out together

    var litStart = v.duration * 1000 + LIT_DELAY;
    var prevSpan = trailEl.querySelector('[data-index="' + (step - 1) + '"]');
    var trailSpan = trailEl.querySelector('[data-index="' + step + '"]');
    setTimeout(function () {
      if (initialSpan) initialSpan.classList.add('lit');
      if (prevSpan) {
        prevSpan.classList.remove('current');
        prevSpan.classList.add('done');
      }
      if (trailSpan) trailSpan.classList.add('current');
    }, litStart);

    var holdMs = litStart + LIT_MS + POST_LIT_HOLD + HIDE_MS;
    setTimeout(function () {
      wordEl.classList.remove('shown');
      wordEl.classList.add('hiding');
    }, holdMs - HIDE_MS);
    setTimeout(function () { runValuesSequence(step + 1); }, holdMs);
  }

  function startOutside() {
    showScene('outside');
    setTimeout(function () { runValuesSequence(0); }, 200);
  }

  // ---------------------------------------------------------
  // STAGE 2 — PASSWORD (vibe check, not real auth)
  // ---------------------------------------------------------
  var passwordInput = document.getElementById('password-input');
  var passwordForm = document.getElementById('password-form');
  var passwordPrompt = document.querySelector('.password-prompt');
  var passwordHint = document.querySelector('.password-hint');
  var passwordBtn = document.querySelector('.password-enter-btn');
  var smokeVideo = document.getElementById('smoke-video');

  function runPassword() {
    if (skipped) return;
    showScene('password');
    setTimeout(function () { passwordInput.focus(); }, 400);
  }

  passwordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    submitPassword();
  });

  var submitted = false;
  var SUCK_MS = 180;
  function submitPassword() {
    if (submitted || skipped) return;
    submitted = true;

    window.ClubAudio.unlock();
    window.ClubAudio.startOutside();

    [passwordPrompt, passwordInput, passwordHint, passwordBtn].forEach(suckIntoSmoke);
    passwordInput.disabled = true;
    passwordBtn.disabled = true;
    setTimeout(function () { if (!skipped) playSmokeVideo(); }, SUCK_MS);

    smokeVideo.addEventListener('ended', function onEnded() {
      smokeVideo.removeEventListener('ended', onEnded);
      stopSmokeVideo();
      if (!skipped) startFlashSequence();
    });
  }

  function suckIntoSmoke(el) {
    var rect = el.getBoundingClientRect();
    var dx = (window.innerWidth / 2) - (rect.left + rect.width / 2);
    var dy = (window.innerHeight / 2) - (rect.top + rect.height / 2);
    el.style.setProperty('--suck-x', dx + 'px');
    el.style.setProperty('--suck-y', dy + 'px');
    el.classList.add('dissolving');
  }

  // ---------------------------------------------------------
  // Smoke dissolve — plays the club smoke clip over the scene
  // ---------------------------------------------------------
  function playSmokeVideo() {
    smokeVideo.currentTime = 0;
    smokeVideo.classList.add('active');
    smokeVideo.play().catch(function () {});
  }

  function stopSmokeVideo() {
    smokeVideo.classList.remove('active');
    smokeVideo.pause();
  }

  // ---------------------------------------------------------
  // STAGE 3 — THE CLUB FLASHES
  // ---------------------------------------------------------
  var flashImg = document.getElementById('flash-img');
  var FLASH_REAL_COUNT = 7;    // real club/rave photography, no people
  var FLASH_SCENE_COUNT = 50;  // disco/rig/floor/confetti/smoke shots
  var FLASH_LASER_COUNT = 42;  // laser-fan shots, weighted in toward the climax
  // pool (99 images) comfortably exceeds the ~87 frames the 24fps run needs,
  // so a single sequence never has to repeat an image
  var FLASH_RAMP_MS = 5000;       // ramps from 1 pic/sec up to 24fps over 5s
  var FLASH_HOLD_MS = 3000;       // then holds flat at 24fps for 3 more seconds
  var FLASH_TOTAL_MS = FLASH_RAMP_MS + FLASH_HOLD_MS;
  var FLASH_START_INTERVAL = 1000;  // begins at 1 pic/sec
  var FLASH_FRAME_MS = 1000 / 24;   // ramps up to and then holds at 24fps
  var FLASH_ON_MS = 30;             // a couple of frames, then gone
  var flashTimer = null;
  var flashElapsed = 0;
  var realQueue = [];
  var sceneQueue = [];
  var laserQueue = [];

  function shuffled(n, prefix) {
    var arr = [];
    for (var i = 1; i <= n; i++) {
      arr.push('img/flash-vibes/' + prefix + '-' + String(i).padStart(2, '0') + '.jpg');
    }
    for (var j = arr.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = arr[j]; arr[j] = arr[k]; arr[k] = tmp;
    }
    return arr;
  }

  function weightedQueue(pairs) {
    // pairs: [[queue, weight], ...] — picks a non-empty queue by weight
    var pool = pairs.filter(function (p) { return p[0].length; });
    if (!pool.length) return null;
    var total = pool.reduce(function (s, p) { return s + p[1]; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < pool.length; i++) {
      r -= pool[i][1];
      if (r <= 0) return pool[i][0];
    }
    return pool[pool.length - 1][0];
  }

  function nextFlashSrc(progress) {
    // real photography stays in the mix throughout; the generated laser
    // shots take over more and more as the sequence heats up
    var laserWeight = Math.pow(progress, 1.6);
    var sceneWeight = 1 - laserWeight;
    var queue = weightedQueue([
      [realQueue, 0.5],
      [sceneQueue, sceneWeight],
      [laserQueue, laserWeight]
    ]);
    return queue ? queue.shift() : null;
  }

  function startFlashSequence() {
    if (skipped) return;
    showScene('flashes');
    flashElapsed = 0;
    realQueue = shuffled(FLASH_REAL_COUNT, 'real');
    sceneQueue = shuffled(FLASH_SCENE_COUNT, 'scene');
    laserQueue = shuffled(FLASH_LASER_COUNT, 'laser');
    scheduleNextFlash();
  }

  function scheduleNextFlash() {
    if (skipped) return;
    if (flashElapsed >= FLASH_TOTAL_MS) {
      setTimeout(function () { if (!skipped) startHeaded(); }, 300);
      return;
    }
    var progress = flashElapsed / FLASH_TOTAL_MS;
    var rampProgress = Math.min(1, flashElapsed / FLASH_RAMP_MS);
    var interval = FLASH_START_INTERVAL + (FLASH_FRAME_MS - FLASH_START_INTERVAL) * rampProgress;
    flashTimer = setTimeout(function () {
      if (skipped) return;
      flashElapsed += interval;
      fireFlash(progress);
    }, interval);
  }

  function fireFlash(progress) {
    if (skipped) return;
    if (!realQueue.length && !sceneQueue.length && !laserQueue.length) {
      realQueue = shuffled(FLASH_REAL_COUNT, 'real');
      sceneQueue = shuffled(FLASH_SCENE_COUNT, 'scene');
      laserQueue = shuffled(FLASH_LASER_COUNT, 'laser');
    }
    flashImg.src = nextFlashSrc(progress);
    flashImg.classList.remove('flash-off');
    flashImg.classList.add('flash-on');
    setTimeout(function () {
      flashImg.classList.remove('flash-on');
      flashImg.classList.add('flash-off');
    }, FLASH_ON_MS);
    scheduleNextFlash();
  }

  // ---------------------------------------------------------
  // STAGE 3.5 — WHERE WE HEADED?: black screen, white title that
  // blinks a couple times then blinks out into the genre screen.
  // ---------------------------------------------------------
  var headedTitle = document.getElementById('headed-title');
  var HEADED_HOLD_MS = 1900;

  function startHeaded() {
    if (skipped) return;
    showScene('headed');
    headedTitle.classList.remove('blink-out');
    void headedTitle.offsetWidth;
    headedTitle.classList.add('blinking');
    setTimeout(function () {
      if (skipped) return;
      headedTitle.classList.remove('blinking');
      headedTitle.classList.add('blink-out');
      setTimeout(function () { if (!skipped) startFoyer(); }, 260);
    }, HEADED_HOLD_MS);
  }

  // ---------------------------------------------------------
  // GOOEY NAV — blob transition fired on genre click,
  // react-bits GooeyNav style (SVG goo filter merging two blobs).
  // ---------------------------------------------------------
  var gooeyLayer = document.getElementById('gooey-nav-layer');
  var gooeyBlobA = document.getElementById('gooey-blob-a');
  var gooeyBlobB = document.getElementById('gooey-blob-b');
  var gooeyVideoA = document.getElementById('gooey-blob-video-a');
  var gooeyVideoB = document.getElementById('gooey-blob-video-b');
  var gooeyTintA = gooeyBlobA.querySelector('.gooey-blob-tint');
  var gooeyTintB = gooeyBlobB.querySelector('.gooey-blob-tint');
  var gooeyRunning = false;

  function triggerGooeyNav(e, key) {
    if (chosenGenre || gooeyRunning) return;
    gooeyRunning = true;

    var g = window.PLURP_GENRES[key];
    var cx = e.clientX, cy = e.clientY;
    var bx = window.innerWidth / 2, by = window.innerHeight / 2;
    var coverScale = (Math.max(window.innerWidth, window.innerHeight) * 1.7) / 60;

    // Tint the disco-tunnel close-up footage to the color of the vibe
    // being entered — the genre's own accent, via a color-blend overlay
    // that keeps the footage's motion and light but recolors its hue.
    gooeyTintA.style.background = g.accent.a;
    gooeyTintB.style.background = g.accent.b;
    [gooeyVideoA, gooeyVideoB].forEach(function (v) {
      try { v.currentTime = 0; } catch (err) {}
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });

    gooeyBlobA.style.transition = 'none';
    gooeyBlobB.style.transition = 'none';
    gooeyBlobA.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) scale(0)';
    gooeyBlobB.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0) scale(0)';
    gooeyLayer.classList.add('is-active');

    requestAnimationFrame(function () {
      gooeyBlobA.style.transition = 'transform 0.62s cubic-bezier(0.65, 0, 0.35, 1)';
      gooeyBlobB.style.transition = 'transform 0.78s cubic-bezier(0.65, 0, 0.35, 1) 0.06s';
      gooeyBlobA.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) scale(' + coverScale + ')';
      gooeyBlobB.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0) scale(' + (coverScale * 1.1) + ')';
    });

    setTimeout(function () {
      chooseGenre(key);
    }, 480);

    setTimeout(function () {
      // By now the lobby scene has been built — zoom the blobs back in
      // toward the actual on-screen spot of the lobby's center disco
      // ball (falling back to viewport center if it's not found).
      var target = lobbyCenterBallPoint() || { x: bx, y: by };
      gooeyBlobA.style.transition = 'transform 0.6s cubic-bezier(0.6, 0, 0.2, 1)';
      gooeyBlobB.style.transition = 'transform 0.7s cubic-bezier(0.6, 0, 0.2, 1) 0.05s';
      gooeyBlobA.style.transform = 'translate3d(' + target.x + 'px,' + target.y + 'px,0) scale(0)';
      gooeyBlobB.style.transform = 'translate3d(' + target.x + 'px,' + target.y + 'px,0) scale(0)';
    }, 820);

    setTimeout(function () {
      gooeyLayer.classList.remove('is-active');
      gooeyVideoA.pause();
      gooeyVideoB.pause();
      gooeyRunning = false;
    }, 1450);
  }

  function startFoyer() {
    showScene('foyer');
    buildAccordionGallery();
  }

  // ---------------------------------------------------------
  // ACCORDION GALLERY — react-bits-style genre picker: a row of
  // narrow panels, each carrying a genre's image + label sideways;
  // hovering (or tapping, on touch) expands one panel to full width
  // and unrotates its label; clicking an expanded panel enters it.
  // ---------------------------------------------------------
  var accordionGallery = document.getElementById('accordion-gallery');

  function buildAccordionGallery() {
    accordionGallery.innerHTML = '';
    Object.keys(window.PLURP_GENRES).forEach(function (key) {
      var g = window.PLURP_GENRES[key];
      var panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.dataset.genre = key;
      panel.style.backgroundImage = "url('" + window.plurpImgPath(key, (7 % g.imgCount) + 1) + "')";
      panel.style.setProperty('--item-accent', g.accent.a);
      panel.innerHTML =
        '<div class="accordion-panel-shade"></div>' +
        '<div class="accordion-panel-label">' +
          '<span class="accordion-panel-name">' + g.label + '</span>' +
          '<span class="accordion-panel-mood">' + g.mood + '</span>' +
          '<button class="accordion-panel-cta" type="button" tabindex="-1">come inside →</button>' +
        '</div>';

      var cta = panel.querySelector('.accordion-panel-cta');
      cta.addEventListener('click', function (e) {
        e.stopPropagation();
        triggerGooeyNav(e, key);
      });

      // Hover (mouse only — hover:none devices never fire this) expands
      // the panel instantly. A click anywhere on an inactive panel also
      // expands it, so a mouse user can just click straight through.
      panel.addEventListener('mouseenter', function () { expandAccordionPanel(panel); });
      panel.addEventListener('click', function () {
        if (!panel.classList.contains('is-active')) expandAccordionPanel(panel);
      });
      // Touch: first tap expands the image (no hover to reveal it first);
      // entering only happens via the explicit CTA button above, never
      // from a second tap on the image itself.
      panel.addEventListener('touchstart', function (e) {
        if (!panel.classList.contains('is-active')) {
          e.preventDefault();
          expandAccordionPanel(panel);
        }
      }, { passive: false });

      accordionGallery.appendChild(panel);
    });
    expandAccordionPanel(accordionGallery.firstElementChild);
  }

  function expandAccordionPanel(panel) {
    if (!panel) return;
    accordionGallery.querySelectorAll('.accordion-panel').forEach(function (p) {
      p.classList.toggle('is-active', p === panel);
    });
  }

  var chosenGenre = null;
  var chosenSubgenre = null;

  function chooseGenre(key) {
    if (chosenGenre) return;
    chosenGenre = key;
    startLobby(key);
  }

  // ---------------------------------------------------------
  // STAGE 5+6 — LOBBY: genre atmosphere + orbit subgenre menu
  // ---------------------------------------------------------
  var lobbyQuestion = document.getElementById('lobby-question');
  var lobbyBg = document.getElementById('lobby-bg');
  var orbitTrack = document.getElementById('orbit-track');
  var orbitHint = document.getElementById('orbit-hint');
  var lobbyBackBtn = document.getElementById('lobby-back-btn');

  // The center orbit node always sits at the geometric middle of the
  // orbit track (its own translate offset is 0 there), so the track's
  // own bounding-box center is the on-screen spot of the lobby's
  // center disco ball.
  function lobbyCenterBallPoint() {
    var rect = orbitTrack.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  var lobbyDeactivateBtn = document.getElementById('lobby-deactivate-btn');
  var orbitPrevBtn = document.getElementById('orbit-prev-btn');
  var orbitNextBtn = document.getElementById('orbit-next-btn');

  lobbyBackBtn.addEventListener('click', function () {
    chosenGenre = null;
    chosenSubgenre = null;
    stopOrbitBalls();
    stopAutoRotate();
    startFoyer();
  });

  lobbyDeactivateBtn.addEventListener('click', function () {
    disarmSubgenre();
  });

  function applyGenreTheme(key) {
    var g = window.PLURP_GENRES[key];
    document.documentElement.style.setProperty('--shimmer-x', '40%');
    stage.style.setProperty('--genre-a', g.accent.a);
    stage.style.setProperty('--genre-b', g.accent.b);
    stage.style.setProperty('--genre-glow', g.accent.glow);
  }

  function startLobby(key) {
    applyGenreTheme(key);
    lobbyBg.style.backgroundImage = "url('" + window.plurpImgPath(key, 12) + "')";
    lobbyBg.style.opacity = '0.32';
    showScene('lobby');
    lobbyQuestion.classList.remove('shown');
    void lobbyQuestion.offsetWidth;
    lobbyQuestion.textContent = pick(window.PLURP_QUESTIONS_LOBBY);
    requestAnimationFrame(function () { lobbyQuestion.classList.add('shown'); });
    buildOrbitMenu(key);
  }

  var orbitAngle = 0;
  var orbitRadius = 0;
  var orbitDrag = { active: false, startX: 0, startAngle: 0 };
  var orbitItems = [];
  var orbitGenreKey = null;
  var orbitCenterIndex = null;

  function subgenreImgNumber(genreKey, i, count) {
    var g = window.PLURP_GENRES[genreKey];
    var step = Math.floor(g.imgCount / count) || 1;
    return ((i * step) % g.imgCount) + 1;
  }

  // Orbit nodes are disco balls, same lattice-shading model as the
  // Threshold ball (see drawDiscoBall below, per the brand guidelines'
  // disco-cut swatches) — tinted to the chosen genre's accent color.
  var orbitBallCanvases = [];
  var orbitBallRaf = null;
  var orbitBallLast = null;

  function stopOrbitBalls() {
    if (orbitBallRaf) cancelAnimationFrame(orbitBallRaf);
    orbitBallRaf = null;
    orbitBallLast = null;
    orbitBallCanvases = [];
  }

  function sizeOrbitBallCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.parentElement.getBoundingClientRect();
    var size = Math.round(Math.min(rect.width, rect.height) * dpr);
    if (size > 0 && canvas.width !== size) { canvas.width = size; canvas.height = size; }
    return size;
  }

  function orbitBallFrame(ts) {
    if (orbitBallLast === null) orbitBallLast = ts;
    var dt = (ts - orbitBallLast) / 1000; orbitBallLast = ts;
    var rgb = hexToRgb(window.PLURP_GENRES[orbitGenreKey].accent.a);
    orbitBallCanvases.forEach(function (o) {
      if (o.canvas.offsetParent === null) return;
      var size = sizeOrbitBallCanvas(o.canvas);
      if (size <= 0) return;
      o.rotation = (o.rotation + 14 * dt) % 360;
      drawDiscoBall(o.ctx, size, rgb, o.rotation);
    });
    orbitBallRaf = requestAnimationFrame(orbitBallFrame);
  }

  function startOrbitBalls() {
    stopOrbitBalls();
    var rgb = hexToRgb(window.PLURP_GENRES[orbitGenreKey].accent.a);
    orbitItems.forEach(function (item) {
      var canvas = item.el.querySelector('.orbit-node-ball');
      var o = { canvas: canvas, ctx: canvas.getContext('2d'), rotation: Math.random() * 360 };
      orbitBallCanvases.push(o);
      var size = sizeOrbitBallCanvas(canvas);
      if (size > 0) drawDiscoBall(o.ctx, size, rgb, o.rotation);
    });
    if (!ballReduceMotion) orbitBallRaf = requestAnimationFrame(orbitBallFrame);
  }

  // Idle auto-rotation — the orbit slowly spins on its own so picking a
  // subgenre doesn't require dragging. Pauses on drag, hover and while a
  // node is armed so it never fights the visitor's own input.
  var autoRotateRaf = null;
  var autoRotateLast = null;
  var autoRotateSpeed = 6; // degrees per second
  var autoRotateHovered = false;

  function autoRotateFrame(ts) {
    if (autoRotateLast === null) autoRotateLast = ts;
    var dt = (ts - autoRotateLast) / 1000;
    autoRotateLast = ts;
    if (!orbitDrag.active && orbitArmedIndex === null && !autoRotateHovered) {
      orbitAngle -= autoRotateSpeed * dt;
      layoutOrbit();
    }
    autoRotateRaf = requestAnimationFrame(autoRotateFrame);
  }

  function startAutoRotate() {
    stopAutoRotate();
    if (ballReduceMotion) return;
    autoRotateRaf = requestAnimationFrame(autoRotateFrame);
  }

  function stopAutoRotate() {
    if (autoRotateRaf) cancelAnimationFrame(autoRotateRaf);
    autoRotateRaf = null;
    autoRotateLast = null;
  }

  orbitTrack.addEventListener('mouseenter', function () { autoRotateHovered = true; });
  orbitTrack.addEventListener('mouseleave', function () { autoRotateHovered = false; });

  function buildOrbitMenu(genreKey) {
    stopOrbitBalls();
    stopAutoRotate();
    orbitTrack.innerHTML = '';
    chosenSubgenre = null;
    orbitGenreKey = genreKey;
    orbitCenterIndex = null;
    orbitArmedIndex = null;
    if (orbitHint) orbitHint.textContent = 'drag or use arrows · click center to select';
    lobbyDeactivateBtn.classList.remove('shown');
    var subs = window.PLURP_GENRES[genreKey].subgenres;
    orbitItems = subs.map(function (s, i) {
      var node = document.createElement('div');
      node.className = 'orbit-node';
      node.dataset.key = s.key;
      node.innerHTML = '<canvas class="orbit-node-ball"></canvas><span>' + s.label + '</span>';
      node.style.transform = 'translate(-50%, -50%) scale(0)';
      node.style.opacity = '0';
      node.addEventListener('click', function () {
        if (node.classList.contains('armed')) {
          runThreshold();
        } else if (node.classList.contains('center')) {
          armSubgenre(node, s.key, s.label);
        } else {
          orbitAngle = -(i * (360 / subs.length));
          layoutOrbit();
        }
      });
      orbitTrack.appendChild(node);
      return { el: node, key: s.key, label: s.label, index: i };
    });
    orbitAngle = 0;
    void orbitTrack.offsetWidth; // force layout so the scale(0) start state paints before we animate out
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        layoutOrbit();
        startOrbitBalls();
        startAutoRotate();
      });
    });

    orbitTrack.onpointerdown = function (e) {
      orbitDrag.active = true;
      orbitDrag.startX = e.clientX;
      orbitDrag.startAngle = orbitAngle;
      orbitTrack.classList.add('grabbing');
    };
    window.addEventListener('pointermove', function (e) {
      if (!orbitDrag.active) return;
      var dx = e.clientX - orbitDrag.startX;
      orbitAngle = orbitDrag.startAngle + dx * 0.4;
      layoutOrbit();
    });
    window.addEventListener('pointerup', function () {
      if (!orbitDrag.active) return;
      orbitDrag.active = false;
      orbitTrack.classList.remove('grabbing');
      snapOrbitToNearest();
    });
  }

  function layoutOrbit() {
    var count = orbitItems.length;
    var w = orbitTrack.parentElement.clientWidth;
    var radius = Math.min(w * 0.42, 320);
    var centerIndexFloat = (-orbitAngle / (360 / count));
    orbitItems.forEach(function (item, i) {
      var angleDeg = (360 / count) * i + orbitAngle;
      var rad = (angleDeg * Math.PI) / 180;
      var x = Math.sin(rad) * radius;
      var scale = 0.75 + 0.35 * ((Math.cos(rad) + 1) / 2);
      var z = Math.cos(rad);
      if (!item.el.classList.contains('armed')) {
        item.el.style.transform = 'translate(-50%, -50%) translate(' + x.toFixed(1) + 'px, 0) scale(' + scale.toFixed(2) + ')';
      }
      item.el.style.zIndex = Math.round(z * 100);
      item.el.style.opacity = String(0.4 + 0.6 * ((z + 1) / 2));
      var isCenter = Math.abs(((angleDeg % 360) + 360) % 360) < (180 / count);
      item.el.classList.toggle('center', isCenter && z > 0.5);
    });
    var nearestIndex = ((Math.round(centerIndexFloat) % count) + count) % count;
    if (nearestIndex !== orbitCenterIndex) {
      orbitCenterIndex = nearestIndex;
      var imgN = subgenreImgNumber(orbitGenreKey, nearestIndex, count);
      lobbyBg.style.backgroundImage = "url('" + window.plurpImgPath(orbitGenreKey, imgN) + "')";
      if (nearestIndex !== orbitArmedIndex) disarmSubgenre();
    }
  }

  function snapOrbitToNearest() {
    var count = orbitItems.length;
    var step = 360 / count;
    orbitAngle = Math.round(orbitAngle / step) * step;
    layoutOrbit();
  }

  function stepOrbit(dir) {
    if (!orbitItems.length) return;
    var step = 360 / orbitItems.length;
    orbitAngle = Math.round(orbitAngle / step) * step - dir * step;
    layoutOrbit();
  }
  orbitPrevBtn.addEventListener('click', function () { stepOrbit(-1); });
  orbitNextBtn.addEventListener('click', function () { stepOrbit(1); });

  var orbitArmedIndex = null;

  function armSubgenre(node, key, label) {
    chosenSubgenre = key;
    orbitArmedIndex = orbitItems.findIndex(function (item) { return item.el === node; });
    node.classList.add('armed');
    node.style.transform = 'translate(-50%, -50%) scale(1)';
    node.querySelector('span').textContent = 'ENTER ' + window.PLURP_GENRES[chosenGenre].label + ' — ' + label.toUpperCase();
    if (orbitHint) orbitHint.textContent = 'click again to enter';
    lobbyDeactivateBtn.classList.add('shown');
  }

  function disarmSubgenre() {
    lobbyDeactivateBtn.classList.remove('shown');
    if (orbitArmedIndex === null) return;
    var item = orbitItems[orbitArmedIndex];
    if (item) {
      item.el.classList.remove('armed');
      item.el.querySelector('span').textContent = item.label;
    }
    orbitArmedIndex = null;
    chosenSubgenre = null;
    if (orbitHint) orbitHint.textContent = 'drag or use arrows · click center to select';
  }

  // ---------------------------------------------------------
  // STAGE 7 — THRESHOLD: final line, then cross into the world
  // ---------------------------------------------------------
  var thresholdLine = document.getElementById('threshold-line');
  var thresholdBallWrap = document.getElementById('threshold-ball');
  var thresholdBallCanvas = document.getElementById('threshold-ball-canvas');
  var thresholdBallCtx = thresholdBallCanvas.getContext('2d');

  // Spinning mirror ball, same shading model as the brand guidelines'
  // disco-cut swatches: a lit lattice of facets wrapped over a sphere.
  var BALL_ROWS = 14, BALL_LAT_SPAN = 78, BALL_BASE_COLS = 24;
  var BALL_L = (function (v) {
    var m = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  })([-0.45, 0.62, 0.75]);
  var BALL_V = [0, 0, 1];

  function ballDot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function ballClamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function ballHash(n) { var x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }
  function ballNormalize(v) {
    var m = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  var BALL_LATTICE = [];
  for (var br = 0; br < BALL_ROWS; br++) {
    var blat = -BALL_LAT_SPAN + (BALL_LAT_SPAN * 2) * (br + 0.5) / BALL_ROWS;
    var blatRad = blat * Math.PI / 180;
    var bcols = Math.max(6, Math.round(BALL_BASE_COLS * Math.cos(blatRad)));
    var brow = { latRad: blatRad, tiles: [] };
    for (var bc = 0; bc < bcols; bc++) {
      brow.tiles.push({ lon0: (360 / bcols) * bc, noise: (ballHash(br * 97.13 + bc * 13.7) - 0.5) });
    }
    BALL_LATTICE.push(brow);
  }

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }

  function drawDiscoBall(ctx, size, rgb, rotationDeg) {
    var R = size * 0.5, cx = size * 0.5, cy = size * 0.5;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size);

    for (var r = 0; r < BALL_LATTICE.length; r++) {
      var row = BALL_LATTICE[r];
      var cosLat = Math.cos(row.latRad), sinLat = Math.sin(row.latRad);
      var rowPitch = (BALL_LAT_SPAN * 2 / BALL_ROWS) * Math.PI / 180 * R;

      for (var t = 0; t < row.tiles.length; t++) {
        var tile = row.tiles[t];
        var lonDeg = tile.lon0 - rotationDeg;
        var lonRad = (lonDeg % 360) * Math.PI / 180;

        var nx = cosLat * Math.sin(lonRad);
        var ny = sinLat;
        var nz = cosLat * Math.cos(lonRad);
        if (nz <= 0.02) continue;

        var x = cx + R * nx, y = cy - R * ny;

        var diff = ballClamp(ballDot3([nx, ny, nz], BALL_L), 0, 1);
        var lightness = ballClamp(diff * 0.8 + tile.noise * 0.30 + 0.14, 0.03, 1);

        var tr, tg, tb;
        if (lightness > 0.6) {
          var k = (lightness - 0.6) / 0.4;
          tr = rgb[0] + (255 - rgb[0]) * k; tg = rgb[1] + (255 - rgb[1]) * k; tb = rgb[2] + (255 - rgb[2]) * k;
        } else {
          var k2 = 1 - lightness / 0.6;
          tr = rgb[0] * (1 - k2 * 0.9); tg = rgb[1] * (1 - k2 * 0.9); tb = rgb[2] * (1 - k2 * 0.9);
        }

        var colPitch = (2 * Math.PI / row.tiles.length) * R * cosLat;
        var w = ballClamp(colPitch * 0.82, 0.6, R);
        var h = ballClamp(rowPitch * 0.82, 0.6, R);

        ctx.fillStyle = 'rgb(' + (tr | 0) + ',' + (tg | 0) + ',' + (tb | 0) + ')';
        ctx.fillRect(x - w / 2, y - h / 2, w, h);

        var half = ballNormalize([BALL_L[0] + BALL_V[0], BALL_L[1] + BALL_V[1], BALL_L[2] + BALL_V[2]]);
        var spec = Math.pow(ballClamp(ballDot3([nx, ny, nz], half), 0, 1), 60);
        if (spec > 0.15) {
          ctx.fillStyle = 'rgba(255,255,255,' + ballClamp(spec * 1.4, 0, 0.95).toFixed(2) + ')';
          ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }
      }
    }

    var vg = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, size, size);
    ctx.restore();
  }

  var ballReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ballRotation = 0, ballLast = null, ballRaf = null, ballRgb = [255, 255, 255];

  function sizeBallCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = thresholdBallWrap.getBoundingClientRect();
    var size = Math.round(rect.width * dpr);
    if (size > 0) {
      thresholdBallCanvas.width = size;
      thresholdBallCanvas.height = size;
    }
    return size;
  }

  function ballFrame(ts) {
    if (ballLast === null) ballLast = ts;
    var dt = (ts - ballLast) / 1000; ballLast = ts;
    ballRotation = (ballRotation + 14 * dt) % 360;
    if (thresholdBallCanvas.width > 0) drawDiscoBall(thresholdBallCtx, thresholdBallCanvas.width, ballRgb, ballRotation);
    ballRaf = requestAnimationFrame(ballFrame);
  }

  function startDiscoBall(accentHex) {
    ballRgb = hexToRgb(accentHex);
    ballLast = null;
    var size = sizeBallCanvas();
    if (ballReduceMotion) {
      if (size > 0) drawDiscoBall(thresholdBallCtx, size, ballRgb, 0);
    } else {
      if (ballRaf) cancelAnimationFrame(ballRaf);
      ballRaf = requestAnimationFrame(ballFrame);
    }
  }

  function stopDiscoBall() {
    if (ballRaf) cancelAnimationFrame(ballRaf);
    ballRaf = null;
  }

  function runThreshold() {
    stopOrbitBalls();
    showScene('threshold');
    thresholdLine.textContent = pick(window.PLURP_ENTER_LINES);
    startDiscoBall(window.PLURP_GENRES[chosenGenre].accent.a);
    window.ClubAudio.duckMaster(0, 1.2);
    setTimeout(function () {
      stopDiscoBall();
      var params = new URLSearchParams({ genre: chosenGenre, sub: chosenSubgenre });
      sessionStorage.setItem('plurp_genre', chosenGenre);
      sessionStorage.setItem('plurp_sub', chosenSubgenre);
      window.location.href = 'world.html?' + params.toString();
    }, 1500);
  }

  // ---------------------------------------------------------
  // Skip ritual (dev / repeat-visitor convenience) — jumps
  // straight past the values/password/flashes intro to genre
  // selection, rather than all the way into the world.
  // ---------------------------------------------------------
  document.getElementById('skip-ritual').addEventListener('click', function () {
    skipped = true;
    clearTimeout(flashTimer);
    stopSmokeVideo();
    window.ClubAudio.unlock();
    window.ClubAudio.stopOutside(0);
    flashImg.classList.remove('flash-on');
    flashImg.classList.add('flash-off');
    startFoyer();
  });

  window.addEventListener('resize', function () { if (orbitItems.length) layoutOrbit(); });

  if (sessionStorage.getItem('plurp_returning') === '1') {
    sessionStorage.removeItem('plurp_returning');
    startFoyer();
  } else {
    startOutside();
  }
})();
