import { Component, effect, inject, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BrandService } from '../services/brand-service';
import { Brand } from '@models';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaginatorProps } from '@ui';
import { MatIconModule } from '@angular/material/icon';
import { BrandFormDialog } from '../brand-form-dialog/brand-form-dialog';
import { Confirm } from '@directives';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-brand-list-page',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatFormField,
        MatInput,
        MatLabel,
        NgOptimizedImage,
        Confirm,
        ReactiveFormsModule,
    ],
    templateUrl: './brand-list-page.html',
    styleUrl: './brand-list-page.scss',
})
export class BrandListPage {
    private readonly brandService = inject(BrandService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);

    protected dataSource = new MatTableDataSource<Brand>([]);
    protected displayedColumns = ['select', 'name', 'mediaPath', 'actions'];
    protected selection = new SelectionModel<Brand>(true, []);
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
            this.brandService.getPage({ page: pageIndex, size: pageSize }).subscribe((data) => {
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
        }
        return this.selection.select(...this.dataSource.data);
    }

    protected onPageEvent(e: PageEvent) {
        const { pageSize, pageIndex } = e;
        this.paginatorProps.update((props) => ({ ...props, pageIndex, pageSize }));
    }

    protected search() {
        const { pageIndex, pageSize } = this.paginatorProps();
        this.brandService
            .getPage({ page: pageIndex, size: pageSize }, { name: this.searchForm.value.name })
            .subscribe((data) => {
                const { page, content } = data;
                this.dataSource.data = content;
                this.totalElements.set(Number(page.totalElements));
            });
    }

    protected openDialog(id?: string) {
        const dialogRef = this.dialog.open(BrandFormDialog, {
            data: id,
            width: '560px',
            maxWidth: '720px',
            maxHeight: 'calc(100vw - 32px)',
        });

        dialogRef.afterClosed().subscribe((data) => {
            // console.log('The dialog was closed', data);
            if (data) {
                this.paginatorProps.set({ ...this.paginatorProps(), pageIndex: 0 });
            }
        });
    }

    protected delete(id: string) {
        this.brandService.delete(id).subscribe({
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
        this.brandService.deleteByIds(this.selectedIds).subscribe({
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
