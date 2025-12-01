import { FormBuilder, Validators } from '@angular/forms';
import { Product, ProductStatus } from '@models';
import { createVariantOptionFormGroup, VariantOptionFormGroup } from './variant-option-form';
import { createVariantFormGroup, VariantFromGroup } from './variant-from';

export function creatProductFormGroup(fb: FormBuilder, data?: Product) {
    const {
        id = null,
        name = '',
        caption = null,
        summary = null,
        desktopDescription = null,
        mobileDescription = null,
        status = 'DRAFT' as ProductStatus,
        mediaIds = [],
        brandId = null,
        categoryId = null,
        collectionIds = [],
        variantOptions = [],
        variants = [],
        customOptionIds = [],
    } = data || {};
    return fb.group({
        id: [id],
        name: [name, Validators.required],
        caption: [caption],
        summary: [summary],
        desktopDescription: [desktopDescription],
        mobileDescription: [mobileDescription],
        status: [status],
        mediaIds: [mediaIds],
        brandId: [brandId],
        categoryId: [categoryId],
        collectionIds: [collectionIds],
        variantOptions: fb.array<VariantOptionFormGroup>(
            variantOptions.map((option) => createVariantOptionFormGroup(fb, option)),
        ),
        variants: fb.array<VariantFromGroup>(
            variants.map((variant) => createVariantFormGroup(fb, variant)),
            Validators.minLength(1),
        ),
        customOptionIds: [customOptionIds],
    });
}

export type ProductFormGroup = ReturnType<typeof creatProductFormGroup>;
