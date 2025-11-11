import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmData } from './confirm-data';

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
    // private readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
    protected readonly data = inject<ConfirmData>(MAT_DIALOG_DATA);
}
