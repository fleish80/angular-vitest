import { Injectable, inject } from '@angular/core';
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
    return this.http.get<Greeting>(`${this.apiUrl}/${id}`);
  }

  getAllGreetings(): Observable<Greeting[]> {
    return this.http.get<Greeting[]>(this.apiUrl);
  }
}
