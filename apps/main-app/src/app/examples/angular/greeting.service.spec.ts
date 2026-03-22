import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { GreetingService, Greeting } from './greeting.service';

describe('GreetingService', () => {
  let service: GreetingService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(GreetingService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a greeting by id', () => {
    const mockGreeting: Greeting = { id: 1, message: 'Hello!' };

    service.getGreeting(1).subscribe(greeting => {
      expect(greeting).toEqual(mockGreeting);
    });

    const req = httpTesting.expectOne('/api/greetings/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockGreeting);
  });

  it('should fetch all greetings', () => {
    const mockList: Greeting[] = [
      { id: 1, message: 'Hello!' },
      { id: 2, message: 'Hi there!' },
      { id: 3, message: 'Good day!' },
    ];

    service.getAllGreetings().subscribe(greetings => {
      expect(greetings).toHaveLength(3);
      expect(greetings).toEqual(mockList);
    });

    const req = httpTesting.expectOne('/api/greetings');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should handle HTTP error', () => {
    service.getGreeting(999).subscribe({
      next: () => fail('expected an error'),
      error: (err) => {
        expect(err.status).toBe(404);
      },
    });

    const req = httpTesting.expectOne('/api/greetings/999');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
