import { Component, signal, input, output } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <h3>{{ title() }}</h3>
    <p class="count">Count: {{ count() }}</p>
    <button class="increment" (click)="increment()">+</button>
    <button class="decrement" (click)="decrement()">-</button>
    <button class="reset" (click)="reset()">Reset</button>
  `,
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
}
