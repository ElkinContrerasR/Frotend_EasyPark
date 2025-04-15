import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/easypark/login';
  private recoverPasswordUrl = 'http://localhost:8080/api/easypark/recover-password';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }).pipe(
      tap(response => {
        this.storeUserData(response);
      })
    );
  }

  private storeUserData(response: any): void {
    localStorage.setItem('currentUser', JSON.stringify({
      email: response.user.email,
      rol: response.user.rol
      // No pongas token si no existe
    }));
  }

  recoverPassword(email: string, document: string): Observable<any> {
    const body = { email, document };
    return this.http.post(this.recoverPasswordUrl, body);
  }

  logout(): void {
    
    localStorage.removeItem('currentUser');
    //this.router.navigate(['/login']);
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Esto asegura limpieza completa
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUserEmail(): string {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).email : '';
  }

  isAdmin(): boolean {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).rol === 'ADMIN' : false;
  }
 /* getUserRole(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role || null;
  }*/
  getUserRole(): string | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.rol || null;
  }
}
