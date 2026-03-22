import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-browser-debugging',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="topic-header">Debugging & Playwright Traces</h2>
    <p class="topic-subtitle">
      Browser mode gives you DevTools for live debugging. Full browser mode adds
      Playwright traces — a time-travel recording of every action, network request,
      and DOM state during a test.
    </p>

    <div class="topic-section">
      <h3>Live debugging with DevTools</h3>
      <p>
        When running in headed mode (the default locally), the browser window is
        available for inspection — open DevTools, set breakpoints in your source
        code, and step through your component logic while the test is running.
      </p>
      <app-code-block [code]="devToolsDebug" title="Debugging workflow" />
    </div>

    <div class="topic-section">
      <h3>Playwright traces</h3>
      <p>
        Traces capture a timeline of everything that happens during a test:
        actions, screenshots, DOM snapshots, network, and console logs.
        They're invaluable for debugging flaky CI failures.
      </p>
      <app-code-block [code]="traceConfig" title="Enable traces in vitest config" />
    </div>

    <div class="topic-section">
      <h3>Trace options</h3>
      <app-code-block [code]="traceOptions" />
    </div>

    <div class="topic-section">
      <h3>Viewing traces</h3>
      <p>
        After a test run, traces are saved as <code>.zip</code> files. Open them
        with Playwright's trace viewer for a full visual timeline.
      </p>
      <app-code-block [code]="viewTrace" />
    </div>

    <div class="topic-section">
      <h3>What's in a trace?</h3>
      <app-code-block [code]="traceContents" />
    </div>

    <div class="topic-section">
      <h3>HTML reporter for CI</h3>
      <p>
        Combine traces with the HTML reporter to produce a downloadable report
        artifact in CI. Failed tests include trace links as annotations.
      </p>
      <app-code-block [code]="htmlReporter" title="CI configuration" />
    </div>

    <div class="topic-section">
      <h3>Screenshots on failure</h3>
      <p>
        Vitest automatically captures a screenshot when a test fails in browser
        mode, making quick visual diagnosis possible without opening the full trace.
      </p>
      <app-code-block [code]="screenshots" />
    </div>

    <div class="topic-section">
      <h3>Headless mode</h3>
      <p>
        Traces and parallel test execution require headless mode. Locally, Vitest
        defaults to headed (you see the browser). In CI, headless is the default.
      </p>
      <app-code-block [code]="headlessConfig" />
    </div>

    <div class="note-box">
      <strong>CI debugging workflow</strong>
      When a test fails on CI: download the HTML report → click the failed test →
      download its Playwright trace → open in the trace viewer →
      see exactly what happened, frame by frame, with DOM snapshots and network logs.
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
export class BrowserDebuggingComponent {
  protected devToolsDebug = `// 1. Run tests in headed (non-headless) mode
npm run test:browser

// 2. The browser window opens with your component rendered.
//    Open DevTools (F12 / Cmd+Option+I).

// 3. Go to Sources tab → find your component source
//    (Vite serves original TypeScript via source maps).

// 4. Set a breakpoint on any line.

// 5. Re-run the test — execution pauses at your breakpoint.
//    Inspect variables, step through, check the DOM.

// 6. Use the Elements panel to inspect rendered component
//    HTML, styles, layout, and accessibility tree.`;

  protected traceConfig = `// vitest.config.browser.mts
import { defineConfig } from 'vitest/config';
import playwright from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true,   // required for proper traces
    },
    // Record trace only on first retry of a failed test
    trace: 'on-first-retry',
    retry: 1,
  },
});`;

  protected traceOptions = `// trace option values:
//
// 'off'              — no traces (default)
// 'on'               — trace every test (expensive)
// 'on-first-retry'   — trace only when retrying a failure
//                       (recommended for CI)
// 'retain-on-failure' — record all, keep only failures

// retry: how many times to retry a failed test
// retry: 1 means each test gets one retry (2 total attempts)`;

  protected viewTrace = `# Traces are saved to the project's test results
# Look for .zip files in the traces directory

# Open a trace in Playwright's viewer:
npx playwright show-trace ./traces/test-file/trace.zip

# The viewer opens in the browser showing:
# - Timeline of actions
# - DOM snapshots at each step
# - Network requests
# - Console output
# - Screenshots`;

  protected traceContents = `// A Playwright trace includes:

// 1. ACTIONS TIMELINE
//    Every click, fill, hover — with timestamps
//    and the exact element targeted

// 2. DOM SNAPSHOTS
//    Full DOM tree at each action, viewable
//    in the trace viewer's inspector

// 3. SCREENSHOTS
//    Visual state before and after each action

// 4. NETWORK LOG
//    All HTTP requests/responses during the test

// 5. CONSOLE LOG
//    console.log, warnings, and errors

// 6. SOURCE CODE
//    Links back to the test source at each step`;

  protected htmlReporter = `// vitest.config.browser.mts (CI setup)
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true,
    },
    trace: 'on-first-retry',
    retry: 1,
    reporters: ['default', 'html'],
    outputFile: { html: './test-reports/index.html' },
  },
});

// After tests run:
// npx vitest preview
// Opens the HTML report with trace download links`;

  protected screenshots = `// Vitest captures screenshots automatically when
// a test fails in browser mode.

// Screenshots appear in the HTML report and are
// also saved to disk alongside trace files.

// For manual screenshots during a test:
import { page } from 'vitest/browser';

it('captures state', async () => {
  // ... test actions ...
  await page.screenshot({ path: 'debug-state.png' });
});`;

  protected headlessConfig = `// In vitest.config.browser.mts
browser: {
  headless: true,   // no visible window
}

// Or via CLI:
npx vitest --browser.headless

// Headless mode enables:
// ✓ Proper trace recording
// ✓ Parallel test execution across pages
// ✓ Consistent CI behavior
// ✓ Faster execution (no rendering overhead)

// Headed mode (default locally) enables:
// ✓ Visual debugging with DevTools
// ✓ Watching component render in real time
// ✗ No parallelization
// ✗ Traces may be incomplete`;
}
