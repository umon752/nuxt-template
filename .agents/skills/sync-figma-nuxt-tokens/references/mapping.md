# Figma → Nuxt token mapping

This file defines the stable mapping contract for this Nuxt starter. It contains no Figma file snapshot. Discover the supplied Figma file afresh for every sync, inventory every Variable and every local Style type, then apply these rules to the current repository state.

## Target files

| Figma source                              | Target                                              | Transformation                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Used Text node font family                | `nuxt.config.ts` / `app/assets/css/base/_theme.css` | Verify Google Fonts/local availability, add CDN links and preconnects, select `--font-base`, and comment other families for review. |
| Used Text node font size                  | `app/assets/css/base/_theme.css`                    | Keep only sizes observed in the design active in `/* font-size */`; preserve referenced legacy tokens and report them.              |
| Consumed Text style                       | `app/assets/css/utilities/_utilities.css`           | Generate a managed `.u-*` class with CSS-compatible typography declarations.                                                        |
| COLOR Variable                            | `app/assets/css/base/_theme.css`                    | Resolve the selected mode to `--color-<normalized-name>` inside `@theme`.                                                           |
| Solid color style                         | `app/assets/css/base/_theme.css`                    | Resolve the solid paint color to `--color-<normalized-name>`; mode is `N/A`.                                                        |
| Text style typography field               | `app/assets/css/base/_theme.css` / `_utilities.css` | Map size tokens to `@theme` and complete consumed-style rules to generated utilities; report CSS gaps.                              |
| Effect style                              | `app/assets/css/base/_theme.css`                    | Map CSS-compatible shadow/blur effects to `--shadow-*`, `--blur-*`, or `--backdrop-blur-*`; report the rest.                        |
| Grid style or applied layout guide        | `app/assets/css/base/_root.css`                     | Map explicit desktop/mobile `gutterSize` and `offset` to the corresponding layout tokens.                                           |
| FLOAT, STRING, or BOOLEAN Variable        | Configured target only                              | Require an explicit CSS representation, unit, target file, and token; otherwise report without writing.                             |
| `COLUMNS` guide with `alignment: STRETCH` | `app/assets/css/base/_root.css`                     | `gutterSize` → Gutter token; `offset` → Margin token.                                                                               |

## Complete Styles inventory

Figma's local Styles panel is represented by four Plugin API style types. Read all of them on every sync, regardless of whether a style is currently applied to a selected node:

| Style type | API                           | Required data                                                                                |
| ---------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `PAINT`    | `getLocalPaintStylesAsync()`  | `id`, `name`, `description`, `paints`, `boundVariables`                                      |
| `TEXT`     | `getLocalTextStylesAsync()`   | `id`, `name`, `description`, all typography properties, `boundVariables`                     |
| `EFFECT`   | `getLocalEffectStylesAsync()` | `id`, `name`, `description`, every effect entry and type-specific property, `boundVariables` |
| `GRID`     | `getLocalGridStylesAsync()`   | `id`, `name`, `description`, `layoutGrids`, `boundVariables`                                 |

All Style entries report mode `N/A`; Styles do not use Variable collection modes. Include unsupported properties in the preview with status `report-only` instead of dropping them.

When the task requires usage mapping, call `getStyleConsumersAsync()` for each style and read the consumer node's relevant style IDs. For layout guides, read both `gridStyleId` and the resolved `layoutGrids`. A style definition can exist without any current consumer, so do not infer that an unconsumed style is absent.

## Used font inventory

Read actual `TEXT` nodes on every page with `getStyledTextSegments(['fontName'])`. The inventory must distinguish:

- exact `fontName.family` and `fontName.style` pairs used by nodes;
- aggregate family usage by node count and styled-character count;
- visible and hidden consumers, page/node IDs, and direct versus Text style usage when available;
- consumed Text styles versus Text styles that are only defined but unused;
- Google Fonts family availability and each requested weight/italic variant;
- local `@font-face` availability and families that require a user-provided asset or fallback.

Use the rules in [typography.md](typography.md) for page fan-out, `--font-base` selection, Google Fonts CDN links, active font-size tokens, generated utility classes, and CSS unsupported-property reporting.

## Complete Variable inventory

Read all local Variables without filtering by type. Include these fields in the inventory and mapping preview:

- collection name and ID;
- Variable name and ID;
- `resolvedType` (`COLOR`, `FLOAT`, `STRING`, or `BOOLEAN`);
- every collection mode and the value for that mode;
- Variable aliases and their resolved source;
- scopes, publishing visibility, and WEB code syntax when available.

