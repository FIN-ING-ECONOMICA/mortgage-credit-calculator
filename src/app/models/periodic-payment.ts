export interface PeriodicPayment {
  // n
  paymentIndex: number,
  initialBalance: number,
  finalBalance: number,
  tea: number,
  tep: number,
  gracePeriod: string,
  interestAmount: number,
  periodicPayment: number,
  mortgageTransfer: number,
  administrativeExpenses: number,
  mortgageLifeInsurance: number
  amortization: number,
  paymentFrequency: { [key: string]: number },
  periods: number,
  cashFlow: number,
  edit: boolean
}
