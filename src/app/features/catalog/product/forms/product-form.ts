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
        images = [],
        imageIds = [],
        brandId = null,
        categoryId = null,
        collectionIds = [],
    } = data || {};
    return fb.group({
        id: [id],
        name: [name, Validators.required],
        caption: [caption],
        summary: [summary],
        desktopDescription: [desktopDescription],
        mobileDescription: [mobileDescription],
        status: [status],
        images: [images],
        imageIds: [imageIds],
        brandId: [brandId],
        categoryId: [categoryId],
        collectionIds: [collectionIds],
        variantOptions: fb.array<VariantOptionFormGroup>([createVariantOptionFormGroup(fb)]),
        variants: fb.array<VariantFromGroup>([createVariantFormGroup(fb)]),
    });
}
