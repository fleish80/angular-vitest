import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-angular-services',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Angular Service Testing</h2>
    <p class="topic-subtitle">
      Test Angular services with dependency injection, HttpClient mocking,
      and the HttpTestingController — all running in Vitest.
    </p>

    <div class="topic-section">
      <h3>The service under test</h3>
      <app-code-block [code]="serviceCode" filename="greeting.service.ts" />
    </div>

    <div class="topic-section">
      <h3>Testing with HttpTestingController</h3>
      <p>
        Use Angular's built-in HTTP testing utilities to mock API responses.
        Works identically to Karma — same API, faster execution.
      </p>
      <app-code-block [code]="httpTest" filename="greeting.service.spec.ts" />
    </div>

    <div class="topic-section">
      <h3>Testing simple services</h3>
      <p>
        Services without HTTP dependencies can be tested by simply injecting them.
      </p>
      <app-code-block [code]="simpleService" />
    </div>

    <div class="topic-section">
      <h3>Mocking dependencies with vi.fn()</h3>
      <p>
        Use Vitest mocks to replace service dependencies without the real implementation.
      </p>
      <app-code-block [code]="mockDeps" />
    </div>

    <div class="note-box">
      <strong>Cleanup pattern</strong>
      Always verify no outstanding HTTP requests in afterEach.
      Use httpTesting.verify() or httpTesting.match(() => true) to consume leftovers
      before calling TestBed.resetTestingModule().
    </div>

    <app-run-hint command="npx nx test main-app greeting" />
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
export class AngularServicesComponent {
  protected serviceCode = `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Greeting {
  id: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class GreetingService {
  private http = inject(HttpClient);
  private apiUrl = '/api/greetings';

  getGreeting(id: number): Observable<Greeting> {
    return this.http.get<Greeting>(\`\${this.apiUrl}/\${id}\`);
  }

  getAllGreetings(): Observable<Greeting[]> {
    return this.http.get<Greeting[]>(this.apiUrl);
  }
}`;

  protected httpTest = `import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { GreetingService } from './greeting.service';

describe('GreetingService', () => {
  let service: GreetingService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GreetingService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // no outstanding requests
  });

  it('should fetch a greeting by id', () => {
    const mockGreeting = { id: 1, message: 'Hello!' };

    service.getGreeting(1).subscribe(greeting => {
      expect(greeting).toEqual(mockGreeting);
    });

    const req = httpTesting.expectOne('/api/greetings/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockGreeting);
  });

  it('should fetch all greetings', () => {
    const mockList = [
      { id: 1, message: 'Hello!' },
      { id: 2, message: 'Hi there!' },
    ];

    service.getAllGreetings().subscribe(greetings => {
      expect(greetings).toHaveLength(2);
      expect(greetings).toEqual(mockList);
    });

    const req = httpTesting.expectOne('/api/greetings');
    req.flush(mockList);
  });
});`;

  protected simpleService = `// A simple service with no HTTP
@Injectable({ providedIn: 'root' })
export class MathService {
  add(a: number, b: number) { return a + b; }
  multiply(a: number, b: number) { return a * b; }
}

describe('MathService', () => {
  it('should add numbers', () => {
    const service = TestBed.inject(MathService);
    expect(service.add(2, 3)).toBe(5);
  });
});`;

  protected mockDeps = `// Mock a dependency service
const mockAuth = {
  isLoggedIn: vi.fn(() => true),
  getUser: vi.fn(() => ({ name: 'Test User' })),
};

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      UserService,
      { provide: AuthService, useValue: mockAuth },
    ],
  });
});

it('should use auth service', () => {
  const service = TestBed.inject(UserService);
  const user = service.getCurrentUser();

  expect(mockAuth.isLoggedIn).toHaveBeenCalled();
  expect(user.name).toBe('Test User');
});`;
}
