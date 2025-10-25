import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UploadFileInfo } from '../../models';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { FileService } from '../../services/file-service';

@Component({
    selector: 'sa-upload-file',
    imports: [CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule, NgOptimizedImage],
    templateUrl: './upload-file.html',
    styleUrl: './upload-file.scss',
})
export class UploadFile {
    private readonly fileService = inject(FileService);
    readonly file = input<UploadFileInfo | null>();
    readonly fileIndex = input.required<number>();
    readonly isImage = computed(() => this.fileService.isImage(this.file()?.file));
    readonly removeFile = output<number>();

    cancelUpload(): void {
        this.fileService.cancelUpload(this.file()!);
    }
}
