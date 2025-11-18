import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Upload, UploadFileInfo } from '@shared/upload';
import { Brand } from '@models';
import { BrandService } from '../../services/brand-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-dialogs',
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        Upload,
    ],
    templateUrl: './brand-form-dialog.html',
    styleUrl: './brand-form-dialog.scss',
})
export class BrandFormDialog {
    private readonly brandService = inject(BrandService);
    private readonly data = inject<string>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<BrandFormDialog>);
    private readonly snackBar = inject(MatSnackBar);

    protected readonly mediaList = signal<UploadFileInfo[]>([]);
    private readonly id = signal<string | undefined>(undefined);

    protected readonly brandForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        mediaId: new FormControl(),
        visible: new FormControl(true),
    });

    constructor() {
        effect(() => {
            const mediaId = this.mediaList()[0]?.id ?? null;
            this.brandForm.patchValue({ mediaId });
        });
        if (this.data) {
            this.brandService.getById(this.data).subscribe((brand) => {
                const { id, name, mediaId, mediaPath, mediaType, visible } = brand;
                this.id.set(id!);
                if (mediaId && mediaPath) {
                    this.mediaList.update((items) => [
                        ...items,
                        { id: mediaId, path: mediaPath, type: mediaType, status: 'SUCCESS' } as UploadFileInfo,
                    ]);
                }
                this.brandForm.setValue({ name: name, mediaId, visible });
            });
        }
    }

    @HostListener('document:keydown.enter', [])
    protected save() {
        if (this.brandForm.valid) {
            const $request = this.id()
                ? this.brandService.update(this.id()!, this.brandForm.value as Brand)
                : this.brandService.create(this.brandForm.value as Brand);
            $request.subscribe(() => {
                this.snackBar.open('保存成功', '关闭', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
                this.dialogRef.close(this.brandForm.value);
            });
        }
    }
}
