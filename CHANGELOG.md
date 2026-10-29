# Changelog

All notable changes to Coralogix Lens are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**How to update this file:** add each change under **Unreleased** in the same pull request as the change. Every push to `main` is released automatically as the next patch version (see `packaging/macos/README.md`). When you start a new minor or major version, set it in `package.json` (for example `0.2.0`), rename **Unreleased** to that version and date (for example `## [0.2.0] - 2026-11-15`), and add a fresh **Unreleased** section.

Group entries under: **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**, **Security**.

## [Unreleased]

### Added
- GitHub Actions workflow (`.github/workflows/build-dmg.yml`) that builds, tests and packages the macOS DMG on a GitHub-hosted Mac:
  - A push to `main` uploads the DMG and its SHA-256 checksum as a run artifact, and refreshes `Coralogix-Lens-latest.dmg` on the **latest** pre-release.
  - Pull requests into `main` build a DMG artifact so it can be checked before merging.
  - Pushing a `v*` tag publishes a versioned GitHub Release with the DMG.
  - It can also be started by hand with **Run workflow**.
  - A failing test stops the build.
  - After packaging, the workflow mounts the DMG and checks that the app, the bundled engine and the Applications shortcut are inside.
  - Developer ID signing and Apple notarization run only when the signing secrets are set.
- Automatic versioning:
  - Every build of `main` gets its own permanent version and GitHub Release (`v0.1.1`, `v0.1.2`, …) with `Coralogix-Lens-<version>.dmg`, and the app shows that version.
  - The first two numbers come from `package.json`, and the last number counts up by itself. Change `package.json` to `0.2.0` to start the 0.2 series.
  - The logic is in `packaging/macos/next-version.sh`.
  - Builds of `main` now run one at a time, so two builds never get the same number.
- `.gitignore` for local build output (`dist-mac/`, `.cache/`).
- This changelog.

- New Coralogix Lens logo (aperture icon). It is used for the macOS app icon (`.icns` on Apple's 824 px grid, plus all the PNG sizes and `.ico`), the in-app header, the favicon, the brand previews and the HTML report header. `npm run icons` regenerates all of them from `brand/logo.png`.
- UI refresh, following the *Coralogix Lens UI Refinement Recommendations*:
  - **Palette:** dark-first observability palette (base #0B0F19, panels #111827 / #161F30, electric cyan for actions, purple for traces, emerald for savings, amber and coral for warnings) with soft neon glows.
  - **Themes:** a light theme and a "Match macOS" option in the header.
  - **Header and status bar:** the left rail is replaced by a header with the logo, a projected-savings pill, a pill-shaped step track (teal checks for finished steps, a glowing capsule for the current step), and a status bar showing the connector state (team and region, or *Mock mode*) and the latest versions.
  - **Cards:** glassy bento cards with a thin cyan accent along the top edge, and stat tiles.
  - **Fonts and data colours:** Inter for the interface and JetBrains Mono for data. Label keys are cyan, values slate, units violet.
  - **Verify:** "Where today's units go" stacked bars by data type and TCO tier, and a "Metric labels by cost" table with *High cardinality* / *Churn* badges (pulsing dot). These badges also appear in the findings list.
  - **Config changes:** split diff with line numbers and crimson / teal rows. A floating toolbar switches between Diff / YAML / JSON, copies, and exports the YAML, the JSON or a `git apply`-ready patch. Code blocks on findings get the same YAML / JSON / Copy / Export pill.
  - **Loading:** skeleton shimmer rows replace spinners and "Loading…" text.
- Unit tests for the patch export (it applies with `git apply` and reproduces the new config).

### Changed
- Opacity variants such as `bg-ok/10` now render. They were silently missing before because the colours are CSS variables; Tailwind now mixes them with `color-mix()`.
- `scripts/check-contrast.mjs` checks the dark and light themes, the step track, the data colours and the diff backgrounds, and makes sure "Match macOS" matches the light theme.
- `<coralogix-lens>` web component: set `data-theme="light"` (or `"system"`) on the element to change its theme.
- CI bundles Node.js 22.23.3. It was chosen because it is at least two weeks old; the packaging script's default stays 22.23.4.

### Fixed
- The zip writer test no longer fails on macOS and Debian. It used to compare the "ü" in a file name with the output of the system `unzip -l`, which those builds print as `+` or a CP437 character. It now reads the stored names from the zip's central directory, which still catches a broken UTF-8 name.

## [0.1.0] - 2026-10-29

First release of Coralogix Lens, a macOS app that automates the Telemetry Health & Value Review (TAM Playbook) across logs, traces and metrics.

### Added
- **Core engine** (`@cx-lens/core`):
  - Rule catalogue kept as data files from the playbook.
  - Analyzer plugins for Universal, Logs, Traces and Metrics.
  - Protected-label guard.
  - Overlap-safe units and savings calculator.
  - Report builder that writes internal and customer-ready reports, with a JSON Schema for `report.json`.
- **Connectors:**
  - cx CLI for logs, spans, usage and metrics (PromQL).
  - claude CLI (headless) for the Investigate analysis and the TAM skills.
  - Metrics API as a fallback when an API key is given explicitly.
  - MockAdapter with recorded, anonymised demo data.
- **Investigate with Claude:**
  - Ranks the biggest log, span and metric contributors and pulls live samples.
  - Masks those samples before anything is sent to Claude.
  - Validates every proposed change with cx or PromQL before any saving is counted.
- **Metric labels and cardinality:**
  - Label inventory with groupings by value shape.
  - Built-in OTTL fixes, tested against every real value.
  - Bundled TAM skills: `span-name-cardinality-analyzer` and `span-metrics-bucket-optimizer`.
- **Config handling:**
  - Reads Helm `values.yaml`, OpenTelemetry Collector configs (including ECS and EC2) and other shippers.
  - Writes `optimized-config.yaml` and its diff, keeping comments.
  - When the config is out of date, also writes `upgraded-config.yaml` and `breaking-changes.md`.
- **Version check:** resolves the latest otel-integration Helm chart and OTel Collector at runtime, with a 24-hour cache.
- **Several deployment types** in one review (Kubernetes/Helm, ECS, EC2, Standalone), with a config slot for each type.
- **Analysis window:** presets or a custom date and time range, plus duplicate-check window and row-limit settings.
- **Reports:**
  - HTML, Markdown and JSON, opening with a one-slide leadership summary.
  - Draft TCO policies.
  - "Download all" as a zip, named after the customer.
- **Drafts:** save a review at any stage (⌘S) and resume it later.
- **UI** (React + Tauri):
  - Seven-step flow from Connect to Remediate.
  - Light and dark mode, with a contrast check in the test suite.
- **Local API** (127.0.0.1 only) with an OpenAPI 3 spec, and the `cxlens` headless CLI.
- **macOS packaging** (`packaging/macos/build-app.sh`):
  - Builds a self-contained `.app` with checksum-verified Node.js runtimes for Apple Silicon and Intel.
  - Smoke-tests the bundled engine, then creates the DMG.
- **Saved Metric Usage API keys:**
  - Named keys stored in the macOS Keychain and offered from a dropdown for each team.
  - Add, select, test and delete them from the Connect step.
- `SOURCES.md` mapping every rule to the official documentation it comes from, including where the playbook and the docs differ.

### Changed
- Cleaner Connect interface, plus a README rewrite.

[Unreleased]: https://github.com/vibhutigoel22/cx-lens/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/vibhutigoel22/cx-lens/releases/tag/v0.1.0
