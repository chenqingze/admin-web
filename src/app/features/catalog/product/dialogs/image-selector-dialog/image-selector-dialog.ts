import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UploadFileInfo } from '@shared/upload';

@Component({
    selector: 'sa-image-selector-dialog',
    imports: [CommonModule, MatDialogModule, MatButtonModule, NgOptimizedImage],
    templateUrl: './image-selector-dialog.html',
    styleUrl: './image-selector-dialog.scss',
})
export class ImageSelectorDialog {
    private readonly data = inject<UploadFileInfo[]>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<ImageSelectorDialog>);
    protected readonly imageList = signal<UploadFileInfo[]>([]);

    constructor() {
        if (this.data) {
            this.imageList.set(this.data);
        }
    }

    protected selectImage(image: UploadFileInfo) {
        this.dialogRef.close(image);
    }
}
