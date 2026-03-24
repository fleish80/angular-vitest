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
      the instant your test acts. Vitest provides <code>expect.poll</code>
      and <code>expect.element</code> to retry assertions until they pass or
      time out.
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
      <h3>expect.poll — multiple assertions</h3>
      <p>
        When several values need to settle together, chain multiple
        <code>expect.poll</code> calls — each one retries independently until
        its matcher passes.
      </p>
      <app-code-block [code]="pollMultiple" />
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

    <app-run-hint command="npm run test:browser polling" />
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

it('should retry until value matches', async () => {
  document.body.innerHTML = \`
    <button id="start">Start</button>
    <span id="status">idle</span>
  \`;

  const statusEl =
    document.getElementById('status') as HTMLSpanElement;
  const startBtn =
    document.getElementById('start') as HTMLButtonElement;
  startBtn.addEventListener('click', () => {
    setTimeout(() => {
      statusEl.textContent = 'done';
    }, 200);
  });

  await userEvent.click(
    page.getByRole('button', { name: 'Start' })
  );

  await expect.poll(() => statusEl.textContent).toBe('done');
});

it('should retry with async function', async () => {
  document.body.innerHTML = \`<ul id="list"></ul>\`;

  const list =
    document.getElementById('list') as HTMLUListElement;
  setTimeout(() => {
    list.innerHTML =
      '<li>Item 1</li><li>Item 2</li><li>Item 3</li>';
  }, 150);

  await expect.poll(() => {
    return list.querySelectorAll('li').length;
  }).toBe(3);
});`;

  protected pollMultiple = `it('should retry until all conditions are met', async () => {
  document.body.innerHTML = \`<div id="container"></div>\`;

  const container =
    document.getElementById('container') as HTMLDivElement;

  setTimeout(() => {
    container.innerHTML = \`
      <h3>Angular Testing</h3>
      <p>A guide to testing Angular apps</p>
      <span class="badge">new</span>
    \`;
  }, 200);

  await expect.poll(
    () => container.querySelector('h3')?.textContent
  ).toBe('Angular Testing');

  await expect.poll(
    () => container.querySelector('.badge')?.textContent
  ).toBe('new');
});`;

  protected expectElement = `import { page, userEvent } from 'vitest/browser';

it('should auto-retry assertions on locators', async () => {
  document.body.innerHTML = \`
    <button id="toggle">Show</button>
    <div id="content" style="display:none">
      <h3>Revealed Content</h3>
    </div>
  \`;

  const toggleBtn =
    document.getElementById('toggle') as HTMLButtonElement;
  const content =
    document.getElementById('content') as HTMLDivElement;
  toggleBtn.addEventListener('click', () => {
    setTimeout(() => {
      content.style.display = 'block';
    }, 200);
  });

  await userEvent.click(
    page.getByRole('button', { name: 'Show' })
  );

  const heading = page.getByRole('heading',
    { name: 'Revealed Content' });
  // expect.element auto-retries — no explicit polling needed
  await expect.element(heading).toBeVisible();
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

// Multiple conditions — each retries independently
await expect.poll(
  () => items.length
).toBe(3);
await expect.poll(
  () => items[0].textContent
).toBe('...');

// Works regardless of internal timing.
// Adapts to slow CI machines automatically.`;

  protected timeoutConfig = `// Per-assertion timeout and interval
it('should support custom timeout and interval', async () => {
  let counter = 0;
  const interval = setInterval(() => counter++, 50);

  await expect.poll(() => counter, {
    timeout: 2000,   // max wait (default: 1000ms)
    interval: 100,   // poll interval (default: 50ms)
  }).toBeGreaterThanOrEqual(5);

  clearInterval(interval);
});

// Global default in vitest config
// test: {
//   expect: { poll: { timeout: 3000 } }
// }`;
}
