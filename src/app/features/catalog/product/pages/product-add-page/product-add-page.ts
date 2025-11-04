import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import {
    createVariantFormGroup,
    createVariantOptionFormGroup,
    creatProductFormGroup,
    VariantFromGroup,
    VariantOptionFormGroup,
} from '../../forms';
import { Upload } from '@shared/upload';
import { DecimalPlaces } from '@directives';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Variant, VariantOption } from '@models';

@Component({
    selector: 'sa-product-add-page',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatExpansionModule,
        MatChipsModule,
        MatTableModule,
        Upload,
        NgxEditorModule,
        DecimalPlaces,
    ],
    templateUrl: './product-add-page.html',
    styleUrl: './product-add-page.scss',
})
export class ProductAddPage implements OnInit, OnDestroy {
    protected editor!: Editor;
    protected toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    protected variantMode = signal<'single' | 'multiple'>('single');

    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    readonly displayedColumns = ['image', 'name', 'msrp', 'price', 'rollbackPrice', 'cost', 'availableQty'];

    private readonly fb = inject(FormBuilder);

    protected readonly productForm = creatProductFormGroup(this.fb);

    get variantOptions() {
        return this.productForm.get('variantOptions') as FormArray<VariantOptionFormGroup>;
    }

    get variants() {
        return this.productForm.get('variants') as FormArray<VariantFromGroup>;
    }

    constructor() {
        effect(() => {
            if (this.variantMode() === 'single') {
                this.variants.clear();
                this.variants.push(createVariantFormGroup(this.fb));
            } else if (this.variantMode() === 'multiple') {
                this.variants.clear();
            }
        });
    }
    ngOnInit(): void {
        this.editor = new Editor();
        this.variantOptions.valueChanges.subscribe((options) => {
            const combinations = this.cartesianVariantOptions(options as VariantOption[]);
            this.variants.clear();
            combinations.forEach((combo) => {
                const [option1Value, option2Value, option3Value] = combo || {};
                const optionValues = { option1Value, option2Value, option3Value };
                this.variants.push(createVariantFormGroup(this.fb, { ...optionValues } as Partial<Variant>));
                this.variants.controls = [...this.variants.controls];
            });
            console.log(this.variants.value);
        });
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    protected addVariantOption() {
        this.variantOptions.push(createVariantOptionFormGroup(this.fb));
    }

    protected addOptionValue(variantOptionIdx: number, event: MatChipInputEvent) {
        const value = (event.value || '').trim();

        // Add option Value
        if (value) {
            const valuesControl = this.variantOptions.controls[variantOptionIdx].controls.values;
            const newValues = [...(valuesControl.value ?? []), event.value];
            valuesControl.setValue(newValues);
        }

        // Clear the input value
        event.chipInput!.clear();
    }

    protected removeOptionValue(variantOptionIdx: number, optionValueIdx: number, optionValue: string) {
        console.log(variantOptionIdx, optionValue);
        this.variantOptions.value[variantOptionIdx].values?.splice(optionValueIdx, 1);
    }

    protected editOptionValue(variantOptionIdx: number, optionValueIdx: number, event: MatChipEditedEvent) {
        console.log(variantOptionIdx, event);
        this.variantOptions.value![variantOptionIdx].values![optionValueIdx] = event.value;
    }

    protected buildVariantName(variant: VariantFromGroup) {
        const { option1Value, option2Value, option3Value } = variant.value;
        return [option1Value, option2Value, option3Value].filter(Boolean).join('-');
    }

    protected batchSetPrice() {
        console.log('do nothing!');
    }

    // 笛卡尔积variantOptionValue,根据变体选项生成变体组合
    private cartesianVariantOptions(variantOptions: VariantOption[]) {
        return variantOptions.reduce<string[][]>(
            (acc, option) => {
                const res: string[][] = [];
                for (const combo of acc) {
                    for (const val of option.values!) {
                        res.push([...combo, val]);
                    }
                }
                return res;
            },
            [[]],
        );
    }
}
