import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-fake-timers',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Fake Timers</h2>
    <p class="topic-subtitle">
      Control time in your tests. Fast-forward setTimeout, setInterval, and even Date.now()
      without waiting for real time to pass.
    </p>

    <div class="topic-section">
      <h3>Basic timer control</h3>
      <p>
        <code>vi.useFakeTimers()</code> replaces global timer functions.
        <code>vi.advanceTimersByTime()</code> fast-forwards the clock.
      </p>
      <app-code-block [code]="basicTimers" />
    </div>

    <div class="topic-section">
      <h3>Controlling Date</h3>
      <p>
        Fake timers also freeze <code>Date.now()</code> and <code>new Date()</code>,
        letting you test time-dependent logic deterministically.
      </p>
      <app-code-block [code]="dateControl" />
    </div>

    <div class="topic-section">
      <h3>Run all timers</h3>
      <p>
        <code>vi.runAllTimers()</code> executes all pending timers immediately.
        Use <code>vi.runOnlyPendingTimers()</code> for recursive setTimeout patterns.
      </p>
      <app-code-block [code]="runTimers" />
    </div>

    <div class="topic-section">
      <h3>Advance to next timer</h3>
      <p>
        Step through timers one at a time with <code>vi.advanceTimersToNextTimer()</code>.
      </p>
      <app-code-block [code]="nextTimer" />
    </div>

    <div class="note-box">
      <strong>Always restore real timers</strong>
      Call vi.useRealTimers() in afterEach to prevent test pollution.
      Vitest also auto-restores if you set restoreMocks: true in config.
    </div>

    <app-run-hint command="npx nx test main-app fake-timers" />
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
export class FakeTimersComponent {
  protected basicTimers = `beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should execute setTimeout callback', () => {
  const callback = vi.fn();
  setTimeout(callback, 1000);

  // Not called yet
  expect(callback).not.toHaveBeenCalled();

  // Fast-forward 1 second
  vi.advanceTimersByTime(1000);

  // Now it's called!
  expect(callback).toHaveBeenCalledOnce();
});`;

  protected dateControl = `it('should freeze Date', () => {
  const frozenDate = new Date('2025-06-15T12:00:00Z');
  vi.setSystemTime(frozenDate);

  expect(Date.now()).toBe(frozenDate.getTime());
  expect(new Date().toISOString()).toBe('2025-06-15T12:00:00.000Z');

  // Advance time
  vi.advanceTimersByTime(60_000); // 1 minute

  expect(new Date().toISOString()).toBe('2025-06-15T12:01:00.000Z');
});`;

  protected runTimers = `it('should run all pending timers', () => {
  const results: string[] = [];

  setTimeout(() => results.push('fast'), 100);
  setTimeout(() => results.push('medium'), 500);
  setTimeout(() => results.push('slow'), 2000);

  // Execute ALL pending timers at once
  vi.runAllTimers();

  expect(results).toEqual(['fast', 'medium', 'slow']);
});

it('should handle recursive setTimeout', () => {
  const callback = vi.fn();
  const tick = () => {
    callback();
    setTimeout(tick, 100); // reschedules itself
  };
  setTimeout(tick, 100);

  // runOnlyPendingTimers avoids infinite loop
  vi.runOnlyPendingTimers(); // runs first tick
  expect(callback).toHaveBeenCalledTimes(1);

  vi.runOnlyPendingTimers(); // runs second tick
  expect(callback).toHaveBeenCalledTimes(2);
});`;

  protected nextTimer = `it('should step through timers one by one', () => {
  const order: number[] = [];

  setTimeout(() => order.push(1), 100);
  setTimeout(() => order.push(2), 200);
  setTimeout(() => order.push(3), 300);

  vi.advanceTimersToNextTimer(); // → 100ms
  expect(order).toEqual([1]);

  vi.advanceTimersToNextTimer(); // → 200ms
  expect(order).toEqual([1, 2]);

  vi.advanceTimersToNextTimer(); // → 300ms
  expect(order).toEqual([1, 2, 3]);
});`;
}
