import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var bootstrap: any; // Declaramos Bootstrap como variable global

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPassword: boolean = false;
  user: any = {}; 
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {  
      console.log("RegisterComponent cargado correctamente");
  }

  togglePassword(): void {
      this.showPassword = !this.showPassword;
  }

  register(): void {
    console.log('Registrando usuario...', this.user);
    this.userService.registerUser(this.user).subscribe(
        response => {
            console.log('Registro exitoso', response);
            this.errorMessage = '';

            // Obtener el modal y mostrarlo
            const modalElement = document.getElementById('successModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();

                // Cerrar el modal y redirigir después de 2 segundos
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
