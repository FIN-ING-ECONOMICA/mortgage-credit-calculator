import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from "../../services/shared.service";

@Component({
  selector: 'app-van-tir',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './van-tir.component.html',
  styleUrls: ['./van-tir.component.scss']
})
export class VanTirComponent {

  constructor(private sharedService: SharedService) {
    console.log(this.sharedService.cashFlow)
  }
}
