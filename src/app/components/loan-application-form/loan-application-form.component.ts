import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FinancialService } from "../../services/financial.service";
import { SharedService } from "../../services/shared.service";
import { Router } from "@angular/router";
import { Loan } from "../../models/loan";
import { TimeService } from "../../services/time.service";

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
    initialPaymentPercentage: new FormControl('', [Validators.required, Validators.min(7.5)]),
    tea: new FormControl('', [Validators.required, Validators.min(0)]),
    paymentFrequency: new FormControl('',[Validators.required]),
    years: new FormControl('', [Validators.required, Validators.min(0)]),
    currency: new FormControl('', [Validators.required]),
    mortgageTransfer: new FormControl('', [Validators.required, Validators.min(0)]),
    administrativeExpenses: new FormControl('', [Validators.required, Validators.min(0)]),
    mortgageLifeInsurance: new FormControl('', [Validators.required, Validators.min(0)]),
    allRiskInsurance: new FormControl('', [Validators.required, Validators.min(0)])
  })
  frequencies: string[] = [];
  roundToNDecimals: (num: (number | string), decimalPositions: number) => number
  currencies: string[] = ['Soles', 'Dólares']

  constructor(private financialService: FinancialService, private sharedService: SharedService,
              private router: Router, private timeService: TimeService) {
    this.frequencies = this.timeService.getFrequencies();
    this.roundToNDecimals = this.sharedService.roundToNDecimals
  }

  submitForm() {
    if (this.loanForm.valid) {
      this.sharedService.loan = this.assignLoanValues();
      this.router.navigate(['/payment-summary'])
    } else {
      console.log('Formulario Inválido')
    }
  }

  assignLoanValues(): Loan {
    let loan: Loan = {
      realStatePrice: Number(this.loanForm.value.realStatePrice) ?? 0,
      initialPaymentPercentage: Number(this.loanForm.value.initialPaymentPercentage) ?? 0,
      initialPayment: this.financialService.calculateLoan(Number(this.loanForm.value.initialPaymentPercentage) ?? 0, Number(this.loanForm.value.realStatePrice) ?? 0),
      tea: Number(this.loanForm.value.tea) ?? 0,
      tep: this.roundToNDecimals(this.financialService.teaToTep(Number(this.loanForm.value.tea) ?? 0, this.timeService.getFrequencyValue(this.loanForm.value.paymentFrequency ?? '')), 7),
      paymentFrequency: this.loanForm.value.paymentFrequency ?? '',
      years: Number(this.loanForm.value.years) ?? 0,
      periods: this.financialService.getPeriod(this.timeService.getFrequencyValue(this.loanForm.value.paymentFrequency ?? ''), Number(this.loanForm.value.years) ?? 0),
      currency: this.loanForm.value.currency ?? '',
      mortgageTransfer: Number(this.loanForm.value.mortgageTransfer ?? 0),
      administrativeExpenses: Number(this.loanForm.value.administrativeExpenses ?? 0),
      mortgageLifeInsurance: Number(this.loanForm.value.mortgageLifeInsurance ?? 0),
      allRiskInsurance: Number(this.loanForm.value.allRiskInsurance ?? 0)
    }
    return loan
  }
}
