import { CollectionRule } from './collection-rule';
import { CollectionType } from './collection-type';
import { BaseModel } from '../../base-model';
import { MediaType } from '@api';

export interface Collection extends BaseModel {
    id: string | null;
    name: string;
    description: string | null;
    visible: boolean;
    position?: number;
    type?: CollectionType;
    rules?: CollectionRule[];
    mediaId: string | null;
    mediaPath: string | null;
    mediaType: MediaType;
    productIds: string[];
}
