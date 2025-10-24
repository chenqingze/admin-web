export interface File {
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
export type Image = File;
export type Video = File;
