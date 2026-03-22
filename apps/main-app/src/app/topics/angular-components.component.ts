import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-angular-components',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Angular Component Testing</h2>
    <p class="topic-subtitle">
      Test Angular components with TestBed — the same API you know, powered by Vitest.
      Signals, inputs, outputs, and DOM queries all work as expected.
    </p>

    <div class="topic-section">
      <h3>The component under test</h3>
      <p>A simple counter component using Angular signals.</p>
      <app-code-block [code]="counterComponent" filename="counter.component.ts" />
    </div>

    <div class="topic-section">
      <h3>Basic component test</h3>
      <p>
        Configure TestBed, create the component, and assert on the DOM.
      </p>
      <app-code-block [code]="basicTest" filename="counter.component.spec.ts" />
    </div>

    <div class="topic-section">
      <h3>Testing user interactions</h3>
      <p>
        Simulate clicks and verify the component responds correctly.
      </p>
      <app-code-block [code]="interactionTest" />
    </div>

    <div class="topic-section">
      <h3>Testing signal inputs</h3>
      <p>
        Use <code>componentRef.setInput()</code> to set signal inputs and verify rendering.
      </p>
      <app-code-block [code]="inputTest" />
    </div>

    <div class="topic-section">
      <h3>Testing outputs</h3>
      <p>
        Subscribe to outputs and verify they emit the correct values.
      </p>
      <app-code-block [code]="outputTest" />
    </div>

    <div class="note-box">
      <strong>Key difference from Karma</strong>
      With Vitest, use fixture.whenStable() or TestBed.tick() instead of
      fakeAsync/tick from &#64;angular/core/testing. Zone.js ProxyZone is not
      supported — use vi.useFakeTimers() for timer control instead.
    </div>

    <app-run-hint command="npx nx test main-app counter" />
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
export class AngularComponentsComponent {
  protected counterComponent = `import { Component, signal, input, output } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <h3>{{ title() }}</h3>
    <p class="count">Count: {{ count() }}</p>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
    <button (click)="reset()">Reset</button>
  \`,
})
export class CounterComponent {
  title = input<string>('Counter');
  countChange = output<number>();

  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
    this.countChange.emit(this.count());
  }

  decrement() {
    this.count.update(c => c - 1);
    this.countChange.emit(this.count());
  }

  reset() {
    this.count.set(0);
    this.countChange.emit(0);
  }
}`;

  protected basicTest = `import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display initial count of 0', async () => {
    const fixture = TestBed.createComponent(CounterComponent);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.count')?.textContent)
      .toContain('Count: 0');
  });
});`;

  protected interactionTest = `it('should increment when + is clicked', async () => {
  const fixture = TestBed.createComponent(CounterComponent);
  await fixture.whenStable();

  const buttons = fixture.nativeElement.querySelectorAll('button');
  const incrementBtn = buttons[0]; // +

  incrementBtn.click();
  await fixture.whenStable();

  expect(fixture.componentInstance.count()).toBe(1);

  const el = fixture.nativeElement as HTMLElement;
  expect(el.querySelector('.count')?.textContent)
    .toContain('Count: 1');
});

it('should reset to 0', async () => {
  const fixture = TestBed.createComponent(CounterComponent);
  const component = fixture.componentInstance;

  component.increment();
  component.increment();
  expect(component.count()).toBe(2);

  component.reset();
  expect(component.count()).toBe(0);
});`;

  protected inputTest = `it('should render custom title from input', async () => {
  const fixture = TestBed.createComponent(CounterComponent);
  fixture.componentRef.setInput('title', 'My Counter');
  await fixture.whenStable();

  const el = fixture.nativeElement as HTMLElement;
  expect(el.querySelector('h3')?.textContent)
    .toContain('My Counter');
});`;

  protected outputTest = `it('should emit countChange on increment', async () => {
  const fixture = TestBed.createComponent(CounterComponent);
  const emitted: number[] = [];

  fixture.componentInstance.countChange
    .subscribe(val => emitted.push(val));

  fixture.componentInstance.increment();
  fixture.componentInstance.increment();
  fixture.componentInstance.decrement();

  expect(emitted).toEqual([1, 2, 1]);
});`;
}
