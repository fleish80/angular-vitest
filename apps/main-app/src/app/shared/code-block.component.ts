import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-code-block',
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="code-block">
      @if (filename()) {
        <div class="code-filename">
          <mat-icon class="file-icon">description</mat-icon>
          {{ filename() }}
        </div>
      }
      @if (title()) {
        <div class="code-title">{{ title() }}</div>
      }
      <pre><code>{{ code() }}</code></pre>
    </div>
  `,
  styles: `
    .code-block {
      margin-bottom: 20px;
      border-radius: 12px;
      overflow: hidden;
      background-color: var(--mat-sys-surface-container-highest);
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .code-filename {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 0.8rem;
      font-weight: 500;
      font-family: 'Roboto Mono', monospace;
      color: var(--mat-sys-on-surface-variant);
      background-color: var(--mat-sys-surface-container);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .file-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .code-title {
      padding: 10px 16px 0;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mat-sys-primary);
    }

    pre {
      margin: 0;
      padding: 16px;
      overflow-x: auto;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.85rem;
      line-height: 1.6;
      color: var(--mat-sys-on-surface);
    }

    code {
      white-space: pre;
    }
  `,
})
export class CodeBlockComponent {
  code = input.required<string>();
  filename = input<string>();
  title = input<string>();
}
