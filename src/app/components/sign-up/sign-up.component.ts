import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    phone: new FormControl(''),
    birthdate: new FormControl(''),
    homeAddress: new FormControl('')
  });

  constructor(private authService: AuthService) {
  }

  submitForm() {
    let user: User = {
      name: this.signUpForm.value.firstName ?? '',
      lastName: this.signUpForm.value.lastName ?? '',
      email: this.signUpForm.value.email ?? '',
      password: this.signUpForm.value.password ?? '',
      phone: this.signUpForm.value.phone ?? '',
      birthdate: new Date(this.signUpForm.value.birthdate ?? ''),
      homeAddress: this.signUpForm.value.homeAddress ?? ''
    }

    this.authService.createUser(user).subscribe();
  }
}
