import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: "login", loadComponent: ()=> import('./c-login/c-login').then(m=>m.CLogin)},
    {path: "registro", loadComponent: ()=> import('./registro/registro').then(m=>m.Registro)},
    {path: "splash", loadComponent: ()=> import('./splash-scream.component/splash-scream.component').then(m => m.SplashScreamComponent)},
    {path: "test", loadComponent: ()=> import('./lista-especialistas/lista-especialistas').then(m => m.ListaEspecialistas)},
    {path: "**", redirectTo: "splash"}
];
