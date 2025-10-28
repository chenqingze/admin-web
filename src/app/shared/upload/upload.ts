import { Component, inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UploadFileInfo } from './models';
import { UploadService } from './services/upload-service';
import { FilePreview } from './components/file-preview/file-preview';
import { FileSelect } from '../directives/file-select';

@Component({
    selector: 'sa-upload',
    imports: [CommonModule, MatIconModule, MatSnackBarModule, FileSelect, FilePreview],
    templateUrl: './upload.html',
    styleUrl: './upload.scss',
})
export class Upload {
    private readonly snackBar = inject(MatSnackBar);
    private readonly fileService = inject(UploadService);

    maxFiles = input<number | null>();
    fileList = model<UploadFileInfo[]>([]);
    valueKey = input<'id' | 'path' | string>('id');

    /**
     * 选择文件
     * @param files
     * @protected
     */
    protected onSelected(files: FileList | null) {
        console.log('onSelected', files);
        if (!files || (this.maxFiles() && files?.length > this.maxFiles()!)) {
            this.snackBar.open(`最多只能选择 ${this.maxFiles()} 个文件`, '', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
            return;
        }

        if (files && files?.length > 0) {
            for (const file of files) {
                const newUploadInfo: UploadFileInfo = {
                    file,
                    percentage: 0,
                    status: 'PENDING',
                };
                this.fileList.update((items) => [...items, newUploadInfo]);
                newUploadInfo.sub = this.fileService.uploadAndSave(file).subscribe((updatedInfo) => {
                    Object.assign(newUploadInfo, updatedInfo);
                    this.fileList.update((items) => [...items]);
                });
            }
        }
    }

    /**
     * 删除文件
     * @param index 图片索引
     * @protected
     */
    protected onRemoveFile(index: number) {
        // console.log('onRemoveFile', index);
        this.fileList.update((fileList) => {
            // 取消上传
            this.fileService.cancelUpload(this.fileList()[index]);
            // 删除上传文件
            fileList.splice(index);
            return fileList;
        });
    }

    /**
     * 辅助函数：显示文件大小 (MB)
     */
    public getFileSize(file: File): string {
        const sizeInMB = file.size / (1024 * 1024);
        return `${sizeInMB.toFixed(2)} MB`;
    }
}
