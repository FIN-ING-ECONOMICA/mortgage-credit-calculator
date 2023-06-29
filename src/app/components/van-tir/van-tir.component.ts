import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from "../../services/shared.service";
import { Moment } from "moment";
import * as moment from "moment/moment";
import { TimeService } from "../../services/time.service";
import { Loan } from "../../models/loan";
import { FinancialService } from "../../services/financial.service";

@Component({
  selector: 'app-van-tir',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './van-tir.component.html',
  styleUrls: ['./van-tir.component.scss']
})
export class VanTirComponent {

  loan: Loan = {} as Loan
  dates: Moment[] = []
  cashFlow: { cashFlowArray: number[], cashFlowInitialPayment: number }
  roundToNDecimals: (num: (number | string), decimalPositions: number) => number
  van: number = 0
  presentCashFlows: number[] = []
  currency: string = ''

  constructor(private sharedService: SharedService, private timeService: TimeService, private financialService: FinancialService) {
    this.roundToNDecimals = this.sharedService.roundToNDecimals
    this.loan = this.sharedService.loan
    this.currency = this.financialService.getCurrency(this.loan)
    this.cashFlow = this.sharedService.cashFlow
    this.dates = this.getDates()
    this.presentCashFlows = this.getPresentCashFlows()
    this.van = this.getVAN()
    this.getTIR()
  }

  getDates(): Moment[] {
    let startDate: Moment = moment();
    let periods: number = this.cashFlow.cashFlowArray.length
    let dates: Moment[] = this.timeService.getPaymentDates(startDate, periods, this.loan.paymentFrequency)

    return dates
  }

  getVAN(): number {
    let startDate: Moment = this.dates[0]
    let paymentAtTimeZero: number = this.cashFlow.cashFlowInitialPayment * -1

    let van: number = this.financialService.calculateVan(this.dates, startDate, this.cashFlow.cashFlowArray, this.loan.tea, paymentAtTimeZero)
    return van
  }

  getPresentCashFlows(): number[] {
    let periods: number = this.cashFlow.cashFlowArray.length
    let presentCashFlows: number[] = [];
    let cashFlowBroughtToPresent: number = 0;
    let daysDifference: number = 0;
    let startDate = this.dates[0]

    for (let i: number = 1; i <= periods; i++) {
      daysDifference = this.timeService.calculateDateDifference(startDate, this.dates[i])
      cashFlowBroughtToPresent = this.financialService.bringToPresent(this.cashFlow.cashFlowArray[i - 1], this.loan.tea, daysDifference)
      presentCashFlows.push(cashFlowBroughtToPresent)
    }

    return presentCashFlows
  }

  getTIR() {
    let startDate: Moment = this.dates[0]
    let paymentAtTimeZero: number = this.cashFlow.cashFlowInitialPayment * -1

    //let tir: number = this.financialService.calculateTir(this.dates, startDate, this.cashFlow.cashFlowArray,0, 1e-6, paymentAtTimeZero)
  }
}
