---
name: sync-figma-nuxt-tokens
description: Read and synchronize all Figma Variables and local Styles (Paint, Text, Effect, and Grid), every font actually used in the supplied design, Google Fonts CDN links in nuxt.config.ts, used font sizes, typography utility classes, and responsive layout guides into this Nuxt 4 starter. Use when a user provides a Figma design URL and asks to import, sync, compare, or map design tokens, colors, typography, fonts, text styles, effects, grid styles, gutters, margins, Google Fonts, CDN font links, or utilities to nuxt.config.ts, app/assets/css/base/_theme.css, _root.css, or app/assets/css/utilities/_utilities.css.
---

# Sync Figma Nuxt Tokens

Synchronize the Figma file supplied for the current task into this repository without changing Figma content. Discover every local Variable, every local Style type, and every font used by text nodes before deciding what can be written. The Figma URL and the current repository are runtime inputs; never use a previous file's IDs, names, values, fonts, or node observations as defaults.

## Runtime inputs

- Require a Figma `/design/` URL for every sync and parse its `fileKey` dynamically.
- Use `node-id` only when the user supplied it or when a node-scoped read is necessary. Do not guess a node ID.
- Treat `nuxt.config.ts`, the current repository's CSS files, existing token names, utility classes, and CSP as the target contract.
- Inspect `app/assets/css/base/_theme.css`, `app/assets/css/base/_root.css`, and `app/assets/css/utilities/_utilities.css`.
- Inspect `nuxt.config.ts` for existing Google Fonts `preconnect`/stylesheet links and CSP entries. Preserve unrelated head links and security settings.
- Accept an optional project-local `.codex/figma-token-map.json` for naming exceptions, Variable type targets, mode selection, font-family selection, font fallbacks, Text style class names, text-size aliases, Effect/Grid mappings, or explicit desktop/mobile node selection. Do not create this file unless the project needs an exception that cannot be inferred safely.

## Workflow

1. Read the nearest `AGENTS.md`, then inspect the target CSS files, `nuxt.config.ts`, and any existing generated-block markers. Treat the Google Fonts link entries and the corresponding CSP hosts in `nuxt.config.ts` as explicit sync targets.
2. Parse the supplied Figma URL into `fileKey` and an optional concrete `node-id`. If the URL is absent or malformed, stop and request a valid URL.
3. Before every `use_figma` call, load and follow the `figma-use` skill. Use read-only Plugin API code to discover the current file; do not create, edit, delete, or bind anything in Figma.
4. Discover the complete current design-system inventory:
   - When a concrete `node-id` is supplied and the request is about values used by that node, call the Figma MCP `get_variable_defs` for that node. Treat its result as node-scoped, not as a whole-file export.
   - Local Variables: call `getLocalVariableCollectionsAsync()` and `getLocalVariablesAsync()` without filtering to `COLOR`. Read every `resolvedType`, every collection mode, every `valuesByMode` entry, aliases, scopes, publishing visibility, and code syntax.
   - Local Styles: call `getLocalPaintStylesAsync()`, `getLocalTextStylesAsync()`, `getLocalEffectStylesAsync()`, and `getLocalGridStylesAsync()`.
   - Read complete Paint, Text, Effect, and Grid style definitions, descriptions, bound Variables, and mode `N/A`. Read style consumers when usage mapping is needed.
   - Read Grid style definitions and candidate frame/component/instance `gridStyleId` and `layoutGrids`; associate the resolved guide with its source style when possible.
   - Inspect `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` when relevant and report remote collections separately. Do not silently treat unavailable remote data as local data.
5. Discover every font actually used by the design. Follow [references/typography.md](references/typography.md): enumerate pages first, then issue one read-only `use_figma` call per page in parallel, set the page once per call, find every `TEXT` node (including hidden nodes, instances, and components), and read `getStyledTextSegments(['fontName'])`. Collect each exact family, font style, weight/italic variant, node usage count, character/segment count, and page/node consumers. Also list Text styles that are defined but have no consumers separately; do not treat an unused style as a used font.
6. Resolve typography and font availability:
   - Determine the global `--font-base` candidate from an explicit override first, then a consumed Body/Paragraph/Base style, then the most-used family by styled characters and nodes. Show the heuristic and all alternatives in the preview.
   - Verify every used family and requested weight/style against the official Google Fonts CSS2 endpoint or official Google Fonts metadata using read-only network access. Do not add dependencies, download font files, or guess that a family exists.
   - Generate deduplicated Google Fonts CDN stylesheet links with only the used variants and `display=swap`. Put `preconnect` entries for `fonts.googleapis.com` and `fonts.gstatic.com`, plus the stylesheet link, in `nuxt.config.ts` under `app.head.link`; do not add Google Fonts `@import` rules to `_theme.css`.
   - Add the Google Fonts hosts to `security.headers.contentSecurityPolicy` `style-src`/`font-src` only when missing. Deduplicate existing hosts and preserve unrelated CSP entries.
   - If a family is not on Google Fonts, or a requested variant is unavailable, report it explicitly. If it is the selected base family, stop before writing `--font-base` and ask for a local-font or fallback decision. For other families, leave a commented candidate below `--font-base` and report the missing source.
