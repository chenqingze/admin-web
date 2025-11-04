import { BaseModel } from '../../base-model';

export interface Brand extends BaseModel {
    id: string | null;
    name: string;
    imagePath: string | null;
    imageId: string | null;
    visible: boolean;
    position?: number;
}
