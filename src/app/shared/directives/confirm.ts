import { computed, Directive, HostListener, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ComponentType } from '@angular/cdk/overlay';
import { ConfirmData, ConfirmDialog } from '../confirm';

@Directive({
    selector: '[appConfirm]',
})
export class Confirm {
    private defaultData: ConfirmData = {
        title: '确认操作',
        message: '',
        confirmText: '确定',
        cancelText: '取消',
    };

    readonly disabled = input<boolean>(false);
    readonly confirmDialogComponent = input<ComponentType<unknown>>(ConfirmDialog);
    readonly width = input('320px');
    readonly height = input('auto');
    readonly message = input.required<string>();
    readonly options = input<Omit<ConfirmData, 'message'>>();
    private readonly confirmData = computed<ConfirmData>(() => ({
        ...this.defaultData,
        ...this.options(),
        message: this.message(),
    }));

    readonly confirmed = output<void>();

    private readonly dialog = inject(MatDialog);

    @HostListener('click')
    protected showFileDialog(): void {
        if (this.disabled()) {
            return;
        }
        const dialogRef = this.dialog.open(this.confirmDialogComponent(), {
            width: this.width(),
            height: this.height(),
            data: this.confirmData(),
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.confirmed.emit();
            }
        });
    }
}
