import { page, userEvent } from 'vitest/browser';
import { TestBed } from '@angular/core/testing';
import { CounterComponent } from '../../src/app/examples/angular/counter.component';

describe('CounterComponent — Partial Browser Mode', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.innerHTML = '';
  });

  it('should render and interact via TestBed + direct DOM', async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CounterComponent);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.count')?.textContent).toContain('Count: 0');

    const incrementBtn = el.querySelector('.increment') as HTMLButtonElement;
    incrementBtn.click();
    await fixture.whenStable();

    expect(el.querySelector('.count')?.textContent).toContain('Count: 1');

    incrementBtn.click();
    incrementBtn.click();
    await fixture.whenStable();

    expect(el.querySelector('.count')?.textContent).toContain('Count: 3');

    const resetBtn = el.querySelector('.reset') as HTMLButtonElement;
    resetBtn.click();
    await fixture.whenStable();

    expect(el.querySelector('.count')?.textContent).toContain('Count: 0');
  });
});

describe('CounterComponent — Full Browser Mode', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.innerHTML = '';
  });

  it('should render and interact via page API + userEvent', async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CounterComponent);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();

    await expect.element(page.getByText('Count: 0')).toBeVisible();

    await userEvent.click(page.getByRole('button', { name: '+' }));
    await expect.element(page.getByText('Count: 1')).toBeVisible();

    await userEvent.click(page.getByRole('button', { name: '+' }));
    await userEvent.click(page.getByRole('button', { name: '+' }));
    await expect.element(page.getByText('Count: 3')).toBeVisible();

    await userEvent.click(page.getByRole('button', { name: '-' }));
    await expect.element(page.getByText('Count: 2')).toBeVisible();

    await userEvent.click(page.getByRole('button', { name: 'Reset' }));
    await expect.element(page.getByText('Count: 0')).toBeVisible();

    const heading = page.getByRole('heading', { name: 'Counter' });
    await expect.element(heading).toBeVisible();
  });
});
