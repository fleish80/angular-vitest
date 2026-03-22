export {};

function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

describe('Calculator', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, -2)).toBe(-3);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should return zero when multiplied by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });
});

describe('Lifecycle hooks demo', () => {
  let items: string[];

  beforeAll(() => {
    console.log('  [beforeAll] Suite starting');
  });

  beforeEach(() => {
    items = ['apple', 'banana'];
  });

  afterEach(() => {
    items = [];
  });

  afterAll(() => {
    console.log('  [afterAll] Suite complete');
  });

  it('should start with 2 items', () => {
    expect(items).toHaveLength(2);
  });

  it('should allow adding items', () => {
    items.push('cherry');
    expect(items).toHaveLength(3);
    expect(items).toContain('cherry');
  });

  it('should still have 2 items (fresh state from beforeEach)', () => {
    expect(items).toHaveLength(2);
    expect(items).not.toContain('cherry');
  });
});

describe('Basic assertions', () => {
  it('should check strict equality', () => {
    expect(1 + 1).toBe(2);
  });

  it('should check truthiness', () => {
    expect(true).toBeTruthy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect('hello').toBeDefined();
  });

  it('should check numbers', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
    expect(10).toBeGreaterThan(5);
    expect(3).toBeLessThanOrEqual(3);
  });

  it('should check strings', () => {
    expect('Hello World').toContain('World');
    expect('vitest').toMatch(/test/);
  });

  it('should negate with .not', () => {
    expect(42).not.toBe(0);
    expect('angular').not.toContain('react');
  });
});
