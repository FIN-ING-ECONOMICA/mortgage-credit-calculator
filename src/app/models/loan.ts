export interface Loan {
  realStatePrice: number,
  initialPaymentPercentage: number,
  initialPayment: number,
  tea: number,
  tep: number,
  paymentFrequency: { [key: string]: number },
  years: number,
  periods: number
}
