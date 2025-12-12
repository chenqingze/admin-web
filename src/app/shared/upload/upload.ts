import { booleanAttribute, Component, inject, input, model } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UploadFileInfo } from './models';
import { BooleanInput } from '@angular/cdk/coercion';
import { UploadService } from './services';
import { FilePreview } from './components';
import { FileSelect } from '@directives';

@Component({
    selector: 'app-upload',
    imports: [MatIconModule, MatSnackBarModule, FileSelect, FilePreview],
    templateUrl: './upload.html',
    styleUrl: './upload.scss',
})
export class Upload {
    private readonly snackBar = inject(MatSnackBar);
    private readonly fileService = inject(UploadService);

    readonly previewWidth = input('5rem');
    readonly previewHeight = input('5rem');
    readonly multiple = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
    readonly uploadType = input<'drag-drop' | 'list-card'>('list-card');
    readonly listCardIcon = input<string>('add');
    readonly listCardText = input('');
    readonly maxFiles = input<number | null>();
    readonly fileList = model<UploadFileInfo[]>([]);

    /**
     * 选择文件
     * @param files
     * @protected
     */
    protected onSelected(files: FileList | null) {
        // console.log('onSelected', files);
        if (this.maxFiles() && this.fileList().length + (files?.length ?? 0) > this.maxFiles()!) {
            this.snackBar.open(
                `最多只能上传 ${this.maxFiles()} 个文件,您还可以继续上传 ${this.maxFiles()! - this.fileList().length} 个文件`,
                '',
                {
                    duration: 5000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                },
            );
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
    protected onRemove(index: number) {
        this.fileList.update((fileList) => {
            // 取消上传
            this.fileService.cancelUpload(this.fileList()[index]);
            // 删除上传文件
            fileList.splice(index, 1);
            return [...fileList];
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
