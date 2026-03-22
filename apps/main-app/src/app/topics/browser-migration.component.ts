import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-browser-migration',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="topic-header">Progressive Migration Path</h2>
    <p class="topic-subtitle">
      You don't need a big-bang rewrite. Migrate progressively — from Karma or Jest
      to Vitest emulated, then to partial browser mode, then to full browser mode.
      Each step is independent.
    </p>

    <div class="topic-section">
      <h3>The migration ladder</h3>
      <app-code-block [code]="ladder" />
    </div>

    <div class="topic-section">
      <h3>Step 1: Karma/Jest → Vitest (emulated)</h3>
      <p>
        Migrate your existing test files to Vitest using the emulated jsdom
        environment. This is the lowest-risk step — most tests just work.
      </p>
      <app-code-block [code]="step1" />
    </div>

    <div class="topic-section">
      <h3>Step 2: Enable partial browser mode</h3>
      <p>
        Flip a configuration flag. Your tests now run in a real Chromium browser
        instead of jsdom. Most pass without changes.
      </p>
      <app-code-block [code]="step2" />
    </div>

    <div class="topic-section">
      <h3>Step 3: Switch to full browser mode</h3>
      <p>
        Progressively update imports to use <code>vitest/browser</code> APIs.
        Start with new tests, then migrate existing ones as you touch them.
      </p>
      <app-code-block [code]="step3" />
    </div>

    <div class="topic-section">
      <h3>Running both modes side by side</h3>
      <p>
        You can configure Vitest to run some tests with jsdom and others with
        browser mode. Use separate config files or per-file environment overrides.
      </p>
      <app-code-block [code]="sideBySide" title="Separate configs" />
      <app-code-block [code]="perFile" title="Per-file override" />
    </div>

    <div class="topic-section">
      <h3>Karma migration (Angular CLI)</h3>
      <app-code-block [code]="karmaPath" />
    </div>

    <div class="topic-section">
      <h3>Jest migration</h3>
      <app-code-block [code]="jestPath" />
    </div>

    <div class="topic-section">
      <h3>What to watch for</h3>
      <app-code-block [code]="gotchas" />
    </div>

    <div class="note-box">
      <strong>Recommendation for Karma users</strong>
      Since your Karma tests already run in a browser, skip the emulated step
      and go directly to Vitest browser mode. Going through jsdom first may
      introduce new issues that don't exist in either Karma or browser mode.
    </div>
  `,
  styles: `
    code {
      padding: 2px 6px;
      border-radius: 4px;
      background-color: var(--mat-sys-surface-container);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.85em;
    }
  `,
})
export class BrowserMigrationComponent {
  protected ladder = `// Progressive migration — each step is independent
//
// ┌─────────────────────────────────────────────────┐
// │  Level 4: Full Browser Mode + Traces            │
// │  ─ page API, expect.element, Playwright traces  │
// │  ─ Maximum confidence & debugging               │
// ├─────────────────────────────────────────────────┤
// │  Level 3: Full Browser Mode                     │
// │  ─ userEvent from vitest/browser                │
// │  ─ Actionability checks, real coordinates       │
// ├─────────────────────────────────────────────────┤
// │  Level 2: Partial Browser Mode                  │
// │  ─ Config change only, tests unchanged          │
// │  ─ Real DOM, CSS, Web APIs                      │
// ├─────────────────────────────────────────────────┤
// │  Level 1: Vitest + jsdom (emulated)             │
// │  ─ Drop-in replacement for Jest/Karma           │
// │  ─ Fast, familiar, same test patterns           │
// ├─────────────────────────────────────────────────┤
// │  Level 0: Karma / Jest                          │
// │  ─ Where you are today                          │
// └─────────────────────────────────────────────────┘`;

  protected step1 = `# For Karma → Vitest (Angular CLI schematic)
ng generate @angular/core:migrate-unit-tests

# For Jest → Vitest (community codemod)
npx codemod vitest/migrate-from-jest

# What changes:
# - test runner: karma/jest → vitest
# - environment: browser/jsdom → jsdom (no change for jest)
# - syntax: mostly compatible (describe, it, expect)
# - mocking: jest.fn() → vi.fn()  |  jest.mock → vi.mock
# - timers: fakeAsync/tick → vi.useFakeTimers/vi.advanceTimersByTime`;

  protected step2 = `// Just add browser config — no test changes needed

// vitest.config.browser.mts
import { defineConfig } from 'vitest/config';
import playwright from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    include: ['src/**/*.spec.ts'],
  },
});

// Or with Angular CLI — angular.json:
// "test": {
//   "options": {
//     "browsers": ["chromium"]
//   }
// }
// Then: ng add @vitest/browser-playwright`;

  protected step3 = `// For each test file, progressively switch imports:

// BEFORE (partial mode)
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';

// AFTER (full mode — same API, different behavior)
import { page, userEvent } from 'vitest/browser';

// For NEW tests, use the page API directly:
const btn = page.getByRole('button', { name: 'Save' });
await userEvent.click(btn);
await expect.element(btn).toHaveTextContent('Saved');`;

  protected sideBySide = `// vite.config.mts — unit tests (jsdom)
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    exclude: ['tests/browser/**'],
  },
});

// vitest.config.browser.mts — browser tests
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    include: ['tests/browser/**/*.spec.ts'],
  },
});

// Both run independently:
// npx vitest --config vite.config.mts
// npx vitest --config vitest.config.browser.mts`;

  protected perFile = `// You can also override per-file with a comment:

// @vitest-environment jsdom
// (at the top of a spec file)

// This test file will use jsdom even if
// the config sets browser mode globally.`;

  protected karmaPath = `// Karma → Vitest: recommended path
//
// Since Karma tests already run in a real browser,
// go directly to Vitest browser mode:
//
// 1. Run the Angular CLI migration schematic
//    ng generate @angular/core:migrate-unit-tests
//
// 2. Enable browser mode in the generated config
//    (add browser provider + instances)
//
// 3. Install Playwright:
//    ng add @vitest/browser-playwright
//
// 4. Run tests: ng test
//
// Skipping jsdom avoids introducing new issues
// that don't exist in either Karma or browser mode.`;

  protected jestPath = `// Jest → Vitest: recommended path
//
// 1. Use codemod to convert syntax
//    npx codemod vitest/migrate-from-jest
//    (handles jest.fn→vi.fn, jest.mock→vi.mock, etc.)
//
// 2. Start with jsdom (drop-in replacement)
//    Most tests pass without changes
//
// 3. Watch for Node.js API usage in tests
//    Jest runs in Node; browser mode doesn't have
//    fs, path, child_process, etc.
//
// 4. Enable browser mode for test subsets
//    Move browser-dependent tests to a separate folder
//
// 5. Progressively switch to full browser mode
//    as you write new tests or fix existing ones`;

  protected gotchas = `// Things to watch for during migration:

// 1. POLYFILLS
//    Jest needed polyfills for browser APIs
//    (fetch, TextEncoder, structuredClone).
//    In browser mode, remove them — they're native.

// 2. NODE.JS APIs
//    Tests using fs, path, child_process won't work
//    in browser mode. Keep those in jsdom or refactor.

// 3. GLOBAL SETUP
//    jest.setup.ts → vitest setup files
//    beforeAll in setupFilesAfterFramework

// 4. MODULE MOCKING
//    jest.mock('./module') → vi.mock('./module')
//    Hoisting behavior is similar but not identical.

// 5. FAKE TIMERS
//    fakeAsync/tick → vi.useFakeTimers()
//    flush → vi.runAllTimers()
//    tick(100) → vi.advanceTimersByTime(100)`;
}
