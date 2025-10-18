import { Component, effect, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuItem } from '../../../models/menu-item';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutStore } from '../../services/layout-store';
import { SideMenuItem } from './side-menu-item/side-menu-item';
import { Route, Router } from '@angular/router';
import { RouteExtraData } from '../../../models/route-extra-data';

@Component({
    selector: 'sa-sidebar',
    imports: [CommonModule, MatListModule, MatToolbarModule, MatSlideToggleModule, SideMenuItem],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private readonly router = inject(Router);
    private readonly layoutStore = inject(LayoutStore);

    canCollapse = this.layoutStore.canCollapse;
    isCollapsed = this.layoutStore.isCollapsed;

    menuItems = signal<MenuItem[]>([]);

    constructor() {
        const routes = this.router.config;
        this.menuItems.set(this.buildMenu(routes));
        effect(() => {
            console.log(this.menuItems());
        });
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
