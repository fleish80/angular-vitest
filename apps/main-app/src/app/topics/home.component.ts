import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { CodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatChipsModule, RouterModule, CodeBlockComponent],
  template: `
    <h2 class="topic-header">Angular + Vitest Showcase</h2>
    <p class="topic-subtitle">
      A hands-on tour of Vitest — Angular's official unit testing framework.
      Each topic includes live, runnable test files you can execute from the terminal.
    </p>

    <div class="hero-cards">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-icon matCardAvatar>speed</mat-icon>
          <mat-card-title>Blazing Fast</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Powered by Vite's native ESM pipeline. No bundling step — tests start in milliseconds.</p>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-icon matCardAvatar>extension</mat-icon>
          <mat-card-title>Rich API</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Built-in mocking, snapshot testing, fake timers, type testing, concurrent execution, and more.</p>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-icon matCardAvatar>web</mat-icon>
          <mat-card-title>Browser Mode</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Run tests in a real browser — real DOM, real CSS, real events. No more jsdom limitations.</p>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="topic-section">
      <h3>What's in this demo?</h3>
      <p>Navigate through the sidebar to explore each topic. Every page includes:</p>
      <ul>
        <li><strong>Explanation</strong> — what the feature is and why it matters</li>
        <li><strong>Code examples</strong> — real test code you can read and learn from</li>
        <li><strong>Runnable spec files</strong> — execute them live during your presentation</li>
      </ul>
    </div>

    <div class="topic-section">
      <h3>Running the tests</h3>
      <app-code-block
        [code]="runCommand"
        title="Unit tests (jsdom)" />
      <app-code-block
        [code]="browserCommand"
        title="Browser mode tests (real Chromium)" />
    </div>

    <div class="topic-section">
      <h3>Tech Stack</h3>
      <div class="chip-row">
        <mat-chip-set>
          <mat-chip>Angular 21</mat-chip>
          <mat-chip>Vitest 4.x</mat-chip>
          <mat-chip>Vite 7</mat-chip>
          <mat-chip>TypeScript 5.9</mat-chip>
          <mat-chip>Angular Material 3</mat-chip>
          <mat-chip>Nx 22</mat-chip>
        </mat-chip-set>
      </div>
    </div>
  `,
  styles: `
    .hero-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    mat-card-header mat-icon {
      font-size: 28px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--mat-sys-primary);
    }

    ul {
      padding-left: 24px;
      line-height: 2;
      color: var(--mat-sys-on-surface-variant);
    }

    .chip-row {
      margin-top: 8px;
    }
  `,
})
export class HomeComponent {
  protected runCommand = `# Run all unit tests
npx nx test main-app

# Run a specific test file
npx nx test main-app matchers

# Run in watch mode
npx nx test main-app --watch

# Run with Vitest UI dashboard
npx nx test main-app --watch --ui`;

  protected browserCommand = `# Run browser tests (opens real Chromium window!)
npx nx run main-app:test:browser --watch

# Run a specific browser test file
npx nx run main-app:test:browser --testFiles=locators --watch

# Run headless (for CI)
CI=true npx nx run main-app:test:browser`;
}
