import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TarifaService } from '../../services/tarifas/tarifas.service';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit {
  tarifas: any[] = [];
  showForm = false;
  isEditing = false;
  currentTarifa: any = { id: null, tipoVehiculo: '', tipoTarifa: '', valor: 0 };
  tiposVehiculo: any[] = [];
  tiposTarifa: any[] = [];
  isLoading = true;

  tarifaToDelete: number | null = null;

  constructor(
    private tarifaService: TarifaService,
    private loginService: LoginService,
    private router: Router
  ) {}

  get isAdmin(): boolean {
    return this.loginService.isAdmin();
  }

  ngOnInit(): void {
    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadInitialData();
  }
  ngOnDestroy(): void { // Nuevo método para limpiar localStorage
    localStorage.removeItem('currentUser');
  }
  private loadInitialData(): void {
    this.isLoading = true;
    
    // Carga primero los tipos de vehículo
    this.tarifaService.getTiposVehiculo().subscribe({
      next: (tipos) => {
        this.tiposVehiculo = tipos;
        // Luego carga los tipos de tarifa
        this.tarifaService.getTiposTarifa().subscribe({
          next: (tarifas) => {
            this.tiposTarifa = tarifas;
            // Finalmente carga las tarifas
            this.loadTarifas();
          },
          error: (err) => this.handleError(err)
        });
      },
      error: (err) => this.handleError(err)
    });
  }

  private loadTarifas(): void {
    this.tarifaService.getTarifas().subscribe({
      next: (data) => {
        this.tarifas = [...data];
        this.isLoading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  // Función para manejar tipos de vehículo
  getTipoVehiculoNombre(codigo: string): string {
    if (!this.tiposVehiculo) return codigo;
    const tipo = this.tiposVehiculo.find(t => t.codigo === codigo);
    return tipo ? tipo.nombre : codigo;
  }

  // Función para manejar tipos de tarifa
  getTipoTarifaDescripcion(codigo: string): string {
    if (!this.tiposTarifa) return codigo;
    const tipo = this.tiposTarifa.find(t => t.codigo === codigo);
    return tipo ? tipo.descripcion : codigo;
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.isLoading = false;
    alert(error.error?.message || 'Ocurrió un error');
    if (error.status === 401) {
      this.loginService.logout();
    }
  }

  showCreateForm(): void {
    this.currentTarifa = { id: null, tipoVehiculo: '', tipoTarifa: '', valor: 0 };
    this.isEditing = false;
    this.showForm = true;
  }

  showEditForm(tarifa: any): void {
    this.currentTarifa = { ...tarifa };
    this.isEditing = true;
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  submitForm(): void {
    if (!this.currentTarifa.tipoVehiculo || !this.currentTarifa.tipoTarifa || this.currentTarifa.valor <= 0) {
      alert('Todos los campos son obligatorios. Por favor, verifique.');
      return;
    }
  
    const operation = this.isEditing 
      ? this.tarifaService.updateTarifa(this.currentTarifa.id, this.currentTarifa)
      : this.tarifaService.createTarifa(this.currentTarifa);
  
    operation.subscribe({
      next: () => {
        this.loadTarifas();
        this.showForm = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  deleteTarifa(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta tarifa?')) {
      this.tarifaService.deleteTarifa(id).subscribe({
        next: () => this.loadTarifas(),
        error: (err) => this.handleError(err)
      });
    }
  }

  
}