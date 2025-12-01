import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Upload, UploadFileInfo } from '@shared/upload';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    createCustomOptionFormGroup,
    createVariantFormGroup,
    createVariantOptionFormGroup,
    creatProductFormGroup,
    CustomOptionFormGroup,
    VariantFromGroup,
    VariantOptionFormGroup,
} from '../../forms';
import { CUSTOM_OPTION_TYPE_OPTIONS, CustomOption, Product, Variant, VariantOption } from '@models';
import { MediaSelectorDialog } from './media-selector-dialog/media-selector-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPlaces } from '@directives';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PageHeader } from '@components';
import { BrandService, CollectionService, ProductService } from '../../services';

@Component({
    selector: 'app-product-form-page',
    imports: [
        PageHeader,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
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
        MatListModule,
        MatSlideToggleModule,
        NgOptimizedImage,
        DecimalPlaces,
        Upload,
        CdkDrag,
    ],
    templateUrl: './product-form-page.html',
    styleUrl: './product-form-page.scss',
})
export class ProductFormPage implements OnInit, AfterViewInit, OnDestroy {
    protected readonly sections = [
        { id: 'basic', label: '基本信息' },
        { id: 'description', label: '详情描述' },
        { id: 'media', label: '媒体图片' },
        { id: 'variants', label: '规格信息' },
        { id: 'customOptions', label: '附加选项' },
    ];

    protected readonly activeSection = signal<string>(this.sections[0].id);
    protected readonly id = input<string>();

    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly snackBar = inject(MatSnackBar);
    private readonly productService = inject(ProductService);
    private readonly brandService = inject(BrandService);
    private readonly collectionService = inject(CollectionService);
    private readonly el = inject(ElementRef);
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
        'price',
        'rollbackPrice',
        'msrp',
        'cost',
        'availableQty',
        'actions',
    ];
    protected readonly dataSource = new MatTableDataSource<VariantFromGroup>([]);

    protected readonly brands = toSignal(this.brandService.getAll(), { initialValue: [] });

    protected readonly collections = toSignal(this.collectionService.getAll(), { initialValue: [] });

    protected readonly mediaList = signal<UploadFileInfo[]>([]);

    protected variantMode = 'single' as 'single' | 'multiple';

    private readonly fb = inject(FormBuilder);

    protected readonly productForm = creatProductFormGroup(this.fb);

    get variantOptions() {
        return this.productForm.get('variantOptions') as FormArray<VariantOptionFormGroup>;
    }

    get variants() {
        return this.productForm.get('variants') as FormArray<VariantFromGroup>;
    }

    get customOptions() {
        return this.productForm.get('customOptions') as FormArray<CustomOptionFormGroup>;
    }

    constructor() {
        // 初始化form
        this.variants.push(createVariantFormGroup(this.fb));

        // 处理商品媒体图片id
        effect(() => {
            const mediaIds = this.mediaList().map((media) => media.id!);
            this.productForm.get('mediaIds')?.setValue(mediaIds);
        });

        // 监听变体选项的变更,动态生成变体商品
        this.variantOptions.valueChanges.pipe(takeUntilDestroyed()).subscribe((options) => {
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
            this.dataSource.data = [...this.variants.controls];
        });
    }

    ngOnInit(): void {
        // 初始化富文本编辑器对象
        this.editor = new Editor();

        // 如果是编辑页面请求并初始化数据
        const productId = this.id();
        if (productId) {
            this.productService.getById(productId).subscribe((product) => {
                if (product) {
                    const { variantOptions, variants, customOptions } = product;
                    // 变体视图模式
                    if (variants.length > 1) {
                        this.variantMode = 'multiple';
                    }
                    // 商品图片
                    const newMediaList = (product.mediaList || []).map((media) => {
                        const { id, path, hash, type } = media;
                        return { id, path, hash, type, status: 'SUCCESS' } as UploadFileInfo;
                    });
                    this.mediaList.set(newMediaList);

                    /**
                     * 处理表单数据:手动处理FormArray字段.因为patchValue或者是setValue 不会自动填充FormArray的长度,所以需要手动处理FormArray
                     */
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

                    // 附加选项/自定义选项
                    this.customOptions.clear();
                    customOptions.forEach((customOption) => {
                        this.customOptions.push(createCustomOptionFormGroup(this.fb, customOption), {
                            emitEvent: false,
                        });
                    });

                    this.productForm.patchValue(product, { emitEvent: false });
                }
            });
        }
    }

    ngAfterViewInit(): void {
        this.setupIntersectionObserver();
    }

    /**
     * 点击跳转逻辑：平滑滚动到指定锚点
     */
    protected scrollTo(sectionId: string) {
        // 查找目标元素
        const element = this.el.nativeElement.querySelector(`#${sectionId}`);
        if (element) {
            // 使用 window.scrollTo 实现平滑滚动
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center', // 滚动到顶部对齐
            });
            // 手动更新 active 状态，提供即时反馈
            this.activeSection.set(sectionId);
        }
    }

    /**
     * todo:处理滚动锚点激活跟随
     * 滚动监听逻辑处理锚点跟随：使用 IntersectionObserver API
     */
    private setupIntersectionObserver() {
        const options: IntersectionObserverInit = {
            root: null, // 监听视口 (Viewport)
            // 触发检测的区域：当元素顶部距离视口顶部70%时触发
            rootMargin: '0px 0px 90% 0px',
            threshold: 1,
        };

        const observer = new IntersectionObserver((entries) => {
            // 筛选当前在视口中的元素
            const visibleSections = entries
                .filter((entry) => entry.isIntersecting)
                .map((entry) => ({
                    id: entry.target.id,
                    top: entry.boundingClientRect.top,
                    bottom: entry.boundingClientRect.bottom,
                }));

            if (visibleSections.length > 0) {
                visibleSections.sort((a, b) => a.top - b.top);
                this.activeSection.set(visibleSections[0].id);
            }

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.activeSection.set(entry.target.id);
                }
            });
        }, options);

        // 监听所有锚点 <section> 元素
        this.sections.forEach((section) => {
            const element = this.el.nativeElement.querySelector(`#${section.id}`);
            if (element) {
                observer.observe(element);
            }
        });
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

    protected addVariantOptionValue(variantOptionIdx: number, event: MatChipInputEvent) {
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
        if (this.mediaList().length === 0) {
            this.snackBar.open('您还没有上传任何图片,请先上传图片', '关闭', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
            return;
        }
        const dialogRef = this.dialog.open(MediaSelectorDialog, {
            data: [...this.mediaList()],
            width: '450px',
            maxWidth: '720px',
            maxHeight: 'calc(100vw - 32px)',
        });
        dialogRef.afterClosed().subscribe((media: UploadFileInfo) => {
            if (!media) return;
            variantCtrl?.patchValue({ mainMediaId: media.id, mainMediaPath: media.path });
            this.cd.markForCheck();
        });
    }

    protected removeVariantImage(variantCtrl: VariantFromGroup) {
        variantCtrl.patchValue({ mainMediaId: null, mainMediaPath: null });
    }

    protected addCustomOption() {
        this.customOptions.push(createCustomOptionFormGroup(this.fb, {} as CustomOption));
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    protected save() {
        if (this.productForm.valid) {
            const productId = this.id();
            const product = this.productForm.value as unknown as Product;
            const $request = productId
                ? this.productService.update(productId, product)
                : this.productService.create(product);

            $request.subscribe(() => {
                this.router.navigate(['/catalog/products']);
            });
        }
    }

    protected readonly CUSTOM_OPTION_TYPE_OPTIONS = CUSTOM_OPTION_TYPE_OPTIONS;
}
