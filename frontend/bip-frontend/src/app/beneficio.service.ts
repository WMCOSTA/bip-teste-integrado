import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficio } from './beneficio.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private apiUrl = 'http://localhost:8080/api/v1/beneficios';

  constructor(private http: HttpClient) { }

  list(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.apiUrl);
  }

  getById(id: number): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.apiUrl}/${id}`);
  }

  create(beneficio: Beneficio): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, beneficio);
  }

  update(id: number, beneficio: Beneficio): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.apiUrl}/${id}`, beneficio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  transfer(fromId: number, toId: number, amount: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/transfer`, null, {
      params: { fromId, toId, amount },
      responseType: 'text'
    });
  }
}
