import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FinancialService } from "../../services/financial.service";
import { SharedService } from "../../services/shared.service";
import { Router } from "@angular/router";
import { Loan } from "../../models/loan";

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
    loanAmount: new FormControl(''),
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

  constructor(private financialService: FinancialService, private sharedService: SharedService,
              private router: Router) {
  }

  submitForm() {
    this.sharedService.loan = this.assignLoanValues();
    console.log('Cálculo del préstamo:', this.sharedService.loan)
    this.router.navigate(['/payment-summary'])
  }

  assignLoanValues(): Loan {
    let loan: Loan = {
      realStatePrice: Number(this.loanForm.value.realStatePrice) ?? 0,
      initialPaymentPercentage: Number(this.loanForm.value.initialPaymentPercentage) ?? 0,
      initialPayment: this.financialService.calculateLoan(Number(this.loanForm.value.initialPaymentPercentage) ?? 0, Number(this.loanForm.value.realStatePrice) ?? 0),
      tea: Number(this.loanForm.value.tea) ?? 0,
      tep: this.convertTepTo7Decimals(Number(this.loanForm.value.tea) ?? 0, this.paymentFrequency[this.loanForm.value.paymentFrequency ?? '']),
      paymentFrequency: { [this.loanForm.value.paymentFrequency ?? '']: this.paymentFrequency[this.loanForm.value.paymentFrequency ?? ''] },
      years: Number(this.loanForm.value.years) ?? 0,
      period: this.financialService.getPeriod(this.paymentFrequency[this.loanForm.value.paymentFrequency ?? ''], Number(this.loanForm.value.years) ?? 0)
    }
    return loan
  }

  convertTepTo7Decimals(tea: number, _paymentFrequency: number): number {
    let tep = (this.financialService.teaToTep(tea, _paymentFrequency) * 100).toFixed(7)
    return Number(tep)
  }
}
