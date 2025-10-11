import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth/stores/auth-store';

@Component({
    selector: 'sa-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('admin-web');
    private authStore = inject(AuthStore);
    private router = inject(Router);
    constructor() {
        // 全局 effect 注册一次
        effect(() => {
            if (!this.authStore.isLoggedIn()) {
                // 避免重复 navigate 导致错误
                if (this.router.url !== '/login') {
                    this.router.navigate(['/login']);
                }
            }
        });
    }
}
