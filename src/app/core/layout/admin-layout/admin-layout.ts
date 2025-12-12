import { Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LayoutStore } from '../services';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressService } from '../../services';

@Component({
    selector: 'app-admin-layout',
    imports: [MatProgressBarModule, MatSidenavModule, MatButtonModule, MatIconModule, RouterOutlet, Sidebar, Header],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.scss',
})
export class AdminLayout {
    private readonly layoutStore = inject(LayoutStore);
    private readonly progressService = inject(ProgressService);

    protected isProgressing = this.progressService.isProgressing;

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
