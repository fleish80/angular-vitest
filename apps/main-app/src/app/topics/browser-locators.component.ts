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
      <p>Find form elements by their associated label or placeholder text.</p>
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

    <app-run-hint command="npm run test:browser -- --testFiles=locators" />
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

  protected byRole = `it('should find buttons by role', async () => {
  document.body.innerHTML = \`
    <button>Submit</button>
    <button>Cancel</button>
  \`;

  // Find by role + accessible name
  const submitBtn = page.getByRole('button', { name: 'Submit' });
  await expect.element(submitBtn).toBeVisible();

  // Find all buttons
  const cancelBtn = page.getByRole('button', { name: 'Cancel' });
  await expect.element(cancelBtn).toBeVisible();
});

// Common roles: button, link, heading, textbox,
//   checkbox, radio, combobox, list, listitem`;

  protected byText = `it('should find elements by text', async () => {
  document.body.innerHTML = \`
    <p>Welcome to Vitest</p>
    <span>Version 4.0</span>
  \`;

  const welcome = page.getByText('Welcome to Vitest');
  await expect.element(welcome).toBeVisible();

  // Partial match with regex
  const version = page.getByText(/Version \\d/);
  await expect.element(version).toBeVisible();
});`;

  protected byTestId = `it('should find by data-testid', async () => {
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
});`;

  protected byLabel = `it('should find form inputs', async () => {
  document.body.innerHTML = \`
    <label for="email">Email</label>
    <input id="email" type="email" placeholder="you@example.com" />

    <label>
      Password
      <input type="password" placeholder="Enter password" />
    </label>
  \`;

  // By label text (associated via for/id or wrapping)
  const email = page.getByLabelText('Email');
  await expect.element(email).toBeVisible();

  // By placeholder
  const password = page.getByPlaceholder('Enter password');
  await expect.element(password).toBeVisible();
});`;

  protected chaining = `it('should chain locators for precision', async () => {
  document.body.innerHTML = \`
    <div data-testid="sidebar">
      <a href="/home">Home</a>
    </div>
    <div data-testid="main">
      <a href="/home">Home</a>
    </div>
  \`;

  // Both sections have a "Home" link
  // Chain to find the one in sidebar
  const sidebarHome = page.getByTestId('sidebar')
    .getByRole('link', { name: 'Home' });

  await expect.element(sidebarHome).toBeVisible();
});`;
}
