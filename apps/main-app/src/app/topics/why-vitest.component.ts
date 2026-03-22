import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-why-vitest',
  imports: [MatCardModule, MatIconModule, CodeBlockComponent],
  template: `
    <h2 class="topic-header">Why Vitest?</h2>
    <p class="topic-subtitle">
      Angular officially adopted Vitest as its recommended test runner.
      Here's why the Angular team made the switch.
    </p>

    <div class="topic-section">
      <h3>Karma is deprecated</h3>
      <p>
        Karma was the default Angular test runner for over a decade. In 2023, the Karma project
        was officially deprecated. The Angular team evaluated alternatives and chose Vitest
        as the path forward.
      </p>
    </div>

    <div class="topic-section">
      <h3>Vite-native architecture</h3>
      <p>
        Vitest reuses Vite's transformation pipeline. Since Angular already uses Vite for
        development and builds, tests share the same config — no separate Webpack/Karma setup.
        This means your test environment matches your dev environment exactly.
      </p>
      <app-code-block
        [code]="singleConfig"
        filename="vite.config.mts"
        title="One config for build + test" />
    </div>

    <div class="topic-section">
      <h3>Key advantages over Karma</h3>
      <div class="advantage-grid">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>speed</mat-icon>
            <mat-card-title>Instant startup</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>No bundling needed before running tests. Vite serves files on-demand via ESM.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>refresh</mat-icon>
            <mat-card-title>Smart watch mode</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Only re-runs affected tests when files change, using Vite's module graph.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>api</mat-icon>
            <mat-card-title>Modern API</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Built-in mocking, snapshots, coverage, type testing — no extra packages needed.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>web</mat-icon>
            <mat-card-title>Browser mode</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Run tests in a real browser when needed, while keeping jsdom as the fast default.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>group_work</mat-icon>
            <mat-card-title>Concurrent tests</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Run tests in parallel across worker threads, utilizing all CPU cores.</p>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-icon matCardAvatar>dashboard</mat-icon>
            <mat-card-title>Beautiful UI</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Interactive browser-based test dashboard for exploring and debugging results.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <div class="note-box">
      <strong>Angular + Vitest integration</strong>
      The &#64;analogjs/vitest-angular package bridges Angular's TestBed with Vitest.
      It handles zone.js setup, component compilation, and snapshot serialization.
    </div>
  `,
  styles: `
    .advantage-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    mat-card-header mat-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--mat-sys-primary);
    }
  `,
})
export class WhyVitestComponent {
  protected singleConfig = `import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],

  // Test configuration lives alongside build config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
  },
});`;
}
