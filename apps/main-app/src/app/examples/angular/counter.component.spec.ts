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

  // whenStable() triggers change detection and waits for any async tasks to complete.
  // After createComponent(), the template hasn't been rendered yet — signals like
  // count() and title() exist, but the DOM is empty. whenStable() renders the
  // template so we can query the DOM for elements and assert on their content.
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

  // setInput() updates the signal input value, but the DOM still reflects the old
  // state. whenStable() runs change detection so the template re-evaluates {{ title() }}
  // and renders the new value into the DOM.
  it('should render custom title from input', async () => {
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.componentRef.setInput('title', 'My Counter');
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('My Counter');
  });

  // Two whenStable() calls are needed here:
  // 1st — renders the initial DOM so we can querySelector() the button.
  // 2nd — after click(), the signal count is updated; whenStable() runs change
  //        detection again so the DOM reflects the new count value.
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

  // No whenStable() needed below — these tests only assert on the component instance
  // (signal values, emitted events), not on the DOM. Change detection is irrelevant
  // when you're not querying rendered template output.
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
