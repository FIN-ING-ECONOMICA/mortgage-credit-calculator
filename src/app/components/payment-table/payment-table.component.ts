import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodicPayment } from "../../models/periodic-payment";

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss']
})
export class PaymentTableComponent {

  tableData: Array<PeriodicPayment> = [
    { paymentIndex: 1, initialBalance: 1400000, finalBalance: 1285950.02, tea: 9, tep: 4.4030651, interestAmount: 63404.14, periodicPayment: 217454.11, amortization: 154049.98, paymentFrequency: { 'Semestral': 180 }, periods: 8 }
  ]
  tableHeaders: Array<string> = [
    'N°',
    'TEA',
    'TEP',
    'Saldo Inicial',
    'Interés',
    'Cuota',
    'Amortización',
    'Saldo Final'
  ]
}
