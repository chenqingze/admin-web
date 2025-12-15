import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../services';
import { LoginRequest } from '../../models';

@Component({
    selector: 'app-login-page',
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
    private readonly fb = inject(FormBuilder);
    private readonly authFacade = inject(AuthFacade);
    private readonly snackBar = inject(MatSnackBar);
    private readonly router = inject(Router);

    protected readonly hidePassword = signal(true);

    protected clickEvent(event: MouseEvent) {
        this.hidePassword.set(!this.hidePassword());
        event.stopPropagation();
    }

    protected loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        otp: [''],
        rememberMe: [false, Validators.required],
    });

    @HostListener('document:keydown.enter', [])
    protected login(): void {
        this.loginForm.disable();
        // console.log(this.loginForm.value);
        this.authFacade
            .login(this.loginForm.value as LoginRequest)
            .pipe(finalize(() => this.loginForm.enable()))
            .subscribe({
                next: () => {
                    const redirect = this.authFacade.getRedirectUrl() || '';
                    this.authFacade.setRedirectUrl(null);
                    this.router.navigateByUrl(redirect);
                },
                error: (err) => {
                    let message = '用户名或密码错误!';
                    if (err.status === 0) {
                        message = '无法连接服务器，请检查网络或稍后再试。';
                    }
                    this.snackBar.open(message, '关闭', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                },
            });
    }
}