7. Resolve modes, aliases, values, and typography mappings:
   - If a Variable has one mode, use that value. If it has multiple modes, require a target mode or explicit project mapping.
   - Resolve Variable aliases through the referenced Variable and selected mode. Report unresolved aliases instead of fabricating values.
   - Treat desktop/mobile as explicit context from a frame name, node mapping, or user instruction. Do not guess a mobile value from a desktop guide.
   - Convert Figma `lineHeight` unit `AUTO` to CSS `line-height: normal`.
   - Convert recognized Figma font styles to CSS `font-weight` and `font-style`; report custom or ambiguous styles.
   - Treat Figma letter-spacing percentages and other CSS-inexpressible fields according to [references/typography.md](references/typography.md); do not emit invalid CSS.
8. Build a complete mapping preview before writing. Include every Variable, every Style type, every used font and variant, Google Fonts availability, selected base-family candidate, `nuxt.config.ts` preconnect/stylesheet/CSP changes, active and commented font-family entries, only the font sizes actually used by text nodes, each generated Text style utility class, layout tokens, and unsupported CSS properties. Mark every item `add`, `update`, `unchanged`, `comment-only`, `report-only`, `blocked`, or `needs-confirmation`. Ask for confirmation before CSS/config changes when the base family, mode, Google availability, utility-class collision, unsupported CSS representation, or token collision is ambiguous.
9. Apply only confirmed mappings:
   - Google Fonts CDN `preconnect`/stylesheet links and the required CSP hosts go to `nuxt.config.ts` under controlled generated entries. The global `--font-base` and other commented font-family suggestions go to `app/assets/css/base/_theme.css`; do not silently make other families global defaults.
   - The active `/* font-size */` section contains only sizes used by text nodes or consumed Text styles. Reuse explicit aliases such as `--text-h1`; use deterministic `--text-size-<value>` names for unstyled sizes. Move unused starter font-size tokens to a clearly labelled comment instead of deleting tokens referenced elsewhere in the repository.
   - Generate one utility class per consumed Text style in `app/assets/css/utilities/_utilities.css`. Normalize `H1`, `Heading 1`, and `Header 1` to `.u-h1` (and corresponding levels); otherwise use `.u-<normalized-style-name>`. Include CSS-compatible family, size, weight, style, line-height, letter-spacing, text-transform, and text-decoration declarations. Use a managed generated block and preserve unrelated/manual utilities.
   - COLOR Variables and solid color styles go to `app/assets/css/base/_theme.css` as `--color-<normalized-name>` inside `@theme`.
   - CSS-compatible Effect style fields may map to `--shadow-*`, `--blur-*`, or `--backdrop-blur-*`; preserve effect order and report unsupported effects.
   - Grid style and applied layout guide values go to `app/assets/css/base/_root.css` as desktop/mobile gutter and margin tokens when context is explicit.
   - FLOAT, STRING, and BOOLEAN Variables require an explicit CSS representation, unit, target file, and target token; otherwise report them without writing.
   - Do not change components, pages, Nuxt configuration outside the Google Fonts `app.head.link`/CSP entries, dependencies, or Figma content for a token/typography sync.
10. Format only changed CSS/config/skill files, run `git diff --check`, inspect the complete diff, and report checks actually run. Do not stage, commit, push, or modify unrelated user changes.

## Mapping rules

Read [references/mapping.md](references/mapping.md) for the reusable Variable, Style, layout, and conflict contract. Read [references/typography.md](references/typography.md) whenever the task includes font discovery, Google Fonts, font sizes, Text styles, utility classes, or CSS unsupported typography properties. These references contain no Figma file snapshot and must not replace a fresh Figma read.

## Safety rules

- `get_variable_defs` reads Variables/styles used by one concrete node; it is not a whole-file Variable export and requires a real node target.
- `use_figma` can list a whole file's local Variables and all four local Style types without placing them on a frame. A frame is only needed for node-scoped usage or for identifying which style is applied to a layout guide.
- A complete font inventory requires scanning every page's Text nodes; local Text styles alone are insufficient because text can use a font directly or use a remote/unpublished style.
- A `use_figma` page scan must set the current page at most once. Fan out multi-page scans as parallel calls, never switch pages in a loop.
- Resolve color values from normalized Figma RGB values to six-digit uppercase hex. Preserve alpha only when the target CSS token explicitly supports it.
- Do not collapse multiple Variable modes into one CSS value without an explicit target mode.
- Do not silently omit non-color Variables, fonts, Text styles, or unsupported typography properties; report them clearly.
- Do not emit `letter-spacing` percentages or other CSS-invalid values merely to mirror Figma. Keep them in the preview with a proposed conversion or manual decision.
- Do not silently overwrite `--font-base`, remove a referenced token, replace a manually edited utility class, or remove an existing Google Fonts link. Preserve unrelated changes and only replace marked generated entries.
- In `nuxt.config.ts`, update only Google Fonts `preconnect`, stylesheet, and required CSP host entries. Never rewrite the whole `app.head` or `security` object.
- If the source exposes no usable Variables, styles, used fonts, or layout guides, report that result instead of fabricating tokens.
