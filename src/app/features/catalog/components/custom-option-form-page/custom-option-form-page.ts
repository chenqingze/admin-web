import { Component, HostListener, inject, input, OnInit } from '@angular/core';
import { PageHeader } from '@components';
import { MatCardModule } from '@angular/material/card';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_OPTION_TYPE_OPTIONS, CustomOption } from '@models';
import { createCustomOptionFormGroup, createCustomOptionValueFormGroup, CustomOptionValueFormGroup } from '../../forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DecimalPlaces } from '@directives';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomOptionService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-custom-option-form-page',
    imports: [
        PageHeader,
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
export class CustomOptionFormPage implements OnInit {
    protected readonly CUSTOM_OPTION_TYPE_OPTIONS = CUSTOM_OPTION_TYPE_OPTIONS;

    private readonly customOptionService = inject(CustomOptionService);
    protected readonly fb = inject(FormBuilder);
    private readonly snackBar = inject(MatSnackBar);
    private readonly router = inject(Router);
    private readonly location = inject(Location);

    protected readonly id = input<string>();
    protected readonly customOptionForm = createCustomOptionFormGroup(this.fb);
    protected readonly displayedColumns = ['value', 'label', 'priceAdjustment'];

    get values() {
        return this.customOptionForm.get('values') as FormArray<CustomOptionValueFormGroup>;
    }

    protected readonly dataSource = new MatTableDataSource<CustomOptionValueFormGroup>(this.values.controls);

    constructor() {
        this.values.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            this.dataSource.data = [...this.values.controls];
        });
        this.customOptionForm
            .get('type')
            ?.valueChanges.pipe(takeUntilDestroyed())
            .subscribe((value) => {
                switch (value) {
                    case 'CHOICE':
                        this.values.clear({ emitEvent: false });
                        this.values.push(createCustomOptionValueFormGroup(this.fb));
                        break;
                    // case 'FILE_UPLOAD':
                    // case 'TEXT_INPUT':
                    //     this.values.clear();
                    //     break;
                    default:
                        throw new Error(`Something Wrong ,Unknown custom option '${value}'`);
                }
            });
        this.customOptionForm.get('type')?.setValue('CHOICE');
    }

    ngOnInit(): void {
        // console.log('id', this.id());
        const customOptionId = this.id();
        if (customOptionId) {
            this.customOptionService.getById(customOptionId).subscribe((customOption) => {
                if (customOption) {
                    const { values } = customOption;
                    this.values.clear({ emitEvent: false });
                    values.forEach((customOptionValue) => {
                        this.values.push(createCustomOptionValueFormGroup(this.fb, customOptionValue), {
                            emitEvent: false,
                        });
                    });
                    this.customOptionForm.patchValue(customOption, { emitEvent: false });
                    this.dataSource.data = [...this.values.controls];
                }
            });
        }
    }

    protected addCustomOptionValue() {
        this.values.push(createCustomOptionValueFormGroup(this.fb));
    }

    @HostListener('document:keydown.enter', [])
    protected save() {
        // console.log(this.customOptionForm.value);
        if (this.customOptionForm.valid) {
            const $request = this.id()
                ? this.customOptionService.update(this.id()!, this.customOptionForm.value as CustomOption)
                : this.customOptionService.create(this.customOptionForm.value as CustomOption);
            $request.subscribe(() => {
                this.snackBar.open('保存成功', '关闭', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
                this.goBack();
            });
        }
    }

    protected goBack(): void {
        if (window.history.length > 1) {
            // 浏览器有历史记录 → 返回上一页
            this.location.back();
        } else {
            // 没有历史，用户可能直接打开了当前页 → 回列表页
            this.router.navigate(['/catalog/custom-options']); // 换成你的列表页路由
        }
    }
}
