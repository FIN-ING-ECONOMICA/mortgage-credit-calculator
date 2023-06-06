import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor() { }

  calculateInitialPayment(percentage: number, realStatePrice: number): number {
    return realStatePrice * percentage / 100
  }

  calculateLoan(percentage: number, realStatePrice: number) {
    let initialPayment = this.calculateInitialPayment(percentage, realStatePrice)
    return realStatePrice - initialPayment
  }

  teaToTep(tea: number, paymentFrequency: number): number {
    let base = (1 + tea / 100)
    let exponent = paymentFrequency / 360;
    let tep = (base ** exponent) - 1;
    return tep
  }
}
