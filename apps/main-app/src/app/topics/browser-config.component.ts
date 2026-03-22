import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-config',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Browser Mode: Configuration</h2>
    <p class="topic-subtitle">
      This project has two Vitest configurations side by side — one for fast jsdom testing
      and one for real browser testing. Here's how they differ and when to use each.
    </p>

    <div class="topic-section">
      <h3>Two configs, two modes</h3>
      <p>
        Each config is a separate file with its own Nx target and npm script.
        They can run independently — you don't have to choose one or the other.
      </p>
      <div class="comparison-grid">
        <div>
          <h4>jsdom (default)</h4>
          <app-code-block [code]="jsdomConfig" filename="vite.config.mts" />
        </div>
        <div>
          <h4>Browser mode</h4>
          <app-code-block [code]="browserConfig" filename="vitest.config.browser.mts" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>What's different?</h3>
      <app-code-block [code]="diffExplained" title="Key differences" />
    </div>

    <div class="topic-section">
      <h3>Nx targets (project.json)</h3>
      <p>
        Each config gets its own Nx target so you can run them through Nx CLI.
      </p>
      <app-code-block [code]="nxTargets" filename="project.json" />
    </div>

    <div class="topic-section">
      <h3>npm scripts</h3>
      <app-code-block [code]="npmScripts" filename="package.json" />
    </div>

    <div class="topic-section">
      <h3>Running each mode</h3>
      <div class="comparison-grid">
        <div>
          <h4>jsdom tests</h4>
          <app-code-block [code]="runJsdom" />
        </div>
        <div>
          <h4>Browser tests</h4>
          <app-code-block [code]="runBrowser" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>Install dependencies</h3>
      <p>jsdom mode works out of the box. Browser mode needs two extra packages:</p>
      <app-code-block [code]="installCmd" />
    </div>

    <div class="note-box">
      <strong>Which tests go where?</strong>
      Put most tests under src/ — they run fast with jsdom. Only move tests to
      tests/browser/ when they genuinely need real CSS, layout, Web APIs, or
      real event behavior. This keeps your CI fast while ensuring browser fidelity
      where it matters.
    </div>

    <app-run-hint command="npm run test:ui" label="jsdom UI" />
    <app-run-hint command="npm run test:browser" label="real Chromium" />
  `,
})
export class BrowserConfigComponent {
  protected jsdomConfig = `// Standard Vitest config — jsdom environment
// Tests run in Node.js with simulated DOM
export default defineConfig({
  plugins: [angular()],
  test: {
    name: 'main-app',
    globals: true,
    environment: 'jsdom',        // ← simulated DOM
    include: ['src/**/*.spec.ts'],
    exclude: ['tests/browser/**'],
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
    },
  },
});`;

  protected browserConfig = `// Browser mode config — real Chromium
// Tests run inside an actual browser
import { playwright } from
  '@vitest/browser-playwright';

export default defineConfig({
  test: {
    name: 'browser-tests',
    include: ['tests/browser/**/*.spec.ts'],
    browser: {                   // ← new section
      enabled: true,
      provider: playwright(),    // ← Playwright
      instances: [
        { browser: 'chromium' },
      ],
      headless: false,           // ← visible!
    },
  },
});`;

  protected diffExplained = `                     jsdom              Browser Mode
─────────────────────────────────────────────────────
environment:         'jsdom'            browser.enabled: true
runs in:             Node.js            Real Chromium
DOM:                 Simulated          Real
CSS engine:          None               Full
Layout/sizing:       All zeros          Real measurements
Events:              Synthetic          Real browser events
Web APIs:            Partial            Complete
Speed:               Very fast (~1s)    Slower (~2-3s)
Config file:         vite.config.mts    vitest.config.browser.mts
Tests location:      src/**/*.spec.ts   tests/browser/**/*.spec.ts
Nx target:           test               test:browser`;

  protected nxTargets = `// test — auto-detected by @nx/vitest plugin
// uses vite.config.mts (jsdom)

// test:browser — explicit target
"test:browser": {
  "executor": "@nx/vitest:test",
  "options": {
    "config": "apps/main-app/vitest.config.browser.mts"
  }
}`;

  protected npmScripts = `{
  "scripts": {
    // jsdom mode
    "test:ui":              "nx test main-app --ui",

    // Browser mode
    "test:browser":         "nx run main-app:test:browser --watch",
    "test:browser:run":     "nx run main-app:test:browser",
    "test:browser:headless":"nx run main-app:test:browser --browser.headless"
  }
}`;

  protected runJsdom = `# Run once
npx nx test main-app

# Watch mode
npx nx test main-app --watch

# Vitest UI dashboard
npm run test:ui`;

  protected runBrowser = `# Watch mode (browser stays open)
npm run test:browser

# Run once and exit
npm run test:browser:run

# Headless (CI)
npm run test:browser:headless`;

  protected installCmd = `# Browser mode requires:
npm install -D @vitest/browser
npm install -D @vitest/browser-playwright
npx playwright install chromium

# jsdom mode — already included,
# no extra install needed`;
}
