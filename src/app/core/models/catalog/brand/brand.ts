import { BaseModel } from '../../base-model';
import { MediaType } from '@api';

export interface Brand extends BaseModel {
    id: string | null;
    name: string;
    mediaPath: string | null;
    mediaId: string | null;
    mediaType: MediaType;
    visible: boolean;
    position?: number;
}
