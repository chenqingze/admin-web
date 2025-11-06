import { AfterViewInit, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CollectionService } from '../../services/collection-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CollectionFormDialog } from './dialogs/collection-form-dialog/collection-form-dialog';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Collection } from '@models';
import { PaginatorProps } from '@ui';

@Component({
    selector: 'sa-collection-list-page',
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
    ],
    templateUrl: './collection-list-page.html',
    styleUrl: './collection-list-page.scss',
})
export class CollectionListPage implements AfterViewInit {
    private readonly collectionService = inject(CollectionService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);

    @ViewChild(MatSort) protected sort!: MatSort;

    protected dataSource = new MatTableDataSource<Collection>();
    protected displayedColumns = ['select', 'name', 'mediaPath', 'actions'];
    protected selection = new SelectionModel<Collection>(true, []);
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
            this.collectionService.getPage({ page: pageIndex, size: pageSize }).subscribe((data) => {
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

    protected openDialog(id?: string) {
        const dialogRef = this.dialog.open(CollectionFormDialog, {
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
        this.collectionService.delete(id).subscribe({
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
        this.collectionService.deleteByIds(this.selectedIds);
    }
}
