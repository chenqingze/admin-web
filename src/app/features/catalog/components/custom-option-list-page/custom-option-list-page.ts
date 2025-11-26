import { Component, effect, inject, signal } from '@angular/core';
import { PageHeader } from '@components';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Confirm } from '@directives';
import { SelectionModel } from '@angular/cdk/collections';
import { PaginatorProps } from '@ui';
import { CustomOptionService } from '../../services';
import { CustomOption } from '@models/catalog/product/custom-option';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-custom-option-list-page',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        PageHeader,
        Confirm,
        RouterLink,
    ],
    templateUrl: './custom-option-list-page.html',
    styleUrl: './custom-option-list-page.scss',
})
export class CustomOptionListPage {
    private readonly customOptionService = inject(CustomOptionService);
    private readonly snackBar = inject(MatSnackBar);

    protected dataSource = new MatTableDataSource<CustomOption>();
    protected displayedColumns = ['select', 'name', 'values', 'associatedProductCount', 'actions'];
    protected selection = new SelectionModel<CustomOption>(true, []);
    get selectedIds(): string[] {
        return this.selection.selected.map((item) => item.id!);
    }

    protected readonly paginatorProps = signal<PaginatorProps>({
        pageIndex: 0,
        pageSize: 5,
    });
    protected readonly totalElements = signal(0);

    protected readonly searchForm = new FormGroup({
        name: new FormControl(null),
    });

    constructor() {
        effect(() => {
            const { pageIndex, pageSize } = this.paginatorProps();
            this.customOptionService.getPage({ page: pageIndex, size: pageSize }).subscribe((data) => {
                const { page, content } = data;
                this.dataSource.data = content;
                this.totalElements.set(Number(page.totalElements));
            });
        });
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

    protected search() {
        const { pageIndex, pageSize } = this.paginatorProps();
        this.customOptionService
            .getPage({ page: pageIndex, size: pageSize }, { name: this.searchForm.value.name })
            .subscribe((data) => {
                const { page, content } = data;
                this.dataSource.data = content;
                this.totalElements.set(Number(page.totalElements));
            });
    }

    protected delete(id: string) {
        this.customOptionService.delete(id).subscribe({
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
        this.customOptionService.deleteByIds(this.selectedIds).subscribe({
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
