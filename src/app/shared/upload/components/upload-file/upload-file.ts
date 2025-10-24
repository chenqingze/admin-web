import { Component, inject, input, model, output } from '@angular/core';
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
    readonly file = model<UploadFileInfo>();
    readonly fileIndex = model<number>();
    readonly icon = input<string>('cloud_upload');
    readonly remove = output<number>();

    // 移除选中的文件
    public removeFile(): void {
        if (this.fileIndex()) {
            this.remove.emit(this.fileIndex()!);
        }
    }

    cancelUpload(): void {
        this.fileService.cancelUpload(this.file()!);
    }
}
