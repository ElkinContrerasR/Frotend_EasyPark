import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ReservasComponent } from './pages/reservas/reservas.component';
import { TarifasComponent } from './pages/tarifas/tarifas.component';
import { authGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { 
        path: 'reservas', 
        component: ReservasComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'tarifas', 
        component: TarifasComponent,
        canActivate: [authGuard,RoleGuard],
        data: { roles: ['USER', 'ADMIN'] } // SOLO estos roles pueden pasar
    }
];