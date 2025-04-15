import { Component } from '@angular/core';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {
  showAddReservaModal: boolean = false;
  
  // Datos de ejemplo para las reservas (simulando el backend)
  reservas: any[] = [
    /* Ejemplo de datos:
    {
      id: 1,
      fecha: '2023-11-15',
      hora: '14:30',
      espacio: 'A12 - Cubierto',
      estado: 'Confirmada'
    },
    {
      id: 2,
      fecha: '2023-11-16',
      hora: '09:15',
      espacio: 'B05 - Descubierto',
      estado: 'Confirmada'
    }
    */
  ];

  openAddReservaModal() {
    this.showAddReservaModal = true;
  }

  closeAddReservaModal() {
    this.showAddReservaModal = false;
  }

  agregarReserva() {
    // Lógica para agregar reserva (simulada)
    alert('Funcionalidad de agregar reserva se implementará con el backend');
    this.closeAddReservaModal();
  }

  cancelarReserva(id: number) {
    // Lógica para cancelar reserva (simulada)
    if(confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      alert(`Reserva #${id} cancelada (simulado)`);
    }
  }
}