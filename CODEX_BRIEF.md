# CODEX BRIEF — BERING / 1990

## Mission

Extend the existing working `index.html` into a high-quality editorial interactive site, not a generic SaaS landing page. Keep the site usable with JavaScript disabled where practical, ship accessible interactions, and preserve evidence hygiene.

## UI grammar: VI / Visual Interaction

- Semantic colors are **context**, not decoration: blue = documented facts; violet = counterfactual hypotheses; green = active scenario/actions; amber = risks/uncertainty; neutral gray = historical baseline.
- Separate state (what is selected), action (what changes), and evidence (what can be trusted).
- Show a visual model before lengthy prose. Prefer concise labels, one idea per component, 80% ASD-STE100-style direct wording in Russian.
- Inherit recognizable interface patterns; avoid indiscriminate gradients, glow, fake 3D, meaningless motion, and decorative charts.
- Bauhaus/editorial grid, crisp type, restrained animation, strong small-screen legibility; make keyboard/focus states visible; support reduced motion.

## Content structure

1. Hero: geographic problem, 1990, 82 km, budget hypothesis.
2. Historical timeline: Soviet Borisov climate dam vs hypothetical transport crossing, distinct.
3. Money: dynamic assumptions labeled as assumptions; never fabricate historical expenditure.
4. Two futures: documented baseline vs counterfactual scenarios; avoid synthetic GDP statistics.
5. Interactive budget experiment: total, foreign share, years, clear arithmetic and caveat.
6. Failure modes: ocean circulation risk, Arctic logistics, financial exposure, political upheaval, absence of state authorization.
7. Sources, methods, precise provenance per quantitative claim.

## Current working baseline

Standalone `index.html` is complete and works without installation. Improve rather than discarding functionality. `research.md` contains sources and constraints.

## Acceptance criteria

- Mobile 360px and desktop 1440px, no clipped content.
- All buttons and sliders keyboard-operable with valid labels.
- Two scenario states switch content visibly; calculation results update consistently.
- No implying 1990 construction authorization, factual 1999 completion, or guaranteed effects on Russian banks, Japan, Europe, or climate.
- Readable static text, citations link to real source pages, graph axes/legends appropriately distinguish symbolic curves.
- Document any added dependencies; avoid unnecessary framework migration.