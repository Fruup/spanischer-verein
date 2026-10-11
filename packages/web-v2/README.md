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
