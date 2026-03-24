import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-interactions',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Browser Mode: Interactions</h2>
    <p class="topic-subtitle">
      The <code>userEvent</code> API dispatches real browser events — clicks, typing, hovering,
      keyboard shortcuts, and drag-and-drop. These are not simulated like in jsdom.
    </p>

    <div class="topic-section">
      <h3>Click interactions</h3>
      <app-code-block [code]="clickCode" />
    </div>

    <div class="topic-section">
      <h3>Typing text</h3>
      <p>
        <code>userEvent.fill()</code> sets the value directly.
        <code>userEvent.type()</code> types character by character (fires all keyboard events).
      </p>
      <app-code-block [code]="typeCode" />
    </div>

    <div class="topic-section">
      <h3>Keyboard events</h3>
      <p>Simulate keyboard input and capture key events.</p>
      <app-code-block [code]="keyboardCode" />
    </div>

    <div class="topic-section">
      <h3>Hover events</h3>
      <app-code-block [code]="hoverCode" />
    </div>

    <div class="topic-section">
      <h3>Drag and drop</h3>
      <app-code-block [code]="dragCode" />
    </div>

    <app-run-hint command="npm run test:browser interactions" />

    <div class="topic-section">
      <h3>Why real events matter</h3>
      <div class="comparison-grid">
        <div>
          <h4>jsdom (simulated)</h4>
          <app-code-block [code]="jsdomEvents" />
        </div>
        <div>
          <h4>Browser mode (real)</h4>
          <app-code-block [code]="browserEvents" />
        </div>
      </div>
    </div>
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
export class BrowserInteractionsComponent {
  protected clickCode = `import { page, userEvent } from 'vitest/browser';

it('should handle click events', async () => {
  document.body.innerHTML = \`
    <button id="counter">Clicks: 0</button>
  \`;

  let count = 0;
  const btn = document.getElementById('counter') as HTMLButtonElement;
  btn.addEventListener('click', () => {
    count++;
    btn.textContent = \`Clicks: \${count}\`;
  });

  const button = page.getByRole('button');
  await userEvent.click(button);
  await expect.element(button).toHaveTextContent('Clicks: 1');

  await userEvent.click(button);
  await expect.element(button).toHaveTextContent('Clicks: 2');
});`;

  protected typeCode = `it('should type in an input', async () => {
  document.body.innerHTML = \`<input type="text" placeholder="Search..." />\`;

  const input = page.getByPlaceholder('Search...');

  await userEvent.fill(input, 'Vitest');
  await expect.element(input).toHaveValue('Vitest');

  await userEvent.clear(input);
  await expect.element(input).toHaveValue('');

  await userEvent.fill(input, 'Angular');
  await expect.element(input).toHaveValue('Angular');
});`;

  protected keyboardCode = `it('should handle keyboard events', async () => {
  const events: string[] = [];

  document.body.innerHTML = '<input type="text" id="kb-input" />';
  const inputEl = document.getElementById('kb-input') as HTMLInputElement;

  inputEl.addEventListener('keydown', (e) => {
    events.push(e.key);
  });

  const input = page.getByRole('textbox');
  await userEvent.click(input);
  await userEvent.keyboard('abc');

  expect(events).toContain('a');
  expect(events).toContain('b');
  expect(events).toContain('c');
});`;

  protected hoverCode = `it('should handle hover events', async () => {
  document.body.innerHTML = \`
    <div id="trigger" style="padding: 10px; cursor: pointer;">Hover me</div>
    <div id="tooltip" style="display: none;">Tooltip content</div>
  \`;

  const trigger = document.getElementById('trigger') as HTMLElement;
  const tooltip = document.getElementById('tooltip') as HTMLElement;

  trigger.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block';
  });
  trigger.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  const hoverTarget = page.getByText('Hover me');
  await userEvent.hover(hoverTarget);

  await expect.element(page.getByText('Tooltip content')).toBeVisible();

  await userEvent.unhover(hoverTarget);

  await expect.element(page.getByText('Tooltip content')).not.toBeVisible();
});`;

  protected dragCode = `it('should drag and drop', async () => {
  document.body.innerHTML = \`
    <div id="draggable" draggable="true">Drag me</div>
    <div id="dropzone">Drop here</div>
  \`;

  const source = page.getByText('Drag me');
  const target = page.getByText('Drop here');

  await userEvent.dragAndDrop(source, target);
  // Real drag events: dragstart, drag, dragenter,
  //   dragover, drop, dragend
});`;

  protected jsdomEvents = `// jsdom: events are manually dispatched
element.dispatchEvent(new MouseEvent('click'));

// Problems:
// - No real event bubbling path
// - No coordinates or positions
// - No hover/focus side effects
// - No keyboard → input connection
// - fireEvent is "close enough" but
//   doesn't match real browsers`;

  protected browserEvents = `// Browser mode: real events
await userEvent.click(element);

// Real browser behavior:
// - Full event bubbling chain
// - Correct mouse coordinates
// - Real hover/focus changes
// - Keyboard events → input values
// - Matches production behavior
//   exactly`;
}
