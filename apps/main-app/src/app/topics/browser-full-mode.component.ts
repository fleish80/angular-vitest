import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-browser-full-mode',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="topic-header">Partial vs Full Browser Mode</h2>
    <p class="topic-subtitle">
      Not all browser modes are equal. <strong>Partial</strong> mode runs your code
      in a browser but interacts with it via JavaScript.
      <strong>Full</strong> mode uses Playwright's automation API for interactions,
      unlocking actionability checks, traces, and real-user fidelity.
    </p>

    <div class="topic-section">
      <h3>Partial browser mode</h3>
      <p>
        When you enable browser mode, Vitest spawns a real browser and loads your
        tests there. The component renders in the DOM, and you query/interact via
        JavaScript — either using the TestBed, direct DOM manipulation, or
        Testing Library.
      </p>
      <app-code-block [code]="partialDiagram" title="How partial mode works" />
      <app-code-block [code]="partialExample" title="Test using partial mode" />
    </div>

    <div class="topic-section">
      <h3>Full browser mode</h3>
      <p>
        Full mode routes interactions through Playwright's automation API — the same
        engine that powers Playwright end-to-end tests. When you call
        <code>userEvent.click()</code> from <code>vitest/browser</code>, Vitest
        translates it into a Playwright command that controls the browser via
        Chrome DevTools Protocol.
      </p>
      <app-code-block [code]="fullDiagram" title="How full mode works" />
      <app-code-block [code]="fullExample" title="Test using full mode" />
    </div>

    <div class="topic-section">
      <h3>What changes?</h3>
      <div class="comparison-grid">
        <div>
          <h4>Partial mode</h4>
          <app-code-block [code]="partialTradeoffs" />
        </div>
        <div>
          <h4>Full mode</h4>
          <app-code-block [code]="fullTradeoffs" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>One import to switch</h3>
      <p>
        If you're already using Testing Library's <code>userEvent</code>, switching
        to full mode is a one-line change.
      </p>
      <app-code-block [code]="importSwitch" />
    </div>

    <div class="topic-section">
      <h3>The page API (recommended)</h3>
      <p>
        For new tests, the <code>page</code> API provides lazy locators similar
        to Playwright. Locators are recipes — they don't query the DOM until an
        action or assertion is performed, which eliminates most manual polling.
      </p>
      <app-code-block [code]="pageApi" />
    </div>

    <div class="note-box">
      <strong>Important distinction</strong>
      Vitest is the test runner. Playwright is just a browser provider — Vitest
      only uses Playwright's automation APIs, not its test framework features.
      You still write Vitest tests with Vitest assertions.
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
export class BrowserFullModeComponent {
  protected partialDiagram = `// Partial Browser Mode Architecture:
//
// Test Code (runs in browser)
//   │
//   ├─ Create component ─── Angular TestBed
//   ├─ Query DOM ────────── document.querySelector / Testing Library
//   ├─ Interact ─────────── JS events (dispatchEvent / userEvent)
//   ├─ Assert ───────────── Vitest matchers
//   │
//   └─ Report ──────────── Vitest Server
//
// The browser is just a container.
// Interactions go through JavaScript — no automation API.`;

  protected fullDiagram = `// Full Browser Mode Architecture:
//
// Test Code (runs in browser)
//   │
//   ├─ Create component ────── Angular TestBed
//   ├─ Interact ────────────── vitest/browser userEvent / page API
//   │     │
//   │     └── Vitest Server ── translates to Playwright commands
//   │           │
//   │           └── Playwright ─ Chrome DevTools Protocol
//   │                 │
//   │                 ├── Actionability checks (visible? enabled? stable?)
//   │                 ├── Real coordinates & click points
//   │                 └── Trace recording
//   │
//   ├─ Assert ──────────────── Vitest matchers / expect.element
//   └─ Report ──────────────── Vitest Server`;

  protected partialExample = `// Partial mode: interactions via Testing Library
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';

it('adds to cart', async () => {
  const btn = screen.getByRole('button', { name: 'Add' });
  await userEvent.click(btn);

  // Checks: is the element disabled? hidden?
  // Does NOT check: is it covered by another element?
  //                  is it outside the viewport?
  //                  is it clipped by overflow?
});`;

  protected fullExample = `// Full mode: interactions via Playwright automation
import { page, userEvent } from 'vitest/browser';

it('adds to cart', async () => {
  const btn = page.getByRole('button', { name: 'Add' });
  await userEvent.click(btn);

  // Playwright performs actionability checks:
  // ✓ Element is visible
  // ✓ Element is stable (not animating)
  // ✓ Element is enabled
  // ✓ Element is not covered by another element
  // ✓ Element receives the event at computed coordinates
});`;

  protected partialTradeoffs = `// Quick win — most existing tests just work
// ✓ Real DOM, CSS, Web APIs
// ✓ Easy migration from jsdom
// ✗ No actionability checks
// ✗ No Playwright traces
// ✗ False negatives possible
//   (test passes, app is broken)
// ✗ Cannot pierce Shadow DOM`;

  protected fullTradeoffs = `// Full power of the browser provider
// ✓ Real DOM, CSS, Web APIs
// ✓ Actionability checks
// ✓ Playwright traces & screenshots
// ✓ Catches CSS/layout bugs
// ✓ Can pierce Shadow DOM
// ✓ Real click coordinates
// ✓ Matches real user behavior`;

  protected importSwitch = `// BEFORE (partial mode — Testing Library)
import { userEvent } from '@testing-library/user-event';

// AFTER (full mode — Vitest browser)
import { userEvent } from 'vitest/browser';
// That's it. Same API, different behavior.

// The userEvent adapter from vitest/browser has the
// same interface as Testing Library's userEvent, but
// routes actions through Playwright's automation API.`;

  protected pageApi = `import { page } from 'vitest/browser';

it('filters cookbooks', async () => {
  // Locators are lazy — no DOM query yet
  const input = page.getByPlaceholder('Search...');
  const headings = page.getByRole('heading', { level: 3 });

  // Action triggers the locator + Playwright automation
  await userEvent.fill(input, 'Angular');

  // expect.element auto-retries until assertion passes
  await expect.element(headings).toHaveCount(3);
  await expect.element(headings.nth(0))
    .toHaveTextContent('Angular Testing Cookbook');

  // No intermediate variables, no manual polling,
  // no await for each query — just declare intent.
});`;
}
