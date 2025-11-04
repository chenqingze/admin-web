import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
    selector: '[saDecimalPlaces]',
})
export class DecimalPlaces {
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    readonly saDecimalPlaces = input(2);

    @HostListener('blur')
    onBlur() {
        const input = this.elementRef.nativeElement as HTMLInputElement;
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            // 转成字符串，保留固定小数位
            input.value = value.toFixed(this.saDecimalPlaces());
        }
    }
}
