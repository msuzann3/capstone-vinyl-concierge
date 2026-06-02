# Curate Brand Notes

Use these notes before making visual or voice changes. The source PDFs in this folder remain the authority:

- `Curate — A Field Manual.pdf`
- `Curate — Brand Assets.pdf`

## Core Direction

Curate should feel like a record store and bookshop sharing one front door: hand-painted, well-lit, warm, and quietly opinionated. The digital product should feel like the same shop, not like a generic SaaS interface.

## Palette

Primary ratio:

- Bone Cream, `#F4EFE3`: default room/page surface, about 60%.
- Vinyl Black, `#1D1D1B`: type, dark slabs, record forms, about 25%.
- Curate Red, `#DB1D1B`: CTAs, accents, signals, about 15% maximum.

Support colors:

- Sleeve White, `#ECE5D2`: card backs and secondary surfaces.
- Kraft, `#C9A878`: tags, paper, soft support.
- Sleeve Mustard, `#D9A441`: special-edition accents only.
- Deep Rust, `#8B2418`: stamp ink and print-drop feeling.

Rules:

- Keep cream as the main surface.
- Do not use pure black or pure white as the normal brand colors.
- Red is a signal, not a broad background.
- Avoid red on black and black on red; separate them with cream.

## Type

- Display: Archivo Black, regular only. Use for signage, section headers, and loud moments.
- Editorial: Newsreader Italic, 300-500. Use for ledes, quotes, and bookshop warmth.
- Body: Familjen Grotesk, 400/500/700. Use for UI, captions, paragraphs, and readable controls.
- Hand: Caveat, 600/700. Use sparingly for chalkboard or tag moments, never primary headings.
- Mono: DM Mono. Use for labels, IDs, small technical notes, and operational UI.

## Logo Rules

- The brandmark is a vinyl disk with top and bottom Curate Red soundwave arcs.
- Keep all three arc families intact; do not drop the arcs.
- The lowercase `u` in Curate is intentional.
- Do not re-typeset the logo.
- Do not crop, tilt, stretch, distort, recolor, or place the mark over photography/gradients without an opaque ground.
- Clear space should match the height of the `C` in the mark.

## Voice

Use plain, warm, slightly opinionated shopkeeper language. Be direct and specific.

Preferred words and phrases:

- Side A
- Side B
- New arrivals
- Used and well-loved
- First pressing
- Out-of-print
- Dog-eared
- Spine-cracked
- Staff pick
- Pick of the week
- Now playing
- Now reading
- Back Tuesday
- Last copies
- Hand-numbered
- Worth your Saturday

Avoid:

- Curate as a verb
- Iconic
- Disruptive
- Pre-loved
- Treasures
- Hidden gems
- Exquisite
- Bespoke
- Game-changing
- Drop
- Hype
- Must-have
- Vibes
- Aesthetic
- Era

## Implementation Notes

- The current app uses the approved Google Fonts import in `src/index.css`.
- The current app uses inline SVG logo approximations in `src/components/BrandLogo.tsx`; replace with production PNG/SVG logo files if the original asset files become available outside the PDF.
- Keep interface cards and controls functional and restrained; the brand should feel tactile, not decorative.
