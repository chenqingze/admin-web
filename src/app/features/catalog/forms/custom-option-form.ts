import { FormBuilder, Validators } from '@angular/forms';
import { CustomOption, CustomOptionValue } from '@models/catalog/product/custom-option';

export function createCustomOptionValueFormGroup(fb: FormBuilder, data?: CustomOptionValue) {
    const { label = null, value = '', adjustmentValue = null, adjustmentType = null } = data || {};
    return fb.group({
        label: [label],
        value: [value, Validators.required],
        adjustmentValue: [adjustmentValue],
        adjustmentType: [adjustmentType],
    });
}
export type CustomOptionValueFormGroup = ReturnType<typeof createCustomOptionValueFormGroup>;

export function createCustomOptionFormGroup(fb: FormBuilder, data?: CustomOption) {
    const { id = null, name = '', type = 'SELECT', required = false, multiple = false, values = [] } = data || {};
    return fb.group({
        id: [id],
        name: [name, Validators.required],
        type: [type, Validators.required],
        required: [required, Validators.required],
        multiple: [multiple, Validators.required],
        values: fb.array<CustomOptionValueFormGroup>(
            values.map((optionValue) => createCustomOptionValueFormGroup(fb, optionValue)),
            Validators.minLength(1),
        ),
    });
}
export type CustomOptionFormGroup = ReturnType<typeof createCustomOptionFormGroup>;
