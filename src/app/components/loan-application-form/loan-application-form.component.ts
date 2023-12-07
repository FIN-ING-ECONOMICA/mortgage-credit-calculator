import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
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

  loanForm = new FormGroup({
    realStatePrice: new FormControl('', [Validators.required, Validators.min(0)]),
    initialPaymentPercentage: new FormControl('', [Validators.required, Validators.min(7.5)]),
    tea: new FormControl('', [Validators.required, Validators.min(0)]),
    paymentFrequency: new FormControl('',[Validators.required]),
    years: new FormControl('', [Validators.required, Validators.min(0)]),
    currency: new FormControl('', [Validators.required]),
    mortgageTransfer: new FormControl('', [Validators.required, Validators.min(0)]),
    administrativeExpenses: new FormControl('', [Validators.required, Validators.min(0)]),
    mortgageLifeInsurance: new FormControl('', [Validators.required, Validators.min(0)]),
    allRiskInsurance: new FormControl('', [Validators.required, Validators.min(0)]),
    insuredAmount: new FormControl('', [Validators.required, Validators.min(0)])
  })
  frequencies: string[] = [];
  roundToNDecimals: (num: (number | string), decimalPositions: number) => number
  currencies: string[] = ['Soles', 'Dólares']

  constructor(private sharedService: SharedService, private router: Router, private timeService: TimeService) {
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
      initialPayment: 0,
      tea: Number(this.loanForm.value.tea) ?? 0,
      tep: 0,
      paymentFrequency: this.loanForm.value.paymentFrequency ?? '',
      years: Number(this.loanForm.value.years) ?? 0,
      periods: 0,
      currency: this.loanForm.value.currency ?? '',
      mortgageTransfer: Number(this.loanForm.value.mortgageTransfer ?? 0),
      administrativeExpenses: Number(this.loanForm.value.administrativeExpenses ?? 0),
      mortgageLifeInsurancePercentage: Number(this.loanForm.value.mortgageLifeInsurance ?? 0),
      mortgageLifeInsurance: 0,
      allRiskInsurancePercentage: Number(this.loanForm.value.allRiskInsurance ?? 0),
      allRiskInsurance: 0,
      insuredAmount: Number(this.loanForm.value.insuredAmount ?? 0)
    }
    return loan
  }
}
