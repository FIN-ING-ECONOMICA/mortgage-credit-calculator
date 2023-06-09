import { Injectable } from '@angular/core';
import { Loan } from "../models/loan";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  loan: Loan = {} as Loan
  cashFlow: { cashFlowArray: number[], cashFlowInitialPayment: number } = {} as { cashFlowArray: number[], cashFlowInitialPayment: number }

  constructor() { }

  roundToNDecimals(num: number | string, decimalPositions: number): number {
    num = Number(num).toFixed(decimalPositions)
    return Number(num)
  }
}
