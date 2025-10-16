import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuItem } from '../../../models/menu-item';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutStore } from '../../store/layout-store';
import { SideMenuItem } from './side-menu-item/side-menu-item';

@Component({
    selector: 'sa-sidebar',
    imports: [CommonModule, MatListModule, MatToolbarModule, MatSlideToggleModule, SideMenuItem],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private layoutStore = inject(LayoutStore);

    canCollapse = this.layoutStore.canCollapse;
    isCollapsed = this.layoutStore.isCollapsed;

    menuItems = signal<MenuItem[]>([
        {
            path: 'dashboard',
            icon: 'dashboard',
            label: '商品目录',
            children: [
                { path: 'product-list', icon: 'home', label: 'Videos' },
                { path: 'collection', icon: 'home', label: 'Analytics' },
                { path: 'brand', icon: 'home', label: 'Settings' },
                { path: 'collection', icon: 'home', label: 'Analytics' },
                { path: 'brand', icon: 'home', label: 'Settings' },
                { path: 'collection', icon: 'home', label: 'Analytics' },
            ],
        },
        { path: '/product-list', icon: 'video_library', label: 'Videos' },
        { path: '/collection', icon: 'bar_chart', label: 'Analytics' },
        { path: '/brand', icon: 'settings', label: 'Settings' },
        { path: '/collection', icon: 'bar_chart', label: 'Analytics' },
        { path: '/brand', icon: 'settings', label: 'Settings' },
        { path: '/collection', icon: 'bar_chart', label: 'Analytics' },
        { path: '/brand', icon: 'settings', label: 'Settings' },
        { path: '/product-list', icon: 'video_library', label: 'Videos' },
        { path: '/collection', icon: 'bar_chart', label: 'Analytics' },
        { path: '/brand', icon: 'settings', label: 'Settings' },
        { path: '/collection', icon: 'bar_chart', label: 'Analytics' },
        { path: '/brand', icon: 'settings', label: 'Settings' },
        { path: '/collection', icon: 'bar_chart', label: 'Analytics' },
        { path: '/brand', icon: 'settings', label: 'Settings' },
    ]);

    onCanCollapseValueChange(event: MatSlideToggleChange) {
        this.layoutStore.setCanCollapse(event.checked);
    }
}
