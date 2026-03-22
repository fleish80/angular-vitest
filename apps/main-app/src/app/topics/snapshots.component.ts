import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-snapshots',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Snapshot Testing</h2>
    <p class="topic-subtitle">
      Capture a value and compare it against a stored reference.
      Great for catching unintended changes in complex objects, HTML, or serialized output.
    </p>

    <div class="topic-section">
      <h3>File snapshots</h3>
      <p>
        <code>toMatchSnapshot()</code> saves the snapshot to a <code>__snapshots__</code>
        directory next to your test file. On subsequent runs, it compares against the stored version.
      </p>
      <app-code-block [code]="fileSnapshot" />
    </div>

    <div class="topic-section">
      <h3>Inline snapshots</h3>
      <p>
        <code>toMatchInlineSnapshot()</code> writes the snapshot directly into your test file.
        Vitest auto-fills it on the first run — no manual writing needed.
      </p>
      <app-code-block [code]="inlineSnapshot" />
    </div>

    <div class="topic-section">
      <h3>Snapshot of objects</h3>
      <p>
        Snapshots work with any serializable value — objects, arrays, strings, errors.
      </p>
      <app-code-block [code]="objectSnapshot" />
    </div>

    <div class="topic-section">
      <h3>Updating snapshots</h3>
      <p>
        When a snapshot change is intentional, update it with the <code>-u</code> flag.
      </p>
      <app-code-block [code]="updateSnapshot" />
    </div>

    <div class="note-box">
      <strong>When to use snapshots</strong>
      Snapshots are best for detecting unintended changes. They're not a substitute for
      targeted assertions. Use them for complex serialized output, component templates, or
      API response shapes.
    </div>

    <app-run-hint command="npx nx test main-app snapshots" />
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
export class SnapshotsComponent {
  protected fileSnapshot = `it('should match a file snapshot', () => {
  const config = {
    apiUrl: 'https://api.example.com',
    retries: 3,
    timeout: 5000,
    features: ['auth', 'logging', 'cache'],
  };

  // First run: creates __snapshots__/snapshots.spec.ts.snap
  // Next runs: compares against stored snapshot
  expect(config).toMatchSnapshot();
});`;

  protected inlineSnapshot = `it('should match an inline snapshot', () => {
  const greeting = formatGreeting('Alice', 'morning');

  // Vitest fills in the snapshot automatically:
  expect(greeting).toMatchInlineSnapshot(
    \`"Good morning, Alice!"\`
  );
});

it('should snapshot an error message', () => {
  const error = new Error('User not found');

  expect(error.message).toMatchInlineSnapshot(
    \`"User not found"\`
  );
});`;

  protected objectSnapshot = `it('should snapshot a user object', () => {
  const user = createUser('Bob', 'admin');

  expect(user).toMatchSnapshot({
    // Use asymmetric matchers for dynamic values
    id: expect.any(String),
    createdAt: expect.any(Date),
  });
});

// The snapshot file will contain:
// exports['should snapshot a user object 1'] = \`
// {
//   "id": Any<String>,
//   "createdAt": Any<Date>,
//   "name": "Bob",
//   "role": "admin"
// }
// \`;`;

  protected updateSnapshot = `# Update all outdated snapshots
npx nx test main-app -u

# Update interactively in watch mode
# Press 'u' when prompted in the terminal`;
}
