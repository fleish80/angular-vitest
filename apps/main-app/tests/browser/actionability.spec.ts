import { describe, it, expect } from 'vitest';
import { page, userEvent } from 'vitest/browser';

describe('Actionability Checks', () => {
  it('should click a visible button', async () => {
    document.body.innerHTML = `
      <div style="padding: 20px;">
        <button id="action">Click me</button>
        <span id="result"></span>
      </div>
    `;

    document.getElementById('action')!.addEventListener('click', () => {
      document.getElementById('result')!.textContent = 'clicked';
    });

    const btn = page.getByRole('button', { name: 'Click me' });
    await userEvent.click(btn);

    await expect.element(page.getByText('clicked')).toBeVisible();
  });

  it('should detect display:none elements as not visible', async () => {
    document.body.innerHTML = `
      <button style="display: none">Hidden Button</button>
    `;

    const btn = page.getByRole('button', { name: 'Hidden Button' });
    await expect.element(btn).not.toBeVisible();
  });

  it('should detect visibility:hidden elements as not visible', async () => {
    document.body.innerHTML = `
      <button style="visibility: hidden">Invisible Button</button>
    `;

    const btn = page.getByRole('button', { name: 'Invisible Button' });
    await expect.element(btn).not.toBeVisible();
  });

  it('should handle elements becoming visible after animation', async () => {
    document.body.innerHTML = `
      <button id="reveal">Show Panel</button>
      <div id="panel" style="display: none;">
        <button id="panel-action">Panel Action</button>
        <span id="panel-result"></span>
      </div>
    `;

    document.getElementById('reveal')!.addEventListener('click', () => {
      setTimeout(() => {
        document.getElementById('panel')!.style.display = 'block';
      }, 150);
    });

    document.getElementById('panel-action')!.addEventListener('click', () => {
      document.getElementById('panel-result')!.textContent = 'panel clicked';
    });

    await userEvent.click(page.getByRole('button', { name: 'Show Panel' }));

    const panelBtn = page.getByRole('button', { name: 'Panel Action' });
    await expect.element(panelBtn).toBeVisible();
    await userEvent.click(panelBtn);

    await expect.element(page.getByText('panel clicked')).toBeVisible();
  });

  it('should verify elements are enabled before interaction', async () => {
    document.body.innerHTML = `
      <button disabled>Disabled</button>
      <button>Enabled</button>
    `;

    const enabled = page.getByRole('button', { name: 'Enabled' });
    const disabled = page.getByRole('button', { name: 'Disabled' });

    await expect.element(enabled).toBeEnabled();
    await expect.element(disabled).toBeDisabled();
  });
});
