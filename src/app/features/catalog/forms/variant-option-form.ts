import { FormBuilder, Validators } from '@angular/forms';
import { VariantOption } from '@models';

export function createVariantOptionFormGroup(fb: FormBuilder, data?: VariantOption) {
    const { id = null, name = '', values = [] as string[] } = data || {};
    return fb.group({
        id: [id],
        name: [name, Validators.required],
        values: [values, Validators.required, Validators.minLength(1)], // 这里是普通数组，UI 负责 push/pop
    });
}
export type VariantOptionFormGroup = ReturnType<typeof createVariantOptionFormGroup>;
