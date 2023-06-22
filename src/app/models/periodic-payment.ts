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
  costs: number,
  mortgageLifeInsurance: number,
  allRiskInsurance: number,
  amortization: number,
  paymentFrequency: string,
  periods: number,
  cashFlow: number,
  edit: boolean
}
