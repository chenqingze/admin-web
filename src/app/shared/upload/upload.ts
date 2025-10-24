import { Component, inject, model, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileInfo } from './models';
import { FileService } from './services/file-service';

@Component({
    selector: 'sa-upload',
    imports: [CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule],
    templateUrl: './upload.html',
    styleUrl: './upload.scss',
})
export class Upload {
    private readonly fileService = inject(FileService);
    private readonly snackBar = inject(MatSnackBar);

    protected readonly uploadProgress = signal<number>(0);

    protected readonly multiple = signal<boolean>(false);
    readonly uploadFiles = model<UploadFileInfo[]>([]);
}
