import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-mocking',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Mocking</h2>
    <p class="topic-subtitle">
      Vitest's built-in mocking is one of its strongest features.
      Mock functions, spy on methods, and replace entire modules — all without extra packages.
    </p>

    <div class="topic-section">
      <h3>vi.fn() — Mock functions</h3>
      <p>
        Create standalone mock functions that record every call, its arguments, and return values.
        Use them as fake callbacks, event handlers, or injected dependencies.
      </p>
      <app-code-block [code]="viFn" />
    </div>

    <div class="topic-section">
      <h3>vi.spyOn() — Spy on methods</h3>
      <p>
        Wrap an existing method to record calls without changing its behavior.
        Optionally replace the implementation, then call <code>mockRestore()</code>
        to put the original function back.
      </p>
      <app-code-block [code]="viSpyOn" />
    </div>

    <div class="topic-section">
      <h3>vi.mock() — Module mocking</h3>
      <p>
        Replace an entire module's exports. The mock is hoisted to the top of the file
        automatically, so it takes effect before any imports.
      </p>
      <app-code-block [code]="viMock" />
    </div>

    <div class="topic-section">
      <h3>Mock return values</h3>
      <p>
        Queue one-shot return values with <code>mockReturnValueOnce</code>,
        set a permanent default with <code>mockReturnValue</code>, or use
        the async variants for promises.
      </p>
      <app-code-block [code]="returnValues" />
    </div>

    <div class="topic-section">
      <h3>Mock assertions</h3>
      <p>
        Use high-level matchers for readability, or access the raw
        <code>.mock.calls</code> and <code>.mock.results</code> arrays for
        complex assertions. Three reset levels let you control cleanup granularity.
      </p>
      <app-code-block [code]="mockAssertions" />
    </div>

    <app-run-hint command="npx nx test main-app mocking" />
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
export class MockingComponent {
  protected viFn = `// vi.fn() with no args — returns undefined, records every call
const greet = vi.fn();

greet('Alice');
greet('Bob');

expect(greet).toHaveBeenCalledTimes(2);
expect(greet).toHaveBeenCalledWith('Alice');     // any call matched
expect(greet).toHaveBeenLastCalledWith('Bob');    // only the latest call

// Pass a function to give the mock real behavior
// while still tracking calls and return values
const double = vi.fn((n: number) => n * 2);
expect(double(5)).toBe(10);`;

  protected viSpyOn = `const cart = {
  items: [] as string[],
  addItem(item: string) {
    this.items.push(item);
  },
};

// spyOn alone — real method still runs, but calls are recorded
const spy = vi.spyOn(cart, 'addItem');

cart.addItem('laptop');

expect(spy).toHaveBeenCalledWith('laptop');
expect(cart.items).toContain('laptop'); // real side-effect happened

// Chain mockImplementation to replace behavior
spy.mockImplementation(() => {
  /* do nothing */
});
cart.addItem('phone');
expect(cart.items).not.toContain('phone'); // overridden — no side-effect

// mockRestore puts the original function back on the object
spy.mockRestore();`;

  protected viMock = `// vi.mock() replaces an entire module's exports.
// The call is hoisted to the top of the file automatically,
// so the mock is in place before any imports execute.
vi.mock('./auth.service', () => ({
  AuthService: {
    isLoggedIn: vi.fn(() => true),
    getUser: vi.fn(() => ({ name: 'Test User' })),
  },
}));

// This import now receives the mocked version
import { AuthService } from './auth.service';

it('should use mocked auth', () => {
  expect(AuthService.isLoggedIn()).toBe(true);
  expect(AuthService.getUser()).toEqual({ name: 'Test User' });
});`;

  protected returnValues = `const fetchData = vi.fn();

// mockReturnValue sets a permanent default
fetchData.mockReturnValue('default');

// mockReturnValueOnce queues one-shot values (FIFO).
// After the queue is drained, the default kicks in.
fetchData
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')
  .mockReturnValue('subsequent calls');

expect(fetchData()).toBe('first call');       // 1st queued
expect(fetchData()).toBe('second call');       // 2nd queued
expect(fetchData()).toBe('subsequent calls');  // default from here

// Async shortcuts — wrap return values in Promise.resolve / .reject
const asyncFn = vi.fn()
  .mockResolvedValue('resolved')      // → Promise.resolve('resolved')
  .mockRejectedValueOnce('error');    // → Promise.reject('error') once`;

  protected mockAssertions = `const handler = vi.fn();

handler('a', 1);
handler('b', 2);
handler('c', 3);

// High-level matchers — readable and diff-friendly
expect(handler).toHaveBeenCalledTimes(3);
expect(handler).toHaveBeenNthCalledWith(1, 'a', 1);  // 1-based index
expect(handler).toHaveBeenNthCalledWith(2, 'b', 2);
expect(handler).toHaveBeenLastCalledWith('c', 3);

// Low-level access — .mock.calls is an array of argument arrays,
// useful for complex or snapshot assertions
expect(handler.mock.calls).toEqual([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

// Three reset levels, each stricter than the previous:
handler.mockClear();    // wipes .mock.calls & .mock.results
handler.mockReset();    // + removes mockReturnValue / mockImplementation
handler.mockRestore();  // + restores original function (spyOn only)`;
}
