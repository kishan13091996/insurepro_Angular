import { Component, inject } from '@angular/core';
import { FormBuilder, Validators ,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthStateServiceService } from '../../services/auth-state-service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(Router);
  private authState = inject(AuthStateServiceService);

  loginForm =  this.fb.nonNullable.group({
    username :['',Validators.required],
    password :['',Validators.required],
  })

  login(){
    if(this.loginForm.invalid)
      return

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: response => {
        this.authService.saveUserData(response);
        this.route.navigate(['/dashboard']);
        console.log(sessionStorage.getItem('token'));
        this.authState.setUser(this.loginForm.getRawValue().username,response.role);
      },
      error: err =>{
        alert( 'Invalid credentials')
      }
    })
  }

}