Do not silently discard a non-color Variable. A Variable that has no safe CSS mapping is still reported as `report-only` with the reason it was not written.

## Color mapping

Apply a project-local alias first, then normalize the Figma name:

1. Trim the name and split slash groups, spaces, underscores, and repeated hyphens.
2. Convert groups to lowercase kebab-case.
3. Prefix the result with `--color-` unless an explicit alias supplies the complete target token.

Example: `Brand/Primary/500` becomes `--color-brand-primary-500`.

Use the following source distinctions in the mapping preview:

- A COLOR Variable reports its collection, mode, resolved color value, and alias resolution.
- A Paint style reports source type `Paint style`, mode `N/A`, and its solid paint value.
- A Variable alias must be resolved through the referenced Variable and selected mode before writing. If it cannot be resolved, stop and ask for a mapping.
- Ignore non-solid paint styles for color-token creation unless the user explicitly provides a CSS representation.

When the resolved target token already exists, compare the value and classify it as `update` or `unchanged`. When it does not exist, classify it as `add`. Do not match tokens by visual similarity. A different existing semantic token requires an explicit alias or user confirmation.

## Non-color Variable mapping

Read every non-color Variable, but do not infer CSS semantics from its name alone:

- `FLOAT`: write only with an explicit target token and unit or CSS-compatible representation. A raw Figma number is not automatically `px`, `rem`, a percentage, or a unitless value.
- `STRING`: write only when the value is intended as a CSS custom-property value and the target token is explicit.
- `BOOLEAN`: report by default. CSS has no native Boolean custom-property type; require an explicit transformation if the project needs one.
- Multiple modes: retain all mode/value pairs and require a selected mode before writing to a single CSS token.

## Text style mapping

Read every local Text style and report mode `N/A`. Capture all available properties, including font family/style, font size, line height, letter spacing, paragraph settings, text case, text decoration, leading trim, list settings, fills, bound Variables, and consumers.

The typography contract has two distinct targets:

| Text source                                          | Target                          | Rule                                                                                                                                    |
| ---------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Font family used by a Text node                      | `nuxt.config.ts` / `_theme.css` | Verify Google/local availability; add CDN links and preconnects; select one global `--font-base`; comment other families for review.    |
| Font size used by a Text node or consumed Text style | `_theme.css` `/* font-size */`  | Keep only observed sizes active; use semantic aliases before deterministic size tokens.                                                 |
| Consumed Text style                                  | `_utilities.css`                | Generate one managed `.u-*` class with CSS-compatible family, size, weight, style, line-height, letter-spacing, casing, and decoration. |

Use `getStyledTextSegments(['fontName'])` across every page to determine actual font usage. A Text style with no consumer is inventory-only and must not create a font import, base-family choice, active size token, or utility class.

Use the following default mappings for consumed Text styles:

- `fontSize` → a used `--text-*` token and `font-size: var(--text-*)` in the utility class;
- `fontName.family` → `var(--font-base)` when it is the selected global family, otherwise an exact available family/fallback in the utility class;
- recognized font style names → numeric `font-weight` and optional `font-style: italic`;
- `lineHeight: { unit: "AUTO" }` → `line-height: normal`;
- pixel or CSS-compatible percentage line height → `line-height` with its preserved unit;
- pixel letter spacing → `letter-spacing` with `px`;
- percentage letter spacing and unsupported paragraph/trim/list fields → `report-only` with a decision request.

Read [typography.md](typography.md) for the full font scan, Google Fonts availability, base-family heuristic, used-size cleanup, utility naming, generated-block rules, and CSS gap policy. A Text style is not itself a single CSS variable; map the supported fields independently and show every unsupported field in the preview.

## Effect style mapping

Read every effect in an `EffectStyle.effects` array in its original order, including hidden effects and variable bindings. Preserve the full source data in the preview:

- `DROP_SHADOW` and `INNER_SHADOW`: capture RGBA color, visibility, offset X/Y, radius, optional spread, blend mode, and any bound Variables. They can be represented as a CSS `box-shadow` list only when the project accepts that representation. Use `--shadow-<normalized-name>` as the default target candidate.
- `LAYER_BLUR`: capture visibility, radius, blur type, progressive start radius/offsets when present, and bound Variables. A normal blur can be represented as a `--blur-<normalized-name>` radius; progressive blur is `report-only` unless explicitly mapped.
- `BACKGROUND_BLUR`: capture visibility, radius, blur type, progressive data when present, and bound Variables. A normal blur can be represented as a `--backdrop-blur-<normalized-name>` radius.
- `NOISE`: capture noise type, colors, visibility, blend mode, noise size, density, opacity when present, and all available metadata. It has no faithful generic CSS token mapping by default, so classify it as `report-only`.
- `TEXTURE`: capture visibility, noise size, radius, clip-to-shape, and metadata. Classify it as `report-only` unless the project provides an explicit CSS or asset representation.
- `GLASS`: capture visibility, light intensity/angle, refraction, depth, dispersion, radius, and metadata. Classify it as `report-only` unless explicitly mapped to a project-specific implementation.

