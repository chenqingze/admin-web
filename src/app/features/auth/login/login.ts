import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckbox } from '@angular/material/checkbox';
import { LoginRequest } from '../../../core/auth/models/login-request';
import { AuthStore } from '../../../core/auth/stores/auth-store';

@Component({
    selector: 'sa-login-page',
    imports: [
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        MatCheckbox,
        FormsModule,
        MatLabel,
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    private fb = inject(FormBuilder);
    private authStore = inject(AuthStore);
    private snackBar = inject(MatSnackBar);

    loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        otp: [''],
        rememberMe: [false, Validators.required],
    });

    onSubmit(): void {
        this.loginForm.disable();
        this.authStore
            .login(this.loginForm.value as LoginRequest)
            .pipe(finalize(() => this.loginForm.enable()))
            .subscribe({
                error: () => {
                    this.snackBar.open('用户名或密码错误!', '', {
                        duration: 3000,
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                    });
                },
            });
    }
}
