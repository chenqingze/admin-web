import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { UploadFileInfo } from '@shared/upload';

@Component({
    selector: 'app-media-selector-dialog',
    imports: [MatDialogModule, MatButtonModule, NgOptimizedImage],
    templateUrl: './media-selector-dialog.html',
    styleUrl: './media-selector-dialog.scss',
})
export class MediaSelectorDialog {
    private readonly data = inject<UploadFileInfo[]>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<MediaSelectorDialog>);
    protected readonly mediaList = signal<UploadFileInfo[]>([]);

    constructor() {
        if (this.data) {
            this.mediaList.set(this.data);
        }
    }

    protected selectImage(media: UploadFileInfo) {
        this.dialogRef.close(media);
    }
}
