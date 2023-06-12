import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodicPayment } from "../../models/periodic-payment";
import { SharedService } from "../../services/shared.service";
import { Loan } from "../../models/loan";
import { FinancialService } from "../../services/financial.service";

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss']
})
export class PaymentTableComponent {

  tableData: Array<PeriodicPayment> = []
  tableHeaders: Array<string> = [
    'N°',
    'TEA',
    'TEP',
    'Plazo de gracia',
    'Saldo Inicial',
    'Interés',
    'Cuota',
    'Amortización',
    'Saldo Final'
  ]

  constructor(private sharedService: SharedService, private financialService: FinancialService) {
    this.tableData = this.calculateTableData()
  }

  calculateTableData(): Array<  PeriodicPayment> {
    let _periodicPayment: PeriodicPayment = this.convertLoanToPeriodicPayment(this.sharedService.loan)
    let arraySize = _periodicPayment.periods;
    let _tableData: Array<PeriodicPayment> = []

    for (let i = 0; i < arraySize; i++) {

      if (i > 0) {
        _periodicPayment = _tableData[i - 1]
      }

      let initialBalance = this.roundTo2Decimals(this.financialService.calculateFinalBalance(_periodicPayment.initialBalance, _periodicPayment.amortization))
      let interestAmount = this.roundTo2Decimals(this.financialService.calculateInterestAmount(initialBalance, _periodicPayment.tep))
      let periodicPayment = this.roundTo2Decimals(this.financialService.calculatePeriodicPayment(initialBalance, _periodicPayment.tep, _periodicPayment.periods, i + 1))
      let amortization = this.roundTo2Decimals(this.financialService.calculateAmortization(periodicPayment, interestAmount))
      let finalBalance = this.roundTo2Decimals(this.financialService.calculateFinalBalance(initialBalance, amortization))

      _tableData.push({
        paymentIndex: i + 1,
        initialBalance: initialBalance,
        finalBalance: finalBalance,
        tea: _periodicPayment.tea,
        tep: _periodicPayment.tep,
        gracePeriod: 'No',
        interestAmount: interestAmount,
        periodicPayment: periodicPayment,
        amortization: amortization,
        paymentFrequency: _periodicPayment.paymentFrequency,
        periods: _periodicPayment.periods
      })
    }
    return _tableData
  }

  convertLoanToPeriodicPayment(loan: Loan): PeriodicPayment {
    let periodicPayment: PeriodicPayment = {
      paymentIndex: 0,
      initialBalance: loan.initialPayment,
      finalBalance: 0,
      tea: loan.tea,
      tep: loan.tep,
      gracePeriod: 'No',
      interestAmount: 0,
      periodicPayment: 0,
      amortization: 0,
      paymentFrequency: loan.paymentFrequency,
      periods: loan.periods
    }
    return periodicPayment
  }

  roundTo2Decimals(num: number) {
    return Number(num.toFixed(2))
  }
}
