import { AfterViewInit, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { NgOptimizedImage } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { ProductService } from '../../services/product-service';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Product } from '@models';
import { PaginatorProps } from '@ui';
import { Confirm } from '@directives';

@Component({
    selector: 'app-product-list-page',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        NgOptimizedImage,
        RouterLink,
        Confirm,
    ],
    templateUrl: './product-list-page.html',
    styleUrl: './product-list-page.scss',
})
export class ProductListPage implements AfterViewInit {
    private readonly productService = inject(ProductService);
    private readonly snackBar = inject(MatSnackBar);

    @ViewChild(MatSort) protected sort!: MatSort;

    protected dataSource = new MatTableDataSource<Product>();
    protected displayedColumns = ['select', 'mainMediaPath', 'name', 'actions'];
    protected selection = new SelectionModel<Product>(true, []);
    get selectedIds(): string[] {
        return this.selection.selected.map((item) => item.id!);
    }
    protected readonly paginatorProps = signal<PaginatorProps>({
        pageIndex: 0,
        pageSize: 5,
    });

    protected readonly totalElements = signal(0);

    constructor() {
        effect(() => {
            const { pageIndex, pageSize } = this.paginatorProps();
            this.productService.getPage({ page: pageIndex, size: pageSize }).subscribe((data) => {
                const { page, content } = data;
                this.dataSource.data = content;
                this.totalElements.set(Number(page.totalElements));
            });
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    protected isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    protected toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    protected onPageEvent(e: PageEvent) {
        const { pageSize, pageIndex } = e;
        this.paginatorProps.update((props) => ({ ...props, pageIndex, pageSize }));
    }

    protected delete(id: string) {
        this.productService.delete(id).subscribe({
            next: () => {
                this.snackBar.open('删除成功', '关闭', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
                this.paginatorProps.set({ ...this.paginatorProps(), pageIndex: 0 });
            },
            error: () =>
                this.snackBar.open('删除失败，请稍后再试', '关闭', {
                    duration: 3000,
                    panelClass: ['snack-error'],
                }),
        });
    }

    protected deleteSelected() {
        this.productService.deleteByIds(this.selectedIds).subscribe({
            next: () => {
                this.snackBar.open('删除成功', '关闭', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
                this.paginatorProps.set({ ...this.paginatorProps(), pageIndex: 0 });
            },
            error: () =>
                this.snackBar.open('删除失败，请稍后再试', '关闭', {
                    duration: 3000,
                    panelClass: ['snack-error'],
                }),
        });
    }
}
