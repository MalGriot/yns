/* ============================================================
   PLURP — subgenre playlists & starter tracklists.

   This file is NOT wired into the site's playback (the live
   IFrame player only reads the single `playlist` id per world
   from club-data.js). It exists so you can browse/curate a real
   YouTube playlist per subgenre and swap songs at will — edit
   freely, nothing here will break the site.

   Each subgenre entry has:
     - playlistId / playlistUrl — a real, currently-live YouTube
       playlist chosen for being a well-known, high-view "best of"
       / "top" collection for that sound as of Sep 2026.
     - source — the playlist's on-YouTube title, so you can find
       it again or judge if it's still the one you want.
     - tracks — a short starter list of genre-defining songs
       (title — artist) for that subgenre. These are suggestions,
       not pulled from the playlist itself — add, remove, or
       reorder them however you like, or replace the whole
       playlistId with your own.

   To promote a subgenre's playlist to power an entire world's
   live player, copy its playlistId into that world's `playlist`
   field in club-data.js.
   ============================================================ */

window.PLURP_SUBGENRE_PLAYLISTS = {

  techno: {
    acid: {
      playlistId: 'PL39z-AAkkatucrktuQmIKjAj_4wVAa-ru',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL39z-AAkkatucrktuQmIKjAj_4wVAa-ru',
      source: 'Greatest Acid Techno Music Playlist',
      tracks: [
        'Hardfloor — Acperience 1',
        'Emmanuel Top — Acid Phase',
        'Josh Wink — Higher State of Consciousness',
        'Woody McBride — Sonic Subjunkies',
        'DJ Pierre — Fantasy (Acid Mix)'
      ]
    },
    minimal: {
      playlistId: 'PL2hGGKKbxvqJUFEs15Y0HUgikqulW6DVM',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL2hGGKKbxvqJUFEs15Y0HUgikqulW6DVM',
      source: 'Most Popular Minimal Techno Songs 2026 Playlist',
      tracks: [
        'Ricardo Villalobos — Dexter',
        'Robert Hood — Minus',
        'Minilogue — Animals',
        'Cassy — Everybody',
        'Marcel Dettmann — Quill'
      ]
    },
    industrial: {
      playlistId: 'PLCULndnUE-_qxPvPkfjNuxGZDnphA20Rf',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLCULndnUE-_qxPvPkfjNuxGZDnphA20Rf',
      source: 'Industrial & Heavy Dark Beats (Music Playlist Updated in 2026)',
      tracks: [
        'Ancient Methods — The Jealous Sea',
        'Perc — Wax Effigy',
        'Blawan — Why They Hide Their Bodies Under My Garage',
        'Regis — Blood Witness',
        'Somewhere9 — Static Grip'
      ]
    },
    melodic: {
      playlistId: 'PL6LQX_ln70ElpCal94LpMBX1_N1nHqe3C',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL6LQX_ln70ElpCal94LpMBX1_N1nHqe3C',
      source: 'Top 100 Melodic House & Techno Songs of 2023',
      tracks: [
        'ARTBAT — Horizon',
        'Tale Of Us — Astral',
        'CamelPhat — Cola',
        'Ben Böhmer — Bloom',
        'Massano — Fall Into Sleep'
      ]
    },
    hard: {
      playlistId: 'PLMmqTuUsDkRLnZkoGv4wOtPaOaPt-kFlJ',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLMmqTuUsDkRLnZkoGv4wOtPaOaPt-kFlJ',
      source: 'TOP 100 Hard Techno 2025 Playlist',
      tracks: [
        'Sara Landry — Vengeance',
        'I Hate Models — Symphony IV',
        'Charlotte de Witte — Formula',
        'ZONDERTIJD — Deception',
        'FJAAK — Bahnhof'
      ]
    }
  },

  psy: {
    progressive: {
      playlistId: 'PL671FzMxGBJsPuJDE_LH_ep-v6Oy3ZyNk',
      playlistUrl: 'https://music.youtube.com/playlist?list=PL671FzMxGBJsPuJDE_LH_ep-v6Oy3ZyNk',
      source: 'Progressive Psytrance',
      tracks: [
        'Astrix — Deep Jungle Walk',
        'Ace Ventura — Antimatter',
        'Sonic Species — Wide Awake',
        'Vini Vici — The Tribe',
        'Liquid Soul — 2012'
      ]
    },
    fullon: {
      playlistId: 'PLfn7VoBpW1hnip2n1Wcs4gRxQCL4-6Qup',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLfn7VoBpW1hnip2n1Wcs4gRxQCL4-6Qup',
      source: 'Psytrance Mixes',
      tracks: [
        'Astrix & Vini Vici — Adhana',
        'Ranji — Namaste',
        'Ghost Rider — Universal Consciousness',
        'X-Dream — Radio',
        'Captain Hook — Space Ferrari'
      ]
    },
    dark: {
      playlistId: 'PLv_qHwZ27W2Pj1rMUOkfLBa7_6ksTJ4os',
      playlistUrl: 'https://music.youtube.com/playlist?list=PLv_qHwZ27W2Pj1rMUOkfLBa7_6ksTJ4os',
      source: 'DARK + TRANCE',
      tracks: [
        'Electric Universe — Alien Encounters',
        'Talamasca — Al Green',
        'Space Tribe — Age Of The Machine',
        'Xenomorph — Legend of the Sleeper',
        'Batov — Terraform'
      ]
    },
    forest: {
      playlistId: 'PLfwFCH46rZMCu22fqu0af9yUlbQCvZtRh',
      playlistUrl: 'https://music.youtube.com/playlist?list=PLfwFCH46rZMCu22fqu0af9yUlbQCvZtRh',
      source: 'Forest Psytrance',
      tracks: [
        'Ṱriptik — Yggdrasil',
        'Symbolic — Forest Prayer',
        'Sonic Species & Battle Rats — Duality',
        'Protoculture — Tears in Rain',
        'Zyce — Silver Ships of Nightmares'
      ]
    }
  },

  house: {
    deep: {
      playlistId: 'PLlYKDqBVDxX1MiqrZTpPMKVqKDukoafn5',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLlYKDqBVDxX1MiqrZTpPMKVqKDukoafn5',
      source: 'Most Popular Deep House Songs of All Time (Updated 2026)',
      tracks: [
        'Disclosure — Latch',
        'Duke Dumont — Need U (100%)',
        'Kiasmos — Looped',
        'Lane 8 — Brightest Lights',
        'Robert Owens — I’ll Be Your Friend'
      ]
    },
    garage: {
      playlistId: 'PLvuMfxvpAQrkjEcWlaXChYimkbPR7yb7o',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLvuMfxvpAQrkjEcWlaXChYimkbPR7yb7o',
      source: 'UK Garage 2026 Playlist',
      tracks: [
        'Artful Dodger ft. Craig David — Re-Rewind',
        'MJ Cole — Sincere',
        'Wookie — Battle',
        'Todd Edwards — Saved My Life',
        'DJ EZ — Listen'
      ]
    },
    afro: {
      playlistId: 'PLyORnIW1xT6yzXsas86_Q9iYxEJH7ezj8',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLyORnIW1xT6yzXsas86_Q9iYxEJH7ezj8',
      source: 'Best Afro House Music 2026 ❤ Top Afro House Hits',
      tracks: [
        'Black Coffee — Superman',
        'Culoe De Song — Baya Baya',
        'Da Capo — Kelegetla',
        'Caiiro — African Wave',
        'Enoo Napa — Retribution'
      ]
    },
    funky: {
      playlistId: 'PLWcttt0SQjI-XY-lLbK3AYIhEeF2ZE5lV',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLWcttt0SQjI-XY-lLbK3AYIhEeF2ZE5lV',
      source: 'Funky House Playlist (Feel Good and Disco)',
      tracks: [
        'Purple Disco Machine — Hypnotized',
        'Block & Crown — Music Is Life',
        'Roger Sanchez — Another Chance',
        'Bob Sinclar — World, Hold On',
        'Kings of Tomorrow — Finally'
      ]
    }
  },

  disco: {
    nudisco: {
      playlistId: 'PL3oW2tjiIxvQf2Nsn3-fTLqm6vkJluvRv',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL3oW2tjiIxvQf2Nsn3-fTLqm6vkJluvRv',
      source: 'Nu-Disco Music Playlist 2026 - Best Nu-Disco Songs 2026',
      tracks: [
        'Chromeo — Jealous (I Ain’t With It)',
        'Breakbot — Baby I’m Yours',
        'Todd Terje — Inspector Norse',
        'Metronomy — The Look',
        'Discodroide — Music Sounds Better With You (Edit)'
      ]
    },
    funk: {
      playlistId: 'PLR3N9PCkfVATSlU6wE9lAVLSUv1n5seGw',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLR3N9PCkfVATSlU6wE9lAVLSUv1n5seGw',
      source: 'Best Funk Songs of All Time - Most Popular Funk Music',
      tracks: [
        'Kool & the Gang — Jungle Boogie',
        'Parliament — Give Up the Funk (Tear the Roof Off the Sucker)',
        'James Brown — Get Up Offa That Thing',
        'Chic — Everybody Dance',
        'The Bar-Kays — Holy Ghost'
      ]
    },
    boogie: {
      playlistId: 'PLXADUxT2H5pHh07BWNk1lfIEyety_-kKA',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLXADUxT2H5pHh07BWNk1lfIEyety_-kKA',
      source: 'Thea’s Boogie, Disco and Dance Anthems 70s & 80s',
      tracks: [
        'A Taste of Honey — Boogie Oogie Oogie',
        'Cameo — Candy',
        'Change — A Lover’s Holiday',
        'Leon Ware — Rockin’ You Eternally',
        'Central Line — Walking Into Sunshine'
      ]
    },
    italo: {
      playlistId: 'PLBccjB8tUhRRJuytYK21JnUyPL9J47KQq',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLBccjB8tUhRRJuytYK21JnUyPL9J47KQq',
      source: 'Italo Disco Music Playlist of 100 Songs',
      tracks: [
        'Righeira — Vamos a la Playa',
        'Ken Laszlo — Hey Hey Guy',
        'Gazebo — I Like Chopin',
        'P. Lion — Happy Children',
        'Valerie Dore — The Night'
      ]
    }
  },

  beach: {
    balearic: {
      playlistId: 'PL_b64CPVKPiN_J3LkUnu9_DoKK2SSZDdE',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL_b64CPVKPiN_J3LkUnu9_DoKK2SSZDdE',
      source: 'Balearic Waves 🌊 Chillout & Downtempo Music',
      tracks: [
        'Café del Mar — Energy 52 (José Padilla Edit)',
        'Balearic Blue — Sunrise Anthem',
        'Manuel Göttsching — E2-E4 (excerpt)',
        'Woolfy vs. Projections — Blowing Bubbles',
        'Penguin Cafe Orchestra — Perpetuum Mobile'
      ]
    },
    sunset: {
      playlistId: 'PLrALqIYcGkyTcnyUdfx3nkBtTDIFAVPa2',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLrALqIYcGkyTcnyUdfx3nkBtTDIFAVPa2',
      source: 'Sunset Music ☀️ Chill House Music Playlist',
      tracks: [
        'Kygo — Firestone',
        'Lane 8 — Fingerprint',
        'Yotto — Kilimanjaro',
        'Ben Böhmer — Breathing',
        'Nora En Pure — Come With Me'
      ]
    },
    downtempo: {
      playlistId: 'PLDfKAXSi6kUYmFmt-2_TIwHkYIEq2HyDD',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLDfKAXSi6kUYmFmt-2_TIwHkYIEq2HyDD',
      source: 'Chill Out / Downtempo',
      tracks: [
        'Thievery Corporation — Lebanese Blonde',
        'Bonobo — Kong',
        'Zero 7 — In the Waiting Line',
        'Kruder & Dorfmeister — Definition',
        'Nightmares On Wax — Les Nuits'
      ]
    },
    tropical: {
      playlistId: 'PL9zGbuQVW8yDouo_9V5lHXOr1eR-LPJHI',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL9zGbuQVW8yDouo_9V5lHXOr1eR-LPJHI',
      source: 'Most Popular Tropical House Songs Of All Time',
      tracks: [
        'Kygo ft. Conrad Sewell — Firestone',
        'Thomas Jack — Rivers (Ft. Kites)',
        'Sam Feldt — Show Me Love',
        'Klingande — Jubel',
        'Robin Schulz — Sugar'
      ]
    }
  }

};
