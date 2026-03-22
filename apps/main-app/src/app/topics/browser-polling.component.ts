import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-polling',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Polling & Retries</h2>
    <p class="topic-subtitle">
      Async operations — effects, debounce, HTTP calls — mean the DOM isn't ready
      the instant your test acts. Vitest provides <code>expect.poll</code>,
      <code>vi.waitFor</code>, and <code>expect.element</code> to retry assertions
      until they pass or time out.
    </p>

    <div class="topic-section">
      <h3>The timing problem</h3>
      <p>
        Angular signals, effects, and RxJS subscriptions schedule work asynchronously.
        A naive assertion right after a user action will often see stale state.
        Instead of manually waiting for Angular to stabilize, you can let Vitest
        poll for the expected outcome.
      </p>
      <app-code-block [code]="timingProblem" title="The problem" />
    </div>

    <div class="topic-section">
      <h3>expect.poll</h3>
      <p>
        Calls a function repeatedly until the chained matcher passes.
        Works with both sync and async functions.
      </p>
      <app-code-block [code]="expectPoll" />
    </div>

    <div class="topic-section">
      <h3>vi.waitFor</h3>
      <p>
        Retries an entire block of assertions — useful when multiple things
        need to settle together.
      </p>
      <app-code-block [code]="waitFor" />
    </div>

    <div class="topic-section">
      <h3>expect.element (browser mode)</h3>
      <p>
        In browser mode, <code>expect.element(locator)</code> automatically retries
        the assertion against the locator. No manual polling required — the
        matcher handles it.
      </p>
      <app-code-block [code]="expectElement" />
    </div>

    <div class="topic-section">
      <h3>Comparison</h3>
      <div class="comparison-grid">
        <div>
          <h4>Manual (fragile)</h4>
          <app-code-block [code]="manualWait" />
        </div>
        <div>
          <h4>Vitest polling (robust)</h4>
          <app-code-block [code]="vitestPolling" />
        </div>
      </div>
    </div>

    <div class="topic-section">
      <h3>Configuring timeouts</h3>
      <app-code-block [code]="timeoutConfig" />
    </div>

    <div class="note-box">
      <strong>Key insight</strong>
      Polling removes the coupling between your test and Angular's internal
      scheduling. Your test just declares <em>what</em> should eventually be true,
      not <em>when</em> or <em>how</em> Angular gets there.
    </div>

    <app-run-hint command="npm run test:browser -- --testFiles=polling" />
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
export class BrowserPollingComponent {
  protected timingProblem = `it('fails — DOM not ready yet', async () => {
  // User types into a search input with debounce
  await userEvent.fill(input, 'Angular');

  // The list hasn't filtered yet because of a 300ms debounce
  const items = document.querySelectorAll('.result');
  expect(items.length).toBe(3); // FAILS — still showing all items
});`;

  protected expectPoll = `import { page, userEvent } from 'vitest/browser';

it('should filter results after debounce', async () => {
  await userEvent.fill(page.getByPlaceholder('Search...'), 'Angular');

  // Keeps calling the function until length === 3 or timeout
  await expect.poll(() => {
    return document.querySelectorAll('.result').length;
  }).toBe(3);
});

// Also works with async functions
it('should update cart count', async () => {
  await userEvent.click(page.getByRole('button', { name: 'Add to cart' }));

  await expect.poll(async () => {
    const badge = document.querySelector('.cart-badge');
    return badge?.textContent?.trim();
  }).toBe('1');
});`;

  protected waitFor = `import { waitFor } from 'vitest/browser';

it('should show filtered results with correct titles', async () => {
  await userEvent.fill(page.getByPlaceholder('Search...'), 'Angular');

  // Retries the entire block until all assertions pass
  await waitFor(() => {
    const headings = document.querySelectorAll('h3.title');
    expect(headings.length).toBe(3);
    expect(headings[0].textContent).toContain('Angular');
    expect(headings[1].textContent).toContain('Angular');
    expect(headings[2].textContent).toContain('Angular');
  });
});`;

  protected expectElement = `import { page, userEvent } from 'vitest/browser';

it('should filter and display results', async () => {
  await userEvent.fill(page.getByPlaceholder('Search...'), 'Angular');

  const headings = page.getByRole('heading', { level: 3 });

  // expect.element auto-retries — no explicit polling needed
  await expect.element(headings).toHaveCount(3);
  await expect.element(headings.nth(0)).toHaveTextContent('Angular Testing');
  await expect.element(headings.nth(1)).toHaveTextContent('Angular Signals');
  await expect.element(headings.nth(2)).toHaveTextContent('Angular Forms');
});`;

  protected manualWait = `// Fragile: hardcoded delay
await new Promise(r => setTimeout(r, 500));
expect(items.length).toBe(3);

// Fragile: depends on Angular internals
await fixture.whenStable();
expect(items.length).toBe(3);

// If the debounce changes from 300ms
// to 500ms, the test breaks.`;

  protected vitestPolling = `// Robust: polls until true or timeout
await expect.poll(() => items.length).toBe(3);

// Robust: retries entire assertion block
await waitFor(() => {
  expect(items.length).toBe(3);
  expect(items[0].textContent).toBe('...');
});

// Works regardless of internal timing.
// Adapts to slow CI machines automatically.`;

  protected timeoutConfig = `// Per-assertion timeout
await expect.poll(() => count, {
  timeout: 5000,   // max wait (default: 1000ms)
  interval: 100,   // poll interval (default: 50ms)
}).toBe(10);

// Per-block timeout
await waitFor(() => {
  expect(el.textContent).toBe('Done');
}, { timeout: 5000, interval: 100 });

// Global default in vitest config
// test: {
//   expect: { poll: { timeout: 3000 } }
// }`;
}
