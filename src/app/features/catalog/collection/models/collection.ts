import { CollectionRule } from './collection-rule';
import { CollectionType } from './collection-type';

export interface Collection {
    id?: string;
    name?: string;
    description?: string;
    type?: CollectionType;
    position?: number;
    rules?: CollectionRule[];
    imageId?: string;
    imageUrl?: string;
    productIds?: string[];
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}
