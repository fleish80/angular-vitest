import { page, userEvent } from 'vitest/browser';

describe('Browser Interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should handle click events', async () => {
    document.body.innerHTML = `<button id="counter">Clicks: 0</button>`;

    let count = 0;
    const btn = document.getElementById('counter') as HTMLButtonElement;
    btn.addEventListener('click', () => {
      count++;
      btn.textContent = `Clicks: ${count}`;
    });

    const button = page.getByRole('button');
    await userEvent.click(button);
    await expect.element(button).toHaveTextContent('Clicks: 1');

    await userEvent.click(button);
    await expect.element(button).toHaveTextContent('Clicks: 2');
  });

  it('should type in an input', async () => {
    document.body.innerHTML = `<input type="text" placeholder="Search..." />`;

    const input = page.getByPlaceholder('Search...');

    await userEvent.fill(input, 'Vitest');
    await expect.element(input).toHaveValue('Vitest');

    await userEvent.clear(input);
    await expect.element(input).toHaveValue('');

    await userEvent.fill(input, 'Angular');
    await expect.element(input).toHaveValue('Angular');
  });

  it('should handle keyboard events', async () => {
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
  });

  it('should handle hover events', async () => {
    document.body.innerHTML = `
      <div id="trigger" style="padding: 10px; cursor: pointer;">Hover me</div>
      <div id="tooltip" style="display: none;">Tooltip content</div>
    `;

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
  });

  it('should handle checkbox interactions', async () => {
    document.body.innerHTML = `
      <label>
        <input type="checkbox" id="agree" />
        I agree to the terms
      </label>
    `;

    const checkbox = page.getByRole('checkbox');
    await expect.element(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect.element(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    await expect.element(checkbox).not.toBeChecked();
  });
});
