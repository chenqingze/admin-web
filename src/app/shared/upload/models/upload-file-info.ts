import { Subscription } from 'rxjs';

export const UPLOAD_FILE_STATUS_OPTIONS = [
    'PENDING', //  等待上传、还未开始
    'UPLOADING', // 正在上传中
    'SUCCESS', // 上传成功
    'ERROR', // 上传失败
    'CANCELED', // 上传被用户取消
    'REMOVED', // 文件被移除（可能是在任何状态之前或之后,批量文件管理时会用到)
] as const;

export type UploadFileStatus = (typeof UPLOAD_FILE_STATUS_OPTIONS)[number];

export interface UploadFileInfo {
    file?: File | null;
    id?: string | null;
    name?: string;
    path?: string | null;
    hash?: string | null;
    type?: 'IMAGE' | string | null;
    batchId?: string | null;
    percentage?: number; // 进度百分比 (0 - 100)
    status: UploadFileStatus; // 上传状态
    message?: string; // 错误或成功消息
    sub?: Subscription;
}
