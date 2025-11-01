import { Variant } from './variant';
import { VariantOption } from './variant-option';
import { Image } from '@api';

export const PRODUCT_STATUS_OPTIONS = ['PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'] as const;
export type ProductStatus = (typeof PRODUCT_STATUS_OPTIONS)[number];

export interface Product {
    id?: string;
    name?: string;
    caption?: string;
    summary?: string;
    desktopDescription?: string;
    mobileDescription?: string;
    status?: ProductStatus;
    images?: Image[];
    imageIds?: string[];
    brandId?: string;
    categoryId?: string[];
    collectionIds?: string[];
    variantOptions: VariantOption[];
    // defaultVariant: Variant;
    variants: Variant[];
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    deletedAt?: string;
}
