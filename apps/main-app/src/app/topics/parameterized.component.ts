import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-parameterized',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Parameterized Tests</h2>
    <p class="topic-subtitle">
      Run the same test with different inputs using <code>it.each</code> and <code>describe.each</code>.
      Write once, test many cases.
    </p>

    <div class="topic-section">
      <h3>it.each with arrays</h3>
      <p>
        Pass an array of argument arrays. Each entry runs the test once with those arguments.
      </p>
      <app-code-block [code]="arrayEach" />
    </div>

    <div class="topic-section">
      <h3>it.each with objects</h3>
      <p>
        Use an array of objects for more readable parameterized tests.
      </p>
      <app-code-block [code]="objectEach" />
    </div>

    <div class="topic-section">
      <h3>Tagged template literal syntax</h3>
      <p>
        For a table-like format, use template literals. Great for readability in presentations.
      </p>
      <app-code-block [code]="templateEach" />
    </div>

    <div class="topic-section">
      <h3>describe.each</h3>
      <p>
        Parameterize an entire describe block, not just a single test.
      </p>
      <app-code-block [code]="describeEach" />
    </div>

    <app-run-hint command="npx nx test main-app parameterized" />
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
export class ParameterizedComponent {
  protected arrayEach = `it.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 2, 4],
  [5, 5, 10],
  [0, 0, 0],
])('add(%i, %i) should return %i', (a, b, expected) => {
  expect(a + b).toBe(expected);
});`;

  protected objectEach = `it.each([
  { input: '',        expected: true,  desc: 'empty string' },
  { input: '  ',      expected: true,  desc: 'whitespace' },
  { input: 'hello',   expected: false, desc: 'non-empty string' },
  { input: undefined, expected: true,  desc: 'undefined' },
  { input: null,      expected: true,  desc: 'null' },
])('isBlank($desc) → $expected', ({ input, expected }) => {
  expect(isBlank(input)).toBe(expected);
});`;

  protected templateEach = `// Table format with tagged template literal
it.each\`
  status   | emoji    | label
  \${'ok'}   | \${'✅'}  | \${'success'}
  \${'warn'} | \${'⚠️'}  | \${'warning'}
  \${'err'}  | \${'❌'}  | \${'error'}
\`('formatStatus($status) → $emoji $label', ({ status, emoji, label }) => {
  const result = formatStatus(status);
  expect(result).toContain(emoji);
  expect(result).toContain(label);
});`;

  protected describeEach = `describe.each([
  { role: 'admin',  canEdit: true,  canDelete: true },
  { role: 'editor', canEdit: true,  canDelete: false },
  { role: 'viewer', canEdit: false, canDelete: false },
])('permissions for $role', ({ role, canEdit, canDelete }) => {

  it(\`canEdit should be \${canEdit}\`, () => {
    expect(getPermissions(role).canEdit).toBe(canEdit);
  });

  it(\`canDelete should be \${canDelete}\`, () => {
    expect(getPermissions(role).canDelete).toBe(canDelete);
  });
});`;
}
