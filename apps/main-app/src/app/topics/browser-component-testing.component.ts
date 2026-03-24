import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-component-testing',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Browser Mode: Angular Components</h2>
    <p class="topic-subtitle">
      All previous browser mode tests used raw HTML. Here we test a real Angular
      component rendered via <code>TestBed</code> inside Chromium — first with
      partial mode (direct DOM), then with full mode (Playwright automation).
    </p>

    <div class="topic-section">
      <h3>The component under test</h3>
      <p>
        A simple <code>CounterComponent</code> with signal-based state,
        signal inputs, and output events. It renders buttons for increment,
        decrement, and reset.
      </p>
      <app-code-block [code]="counterComponent" filename="counter.component.ts" />
    </div>

    <div class="topic-section">
      <h3>Configuration</h3>
      <p>
        To use <code>TestBed</code> in browser mode, the Vitest config needs
        the Angular compiler plugin and the test setup file. The vitest-specific
        sub-plugins that disable esbuild must be filtered out — browser mode
        requires esbuild for TypeScript transpilation.
      </p>
      <app-code-block [code]="browserConfig" filename="vitest.config.browser.mts" />
      <p>
        The <code>tsconfig.spec.json</code> must also include browser test files
        so the Angular compiler can process them.
      </p>
      <app-code-block [code]="tsconfigInclude" filename="tsconfig.spec.json (partial)" />
    </div>

    <div class="topic-section">
      <h3>Partial mode — TestBed + direct DOM</h3>
      <p>
        In partial mode, the browser is just a container. You create the component
        via <code>TestBed</code>, append it to the DOM, and interact using
        plain JavaScript — <code>querySelector()</code>, <code>.click()</code>,
        and standard Vitest <code>expect()</code>.
      </p>
      <app-code-block [code]="partialTest" title="Partial mode test" />
    </div>

    <div class="topic-section">
      <h3>Full mode — TestBed + page API + userEvent</h3>
      <p>
        Full mode uses the same TestBed setup but routes all interactions
        through Playwright's automation API via <code>page</code> locators and
        <code>userEvent</code> from <code>vitest/browser</code>. You get
        actionability checks, real click coordinates, and
        <code>expect.element()</code> with auto-retry.
      </p>
      <app-code-block [code]="fullTest" title="Full mode test" />
    </div>

    <div class="topic-section">
      <h3>Side-by-side comparison</h3>
      <div class="comparison-grid">
        <div>
          <h4>Partial mode</h4>
          <app-code-block [code]="partialSummary" />
        </div>
        <div>
          <h4>Full mode</h4>
          <app-code-block [code]="fullSummary" />
        </div>
      </div>
    </div>

    <div class="note-box">
      <strong>Key takeaway</strong>
      Both modes use the same TestBed and the same component — the only
      difference is how you query and interact. Partial mode is faster to
      write and familiar. Full mode catches CSS bugs, overlay issues, and
      visibility problems that partial mode misses.
    </div>

    <app-run-hint command="npm run test:browser component" />
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
export class BrowserComponentTestingComponent {
  protected counterComponent = `@Component({
  selector: 'app-counter',
  template: \`
    <h3>{{ title() }}</h3>
    <p class="count">Count: {{ count() }}</p>
    <button class="increment" (click)="increment()">+</button>
    <button class="decrement" (click)="decrement()">-</button>
    <button class="reset" (click)="reset()">Reset</button>
  \`,
})
export class CounterComponent {
  title = input<string>('Counter');
  countChange = output<number>();
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
    this.countChange.emit(this.count());
  }

  decrement() {
    this.count.update(c => c - 1);
    this.countChange.emit(this.count());
  }

  reset() {
    this.count.set(0);
    this.countChange.emit(0);
  }
}`;

  protected browserConfig = `import angular from '@analogjs/vite-plugin-angular';
import type { Plugin } from 'vite';

// The Angular plugin includes vitest sub-plugins that
// disable esbuild — browser mode needs esbuild, so
// we filter them out.
const angularPlugins = angular({ jit: true }) as Plugin[];
const browserSafePlugins = angularPlugins.filter(
  (p) => !p.name?.startsWith('@analogjs/vitest-angular')
);

export default defineConfig({
  plugins: [...browserSafePlugins, nxViteTsPaths()],
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});`;

  protected tsconfigInclude = `{
  "include": [
    "src/**/*.spec.ts",
    "tests/**/*.spec.ts"   // ← add browser tests
  ]
}`;

  protected partialTest = `import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent — Partial Browser Mode', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.innerHTML = '';
  });

  it('should render and interact via TestBed + direct DOM', async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CounterComponent);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.count')?.textContent)
      .toContain('Count: 0');

    const incrementBtn =
      el.querySelector('.increment') as HTMLButtonElement;
    incrementBtn.click();
    await fixture.whenStable();

    expect(el.querySelector('.count')?.textContent)
      .toContain('Count: 1');

    incrementBtn.click();
    incrementBtn.click();
    await fixture.whenStable();

    expect(el.querySelector('.count')?.textContent)
      .toContain('Count: 3');

    const resetBtn =
      el.querySelector('.reset') as HTMLButtonElement;
    resetBtn.click();
    await fixture.whenStable();

    expect(el.querySelector('.count')?.textContent)
      .toContain('Count: 0');
  });
});`;

  protected fullTest = `import { page, userEvent } from 'vitest/browser';
import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent — Full Browser Mode', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.innerHTML = '';
  });

  it('should render and interact via page API + userEvent', async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CounterComponent);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();

    await expect.element(page.getByText('Count: 0'))
      .toBeVisible();

    await userEvent.click(
      page.getByRole('button', { name: '+' })
    );
    await expect.element(page.getByText('Count: 1'))
      .toBeVisible();

    await userEvent.click(
      page.getByRole('button', { name: '+' })
    );
    await userEvent.click(
      page.getByRole('button', { name: '+' })
    );
    await expect.element(page.getByText('Count: 3'))
      .toBeVisible();

    await userEvent.click(
      page.getByRole('button', { name: '-' })
    );
    await expect.element(page.getByText('Count: 2'))
      .toBeVisible();

    await userEvent.click(
      page.getByRole('button', { name: 'Reset' })
    );
    await expect.element(page.getByText('Count: 0'))
      .toBeVisible();

    const heading = page.getByRole('heading',
      { name: 'Counter' });
    await expect.element(heading).toBeVisible();
  });
});`;

  protected partialSummary = `// Setup: TestBed.createComponent()
// Query: querySelector(), .textContent
// Interact: element.click()
// Assert: expect(value).toContain()
//
// ✓ Familiar — same as jsdom tests
// ✓ Fast — no Playwright overhead
// ✗ No actionability checks
// ✗ Passes even if element is hidden`;

  protected fullSummary = `// Setup: TestBed.createComponent()
// Query: page.getByRole(), page.getByText()
// Interact: userEvent.click()
// Assert: expect.element().toBeVisible()
//
// ✓ Actionability checks on every click
// ✓ Auto-retry on assertions
// ✓ Real click coordinates
// ✓ Catches CSS/layout bugs
// ✓ Matches real user behavior`;
}
