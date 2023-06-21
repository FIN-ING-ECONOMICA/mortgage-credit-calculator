import { Injectable } from '@angular/core';
import { DurationInputArg2, Moment} from "moment";

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  paymentFrequency: Record<string, number> = {
    Diario: 1,
    Quincenal: 15,
    Mensual: 30,
    Bimestral: 60,
    Trimestral: 90,
    Cuatrimestral: 120,
    Semestral: 180,
    Anual: 360
  }

  constructor() { }

  calculateDateDifference(startDate: Moment, endDate: Moment): number {
    const daysDifference = endDate.diff(startDate, 'days');
    return daysDifference;
  }

  convertDaysToMonths(days: number) {
    return days / 30;
  }

  // returns an array of dates
  getPaymentDates(startDate: Moment, periods: number, frequency: string): Moment[] {
    let paymentDates: Moment[] = [];
    let months: number = 1;
    let unitOfTime: DurationInputArg2 = 'months';

    if (frequency === 'Diario') {
      unitOfTime = 'days';
    } else if (frequency === 'Quincenal') {
      months = this.paymentFrequency[frequency]
      unitOfTime = 'days';
    } else {
      unitOfTime = 'months'
      months = this.convertDaysToMonths(this.paymentFrequency[frequency])
    }

    for (let i: number = 0; i <= periods; i++) {
      paymentDates.push(startDate.clone().add(months * i, unitOfTime))
    }

    return paymentDates;
  }
}
