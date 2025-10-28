import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectionService } from '../../../../services/collection-service';
import { Upload } from '@shared/upload/upload';
import { UploadFileInfo } from '@shared/upload/models';
import { Collection } from '../../../../models/collection';

@Component({
    selector: 'sa-collection-form-dialog',
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        Upload,
    ],
    templateUrl: './collection-form-dialog.html',
    styleUrl: './collection-form-dialog.scss',
})
export class CollectionFormDialog {
    private readonly collectionService = inject(CollectionService);
    private readonly data = inject<string>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<CollectionFormDialog>);
    protected readonly imageList = signal<UploadFileInfo[]>([]);
    private readonly id = signal<string | undefined>(undefined);

    protected readonly collectionForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        imageId: new FormControl(),
    });

    constructor() {
        effect(() => {
            const imageId = this.imageList()[0]?.id ?? null;
            console.log('this.imageList()', this.imageList());
            this.collectionForm.patchValue({ imageId });
        });
        if (this.data) {
            this.collectionService.getById(this.data).subscribe((collection) => {
                const { id, name, imageId, imagePath } = collection;
                this.id.set(id);
                if (imageId && imagePath) {
                    this.imageList.update((items) => [
                        ...items,
                        { id: imageId, path: imagePath, type: 'IMAGE', status: 'SUCCESS' } as UploadFileInfo,
                    ]);
                }
                this.collectionForm.setValue({ name: name, imageId });
            });
        }
    }

    @HostListener('document:keydown.enter', [])
    protected onSave() {
        if (this.collectionForm.valid) {
            const request = this.id()
                ? this.collectionService.update(this.id()!, this.collectionForm.value as Collection)
                : this.collectionService.create(this.collectionForm.value as Collection);
            request.subscribe(() => {
                this.dialogRef.close(this.collectionForm.value);
            });
        }
    }
}
