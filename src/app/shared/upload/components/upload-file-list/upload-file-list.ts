import { Component, inject, input, model } from '@angular/core';
import { UploadFileInfo } from '../../models';
import { FileService } from '../../services/file-service';
import { FileSelect } from '../../../directives/file-select';
import { MatIconModule } from '@angular/material/icon';
import { UploadFile } from '../upload-file/upload-file';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpEventType, HttpProgressEvent } from '@angular/common/http';

@Component({
    selector: 'sa-upload-file-list',
    imports: [MatIconModule, MatSnackBarModule, FileSelect, UploadFile],
    templateUrl: './upload-file-list.html',
    styleUrl: './upload-file-list.scss',
})
export class UploadFileList {
    private readonly snackBar = inject(MatSnackBar);
    private readonly fileService = inject(FileService);

    maxFiles = input<number | null>();
    fileList = model<UploadFileInfo[]>([]);

    onSelected(files: FileList | null) {
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
                const newUploadFile: UploadFileInfo = {
                    file,
                    hash: '',
                    id: '',
                    message: '',
                    name: '',
                    path: undefined,
                    percentage: 0,
                    status: 'PENDING',
                };
                this.fileList.update((fileList) => [...fileList, newUploadFile]);
                newUploadFile.sub = this.fileService.uploadFile(file).subscribe({
                    next: (event) => {
                        // 同步上传进度和状态
                        if (event.type === HttpEventType.UploadProgress) {
                            newUploadFile.status = 'UPLOADING';
                            const progressEvent = event as HttpProgressEvent;
                            if (progressEvent.total) {
                                newUploadFile.percentage = Math.round(
                                    (progressEvent.loaded / progressEvent.total) * 100,
                                );
                            }
                        } else if (event.type === HttpEventType.Response) {
                            newUploadFile.message = 'Upload Success!';
                            newUploadFile.percentage = 100;
                            newUploadFile.status = 'SUCCESS';
                            const { name, path, hash } = (event.body || {}) as UploadFileInfo;
                            newUploadFile.name = name;
                            newUploadFile.path = path;
                            newUploadFile.hash = hash;
                            //  todo: create image  request
                        }
                        this.fileList.update((fileList) => [...fileList]);
                    },
                    error: (err) => {
                        console.log(err);
                        newUploadFile.message = 'Upload Failed!';
                        newUploadFile.percentage = 0;
                        newUploadFile.status = 'ERROR';
                        this.fileList.update((fileList) => [...fileList]);
                    },
                });
            }
        }
    }

    // 辅助函数：显示文件大小 (MB)
    public getFileSize(file: File): string {
        const sizeInMB = file.size / (1024 * 1024);
        return `${sizeInMB.toFixed(2)} MB`;
    }

    // 辅助函数：判断文件是否为图片
    public isImage(file: File): boolean {
        return file.type.startsWith('image/');
    }
}
