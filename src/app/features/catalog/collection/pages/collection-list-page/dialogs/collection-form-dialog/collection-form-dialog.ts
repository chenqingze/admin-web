import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectionService } from '../../../../services/collection-service';
import { UploadFileList } from '@shared/upload/components/upload-file-list/upload-file-list';

@Component({
    selector: 'sa-collection-form-dialog',
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        UploadFileList,
    ],
    templateUrl: './collection-form-dialog.html',
    styleUrl: './collection-form-dialog.scss',
})
export class CollectionFormDialog implements OnInit {
    private collectionService = inject(CollectionService);
    private readonly data = inject<string>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<CollectionFormDialog>);

    protected readonly collectionForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        imageId: new FormControl(''),
    });

    ngOnInit(): void {
        if (this.data) {
            this.collectionService.getById(this.data).subscribe((collection) => {
                console.log(collection);
            });
        }
    }

    protected onSave() {
        if (this.collectionForm.valid) {
            // this.collectionForm.setValue();
            this.dialogRef.close(this.collectionForm.value);
        }
    }
}
