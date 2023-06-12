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
  isCellEditable: boolean = true

  constructor(private sharedService: SharedService, private financialService: FinancialService) {
    let periodicPayment: PeriodicPayment = this.convertLoanToPeriodicPayment(this.sharedService.loan)
    this.tableData = this.calculateTableData(periodicPayment)
  }

  updateTableData(row: any, name: string, id: any) {
    let cellContent: string | null | undefined = this.getEditableCellContent(id)
  }

  calculateTableData(periodicPayment: PeriodicPayment): Array<PeriodicPayment> {
    let arraySize = periodicPayment.periods;
    let _tableData: Array<PeriodicPayment> = []

    for (let i = 0; i < arraySize; i++) {

      if (i > 0) {
        periodicPayment = _tableData[i - 1]
      }

      let initialBalance = this.roundTo2Decimals(this.financialService.calculateFinalBalance(periodicPayment.initialBalance, periodicPayment.amortization))
      let interestAmount = this.roundTo2Decimals(this.financialService.calculateInterestAmount(initialBalance, periodicPayment.tep))
      let _periodicPayment = this.roundTo2Decimals(this.financialService.calculatePeriodicPayment(initialBalance, periodicPayment.tep, periodicPayment.periods, i + 1))
      let amortization = this.roundTo2Decimals(this.financialService.calculateAmortization(_periodicPayment, interestAmount))
      let finalBalance = this.roundTo2Decimals(this.financialService.calculateFinalBalance(initialBalance, amortization))

      _tableData.push({
        paymentIndex: i + 1,
        initialBalance: initialBalance,
        finalBalance: finalBalance,
        tea: periodicPayment.tea,
        tep: periodicPayment.tep,
        gracePeriod: 'No',
        interestAmount: interestAmount,
        periodicPayment: _periodicPayment,
        amortization: amortization,
        paymentFrequency: periodicPayment.paymentFrequency,
        periods: periodicPayment.periods
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

  getEditableCellContent(id: string): string | null | undefined {
    return document.getElementById(id)?.textContent;
  }
}
