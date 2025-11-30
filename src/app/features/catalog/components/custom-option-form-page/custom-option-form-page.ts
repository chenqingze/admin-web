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
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomOptionService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
export class CustomOptionFormPage implements OnInit {
    protected readonly CUSTOM_OPTION_TYPE_OPTIONS = CUSTOM_OPTION_TYPE_OPTIONS;

    private readonly customOptionService = inject(CustomOptionService);
    protected readonly fb = inject(FormBuilder);
    private readonly snackBar = inject(MatSnackBar);
    private readonly router = inject(Router);

    protected readonly id = input<string>();
    protected readonly customOptionForm = createCustomOptionFormGroup(this.fb);
    protected readonly displayedColumns = ['value', 'label', 'priceAdjustment'];

    get values() {
        return this.customOptionForm.get('values') as FormArray<CustomOptionValueFormGroup>;
    }

    protected readonly dataSource = new MatTableDataSource<CustomOptionValueFormGroup>(this.values.controls);

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
        this.values.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            this.dataSource.data = [...this.values.controls];
        });
    }

    ngOnInit(): void {
        // todo: 处理编辑时的初始化数据
        console.log('id', this.id());
    }

    protected addCustomOptionValue() {
        this.values.push(createCustomOptionValueFormGroup(this.fb));
    }

    @HostListener('document:keydown.enter', [])
    protected save() {
        console.log(this.customOptionForm.value);
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
                this.router.navigateByUrl('/catalog/custom-options');
            });
        }
    }
}