Do not convert an Effect style into a single hard-coded color or shadow by selecting only its first effect. Preserve every effect entry and order. Do not silently discard blend modes or visibility flags; report them when CSS cannot represent them exactly.

## Modes

- A collection with one mode can be mapped directly.
- A collection with multiple modes must have a target mode supplied by the user or by the project override file.
- Do not invent CSS mode selectors, dark-mode blocks, or a light/dark naming convention for this starter.
- Keep the selected mode in the preview so the written value is auditable.

## Responsive layout mapping

| Guide context                                                             | `gutterSize`   | `offset`              |
| ------------------------------------------------------------------------- | -------------- | --------------------- |
| Desktop/default guide explicitly identified                               | `--gutter`     | `--margin-gutter`     |
| Mobile guide explicitly identified by frame name, project config, or user | `--gutter-mob` | `--margin-gutter-mob` |

Read both a local `GridStyle.layoutGrids` definition and the resolved `layoutGrids` on a consuming frame when available. Use `gridStyleId` to associate the consumer with its Grid style. The style name or explicit project mapping must identify desktop/mobile; do not infer mobile from canvas position or frame width alone.

`offset` is the Figma layout-grid field corresponding to the visible Margin value in the Columns dialog. Do not use `sectionSize` for this mapping. Preserve `px` in `_root.css`.

If several valid guides exist, show all candidates and ask which one to use. Exclude hidden guides, zero-value helper grids, and small cursor/icon frames unless explicitly targeted. If no mobile guide is identified, leave the existing mobile tokens unchanged and report that no mobile source was found.

## Optional project overrides

Create `.codex/figma-token-map.json` only when a project has naming, type, property, mode, or node-selection exceptions that cannot be inferred safely. Keep this file in the project, not in the reusable skill. Supported shape:

```json
{
  "colorAliases": {
    "Brand/Primary": "--color-primary"
  },
  "variableAliases": {
    "Spacing/Small": {
      "token": "--spacing-sm",
      "target": "theme",
      "unit": "px"
    }
  },
  "textStyleAliases": {
    "<text-style-name>": {
      "className": "u-example-text-style",
      "fontSize": "--text-example",
      "fontFamily": "--font-base",
      "lineHeight": "--leading-example",
      "letterSpacing": "--tracking-example"
    }
  },
  "font": {
    "baseFamily": "<font-family>",
    "fallback": "sans-serif",
    "familyAliases": {
      "<font-family>": "'<font-family>', sans-serif"
    }
  },
  "textSizeAliases": {
    "<font-size>": "--text-example"
  },
  "effectStyleAliases": {
    "<effect-style-name>": {
      "token": "--shadow-example",
      "representation": "box-shadow"
    }
  },
  "gridStyleAliases": {
    "<desktop-grid-style-name>": {
      "gutter": "--gutter",
      "margin": "--margin-gutter"
    },
    "<mobile-grid-style-name>": {
      "gutter": "--gutter-mob",
      "margin": "--margin-gutter-mob"
    }
  },
  "modes": {
    "Theme": "Light"
  },
  "layoutGuides": {
    "desktopNodeId": "<desktop-node-id>",
    "mobileNodeId": "<mobile-node-id>"
  }
}
```

Use aliases as exact source-name matches. Use configured node IDs only after confirming they exist in the supplied Figma file; never carry a node ID across files implicitly. Treat invalid or stale overrides as ambiguity and report them instead of silently falling back to a potentially wrong source.

## Conflict policy

- Preserve existing public token names and update them only when the resolved target matches exactly or an explicit alias selects them.
- Add new normalized tokens beside existing ramps when no collision exists.
- Never overwrite `accent`, `error`, or another semantic token merely because a value happens to be visually similar.
- Replace only marked Google Fonts CDN link/CSP and Text style utility blocks; preserve unrelated config, CSS, and manual utilities.
- Keep non-Figma-used starter font-size tokens active when repository code references them; otherwise move them to a labelled comment instead of silently deleting them.
- Do not change CSS outside the declarations and managed blocks required by the confirmed mapping.
- Never hide an unsupported Variable or Style property from the preview just because it cannot be written automatically.
