import { Routes } from '@angular/router';
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { SignInComponent } from "./components/sign-in/sign-in.component";

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'sign-up', component: SignUpComponent, title: 'Registro' },
  { path: 'sign-in', component: SignInComponent, title: 'Iniciar sesión' }
];
