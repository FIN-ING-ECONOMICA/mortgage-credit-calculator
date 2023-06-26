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
    this.currency = this.financialService.getCurrency(this.loan)
    this.roundToNDecimals = this.sharedService.roundToNDecimals
    let periodicPayment: PeriodicPayment = this.convertLoanToPeriodicPayment(this.loan)
    this.tableData = this.calculateTableData(periodicPayment)
  }

  calculateTableData(periodicPayment: PeriodicPayment)/*: Array<PeriodicPayment> */{

    let paymentPeriods = periodicPayment.periods;

    let days: number[] = this.getDays(periodicPayment)
    let teps: number[] = this.adjustTepToPeriod(periodicPayment, days)

    const initialPeriodicPayment = periodicPayment
    let payment: number = 0
    let lastIterationPayment =0
    let presentValue: number = 0
    let extraPayment: number = 0

    let finalTableFound: boolean = false
    let finalTable: Array<PeriodicPayment> = []

    for (let i: number = 0; i < 20; i++) {

      if (i === 0) {
        payment = this.financialService.calculatePeriodicPayment(periodicPayment.initialBalance, teps[0] + periodicPayment.mortgageLifeInsurancePercentage, periodicPayment.periods, 1)
      }

      let _tableData: Array<PeriodicPayment> = []

      for (let j: number = 0; j < paymentPeriods; j++) {

        if (j > 0) {
          periodicPayment = _tableData[j - 1]
        }

        let initialBalance = this.financialService.calculateFinalBalance(periodicPayment.initialBalance, periodicPayment.amortization)
        let interestAmount = this.financialService.calculateInterestAmount(initialBalance, teps[j])
        let mortgageLifeInsurance = this.financialService.calculateMortgageLifeInsurance(initialBalance, periodicPayment.mortgageLifeInsurancePercentage, days[j], this.timeService.getFrequencyValue(periodicPayment.paymentFrequency))
        let amortization = this.financialService.calculateAmortization(payment, interestAmount, [mortgageLifeInsurance, periodicPayment.costs])
        let finalBalance = this.financialService.calculateFinalBalance(initialBalance, amortization)
        //let allRiskInsurance = this.financialService.calculateAllRiskInsurance(initialBalance, periodicPayment.allRiskInsurancePcentage)
        let cashFlow = this.financialService.calculateCashFlow(payment)

        _tableData.push({
          paymentIndex: j + 1,
          initialBalance: initialBalance,
          finalBalance: finalBalance,
          tea: periodicPayment.tea,
          tep: this.roundToNDecimals(teps[j], 7),
          gracePeriod: 'Sin',
          interestAmount: interestAmount,
          periodicPayment: payment,
          costs: periodicPayment.costs,
          mortgageLifeInsurance: mortgageLifeInsurance,
          mortgageLifeInsurancePercentage: periodicPayment.mortgageLifeInsurancePercentage,
          allRiskInsurance: 0,
          allRiskInsurancePercentage: periodicPayment.allRiskInsurancePercentage,
          amortization: amortization,
          paymentFrequency: periodicPayment.paymentFrequency,
          periods: periodicPayment.periods,
          cashFlow: cashFlow,
          edit: false
        })

        if (j === paymentPeriods - 1) {

          lastIterationPayment = _tableData[j].periodicPayment

          let _newPeriodicPayment: number[] = this.bringFinalBalanceToPresent(_tableData[j], finalBalance);

          presentValue = _newPeriodicPayment[0]
          extraPayment = _newPeriodicPayment[1]

          if (
            this.roundToNDecimals(presentValue, 3) === 0 &&
            this.roundToNDecimals(extraPayment, 3) === 0
          ) {
            finalTableFound = true;
            finalTable = _tableData;
            break;
          }

          payment = this.financialService.calculateIterationPayment(lastIterationPayment, extraPayment)

          periodicPayment = initialPeriodicPayment
        }
      }

      if (finalTableFound === false) {
        continue;
      } else {
        break;
      }
    }
    return finalTable
  }

  convertLoanToPeriodicPayment(loan: Loan): PeriodicPayment {
    let periodicPayment: PeriodicPayment = {
      paymentIndex: 0,
      initialBalance: this.financialService.calculateInitialPayment(loan.initialPaymentPercentage, loan.realStatePrice),
      finalBalance: 0,
      tea: loan.tea,
      tep: this.financialService.teaToTep(loan.tea, this.timeService.getFrequencyValue(loan.paymentFrequency)),
      gracePeriod: 'No',
      interestAmount: 0,
      periodicPayment: 0,
      costs: loan.mortgageTransfer + loan.administrativeExpenses,
      mortgageLifeInsurancePercentage: loan.mortgageLifeInsurancePercentage,
      mortgageLifeInsurance: 0,
      allRiskInsurancePercentage: loan.allRiskInsurancePercentage,
      allRiskInsurance: 0,
      amortization: 0,
      paymentFrequency: loan.paymentFrequency,
      periods: this.financialService.getPeriod(this.timeService.getFrequencyValue(loan.paymentFrequency), loan.years),
      cashFlow: 0,
      edit: false
    }
    return periodicPayment
  }

  adjustTepToPeriod(periodicPayment: PeriodicPayment, days: number[]) {
    let tep365: number = this.financialService.adjustTepTo365Days(periodicPayment.tep, this.timeService.getFrequencyValue(periodicPayment.paymentFrequency))
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

  bringFinalBalanceToPresent(periodicPayment: PeriodicPayment, finalBalance: number): number[] {
    let days: number = this.getDays(periodicPayment).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let presentValue: number = this.financialService.bringToPresent(finalBalance, periodicPayment.tea, days)
    let extraPayment: number = this.financialService.calculatePeriodicPayment(presentValue, periodicPayment.tep + periodicPayment.mortgageLifeInsurancePercentage, periodicPayment.periods, 1)
    return [presentValue, extraPayment]
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
