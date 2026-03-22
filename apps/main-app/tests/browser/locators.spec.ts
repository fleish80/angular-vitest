import { page, userEvent } from 'vitest/browser';
import { expect, it, describe, beforeEach } from 'vitest';

describe('Browser Locators', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should find elements by role', async () => {
    document.body.innerHTML = `
      <button>Submit</button>
      <button>Cancel</button>
      <a href="/home">Go Home</a>
    `;

    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect.element(submitBtn).toBeVisible();

    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    await expect.element(cancelBtn).toBeVisible();

    const homeLink = page.getByRole('link', { name: 'Go Home' });
    await expect.element(homeLink).toBeVisible();
  });

  it('should find elements by text', async () => {
    document.body.innerHTML = `
      <p>Welcome to Vitest Browser Mode</p>
      <span>Version 4.0</span>
    `;

    const welcome = page.getByText('Welcome to Vitest Browser Mode');
    await expect.element(welcome).toBeVisible();

    const version = page.getByText(/Version \d/);
    await expect.element(version).toBeVisible();
  });

  it('should find elements by test id', async () => {
    document.body.innerHTML = `
      <div data-testid="user-card">
        <span data-testid="user-name">Alice</span>
        <span data-testid="user-email">alice@test.com</span>
      </div>
    `;

    const card = page.getByTestId('user-card');
    await expect.element(card).toBeVisible();

    const name = page.getByTestId('user-name');
    await expect.element(name).toHaveTextContent('Alice');

    const email = page.getByTestId('user-email');
    await expect.element(email).toHaveTextContent('alice@test.com');
  });

  it('should find form elements by label', async () => {
    document.body.innerHTML = `
      <label for="email-input">Email</label>
      <input id="email-input" type="email" placeholder="you@example.com" />
    `;

    const emailInput = page.getByLabelText('Email');
    await expect.element(emailInput).toBeVisible();

    const byPlaceholder = page.getByPlaceholder('you@example.com');
    await expect.element(byPlaceholder).toBeVisible();
  });

  it('should chain locators for precision', async () => {
    document.body.innerHTML = `
      <nav data-testid="sidebar">
        <a href="/home">Home</a>
        <a href="/about">About</a>
      </nav>
      <main data-testid="content">
        <a href="/home">Home</a>
        <p>Main content</p>
      </main>
    `;

    const sidebarHome = page
      .getByTestId('sidebar')
      .getByRole('link', { name: 'Home' });

    await expect.element(sidebarHome).toBeVisible();
  });
});
