import { FormBuilder, Validators } from '@angular/forms';
import { CustomOption, CustomOptionValue } from '@models';
import { NUMBER_PATTERN } from '@validators';

export function createCustomOptionValueFormGroup(fb: FormBuilder, data?: CustomOptionValue) {
    const { id = null, label = null, value = '', priceAdjustment = null } = data || {};
    return fb.group({
        id: [id],
        label: [label],
        value: [value, Validators.required],
        priceAdjustment: [priceAdjustment, [Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
    });
}
export type CustomOptionValueFormGroup = ReturnType<typeof createCustomOptionValueFormGroup>;

export function createCustomOptionFormGroup(fb: FormBuilder, data?: CustomOption) {
    const {
        id = null,
        name = '',
        type = 'CHOICE',
        required = false,
        values = [],
        multiple = false,
        maxSelectionLimit = 0,
        priceAdjustment = null,
    } = data || {};
    return fb.group({
        id: [id],
        name: [name, Validators.required],
        type: [type, Validators.required],
        required: [required, Validators.required],
        values: fb.array<CustomOptionValueFormGroup>(
            values.map((optionValue) => createCustomOptionValueFormGroup(fb, optionValue)),
            Validators.minLength(0),
        ),
        multiple: [multiple],
        maxSelectionLimit: [maxSelectionLimit],
        priceAdjustment: [priceAdjustment, [Validators.pattern(NUMBER_PATTERN), Validators.min(0)]],
    });
}
export type CustomOptionFormGroup = ReturnType<typeof createCustomOptionFormGroup>;
