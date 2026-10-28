# Spanischer Verein

Source code for the website https://spanischer-verein.com - a platform representing a nonprofit organization cultivating German-Spanish relations.
Includes Content Management System (Sanity Studio) and frontend (SvelteKit).

## Secret scanning (pre-commit)

Commits are scanned for secrets with [gitleaks](https://github.com/gitleaks/gitleaks) via `.githooks/pre-commit`.

```sh
brew install gitleaks   # required once per machine
bun install             # points git at .githooks (prepare script)
```

`bun run scan:secrets` scans the whole history. Rules live in `.gitleaks.toml`;
add verified false positives to its `[allowlist]`. To bypass a single commit:
`SKIP_GITLEAKS=1 git commit ...`.

## Notes

- Check if Netlify is building a preview: https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
  This way, the preview can be built with Sanity Presentation functionality.
- https://www.sanity.io/plugins/sanity-plugin-media
- For single types: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
- Page tree
  - https://github.com/brimdata/react-arborist
  - https://www.sanity.io/plugins/page-tree
  - https://github.com/sanity-io/hierarchical-document-list
- Dashboard https://github.com/sanity-io/dashboard
- https://github.com/sanity-io/sanity-plugin-workspace-home
- https://github.com/sanity-io/google-maps-input
- https://github.com/sanity-io/sanity-plugin-scheduled-publishing
- https://www.sanity.io/docs/structure-builder-typical-use-cases#c22ce054acba

