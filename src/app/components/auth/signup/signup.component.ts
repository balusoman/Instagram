import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatButtonModule,FormsModule,MatInputModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(public authService:AuthService) { }

  onSignup(form:NgForm){
    if(form.invalid){
      return
    } 
    console.log(form.value)
    this.authService.createUser(form.value.email,form.value.password)
  }
}
