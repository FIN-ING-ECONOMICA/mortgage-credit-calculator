import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from "../../services/shared.service";
import { PaymentTableComponent } from "../payment-table/payment-table.component";

@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [CommonModule, PaymentTableComponent],
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent {

  headersAndValues = {}

  constructor(private sharedService: SharedService) {
    console.log('Payment Summary:', this.sharedService.loan)
    this.headersAndValues = this.getLoanValues()
  }

  getLoanValues() {
    return {
      'Precio de Venta': 'S/' + this.sharedService.loan.realStatePrice,
      '% Cuota Inicial': this.sharedService.loan.initialPaymentPercentage + '%',
      'Préstamo': 'S/' + this.sharedService.loan.initialPayment,
      'Frecuencia': this.getFrequencyKey(this.sharedService.loan.paymentFrequency),
      'Cantidad de años': this.sharedService.loan.years,
      'Cantidad de periodos': this.sharedService.loan.periods,
      'Divisa': this.sharedService.loan.currency
    }
  }

  getFrequencyKey(frequency: object) {
    return Object.keys(frequency)[0]
  }
}
