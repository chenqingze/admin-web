import { Subscription } from 'rxjs';

export interface UploadFileInfo {
    file?: File | null;
    id?: string;
    name?: string;
    path?: string | null;
    hash?: string;
    type?: string | null;
    batchId?: string | null;
    percentage: number; // 进度百分比 (0 - 100)
    status: 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR' | 'CANCELED' | 'REMOVED'; // 上传状态
    message?: string; // 错误或成功消息
    sub?: Subscription;
}
