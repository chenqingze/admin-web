import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Route, Router } from '@angular/router';
import { MenuItem } from '../../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutStore } from '../../services';
import { RouteExtraData } from '../../../routing';
import { SideMenuItem } from './side-menu-item';

@Component({
    selector: 'sa-sidebar',
    imports: [CommonModule, MatListModule, MatToolbarModule, MatButtonModule, SideMenuItem, MatIconModule],
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

    toggleCanCollapse() {
        this.layoutStore.toggleCanCollapse();
    }

    // todo:目前是前端从路由动态生成菜单并根据权限过滤菜单,后面完善支持后端管理菜单
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
