import { Variant } from './variant';
import { VariantOption } from './variant-option';
import { Image } from '@api';
import { BaseModel } from '../../base-model';

export const PRODUCT_STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'] as const;
export type ProductStatus = (typeof PRODUCT_STATUS_OPTIONS)[number];

export interface Product extends BaseModel {
    id: string | null;
    name: string;
    caption: string | null;
    summary: string | null;
    desktopDescription: string | null;
    mobileDescription: string | null;
    status: ProductStatus;
    images: Image[];
    imageIds: string[];
    brandId: string | null;
    categoryId?: string[];
    collectionIds?: string[];
    variantOptions: VariantOption[];
    // defaultVariant: Variant;
    variants: Variant[];
}
