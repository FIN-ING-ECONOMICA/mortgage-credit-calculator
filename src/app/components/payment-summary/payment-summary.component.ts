import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from "../../services/shared.service";
import { PaymentTableComponent } from "../payment-table/payment-table.component";
import { FinancialService } from "../../services/financial.service";

@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [CommonModule, PaymentTableComponent],
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent {

  headersAndValues = {}
  currency: string = ''

  constructor(private sharedService: SharedService, private financialService: FinancialService) {
    console.log('Payment Summary:', this.sharedService.loan)
    this.currency = this.financialService.getCurrency(this.sharedService.loan)
    this.headersAndValues = this.getLoanValues()
  }

  getLoanValues() {
    return {
      'Precio de Venta': this.currency + ' ' + this.sharedService.loan.realStatePrice,
      '% Cuota Inicial': this.sharedService.loan.initialPaymentPercentage + '%',
      'Préstamo': this.currency + ' '  + this.sharedService.loan.initialPayment,
      'Frecuencia': this.sharedService.loan.paymentFrequency,
      'Cantidad de años': this.sharedService.loan.years,
      'Cantidad de periodos': this.sharedService.loan.periods,
      'Divisa': this.sharedService.loan.currency
    }
  }
}
