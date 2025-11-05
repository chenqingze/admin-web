import { ChangeDetectorRef, Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { Upload, UploadFileInfo } from '@shared/upload';
import { DecimalPlaces } from '@directives';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Product, Variant, VariantOption } from '@models';
import { MatDialog } from '@angular/material/dialog';
import { ImageSelectorDialog } from '../../dialogs/image-selector-dialog/image-selector-dialog';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';

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
        NgOptimizedImage,
    ],
    templateUrl: './product-add-page.html',
    styleUrl: './product-add-page.scss',
})
export class ProductAddPage implements OnInit, OnDestroy {
    private readonly dialog = inject(MatDialog);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly productService = inject(ProductService);
    private readonly router = inject(Router);
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

    protected readonly separatorKeysCodes = [ENTER, COMMA] as const;

    protected readonly displayedColumns = ['image', 'name', 'msrp', 'price', 'rollbackPrice', 'cost', 'availableQty'];

    private readonly fb = inject(FormBuilder);

    protected readonly productForm = creatProductFormGroup(this.fb);

    get variantOptions() {
        return this.productForm.get('variantOptions') as FormArray<VariantOptionFormGroup>;
    }

    get variants() {
        return this.productForm.get('variants') as FormArray<VariantFromGroup>;
    }

    protected readonly variantMode = signal<'single' | 'multiple'>('single');

    protected readonly imageList = signal<UploadFileInfo[]>([]);

    private ngUnsubscribe$ = new Subject<void>();

    constructor() {
        effect(() => {
            if (this.variantMode() === 'single') {
                this.variantOptions.clear({ emitEvent: false });
                this.variants.clear({ emitEvent: false });
                this.variants.push(createVariantFormGroup(this.fb));
            } else if (this.variantMode() === 'multiple') {
                this.variantOptions.clear({ emitEvent: false });
                this.variants.clear({ emitEvent: false });
                this.variantOptions.push(createVariantOptionFormGroup(this.fb));
            }
        });
        effect(() => {
            const imageIds = this.imageList().map((image) => image.id!);
            // console.log('this.imageList()', this.imageList());
            this.productForm.controls.imageIds.setValue(imageIds);
        });
    }

    ngOnInit(): void {
        this.editor = new Editor();
        this.variantOptions.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((options) => {
            const combinations = this.cartesianVariantOptions(options as VariantOption[]);
            this.variants.clear();
            combinations.forEach((combo) => {
                const [option1Value, option2Value, option3Value] = combo || {};
                const optionValues = { option1Value, option2Value, option3Value };
                this.variants.push(createVariantFormGroup(this.fb, { ...optionValues } as Partial<Variant>));
            });
            this.variants.controls = [...this.variants.controls];
        });
    }

    ngOnDestroy(): void {
        this.editor.destroy();
        // 在组件销毁时发出通知
        this.ngUnsubscribe$.next();
        // 完成 Subject
        this.ngUnsubscribe$.complete();
    }

    protected addVariantOption() {
        this.variantOptions.push(createVariantOptionFormGroup(this.fb));
    }

    protected addOptionValue(variantOptionIdx: number, event: MatChipInputEvent) {
        const value = (event.value || '').trim();

        // Add option Value
        if (value) {
            const valuesControl = this.variantOptions.at(variantOptionIdx).get('values');
            const newValues = [...(valuesControl?.value || []), event.value];
            valuesControl?.patchValue(newValues);
        }

        // Clear the input value
        event.chipInput!.clear();
    }

    protected removeOptionValue(variantOptionIdx: number, optionValue: string) {
        const valuesControl = this.variantOptions.at(variantOptionIdx).get('values');
        const newValues = [...(valuesControl?.value || [])];
        const index = newValues.indexOf(optionValue);
        newValues.splice(index, 1);
        valuesControl?.patchValue(newValues);
    }

    protected editOptionValue(variantOptionIdx: number, event: MatChipEditedEvent) {
        const value = (event.value || '').trim();
        if (value) {
            const valuesControl = this.variantOptions.at(variantOptionIdx).get('values');
            const newValues = [...(valuesControl?.value || [])];
            const index = newValues.indexOf(value);
            newValues.splice(index, 1, value);
            valuesControl?.patchValue(newValues);
        }
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

    protected openImageSelectorDialog(variantCtrl: VariantFromGroup) {
        const dialogRef = this.dialog.open(ImageSelectorDialog, {
            data: [...this.imageList()],
            width: '560px',
            maxWidth: '720px',
            maxHeight: 'calc(100vw - 32px)',
        });
        dialogRef.afterClosed().subscribe((image: UploadFileInfo) => {
            if (!image) return;
            variantCtrl?.patchValue({ mainImageId: image.id, mainImagePath: image.path });
            this.cd.markForCheck();
        });
    }

    protected save() {
        console.log(this.productForm);
        console.log(this.productForm.valid);
        console.log(this.productForm.value);
        if (this.productForm.valid) {
            this.productService.create(this.productForm.value as Product).subscribe(() => {
                this.router.navigate(['/catalog/products']);
            });
        }
    }
}
