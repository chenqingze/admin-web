export interface FileInfo {
    id?: string;
    path?: string;
    url?: string;
    hash?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}
export type Image = FileInfo;
export type Video = FileInfo;
