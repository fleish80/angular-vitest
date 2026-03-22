import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-dom',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Browser Mode: Real DOM</h2>
    <p class="topic-subtitle">
      Test things that are impossible in jsdom: computed styles, layout,
      scroll positions, and native Web APIs.
    </p>

    <div class="topic-section">
      <h3>Computed styles</h3>
      <p>
        In jsdom, <code>getComputedStyle()</code> returns empty strings.
        In a real browser, you get the actual rendered values.
      </p>
      <app-code-block [code]="computedStyles" />
    </div>

    <div class="topic-section">
      <h3>Element dimensions & position</h3>
      <p>
        <code>getBoundingClientRect()</code> returns real measurements in browser mode.
        In jsdom, all values are zero.
      </p>
      <app-code-block [code]="dimensions" />
    </div>

    <div class="topic-section">
      <h3>Visibility testing</h3>
      <p>
        Test whether elements are actually visible to the user — considering
        display, visibility, opacity, and overflow.
      </p>
      <app-code-block [code]="visibility" />
    </div>

    <div class="topic-section">
      <h3>Focus management</h3>
      <p>
        Test real focus behavior, tab order, and focus trapping.
      </p>
      <app-code-block [code]="focus" />
    </div>

    <div class="topic-section">
      <h3>Scroll behavior</h3>
      <app-code-block [code]="scroll" />
    </div>

    <div class="topic-section">
      <h3>Canvas API</h3>
      <p>
        jsdom has no Canvas implementation. Browser mode gives you the real thing.
      </p>
      <app-code-block [code]="canvas" />
    </div>

    <div class="note-box">
      <strong>Real-world impact</strong>
      These are not edge cases. Any component that relies on CSS, layout, or Web APIs
      needs browser mode for reliable testing. This includes modals, tooltips, virtual scrollers,
      responsive components, and charts.
    </div>

    <app-run-hint command="npm run test:browser -- --testFiles=real-dom" />
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
export class BrowserDomComponent {
  protected computedStyles = `it('should read computed styles', async () => {
  document.body.innerHTML = \`
    <style>
      .alert { color: red; font-size: 18px; display: flex; }
    </style>
    <div class="alert">Warning!</div>
  \`;

  const el = document.querySelector('.alert')!;
  const styles = getComputedStyle(el);

  // In browser mode: real values
  expect(styles.color).toBe('rgb(255, 0, 0)');
  expect(styles.fontSize).toBe('18px');
  expect(styles.display).toBe('flex');

  // In jsdom: these would all be empty strings!
});`;

  protected dimensions = `it('should measure element dimensions', async () => {
  document.body.innerHTML = \`
    <div style="width: 200px; height: 100px; padding: 10px;">
      Content
    </div>
  \`;

  const el = document.querySelector('div')!;
  const rect = el.getBoundingClientRect();

  // In browser mode: real measurements
  expect(rect.width).toBe(220);   // 200 + 10*2 padding
  expect(rect.height).toBe(120);  // 100 + 10*2 padding
  expect(rect.top).toBeGreaterThanOrEqual(0);

  // In jsdom: all zeros
  // { width: 0, height: 0, top: 0, left: 0 }
});`;

  protected visibility = `it('should detect element visibility', async () => {
  document.body.innerHTML = \`
    <div id="visible">I'm visible</div>
    <div id="hidden" style="display: none">I'm hidden</div>
    <div id="transparent" style="opacity: 0">I'm transparent</div>
    <div style="overflow: hidden; width: 0; height: 0">
      <div id="clipped">I'm clipped</div>
    </div>
  \`;

  const visible = page.getByText("I'm visible");
  const hidden = page.getByText("I'm hidden");

  await expect.element(visible).toBeVisible();
  await expect.element(hidden).not.toBeVisible();

  // These nuances only work in a real browser
});`;

  protected focus = `it('should manage focus correctly', async () => {
  document.body.innerHTML = \`
    <input id="first" type="text" />
    <input id="second" type="text" />
    <button id="submit">Submit</button>
  \`;

  const first = page.getByRole('textbox').first();

  await userEvent.click(first);

  // Real focus — document.activeElement works correctly
  expect(document.activeElement?.id).toBe('first');

  // Tab to next element
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement?.id).toBe('second');

  await userEvent.keyboard('{Tab}');
  expect(document.activeElement?.id).toBe('submit');
});`;

  protected scroll = `it('should handle scroll', async () => {
  document.body.innerHTML = \`
    <div id="scroller" style="height:100px; overflow:auto">
      <div style="height: 1000px">Tall content</div>
    </div>
  \`;

  const scroller = document.getElementById('scroller')!;

  expect(scroller.scrollTop).toBe(0);

  scroller.scrollTo({ top: 500 });

  // In browser mode: scrollTop updates
  expect(scroller.scrollTop).toBe(500);

  // In jsdom: scrollTo is a no-op,
  // scrollTop stays 0
});`;

  protected canvas = `it('should use Canvas API', async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;

  // Real canvas drawing
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);

  // Read pixel data
  const pixel = ctx.getImageData(50, 50, 1, 1).data;
  expect(pixel[0]).toBe(255); // Red
  expect(pixel[1]).toBe(0);   // Green
  expect(pixel[2]).toBe(0);   // Blue

  // In jsdom: getContext('2d') returns null!
});`;
}
