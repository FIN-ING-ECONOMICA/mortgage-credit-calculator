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
  mortgageLifeInsurancePercentage: number,
  insuredAmount: number,
  allRiskInsurance: number,
  allRiskInsurancePercentage: number,
  amortization: number,
  paymentFrequency: string,
  periods: number,
  cashFlow: number,
  edit: boolean
}
