import { Component, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-run-hint',
  imports: [MatIcon],
  template: `
    <div class="run-hint">
      <span class="label">{{ label() }} &rarr;</span>
      <code class="command">{{ command() }}</code>
      <button class="copy-btn" (click)="copy()" [attr.aria-label]="'Copy command'">
        <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
      </button>
    </div>
  `,
  styles: `
    .run-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      margin-top: 32px;
      font-size: 0.9rem;
      font-family: 'Roboto Mono', monospace;
    }

    .command {
      flex: 1;
      font-family: inherit;
    }

    .copy-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      padding: 4px;
      border-radius: 4px;
      transition: opacity 0.2s;
    }

    .copy-btn:hover {
      opacity: 1;
    }

    .copy-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `,
})
export class RunHintComponent {
  command = input.required<string>();
  label = input('Run it');

  protected copied = signal(false);

  protected copy() {
    navigator.clipboard.writeText(this.command());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
