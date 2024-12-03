import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {UserService} from '../../services/user.service'
import { User } from '../../models/User';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NgbAlertModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  loginForm!: FormGroup;
  showPassword!: boolean;
  user!: User;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  private _message$ = new Subject<string>();
  error = '';

  constructor(private userService: UserService, private router: Router) { 
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.error = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required ,Validators.minLength(8)]),
    });
    this.showPassword = false;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    const email= this.loginForm.get('email')?.value;
    const password= this.loginForm.get('password')?.value;
    this.userService.login(email,password)
    .subscribe(
      (response: any) => {
        if(response.role==="Admin"){
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigateByUrl('/admin');  
        }else {
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigateByUrl('/home');  
        }
      },
      (error: any) => {
        this._message$.next(`error user not found`);
      }
    );
  }
}
