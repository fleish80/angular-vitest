import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-basic-tests',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Basic Tests</h2>
    <p class="topic-subtitle">
      The building blocks of every test suite: describe, it, expect, and lifecycle hooks.
    </p>

    <div class="topic-section">
      <h3>describe & it</h3>
      <p>
        Group tests with <code>describe</code> and define individual test cases with <code>it</code>.
        Nesting describes creates a clear test hierarchy.
      </p>
      <app-code-block [code]="describeIt" filename="basic.spec.ts" />
    </div>

    <div class="topic-section">
      <h3>Lifecycle hooks</h3>
      <p>
        Set up and tear down test state with <code>beforeEach</code>, <code>afterEach</code>,
        <code>beforeAll</code>, and <code>afterAll</code>.
      </p>
      <app-code-block [code]="lifecycle" />
    </div>

    <div class="topic-section">
      <h3>Basic assertions</h3>
      <p>
        The <code>expect</code> function wraps a value and provides chainable matchers.
      </p>
      <app-code-block [code]="assertions" />
    </div>

    <app-run-hint command="npx nx test main-app basic" />
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
export class BasicTestsComponent {
  protected describeIt = `function add(a: number, b: number): number {
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
  });
});`;

  protected lifecycle = `describe('with lifecycle hooks', () => {
  let items: string[];

  // Runs once before ALL tests in this describe
  beforeAll(() => {
    console.log('Suite starting');
  });

  // Runs before EACH test
  beforeEach(() => {
    items = ['apple', 'banana'];
  });

  // Runs after EACH test
  afterEach(() => {
    items = [];
  });

  // Runs once after ALL tests
  afterAll(() => {
    console.log('Suite complete');
  });

  it('should start with 2 items', () => {
    expect(items).toHaveLength(2);
  });

  it('should allow adding items', () => {
    items.push('cherry');
    expect(items).toHaveLength(3);
  });

  // This still has 2 items — beforeEach resets!
  it('should still have 2 items (fresh state)', () => {
    expect(items).toHaveLength(2);
  });
});`;

  protected assertions = `it('basic assertion examples', () => {
  // Strict equality
  expect(1 + 1).toBe(2);

  // Truthiness
  expect(true).toBeTruthy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
  expect('hello').toBeDefined();

  // Numbers
  expect(0.1 + 0.2).toBeCloseTo(0.3);
  expect(10).toBeGreaterThan(5);
  expect(3).toBeLessThanOrEqual(3);

  // Strings
  expect('Hello World').toContain('World');
  expect('vitest').toMatch(/test/);

  // Negation — just add .not
  expect(42).not.toBe(0);
  expect('angular').not.toContain('react');
});`;
}
