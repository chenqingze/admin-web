import { ChangeDetectorRef, Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Upload, UploadFileInfo } from '@shared/upload';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    createVariantFormGroup,
    createVariantOptionFormGroup,
    creatProductFormGroup,
    ProductFormGroup,
    VariantFromGroup,
    VariantOptionFormGroup,
} from '../../forms';
import { Subject, takeUntil } from 'rxjs';
import { Product, Variant, VariantOption } from '@models';
import { MediaSelectorDialog } from './media-selector-dialog/media-selector-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPlaces } from '@directives';

@Component({
    selector: 'app-product-form-page',
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
        NgxEditorModule,
        NgOptimizedImage,
        DecimalPlaces,
        Upload,
    ],
    templateUrl: './product-form-page.html',
    styleUrl: './product-form-page.scss',
})
export class ProductFormPage implements OnInit, OnDestroy {
    protected readonly id = input<string>();

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

    protected readonly displayedColumns = [
        'media',
        'name',
        'msrp',
        'price',
        'rollbackPrice',
        'cost',
        'availableQty',
        'actions',
    ];

    protected variantMode = 'single' as 'single' | 'multiple';

    private readonly fb = inject(FormBuilder);

    protected readonly productForm: ProductFormGroup;

    get variantOptions() {
        return this.productForm.get('variantOptions') as FormArray<VariantOptionFormGroup>;
    }

    get variants() {
        return this.productForm.get('variants') as FormArray<VariantFromGroup>;
    }

    protected readonly mediaList = signal<UploadFileInfo[]>([]);

    private ngUnsubscribe$ = new Subject<void>();

    constructor() {
        // 初始化form
        this.productForm = creatProductFormGroup(this.fb);
        this.variants.push(createVariantFormGroup(this.fb));

        // 处理商品媒体图片id
        effect(() => {
            const mediaIds = this.mediaList().map((media) => media.id!);
            this.productForm.get('mediaIds')?.setValue(mediaIds);
        });
    }

    ngOnInit(): void {
        // 初始化富文本编辑器对象
        this.editor = new Editor();
        // 监听变体选项的变更,动态生成变体商品
        this.variantOptions.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((options) => {
            const validVariantOptions = options.filter(
                (option) => option.name && option.values && option.values.length > 0,
            );
            const combinations = this.cartesianVariantOptions(validVariantOptions as VariantOption[]);
            this.variants.clear();
            combinations.forEach((combo) => {
                const [option1Value, option2Value, option3Value] = combo || {};
                const optionValues = { option1Value, option2Value, option3Value };
                this.variants.push(createVariantFormGroup(this.fb, { ...optionValues } as Partial<Variant>));
            });
            this.variants.controls = [...this.variants.controls];
        });
        // 如果是编辑页面请求并初始化数据
        const productId = this.id();
        if (productId) {
            this.productService.getById(productId).subscribe((product) => {
                if (product) {
                    const { variantOptions, variants } = product;
                    // 变体视图
                    if (variants.length > 1) {
                        this.variantMode = 'multiple';
                    }
                    // 商品图片
                    const newMediaList = product.mediaList.map((media) => {
                        const { id, path, hash, type } = media;
                        return { id, path, hash, type, status: 'SUCCESS' } as UploadFileInfo;
                    });
                    this.mediaList.set(newMediaList);
                    // 表单数据
                    // 变体选项
                    this.variantOptions.clear({ emitEvent: false });
                    variantOptions.forEach((opt) => {
                        this.variantOptions.push(createVariantOptionFormGroup(this.fb, opt), { emitEvent: false });
                    });
                    // 变体
                    this.variants.clear({ emitEvent: false });
                    variants.forEach((variant) => {
                        this.variants.push(createVariantFormGroup(this.fb, variant), { emitEvent: false });
                    });
                    this.productForm.patchValue(creatProductFormGroup(this.fb, product).getRawValue(), {
                        emitEvent: false,
                    });
                }
            });
        }
    }

    protected onVariantModeChange(event: MatButtonToggleChange) {
        this.variantMode = event.value;
        if (this.variantMode === 'single') {
            this.variantOptions.clear({ emitEvent: false });
            this.variants.clear({ emitEvent: false });
            this.variants.push(createVariantFormGroup(this.fb));
        } else if (this.variantMode === 'multiple') {
            this.variantOptions.clear({ emitEvent: false });
            this.variants.clear({ emitEvent: false });
            this.addVariantOption();
        }
    }

    protected addVariantOption() {
        this.variantOptions.push(createVariantOptionFormGroup(this.fb));
    }

    protected removeVariantOption(variantOptionIdx: number) {
        this.variantOptions.removeAt(variantOptionIdx);
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
        valuesControl?.setValue(newValues);
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

    protected removeVariant(variantIdx: number) {
        console.log('remove variant', variantIdx);
        this.variants.removeAt(variantIdx, { emitEvent: false });
        this.variants.controls = [...this.variants.controls];
        console.log(this.variants.length);
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

    protected buildVariantName(variant: VariantFromGroup) {
        const { option1Value, option2Value, option3Value } = variant.value;
        return [option1Value, option2Value, option3Value].filter(Boolean).join('-');
    }

    protected batchSetPrice() {
        console.log('do nothing!');
    }

    protected openMediaSelectorDialog(variantCtrl: VariantFromGroup) {
        const dialogRef = this.dialog.open(MediaSelectorDialog, {
            data: [...this.mediaList()],
            width: '560px',
            maxWidth: '720px',
            maxHeight: 'calc(100vw - 32px)',
        });
        dialogRef.afterClosed().subscribe((media: UploadFileInfo) => {
            if (!media) return;
            variantCtrl?.patchValue({ mainMediaId: media.id, mainMediaPath: media.path });
            this.cd.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.editor.destroy();
        // 在组件销毁时发出通知
        this.ngUnsubscribe$.next();
        // 完成 Subject
        this.ngUnsubscribe$.complete();
    }

    protected save() {
        if (this.productForm.valid) {
            const productId = this.id();
            const product = this.productForm.value as Product;
            const $request = productId
                ? this.productService.update(productId, product)
                : this.productService.create(product);

            $request.subscribe(() => {
                this.router.navigate(['/catalog/products']);
            });
        }
    }
}
