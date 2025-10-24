import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    private collectionFacade = inject(CollectionService);
    private readonly data = inject<string>(MAT_DIALOG_DATA);

    protected readonly collectionForm = new FormGroup({});

    ngOnInit(): void {
        if (this.data) {
            this.collectionFacade.getById(this.data).subscribe((collection) => {
                console.log(collection);
            });
        }
    }
}
