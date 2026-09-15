# MXIA Game Project Rules

This game is part of the MXIA Kids Game Platform.

## Required package contract

- The production URL is `https://www.mxiaapp.com/app/{game-id}`. Previously published `/th/app/{game-id}` routes are redirects only.
- The project must contain `game.manifest.json`.
- Every build must produce a self-contained `dist/` directory with `index.html`.
- Do not manually edit generated files in `dist/`.
- Do not include `node_modules`, source files, README files, or development configuration in `dist/`.
- All document-level asset URLs must work from the exact no-trailing-slash production route.
- Do not use root assets such as `/assets/app.js` or relative document assets such as `./assets/app.js`.
- Assets must remain under `/app/{game-id}/`.

## Storage

- All browser-storage keys must use:
  `mxia:game:{game-id}:v{schema-version}:{key}`
- Existing storage keys must be migrated. Never silently discard existing player progress.
- Use localStorage only for small settings and progress.
- Use IndexedDB for custom content or data that can grow.
- Handle unavailable storage and quota errors.
- Never store authentication tokens, payment status, or sensitive child information locally.

## Security

- No inline scripts or inline event handlers.
- Avoid inline styles in HTML.
- Do not use `eval()` or `new Function()`.
- External scripts, fonts, APIs, analytics, and advertising services must be declared in the manifest and approved before use.
- Do not weaken the MXIA Content Security Policy to make one game work.

## Quality

Before reporting completion:

1. Run the game build.
2. Run package validation.
3. Verify the generated `dist/`.
4. Test desktop and mobile rendering.
5. Exercise the primary start interaction.
6. Check browser console errors.
7. Verify storage save and reload.
8. Confirm that no asset resolves outside the game route.

An HTTP 200 response is not proof that the game works.

Before modifying an existing game, report:

- current build structure;
- asset-path problems;
- storage keys and required migrations;
- CSP incompatibilities;
- external resources;
- bundle-size issues;
- proposed changes.

Do not change gameplay unless explicitly requested.
