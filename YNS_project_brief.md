# Yass & Sass (YNS): Website Project Brief

**Fabulous. Bold. Fearless.**
Bangalore-born party-fashion platform · shop by music genre · 2026-08-22

---

> Supersedes and formalizes the founder's original rough notes, kept as-is for reference at [YNS_founder_notes.md](YNS_founder_notes.md).

## 1. The Play

Every fast-fashion site sells clothes. YNS sells an *identity for the night ahead*, and the site is the first place that identity has to prove itself. The leverage here isn't the product catalogue, it's the world-building: if a visitor lands on the Berlin Underground page and it genuinely feels like a warehouse rave, the brand has already won the sale before a single product loads. Get the atmosphere right and the clothes sell themselves; get it wrong and YNS reads as just another D2C store with a genre label slapped on it.

The build should therefore be sequenced so the *feel* is proven early, one genre page, fully realized, before scope spreads across five worlds, a map, and a membership tier.

---

## 2. Site Architecture

```
Landing (brand entry, MTV/model-shoot vibe)
│
├── Shop by Genre  →  5 genre "worlds"
│     01 Boho Psy            psychedelic, earthy, mystical, free-spirited
│     02 Berlin Underground  dark, raw, industrial, experimental
│     03 House & Techno      sleek, sexy, futuristic, club-driven
│     04 Disco                glitter, glam, playful, maximalist
│     05 Beach Club           fluid, sensual, resort, sunset-to-sunrise
│         each world = distinct visual environment + ambient music + video-led PDP
│
├── The Map (live club/party scene finder, Bangalore, DB-fed)
│
├── omY'S Club (paid membership, exclusive content & drops)
│
├── Cart / Checkout
│
└── Brand / PLURP / About
```

One wordmark, one voice, five skins. The nav and cart persist across every world so the user never loses the thread; see [Brand Guidelines §05](YNS_brand_guidelines.md) for the through-line rule.

---

## 3. Core Features

### 3.1 Shop by Genre
- Each genre is its own landing environment: distinct background, color temperature (pulled from the iridescent palette), and typographic energy, but built on shared components so five worlds don't become five codebases.
- Entering a genre should feel like walking into that party, not clicking a filter. Full-bleed video backgrounds, ambient loops, motion; reference the moodboard links in [YNS_reference_links.md](YNS_reference_links.md).
- Product grid within each genre is standard e-commerce underneath the skin: filter, sort, size, add-to-cart. The theatrics sit above a boring, reliable commerce layer.

### 3.2 Video-Led Product Media
- Every clothing item needs a short video (turn, movement, fabric drape) in addition to stills. This is a shoot/production dependency, not a dev one. Site brief should assume a hybrid PDP gallery: hero video autoplay-muted-loop, stills for zoom/detail, no static-only fallback as the default state.
- Until the photoshoot happens, the brief already accounts for stock/supplied imagery as placeholder. Do not let placeholder video become permanent by default.

### 3.3 Ambient Music Per Section
- Each genre carries a matching ambient/music bed, user-initiated (autoplay-with-sound is a hard no on the open web and will tank engagement metrics). Treat it as a "drop the needle" moment: a visible, low-friction toggle, not a browser fight.
- Licensing is the real constraint here, not engineering. Confirm rights/royalty terms per track per genre before it ships, ideally sourced through the same artist/DJ relationships the brand is building for collabs.

### 3.4 The Map: Bangalore Club/Party Scene
- Interactive map surfacing live club nights, party scenes, and events around Bangalore, fed by a database (not hardcoded pins).
- Needs a lightweight admin/CMS path so venues and events can be added/updated without a dev. This is what keeps the map alive after launch instead of going stale in month two.
- Positions YNS as a nightlife authority, not just a storefront. This is the feature most likely to earn organic reach and repeat visits between purchases.

### 3.5 omY'S Club: Paid Membership
- Gated, subscription-based tier: exclusive content, early/limited drops, party updates, community layer.
- Needs: auth, payment/subscription billing, content-gating, and a member-only surface distinct from the general shop (see brand voice: *"You don't shop here. You belong here."*).
- Recommend launching this *after* the core shop and map are live and validated. Membership only has pull once there's a scene worth belonging to.

---

## 4. Brand Foundation (iridescence is the material, not the accent)

Full detail lives in [YNS_brand_guidelines.md](YNS_brand_guidelines.md) and [YNS_brand_description.md](YNS_brand_description.md). The peacock's chest is the whole point: flat color reads as boring, and the site needs to chase the same trip-and-glow high the customer is already chasing on a dance floor. Key constraints for build:

