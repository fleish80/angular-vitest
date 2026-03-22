import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-running-tests',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Running Tests</h2>
    <p class="topic-subtitle">
      How <code>npx nx test</code> reaches Vitest, how file filtering works,
      and useful CLI flags.
    </p>

    <div class="topic-section">
      <h3>The command chain</h3>
      <p>
        When you run <code>npx nx test main-app</code>, three things happen
        in sequence:
      </p>
      <ol>
        <li>
          <strong>Nx resolves the target</strong> — The <code>&#64;nx/vitest</code> plugin
          in <code>nx.json</code> auto-infers a <code>test</code> target for every
          project that has a <code>vite.config.*</code> file.
        </li>
        <li>
          <strong>Vitest launches</strong> — Nx invokes <code>vitest</code> with the
          config found in the project root (<code>vite.config.mts</code>).
        </li>
        <li>
          <strong>Test files are collected</strong> — Vitest scans the
          <code>test.include</code> glob and runs every matching spec file.
        </li>
      </ol>
      <app-code-block [code]="nxPlugin" title="nx.json — plugin registration" />
      <app-code-block [code]="includeGlob" title="vite.config.mts — file discovery" />
    </div>

    <div class="topic-section">
      <h3>Filtering by file name</h3>
      <p>
        Pass a string after the project name and Vitest treats it as a
        <strong>substring filter</strong> against collected file paths. Only
        files whose path contains the string will run.
      </p>
      <app-code-block [code]="filterExamples" />
      <div class="note-box">
        <strong>It's a substring, not a glob</strong>
        The filter <code>basic</code> matches any file with "basic" anywhere in
        its path — e.g. <code>src/app/examples/basic.spec.ts</code>. If you
        passed <code>spec</code>, every test file would match.
      </div>
    </div>

    <div class="topic-section">
      <h3>npm scripts</h3>
      <p>
        The workspace defines convenience scripts in <code>package.json</code>.
        With <code>npm run</code>, the <code>--</code> separator is
        <em>always</em> required to forward anything — npm itself consumes
        all arguments unless you add <code>--</code>.
      </p>
      <app-code-block [code]="npmScripts" title="package.json scripts" />
      <app-code-block [code]="npmUsage" title="using npm scripts" />
    </div>

    <div class="topic-section">
      <h3>Explicit vs inferred targets</h3>
      <p>
        Most targets are <strong>inferred</strong> by the <code>&#64;nx/vitest</code>
        plugin — you won't see them in <code>project.json</code>. But you can
        also define targets <strong>explicitly</strong> when you need custom config,
        like the browser mode target that points to a separate Vitest config file.
      </p>
      <app-code-block [code]="explicitTarget" title="project.json — explicit target" />
    </div>

    <div class="topic-section">
      <h3>Useful Vitest flags</h3>
      <app-code-block [code]="usefulFlags" />
      <div class="note-box">
        <strong>The <code>--</code> separator</strong>
        Vitest flags like <code>--watch</code> can look like Nx options.
        If a flag isn't forwarded, add <code>--</code> before it:
        <code>npx nx test main-app -- --watch</code>.
      </div>
    </div>

    <app-run-hint command="npx nx test main-app basic" />
  `,
  styles: `
    code {
      padding: 2px 6px;
      border-radius: 4px;
      background-color: var(--mat-sys-surface-container);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.85em;
    }

    ol {
      padding-left: 24px;
      line-height: 2;
      color: var(--mat-sys-on-surface-variant);
    }

    li {
      margin-bottom: 4px;
    }
  `,
})
export class RunningTestsComponent {
  protected nxPlugin = `{
  "plugin": "@nx/vitest",
  "options": {
    "testTargetName": "test"
  }
}`;

  protected includeGlob = `test: {
  include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  exclude: ['tests/browser/**'],
}`;

  protected filterExamples = `# Run ALL test files
npx nx test main-app

# Filter — only files whose path contains "basic"
npx nx test main-app basic
# ✓ matches: src/app/examples/basic.spec.ts

# Filter — only files whose path contains "matchers"
npx nx test main-app matchers
# ✓ matches: src/app/examples/matchers.spec.ts

# Multiple filters — files matching ANY of the patterns
npx nx test main-app basic matchers`;

  protected npmScripts = `"scripts": {
  "test:browser":          "nx run main-app:test:browser --watch",
  "test:browser:run":      "nx run main-app:test:browser",
  "test:browser:headless": "nx run main-app:test:browser --browser.headless",
  "test:ui":               "nx test main-app --ui"
}`;

  protected npmUsage = `# npm always needs -- to forward extra args
npm run test:browser -- --testFiles=polling

# What actually runs:
#   nx run main-app:test:browser --watch --testFiles=polling
#
# The --testFiles option filters which spec files to run`;

  protected explicitTarget = `{
  "test:browser": {
    "executor": "nx:run-commands",
    "cache": false,
    "options": {
      "command": "npx vitest --config vitest.config.browser.mts",
      "cwd": "apps/main-app"
    }
  }
}
// Inferred targets (like test) don't appear here —
// the @nx/vitest plugin creates them automatically
// from the vite.config.mts file.`;

  protected usefulFlags = `# Watch mode — re-runs on file changes
npx nx test main-app --watch

# Verbose reporter — show each test name
npx nx test main-app --reporter=verbose

# Stop after first failure
npx nx test main-app --bail

# Run with UI dashboard
npx nx test main-app --ui

# Update snapshots
npx nx test main-app --update`;
}
