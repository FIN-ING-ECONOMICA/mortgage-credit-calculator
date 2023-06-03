import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FinancialService } from "../../services/financial.service";

@Component({
  selector: 'app-loan-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-application-form.component.html',
  styleUrls: ['./loan-application-form.component.scss']
})
export class LoanApplicationFormComponent {
  loanForm   = new FormGroup({
    realStatePrice: new FormControl('', [Validators.required, Validators.min(0)]),
    initialPaymentPercentage: new FormControl('', [Validators.required, Validators.min(0)]),
    tea: new FormControl(''),
    paymentFrequency: new FormControl(''),
    years: new FormControl(''),
    paymentPeriod: new FormControl(''),
    initialPayment: new FormControl(''),
    loanPayment: new FormControl(''),
    tep: new FormControl(''),
    period: new FormControl('')
  })
  paymentFrequency: Record<string, number> = {
    Diario: 1,
    Quincenal: 15,
    Mensual: 30,
    Bimestral: 60,
    Trimestral: 90,
    Cuatrimestral: 120,
    Semestral: 180,
    Anual: 360
  }
  frequencies = Object.keys(this.paymentFrequency);

  constructor(private financialService: FinancialService) {
  }

  renderInitialPayment(): string {
    let percentage = Number(this.loanForm.get('initialPaymentPercentage')?.value)
    let realStatePrice = Number(this.loanForm.get('realStatePrice')?.value)
    return `S/ ${this.financialService.calculateInitialPayment(percentage, realStatePrice).toFixed(2)}`
  }
}
