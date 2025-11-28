import { Component, effect, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../models';
import { LayoutStore } from '../../../services';
import { SkipNavigation } from '@directives';

@Component({
    selector: 'app-side-menu-item',
    imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, RouterModule, SkipNavigation],
    templateUrl: './side-menu-item.html',
    styleUrl: './side-menu-item.scss',
})
export class SideMenuItem {
    private readonly router = inject(Router);
    readonly currentRoutePath = input.required<string>();
    readonly item = input.required<MenuItem>();
    readonly depth = input<number>(1);

    private readonly layoutStore = inject(LayoutStore);
    protected readonly isCollapsed = this.layoutStore.isCollapsed;

    protected readonly nestedMenuOpened = signal(false);

    constructor() {
        effect(() => {
            if (this.matches(this.currentRoutePath(), this.item())) {
                this.nestedMenuOpened.set(true);
            }
        });
    }

    protected toggleNestedMenu = () => {
        this.nestedMenuOpened.set(!this.nestedMenuOpened());
    };

    // 判断自己或后代是否匹配当前 url（是否包含当前 route）
    private matches = (currentRoutePath: string, node: MenuItem): boolean => {
        if (node.path && currentRoutePath.startsWith(node.path)) return true;
        if (!node.children) return false;
        return node.children.some((child) => this.matches(currentRoutePath, child));
    };
}
