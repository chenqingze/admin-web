import { Component, inject } from '@angular/core';
import { PageHeader } from '@components';
import { MatCardModule } from '@angular/material/card';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_OPTION_TYPE_OPTIONS } from '@models';
import { createCustomOptionFormGroup, createCustomOptionValueFormGroup, CustomOptionValueFormGroup } from '../../forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DecimalPlaces } from '@directives';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-custom-option-form-page',
    imports: [
        PageHeader,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggle,
        MatIconModule,
        MatTableModule,
        DecimalPlaces,
    ],
    templateUrl: './custom-option-form-page.html',
    styleUrl: './custom-option-form-page.scss',
})
export class CustomOptionFormPage {
    protected readonly CUSTOM_OPTION_TYPE_OPTIONS = CUSTOM_OPTION_TYPE_OPTIONS;
    protected readonly fb = inject(FormBuilder);
    protected readonly customOptionForm = createCustomOptionFormGroup(this.fb);

    protected readonly displayedColumns = ['value', 'label', 'priceAdjustment'];

    get values() {
        return this.customOptionForm.get('values') as FormArray<CustomOptionValueFormGroup>;
    }

    constructor() {
        this.customOptionForm
            .get('type')
            ?.valueChanges.pipe(takeUntilDestroyed())
            .subscribe((value) => {
                switch (value) {
                    case 'SINGLE_CHOICE':
                    case 'MULTI_CHOICE':
                        this.values.clear({ emitEvent: false });
                        this.values.push(createCustomOptionValueFormGroup(this.fb));
                        break;
                    case 'FILE_UPLOAD':
                    case 'TEXT_INPUT':
                        this.values.clear();
                        break;
                    default:
                        throw new Error(`Something Wrong ,Unknown custom option '${value}'`);
                }
            });
        this.customOptionForm.get('type')?.setValue('SINGLE_CHOICE');
    }

    protected save() {
        console.log(this.customOptionForm.value);
    }
}
