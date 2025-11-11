import { Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../models';
import { LayoutStore } from '../../../services';

@Component({
    selector: 'app-side-menu-item',
    imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './side-menu-item.html',
    styleUrl: './side-menu-item.scss',
})
export class SideMenuItem {
    readonly item = input.required<MenuItem>();
    readonly depth = input<number>(1);

    private readonly layoutStore = inject(LayoutStore);
    protected readonly isCollapsed = this.layoutStore.isCollapsed;

    protected readonly nestedMenuOpened = signal(false);

    protected toggleNestedMenu = () => {
        this.nestedMenuOpened.set(!this.nestedMenuOpened());
    };
}
