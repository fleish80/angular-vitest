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

    <app-run-hint command="npm run test:browser real-dom" />
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
  protected computedStyles = `it('should read computed styles from CSS', async () => {
  const style = document.createElement('style');
  style.textContent = \`.alert { color: red; font-weight: bold; }\`;
  document.head.appendChild(style);

  document.body.innerHTML = \`<div class="alert">Warning!</div>\`;

  const el = document.querySelector('.alert')!;
  const computed = getComputedStyle(el);

  expect(computed.color).toBe('rgb(255, 0, 0)');
  expect(computed.fontWeight).toBe('700');

  style.remove();
});

it('should read display property', async () => {
  document.body.innerHTML = \`
    <div id="flex-box" style="display: flex; gap: 8px;">
      <span>A</span><span>B</span>
    </div>
  \`;

  const el = document.getElementById('flex-box')!;
  expect(getComputedStyle(el).display).toBe('flex');
});`;

  protected dimensions = `it('should measure element size with getBoundingClientRect', async () => {
  document.body.innerHTML = \`
    <div id="box" style="width: 200px; height: 100px;">Content</div>
  \`;

  const el = document.getElementById('box')!;
  const rect = el.getBoundingClientRect();

  expect(rect.width).toBe(200);
  expect(rect.height).toBe(100);
  expect(rect.top).toBeGreaterThanOrEqual(0);
  expect(rect.left).toBeGreaterThanOrEqual(0);
});

it('should measure offset dimensions', async () => {
  document.body.innerHTML = \`
    <div id="padded"
      style="width: 100px; height: 50px; padding: 10px; border: 2px solid black;">
      Padded
    </div>
  \`;

  const el = document.getElementById('padded')! as HTMLElement;

  expect(el.offsetWidth).toBe(124);   // 100 + 10*2 + 2*2
  expect(el.offsetHeight).toBe(74);   // 50 + 10*2 + 2*2
});`;

  protected visibility = `it('should detect visible elements', async () => {
  document.body.innerHTML = \`<div>I am visible</div>\`;

  const el = page.getByText('I am visible');
  await expect.element(el).toBeVisible();
});

it('should detect hidden elements (display: none)', async () => {
  document.body.innerHTML =
    \`<div style="display: none">I am hidden</div>\`;

  const el = page.getByText('I am hidden');
  await expect.element(el).not.toBeVisible();
});

it('should detect hidden elements (visibility: hidden)', async () => {
  document.body.innerHTML =
    \`<div style="visibility: hidden">I am invisible</div>\`;

  const el = page.getByText('I am invisible');
  await expect.element(el).not.toBeVisible();
});`;

  protected scroll = `it('should handle scrollTo', async () => {
  document.body.innerHTML = \`
    <div id="scroller" style="height: 100px; overflow: auto;">
      <div style="height: 1000px;">Tall content</div>
    </div>
  \`;

  const scroller = document.getElementById('scroller')!;
  expect(scroller.scrollTop).toBe(0);

  scroller.scrollTop = 500;
  expect(scroller.scrollTop).toBe(500);
});`;

  protected canvas = `it('should draw on canvas and read pixels', async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  expect(ctx).not.toBeNull();

  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(0, 0, 50, 50);

  const pixel = ctx.getImageData(25, 25, 1, 1).data;
  expect(pixel[0]).toBe(255); // Red
  expect(pixel[1]).toBe(0);   // Green
  expect(pixel[2]).toBe(0);   // Blue
  expect(pixel[3]).toBe(255); // Alpha
});`;
}
