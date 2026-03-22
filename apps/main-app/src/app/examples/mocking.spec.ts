// vi.fn() creates a standalone mock with no backing implementation.
// Use it when you need a fake callback, event handler, or dependency.
describe('vi.fn() — Mock Functions', () => {
  it('should create a basic mock function', () => {
    // vi.fn() with no args returns undefined and records every call
    const greet = vi.fn();

    greet('Alice');
    greet('Bob');

    // Matcher-based assertions — readable and diff-friendly
    expect(greet).toHaveBeenCalledTimes(2);
    expect(greet).toHaveBeenCalledWith('Alice');     // any call matched
    expect(greet).toHaveBeenLastCalledWith('Bob');    // only the latest call
  });

  it('should create a mock with implementation', () => {
    // Pass a function to vi.fn() to give the mock real behavior
    // while still tracking calls and return values
    const double = vi.fn((n: number) => n * 2);

    expect(double(5)).toBe(10);
    expect(double(3)).toBe(6);
    expect(double).toHaveBeenCalledTimes(2);
  });

  it('should chain return values', () => {
    // mockReturnValueOnce queues one-shot return values (FIFO).
    // After the queue is drained, mockReturnValue kicks in as the default.
    const fetchData = vi.fn()
      .mockReturnValueOnce('first call')
      .mockReturnValueOnce('second call')
      .mockReturnValue('subsequent calls');

    expect(fetchData()).toBe('first call');           // 1st queued value
    expect(fetchData()).toBe('second call');           // 2nd queued value
    expect(fetchData()).toBe('subsequent calls');      // default from here on
    expect(fetchData()).toBe('subsequent calls');
  });

  it('should mock async return values', async () => {
    // mockResolvedValueOnce / mockRejectedValueOnce are shorthand for
    // mockReturnValueOnce(Promise.resolve(...)) / .reject(...)
    const asyncFn = vi.fn()
      .mockResolvedValueOnce('resolved data')
      .mockRejectedValueOnce(new Error('network error'));

    await expect(asyncFn()).resolves.toBe('resolved data');
    await expect(asyncFn()).rejects.toThrow('network error');
  });
});

// vi.spyOn() wraps an existing method so you can track calls
// WITHOUT replacing the object's real behavior (unless you choose to).
describe('vi.spyOn() — Spy on Methods', () => {
  it('should spy while keeping original implementation', () => {
    const cart = {
      items: [] as string[],
      addItem(item: string) {
        this.items.push(item);
      },
    };

    // spyOn alone — the real addItem still runs, but calls are recorded
    const spy = vi.spyOn(cart, 'addItem');

    cart.addItem('laptop');

    expect(spy).toHaveBeenCalledWith('laptop');
    expect(cart.items).toContain('laptop'); // real side-effect happened

    spy.mockRestore();
  });

  it('should override implementation with spy', () => {
    const calculator = {
      add: (a: number, b: number) => a + b,
    };

    // Chain mockReturnValue to replace behavior while still tracking calls
    const spy = vi.spyOn(calculator, 'add').mockReturnValue(999);

    expect(calculator.add(1, 2)).toBe(999);  // overridden
    expect(spy).toHaveBeenCalledWith(1, 2);  // args still recorded

    // mockRestore puts the original function back on the object
    spy.mockRestore();
    expect(calculator.add(1, 2)).toBe(3);    // real behavior again
  });

  it('should spy on console.log', () => {
    // Spy on globals the same way — mockImplementation(() => {})
    // silences output while still capturing calls
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    console.log('Hello', 'World');

    expect(spy).toHaveBeenCalledWith('Hello', 'World');

    spy.mockRestore(); // always restore global spies to avoid test pollution
  });
});

// Every mock exposes a .mock property with full call/result history.
// Use matchers for readability; drop to .mock.* when you need raw data.
describe('Mock Assertions', () => {
  it('should verify call details', () => {
    const handler = vi.fn();

    handler('a', 1);
    handler('b', 2);
    handler('c', 3);

    // High-level matchers — clear intent, good failure messages
    expect(handler).toHaveBeenCalledTimes(3);
    expect(handler).toHaveBeenNthCalledWith(1, 'a', 1);  // 1-based index
    expect(handler).toHaveBeenNthCalledWith(2, 'b', 2);
    expect(handler).toHaveBeenLastCalledWith('c', 3);

    // Low-level access — .mock.calls is an array of argument arrays,
    // one entry per invocation, useful for complex or snapshot assertions
    expect(handler.mock.calls).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  it('should track return values', () => {
    const fn = vi.fn((x: number) => x * 2);

    fn(1);
    fn(2);
    fn(3);

    // .mock.results records { type, value } for every call.
    // type is 'return' for normal returns, 'throw' for exceptions.
    expect(fn.mock.results).toEqual([
      { type: 'return', value: 2 },
      { type: 'return', value: 4 },
      { type: 'return', value: 6 },
    ]);
  });

  // ── Resetting mocks ─────────────────────────────────────────────
  // Three levels, each stricter than the previous:
  //
  //   mockClear   → wipes call history (.mock.calls / .mock.results)
  //   mockReset   → mockClear + removes mockReturnValue / mockImplementation
  //   mockRestore → mockReset + puts the original function back (spyOn only)

  it('should reset mocks with mockClear / mockReset', () => {
    const fn = vi.fn();
    fn.mockReturnValue(42);

    fn();
    fn();
    expect(fn).toHaveBeenCalledTimes(2);

    // mockClear — history is gone, but mockReturnValue(42) stays
    fn.mockClear();
    expect(fn).toHaveBeenCalledTimes(0);
    expect(fn()).toBe(42); // implementation still active

    // mockReset — history AND implementation gone, returns undefined
    fn.mockReset();
    expect(fn()).toBeUndefined();
  });

  it('should restore original with mockRestore (spyOn only)', () => {
    const math = {
      square: (n: number) => n * n,
    };

    const spy = vi.spyOn(math, 'square').mockReturnValue(0);
    expect(math.square(5)).toBe(0);

    // mockRestore — history, implementation, AND the spy wrapper removed;
    // math.square is the original function again.
    // (Has no effect on vi.fn() — there's no original to restore.)
    spy.mockRestore();
    expect(math.square(5)).toBe(25);
  });
});