- **Wordmark:** YNS always shimmering (not just "iridescent as an option") on black, YASS/SASS locked underneath in white. A reversed flat-ink version exists only for surfaces that can't render shimmer (print, packaging tags). Never recolored to a flat brand color, stretched, or placed on a mid-tone background.
- **Symbol, real feather, not an illustration:** the second mark is a single peacock feather, eye and all, shot as a photograph against black, never redrawn or vectorized. This is a **production dependency, same category as the clothing photoshoot**: someone needs to actually shoot a feather before this mark exists. Used standalone as avatar, stamp, or hangtag seal.
- **Palette is now a shimmer system, not a chip set.** Every named hue drifts toward a second color rather than sitting flat: Teal → cyan → blue, Blue → sky → violet, Magenta → pink → violet, Gold → warm gold → magenta. Only Ink `#0B0C10` and Bone `#F3EFE6` stay flat, as the neutral stage the shimmer performs on. **Chrome** `#9AA0AC` is new: a dark-steel-to-specular-highlight-to-dark-steel sweep that sits underneath every shimmer as its metallic base. It isn't a hue, it's the shine the color rides on.
- **Glow is on-brand, deliberately.** A soft neon bloom behind the wordmark, the feather, hover states, and drop countdowns: "trip, glow, repeat." Glow marks a moment, it does not fill a room; this is a lighting effect, not a permanent background treatment.
- **Motion is scroll-driven, not autoplay.** The shimmer sweep and glow intensity should be tied to scroll position, not a timed loop. The identity comes alive as the visitor moves through the page and holds still the instant they stop. This is a real front-end requirement (scroll-linked CSS/WebGL, not a decorative GIF) and should be scoped into Phase 0, not bolted on later.
- **Usage split shifted dramatically:** Ink 40% · Bone 18% · Iridescence 24% · Chrome 11% · Glow 7%. Iridescence went from a 10%-of-surface accent to nearly a quarter of the visual weight. This changes the color budget for every genre world, not just the homepage.
- **Type:** Anton (display) / Manrope (body) / JetBrains Mono (price, SKU, drop labels), unchanged.
- **Voice:** Direct, genre-fluent, never apologetic, never discount-first, unchanged.
- **Culture layer:** PLURP (Peace, Love, Unity, Respect, Party) and the rural-craft-to-urban-night value chain story; both belong somewhere in the Brand/About surface, not buried in a footer link.

**Build implication:** this is a heavier front-end lift than the earlier flat-palette version assumed. Shimmer-on-scroll and glow states are real engineering, not a palette swap. Factor this into the Phase 0 estimate before committing a date.

---

## 5. Phasing

Building all five genre worlds, the map, and paid membership simultaneously is the fastest way to ship nothing well. Sequence by what proves demand cheapest:

| Phase | Scope | Why this order |
|---|---|---|
| **0, Foundation** | Design system from brand guidelines (shimmer palette, chrome, glow, type, components), scroll-driven motion system, landing page, one genre fully built end-to-end | Prove the "walk into a party" feel, and that the shimmer/glow actually performs, before replicating it 4x |
| **1, Shop Live** | Remaining 4 genre worlds, full PDP with video, cart/checkout, stock/supplied imagery as placeholder media | Get the commercial engine running and sellable |
| **2, The Map** | DB-backed club/event map + lightweight admin path to keep it current | Nightlife-authority hook, drives repeat traffic between drops |
| **3, omY'S Club** | Membership auth, billing, gated content | Launch once there's a community worth paying to join |

---

## 6. Open Questions

- **Photoshoot timeline:** when does supplied/stock imagery get replaced by the real video-led shoot? This gates how long "placeholder" media stays on the live site.
- **Feather photography:** the peacock feather mark must be shot as a real photograph, not illustrated. Who's sourcing the feather and shooting it, and on what timeline relative to the clothing shoot? The wordmark's secondary symbol doesn't exist until this happens.
- **Shimmer/glow performance budget:** scroll-linked iridescence and glow states are real front-end engineering (not a CSS gradient swap). Worth a technical spike in Phase 0 to confirm it performs on mid-range phones before it's promised as a launch feature.
- **Music licensing:** per-genre track sourcing and rights, ideally through DJ/artist relationships already in the roadmap.
- **Map data source:** who owns keeping the Bangalore club/event database current post-launch (internal team, partner venues self-serve, or curated by YNS)?
- **Payments/subscription provider:** for both checkout and omY'S Club recurring billing (India-specific: UPI support matters here).
- **Platform:** build target (custom stack vs. headless commerce like Shopify/Medusa + custom front end) not yet decided; the video-heavy, multi-world nature of the site argues for a custom front end over an off-the-shelf theme regardless of backend choice.

---

*YNS: Build the place women go when they need to dress for the night.*
