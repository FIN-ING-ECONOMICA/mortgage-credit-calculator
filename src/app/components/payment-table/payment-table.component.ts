import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodicPayment } from "../../models/periodic-payment";
import { SharedService } from "../../services/shared.service";
import { Loan } from "../../models/loan";
import { FinancialService } from "../../services/financial.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
    'Saldo Final',
    'Acción'
  ]
  newTea: number = 0
  gracePeriodSelected: string = ''
  roundTo7Decimals: (num: (number | string)) => number
  gracePeriods = [
    'Sin',
    'Parcial',
    'Total'
  ]

  constructor(private sharedService: SharedService, private financialService: FinancialService) {
    let periodicPayment: PeriodicPayment = this.convertLoanToPeriodicPayment(this.sharedService.loan)
    this.tableData = this.calculateTableData(periodicPayment)
    this.roundTo7Decimals = this.sharedService.roundTo7Decimals
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
        gracePeriod: 'Sin',
        interestAmount: interestAmount,
        periodicPayment: _periodicPayment,
        amortization: amortization,
        paymentFrequency: periodicPayment.paymentFrequency,
        periods: periodicPayment.periods,
        edit: false
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
      periods: loan.periods,
      edit: false
    }
    return periodicPayment
  }

  roundTo2Decimals(num: number) {
    return Number(num.toFixed(2))
  }

  onEdit(periodicPayment: PeriodicPayment) {
    periodicPayment.edit = !periodicPayment.edit;
  }

  onSave(periodicPayment: PeriodicPayment) {
    let rowIndex = periodicPayment.paymentIndex - 1

    this.tableData[rowIndex].tea = this.newTea
    this.tableData[rowIndex].gracePeriod = this.gracePeriodSelected

    this.updateTable()

    periodicPayment.edit = !periodicPayment.edit;
  }

  updateTable(): void {
    let tableSize = this.tableData.length
    let currentPayment: PeriodicPayment = {} as PeriodicPayment

    let tep: number
    let interestAmount: number
    let periodicPayment: number
    let amortization: number
    let finalBalance: number

    for (let i = 0; i < tableSize; i++) {

      currentPayment = this.tableData[i]

      // calculate initial balance
      if (i > 0) {
        currentPayment.initialBalance = this.tableData[i - 1].finalBalance
      } else {
        currentPayment.initialBalance = this.sharedService.loan.initialPayment
      }

      tep = this.roundTo7Decimals(this.financialService.teaToTep(currentPayment.tea, this.getPaymentFrequencyValue(currentPayment.paymentFrequency)))
      interestAmount = this.roundTo2Decimals(this.financialService.calculateInterestAmount(currentPayment.initialBalance, tep))

      if (currentPayment.gracePeriod === 'Parcial') {
        periodicPayment = interestAmount
        amortization = 0
        finalBalance = this.roundTo2Decimals(this.financialService.calculateFinalBalance(currentPayment.initialBalance, amortization))
      } else if (currentPayment.gracePeriod === 'Total') {
        periodicPayment = 0
        amortization = 0
        finalBalance = currentPayment.initialBalance + interestAmount
      } else {
        periodicPayment = this.roundTo2Decimals(this.financialService.calculatePeriodicPayment(currentPayment.initialBalance, tep, currentPayment.periods, i + 1))
        amortization = this.roundTo2Decimals(this.financialService.calculateAmortization(periodicPayment, interestAmount))
        finalBalance = this.roundTo2Decimals(this.financialService.calculateFinalBalance(currentPayment.initialBalance, amortization))
      }

      this.tableData[i].initialBalance = currentPayment.initialBalance
      this.tableData[i].tep = tep
      this.tableData[i].interestAmount = interestAmount
      this.tableData[i].periodicPayment = periodicPayment
      this.tableData[i].amortization = amortization
      this.tableData[i].finalBalance = finalBalance
    }
  }

  getPaymentFrequencyValue(paymentFrequency: any): number {
    const keys = Object.keys(paymentFrequency)
    const frequency = keys[0]
    return paymentFrequency[frequency]
  }

  onTeaInput(event: any) {
    const inputValue = event.target.value.trim()

    if (inputValue.includes('-')) {
      event.target.value = inputValue.slice(1);
    }
  }
}
