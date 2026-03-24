import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-locators',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Browser Mode: Locators</h2>
    <p class="topic-subtitle">
      Vitest browser mode includes a built-in locator API inspired by Testing Library
      and Playwright. Find elements by role, text, label, or test ID.
    </p>

    <div class="topic-section">
      <h3>The page object</h3>
      <p>
        Import <code>page</code> from <code>&#64;vitest/browser/context</code>
        to access the locator API. Each locator returns an element handle that
        supports assertions and interactions.
      </p>
      <app-code-block [code]="pageImport" />
    </div>

    <div class="topic-section">
      <h3>getByRole</h3>
      <p>
        The preferred locator — finds elements by their ARIA role.
        Encourages accessible markup.
      </p>
      <app-code-block [code]="byRole" />
    </div>

    <div class="topic-section">
      <h3>getByText</h3>
      <p>Find elements by their visible text content.</p>
      <app-code-block [code]="byText" />
    </div>

    <div class="topic-section">
      <h3>getByTestId</h3>
      <p>Find elements by <code>data-testid</code> attribute — a reliable escape hatch.</p>
      <app-code-block [code]="byTestId" />
    </div>

    <div class="topic-section">
      <h3>getByLabelText & getByPlaceholder</h3>
      <p>Find form elements by their associated label text or placeholder.</p>
      <app-code-block [code]="byLabel" />
    </div>

    <div class="topic-section">
      <h3>Chaining locators</h3>
      <p>Narrow down results by chaining locators together.</p>
      <app-code-block [code]="chaining" />
    </div>

    <div class="note-box">
      <strong>Locator priority</strong>
      Prefer getByRole > getByLabelText > getByText > getByTestId.
      This order encourages accessible HTML and tests that match how real users
      interact with your app.
    </div>

    <app-run-hint command="npm run test:browser locators" />
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
export class BrowserLocatorsComponent {
  protected pageImport = `import { page } from 'vitest/browser';
import { expect } from 'vitest';

// All locators are available on the page object:
// page.getByRole()
// page.getByText()
// page.getByTestId()
// page.getByLabelText()
// page.getByPlaceholder()
// page.getByAltText()
// page.getByTitle()`;

  protected byRole = `it('should find elements by role', async () => {
  document.body.innerHTML = \`
    <button>Submit</button>
    <button>Cancel</button>
    <a href="/home">Go Home</a>
  \`;

  const submitBtn = page.getByRole('button', { name: 'Submit' });
  await expect.element(submitBtn).toBeVisible();

  const cancelBtn = page.getByRole('button', { name: 'Cancel' });
  await expect.element(cancelBtn).toBeVisible();

  const homeLink = page.getByRole('link', { name: 'Go Home' });
  await expect.element(homeLink).toBeVisible();
});`;

  protected byText = `it('should find elements by text', async () => {
  document.body.innerHTML = \`
    <p>Welcome to Vitest Browser Mode</p>
    <span>Version 4.0</span>
  \`;

  const welcome = page.getByText('Welcome to Vitest Browser Mode');
  await expect.element(welcome).toBeVisible();

  const version = page.getByText(/Version \\d/);
  await expect.element(version).toBeVisible();
});`;

  protected byTestId = `it('should find elements by test id', async () => {
  document.body.innerHTML = \`
    <div data-testid="user-card">
      <span data-testid="user-name">Alice</span>
      <span data-testid="user-email">alice@test.com</span>
    </div>
  \`;

  const card = page.getByTestId('user-card');
  await expect.element(card).toBeVisible();

  const name = page.getByTestId('user-name');
  await expect.element(name).toHaveTextContent('Alice');

  const email = page.getByTestId('user-email');
  await expect.element(email).toHaveTextContent('alice@test.com');
});`;

  protected byLabel = `it('should find form elements by label', async () => {
  document.body.innerHTML = \`
    <label for="email-input">Email</label>
    <input id="email-input" type="email" placeholder="you@example.com" />
  \`;

  const emailInput = page.getByLabelText('Email');
  await expect.element(emailInput).toBeVisible();

  const byPlaceholder = page.getByPlaceholder('you@example.com');
  await expect.element(byPlaceholder).toBeVisible();
});`;

  protected chaining = `it('should chain locators for precision', async () => {
  document.body.innerHTML = \`
    <nav data-testid="sidebar">
      <a href="/home">Home</a>
      <a href="/about">About</a>
    </nav>
    <main data-testid="content">
      <a href="/home">Home</a>
      <p>Main content</p>
    </main>
  \`;

  const sidebarHome = page
    .getByTestId('sidebar')
    .getByRole('link', { name: 'Home' });

  await expect.element(sidebarHome).toBeVisible();
});`;
}
