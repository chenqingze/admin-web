import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guards/guest-guard';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./core/layout/layout').then((m) => m.Layout),
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
            },
        ],
    },

    // auth
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    },

    // demo
    {
        path: 'address',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./features/demo/address-form/address-form.component').then((m) => m.AddressFormComponent),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/demo/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    },
    {
        path: 'drag-drag',
        loadComponent: () => import('./features/demo/drag-drag/drag-drag.component').then((m) => m.DragDragComponent),
    },
    {
        path: 'navigation',
        loadComponent: () =>
            import('./features/demo/navigation/navigation.component').then((m) => m.NavigationComponent),
    },
    {
        path: 'table',
        loadComponent: () => import('./features/demo/table/table.component').then((m) => m.TableComponent),
    },
    {
        path: 'tree',
        loadComponent: () => import('./features/demo/tree/tree.component').then((m) => m.TreeComponent),
    },
];
