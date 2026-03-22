// vi.useFakeTimers() replaces setTimeout, setInterval, Date.now, etc.
// with deterministic fakes so tests never wait for real time to pass.
describe('Fake Timers', () => {
  beforeEach(() => {
    // Intercept all timer APIs from this point on
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Always restore real timers to avoid polluting other tests
    vi.useRealTimers();
  });

  it('should execute setTimeout callback after advancing time', () => {
    const callback = vi.fn();
    setTimeout(callback, 1000);

    // Timer is scheduled but the clock hasn't moved — callback not fired
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward the clock by exactly 1 000 ms
    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledOnce();
  });

  it('should handle multiple timers', () => {
    const results: string[] = [];

    setTimeout(() => results.push('fast'), 100);
    setTimeout(() => results.push('medium'), 500);
    setTimeout(() => results.push('slow'), 2000);

    // advanceTimersByTime fires timers whose delay has been reached,
    // and the advances are cumulative within the same test
    vi.advanceTimersByTime(100);   // total elapsed: 100 ms
    expect(results).toEqual(['fast']);

    vi.advanceTimersByTime(400);   // total elapsed: 500 ms
    expect(results).toEqual(['fast', 'medium']);

    vi.advanceTimersByTime(1500);  // total elapsed: 2 000 ms
    expect(results).toEqual(['fast', 'medium', 'slow']);
  });

  it('should handle setInterval', () => {
    const callback = vi.fn();
    setInterval(callback, 500);

    // setInterval fires every 500 ms — advance in steps and verify
    vi.advanceTimersByTime(500);   // 1st tick
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);   // 2nd tick
    expect(callback).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(1500);  // 3 more ticks (1 000, 1 500, 2 000)
    expect(callback).toHaveBeenCalledTimes(5);
  });
});

// vi.setSystemTime() pins Date.now() and new Date() to a specific moment.
// Combined with advanceTimersByTime, the clock moves forward predictably.
describe('Date Control', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should freeze Date.now()', () => {
    const frozenDate = new Date('2025-06-15T12:00:00Z');
    // Pin the clock — Date.now() and new Date() are now deterministic
    vi.setSystemTime(frozenDate);

    expect(Date.now()).toBe(frozenDate.getTime());
    expect(new Date().toISOString()).toBe('2025-06-15T12:00:00.000Z');
  });

  it('should advance Date along with timers', () => {
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    // advanceTimersByTime moves both the timer queue AND Date.now()
    vi.advanceTimersByTime(60_000); // +1 minute

    expect(new Date().toISOString()).toBe('2025-01-01T00:01:00.000Z');
  });

  it('should test time-dependent logic', () => {
    // Jump to different times of day to exercise branching logic
    vi.setSystemTime(new Date('2025-12-25T10:00:00Z'));

    const getGreeting = () => {
      const hour = new Date().getUTCHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    expect(getGreeting()).toBe('Good morning');   // 10:00

    vi.setSystemTime(new Date('2025-12-25T15:00:00Z'));
    expect(getGreeting()).toBe('Good afternoon'); // 15:00

    vi.setSystemTime(new Date('2025-12-25T20:00:00Z'));
    expect(getGreeting()).toBe('Good evening');   // 20:00
  });
});

// Three strategies for draining the timer queue:
//   runAllTimers            — flush everything (including timers scheduled by timers)
//   runOnlyPendingTimers    — flush only what's queued NOW (safe for recursive patterns)
//   advanceTimersToNextTimer — step to the nearest scheduled timer, one at a time
describe('Run All / Pending Timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should run all pending timers at once', () => {
    const results: string[] = [];

    setTimeout(() => results.push('first'), 100);
    setTimeout(() => results.push('second'), 500);
    setTimeout(() => results.push('third'), 2000);

    // runAllTimers fast-forwards until the queue is empty,
    // regardless of how far in the future timers are scheduled
    vi.runAllTimers();

    expect(results).toEqual(['first', 'second', 'third']);
  });

  it('should handle recursive setTimeout with runOnlyPendingTimers', () => {
    const callback = vi.fn();
    let count = 0;

    // Each tick reschedules itself — runAllTimers would loop until count >= 5,
    // but runOnlyPendingTimers only fires timers that existed BEFORE the call
    const tick = () => {
      callback();
      count++;
      if (count < 5) {
        setTimeout(tick, 100);
      }
    };
    setTimeout(tick, 100);

    vi.runOnlyPendingTimers();  // fires the initial tick, queues the next
    expect(callback).toHaveBeenCalledTimes(1);

    vi.runOnlyPendingTimers();  // fires only that newly queued tick
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should advance to next timer', () => {
    const order: number[] = [];

    setTimeout(() => order.push(1), 100);
    setTimeout(() => order.push(2), 200);
    setTimeout(() => order.push(3), 300);

    // advanceTimersToNextTimer jumps to the nearest scheduled timer,
    // useful for stepping through an exact sequence of events
    vi.advanceTimersToNextTimer();  // clock → 100 ms
    expect(order).toEqual([1]);

    vi.advanceTimersToNextTimer();  // clock → 200 ms
    expect(order).toEqual([1, 2]);

    vi.advanceTimersToNextTimer();  // clock → 300 ms
    expect(order).toEqual([1, 2, 3]);
  });
});
