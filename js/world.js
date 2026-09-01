/* ============================================================
   THE INNER WORLD — reads ?genre & ?sub, themes the page, drops
   the veil, drives the miniplayer, and handles LEAVE THE PARTY.
   ============================================================ */

(function () {
  var params = new URLSearchParams(window.location.search);
  var genreKey = params.get('genre') || sessionStorage.getItem('plurp_genre') || 'techno';
  var subKey = params.get('sub') || sessionStorage.getItem('plurp_sub');
  var genre = window.PLURP_GENRES[genreKey] || window.PLURP_GENRES.techno;
  genreKey = genre.key;
  var sub = (genre.subgenres.find(function (s) { return s.key === subKey; })) || genre.subgenres[0];

  document.documentElement.style.setProperty('--genre-a', genre.accent.a);
  document.documentElement.style.setProperty('--genre-b', genre.accent.b);
  document.documentElement.style.setProperty('--genre-glow', genre.accent.glow);

  document.getElementById('world-genre-name').textContent = genre.label;
  document.getElementById('world-sub-name').textContent = sub.label;
  document.getElementById('world-hero-title').textContent = genre.label;
  document.getElementById('world-hero-tag').textContent =
    'You picked ' + sub.label + '. ' + genre.mood + '. This is your room tonight.';
  document.title = genre.label + ' — ' + sub.label + ' · PLURP';

  // ---- Hero reel: crossfading Ken Burns montage — the room's vibe in motion ----
  var heroReel = document.getElementById('world-hero-reel');
  var HERO_FRAME_COUNT = 5;
  var HERO_CYCLE_S = 30;
  var heroSlot = HERO_CYCLE_S / HERO_FRAME_COUNT;
  for (var hf = 0; hf < HERO_FRAME_COUNT; hf++) {
    var frame = document.createElement('div');
    frame.className = 'world-hero-frame';
    frame.style.backgroundImage = "url('" + window.plurpImgPath(genreKey, (hf % genre.imgCount) + 1) + "')";
    frame.style.animationDuration = HERO_CYCLE_S + 's, ' + HERO_CYCLE_S + 's';
    frame.style.animationDelay = (hf * heroSlot) + 's, ' + (hf * heroSlot) + 's';
    heroReel.appendChild(frame);
  }

  // ---- Veil lift ----
  requestAnimationFrame(function () {
    setTimeout(function () {
      document.getElementById('world-veil').classList.add('lifted');
    }, 150);
  });

  // ---- Populate shop grid with genre imagery as discovery cards ----
  var shopGrid = document.getElementById('shop-grid');
  var SHOP_NAMES = ['Night Shift Jacket', 'Afterhours Set', 'Static Mesh Top', 'Low Light Pant', 'Concrete Boot', 'Reflective Harness', 'Sweat Tank', 'Warehouse Coat'];
  for (var i = 0; i < 8; i++) {
    var card = document.createElement('div');
    card.className = 'shop-card';
    var imgN = 5 + i;
    card.innerHTML =
      '<img src="' + window.plurpImgPath(genreKey, ((imgN - 1) % genre.imgCount) + 1) + '" alt="" loading="lazy" />' +
      '<div class="shop-card-info">' +
        '<div class="shop-card-title">' + SHOP_NAMES[i] + '</div>' +
        '<div class="shop-card-tag">' + genre.label + ' · ' + sub.label + '</div>' +
      '</div>';
    shopGrid.appendChild(card);
  }

  // ---- DJ Spotlights ----
  var djRow = document.getElementById('dj-row');
  // Schema (fill in when swapping to real DJs):
  //   name       — display name
  //   handle     — @instagram-style handle shown under the name
  //   role       — short billing line (residency city, discovery tag, etc.)
  //   blurb      — one-line bio
  //   photo      — optional explicit image path; falls back to genre stock at (10 + index)
  //   instagram  — full profile URL; omit/null until the real link is confirmed —
  //                the avatar only becomes a link once this is set
  var DJ_ROSTERS = {
    techno: [
      { name: 'Nyra Kade', handle: '@nyrakade', role: 'Resident, Bangalore', blurb: 'Curated for the ' + genre.label + ' floor since 2023.', photo: null, instagram: null },
      { name: 'Solvent', handle: '@solvent.sets', role: 'PLURP Discovery Pick', blurb: 'One of three sets we vetted this month.', photo: null, instagram: null },
      { name: 'Kavi Rho', handle: '@kavirho', role: 'Guest Selector', blurb: 'Brings ' + sub.label + ' textures into every set.', photo: null, instagram: null },
      { name: 'Ferro Dust', handle: '@ferrodust', role: 'Resident, Tbilisi', blurb: 'Warehouse-hardened selector, four-hour sets only.', photo: null, instagram: null }
    ],
    psy: [
      { name: 'Ilana Vex', handle: '@ilanavex', role: 'Resident, Goa', blurb: 'Curated for the ' + genre.label + ' floor since 2019.', photo: null, instagram: null },
      { name: 'Ohm Static', handle: '@ohm.static', role: 'PLURP Discovery Pick', blurb: 'One of three sets we vetted this month.', photo: null, instagram: null },
      { name: 'Suri Tandav', handle: '@suritandav', role: 'Guest Selector', blurb: 'Brings ' + sub.label + ' textures into every set.', photo: null, instagram: null },
      { name: 'Prithvi Loop', handle: '@prithviloop', role: 'Resident, Pune', blurb: 'Sunrise sets built for the last hour on the floor.', photo: null, instagram: null }
    ],
    house: [
      { name: 'Marisol Dune', handle: '@marisoldune', role: 'Resident, Lisbon', blurb: 'Curated for the ' + genre.label + ' floor since 2021.', photo: null, instagram: null },
      { name: 'Deja Voss', handle: '@dejavoss', role: 'PLURP Discovery Pick', blurb: 'One of three sets we vetted this month.', photo: null, instagram: null },
      { name: 'Tumi Okafor', handle: '@tumiokafor', role: 'Guest Selector', blurb: 'Brings ' + sub.label + ' textures into every set.', photo: null, instagram: null },
      { name: 'Rico Salt', handle: '@ricosalt', role: 'Resident, Chicago', blurb: 'Warehouse-to-basement selector, twenty years deep.', photo: null, instagram: null }
    ],
    disco: [
      { name: 'Coco Velour', handle: '@cocovelour', role: 'Resident, Brooklyn', blurb: 'Curated for the ' + genre.label + ' floor since 2020.', photo: null, instagram: null },
      { name: 'Marquis Gold', handle: '@marquisgold', role: 'PLURP Discovery Pick', blurb: 'One of three sets we vetted this month.', photo: null, instagram: null },
      { name: 'Peaches Rondo', handle: '@peachesrondo', role: 'Guest Selector', blurb: 'Brings ' + sub.label + ' textures into every set.', photo: null, instagram: null },
      { name: 'Sly Fontaine', handle: '@slyfontaine', role: 'Resident, Paris', blurb: 'Vinyl-only selector, disco edits by hand.', photo: null, instagram: null }
    ],
    beach: [
      { name: 'Luna Cabana', handle: '@lunacabana', role: 'Resident, Ibiza', blurb: 'Curated for the ' + genre.label + ' floor since 2022.', photo: null, instagram: null },
      { name: 'Kai Marlow', handle: '@kaimarlow', role: 'PLURP Discovery Pick', blurb: 'One of three sets we vetted this month.', photo: null, instagram: null },
      { name: 'Yara Solis', handle: '@yarasolis', role: 'Guest Selector', blurb: 'Brings ' + sub.label + ' textures into every set.', photo: null, instagram: null },
      { name: 'Dune Halcyon', handle: '@dunehalcyon', role: 'Resident, Tulum', blurb: 'Sunset-to-sunrise selector, driftwood-deck sets.', photo: null, instagram: null }
    ]
  };
  var IG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
  var DJS = DJ_ROSTERS[genreKey] || DJ_ROSTERS.techno;
  DJS.forEach(function (dj, i) {
    var card = document.createElement('div');
    card.className = 'dj-card';
    var photoUrl = dj.photo || window.plurpImgPath(genreKey, 10 + i);
    var avatarInner =
      '<div class="dj-avatar" style="background-image:url(\'' + photoUrl + '\')"></div>' +
      (dj.instagram ? '<div class="dj-avatar-overlay"><span class="dj-ig-tag">' + IG_ICON + ' View Profile</span></div>' : '');
    var avatarHtml = dj.instagram
      ? '<a class="dj-avatar-link" href="' + dj.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="' + dj.name + ' on Instagram">' + avatarInner + '</a>'
      : '<div class="dj-avatar-link">' + avatarInner + '</div>';
    card.innerHTML = avatarHtml +
      '<div class="dj-name">' + dj.name + '</div>' +
      (dj.handle ? '<div class="dj-handle">' + dj.handle + '</div>' : '') +
      '<div class="dj-role">' + dj.role + '</div>' +
      '<div class="dj-blurb">' + dj.blurb + '</div>';
    djRow.appendChild(card);
  });

  // ---- Culture: Know the Scene ----
  var cultureList = document.getElementById('culture-list');
  var CULTURE = [
    { title: 'Where ' + genre.label + ' came from', body: 'A short history of the sound, the cities that built it, and how it found its way to ' + sub.label + '.' },
    { title: 'Party etiquette, ' + genre.label + ' edition', body: 'Read the room, respect the DJ, look after the people next to you. PLURP starts on the floor.' },
    { title: 'What to wear for this floor', body: genre.mood + ' — practical notes on fabric, movement and heat for a night in this world.' }
  ];
  CULTURE.forEach(function (c, i) {
    var item = document.createElement('div');
    item.className = 'culture-item';
    item.innerHTML =
      '<div class="culture-index mono">0' + (i + 1) + '</div>' +
      '<div><div class="culture-title">' + c.title + '</div><div class="culture-body">' + c.body + '</div></div>';
    cultureList.appendChild(item);
  });

  // ---- Angels ----
  var angelsGrid = document.getElementById('angels-grid');
  var ANGELS_COUNT = 14;
  for (var a = 0; a < 8; a++) {
    var tile = document.createElement('div');
    tile.className = 'angel-tile';
    var angelN = String((a % ANGELS_COUNT) + 1).padStart(2, '0');
    tile.style.backgroundImage = "url('img/angels/angel-" + angelN + ".jpg')";
    angelsGrid.appendChild(tile);
  }

  // ---- Section nav: active-state tracking as you scroll ----
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.world-nav-link'));
  var navSections = navLinks.map(function (link) {
    return document.getElementById(link.dataset.target);
  });
  if ('IntersectionObserver' in window && navLinks.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = navSections.indexOf(entry.target);
        if (idx === -1) return;
        navLinks[idx].classList.toggle('active', entry.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    navSections.forEach(function (section) {
      if (section) navObserver.observe(section);
    });
  }

  // The nav collapses to a single glowing dot; hover blooms it open
  // on desktop, but touch has no hover, so the dot itself is the tap
  // target that toggles the capsule open. Tapping outside closes it.
  var worldNav = document.getElementById('world-nav');
  var navTrigger = document.getElementById('world-nav-trigger');
  if (worldNav && navTrigger) {
    navTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      worldNav.classList.toggle('expanded');
    });
    document.addEventListener('click', function (e) {
      if (!worldNav.contains(e.target)) worldNav.classList.remove('expanded');
    });
  }

  // ---- Leave the Party ----
  document.getElementById('leave-party').addEventListener('click', function () {
    sessionStorage.setItem('plurp_returning', '1');
    window.ClubAudio.stopGenre();
    window.location.href = 'index.html';
  });

  // ---- Miniplayer ----
  var mp = document.getElementById('miniplayer');
  var playBtn = document.getElementById('mp-play');
  var loopBtn = document.getElementById('mp-loop');
  var trackLabel = document.getElementById('mp-track');
  var trackLabelDup = document.getElementById('mp-track-dup');
  var artEl = document.getElementById('mp-art');
  var needleHint = document.getElementById('needle-hint');

  // Genres with a real YouTube playlist (see club-data.js) play through
  // YTAudio; every other genre keeps the synthesized ClubAudio bed.
  var usesYouTube = !!genre.playlist;
  var started = false;

  var currentVideoId = null;

  function setTrackText(text) {
    trackLabel.textContent = text;
    trackLabelDup.textContent = text;
  }

  // Strip YouTube's "(Official Video)"-style noise so the marquee reads
  // as just "Artist - Track Title".
  function cleanTitle(title) {
    return (title || '')
      .replace(/[\(\[][^\)\]]*\bvideo\b[^\)\]]*[\)\]]/gi, '')
      .replace(/\s*[-|]\s*official\s*(music\s*)?video\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function setArt(videoId) {
    var url;
    if (usesYouTube && videoId) {
      url = 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg';
    } else {
      var n = (window.ClubAudio.currentTrackIndex() % genre.imgCount) + 1;
      url = window.plurpImgPath(genreKey, n);
    }
    artEl.style.backgroundImage = "url('" + url + "')";
  }

  if (usesYouTube) {
    window.YTAudio.init(genre.playlist, function (title, videoId) {
      setTrackText(cleanTitle(title));
      currentVideoId = videoId;
      setArt(videoId);
    });
  }

  var toastEl = document.getElementById('mp-toast');
  var toastTimer = null;
  function showToast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('shown');
    }, 1800);
  }

  function copyWithFallback(text) {
    var tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(tmp);
  }

  artEl.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!usesYouTube || !currentVideoId) return;
    var url = 'https://www.youtube.com/watch?v=' + currentVideoId;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast('Song link copied!');
      }, function () {
        copyWithFallback(url);
        showToast('Song link copied!');
      });
    } else {
      copyWithFallback(url);
      showToast('Song link copied!');
    }
  });

  function refreshTrackLabel() {
    var name = usesYouTube ? window.YTAudio.currentTrackName() : window.ClubAudio.currentTrackName();
    setTrackText(cleanTitle(name));
    if (!usesYouTube) setArt();
  }

  function dropNeedle() {
    if (started) return;
    started = true;
    window.ClubAudio.unlock();
    if (usesYouTube) {
      window.YTAudio.play();
    } else {
      window.ClubAudio.playGenre(genreKey);
    }
    mp.classList.remove('paused');
    playBtn.textContent = '⏸';
    refreshTrackLabel();
    needleHint.classList.remove('shown');
  }

  setTimeout(function () {
    if (!started) needleHint.classList.add('shown');
  }, 900);

  ['click', 'keydown', 'touchstart'].forEach(function (evt) {
    document.body.addEventListener(evt, dropNeedle, { once: true, passive: true });
  });

  playBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!started) { dropNeedle(); return; }
    var playing = usesYouTube ? window.YTAudio.toggle() : window.ClubAudio.togglePlay();
    mp.classList.toggle('paused', !playing);
    playBtn.textContent = playing ? '⏸' : '▶';
  });

  document.getElementById('mp-next').addEventListener('click', function (e) {
    e.stopPropagation();
    if (!started) { dropNeedle(); return; }
    if (usesYouTube) window.YTAudio.next(); else window.ClubAudio.nextTrack();
    refreshTrackLabel();
  });
  document.getElementById('mp-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    if (!started) { dropNeedle(); return; }
    if (usesYouTube) window.YTAudio.prev(); else window.ClubAudio.prevTrack();
    refreshTrackLabel();
  });
  function setLoopGlyph(looping) {
    loopBtn.textContent = looping ? '∞' : '⇥';
  }
  loopBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var looping = usesYouTube ? !window.YTAudio.isLooping() : !window.ClubAudio.isLooping();
    if (usesYouTube) window.YTAudio.setLooping(looping); else window.ClubAudio.setLooping(looping);
    loopBtn.classList.toggle('active', looping);
    setLoopGlyph(looping);
  });
  loopBtn.classList.add('active');
  setLoopGlyph(true);

  refreshTrackLabel();
})();
