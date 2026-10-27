# Coralogix Lens

**A clear view of which telemetry is worth keeping.**

Coralogix Lens is a macOS app that automates the *Telemetry Health & Value Review – TAM Playbook*. It reviews a customer's logs, traces and metrics, finds telemetry that is noisy, duplicated or too expensive for the value it gives, and writes the collector and Helm changes to fix it. It then turns the results into a customer-ready report, phased into Quick Wins → Coordinated Changes → Strategic work.

It is not only a cost-cutting tool. Cleaner, better-structured telemetry makes troubleshooting and alerting easier, and the quota it frees up can be spent on new services, signals and Coralogix features.

| | |
|---|---|
| Version | 0.1.0 |
| Installer | `Coralogix-Lens-0.1.0.dmg` (about 72 MB) |
| Runs on | macOS 12 Monterey or later, Apple Silicon (M1–M4) and Intel |
| Includes | Node.js 22.23.4 runtime (you do not need to install Node) |
| CLI command | `cxlens` |
| Bundle ID | `com.coralogix.lens` |

---

## Contents

1. [Install and run the DMG](#1-install-and-run-the-dmg)
2. [Prerequisites for live Coralogix teams](#2-prerequisites-for-live-coralogix-teams)
3. [Using the app, step by step](#3-using-the-app-step-by-step)
4. [Using the command line (cxlens)](#4-using-the-command-line-cxlens)
5. [What Lens checks](#5-what-lens-checks)
6. [What Lens produces](#6-what-lens-produces)
7. [Safety rules](#7-safety-rules)
8. [Where Lens keeps its files](#8-where-lens-keeps-its-files)
9. [Troubleshooting](#9-troubleshooting)
10. [Uninstalling](#10-uninstalling)
11. [Architecture](#11-architecture)
12. [Building from source](#12-building-from-source)
13. [Extending Lens](#13-extending-lens)
14. [Sources](#14-sources)

---

## 1. Install and run the DMG

### Step 1: Open the DMG

Double-click `Coralogix-Lens-0.1.0.dmg`. A window opens with three items: **Coralogix Lens**, a shortcut to **Applications**, and **Read Me First.txt**.

### Step 2: Copy the app

Drag **Coralogix Lens** onto the **Applications** shortcut. Then eject the DMG (click the eject icon next to it in the Finder sidebar).

### Step 3: Allow the app the first time

The app is not signed with an Apple Developer ID, so macOS blocks it the first time. You only need to do this once. Choose **one** of these two options.

**Option A: through System Settings**

1. Open **Coralogix Lens** from Applications. macOS shows a message that it cannot be opened. Click **Done** (or **OK**).
2. Open **System Settings → Privacy & Security**.
3. Scroll down to the Security section. You will see a line about "Coralogix Lens" being blocked. Click **Open Anyway**.
4. Enter your Mac password if asked, then click **Open Anyway** again.

**Option B: one command in Terminal**

Open Terminal (Applications → Utilities → Terminal) and run:

```bash
xattr -dr com.apple.quarantine "/Applications/Coralogix Lens.app"
```

This removes the "downloaded from the internet" flag, so macOS opens the app normally.

### Step 4: Open Coralogix Lens

Double-click **Coralogix Lens** in Applications (or find it with Spotlight: ⌘ Space, type "Coralogix Lens").

What happens:

1. Lens starts its local engine in the background. The engine listens on `127.0.0.1` only, so nothing outside your Mac can reach it.
2. After a second or two, the app window opens.
   - If you have Google Chrome, Microsoft Edge, Brave or Chromium, the window opens in **app mode**: a clean window with no tabs or address bar.
   - Otherwise it opens in your default browser (for example Safari).
3. The engine usually uses port `4319`. If that port is busy, Lens picks a free one.

Lens has no Dock icon. The engine runs quietly in the background until you stop it.

### Step 5: Try it with demo data

You do not need a Coralogix account to try Lens. On the **Connect** step, choose **demo data**, then go through the steps. The demo uses recorded, anonymised data and a sample Helm config.

### Reopening and stopping

- **To reopen the window:** open Coralogix Lens again. A small dialog says it is already running. Click **Open Window**.
- **To stop Lens:** open Coralogix Lens again and click **Stop Coralogix Lens**. You will see a notification that the engine has stopped.

---

## 2. Prerequisites for live Coralogix teams

Demo mode needs nothing extra. To review a real customer team, install the tools below. Lens checks them for you on the **Connect** step (click **Check prerequisites**).

| Tool | Required? | What Lens uses it for | How to install |
|---|---|---|---|
| **cx** (Coralogix CLI) | Required for live teams | All read-only discovery queries for logs, spans, metrics (PromQL) and usage | `brew install coralogix/tap/cx` then `cx profiles add <name> --region <region>` |
| **claude** (Claude Code CLI) | Optional | AI review of masked samples (Investigate) and the TAM skill plugins | `npm install -g @anthropic-ai/claude-code`, then run `claude` once to sign in |
| **helm** | Optional | Rendering Helm values to validate the final collector config | `brew install helm` |
| **otelcol-contrib** | Optional | Running `otelcol-contrib validate` on generated configs | Download the `darwin_arm64` (Apple Silicon) or `darwin_amd64` (Intel) build from the [opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases) page, unpack it, and move `otelcol-contrib` to `/usr/local/bin` |

Notes:

- Coralogix access needs **read permissions only**, as the playbook requires.
- Lens uses cx's own sign-in (OAuth or API key). It never reads or stores your cx key.
- Lens loads the same `PATH` as your Terminal, so tools installed with Homebrew, npm or in `~/.local/bin` are found automatically.
- **Exact metric usage (optional):** for exact per-label metric units, add an API key with the **DataAnalytics** preset under *Exact metric usage* on the Connect step. It is stored in the macOS Keychain. Without it, Lens estimates metric savings from series counts.

---

## 3. Using the app, step by step

Lens follows the playbook's three stages and is honest about which parts are automated:

| Stage | Who does it | What happens |
|---|---|---|
| **Assess** | Lens (automated) | Runs read-only queries and analyses the config. Nothing changes in the customer's environment. |
| **Verify** | TAM and customer | One card per finding with evidence, estimated units and a checklist. Each finding is marked Verified, Rejected or Needs scoping. |
| **Remediate** | TAM and customer | Only Verified findings go into the generated config and the customer report, packaged into three phases. |

The app walks you through seven steps.

**1. Connect.** Pick a Coralogix team (a cx profile) or choose demo data. Status badges show whether cx, claude and metrics access are working. You can also resume or delete saved drafts here.

**2. Customer context.** Enter the customer name, environment, who the report is prepared by, and the audience. Tick every deployment type the customer uses: Kubernetes with the Coralogix Helm chart (default), ECS, EC2 or standalone collector. Mark which services are critical; several trace rules use this. If the customer is close to renewal, or their team cannot take part in Verify, Lens shows a gentle warning (it does not block you).

**3. Choose pillars.** Pick Universal (recommended first, pre-selected), Logs, Traces and Metrics. You can also switch on **Investigate**, which uses Claude to look at the biggest real contributors in the data, and turn each TAM skill on or off.

**4. Config and versions (optional).** Drop, paste or browse to the customer's config: Coralogix `values.yaml`, an OpenTelemetry Collector `config.yaml`, or another shipper config such as Fluent Bit. Lens detects the format and version and shows a badge such as "Up to date" or "3 versions behind". Here you also set the analysis window (default last 24 hours for volume checks, 15 minutes for duplicate checks) and the row limit per query. Without a config, Lens still runs the assessment and writes fresh config snippets.

**5. Run Assess.** Each check shows live progress: waiting, running, done, skipped or failed. Click any check to see the exact query it ran.

**6. Verify.** One card per finding, with evidence, estimated Coralogix units per day, and a checklist to go through with the customer:
- Does the customer rely on this attribute, log, span or metric (dashboards, alerts, saved queries, recording rules, exports)?
- Does a Coralogix feature depend on it?
- Is the estimated effect acceptable?

Mark each finding **Verified**, **Rejected** or **Needs scoping**. Protected-label warnings appear in an orange banner.

**7. Remediate and report.** See the phased roadmap, the config diff, the upgrade section (if the customer is behind), and export everything. **Download all** gives a single zip. **Download all as draft** includes unverified findings and marks every report DRAFT.

The three phases are decided by effort, not by size, so the biggest saving can sit in Phase 2:

| Phase | What it means |
|---|---|
| 🟢 Phase 1 – Quick Wins | Config-only changes, no application changes |
| 🟡 Phase 2 – Coordinated Changes | Helm upgrade, collector redeploy, or light cross-team review |
| 🟠 Phase 3 – Strategic | Application code changes or architectural decisions |

**Handy shortcuts and features:**
- **Save draft** (⌘S) at any step. Drafts hold the customer details, config, current step and Verify decisions. They never contain API keys.
- **Start a new review** clears everything and returns to Connect (it offers to save a draft first).
- Finding status (🔴 Not started, 🟡 In progress, 🟢 Done, ⚪ Pending) can be updated later. Re-running the assessment refreshes the report, because the playbook says the report should be revisited, not used as a one-time snapshot.
- **Re-run in 24 hours** repeats the metric label analysis after changes and shows before and after series counts.
- **PDF:** open an HTML report and use File → Print → Save as PDF.

---

## 4. Using the command line (cxlens)

The app includes the `cxlens` command-line tool. To use it from any Terminal window, link it once:

```bash
sudo mkdir -p /usr/local/bin
sudo ln -sf "/Applications/Coralogix Lens.app/Contents/Resources/bin/cxlens" /usr/local/bin/cxlens
```

Try it with demo data:

```bash
cxlens analyze --demo --pillars universal,logs,traces,metrics --out ~/Desktop/lens-demo
```

A full live review:

```bash
cxlens analyze --pillars universal,logs,traces,metrics \
  --team <cx profile> --region ap1 \
  --config ./values.yaml --deployment helm \
  --customer "Acme" --env prod --prepared-by "Jane TAM" \
  --critical checkout,payment \
  --out ./report
```

Other commands:

```bash
cxlens doctor --team <profile>                        # check cx, claude, metrics access and latest versions
cxlens versions --refresh                             # latest Helm chart and OTel Collector (24 h cache)
cxlens recheck --team <profile> --before ./report     # 24 h post-change label re-run, before/after series
cxlens teams add <name> --region ap1                  # store an API key in the macOS Keychain
```

Useful flags:

| Flag | What it does |
|---|---|
| `--window 24h` | Volume-check window, 1 hour to 7 days |
| `--from … --to …` | Custom UTC time range instead of `--window` |
| `--dup-window 15m` | Duplicate-check window, 1 to 60 minutes |
| `--row-limit 200` | Rows per query |
| `--deployment helm,ecs,ec2` | Several deployment types; pair with `--config helm=values.yaml --config ecs=ecs.yaml` |
| `--otel-version 0.98.0` / `--chart-version 0.0.300` | Set versions when they cannot be detected |
| `--span-metric db_calls_total` | Span metric for the label analyzer (default `calls_total`) |
| `--verify all` or `--verify LOG-1,SPAN-2` | Mark findings as Verified from the command line |
| `--state verify.json` | Load saved Verify decisions |
| `--allow-draft` | Include unverified findings, with a DRAFT watermark |
| `--investigate [n]` | Run Investigate on the top *n* contributors |
| `--vendor <name>`, `--no-skills`, `--no-ai` | Control TAM skills and Claude use |
| `--near-renewal`, `--no-verify-team` | Show the playbook's eligibility warnings |
| `--internal-terms "jane,acme-internal"` | Extra words to strip from the customer-ready report |
| `--audience leadership` | Who the summary slide is for |
| `--zip` | Also write one zip with every output |

---

## 5. What Lens checks

Every finding has an ID that starts with its pillar: `UNI-`, `LOG-`, `SPAN-` or `METRIC-`. Investigate findings start with `INV-`.

### Universal (run first; helps every signal)

| ID | Check | Default phase |
|---|---|---|
| UNI-REDUCE-RESOURCE-ATTRS | `reduceResourceAttributes` missing, using the default denylist, or not on all three collectors | 🟡 2 |
| UNI-GROUPBYATTRS | Repeated identical Resource/Scope blocks; compact with `groupbyattrs`, then `batch` | 🟢 1 |
| UNI-K8SATTR-ALLOWLIST | `k8sattributes` extracting everything; allowlist only what is used | 🟢 1 |
| UNI-MEMLIMIT-BATCH | `memory_limiter` and `batch` missing or in the wrong order | 🟢 1 |
| UNI-OTLP-COMPRESSION | Exporter without compression (saves network egress, not Coralogix units) | 🟢 1 |
| UNI-UPGRADE | Helm chart or collector out of date | 🟡 2 |
| UNI-PROTECTED-LABEL-REMOVED | Current config already deletes a protected label (high priority) | 🟢 1 |

### Logs

| ID | Check |
|---|---|
| LOG-ATTR-REDUCTION | Heaviest resource attributes by subsystem |
| LOG-DUP-KEYS | The same key values repeated across logs |
| LOG-TEMPLATES | Templates and Schema Explorer review: parsing, cardinality, alert coverage |
| LOG-MULTILINE | Stack traces split into many lines (fixed on the filelog receiver) |
| LOG-LOW-VALUE | Bodies such as OK, 200, healthcheck, pong |
| LOG-DEDUP | The same log ID or body seen many times in a short window |
| LOG-OVERSIZED | Logs over 32 KB |
| LOG-TCO-FIT | Low-value logs sitting in the High TCO tier; legacy TCO Override users |
| LOG-SEVERITY | Routine events logged as errors |
| LOG-SAVINGS-CALC, LOG-BASELINE | Daily units and savings per finding |

### Traces

| ID | Check |
|---|---|
| SPAN-SAMPLING | No or weak tail sampling (keep errors and slow traces, sample healthy traffic) |
| SPAN-HEALTH | Health checks, pings and probes |
| SPAN-INTERNAL | High share of INTERNAL spans in non-critical services |
| SPAN-LOW-PRIORITY | Per-service sampling for non-critical services |
| SPAN-LABELS | Heavy resource or span attributes |
| SPAN-HEAVY-VALUES | IDs and query strings in span names or URLs |
| SPAN-LIBRARIES | High-volume instrumentation libraries |
| SPAN-SPANMETRICS-TCO | Alerts on raw traces; traces in the High tier |

Sampling percentages are editable. The playbook values are the defaults.

### Metrics

| ID | Check |
|---|---|
| METRIC-HIGH-CHURN | High-churn ID attributes such as `k8s.*.uid`, `container.id`, `process.pid` |
| METRIC-SPAN-SANITIZATION | Span-metric cardinality from URLs and DB statements |
| METRIC-SPAN-ATTRS | High-cardinality span attributes becoming metric labels |
| METRIC-UNUSED, METRIC-FILTER-UNUSED | Top metrics by units with zero queries in 30 days |
| METRIC-LABEL-ANALYZER | Unique series per service (healthy: about 10–50 span names per service) |
| METRIC-CARDINALITY-LIMIT | `aggregation_cardinality_limit` and `otel_metric_overflow` |
| METRIC-NO-PROB-SAMPLER | Never suggests `probabilistic_sampler` for metrics |
| METRIC-HEAVY-RESOURCE | Heavy resource attributes on ECS, EC2 and standalone collectors |
| METRIC-SCRAPE-INTERVAL | Scrape interval shorter than 60 s |
| METRIC-REDACTION | Sensitive or high-cardinality values |

### Adoption gaps

Recorded in a separate report section, not counted as savings: services that are not instrumented, signals not yet sent (traces, profiling, RUM), features not yet used (SLOs, Infrastructure Explorer, AI features), .NET services on the deprecated Coralogix .NET SDK, and where the freed quota could go next.

### Investigate (optional, uses Claude)

Investigate finds what actually drives the volume in the customer's data, then:

1. Ranks the biggest log patterns, span operations and metrics with cx.
2. Pulls live samples and masks them on your Mac (emails, IPs, tokens, keys, card numbers, account IDs).
3. Asks Claude (with all tools switched off) to explain each one and suggest one change.
4. Validates the suggestion itself, never trusting Claude: checks the OTTL, runs the filter with cx, and refuses anything that would drop errors or touch protected labels.
5. Calculates savings from measured volume and the official unit rates. Unvalidated suggestions are shown as Needs scoping with no saving claimed.

The playbook's two TAM skills, `span-name-cardinality-analyzer` and `span-metrics-bucket-optimizer`, run as part of metrics Investigate.

---

## 6. What Lens produces

| File | What it is |
|---|---|
| `<Customer>.html`, `.md`, `.json` | Customer-ready report. Internal names, Notion, Slack, Drive and Gong links, account IDs, keys and team hostnames are removed, and checked again before export. |
| `<Customer> (internal).html`, `.md`, `.json` | The same report plus sources, queries, raw evidence and skipped checks. |
| `optimized-config.yaml` and `.diff` | The customer's config on their current version with Verified findings applied. Their structure, order and comments are kept, and every added block has a comment with the finding ID and source link. |
| `upgraded-config.yaml`, `.diff` and `breaking-changes.md` | Only when the customer is behind: the config moved to the latest version, with breaking changes auto-fixed where they are mechanical and the rest listed as Manual action needed. |
| `tco-policy-drafts.json` | Draft TCO log and trace policies. Never created automatically. |
| `calls_total_ALL_SERVICES_unique_labels.csv` | Metrics Label Analyzer export. |
| `assessment.json` / `report.json` | Machine-readable output, versioned with a JSON Schema. |

With several deployment types, outputs go into one folder per type: `kubernetes/`, `ecs/`, `ec2/`, `standalone/`.

**Report layout.** Every HTML report opens with a one-slide leadership summary (press "Present full screen", Esc to exit), followed by Technical details: summary tiles, phased roadmap, ranked opportunities, overlaps, combined potential (with the ±20% caveat), 30-day usage trend, version status, detailed findings, adoption gaps and next steps.

**Overlaps.** When two findings affect the same data (for example tail sampling and health-check removal), Lens never adds their savings together. It prints a plain-English note and uses an overlap-safe total everywhere.

**Units.** Savings are shown in Coralogix units per day, with GB as secondary detail. Conversion uses only the official per-pillar and per-tier rules from the Coralogix documentation.

**Versions.** Lens resolves the latest otel-integration Helm chart from the official Coralogix Helm repo and the latest OTel Collector from the opentelemetry-collector-releases GitHub releases, caches them for 24 hours, and shows them on the main screen. Nothing is hard-coded. Offline, it uses the cache and shows when it was last checked.

---

## 7. Safety rules

**Read-only by default.** Every cx call uses `--read-only`. Lens never changes Coralogix settings, TCO policies or a running collector. TCO policies, recording rules and Events2Metrics are produced as drafts only.

**Protected labels are never removed.** Infrastructure Explorer, the APM Infrastructure tab and AWS resource enrichment depend on these resource attributes:

- `cloud.provider`, `cloud.platform`, `cloud.account.id`, `cloud.account.name`, `cloud.region`, `cloud.availability_zone`
- `host.id`, `host.name`, `host.image.id`, `host.type`
- `azure.*` and `gcp.*` infrastructure identifiers

The list lives in one file, `protected-labels.yaml`. The config writer refuses to delete any of them, removes them from any existing denylist it touches (with a comment explaining why), and a final guard re-scans every output before saving. Because a custom `reduceResourceAttributes` denylist replaces the chart default, Lens always writes the full protected-safe list.

**Secrets stay safe.** API keys are stored in the macOS Keychain, never in plain text, logs or drafts.

**Data sent to Claude is masked first.** Emails, IPs, tokens, keys, card-like numbers and account IDs are masked on your Mac, and the app shows exactly what will be sent.

**Every query has limits.** A time window and a row limit on every query, plus throttling to respect API rate limits.

**Local only.** The engine listens on `127.0.0.1` and requires a random per-session token for every API call.

---

## 8. Where Lens keeps its files

| What | Where |
|---|---|
| The app | `/Applications/Coralogix Lens.app` |
| Assessment runs | `~/.cxlens/runs` |
| Drafts | `~/.cxlens/drafts` |
| Version cache (24 h) | `~/.cxlens/cache` |
| Engine state (port, process ID) | `~/.cxlens/app` |
| Engine log | `~/Library/Logs/Coralogix Lens/engine.log` |
| API keys | macOS Keychain, service `com.coralogix.lens` |

`~/.cxlens` is a hidden folder. In Finder, press ⌘⇧G and type `~/.cxlens` to open it.

---

## 9. Troubleshooting

**"Coralogix Lens can't be opened because Apple cannot check it for malicious software."**
This is the first-run block. Follow [Step 3](#step-3-allow-the-app-the-first-time).

**"Coralogix Lens is damaged and can't be opened."**
Run this in Terminal, then open the app again:
```bash
xattr -dr com.apple.quarantine "/Applications/Coralogix Lens.app"
```

**Nothing seems to happen when I open the app.**
Wait a few seconds; the engine takes a moment on first start. If no window appears, look at the log:
```bash
tail -50 ~/Library/Logs/Coralogix\ Lens/engine.log
```
You can also open the window yourself. The port is saved here:
```bash
open "http://127.0.0.1:$(cat ~/.cxlens/app/engine.port)/"
```

**The window opened in Safari but I want an app-style window.**
Install Google Chrome, Microsoft Edge or Brave. Lens uses them in app mode automatically.

**"cx CLI installed: Not found" on Connect.**
Check that `which cx` works in Terminal. If it does, stop Lens and open it again so it picks up your latest `PATH`. If not, install it with `brew install coralogix/tap/cx`.

**"claude CLI signed in" fails.**
Run `claude` once in Terminal and sign in. Investigate and the skills need this; everything else works without it.

**The engine is stuck or the port is in use.**
Stop it, then open the app again:
```bash
kill "$(cat ~/.cxlens/app/engine.pid)"; rm -f ~/.cxlens/app/engine.*
```

**Version check says "offline".**
Lens could not reach the Coralogix Helm repo or GitHub. It uses the cached versions and shows the date they were last checked. Click refresh when you are back online, or run `cxlens versions --refresh`.

---

## 10. Uninstalling

1. Stop Lens (open it and choose **Stop Coralogix Lens**).
2. Drag `/Applications/Coralogix Lens.app` to the Trash.
3. Optional: remove your data, logs and the CLI link.
   ```bash
   rm -rf ~/.cxlens "$HOME/Library/Logs/Coralogix Lens"
   sudo rm -f /usr/local/bin/cxlens
   ```
4. Optional: remove saved keys in **Keychain Access** by searching for `com.coralogix.lens`.

---

## 11. Architecture

Lens is built in layers so other products can embed the engine as a feature.

```
┌─────────────────────────────────────────────────────────┐
│  UI layer (React + TypeScript + Tailwind)                │
│  Also exported as embeddable components / web component  │
└───────────────▲─────────────────────────────────────────┘
                │ REST + WebSocket (OpenAPI 3 spec)
┌───────────────┴─────────────────────────────────────────┐
│  Local API server (127.0.0.1 only, per-session token)    │
└───────────────▲─────────────────────────────────────────┘
                │
┌───────────────┴─────────────────────────────────────────┐
│  Core engine (@cx-lens/core, pure library, no UI code)   │
│  - Rule catalogue (YAML data from the playbook)          │
│  - Analyzer plugins: universal / logs / traces / metrics │
│  - Protected-label guard                                 │
│  - Config parser, writer and upgrader                    │
│  - Units and savings calculator (with overlap handling)  │
│  - Report builder (internal + customer-ready)            │
└───────────────▲─────────────────────────────────────────┘
                │
┌───────────────┴─────────────────────────────────────────┐
│  Connector adapters (one interface, many backends)       │
│  - CxCliAdapter      (cx CLI on the Mac)                 │
│  - ClaudeCliAdapter  (claude CLI, headless)              │
│  - MetricsApiAdapter (Coralogix Metrics API, read-only)  │
│  - MockAdapter       (fixtures for tests and demos)      │
└─────────────────────────────────────────────────────────┘
```

### Project structure

```
cx-lens/
├── packages/
│   ├── core/          Engine: analyzers, guard, config writer/upgrader, units, reports, JSON Schema
│   ├── rules/         Rule catalogue: universal, logs, traces, metrics, protected-labels, units, domains, sources (YAML)
│   ├── connectors/    cx, claude, Metrics API, Metric Usage API (gRPC), mock, Keychain
│   ├── api/           Local server and OpenAPI 3 spec
│   └── ui/            React app, component library and <coralogix-lens> web component
├── apps/
│   ├── cli/           cxlens command
│   └── desktop/       Tauri macOS shell (Rust)
├── skills/            Bundled TAM skills from the playbook's AI Skills tab
├── fixtures/          Demo data and sample Helm, ECS and EC2 configs
├── docs/              Sample report and screenshots
├── brand/             Logo and icon sources
├── scripts/           Icon build and colour-contrast check
├── README.md
└── SOURCES.md         Every source used, mapped to rules, plus every playbook-vs-docs difference
```

### Inside the DMG

```
Coralogix Lens.app/Contents/
├── Info.plist                 App metadata (macOS 12+, no Dock icon)
├── MacOS/CoralogixLens        Launcher: picks the runtime, loads your PATH, starts the engine, opens the window
└── Resources/
    ├── runtime/node-arm64     Official Node.js 22.23.4 for Apple Silicon
    ├── runtime/node-x64       Official Node.js 22.23.4 for Intel
    ├── server/server.mjs      Engine and local API, bundled into one file
    ├── server/cli.mjs         cxlens CLI, bundled into one file
    ├── server/ui/             Built web UI
    ├── server/rules/          Rule catalogue (YAML)
    ├── server/skills/         TAM skills
    ├── server/proto/          Metric Usage API definitions
    ├── fixtures/demo.json     Demo data
    ├── bin/cxlens             CLI wrapper
    └── icon.icns              App icon
```

### Tech stack

| Part | Technology |
|---|---|
| Engine, API, CLI | TypeScript on Node.js |
| YAML handling | `yaml` library (Document API keeps comments and anchors) |
| UI | React 18, TypeScript, Tailwind, Vite |
| Desktop shell | Tauri 2 (native build) or the bundled launcher (this DMG) |
| Tests | Vitest (unit, golden, upgrade, overlap, protected-label), Playwright (UI flows) |

---

## 12. Building from source

You need Node.js 20 or later.

```bash
npm install
npm run build        # builds core, connectors, api, cli and ui
npm test             # 97 tests across 14 files (Vitest)
npm run e2e          # full UI flow in Chromium, light and dark (Playwright)
```

Run without packaging:

```bash
npm run serve        # app at http://127.0.0.1:4319
npm run demo         # CLI demo report in ./demo-report
```

### How this DMG was built

This DMG was built on Linux, so it does not use the Tauri shell (Tauri needs Apple's Xcode tools, which only run on a Mac). Instead:

1. The project is built with `npm run build`, and all tests pass.
2. The API server and the CLI are each bundled into a single file with esbuild.
3. The official Node.js 22.23.4 macOS binaries (arm64 and x64) are downloaded from nodejs.org and checked against the published SHA-256 checksums.
4. A standard `.app` bundle is assembled with `Info.plist`, the icon, a launcher script and the resources above.
5. An HFS+ volume is created and compressed into a DMG with `libdmg-hfsplus`, the same tool Mozilla uses to build Firefox's Mac installers on Linux.

Because it is not signed with an Apple Developer ID, macOS asks you to allow it once ([Step 3](#step-3-allow-the-app-the-first-time)).

### Building the native Tauri app (on a Mac)

The native build opens Lens in its own macOS window (WebKit) instead of a browser window.

```bash
# One-time setup
xcode-select --install
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install tauri-cli --version '^2'

# Build
npm install
npm run build && npm run icons && npm run desktop:build
# Output: apps/desktop/src-tauri/target/release/bundle/dmg/
```

The Tauri shell currently starts the engine with the system Node.js (20 or later). To ship without that dependency, add a Node binary as a Tauri `externalBin` sidecar and point `main.rs` at it. To distribute without the first-run warning, sign and notarise with an Apple Developer ID.

---

## 13. Extending Lens

**Add an analyzer.** Add the rule (queries, thresholds, verify questions, sources) to `packages/rules/<pillar>.yaml`, then add a plugin:

```ts
import { definePlugin, loadCatalogue } from '@cx-lens/core';

export const myCheck = definePlugin(loadCatalogue(), 'LOG-MY-CHECK', 'logs', {
  async detect(ctx) {
    const e = await ctx.query('LOG-MY-CHECK', 'my-query');
    return e.rows?.length ? { applicable: true, evidence: [e], facts: { n: e.rows.length } } : null;
  },
  recommend: () => ({ nextStep: 'What the customer should do next.' }),
  estimateSavings: () => ({ kind: 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: 'Why' }),
  generateConfigPatch: () => ({ summary: '…', snippet: '…', ops: [] }),
});
// runAssessment({ ..., extraPlugins: [myCheck] })
```

Title, phase, effort, owner, overlaps, verify checklist and sources come from the YAML, so playbook updates are data changes, not code changes.

**Add a TAM skill** without code changes:

```ts
import { skillAnalyzer } from '@cx-lens/core';
import { ClaudeCliAdapter } from '@cx-lens/connectors';

const plugin = skillAnalyzer(
  { id: 'span-name-cardinality-analyzer', path: '~/skills/span-name-cardinality-analyzer.skill', pillar: 'metrics', title: 'Span name cardinality (skill)' },
  new ClaudeCliAdapter(),
);
```

The skill runs headless through `claude -p`, and its JSON output is mapped to standard findings with status Candidate.

**Embed the engine** in another product:

```ts
import { runAssessment, produceOutputs } from '@cx-lens/core';
import { buildConnector } from '@cx-lens/connectors';

const a = await runAssessment({
  connector: await buildConnector({ name: 'acme', region: 'eu2', profile: 'acme' }),
  customer, pillars: ['universal', 'logs'], deployment: 'helm', configText,
});
const { files } = await produceOutputs(a);
```

You can also call the local API (spec at `/api/openapi.json`), or use the UI as a component (`import { LensApp } from '@cx-lens/ui'`) or as a web component (`<coralogix-lens api="http://127.0.0.1:4319" token="…">` from `@cx-lens/ui/element`).

**Environment variables** (used by the launcher; useful when embedding):

| Variable | Purpose |
|---|---|
| `CXLENS_PORT` | Port for the local API (default 4319) |
| `CXLENS_TOKEN` | Session token (random if not set) |
| `CXLENS_HOME` | Data folder (default `~/.cxlens`) |
| `CXLENS_UI_DIR`, `CXLENS_RULES_DIR`, `CXLENS_SKILLS_DIR`, `CXLENS_PROTO_DIR` | Locations of the UI, rules, skills and proto files |
| `CXLENS_CACHE_DIR` | Version cache folder |
| `CXLENS_USAGE_KEY` | DataAnalytics key for the Metric Usage API |

---

## 14. Sources

Lens uses only these sources for every rule, query, threshold, processor and config key:

- *Telemetry Health & Value Review – TAM Playbook* (all tabs: Universal, Logs, Traces, Metrics, AI Skills), the Executive Summary – Optimization report template, and the Tail Sampling reference playbook.
- Official Coralogix documentation (coralogix.com/docs) and official Coralogix GitHub repos, including the otel-integration chart README and CHANGELOG.
- Official OpenTelemetry documentation (opentelemetry.io) and the opentelemetry-collector, opentelemetry-collector-contrib and opentelemetry-collector-releases repos.

When the playbook and the official docs disagree, the official docs win, and the difference is noted in a code comment and in `SOURCES.md`. Anything not covered is reported as "Not covered by official guidance" rather than guessed. Every finding in the internal report carries its source (doc title and URL).
