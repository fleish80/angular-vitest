import { page, userEvent } from 'vitest/browser';

describe('Polling & Retries', () => {
  describe('expect.poll', () => {
    it('should retry until value matches', async () => {
      document.body.innerHTML = `
        <button id="start">Start</button>
        <span id="status">idle</span>
      `;

      const statusEl = document.getElementById('status') as HTMLSpanElement;
      const startBtn = document.getElementById('start') as HTMLButtonElement;
      startBtn.addEventListener('click', () => {
        setTimeout(() => {
          statusEl.textContent = 'done';
        }, 200);
      });

      await userEvent.click(page.getByRole('button', { name: 'Start' }));

      await expect.poll(() => statusEl.textContent).toBe('done');
    });

    it('should retry with async function', async () => {
      document.body.innerHTML = `
        <ul id="list"></ul>
      `;

      const list = document.getElementById('list') as HTMLUListElement;
      setTimeout(() => {
        list.innerHTML = '<li>Item 1</li><li>Item 2</li><li>Item 3</li>';
      }, 150);

      await expect.poll(() => {
        return list.querySelectorAll('li').length;
      }).toBe(3);
    });

    it('should support custom timeout and interval', async () => {
      let counter = 0;
      const interval = setInterval(() => counter++, 50);

      await expect.poll(() => counter, {
        timeout: 2000,
        interval: 100,
      }).toBeGreaterThanOrEqual(5);

      clearInterval(interval);
    });
  });

  describe('expect.poll — multiple assertions', () => {
    it('should retry until all conditions are met', async () => {
      document.body.innerHTML = `
        <div id="container"></div>
      `;

      const container = document.getElementById('container') as HTMLDivElement;

      setTimeout(() => {
        container.innerHTML = `
          <h3>Angular Testing</h3>
          <p>A guide to testing Angular apps</p>
          <span class="badge">new</span>
        `;
      }, 200);

      await expect.poll(() => container.querySelector('h3')?.textContent).toBe('Angular Testing');
      await expect.poll(() => container.querySelector('.badge')?.textContent).toBe('new');
    });
  });

  describe('expect.element (locator auto-retry)', () => {
    it('should auto-retry assertions on locators', async () => {
      document.body.innerHTML = `
        <button id="toggle">Show</button>
        <div id="content" style="display:none">
          <h3>Revealed Content</h3>
        </div>
      `;

      const toggleBtn = document.getElementById('toggle') as HTMLButtonElement;
      const content = document.getElementById('content') as HTMLDivElement;
      toggleBtn.addEventListener('click', () => {
        setTimeout(() => {
          content.style.display = 'block';
        }, 200);
      });

      await userEvent.click(page.getByRole('button', { name: 'Show' }));

      const heading = page.getByRole('heading', { name: 'Revealed Content' });
      await expect.element(heading).toBeVisible();
    });

    it('should retry toHaveTextContent', async () => {
      document.body.innerHTML = `<span id="counter">0</span>`;
      const span = document.getElementById('counter') as HTMLSpanElement;

      let count = 0;
      const interval = setInterval(() => {
        count++;
        span.textContent = String(count);
        if (count >= 5) clearInterval(interval);
      }, 80);

      await expect.element(page.getByText('5')).toBeVisible();
    });
  });
});
