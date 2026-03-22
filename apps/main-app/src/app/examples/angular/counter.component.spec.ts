import { TestBed } from '@angular/core/testing';
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
    expect(el.querySelector('.count')?.textContent).toContain('Count: 0');
  });

  it('should display default title', async () => {
    const fixture = TestBed.createComponent(CounterComponent);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('Counter');
  });

  it('should render custom title from input', async () => {
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.componentRef.setInput('title', 'My Counter');
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('My Counter');
  });

  it('should increment when + is clicked', async () => {
    const fixture = TestBed.createComponent(CounterComponent);
    await fixture.whenStable();

    const incrementBtn = fixture.nativeElement.querySelector('.increment') as HTMLButtonElement;
    incrementBtn.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.count()).toBe(1);
    expect(fixture.nativeElement.querySelector('.count')?.textContent).toContain('Count: 1');
  });

  it('should decrement when - is clicked', async () => {
    const fixture = TestBed.createComponent(CounterComponent);
    await fixture.whenStable();

    const decrementBtn = fixture.nativeElement.querySelector('.decrement') as HTMLButtonElement;
    decrementBtn.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.count()).toBe(-1);
  });

  it('should reset to 0', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;

    component.increment();
    component.increment();
    component.increment();
    expect(component.count()).toBe(3);

    component.reset();
    expect(component.count()).toBe(0);
  });

  it('should emit countChange on increment', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const emitted: number[] = [];

    fixture.componentInstance.countChange.subscribe(val => emitted.push(val));

    fixture.componentInstance.increment();
    fixture.componentInstance.increment();
    fixture.componentInstance.decrement();

    expect(emitted).toEqual([1, 2, 1]);
  });

  it('should emit 0 on reset', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const emitted: number[] = [];

    fixture.componentInstance.countChange.subscribe(val => emitted.push(val));

    fixture.componentInstance.increment();
    fixture.componentInstance.reset();

    expect(emitted).toEqual([1, 0]);
  });
});
