import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private authService: AuthService, private router: Router) {
  }

  submitForm() {
    let user = {
      email: this.signInForm.value.email ?? '',
      password: this.signInForm.value.password ?? ''
    }

    this.authService.login(user).subscribe(
      isLoggedIn => {
        if (isLoggedIn) {
          console.log("Successful")
          this.router.navigate([''])
        } else {
          console.log("Failed")
        }
    });
  }
}
