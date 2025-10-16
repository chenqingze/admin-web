import { Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../models/menu-item';
import { LayoutStore } from '../../../store/layout-store';

@Component({
    selector: 'sa-side-menu-item',
    imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './side-menu-item.html',
    styleUrl: './side-menu-item.scss',
})
export class SideMenuItem {
    private layoutStore = inject(LayoutStore);

    isCollapsed = this.layoutStore.isCollapsed;

    item = input.required<MenuItem>();

    depth = input<number>(1);

    nestedMenuOpened = signal(false);

    toggleNestedMenu = () => {
        this.nestedMenuOpened.set(!this.nestedMenuOpened());
    };
}
