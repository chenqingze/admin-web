import { Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LayoutStore } from '../store/layout-store';

@Component({
    selector: 'sa-admin-layout',
    imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, RouterOutlet, Sidebar, Header],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.scss',
})
export class AdminLayout {
    private layoutStore = inject(LayoutStore);

    canCollapse = this.layoutStore.canCollapse;
    isCollapsed = this.layoutStore.isCollapsed;

    width = computed(() => (this.isCollapsed() ? 64 : 250));

    onMouseEnter() {
        if (this.canCollapse()) {
            this.layoutStore.setIsCollapsed(false);
        }
    }

    onMouseLeave() {
        if (this.canCollapse()) {
            this.layoutStore.setIsCollapsed(true);
        }
    }
}
