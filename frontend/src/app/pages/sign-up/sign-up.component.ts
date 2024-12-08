import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {UserService} from '../../services/user.service'
import { User } from '../../models/User';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  RegisterForm!: FormGroup;
  showPassword!: boolean;
  user!: User;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  private _message$ = new Subject<string>();
  error = '';
  formError: boolean = false;

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
    this.RegisterForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required ,Validators.minLength(8)]),
      firstname: new FormControl('' , [Validators.required ]),
      lastname: new FormControl('' , [Validators.required ]),
      phone : new FormControl('' , [Validators.required,Validators.pattern(/^\d{8}$/)]),
      address : new FormControl('' , [Validators.required]),
    });
    this.showPassword = false;
  }

  onSubmit() {
    this.RegisterForm.markAllAsTouched();
    if (this.RegisterForm.invalid) {
      this.formError = true;
      return;
    }

    this.user = {
      email: this.RegisterForm.get('email')?.value,
      password: this.RegisterForm.get('password')?.value,
      firstName: this.RegisterForm.get('firstname')?.value,
      lastName: this.RegisterForm.get('lastname')?.value,
      phone: this.RegisterForm.get('phone')?.value,
      address: this.RegisterForm.get('address')?.value
    };
    
    this.userService.register(this.user)
    .subscribe(
      (response: any) => {
        console.log(response);
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigateByUrl('/home');  
        
      },
      (error: any) => {
        console.error('Registration error:', error);
        this._message$.next(`Email Already signed In`);
      }
    );
  }
}
