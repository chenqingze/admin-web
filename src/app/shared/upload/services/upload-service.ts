import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { FileInfo, UPLOAD_URL } from '@api';
import { UploadFileInfo, UploadFileResponse } from '../models';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    private readonly uploadEndpoint = inject(UPLOAD_URL);
    private readonly http = inject(HttpClient);

    /**
     * 上传图片
     * @param file
     */
    uploadFile(file: File) {
        const formData = new FormData();

        // 确保 'file' 与后端接收文件的字段名一致
        formData.append('file', file, file.name);

        return this.http.post<UploadFileResponse>(this.uploadEndpoint, formData, {
            reportProgress: true, // 启用进度报告
            observe: 'events', // 观察所有事件
        });
    }

    saveFile(fileInfo: UploadFileInfo) {
        return this.http.post<FileInfo>('/files', fileInfo);
    }

    uploadAndSave(file: File): Observable<UploadFileInfo> {
        const uploadFileInfo: UploadFileInfo = {
            file,
            hash: '',
            id: '',
            message: '',
            name: '',
            path: undefined,
            type: 'IMAGE',
            percentage: 0,
            status: 'PENDING',
        };
        return this.uploadFile(file).pipe(
            switchMap((event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    // 上传中
                    uploadFileInfo.status = 'UPLOADING';
                    const progressEvent = event as HttpProgressEvent;
                    if (progressEvent.total) {
                        uploadFileInfo.percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    }
                    return of(uploadFileInfo);
                } else if (event.type === HttpEventType.Response) {
                    // 上传完成
                    uploadFileInfo.message = 'Upload Success!';
                    uploadFileInfo.percentage = 100;
                    uploadFileInfo.status = 'SUCCESS';
                    const { name, path, hash, type = 'IMAGE' } = (event.body || {}) as UploadFileInfo;
                    uploadFileInfo.name = name;
                    uploadFileInfo.path = path;
                    uploadFileInfo.hash = hash;
                    uploadFileInfo.type = type;
                    // 保存文件信息到数据库
                    return this.saveFile(uploadFileInfo).pipe(
                        map((fileInfo) => {
                            uploadFileInfo.id = fileInfo.id;
                            return uploadFileInfo;
                        }),
                        catchError((err) => {
                            console.log(err);
                            uploadFileInfo.status = 'ERROR';
                            uploadFileInfo.message = 'Save file info failed!';
                            return of(uploadFileInfo);
                        }),
                    );
                }
                return of(uploadFileInfo);
            }),
            catchError((err) => {
                console.log(err);
                uploadFileInfo.status = 'ERROR';
                uploadFileInfo.message = 'Upload Failed!';
                uploadFileInfo.percentage = 0;
                return of(uploadFileInfo);
            }),
        );
    }

    /**
     * 取消上传
     * @param uploadFile
     */
    cancelUpload(uploadFile: UploadFileInfo) {
        uploadFile.sub?.unsubscribe();
        uploadFile.status = 'CANCELED';
        uploadFile.percentage = 0;
    }

    /**
     * 辅助函数：判断文件是否为图片
     * @param fileInfo 文件
     */
    isImage(fileInfo?: UploadFileInfo | null): boolean {
        return fileInfo?.file?.type?.startsWith('image/') || fileInfo?.type === 'IMAGE';
    }
}
