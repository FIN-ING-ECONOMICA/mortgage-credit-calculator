export interface PeriodicPayment {
  // n
  paymentIndex: number,
  initialBalance: number,
  finalBalance: number,
  tea: number,
  tep: number,
  interestAmount: number,
  periodicPayment: number,
  amortization: number,
  paymentFrequency: { [key: string]: number },
  periods: number
}
