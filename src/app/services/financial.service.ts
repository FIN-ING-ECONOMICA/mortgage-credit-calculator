import { Injectable } from '@angular/core';
import { Loan } from "../models/loan";

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor() { }

  calculateInitialPayment(percentage: number, realStatePrice: number): number {
    return realStatePrice * percentage / 100
  }

  calculateLoan(percentage: number, realStatePrice: number): number {
    let initialPayment = this.calculateInitialPayment(percentage, realStatePrice)
    return realStatePrice - initialPayment
  }

  teaToTep(tea: number, paymentFrequency: number): number {
    let base = (1 + tea / 100)
    let exponent = paymentFrequency / 360;
    let tep = ((base ** exponent) - 1) * 100;
    return tep
  }

  getPeriod(paymentFrequency: number, years: number): number {
    return (360 / paymentFrequency) * years
  }

  calculateInterestAmount(initialBalance: number, interestRate: number): number {
    return initialBalance * (interestRate / 100)
  }

  // Método Francés
  calculatePeriodicPayment(initialBalance: number, tep: number, periods: number, currentPeriod: number): number {
    let numerator = (tep / 100) * ((1 + tep / 100) ** (periods - currentPeriod + 1))
    let denominator = ((1 + tep / 100) ** (periods - currentPeriod + 1)) - 1
    let r = initialBalance * (numerator / denominator)
    return r
  }

  calculateAmortization(periodicPayment: number, interestAmount: number): number {
    return periodicPayment - interestAmount
  }

  calculateFinalBalance(initialBalance: number, amortization: number): number {
    return initialBalance - amortization;
  }

  calculateCashFlow(periodicPayment: number, additionalExpenses?: number[]): number {
    let additionalExpensesSum = 0
    if (additionalExpenses) {
      additionalExpensesSum = additionalExpenses.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }
    return periodicPayment + additionalExpensesSum;
  }

  getCurrency(loan: Loan): string {
    if (loan.currency === 'Soles') {
      return 'S/'
    } else {
      return '$'
    }
  }
}
