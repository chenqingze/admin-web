import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Route, Router } from '@angular/router';
import { SideMenuItem } from './side-menu-item/side-menu-item';
import { LayoutStore } from '../../services/layout-store';
import { RouteExtraData } from '../../../routing/models';
import { MenuItem } from '../../models';

@Component({
    selector: 'sa-sidebar',
    imports: [CommonModule, MatListModule, MatToolbarModule, MatSlideToggleModule, SideMenuItem],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private readonly router = inject(Router);
    private readonly layoutStore = inject(LayoutStore);

    protected readonly canCollapse = this.layoutStore.canCollapse;
    protected readonly isCollapsed = this.layoutStore.isCollapsed;

    protected readonly menuItems = signal<MenuItem[]>([]);

    constructor() {
        const routes = this.router.config;
        this.menuItems.set(this.buildMenu(routes));
    }

    onCanCollapseValueChange(event: MatSlideToggleChange) {
        this.layoutStore.setCanCollapse(event.checked);
    }

    private buildMenu(routes: Route[], parentPath = ''): MenuItem[] {
        const items: MenuItem[] = [];
        for (const r of routes) {
            const data = r.data as RouteExtraData;
            const {
                label = r.title as string,
                // perms = [], // todo: 通过permission 过滤 menuItem
                icon = '',
                showInMenu = false,
                isLayout = false,
                isVirtual = false,
            } = data ?? {};
            const path = parentPath + '/' + (r.path || '');
            if (isLayout && r.children) {
                items.push(...this.buildMenu(r.children, r.path));
            } else if (showInMenu) {
                const menuItem: MenuItem = {
                    path: isVirtual ? null : path,
                    icon,
                    label,
                };
                if (r.children) {
                    menuItem.children = this.buildMenu(r.children, path);
                }
                items.push(menuItem);
            }
        }
        return items;
    }
}
