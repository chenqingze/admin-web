import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Collection } from '@models';
import { Upload, UploadFileInfo } from '@shared/upload';
import { CollectionService } from '../../services/collection-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-collection-form-dialog',
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule,
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
    private readonly snackBar = inject(MatSnackBar);

    protected readonly mediaList = signal<UploadFileInfo[]>([]);
    private readonly id = signal<string | undefined>(undefined);

    protected readonly collectionForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        mediaId: new FormControl(),
        visible: new FormControl(true),
    });

    constructor() {
        effect(() => {
            const mediaId = this.mediaList()[0]?.id ?? null;
            this.collectionForm.patchValue({ mediaId });
        });
        if (this.data) {
            this.collectionService.getById(this.data).subscribe((collection) => {
                const { id, name, mediaId, mediaPath, mediaType, visible } = collection;
                this.id.set(id!);
                if (mediaId && mediaPath) {
                    this.mediaList.update((items) => [
                        ...items,
                        { id: mediaId, path: mediaPath, type: mediaType, status: 'SUCCESS' } as UploadFileInfo,
                    ]);
                }
                this.collectionForm.setValue({ name: name, mediaId, visible });
            });
        }
    }

    @HostListener('document:keydown.enter', [])
    protected save() {
        if (this.collectionForm.valid) {
            const $request = this.id()
                ? this.collectionService.update(this.id()!, this.collectionForm.value as Collection)
                : this.collectionService.create(this.collectionForm.value as Collection);
            $request.subscribe(() => {
                this.snackBar.open('保存成功', '关闭', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
                this.dialogRef.close(this.collectionForm.value);
            });
        }
    }
}
