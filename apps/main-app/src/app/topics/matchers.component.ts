import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-matchers',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Matchers</h2>
    <p class="topic-subtitle">
      Vitest provides a rich set of matchers beyond the basics.
      Deep equality, partial matching, error assertions, and custom matchers.
    </p>

    <div class="topic-section">
      <h3>Object & array matchers</h3>
      <app-code-block [code]="objectMatchers" />
    </div>

    <div class="topic-section">
      <h3>Exception matchers</h3>
      <p>Use <code>toThrow</code> to assert that a function throws an error.</p>
      <app-code-block [code]="errorMatchers" />
    </div>

    <div class="topic-section">
      <h3>Asymmetric matchers</h3>
      <p>
        Asymmetric matchers let you assert <em>part</em> of a value.
        Perfect for checking objects where you only care about some fields.
      </p>
      <app-code-block [code]="asymmetric" />
    </div>

    <div class="topic-section">
      <h3>Soft assertions</h3>
      <p>
        <code>expect.soft()</code> records failures without stopping the test.
        All soft failures are reported at the end.
      </p>
      <app-code-block [code]="softAssert" />
    </div>

    <div class="topic-section">
      <h3>Custom matchers</h3>
      <p>
        Extend Vitest with your own matchers using <code>expect.extend()</code>.
      </p>
      <app-code-block [code]="customMatcher" />
    </div>

    <app-run-hint command="npx nx test main-app matchers" />
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
export class MatchersComponent {
  protected objectMatchers = `// Deep equality — checks value, not reference
expect({ a: 1, b: { c: 2 } }).toEqual({ a: 1, b: { c: 2 } });

// toStrictEqual also checks for undefined properties
expect({ a: 1 }).not.toStrictEqual({ a: 1, b: undefined });

// Array matchers
expect([1, 2, 3]).toContain(2);
expect([{ id: 1 }, { id: 2 }]).toContainEqual({ id: 2 });
expect([1, 2, 3]).toHaveLength(3);

// Object property checking
expect({ name: 'Vitest', version: 4 }).toHaveProperty('name');
expect({ name: 'Vitest', version: 4 }).toHaveProperty('version', 4);`;

  protected errorMatchers = `// Assert that a function throws
expect(() => { throw new Error('boom'); }).toThrow();
expect(() => { throw new Error('boom'); }).toThrow('boom');
expect(() => { throw new Error('boom'); }).toThrow(/boom/);

// Assert specific error type
expect(() => {
  throw new TypeError('bad type');
}).toThrow(TypeError);

// Assert a function does NOT throw
expect(() => 'safe').not.toThrow();`;

  protected asymmetric = `// expect.any — matches any instance of a type
expect({ id: 1, created: new Date() }).toEqual({
  id: 1,
  created: expect.any(Date),
});

// expect.stringContaining / stringMatching
expect({ message: 'Hello World' }).toEqual({
  message: expect.stringContaining('World'),
});

// expect.objectContaining — partial match
expect({ name: 'Angular', version: 21, type: 'framework' }).toEqual(
  expect.objectContaining({ name: 'Angular', version: 21 })
);

// expect.arrayContaining — subset match
expect([1, 2, 3, 4, 5]).toEqual(
  expect.arrayContaining([2, 4])
);`;

  protected softAssert = `it('soft assertions — collects all failures', () => {
  const user = { name: 'Alice', age: 30, role: 'admin' };

  // All of these run even if one fails
  expect.soft(user.name).toBe('Alice');
  expect.soft(user.age).toBe(30);
  expect.soft(user.role).toBe('admin');
});`;

  protected customMatcher = `// Define a custom matcher
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        \`expected \${received} to be within [\${floor}, \${ceiling}]\`,
    };
  },
});

it('should be within range', () => {
  expect(7).toBeWithinRange(1, 10);
  expect(15).not.toBeWithinRange(1, 10);
});`;
}
