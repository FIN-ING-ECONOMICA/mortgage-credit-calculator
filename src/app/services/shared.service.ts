import { Injectable } from '@angular/core';
import { Loan } from "../models/loan";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  loan: Loan = {
    realStatePrice: 0,
    initialPaymentPercentage: 0,
    initialPayment: 0,
    tea: 0,
    tep: 0,
    paymentFrequency: '',
    years: 0,
    periods: 0,
    currency: '',
    mortgageTransfer: 0,
    administrativeExpenses: 0,
    mortgageLifeInsurance: 0,
    allRiskInsurance: 0
  }

  constructor() { }

  roundTo7Decimals(num: number | string): number {
    num = Number(num).toFixed(7)
    return Number(num)
  }
}
