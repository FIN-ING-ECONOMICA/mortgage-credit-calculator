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
  cashFlow: number[] = []

  constructor(private sharedService: SharedService, private timeService: TimeService, private financialService: FinancialService) {
    this.loan = this.sharedService.loan
    this.cashFlow = this.sharedService.cashFlow
    this.showVAN()
  }

  getDates(): Moment[] {
    let startDate: Moment = moment();
    let periods: number = this.cashFlow.length

    let dates: Moment[] = this.timeService.getPaymentDates(startDate, periods, this.loan.paymentFrequency)
    return dates
  }

  showVAN() {
    this.dates = this.getDates()
    let startDate: Moment = this.dates[0]
    let paymentAtTimeZero: number = this.cashFlow.pop()! * -1

    let van: number = this.financialService.calculateVan(this.dates, startDate, this.cashFlow, this.loan.tea, paymentAtTimeZero)
  }
}
