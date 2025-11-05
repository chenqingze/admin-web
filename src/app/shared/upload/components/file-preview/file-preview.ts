import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UploadFileInfo } from '../../models';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { UploadService } from '../../services';

@Component({
    selector: 'sa-file-preview',
    imports: [CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule, NgOptimizedImage],
    templateUrl: './file-preview.html',
    styleUrl: './file-preview.scss',
})
export class FilePreview {
    private readonly fileService = inject(UploadService);
    readonly file = input<UploadFileInfo | null>();
    readonly fileIndex = input.required<number>();
    readonly isImage = computed(() => this.fileService.isImage(this.file()));
    readonly remove = output<number>();

    removeFile(event: MouseEvent) {
        event.stopPropagation();
        this.remove.emit(this.fileIndex());
    }

    cancelUpload(): void {
        this.fileService.cancelUpload(this.file()!);
    }
}
