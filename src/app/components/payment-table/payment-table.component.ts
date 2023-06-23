import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodicPayment } from "../../models/periodic-payment";
import { SharedService } from "../../services/shared.service";
import { Loan } from "../../models/loan";
import { FinancialService } from "../../services/financial.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TimeService } from "../../services/time.service";
import * as moment from "moment";
import { Moment } from "moment";

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
    'Costos',
    'Seguro Desgravamen',
    'Seguro Riesgo',
    'Amortización',
    'Saldo Final',
    'Flujo',
    'Acción'
  ]
  newTea: number = 0
  gracePeriodSelected: string = ''
  roundToNDecimals: (num: (number | string), decimalPositions: number) => number
  gracePeriods = [
    'Sin',
    'Parcial',
    'Total'
  ]
  currency: string = ''
  loan: Loan = {} as Loan

  constructor(private sharedService: SharedService, private financialService: FinancialService, private timeService: TimeService) {
    this.loan = this.sharedService.loan
    this.currency = this.financialService.getCurrency(this.sharedService.loan)
    this.roundToNDecimals = this.sharedService.roundToNDecimals
    let periodicPayment: PeriodicPayment = this.convertLoanToPeriodicPayment(this.sharedService.loan)
    this.tableData = this.calculateTableData(periodicPayment)
  }

  calculateTableData(periodicPayment: PeriodicPayment): Array<PeriodicPayment> {
    let arraySize = periodicPayment.periods;
    let _tableData: Array<PeriodicPayment> = []
    let teps = this.adjustTepToPeriod(periodicPayment)

    // the periodic payment (cuota) is constant throughout all periods
    let _periodicPayment = this.financialService.calculatePeriodicPayment(periodicPayment.initialBalance, periodicPayment.tep, periodicPayment.periods, 1)
    let mortgageLifeInsurancePercentage = periodicPayment.mortgageLifeInsurance;
    let allRiskInsurancePercentage = periodicPayment.allRiskInsurance;

    for (let i = 0; i < arraySize; i++) {

      if (i > 0) {
        periodicPayment = _tableData[i - 1]
      }

      let initialBalance = this.financialService.calculateFinalBalance(periodicPayment.initialBalance, periodicPayment.amortization)
      let interestAmount = this.financialService.calculateInterestAmount(initialBalance, teps[i])
      let mortgageLifeInsurance = this.financialService.calculateMortgageLifeInsurance(initialBalance, mortgageLifeInsurancePercentage)
      let allRiskInsurance = this.financialService.calculateAllRiskInsurance(initialBalance, allRiskInsurancePercentage)
      let amortization = this.financialService.calculateAmortization(_periodicPayment, interestAmount, [periodicPayment.costs, mortgageLifeInsurance, allRiskInsurance])
      let finalBalance = this.financialService.calculateFinalBalance(initialBalance, amortization)
      let cashFlow = this.financialService.calculateCashFlow(_periodicPayment)

      _tableData.push({
        paymentIndex: i + 1,
        initialBalance: initialBalance,
        finalBalance: finalBalance,
        tea: periodicPayment.tea,
        tep: this.roundToNDecimals(teps[i], 7),
        gracePeriod: 'Sin',
        interestAmount: interestAmount,
        periodicPayment: _periodicPayment,
        costs: periodicPayment.costs,
        mortgageLifeInsurance: mortgageLifeInsurance,
        allRiskInsurance: allRiskInsurance,
        amortization: amortization,
        paymentFrequency: periodicPayment.paymentFrequency,
        periods: periodicPayment.periods,
        cashFlow: cashFlow,
        edit: false
      })

      if (i == arraySize - 1) {
        let newPeriodicPayment = this.calculateNewPeriodicPayment(periodicPayment, finalBalance)
      }
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
      costs: loan.mortgageTransfer + loan.administrativeExpenses,
      mortgageLifeInsurance: loan.mortgageLifeInsurance,
      allRiskInsurance: loan.allRiskInsurance,
      amortization: 0,
      paymentFrequency: loan.paymentFrequency,
      periods: loan.periods,
      cashFlow: 0,
      edit: false
    }
    return periodicPayment
  }

  adjustTepToPeriod(periodicPayment: PeriodicPayment) {
    let tep365: number = this.financialService.adjustTepTo365Days(periodicPayment.tep, this.timeService.getFrequencyValue(periodicPayment.paymentFrequency))
    let days: number[] = this.getDays(periodicPayment)
    let arraySize = days.length
    let adjustedTEPs: number[] = []

    for (let i = 0; i < arraySize; i++) {
      adjustedTEPs.push((tep365 / 365) * days[i])
    }
    return adjustedTEPs
  }

  getDays(periodicPayment: PeriodicPayment): number[] {
    let dates: Moment[] = this.timeService.getPaymentDates(moment(), periodicPayment.periods, periodicPayment.paymentFrequency)
    let days: number[] = this.timeService.getDays(dates)
    return days
  }

  calculateNewPeriodicPayment(periodicPayment: PeriodicPayment, finalBalance: number) {
    let days: number = this.getDays(periodicPayment).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let presentValue = this.financialService.bringToPresent(finalBalance, periodicPayment.tea, days)
    let extraPeriodicPayment = this.financialService.calculatePeriodicPayment(presentValue, this.loan.tep + this.loan.mortgageLifeInsurance, this.loan.periods, 1)
    return periodicPayment.periodicPayment + extraPeriodicPayment
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

      tep = this.roundToNDecimals(this.financialService.teaToTep(currentPayment.tea, this.timeService.getFrequencyValue(currentPayment.paymentFrequency)), 7)
      interestAmount = this.roundToNDecimals(this.financialService.calculateInterestAmount(currentPayment.initialBalance, tep), 2)

      if (currentPayment.gracePeriod === 'Parcial') {
        periodicPayment = interestAmount
        amortization = 0
        finalBalance = this.roundToNDecimals(this.financialService.calculateFinalBalance(currentPayment.initialBalance, amortization), 2)
      } else if (currentPayment.gracePeriod === 'Total') {
        periodicPayment = 0
        amortization = 0
        finalBalance = currentPayment.initialBalance + interestAmount
      } else {
        periodicPayment = this.roundToNDecimals(this.financialService.calculatePeriodicPayment(currentPayment.initialBalance, tep, currentPayment.periods, i + 1), 2)
        amortization = this.roundToNDecimals(this.financialService.calculateAmortization(periodicPayment, interestAmount, [0]), 2)
        finalBalance = this.roundToNDecimals(this.financialService.calculateFinalBalance(currentPayment.initialBalance, amortization), 2)
      }

      this.tableData[i].initialBalance = currentPayment.initialBalance
      this.tableData[i].tep = tep
      this.tableData[i].interestAmount = interestAmount
      this.tableData[i].periodicPayment = periodicPayment
      this.tableData[i].amortization = amortization
      this.tableData[i].finalBalance = finalBalance
    }
  }

  onTeaInput(event: any) {
    const inputValue = event.target.value.trim()

    if (inputValue.includes('-')) {
      event.target.value = inputValue.slice(1);
    }
  }
}
