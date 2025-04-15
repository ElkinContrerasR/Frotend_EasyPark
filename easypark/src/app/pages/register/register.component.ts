import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPassword: boolean = false;
  user: any = {
    nombres: '',
    apellidos: '',
    email: '',
    document: '',
    telefono: '',
    direccion: '',
    password: ''
  };
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  errorMessage: string = '';
  invalidEmail: boolean = false;
  invalidPhone: boolean = false;

  constructor(private userService: UserService, private router: Router) {  
    console.log("RegisterComponent cargado correctamente");
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswords(): void {
    this.passwordMismatch = this.user.password !== this.confirmPassword;
  }

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.invalidEmail = !emailRegex.test(this.user.email);
  }

  validatePhone(): void {
    // Permite números, espacios, guiones y paréntesis (opcional)
    const phoneRegex = /^[\d\s+-]+$/;
    this.invalidPhone = this.user.telefono && !phoneRegex.test(this.user.telefono);
  }

  register(): void {
    // Resetear mensajes de error
    this.errorMessage = '';
    this.invalidEmail = false;
    this.invalidPhone = false;

    // Validación básica de campos requeridos
    if (!this.user.nombres || !this.user.apellidos || !this.user.email || 
        !this.user.document || !this.user.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios';
      return;
    }

    // Validar formato de email
    this.validateEmail();
    if (this.invalidEmail) {
      this.errorMessage = 'Por favor ingrese un correo electrónico válido (ejemplo@dominio.com)';
      return;
    }

    // Validar formato de teléfono si se ingresó
    this.validatePhone();
    if (this.invalidPhone) {
      this.errorMessage = 'El teléfono solo puede contener números y caracteres especiales (+ -)';
      return;
    }

    // Validar coincidencia de contraseñas
    if (this.passwordMismatch) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Validación básica de documento
    if (!/^\d+$/.test(this.user.document)) {
      this.errorMessage = 'El documento debe contener solo números';
      return;
    }

    // Validación de fortaleza de contraseña
    if (this.user.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    console.log('Registrando usuario...', this.user);
    
    this.userService.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.errorMessage = '';

        // Mostrar modal de éxito
        const modalElement = document.getElementById('successModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();

          // Cerrar el modal y redirigir después de 2 segundos
          setTimeout(() => {
            modal.hide();
            this.router.navigate(['/login']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Error en el registro', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'El email o documento ya están registrados. Intenta con otros.';
    }
    return 'Ocurrió un error al registrarse. Inténtalo de nuevo.';
  }
}