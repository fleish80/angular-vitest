import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-filtering',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Filtering & Concurrent</h2>
    <p class="topic-subtitle">
      Control which tests run and how they run.
      Skip, focus, mark as TODO, or run tests in parallel.
    </p>

    <div class="topic-section">
      <h3>it.skip — Skip a test</h3>
      <p>Temporarily disable a test without deleting it.</p>
      <app-code-block [code]="skip" />
    </div>

    <div class="topic-section">
      <h3>it.only — Focus on one test</h3>
      <p>Run only specific tests during development. Vitest ignores all others in the file.</p>
      <app-code-block [code]="only" />
    </div>

    <div class="topic-section">
      <h3>it.todo — Planned tests</h3>
      <p>
        Mark tests you plan to write. They show up in reports as "todo"
        so you don't forget.
      </p>
      <app-code-block [code]="todo" />
    </div>

    <div class="topic-section">
      <h3>it.concurrent — Parallel execution</h3>
      <p>
        Run tests concurrently within a suite. Each concurrent test
        gets its own isolated context.
      </p>
      <app-code-block [code]="concurrent" />
    </div>

    <div class="topic-section">
      <h3>describe.shuffle — Random order</h3>
      <p>
        Randomize test execution order to catch hidden dependencies between tests.
      </p>
      <app-code-block [code]="shuffle" />
    </div>

    <div class="note-box">
      <strong>CI safety</strong>
      Vitest can be configured to fail CI if it.only is left in the codebase.
      Use the --bail flag to stop after the first failure, or --reporter=verbose for detailed output.
    </div>

    <app-run-hint command="npx nx test main-app organization" />
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
export class FilteringComponent {
  protected skip = `it.skip('this test is temporarily disabled', () => {
  // This code won't run
  expect(true).toBe(false);
});

// Also works on describe
describe.skip('entire skipped suite', () => {
  it('none of these run', () => {});
});`;

  protected only = `it.only('only this test runs', () => {
  expect(1 + 1).toBe(2);
});

it('this is ignored when .only is present', () => {
  expect(true).toBe(true);
});

// Works on describe too
describe.only('focused suite', () => {
  it('this runs', () => {});
});`;

  protected todo = `// Placeholder for tests you haven't written yet
it.todo('should validate email format');
it.todo('should handle network timeout');
it.todo('should retry failed requests');

// Shows in output:
// ✓ should add numbers
// ↺ should validate email format (todo)
// ↺ should handle network timeout (todo)`;

  protected concurrent = `describe('concurrent tests', () => {
  it.concurrent('test A (runs in parallel)', async () => {
    const result = await fetchData('/a');
    expect(result).toBeDefined();
  });

  it.concurrent('test B (runs in parallel)', async () => {
    const result = await fetchData('/b');
    expect(result).toBeDefined();
  });

  it.concurrent('test C (runs in parallel)', async () => {
    const result = await fetchData('/c');
    expect(result).toBeDefined();
  });
});

// Or mark the entire describe as concurrent:
describe.concurrent('all parallel', () => {
  it('test 1', async () => { /* ... */ });
  it('test 2', async () => { /* ... */ });
});`;

  protected shuffle = `// Randomize order to find hidden dependencies
describe.shuffle('randomized tests', () => {
  it('test A', () => expect(true).toBe(true));
  it('test B', () => expect(true).toBe(true));
  it('test C', () => expect(true).toBe(true));
});

// CLI flag for all tests:
// npx vitest --sequence.shuffle`;
}
