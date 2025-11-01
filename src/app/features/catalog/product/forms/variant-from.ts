import { FormBuilder, Validators } from '@angular/forms';
import { Variant } from '@models';

export function createVariantFormGroup(fb: FormBuilder, data?: Variant) {
    const {
        id,
        sku,
        barcode,
        msrp,
        price,
        rollbackPrice,
        cost,
        orderMinQty,
        orderMaxQty,
        availableQty,
        dimension,
        weight,
        isPrimary,
        option1Value,
        option2Value,
        option3Value,
        mainImageId,
        mainImagePath,
    } = data || {};
    return fb.group({
        id: [id],
        sku: [sku],
        barcode: [barcode],
        msrp: [msrp, [Validators.required]],
        price: [price, [Validators.required]],
        rollbackPrice: [rollbackPrice, [Validators.required]],
        cost: [cost, [Validators.required]],
        orderMinQty: [orderMinQty],
        orderMaxQty: [orderMaxQty],
        availableQty: [availableQty],
        dimension: [dimension],
        weight: [weight],
        isPrimary: [isPrimary],
        option1Value: [option1Value],
        option2Value: [option2Value],
        option3Value: [option3Value],
        mainImageId: [mainImageId],
        mainImagePath: [mainImagePath],
    });
}
export type VariantFromGroup = ReturnType<typeof createVariantFormGroup>;
