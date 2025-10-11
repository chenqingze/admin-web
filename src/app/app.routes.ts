import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/login-page/login-page';
import { DashboardPage } from './features/dashboard/dashboard-page/dashboard-page';
import { guestGuard } from './core/auth/guards/guest-guard';

export const routes: Routes = [
    { path: '', component: DashboardPage },

    // auth
    { path: 'login', canActivate: [guestGuard], component: LoginPage },
];
