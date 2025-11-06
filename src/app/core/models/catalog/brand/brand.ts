import { BaseModel } from '../../base-model';

export interface Brand extends BaseModel {
    id: string | null;
    name: string;
    mediaPath: string | null;
    mediaId: string | null;
    visible: boolean;
    position?: number;
}
