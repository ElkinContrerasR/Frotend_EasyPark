import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private apiUrl = 'http://localhost:8080/api/tarifas';
  private currentUser: any;
  constructor(private http: HttpClient, private loginService: LoginService) {}//REVISE ESTO
  

  private loadCurrentUser(): void {
    const userData = localStorage.getItem('currentUser');
    this.currentUser = userData ? JSON.parse(userData) : null;
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-User-Email': this.loginService.getCurrentUserEmail()
    });
  }

  getTarifas(): Observable<any[]> {
    const headers = this.getAuthHeaders();
  console.log('Headers enviados:', headers); // Verifica esto
  
  return this.http.get<any[]>(`${this.apiUrl}/getAll`, { headers }).pipe(
    tap(response => console.log('Respuesta del servidor:', response)),
    catchError(err => {
      console.error('Error completo:', err);
      return throwError(() => err);
    })
  );
  }

  createTarifa(tarifa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarifa, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Error creando tarifa', err);
        return throwError(() => err);
      })
    );
  }

  updateTarifa(id: number, tarifa: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, tarifa, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Error actualizando tarifa', err);
        return throwError(() => err);
      })
    );
  }

  deleteTarifa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Error eliminando tarifa', err);
        return throwError(() => err);
      })
    );
  }

  getTiposVehiculo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-vehiculo`).pipe(
      catchError(err => {
        console.error('Error obteniendo tipos de vehículo', err);
        return throwError(() => err);
      })
    );
  }

  getTiposTarifa(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-tarifa`).pipe(
      catchError(err => {
        console.error('Error obteniendo tipos de tarifa', err);
        return throwError(() => err);
      })
    );
  }
}