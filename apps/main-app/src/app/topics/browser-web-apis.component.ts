import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-web-apis',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Browser Mode: Web APIs</h2>
    <p class="topic-subtitle">
      Browser mode gives you the real browser runtime — matchMedia,
      IntersectionObserver, ResizeObserver, requestAnimationFrame, Clipboard,
      and Web Storage all work exactly as they do in production.
    </p>

    <div class="topic-section">
      <h3>matchMedia</h3>
      <p>
        Media queries return real results based on the actual browser viewport.
        In jsdom, <code>matchMedia</code> is either missing or returns a stub.
      </p>
      <app-code-block [code]="matchMedia" />
    </div>

    <div class="topic-section">
      <h3>IntersectionObserver</h3>
      <p>
        Observe element visibility as the browser calculates it — no mocks needed.
        The callback fires with real <code>IntersectionObserverEntry</code> objects.
      </p>
      <app-code-block [code]="intersectionObserver" />
    </div>

    <div class="topic-section">
      <h3>ResizeObserver</h3>
      <p>
        Detect element resize with the native API. Resize an element in the test
        and assert that the observer fires with updated dimensions.
      </p>
      <app-code-block [code]="resizeObserver" />
    </div>

    <div class="topic-section">
      <h3>requestAnimationFrame</h3>
      <p>
        The animation frame callback fires with a real high-resolution timestamp,
        unlike jsdom where <code>requestAnimationFrame</code> may not execute at all.
      </p>
      <app-code-block [code]="raf" />
    </div>

    <div class="topic-section">
      <h3>Clipboard API</h3>
      <p>
        <code>navigator.clipboard</code> is fully available with
        <code>writeText</code> and <code>readText</code>.
      </p>
      <app-code-block [code]="clipboard" />
    </div>

    <div class="topic-section">
      <h3>Web Storage</h3>
      <p>
        <code>localStorage</code> and <code>sessionStorage</code> work as expected —
        set, get, and remove items with the real Storage API.
      </p>
      <app-code-block [code]="webStorage" />
    </div>

    <div class="note-box">
      <strong>Why this matters</strong>
      Components that rely on responsive breakpoints, lazy loading (IntersectionObserver),
      container queries (ResizeObserver), or animations need these APIs to behave
      realistically. Browser mode eliminates an entire class of "works in the app,
      fails in the test" problems.
    </div>

    <app-run-hint command="npm run test:browser web-apis" />
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
export class BrowserWebApisComponent {
  protected matchMedia = `it('should support matchMedia queries', () => {
  const mql = window.matchMedia('(min-width: 100px)');
  expect(mql).toBeDefined();
  expect(mql.matches).toBe(true);
  expect(typeof mql.addEventListener).toBe('function');
});

it('should report screen dimensions', () => {
  expect(window.innerWidth).toBeGreaterThan(0);
  expect(window.innerHeight).toBeGreaterThan(0);
  expect(screen.width).toBeGreaterThan(0);
  expect(screen.height).toBeGreaterThan(0);
});`;

  protected intersectionObserver = `it('should observe an element and fire callback', async () => {
  document.body.innerHTML =
    \`<div id="target" style="height: 50px;">Visible</div>\`;

  const target = document.getElementById('target');
  if (!target) throw new Error('target not found');
  const entries: IntersectionObserverEntry[] = [];

  const observer = new IntersectionObserver((e) => {
    entries.push(...e);
  });

  observer.observe(target);

  await new Promise((r) => setTimeout(r, 200));

  expect(entries.length).toBeGreaterThan(0);
  expect(entries[0].target).toBe(target);
  expect(entries[0].isIntersecting).toBe(true);

  observer.disconnect();
});`;

  protected resizeObserver = `it('should detect element resize', async () => {
  document.body.innerHTML =
    \`<div id="box" style="width: 100px; height: 100px;">Box</div>\`;

  const box = document.getElementById('box');
  if (!box) throw new Error('box not found');
  const entries: ResizeObserverEntry[] = [];

  const observer = new ResizeObserver((e) => {
    entries.push(...e);
  });

  observer.observe(box);
  await new Promise((r) => setTimeout(r, 200));

  expect(entries.length).toBeGreaterThan(0);
  expect(entries[0].target).toBe(box);
  expect(entries[0].contentRect.width).toBe(100);

  box.style.width = '200px';
  await new Promise((r) => setTimeout(r, 200));

  const lastEntry = entries[entries.length - 1];
  expect(lastEntry.contentRect.width).toBe(200);

  observer.disconnect();
});`;

  protected raf = `it('should execute requestAnimationFrame callback', async () => {
  const callback = vi.fn();

  requestAnimationFrame(callback);

  await new Promise((r) => setTimeout(r, 50));

  expect(callback).toHaveBeenCalledOnce();
  expect(callback.mock.calls[0][0]).toBeGreaterThan(0);
});`;

  protected clipboard = `it('should have navigator.clipboard defined', () => {
  expect(navigator.clipboard).toBeDefined();
  expect(typeof navigator.clipboard.writeText).toBe('function');
  expect(typeof navigator.clipboard.readText).toBe('function');
});`;

  protected webStorage = `it('should use localStorage', () => {
  localStorage.setItem('test-key', 'test-value');
  expect(localStorage.getItem('test-key')).toBe('test-value');
  localStorage.removeItem('test-key');
  expect(localStorage.getItem('test-key')).toBeNull();
});

it('should use sessionStorage', () => {
  sessionStorage.setItem('session-key', '42');
  expect(sessionStorage.getItem('session-key')).toBe('42');
  sessionStorage.removeItem('session-key');
});`;
}
