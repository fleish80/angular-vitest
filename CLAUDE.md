# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo actually is

A single-app Nx workspace whose purpose is to **demonstrate Vitest for Angular** (Angular 21 + Vitest 4 via `@analogjs/vite-plugin-angular`). The app at `apps/main-app` is a documentation/teaching site: each route under `src/app/topics/*` is a topic page that explains a Vitest concept, paired with a runnable example spec under `src/app/examples/*.spec.ts` (plus a separate browser-mode suite under `apps/main-app/tests/browser/`).

> ⚠️ The `README.md` describes a multi-app `shop`/`api`/libs setup that **does not exist** in this repo. Ignore the README's project structure and tag tables — only `apps/main-app` is real, there are no `libs/`, and the `eslint.config.mjs` `scope:shop` / `scope:api` constraints refer to projects that aren't present. Trust `apps/` and `nx show projects` over the README.

## Common commands

Always run via `npx nx ...` (or the `npm` scripts) — no global Nx CLI required.

```bash
# Dev server (Angular)
npx nx serve main-app                          # http://localhost:4200

# Build
npx nx build main-app                          # production by default
npx nx build main-app --configuration=development

# Lint
npx nx lint main-app

# Unit tests — jsdom (default `test` target, picks up src/**/*.spec.ts)
npx nx test main-app                           # one-shot
npx nx test main-app --watch                   # watch mode
npx nx test main-app --ui                      # Vitest UI (also: npm run test:ui)
npx nx test main-app -- src/app/examples/basic.spec.ts        # single file
npx nx test main-app -- -t "should add numbers"               # by test name
npx nx test main-app --coverage                # v8 coverage → coverage/apps/main-app

# Browser-mode tests — Playwright/chromium, runs tests/browser/**
npm run test:browser                           # watch
npm run test:browser:run                       # one-shot
npm run test:browser:headless                  # CI-style headless
# (equivalent: npx nx run main-app:test:browser)

# Run targets across everything
npx nx run-many -t lint test build
npx nx affected -t test                        # only what changed
```

## Two Vitest configs — and why

`apps/main-app` runs Vitest in **two distinct modes** with separate configs. Pick the right one:

- **`vite.config.mts`** — the default `nx test` target. Environment: `jsdom`. Includes `src/**/*.spec.ts`, **excludes `tests/browser/**`**. Setup: `src/test-setup.ts` (which calls `setupTestBed()` from `@analogjs/vitest-angular/setup-testbed`). Use this for unit-style tests of services, pipes, and TestBed-driven component tests.
- **`vitest.config.browser.mts`** — invoked only via the `test:browser` target / npm scripts. Runs in a real Chromium via `@vitest/browser-playwright`. Notable quirks:
  - Compiles Angular with `jit: true`.
  - Filters out the `@analogjs/vitest-angular` plugins (the TestBed setup plugin must not run in browser mode).
  - Includes a custom `stripInlineSourceMaps` plugin — needed because Analog's Angular plugin emits inline base64 sourcemaps that confuse the browser runner; the plugin extracts them into a separate map.

If you add a new Vitest config, the workspace-level `vitest.workspace.ts` already globs `**/vite.config.*` and `**/vitest.config.*` so it'll be picked up automatically.

## Code conventions specific to this repo

- **Topic pages live in `apps/main-app/src/app/topics/<name>.component.ts`** and are wired into `app.routes.ts` via lazy `loadComponent`. When adding a topic, add the component file *and* the route — there's no auto-discovery.
- **Examples live alongside topics** in `src/app/examples/`. The `.spec.ts` files there are both real tests and the source the topic pages reference; keep them runnable, not just illustrative.
- **Shared building blocks** for topic pages: `src/app/shared/code-block.component.ts` and `run-hint.component.ts`. Reuse them rather than re-rolling code-display markup.
- **No libs.** Do not create `libs/` or invoke library generators unless the user asks — the eslint module-boundary rules currently reference scopes (`scope:shop`, `scope:api`) for projects that don't exist, so adding tagged libraries will trip lint until those constraints are revised.
- **App prefix is `app`** (see `project.json`), Angular component style is `css`.
- **Angular generator defaults** (from `nx.json`): `unitTestRunner: vitest-analog`, `e2eTestRunner: playwright`, `linter: eslint`, `style: css`. Don't override these without reason.

## Test authoring notes

- For TestBed-based tests in jsdom mode, `setupTestBed()` is already wired via `src/test-setup.ts` — do **not** call `TestBed.initTestEnvironment` yourself.
- Browser-mode specs use Vitest's browser API directly (`@vitest/browser/context` — `page`, locators, etc.), not TestBed. Keep them under `apps/main-app/tests/browser/` so the jsdom config's `exclude` keeps them out of `nx test`.
- `nx test main-app` is **cached** (see `targetDefaults`); if you change non-source inputs and tests look stale, append `--skip-nx-cache`.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
