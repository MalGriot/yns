/* ============================================================
   PLURP club data — shared between the Entrance and the Inner World.
   One taxonomy, one source of truth, no duplicated genre lists.
   ============================================================ */

window.PLURP_GENRES = {
  techno: {
    key: 'techno',
    label: 'TECHNO',
    mood: 'Mechanical · Industrial · Kinetic',
    img: 'berlin-underground',
    imgCount: 21,
    accent: { a: '#2BE8D4', b: '#3F7FD6', glow: 'rgba(63,127,214,0.55)' },
    playlist: 'PLJ00HTt7_FlEJ054Nc2whaFjm1B4apYA7',
    subgenres: [
      { key: 'acid', label: 'Acid' },
      { key: 'minimal', label: 'Minimal' },
      { key: 'industrial', label: 'Industrial' },
      { key: 'melodic', label: 'Melodic' },
      { key: 'hard', label: 'Hard Techno' }
    ]
  },
  psy: {
    key: 'psy',
    label: 'PSY',
    mood: 'Organic · Psychedelic · Fluid',
    img: 'boho-psy',
    imgCount: 11,
    accent: { a: '#FF5FCE', b: '#2BE8D4', glow: 'rgba(255,95,206,0.5)' },
    playlist: 'PLpY7hx7jry7y3TiUDGlPEDveFRMaEwr9I',
    subgenres: [
      { key: 'progressive', label: 'Progressive' },
      { key: 'fullon', label: 'Full-On' },
      { key: 'dark', label: 'Dark' },
      { key: 'forest', label: 'Forest' }
    ]
  },
  house: {
    key: 'house',
    label: 'HOUSE',
    mood: 'Sleek · Futuristic · Club-Driven',
    img: 'house-techno',
    imgCount: 18,
    accent: { a: '#6BA0FF', b: '#FF5FCE', glow: 'rgba(107,160,255,0.5)' },
    playlist: 'PLlYKDqBVDxX1MiqrZTpPMKVqKDukoafn5',
    subgenres: [
      { key: 'deep', label: 'Deep' },
      { key: 'garage', label: 'Garage' },
      { key: 'afro', label: 'Afro' },
      { key: 'funky', label: 'Funky' }
    ]
  },
  disco: {
    key: 'disco',
    label: 'DISCO',
    mood: 'Playful · Glamorous · Maximalist',
    img: 'disco',
    imgCount: 18,
    accent: { a: '#FF5FCE', b: '#FFCF5C', glow: 'rgba(255,95,206,0.55)' },
    playlist: 'PL3oW2tjiIxvQf2Nsn3-fTLqm6vkJluvRv',
    subgenres: [
      { key: 'nudisco', label: 'Nu-Disco' },
      { key: 'funk', label: 'Funk' },
      { key: 'boogie', label: 'Boogie' },
      { key: 'italo', label: 'Italo' }
    ]
  },
  beach: {
    key: 'beach',
    label: 'BEACH CLUB',
    mood: 'Fluid · Resort · Sunset-to-Sunrise',
    img: 'beach-club',
    imgCount: 18,
    accent: { a: '#FFCF5C', b: '#6BA0FF', glow: 'rgba(255,207,92,0.5)' },
    playlist: 'PL_b64CPVKPiN_J3LkUnu9_DoKK2SSZDdE',
    subgenres: [
      { key: 'balearic', label: 'Balearic' },
      { key: 'sunset', label: 'Sunset' },
      { key: 'downtempo', label: 'Downtempo' },
      { key: 'tropical', label: 'Tropical House' }
    ]
  }
};

window.PLURP_QUESTIONS_LOBBY = [
  'WHAT WE LISTENING TO?',
  "WHAT'S THE SOUND TONIGHT?",
  'PICK YOUR FREQUENCY.'
];

window.PLURP_ENTER_LINES = ['COME IN.', "LET'S GO.", "YOU'RE IN."];

window.plurpImgPath = function (genreKey, n) {
  var g = window.PLURP_GENRES[genreKey];
  var padded = String(n).padStart(2, '0');
  return 'img/' + g.img + '/' + g.img.split('-')[0] + '-' + padded + '.jpg';
};

window.plurpVideoPath = function (genreKey) {
  var g = window.PLURP_GENRES[genreKey];
  return 'img/' + g.img + '/' + g.img.split('-')[0] + '-bg.mp4';
};
