# Content (Phase 3)

## Copy

- Use the user's real copy when they give it. Otherwise write believable copy for the project's audience: specific benefits, real-sounding product and plan names, plausible numbers. Never Lorem ipsum, never the block's default sample text.
- Use the user's brand or a fictional one. No real brand names, products or logos that aren't the user's (customer logo walls use fictional company names unless the user supplies real ones).
- Keep copy lengths close to the block's design: headings that fit on the same number of lines at xl, descriptions of similar length. If real copy is much longer, check the base frame and adjust the project block if needed.
- Button labels are short verbs ("Start free trial", "Book a demo"), and the primary action is consistent across the site.

## Stores

- Use the agreed locale everywhere: language, currency symbol and position, decimal and thousands separators, date format, VAT or sales tax wording (e.g. "inkl. MwSt." for Germany, "incl. VAT" for the UK).
- Keep **one order across pages**: the same items, sizes, quantities, prices, discounts, delivery cost, tax and totals on cart, checkout and confirmation. Compute totals and tax in code, not by eye, and use them everywhere.
- Delivery dates and estimates are worked out from today's date, and weekdays must match the real calendar.
- Product names, sizes and colours stay consistent between the PLP, PDP, cart and recommendations.

## Images

- If the user supplies images, place them as image fills in the matching ImagePlaceholder or media frame (use the Figma MCP's asset upload tool if it has one). Keep the AspectRatio the block uses; crop with the fill's scaling, don't resize the frame.
- Otherwise keep the image placeholders, and list every page and block still using one in the report.
- Images with text on top keep the `colors/bg-overlay` layer.
- Logos: the brand logo goes in the project's Logo usage (navbar, footer) once the user supplies it; customer logos stay placeholders until real ones are supplied.

## Dates and numbers elsewhere

- Blog, changelog and event dates are recent and in the right order (newest first in archives); upcoming events are in the future, on-demand recordings in the past.
- Archive categories and controls fit the content type (topics for a blog, product areas for a changelog, products or industries for customer stories, event types for events), and every item's category is one of them.
- Customer stories carry a named (fictional unless supplied) customer, a quote and plausible results. Changelog entries carry a version or date and a product area. Events carry a date, time zone, format (in person, online) and speakers.
- Keep post titles and H2 headings short: the table of contents lists the H2s.
- Stats and metrics are plausible and consistent wherever they repeat.
