import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest } from '../../../core/auth/models/login-request';
import { AuthStore } from '../../../core/auth/store/auth-store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'sa-login-page',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    private fb = inject(FormBuilder);
    private authStore = inject(AuthStore);
    private snackBar = inject(MatSnackBar);
    private router = inject(Router);
    hidePassword = signal(true);
    clickEvent(event: MouseEvent) {
        this.hidePassword.set(!this.hidePassword());
        event.stopPropagation();
    }
    loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        otp: [''],
        rememberMe: [false, Validators.required],
    });

    onSubmit(): void {
        this.loginForm.disable();
        console.log(this.loginForm.value);
        this.authStore
            .login(this.loginForm.value as LoginRequest)
            .pipe(finalize(() => this.loginForm.enable()))
            .subscribe({
                next: () => {
                    const redirect = this.authStore.getRedirectUrl() || '';
                    this.authStore.setRedirectUrl(null);
                    console.log('tiaozhuanle ma ', redirect);
                    this.router.navigateByUrl(redirect);
                },
                error: () => {
                    this.snackBar.open('用户名或密码错误!', '', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                },
            });
    }
}
