import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
    // admin
    {
        path: '',
        // canActivate: [authGuard],
        loadComponent: () => import('./core/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
                data: {},
            },
            // catalog
            {
                path: 'product-list',
                loadComponent: () =>
                    import('./features/catalog/product/product-list/product-list').then((m) => m.ProductList),
            },
            {
                path: 'collection',
                loadComponent: () => import('./features/catalog/collection/collection').then((m) => m.Collection),
            },
            { path: 'brand', loadComponent: () => import('./features/catalog/brand/brand').then((m) => m.Brand) },

            // demo
            {
                path: 'address',
                loadComponent: () =>
                    import('./features/demo/address-form/address-form.component').then((m) => m.AddressFormComponent),
            },
            {
                path: 'drag-drag',
                loadComponent: () =>
                    import('./features/demo/drag-drag/drag-drag.component').then((m) => m.DragDragComponent),
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
        ],
    },

    // auth
    {
        path: 'auth',
        canActivate: [guestGuard],
        loadComponent: () => import('./core/layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
            },
        ],
    },
];
