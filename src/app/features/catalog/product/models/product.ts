import { Image } from '@core/api/models';

export const DIMENSION_UNIT_TYPE_OPTIONS = ['CENTIMETERS', 'METERS', 'INCHES', 'FEET'] as const;
export type DimensionUnitType = (typeof DIMENSION_UNIT_TYPE_OPTIONS)[number];

export interface Dimension {
    length?: number | null;
    height?: number | null;
    width?: number | null;
    dimensionUnit?: DimensionUnitType | null;
}

export const WEIGHT_UNIT_TYPE_OPTIONS = ['GRAMS', 'KILOGRAMS', 'TONS', 'POUNDS'] as const;
export type WeightUnitType = (typeof WEIGHT_UNIT_TYPE_OPTIONS)[number];

export interface Weight {
    weightValue?: number | null;
    weightUnit?: WeightUnitType | null;
}

export const PRODUCT_STATUS_OPTIONS = ['PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'] as const;
export type ProductStatus = (typeof PRODUCT_STATUS_OPTIONS)[number];

export interface VariantOption {
    id?: string;
    name: string;
    values: string[];
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}

export interface ProductType {
    id?: string;
    name?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}

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

export interface Product {
    id?: string;
    name?: string;
    caption?: string;
    summary?: string;
    desktopDescription?: string;
    mobileDescription?: string;
    status?: ProductStatus;
    mainImageId?: string;
    mainImagePath?: string;
    images?: Image[];
    imageIds?: string[];
    productTypeId?: string;
    brandId?: string;
    categoryIds?: string[];
    collectionIds?: string[];
    variantOptions: VariantOption[];
    defaultVariant: Variant;
    variants: Variant[];
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}
