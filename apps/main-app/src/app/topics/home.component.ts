import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { CodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatChipsModule, RouterModule, CodeBlockComponent],
  template: `
    <h2 class="topic-header">Angular + Vitest Showcase</h2>
    <p class="topic-subtitle">
      A hands-on tour of Vitest — Angular's official unit testing framework.
      Each topic includes live, runnable test files you can execute from the terminal.
    </p>

    <div class="hero-cards">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-icon matCardAvatar>speed</mat-icon>
          <mat-card-title>Blazing Fast</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Powered by Vite's native ESM pipeline. No bundling step — tests start in milliseconds.</p>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-icon matCardAvatar>extension</mat-icon>
          <mat-card-title>Rich API</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Built-in mocking, snapshot testing, fake timers, type testing, concurrent execution, and more.</p>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-icon matCardAvatar>web</mat-icon>
          <mat-card-title>Browser Mode</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Run tests in a real browser — real DOM, real CSS, real events. No more jsdom limitations.</p>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="topic-section">
      <h3>What is Vitest?</h3>
      <p>
        Vitest is a Vite-native test runner. It reuses the same transformation pipeline your app
        uses for <code>ng serve</code> and <code>ng build</code> — no separate test bundler, no
        Karma/Webpack config, no second source of truth. You write tests in TypeScript, Vite serves
        them on demand over native ESM, and the runner gives you Jest-compatible APIs
        (<code>describe</code> / <code>it</code> / <code>expect</code> / <code>vi.fn()</code>) plus
        modern extras: built-in mocking, snapshots, coverage, fake timers, type testing,
        concurrency, and a browser dashboard.
      </p>
      <p>
        Karma was deprecated in 2023. The Angular team picked Vitest as the official path forward;
        Angular 21 wires it up through <code>&#64;analogjs/vite-plugin-angular</code> and
        <code>&#64;analogjs/vitest-angular</code>, which bridge <code>TestBed</code>, zone.js, and
        snapshot serialization into Vitest.
      </p>
    </div>

    <div class="topic-section">
      <h3>Modes at a glance</h3>
      <p>
        Vitest is one runner with several execution modes. They're orthogonal axes, not competing
        products — you'll mix and match them depending on what you're testing.
      </p>

      <h4 class="modes-subhead">Environment — what <code>document</code> actually is</h4>
      <div class="modes-grid">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>memory</mat-icon>
            <mat-card-title>node</mat-card-title>
            <mat-card-subtitle>Pure Node.js, no DOM</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="mode-tagline">"I'm testing a function."</p>
            <p>
              Pure logic, services, RxJS streams, validators, parsers, util code. If your code
              ever writes <code>document.</code> or <code>window.</code>, the test crashes with
              <code>ReferenceError</code>.
            </p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>description</mat-icon>
            <mat-card-title>jsdom</mat-card-title>
            <mat-card-subtitle>Simulated DOM in Node</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="mode-tagline">
              "I'm testing code that thinks it's in a browser, but I don't care what the browser
              actually shows."
            </p>
            <p>
              Hands you a DOM tree you can read and mutate; query selectors,
              <code>.innerHTML</code>, <code>addEventListener</code> / <code>dispatchEvent</code>,
              and <code>TestBed</code> all work. <strong>But no real layout, no real CSS, no real
              events</strong> — <code>getBoundingClientRect()</code> returns zeros,
              <code>:hover</code> doesn't exist, animations don't run.
            </p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>web</mat-icon>
            <mat-card-title>Browser mode</mat-card-title>
            <mat-card-subtitle>Real Chromium / Firefox / WebKit</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="mode-tagline">"I'm testing what the user actually sees."</p>
            <p>
              Driven by Playwright or WebDriver. Use for visibility, hover/focus/click flows, CSS
              behavior — anything jsdom would lie about. Slower to boot, different test API
              (<code>page.getByRole</code>, locators, async <code>.click()</code>).
            </p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="note-box">
        <strong>This repo runs both</strong>
        <code>vite.config.mts</code> uses jsdom and is the default <code>nx test main-app</code>.
        <code>vitest.config.browser.mts</code> spins up real Chromium via
        <code>&#64;vitest/browser-playwright</code> and runs <code>tests/browser/**</code> via
        <code>npm run test:browser</code>. Same runner, same <code>expect</code>, real browser when
        reality matters.
      </div>

      <h4 class="modes-subhead">Other axes</h4>
      <ul class="modes-list">
        <li>
          <strong>Run vs. watch</strong> — <code>nx test main-app</code> exits with a status code
          (CI). Add <code>--watch</code> for the dev loop; Vite's module graph reruns only the specs
          touched by your edit.
        </li>
        <li>
          <strong>Headed vs. headless (browser mode)</strong> — headed pops a visible Chromium so
          you can pause and inspect; headless is the CI mode. Toggle with
          <code>--browser.headless</code> (or <code>npm run test:browser:headless</code>).
        </li>
        <li>
          <strong>Vitest UI</strong> — <code>--ui</code> opens a live dashboard at
          <code>http://localhost:51204/__vitest__/</code> with the test tree, console output,
          coverage tab, and (in browser mode) a rendered iframe of the page.
        </li>
        <li>
          <strong>Isolation pool</strong> — threads (default, fastest), forks (better isolation),
          or <code>--no-isolate</code> (same process, fastest but tests can pollute each other).
          Mention it only if a flake gets faster after switching.
        </li>
      </ul>
    </div>

    <div class="topic-section">
      <h3>What's in this demo?</h3>
      <p>Navigate through the sidebar to explore each topic. Every page includes:</p>
      <ul>
        <li><strong>Explanation</strong> — what the feature is and why it matters</li>
        <li><strong>Code examples</strong> — real test code you can read and learn from</li>
        <li><strong>Runnable spec files</strong> — execute them live during your presentation</li>
      </ul>
    </div>

    <div class="topic-section">
      <h3>Running the tests</h3>
      <app-code-block
        [code]="runCommand"
        title="Unit tests (jsdom)" />
      <app-code-block
        [code]="coverageCommand"
        title="Code coverage" />
      <app-code-block
        [code]="browserCommand"
        title="Browser mode tests (real Chromium)" />
    </div>

    <div class="topic-section">
      <h3>Tech Stack</h3>
      <div class="chip-row">
        <mat-chip-set>
          <mat-chip>Angular 21</mat-chip>
          <mat-chip>Vitest 4.x</mat-chip>
          <mat-chip>Vite 7</mat-chip>
          <mat-chip>TypeScript 5.9</mat-chip>
          <mat-chip>Angular Material 3</mat-chip>
          <mat-chip>Nx 22</mat-chip>
        </mat-chip-set>
      </div>
    </div>
  `,
  styles: `
    .hero-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    mat-card-header mat-icon {
      font-size: 28px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--mat-sys-primary);
    }

    ul {
      padding-left: 24px;
      line-height: 2;
      color: var(--mat-sys-on-surface-variant);
    }

    .chip-row {
      margin-top: 8px;
    }

    .modes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      margin: 12px 0 24px;
    }

    .mode-tagline {
      font-style: italic;
      font-size: 0.95rem;
      color: var(--mat-sys-on-tertiary-container);
      background-color: var(--mat-sys-tertiary-container);
      padding: 8px 12px;
      border-radius: 8px;
      border-left: 3px solid var(--mat-sys-tertiary);
      margin: 0 0 12px !important;
      line-height: 1.5;
    }

    .modes-subhead {
      margin: 24px 0 8px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mat-sys-primary);
    }

    .modes-list {
      padding-left: 24px;
      line-height: 1.8;
      color: var(--mat-sys-on-surface-variant);
    }

    .modes-list li {
      margin-bottom: 8px;
    }

    .modes-list strong {
      color: var(--mat-sys-on-surface);
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace;
      font-size: 0.875em;
      padding: 1px 6px;
      border-radius: 4px;
      background-color: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface);
    }
  `,
})
export class HomeComponent {
  protected runCommand = `# Run all unit tests
npx nx test main-app

# Run a specific test file
npx nx test main-app matchers

# Run in watch mode
npx nx test main-app --watch

# Run with Vitest UI dashboard
npx nx test main-app --watch --ui`;

  protected coverageCommand = `# Run with code coverage report
npx nx test main-app --coverage

# Run with coverage + Vitest UI (coverage tab appears in the dashboard)
npx nx test main-app --watch --ui --coverage`;

  protected browserCommand = `# Run browser tests (opens real Chromium window!)
npx nx run main-app:test:browser --watch

# Run a specific browser test file
npx nx run main-app:test:browser --watch locators

# Run headless (for CI)
CI=true npx nx run main-app:test:browser`;
}
