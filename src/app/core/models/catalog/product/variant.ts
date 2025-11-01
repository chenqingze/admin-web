import { Dimension } from './dimension';
import { Weight } from './weight';

export interface Variant {
    id?: string;
    sku?: string;
    barcode?: string;
    msrp?: number | null;
    price?: number | null;
    rollbackPrice?: number | null;
    cost?: number | null;
    orderMinQty?: number;
    orderMaxQty?: number;
    availableQty?: number | null;
    dimension?: Dimension;
    weight?: Weight;
    isPrimary?: boolean;
    option1Value?: string | null;
    option2Value?: string | null;
    option3Value?: string | null;
    mainImageId?: string;
    mainImagePath?: string;
    productId?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}
