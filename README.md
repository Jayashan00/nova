# Nova — landing page

A pixel-faithful rebuild of the reference landing page in raw HTML, CSS and JavaScript.
No build step, no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 5173
# then visit http://localhost:5173
```

## Structure

```
nova/
├── index.html      # all markup, semantic sections
├── css/styles.css  # tokens → base → components → responsive
└── js/main.js      # nav, mobile menu, reveals, chart, accordion, back-to-top
```

## Notes on the implementation

- **Tokens** — every colour comes from the `:root` custom properties supplied in the brief.
  Spacing, radii and motion easing are tokenised alongside them so the whole page shares
  one rhythm.
- **Ambient glows** are `position: fixed` blurred radials behind the content, with a very
  slow drift so the background never feels static.
- **Nav** darkens once scrolled, and hides on scroll-down / returns on scroll-up past 400px.
- **Scroll reveal** uses one `IntersectionObserver`; each element unobserves after firing.
  Stagger comes from `data-reveal-delay`, written into a CSS variable.
- **Hero chart** bars animate their height in when the mockup enters the viewport.
- **FAQ** is a single-open accordion driven by real `<button>`s with `aria-expanded`;
  `max-height` is measured at open time because `auto` isn't animatable.
- **Scroll handler** is throttled with `requestAnimationFrame`.

## Responsive

| Breakpoint | Behaviour |
| --- | --- |
| ≥ 1025px | 3-column grids, featured plan raised, full nav |
| ≤ 1024px | tighter section rhythm, narrower mockup sidebar |
| ≤ 860px  | hamburger nav, single-column grids, mockup sidebar stacks, steps rail tightens |
| ≤ 560px  | phone spacing, 2-column footer, full-width hero buttons |

## Accessibility

Skip link, visible focus rings, `aria-expanded` on the nav toggle and FAQ,
Escape closes the mobile menu, and `prefers-reduced-motion` disables animation
while keeping all content visible.
