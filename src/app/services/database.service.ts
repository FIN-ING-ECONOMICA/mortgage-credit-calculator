import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PeriodicPayment } from "../models/periodic-payment";
import { Loan } from "../models/loan";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  paymentUrl: string = 'http://localhost:3001/payment'

  constructor(private http: HttpClient) { }

  savePayment(periodicPayment: PeriodicPayment, loan: Loan) {
    const paymentDB = this.convertToPayment(periodicPayment, loan)
    return this.http.post(this.paymentUrl, paymentDB).subscribe(response => console.log(response))
  }

  private convertToPayment(periodicPayment: PeriodicPayment, loan: Loan) {
    return {
      "amount": loan.realStatePrice,
      "tea": periodicPayment.tea,
      "tep": periodicPayment.tep,
      "initialPayment": loan.realStatePrice - periodicPayment.initialBalance,
      "payment": periodicPayment.periodicPayment,
      "mortgageLifeInsurance": loan.mortgageLifeInsurancePercentage,
      "allRiskInsurance": loan.allRiskInsurancePercentage,
      "currency": loan.currency,
      "frequency": loan.paymentFrequency,
      "years": loan.years
    }
  }
}
