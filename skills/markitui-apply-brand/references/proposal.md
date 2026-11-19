# The proposal

One message, short enough to read in a minute. Show decisions and numbers; don't explain the system. End with a clear question, then **stop**. Nothing in the file changes before the user approves.

## Format

**1. Source.** One line: where each value came from (brand book p. 4, acme.com computed styles, user's hex values). Mark sampled or guessed values.

**2. Palette.** The brand palette as a row of its steps (all 11, or only the ones kept), the designer's own shades in bold, and the neutral choice:

| | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| brand | #f4f8ff | … | | | | | **#2563eb** | | | | … |

Under it, one line with what the designer chose: "only your shades; steps 50–500 and 700–950 removed", "your shade plus 700 and 400, generated", "full palette generated from #2563eb", "all yours". Same for every other palette that changes.

Neutral: keep stock / tinted towards the brand hue / from the brand book.

**3. Semantic colours.** Only the roles that change from the current file, plus their contrast. Light and dark side by side:

| Role | Light | Dark | Contrast (L / D) |
|---|---|---|---|
| interactive-accent (hover, active) | brand/600 (700, 800) | brand/600 (700, 800) | 5.17 / 5.17 with fg-on-accent |
| fg-on-accent | base/white | base/white | |
| fg-accent, fg-link | brand/600 | brand/400 | 5.17 / 6.82 on bg-primary |
| … | | | |

"All other semantic colours stay as they are."

**4. Type.** Families per slot, which roles use which family and weight, tracking changes, and any font that isn't available with the proposed substitute.

**5. Shape.** `radius-main` → a step alias or a fine-tuned number (with px), radius scale kept or scaled, shadows kept / softened / removed / tinted.

**6. Modes.** Rename `Brand A / Light|Dark` to `{Brand} / Light|Dark`, or add a new pair (with the plan-limit note and the code note from `colour-system.md` §7).

**7. Decisions needed.** Numbered, each with your recommendation, for anything that isn't a straight value change:

- brand colour fails contrast with white text (the three options from `colour-system.md`)
- square or rounded buttons, which needs a component edit (`radius-and-shadows.md`)
- a heading sans that needs a repurposed font slot
- optional status-colour contrast fix
- roles that fall short of contrast or lose their hover colour because the palette has only the brand's own shades
- any doc/variable mismatch found in Step 1

**8. Question.** "Approve as is, or tell me what to change?"

## Rules

- No proposal goes out with shades the designer didn't decide on. If the shades question (`colour-system.md` §1: whether a full palette is needed, and if so how) hasn't been answered, ask it first.

- Contrast numbers come from running the proposed values, not estimates: use `contrast()` from `scripts/brand-scale.js` or the audit's maths on the proposed hex values.
- Every "must" pair in `checks.md` passes in the proposal, or appears under Decisions needed.
- If the user changes something, update only that part, re-check contrast for what it touches, and show the changed rows. Don't resend the whole proposal unless asked.
- Approval of the proposal covers exactly what is in it. Anything new found while applying goes back to the user.
