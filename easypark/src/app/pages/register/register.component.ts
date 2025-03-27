import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  showConfirmPassword: boolean = false;
  user: any = {}; 
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {  
      console.log("RegisterComponent cargado correctamente");
  }

  togglePassword(): void {
      this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
      this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Por favor, completa correctamente el formulario.';
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    console.log('Registrando usuario...', this.user);
    this.userService.registerUser(this.user).subscribe(
        response => {
            console.log('Registro exitoso', response);
            this.errorMessage = '';

            const modalElement = document.getElementById('successModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();

                setTimeout(() => {
                    modal.hide();
                    this.router.navigate(['/']);
                }, 2000);
            }
        },
        error => {
            this.errorMessage = error.status === 409 
                ? 'El email ya está registrado. Intenta con otro.' 
                : 'Ocurrió un error al registrarse. Inténtalo de nuevo.';
            console.error('Error en el registro', error);
        }
    );
  }
}
