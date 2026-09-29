# Egnatia Construction: Brand Guidelines

## Positioning

**Egnatia Construction is the Brooklyn builder for New York homeowners who want a serious renovation done right, handled start to finish by one licensed team.**

- **Minimum project:** $150,000. We say this openly; it filters out poor-fit leads and signals quality.
- **Core work:** whole-home renovations, brownstones and townhouses, additions, cellar conversions and custom homes. Kitchens, baths, roofing and masonry come as part of larger scopes, not as standalone jobs.
- **Tagline:** *Built in Brooklyn. Built to last.*

## Messaging

| Message | Customer need | Proof point |
|---|---|---|
| One crew, every trade | No juggling subcontractors | Licensed trades on every job |
| No surprises | Budget and schedule certainty | Written estimates, NYC permits handled up front |
| We answer the phone | Being kept informed | One point of contact for the whole project |
| Built for New York | Brownstones, co-op boards, DOB | 10+ years building across NYC |
| Se habla español | Comfort in their own language | Bilingual team |

**10-second pitch:** Egnatia builds and renovates homes across New York City, from brownstones to ground-up builds, with one licensed team from estimate to walkthrough.

## Voice

- **Confident, not boastful.** State facts plainly. "We don’t do small jobs," not "We’re the best builders in NYC."
- **Straight talk.** Short sentences, plain words, no jargon. Talk about money openly.
- **Warm and local.** Brooklyn roots, a team that picks up the phone.
- **Avoid:** superlatives we can’t prove, invented reviews or stats, and exclamation marks.

## Visual identity

Direction: **Cinematic dark** (chosen 2026-09-28). Full-bleed imagery, film grain, serif display type, one champagne accent. Palette **Cinema** (`data-palette="cinema"`).

| Token | Value | Use |
|---|---|---|
| Ink | `#0B0A09` | Page background |
| Surface | `#121110` / `#1A1816` | Cards, alternate panels |
| Bone | `#EFE9DF` | Primary text |
| Stone | `#A59D91` | Secondary text |
| Accent | `#D9B877` | CTAs, the one italic word per headline, numbers |

Other palettes remain in `src/index.css` (Ember, Brass, Limestone, Industrial, Interior).

- **Type:** Cormorant Garamond for headlines (regular weight, lining numerals), Inter for body and small tracked uppercase labels. One *italic* champagne word per headline, at most.
- **Imagery:** one consistent cinematic look (see `docs/higgsfield-shot-list.md`). AI imagery for mood only; the work gallery shows real Egnatia projects.
- **Motion:** slow, confident ease-outs (cubic-bezier 0.16, 1, 0.3, 1). Always respect reduced-motion settings.

Tokens live in `src/index.css` (`@theme`). The share image is `public/og-image.jpg` (1200×630).
