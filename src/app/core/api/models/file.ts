export const MEDIA_TYPE_OPTIONS = ['IMAGE', 'VIDEO'];
export type MediaType = (typeof MEDIA_TYPE_OPTIONS)[number];

export interface File {
    id?: string;
    path?: string;
    hash?: string;
    type?: MediaType;
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}
export type FileInfo = File;
export type Media = File;
export type Image = File;
