import {
    booleanAttribute,
    Directive,
    DOCUMENT,
    ElementRef,
    HostListener,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { BooleanInput, coerceStringArray } from '@angular/cdk/coercion';
import { fileDropFilter } from './file-drop-filter';

@Directive({
    selector: '[appFileSelect]',
    exportAs: 'appFileSelect',
    host: {
        '[attr.data-disabled]': 'disabled() ? "" : null',
        '[attr.data-dragover]': 'isDragOver() ? "" : null',
    },
})
export class FileSelect {
    /**
     * document
     */
    private readonly document = inject<Document>(DOCUMENT);

    /**
     * host element.
     */
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /**
     * 允许上传的文件类型
     */
    readonly fileTypes = input<string[], string | string[]>(undefined, {
        transform: (types) => coerceStringArray(types, ','),
    });

    /**
     * 是否允许多文件上传
     */
    readonly multiple = input<boolean, BooleanInput>(false, {
        transform: booleanAttribute,
    });

    /**
     * 是否允许用户选择目录
     */
    readonly directory = input<boolean, BooleanInput>(false, {
        transform: booleanAttribute,
    });

    /**
     * 是否开启拖拽功能
     */
    readonly dragAndDrop = input<boolean, BooleanInput>(true, {
        transform: booleanAttribute,
    });

    /**
     * 是否仅用上传
     */
    readonly disabled = input<boolean, BooleanInput>(false, {
        transform: booleanAttribute,
    });

    /**
     * 触发选择事件
     */
    readonly selected = output<FileList | null>();

    /**
     * 用户取消上传时触发
     */
    readonly canceled = output<void>();

    /**
     * Emits when uploaded files are rejected because they do not match the allowed {@link fileTypes}.
     */
    readonly rejected = output<void>();

    /**
     * Emits when the user drags a file over the file upload.
     */
    readonly dragOver = output<boolean>();

    /**
     * Whether the user is currently dragging a file over the file upload.
     */
    protected readonly isDragOver = signal<boolean>(false);

    /**
     * 用于上传的input元素
     */
    private input: HTMLInputElement = this.document.createElement('input');

    constructor() {
        this.input.type = 'file';
        this.input.addEventListener('change', () => {
            this.selected.emit(this.input.files);
            // clear the input value to allow re-uploading the same file
            this.input.value = '';
        });
        this.input.addEventListener('cancel', () => this.canceled.emit());
    }

    @HostListener('click')
    protected showFileDialog(): void {
        if (this.disabled()) {
            return;
        }

        const fileTypes = this.fileTypes()?.join(',');

        if (fileTypes) {
            this.input.accept = fileTypes;
        }

        this.input.multiple = this.multiple();
        this.input.webkitdirectory = this.directory();
        this.input.click();
    }

    @HostListener('dragenter', ['$event'])
    protected onDragEnter(event: DragEvent): void {
        if (this.disabled() || !this.dragAndDrop()) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(true);
        this.dragOver.emit(true);
    }

    @HostListener('dragover', ['$event'])
    protected onDragOver(event: DragEvent): void {
        if (this.disabled() || !this.dragAndDrop()) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        this.isDragOver.set(true);
    }

    @HostListener('dragleave', ['$event'])
    protected onDragLeave(event: DragEvent): void {
        if (this.disabled() || !this.dragAndDrop() || !this.isDragOver()) {
            return;
        }

        // if the element we are dragging over is a child of the file upload, ignore the event
        if (this.elementRef.nativeElement.contains(event.relatedTarget as Node)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);
        this.dragOver.emit(false);
    }

    @HostListener('drop', ['$event'])
    protected onDrop(event: DragEvent): void {
        if (this.disabled() || !this.dragAndDrop()) {
            return;
        }

        event.preventDefault();
        this.isDragOver.set(false);
        this.dragOver.emit(false);

        const fileList = event.dataTransfer?.files;
        if (fileList) {
            const filteredFiles = fileDropFilter(fileList, this.fileTypes(), this.multiple());

            if (filteredFiles) {
                this.selected.emit(filteredFiles);
            } else {
                this.rejected.emit();
            }
        }
    }
}
