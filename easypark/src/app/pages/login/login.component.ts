import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Datos y estados para el login
  user: any = { email: '', password: '' };
  loginErrorMessage: string = '';
  invalidLoginEmail: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;

  

  // Datos y estados para el modal de recuperación
  recoveryData: any = { email: '', document: '' };
  recoveryErrorMessage: string = '';
  showForgotPasswordModal: boolean = false;
  invalidRecoveryEmail: boolean = false;
  invalidDocument: boolean = false;
  isRecoveryLoading: boolean = false;
  
  constructor(private loginService: LoginService, private router: Router) {}
  
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login() {
    this.loginErrorMessage = '';
    this.invalidLoginEmail = false;

    if (!this.user.email || !this.user.password) {
      this.loginErrorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    if (!this.validateEmail(this.user.email)) {
      this.invalidLoginEmail = true;
      this.loginErrorMessage = 'Por favor ingresa un correo electrónico válido.';
      return;
    }

    this.isLoading = true;

    this.loginService.login(this.user.email, this.user.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirigimos directamente a /tarifas (el redirectBasedOnRole ya no es necesario)
        this.router.navigate(['/tarifas']);
      },
      error: (error) => {
        this.isLoading = false;
        this.loginErrorMessage = error.error?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }

  // Método eliminado ya que no es necesario (ambos roles redirigen a /tarifas)
  // private redirectBasedOnRole(role: string): void {
  //   // La redirección ahora se maneja en el componente de tarifas según el rol
  //   this.router.navigate(['/tarifas']);
  // }

  openForgotPasswordModal() {
    this.recoveryErrorMessage = '';
    this.invalidRecoveryEmail = false;
    this.invalidDocument = false;
    this.showForgotPasswordModal = true;
    this.recoveryData = { email: '', document: '' };

    setTimeout(() => {
      const modal = document.querySelector('.modal-content') as HTMLElement;
      if (modal) {
        modal.focus();
      }
    }, 0);
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
  }

  sendRecoveryRequest() {
    this.recoveryErrorMessage = '';
    this.invalidRecoveryEmail = false;
    this.invalidDocument = false;

    if (!this.recoveryData.email || !this.recoveryData.document) {
      this.recoveryErrorMessage = 'Por favor, ingresa tu correo y número de documento.';
      return;
    }

    if (!this.validateEmail(this.recoveryData.email)) {
      this.invalidRecoveryEmail = true;
      this.recoveryErrorMessage = 'Por favor ingresa un correo electrónico válido.';
      return;
    }

    if (!/^\d+$/.test(this.recoveryData.document)) {
      this.invalidDocument = true;
      this.recoveryErrorMessage = 'El documento debe contener solo números.';
      return;
    }

    this.isRecoveryLoading = true;

    this.loginService.recoverPassword(this.recoveryData.email, this.recoveryData.document).subscribe({
      next: (response) => {
        this.isRecoveryLoading = false;
        // Mostrar modal de éxito
        const modalElement = document.getElementById('recoverySuccessModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
          
          // Cerrar modales después de 4 segundos
          setTimeout(() => {
            modal.hide();
            this.closeForgotPasswordModal();
          }, 4000);
        }
      },
      error: (error) => {
        this.isRecoveryLoading = false;
        console.error('Error al recuperar contraseña:', error);
        this.recoveryErrorMessage = error.error?.message || 
                                  error.error?.error || 
                                  'Error al recuperar la contraseña. Verifica tus datos e intenta de nuevo.';
      }
    });
  }
  
}