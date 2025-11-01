import { FormBuilder, Validators } from '@angular/forms';
import { VariantOption } from '@models';

export function createVariantOptionFormGroup(fb: FormBuilder, data?: VariantOption) {
    return fb.group({
        name: [data?.name || '', Validators.required],
        values: [data?.values || []], // 这里是普通数组，UI 负责 push/pop
    });
}
export type VariantOptionFormGroup = ReturnType<typeof createVariantOptionFormGroup>;
