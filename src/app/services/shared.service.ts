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

  roundToNDecimals(num: number | string, decimalPositions: number): number {
    num = Number(num).toFixed(decimalPositions)
    return Number(num)
  }
}
