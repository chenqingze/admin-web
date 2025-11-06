import { Dimension } from './dimension';
import { Weight } from './weight';
import { BaseModel } from '../../base-model';

export interface Variant extends BaseModel {
    id: string | null;
    sku: string | null;
    barcode: string | null;
    msrp: number | null;
    price: number | null;
    rollbackPrice: number | null;
    cost: number | null;
    orderMinQty: number | null;
    orderMaxQty: number | null;
    availableQty: number | null;
    dimension: Dimension | null;
    weight: Weight | null;
    isPrimary: boolean;
    option1Value: string | null;
    option2Value: string | null;
    option3Value: string | null;
    mainMediaId: string | null;
    mainMediaPath: string | null;
    productId: string | null;
}
