# @spanischer-verein/web-v2

The v2 front end. Same site as `packages/web`, on an updated stack.

- Mail Service: https://www.sender.net

## Stack

|                 | v1 (`packages/web`)                     | v2 (this package)                    |
| --------------- | --------------------------------------- | ------------------------------------ |
| Framework       | SvelteKit 2                             | **SvelteKit 3**                      |
| Svelte          | 5 (runes)                               | **5 (runes, `experimental.async`)**  |
| Build           | Vite 5                                  | **Vite 8**                           |
| Styling         | Sass + `<style lang="scss">`            | **Tailwind CSS 4**                   |
| UI primitives   | melt-ui, vaul-svelte                    | **bits-ui + shadcn-svelte**          |
| Data loading    | `+page.server.ts` / `+layout.server.ts` | **remote functions (`*.remote.ts`)** |
| CMS             | Sanity                                  | Sanity (unchanged)                   |
| Package manager | bun                                     | bun                                  |

## Scripts

```sh
bun run dev     # http://localhost:5174 (v1 keeps 5173)
bun run check   # svelte-check
bun run test    # vitest
bun run build
```

## Notable differences from v1

SvelteKit 3 removed or renamed several things this package had to follow:

- **No `svelte.config.js`.** The config lives in `sveltekit({ ... })` inside `vite.config.ts`, and it is flat — no `kit:` namespace.
- **`$lib` and `$assets` are gone.** Imports use the subpath imports in `package.json` (`#lib/*`, `#assets/*`) and need explicit extensions (`.js` / `.svelte`).
- **`$env/*` is gone.** Variables are declared in `src/env.ts` and read from `$app/env/private` / `$app/env/public`.
- **`$app/stores` is gone** in favour of `$app/state` (`page`, `navigating`).
- `goto`'s `noScroll` / `replaceState` are now `reset: false` / `replace: true`, and `error()` takes `(status, message, properties)`.

Beyond the framework:

- `svelte-adapter-bun` has no SvelteKit 3 build, so the regular build uses
  `@sveltejs/adapter-auto`. Swap it out once the deployment target is settled.
  The newsletter build still uses `@sveltejs/adapter-static`.
- The locale is browser-only now (`src/lib/services/locale.svelte.ts`). v1 seeded
  it from `Accept-Language` into module scope on the server, which leaked one
  visitor's locale into the next request.
- `/newsletter/register` calls a remote `command`. v1 fetched
  `/api/v1/newsletter/request`, an endpoint that never existed.
- `src/lib/components/ui/*` is shadcn-svelte output. Regenerate or extend it with
  `bunx shadcn-svelte@latest add <component>`.

## Dark mode

New in v2 — v1 had a `.dark` block in `globals.scss` that nothing ever toggled.

`mode-watcher` follows the operating system preference, remembers an explicit
choice in local storage, and sets the `dark` class on `<html>` before first
paint so the page never flashes. `<ModeWatcher />` sits in the root layout and
the toggle lives in the header.

Every colour a component uses is a custom property declared twice in
`src/routes/layout.css` — once on `:root`, once on `.dark` — and exposed as a
Tailwind utility through `@theme inline`. Components reference the tokens only,
so no component carries a `dark:` variant. The light values are v1's, unchanged.

Two brand tokens matter when editing:

- `--brand` is the mark used for fills, borders and outlines.
- `--brand-link` is the brand red used as _foreground_ text — link colour,
  underline decorations, hover text. Pure red is too dim to read against a dark
  page, so dark mode lifts this well above `--brand` while keeping the hue.

## Design tokens

`src/routes/layout.css` is the whole design system; components reference tokens
and carry no raw values.

- **Type** — `text-2xs` … `text-2xl`, in `rem` against a 16px root so the
  visitor's browser font size is respected. `--text-base` resolves to the 21px
  body the design has always used, and larger steps carry tighter leading. `em`
  is still allowed where something must track its context rather than the scale:
  superscripts, and icons sized to the text around them.
- **Elevation** — three layered steps, each a tight contact shadow plus a wider
  ambient one. `shadow-raised` for cards, the calendar and buttons at rest,
  `shadow-floating` for menus, drawers and the mobile bar, `shadow-lifted` for a
  card under the cursor. This replaced the single hard `6px 6px 0 0` offset,
  which was the one thing making cards read as a different system from the rest
  of the site.
- **Motion** — `--default-transition-duration` and
  `--default-transition-timing-function` are set, so a bare `transition-colors`
  already carries the house timing and curve; call sites name a duration only
  when they deliberately differ. Svelte's transitions are JS-driven and so out of
  reach of the `prefers-reduced-motion` block in CSS, so every `transition:`
  directive runs its duration through `motion()` in `helpers/motion.ts`.
- **Tracking** — `tracking-tight` on `h1`/`h2`, normal elsewhere, and
  `tracking-label` on the brand pills and the event date pill, which read as
  labels rather than prose. The old stylesheet put a flat `1px` on every heading
  regardless of size.
- **Radii** — `rounded-base` (8px) for cards, controls and menu items;
  `rounded-panel` (20px) for drawers and other full-width sheets.
- **Focus** — one `focus-ring` utility, keyboard-only via `:focus-visible`, on
  every interactive element. There was no focus treatment at all before.
