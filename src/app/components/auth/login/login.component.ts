import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from "@angular/material/input";
import { AuthService } from '../services/auth-service.service';
import { User } from '../../user/models/user.model';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { MatExpansionModule } from "@angular/material/expansion";
import { ROUTE_PATHS } from '../../models/general.model';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInput, MatExpansionModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  readonly loginUser = signal<User>({});

  loginForm = new FormGroup({
    email: new FormControl('chelsie123@gmx.at', [Validators.required, Validators.email]),
    password: new FormControl('schnuFFi69'),
  });

  #authService = inject(AuthService);
  #router = inject(Router);

  onSubmit() {
    this.loginUser.set(this.loginForm.value);
    this.#authService.login(this.loginUser()).pipe(first()).subscribe((loginUser) => {
      this.loginUser.set(loginUser);
      this.#router.navigateByUrl(ROUTE_PATHS.SHOPPINGLIST);
    });
  }
}
