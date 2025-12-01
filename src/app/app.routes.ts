import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: "login", loadComponent: ()=> import('./c-login/c-login').then(m=>m.CLogin)},
    {path: "registro", loadComponent: ()=> import('./registro/registro').then(m=>m.Registro)},
    {path: "splash", loadComponent: ()=> import('./splash-scream.component/splash-scream.component').then(m => m.SplashScreamComponent)},

    {path: "misturnos", loadComponent: ()=> import('./gestion-turnos/gestion-turnos').then(m => m.GestionTurnos)},
    {path: "listaPacientes", loadComponent: ()=> import('./lista-pacientes/lista-pacientes').then(m => m.ListaPacientes)},

    {path: "perfil", loadComponent: ()=> import('./perfil-usuario/perfil-usuario').then(m=>m.PerfilUsuario)},
    {path: "menuAdmin", loadComponent: ()=> import('./menu-administrador/menu-administrador').then(m=>m.MenuAdministrador)},
    {path: "listaEspecialistas", canActivate: [authGuard],  loadComponent: ()=> import('./lista-especialistas/lista-especialistas').then(m => m.ListaEspecialistas)},

    {path: "**", redirectTo: "splash"}
];
