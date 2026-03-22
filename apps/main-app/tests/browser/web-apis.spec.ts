import { page } from 'vitest/browser';
import { expect, it, describe, beforeEach, vi } from 'vitest';

describe('Web APIs — matchMedia', () => {
  it('should support matchMedia queries', () => {
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
  });
});

describe('Web APIs — IntersectionObserver', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should construct an IntersectionObserver', () => {
    const callback = vi.fn();
    const observer = new IntersectionObserver(callback);

    expect(observer).toBeDefined();
    expect(typeof observer.observe).toBe('function');
    expect(typeof observer.unobserve).toBe('function');
    expect(typeof observer.disconnect).toBe('function');

    observer.disconnect();
  });

  it('should observe an element and fire callback', async () => {
    document.body.innerHTML = `<div id="target" style="height: 50px;">Visible</div>`;

    const target = document.getElementById('target')!;
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
  });
});

describe('Web APIs — ResizeObserver', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should construct a ResizeObserver', () => {
    const callback = vi.fn();
    const observer = new ResizeObserver(callback);

    expect(observer).toBeDefined();
    expect(typeof observer.observe).toBe('function');
    expect(typeof observer.disconnect).toBe('function');

    observer.disconnect();
  });

  it('should detect element resize', async () => {
    document.body.innerHTML = `<div id="box" style="width: 100px; height: 100px;">Box</div>`;

    const box = document.getElementById('box')!;
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
  });
});

describe('Web APIs — requestAnimationFrame', () => {
  it('should execute requestAnimationFrame callback', async () => {
    const callback = vi.fn();

    requestAnimationFrame(callback);

    await new Promise((r) => setTimeout(r, 50));

    expect(callback).toHaveBeenCalledOnce();
    expect(callback.mock.calls[0][0]).toBeGreaterThan(0);
  });
});

describe('Web APIs — Clipboard (if available)', () => {
  it('should have navigator.clipboard defined', () => {
    expect(navigator.clipboard).toBeDefined();
    expect(typeof navigator.clipboard.writeText).toBe('function');
    expect(typeof navigator.clipboard.readText).toBe('function');
  });
});

describe('Web APIs — Web Storage', () => {
  it('should use localStorage', () => {
    localStorage.setItem('test-key', 'test-value');
    expect(localStorage.getItem('test-key')).toBe('test-value');
    localStorage.removeItem('test-key');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('should use sessionStorage', () => {
    sessionStorage.setItem('session-key', '42');
    expect(sessionStorage.getItem('session-key')).toBe('42');
    sessionStorage.removeItem('session-key');
  });
});
