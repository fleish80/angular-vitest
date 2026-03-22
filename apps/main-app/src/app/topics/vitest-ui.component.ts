import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-vitest-ui',
  imports: [MatCardModule, MatIconModule, CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Vitest UI & Developer Experience</h2>
    <p class="topic-subtitle">
      Vitest ships with powerful tools out of the box: an interactive UI dashboard,
      smart watch mode, built-in coverage, and deep IDE integration.
    </p>

    <div class="topic-section">
      <h3>Vitest UI</h3>
      <p>
        A browser-based dashboard for exploring and running tests interactively.
        See the test tree, filter by status, view source code, and re-run individual tests.
      </p>
      <app-code-block [code]="uiCommand" />

      <div class="feature-grid">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>account_tree</mat-icon>
            <mat-card-title>Test explorer</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Browse tests in a tree view. Click to run individual tests or suites.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>code</mat-icon>
            <mat-card-title>Source view</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View test source code directly in the UI with inline pass/fail indicators.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>filter_alt</mat-icon>
            <mat-card-title>Filtering</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Filter by passed, failed, skipped, or todo. Search by test name.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <div class="topic-section">
      <h3>Watch mode</h3>
      <p>
        Vitest's watch mode uses Vite's module graph to determine which tests are affected
        by a file change — only those tests re-run. No more "run all 500 tests on every save."
      </p>
      <app-code-block [code]="watchMode" />
    </div>

    <div class="topic-section">
      <h3>Coverage</h3>
      <p>
        Built-in code coverage with the V8 provider — no extra configuration.
        Generates HTML, text, lcov, and JSON reports.
      </p>
      <app-code-block [code]="coverage" />
    </div>

    <div class="topic-section">
      <h3>Reporter formats</h3>
      <p>Choose from built-in reporters or combine multiple.</p>
      <app-code-block [code]="reporters" />
    </div>

    <div class="topic-section">
      <h3>IDE integration</h3>
      <p>
        Vitest integrates with VS Code / Cursor through the official extension.
        Run, debug, and view test results directly in your editor.
      </p>
      <app-code-block [code]="ide" />
    </div>

    <div class="topic-section">
      <h3>Performance: Karma vs Vitest</h3>
      <div class="comparison-grid">
        <div>
          <h4>Karma</h4>
          <app-code-block [code]="karmaPerf" />
        </div>
        <div>
          <h4>Vitest</h4>
          <app-code-block [code]="vitestPerf" />
        </div>
      </div>
    </div>

    <div class="note-box">
      <strong>Two modes in this project</strong>
      This workspace has two Vitest configs — jsdom (fast, default) and browser mode
      (real Chromium). The UI dashboard works with jsdom tests. For browser tests,
      use npm run test:browser which opens a real browser window.
    </div>

    <app-run-hint command="npm run test:ui" label="Try it" />
  `,
  styles: `
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    mat-card-header mat-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--mat-sys-primary);
    }
  `,
})
export class VitestUiComponent {
  protected uiCommand = `# Launch the Vitest UI dashboard
npm run test:ui
# or: npx nx test main-app --ui

# Opens at http://localhost:51204/__vitest__/
# Uses the jsdom config (vite.config.mts)
# Features:
#   - Test tree explorer
#   - Source code viewer
#   - Pass/fail/skip filtering
#   - Re-run individual tests
#   - Module dependency graph`;

  protected watchMode = `# Watch mode (default in dev)
npx vitest --watch

# Keyboard shortcuts in watch mode:
#   a  — run all tests
#   f  — run only failed tests
#   u  — update snapshots
#   p  — filter by filename
#   t  — filter by test name
#   q  — quit`;

  protected coverage = `# Generate coverage report
npx vitest run --coverage

# Coverage config in vite.config.mts
test: {
  coverage: {
    provider: 'v8',          // or 'istanbul'
    reporter: ['text', 'html', 'lcov'],
    include: ['src/**/*.ts'],
    exclude: ['**/*.spec.ts', '**/*.mock.ts'],
    thresholds: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
}`;

  protected reporters = `# Built-in reporters
npx vitest --reporter=default     # Clean terminal output
npx vitest --reporter=verbose     # Show every test name
npx vitest --reporter=dot         # Minimal dots
npx vitest --reporter=json        # Machine-readable
npx vitest --reporter=junit       # CI/CD compatible
npx vitest --reporter=html        # HTML report

# Combine multiple reporters
npx vitest --reporter=default --reporter=json`;

  protected ide = `// VS Code / Cursor extension:
// "Vitest" by vitest.explorer

// Features:
// ✓ Inline test status (pass/fail icons)
// ✓ Run/debug individual tests
// ✓ Watch mode integration
// ✓ Coverage gutter highlighting
// ✓ Test output in terminal panel
// ✓ Go-to-test and go-to-source`;

  protected karmaPerf = `Cold start:     ~8-15 seconds
  (webpack bundle + browser launch)

Re-run (watch): ~3-8 seconds
  (re-bundle changed modules)

Parallel:       Limited
  (single browser instance)

Memory:         High
  (Chrome process + webpack)`;

  protected vitestPerf = `Cold start:     ~1-3 seconds
  (Vite on-demand, no bundle)

Re-run (watch): ~100-500ms
  (only affected tests)

Parallel:       Full
  (worker threads per core)

Memory:         Low
  (Node.js + jsdom)`;
}
