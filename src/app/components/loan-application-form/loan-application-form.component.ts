import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-loan-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-application-form.component.html',
  styleUrls: ['./loan-application-form.component.scss']
})
export class LoanApplicationFormComponent {
  loanForm = new FormGroup({
    realStatePrice: new FormControl(''),
    initialPayment: new FormControl(''),
    paymentFrequency: new FormControl('')
  })
  paymentFrequency = [
    "Diario",
    "Quincenal",
    "Mensual",
    "Bimestral",
    "Trimestral",
    "Cuatrimestral",
    "Semestral",
    "Anual"
  ]
}
