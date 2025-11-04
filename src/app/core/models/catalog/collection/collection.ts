import { CollectionRule } from './collection-rule';
import { CollectionType } from './collection-type';
import { BaseModel } from '../../base-model';

export interface Collection extends BaseModel {
    id: string | null;
    name: string;
    description: string | null;
    visible: boolean;
    position?: number;
    type?: CollectionType;
    rules?: CollectionRule[];
    imageId: string | null;
    imagePath: string | null;
    productIds: string[];
}
