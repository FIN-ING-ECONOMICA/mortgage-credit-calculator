export interface Loan {
  realStatePrice: number,
  initialPaymentPercentage: number,
  initialPayment: number,
  tea: number,
  tep: number,
  paymentFrequency: string,
  years: number,
  periods: number,
  currency: string,
  mortgageTransfer: number,
  administrativeExpenses: number,
  mortgageLifeInsurance: number,
  mortgageLifeInsurancePercentage: number,
  allRiskInsurance: number,
  allRiskInsurancePercentage: number,
  insuredAmount: number
}
