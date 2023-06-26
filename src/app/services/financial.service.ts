import { Injectable } from '@angular/core';
import { Loan } from "../models/loan";

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor() { }

  calculateInitialPayment(percentage: number, realStatePrice: number): number {
    if (percentage > 0) {
      return realStatePrice * percentage / 100
    }
    return realStatePrice
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

  adjustTepTo365Days(tep: number, paymentFrequency: number): number {
    return (tep * 365) / paymentFrequency
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

  calculateAmortization(periodicPayment: number, interestAmount: number, additionalCosts: number[]): number {
    let additionalCostsSum = additionalCosts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return periodicPayment - interestAmount - additionalCostsSum
  }

  calculateFinalBalance(initialBalance: number, amortization: number): number {
    return initialBalance - amortization;
  }

  calculateCashFlow(periodicPayment: number, allRiskInsurance: number): number {
    return periodicPayment + allRiskInsurance;
  }

  getCurrency(loan: Loan): string {
    if (loan.currency === 'Soles') {
      return 'S/'
    } else {
      return '$'
    }
  }

  // Calcula el seguro de desgravamen
  calculateMortgageLifeInsurance(initialBalance: number, mortgageLifeInsurance: number, periodDays: number, paymentFrequency: number): number {
    return initialBalance * ((mortgageLifeInsurance / 100) * (periodDays / paymentFrequency))
  }

  calculateAllRiskInsurance(insuredAmount: number, allRiskInsurancePercentage: number, paymentFrequency: number): number {
    return insuredAmount * ((allRiskInsurancePercentage / 100) / (360 / paymentFrequency))
  }

  bringToPresent(futureValue:number, tea: number, days: number): number {
    let presentValue = futureValue / ((1 + (tea / 100)) ** (days / 360))
    return presentValue
  }

  calculateIterationPayment(lastIterationPayment: number, extraPayment: number): number {
    return lastIterationPayment + extraPayment
  }
}
