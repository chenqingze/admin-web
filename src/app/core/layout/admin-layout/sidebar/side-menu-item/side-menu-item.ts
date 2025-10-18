import { Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../models/menu-item';
import { LayoutStore } from '../../../services/layout-store';

@Component({
    selector: 'sa-side-menu-item',
    imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './side-menu-item.html',
    styleUrl: './side-menu-item.scss',
})
export class SideMenuItem {
    private readonly layoutStore = inject(LayoutStore);

    protected isCollapsed = this.layoutStore.isCollapsed;

    readonly item = input.required<MenuItem>();

    readonly depth = input<number>(1);

    protected nestedMenuOpened = signal(false);

    protected toggleNestedMenu = () => {
        this.nestedMenuOpened.set(!this.nestedMenuOpened());
    };
}
