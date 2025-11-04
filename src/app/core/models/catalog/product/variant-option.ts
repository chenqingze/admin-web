import { BaseModel } from '../../base-model';

export interface VariantOption extends BaseModel {
    id: string | null;
    name: string;
    values: string[];
}
