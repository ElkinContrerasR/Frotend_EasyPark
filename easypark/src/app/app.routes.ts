import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige la raíz a '/home'
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent}
];
