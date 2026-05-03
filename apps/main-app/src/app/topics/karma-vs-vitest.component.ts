import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-karma-vs-vitest',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="topic-header">Karma vs Vitest</h2>
    <p class="topic-subtitle">
      A side-by-side comparison of the old and new Angular testing stacks.
      Same concepts, cleaner API, faster execution.
    </p>

    <div class="topic-section">
      <h3>Architecture</h3>
      <div class="comparison-grid">
        <div>
          <h4>Karma + Jasmine</h4>
          <app-code-block [code]="karmaArch" title="How Karma works" />
        </div>
        <div>
          <h4>Vitest</h4>
          <app-code-block [code]="vitestArch" title="How Vitest works" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>Configuration</h3>
      <div class="comparison-grid">
        <div>
          <h4>Karma</h4>
          <app-code-block [code]="karmaConfig" filename="karma.conf.js" />
        </div>
        <div>
          <h4>Vitest</h4>
          <app-code-block [code]="vitestConfig" filename="vite.config.mts" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>Test syntax</h3>
      <p>The basic syntax is nearly identical — Vitest is Jasmine-compatible by design.</p>
      <div class="comparison-grid">
        <div>
          <h4>Jasmine</h4>
          <app-code-block [code]="jasmineSyntax" filename="app.spec.ts" />
        </div>
        <div>
          <h4>Vitest</h4>
          <app-code-block [code]="vitestSyntax" filename="app.spec.ts" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>Mocking</h3>
      <p>This is where the APIs diverge the most.</p>
      <div class="comparison-grid">
        <div>
          <h4>Jasmine</h4>
          <app-code-block [code]="jasmineMock" />
        </div>
        <div>
          <h4>Vitest</h4>
          <app-code-block [code]="vitestMock" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>Async testing</h3>
      <div class="comparison-grid">
        <div>
          <h4>Jasmine</h4>
          <app-code-block [code]="jasmineAsync" />
        </div>
        <div>
          <h4>Vitest</h4>
          <app-code-block [code]="vitestAsync" />
        </div>
      </div>
    </div>

    <div class="note-box">
      <strong>Migration tip</strong>
      Most Jasmine tests work in Vitest with minimal changes. The main migration steps are:
      replacing jasmine.createSpy → vi.fn(), spyOn → vi.spyOn(),
      jasmine.clock() → vi.useFakeTimers(), and removing karma.conf.js entirely.
    </div>
  `,
})
export class KarmaVsVitestComponent {
  protected karmaArch = `1. Webpack bundles ALL test files into one big JS file
   (every spec + every import, even ones a single test
   touches — resolved and concatenated up front)

2. Launches a real browser (headless Chrome) and serves
   the bundle over HTTP

3. Browser downloads the bundle, executes the tests, and
   reports results back to the Karma server via WebSocket

4. On file change → re-bundle everything → reload browser

→ Slow cold start (seconds to minutes on large repos),
  full re-bundle on every change, one browser process
  runs all tests serially.`;

  protected vitestArch = `1. Vite serves source files on-demand as native ES modules
   (ESM = ECMAScript Modules — the standard 'import'/'export'
   syntax built into Node.js and modern browsers). No upfront
   bundling: when a test imports a file, Vite transforms just
   that file (TS → JS, Angular templates → render code) and
   hands it back. Files you don't import are never touched.

2. Tests run in Node.js, with jsdom faking just enough of the
   browser DOM (document, window, elements) for component tests
   — no real Chrome process, no HTTP server, no WebSocket bridge.

3. Vitest spawns worker threads and runs test files in parallel,
   each in its own isolated module graph.

4. On file change → Vite invalidates only the changed module +
   its importers → re-runs only the affected tests.

→ Cold start in ~1s, sub-second re-runs on save, parallel
  execution across CPU cores by default.`;

  protected karmaConfig = `// karma.conf.js — 40+ lines of boilerplate
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    browsers: ['Chrome'],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
  });
};`;

  protected vitestConfig = `// vite.config.mts — clean and minimal
export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
    },
  },
});`;

  protected jasmineSyntax = `describe('Calculator', () => {
  it('should add numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  // Jasmine-specific:
  // - beforeEach, afterEach ✓
  // - describe, it, expect ✓
  // - toBe, toEqual, toContain ✓
});`;

  protected vitestSyntax = `describe('Calculator', () => {
  it('should add numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  // Vitest — same basics, plus:
  // - it.each for parameterized tests
  // - it.concurrent for parallel execution
  // - it.todo for planned tests
  // - expect.soft for non-failing assertions
});`;

  protected jasmineMock = `// Jasmine spies
const spy = jasmine.createSpy('myFn');
spy.and.returnValue(42);

spyOn(service, 'getData')
  .and.returnValue(of(mockData));

// Clock control
jasmine.clock().install();
jasmine.clock().tick(1000);
jasmine.clock().uninstall();`;

  protected vitestMock = `// Vitest mocking
const spy = vi.fn(() => 42);

vi.spyOn(service, 'getData')
  .mockReturnValue(of(mockData));

// Timer control
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();`;

  protected jasmineAsync = `// Jasmine async patterns
it('should load data', (done) => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
    done();
  });
});

// Or with async/await
it('should load data', async () => {
  const data = await service.getData();
  expect(data).toBeDefined();
});`;

  protected vitestAsync = `// Vitest — same async/await works
it('should load data', async () => {
  const data = await service.getData();
  expect(data).toBeDefined();
});

// Plus: expect.poll for polling
await expect.poll(
  () => element.textContent
).toBe('loaded');`;
}
