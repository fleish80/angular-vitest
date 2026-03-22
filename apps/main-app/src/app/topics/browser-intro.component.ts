import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-intro',
  imports: [MatCardModule, MatIconModule, CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Browser Mode: Introduction</h2>
    <p class="topic-subtitle">
      Vitest can run your tests in a real browser instead of jsdom.
      This eliminates an entire class of false positives and negatives.
    </p>

    <div class="topic-section">
      <h3>The problem with jsdom</h3>
      <p>
        jsdom is fast because it simulates the DOM in Node.js. But it's not a real browser.
        Many Web APIs are missing or behave differently:
      </p>
      <div class="limitation-grid">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>css</mat-icon>
            <mat-card-title>No CSS engine</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>getComputedStyle() returns empty values. No layout calculation, no media queries.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>mouse</mat-icon>
            <mat-card-title>Simulated events</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Events don't bubble or behave like real browser events. No real focus management.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>view_in_ar</mat-icon>
            <mat-card-title>No layout</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>getBoundingClientRect() returns zeros. No scroll, no intersection, no resize.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>extension_off</mat-icon>
            <mat-card-title>Missing APIs</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>No Canvas, no Web Workers, no IntersectionObserver, no matchMedia.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <div class="topic-section">
      <h3>How browser mode works</h3>
      <p>
        Vitest browser mode uses a real browser (via Playwright or WebDriverIO) to run tests:
      </p>
      <app-code-block [code]="architecture" title="Architecture" />
    </div>

    <div class="topic-section">
      <h3>When to use browser mode</h3>
      <div class="comparison-grid">
        <div>
          <h4>Use jsdom (default)</h4>
          <app-code-block [code]="useJsdom" />
        </div>
        <div>
          <h4>Use browser mode</h4>
          <app-code-block [code]="useBrowser" />
        </div>
      </div>
    </div>

    <div class="note-box">
      <strong>Performance trade-off</strong>
      Browser mode is slower than jsdom because it starts a real browser.
      Use it for tests that genuinely need browser fidelity — not for pure logic tests.
      You can run both modes in the same project via separate Vitest workspace entries.
    </div>

    <app-run-hint command="npm run test:browser" />
  `,
  styles: `
    .limitation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    mat-card-header mat-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--mat-sys-error);
    }
  `,
})
export class BrowserIntroComponent {
  protected architecture = `┌─────────────────────────────────────────────┐
│                 Vitest                      │
│  ┌───────────┐    ┌──────────────────────┐  │
│  │  Test      │    │   Vite Dev Server    │  │
│  │  Runner    │◄──►│   (transforms code)  │  │
│  └─────┬─────┘    └──────────┬───────────┘  │
│        │                     │              │
│        │    WebSocket        │  HTTP/ESM    │
│        │                     │              │
│  ┌─────▼─────────────────────▼───────────┐  │
│  │        Real Browser (Chromium)         │  │
│  │  - Real DOM          - Real events     │  │
│  │  - Real CSS engine   - Real layout     │  │
│  │  - Real Web APIs     - Real rendering  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘`;

  protected useJsdom = `• Unit tests for pure logic
• Simple component rendering
• Service / store tests
• Mock-heavy integration tests
• Fast CI pipelines

→ Fast, lightweight, sufficient
  for most Angular testing`;

  protected useBrowser = `• CSS / computed style testing
• Layout and positioning
• Scroll behavior
• Focus management
• Canvas / WebGL
• Real event bubbling
• Cross-browser verification
• Accessibility with real a11y tree

→ Real browser fidelity
  when jsdom falls short`;
}
