import { Routes } from '@angular/router';
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { LoanApplicationFormComponent } from "./components/loan-application-form/loan-application-form.component";
import { PaymentSummaryComponent } from "./components/payment-summary/payment-summary.component";
import { VanTirComponent } from "./components/van-tir/van-tir.component";

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'sign-up', component: SignUpComponent, title: 'Registro' },
  { path: 'sign-in', component: SignInComponent, title: 'Iniciar sesión' },
  { path: 'loan-application', component: LoanApplicationFormComponent, title: 'Solicitud de préstamo' },
  { path: 'payment-summary', component: PaymentSummaryComponent, title: 'Plan de pagos' },
  { path: 'van-tir', component: VanTirComponent, title: 'VAN y TIR'}
];
