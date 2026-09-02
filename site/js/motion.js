/* ============================================================
   Scroll-driven motion system.
   No autoplay loops: shimmer position and glow strength are both
   pure functions of scroll state. Move, and it performs. Stop,
   and it holds — exactly the "trip, glow, repeat" rule in the
   brand guidelines (05: Motion moves on scroll, not on a timer).
   ============================================================ */

(function () {
  var root = document.documentElement;
  var ticking = false;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setShimmerFromScroll() {
    var max = document.body.scrollHeight - window.innerHeight;
    var progress = max > 0 ? window.scrollY / max : 0;
    // Sweep the gradient back and forth across its 300% track as the page scrolls.
    var x = (Math.sin(progress * Math.PI * 2) * 0.5 + 0.5) * 100;
    root.style.setProperty('--shimmer-x', x.toFixed(2) + '%');
  }

  function updateGlows() {
    var vh = window.innerHeight;
    document.querySelectorAll('.glow, .glow-teal, .glow-gold').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var distanceFromCenter = Math.abs(center - vh / 2);
      var strength = 1 - Math.min(distanceFromCenter / (vh / 1.4), 1);
      el.style.setProperty('--glow-strength', Math.max(0, strength).toFixed(2));
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      setShimmerFromScroll();
      updateGlows();
      ticking = false;
    });
  }

  if (reduceMotion) {
    root.style.setProperty('--shimmer-x', '40%');
    document.querySelectorAll('.glow, .glow-teal, .glow-gold').forEach(function (el) {
      el.style.setProperty('--glow-strength', '0.6');
    });
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  // Reveal-on-scroll: settle in once, stay settled.
  var revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealTargets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
