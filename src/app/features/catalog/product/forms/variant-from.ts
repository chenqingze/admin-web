import { FormBuilder, Validators } from '@angular/forms';
import { Variant } from '@models';
import { NUMBER_PATTERN } from '@validators';

export function createVariantFormGroup(fb: FormBuilder, data?: Variant | Partial<Variant>) {
    const {
        id = null,
        sku = null,
        barcode = null,
        msrp = null,
        price = null,
        rollbackPrice = null,
        cost = null,
        orderMinQty = null,
        orderMaxQty = null,
        availableQty = null,
        dimension = null,
        weight = null,
        isPrimary = false,
        option1Value = null,
        option2Value = null,
        option3Value = null,
        mainMediaId = null,
        mainMediaPath = null,
    } = data || {};
    return fb.group({
        id: [id],
        sku: [sku],
        barcode: [barcode],
        msrp: [msrp, [Validators.min(0)]],
        price: [price, [Validators.required, Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
        rollbackPrice: [rollbackPrice, [Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
        cost: [cost, [Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
        orderMinQty: [orderMinQty, [Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
        orderMaxQty: [orderMaxQty, [Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
        availableQty: [availableQty, [Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
        dimension: [dimension],
        weight: [weight],
        isPrimary: [isPrimary],
        option1Value: [option1Value],
        option2Value: [option2Value],
        option3Value: [option3Value],
        mainMediaId: [mainMediaId],
        mainMediaPath: [mainMediaPath],
    });
}
export type VariantFromGroup = ReturnType<typeof createVariantFormGroup>;
