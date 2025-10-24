import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { UPLOAD_URL } from '@core/api/http-providers';
import { UploadFileInfo, UploadFileResponse } from '../models';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private readonly uploadEndpoint = inject(UPLOAD_URL);
    private readonly http = inject(HttpClient);

    private _fileList = signal<UploadFileInfo[]>([]);
    private readonly fileList = this._fileList.asReadonly();

    setFileList(fileList: UploadFileInfo[]) {
        this._fileList.set(fileList);
    }

    addFile(file: UploadFileInfo) {
        this._fileList.update((fileList) => [...fileList, file]);
    }

    removeFile(index: number) {
        this._fileList.update((fileList) => fileList.splice(index, 1));
    }

    uploadFile(file: File) {
        const formData = new FormData();
        // 确保 'file' 与后端接收文件的字段名一致
        formData.append('file', file, file.name);

        return this.http
            .post<UploadFileResponse>(this.uploadEndpoint, formData, {
                reportProgress: true, // 启用进度报告
                observe: 'events', // 观察所有事件
            })
            .pipe(
                finalize(() => console.log('上传完成!')), // 无论成功失败，上传完成后都调用 reset
            );
    }

    // 取消上传
    cancelUpload(uploadFile: UploadFileInfo) {
        uploadFile.sub?.unsubscribe();
        uploadFile.status = 'CANCELED';
        uploadFile.percentage = 0;
    }
}
