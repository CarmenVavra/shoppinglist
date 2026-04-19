import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLabel, MatHint } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from '../services/auth-service.service';
import { first } from 'rxjs';
import { USER_TYPE } from '../models/auth.model';
import { Router } from '@angular/router';
import { User } from '../../user/models/user.model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatLabel,
    MatInputModule, MatNativeDateModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [provideNativeDateAdapter()],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {

  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,16}$/

  readonly registerUser = signal<User>({
    id: -1,
    username: '',
    email: '',
    password: '',
    roleId: USER_TYPE.USER,
  });

  #authService = inject(AuthService);
  #router = inject(Router);

  readonly loggedInUserRole = signal<number>(USER_TYPE.USER);

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    passwordRep: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loggedInUserRole.set(this.#authService.getStoredUser().roleId!);
    if (this.loggedInUserRole() != USER_TYPE.ADMIN) {
      this.#router.navigateByUrl('/login');
    }
  }

  onSubmit() {
    const pwCheck = this.comparePasswords(this.registerForm.value.password, '1230');
    if (pwCheck) {
      this.registerUser.set(this.registerForm.getRawValue());
      this.#authService.register(this.registerUser()).pipe(first()).subscribe((registerUser) => {
        console.log('registerUser', registerUser);
      });
    } else {
      this.registerForm.controls.password.reset();
      this.registerForm.controls.passwordRep.reset();
      console.log('Die Passwörter stimmen nicht überein!');
    }
  }

  private comparePasswords(pw1: any, pw2: any) {
    return pw1 === pw2;
  }
}
