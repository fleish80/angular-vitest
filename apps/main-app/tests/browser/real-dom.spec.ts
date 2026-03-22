import { page } from 'vitest/browser';
import { expect, it, describe, beforeEach } from 'vitest';

describe('Real DOM — Computed Styles', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should read computed styles from CSS', async () => {
    const style = document.createElement('style');
    style.textContent = `.alert { color: red; font-weight: bold; }`;
    document.head.appendChild(style);

    document.body.innerHTML = `<div class="alert">Warning!</div>`;

    const el = document.querySelector('.alert')!;
    const computed = getComputedStyle(el);

    expect(computed.color).toBe('rgb(255, 0, 0)');
    expect(computed.fontWeight).toBe('700');

    style.remove();
  });

  it('should read display property', async () => {
    document.body.innerHTML = `
      <div id="flex-box" style="display: flex; gap: 8px;">
        <span>A</span><span>B</span>
      </div>
    `;

    const el = document.getElementById('flex-box')!;
    expect(getComputedStyle(el).display).toBe('flex');
  });
});

describe('Real DOM — Element Dimensions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should measure element size with getBoundingClientRect', async () => {
    document.body.innerHTML = `
      <div id="box" style="width: 200px; height: 100px;">Content</div>
    `;

    const el = document.getElementById('box')!;
    const rect = el.getBoundingClientRect();

    expect(rect.width).toBe(200);
    expect(rect.height).toBe(100);
    expect(rect.top).toBeGreaterThanOrEqual(0);
    expect(rect.left).toBeGreaterThanOrEqual(0);
  });

  it('should measure offset dimensions', async () => {
    document.body.innerHTML = `
      <div id="padded" style="width: 100px; height: 50px; padding: 10px; border: 2px solid black;">
        Padded
      </div>
    `;

    const el = document.getElementById('padded')! as HTMLElement;

    expect(el.offsetWidth).toBe(124);
    expect(el.offsetHeight).toBe(74);
  });
});

describe('Real DOM — Visibility', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should detect visible elements', async () => {
    document.body.innerHTML = `<div>I am visible</div>`;

    const el = page.getByText('I am visible');
    await expect.element(el).toBeVisible();
  });

  it('should detect hidden elements (display: none)', async () => {
    document.body.innerHTML = `<div style="display: none">I am hidden</div>`;

    const el = page.getByText('I am hidden');
    await expect.element(el).not.toBeVisible();
  });

  it('should detect hidden elements (visibility: hidden)', async () => {
    document.body.innerHTML = `<div style="visibility: hidden">I am invisible</div>`;

    const el = page.getByText('I am invisible');
    await expect.element(el).not.toBeVisible();
  });
});

describe('Real DOM — Scroll', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should handle scrollTo', async () => {
    document.body.innerHTML = `
      <div id="scroller" style="height: 100px; overflow: auto;">
        <div style="height: 1000px;">Tall content</div>
      </div>
    `;

    const scroller = document.getElementById('scroller')!;
    expect(scroller.scrollTop).toBe(0);

    scroller.scrollTop = 500;
    expect(scroller.scrollTop).toBe(500);
  });
});

describe('Real DOM — Canvas', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should draw on canvas and read pixels', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    expect(ctx).not.toBeNull();

    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 50, 50);

    const pixel = ctx.getImageData(25, 25, 1, 1).data;
    expect(pixel[0]).toBe(255);
    expect(pixel[1]).toBe(0);
    expect(pixel[2]).toBe(0);
    expect(pixel[3]).toBe(255);
  });
});
