import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { creatProductFormGroup, VariantFromGroup, VariantOptionFormGroup } from '../../forms';
import { Upload } from '@shared/upload';

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
        Upload,
        NgxEditorModule,
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

    private readonly fb = inject(FormBuilder);

    protected readonly productForm = creatProductFormGroup(this.fb);

    get variantOptions() {
        return this.productForm.get('variantOptions') as FormArray<VariantOptionFormGroup>;
    }

    get variants() {
        return this.productForm.get('variants') as FormArray<VariantFromGroup>;
    }

    ngOnInit(): void {
        this.editor = new Editor();
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }
}
