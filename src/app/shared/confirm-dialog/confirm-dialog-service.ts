import { inject, Injectable } from '@angular/core';
import { ConfirmDialog } from './confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogData } from './confirm-dialog-data';

@Injectable({
    providedIn: 'root',
})
export class ConfirmDialogService {
    private readonly dialog = inject(MatDialog);

    confirm(message: string, options: Partial<ConfirmDialogData> = {}): Observable<boolean> {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '320px',
            data: {
                title: options.title,
                message,
                confirmText: options.confirmText,
                cancelText: options.cancelText,
            },
        });

        return dialogRef.afterClosed();
    }
}
