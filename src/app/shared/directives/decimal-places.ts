import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
    selector: '[appDecimalPlaces]',
})
export class DecimalPlaces {
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    readonly appDecimalPlaces = input(2);

    @HostListener('blur')
    onBlur() {
        const input = this.elementRef.nativeElement as HTMLInputElement;
        const rawValue = input.value.trim();

        // 如果输入为空，直接返回
        if (!rawValue) return;

        // 正则判断合法数字
        // ^-?                 可选负号
        // (0|[1-9]\d*)        整数部分：0 或 非0开头的数字
        // (\.\d+)?$            可选小数部分，至少一位小数
        if (!/^-?(0|[1-9]\d*)(\.\d+)?$/.test(rawValue)) {
            // 非法输入 → 直接返回，不修改
            return;
        }
        const numericValue = Number(rawValue);
        // parseFloat() 后缀非法字符,会截断解析前部分 而 Number() 返回NaN
        // const numericValue = parseFloat(rawValue);

        if (!isNaN(numericValue)) {
            // 转成字符串，保留固定小数位
            input.value = numericValue.toFixed(this.appDecimalPlaces());
        }
    }
}
