import { booleanAttribute, Directive, ElementRef, inject, input, OnDestroy, output, Renderer2 } from '@angular/core';

/**
 * 阻止routerLink默认导航事件,并触发后续点击事件逻辑
 */
@Directive({
    selector: '[appSkipNavigation][routerLink]',
})
export class SkipNavigation implements OnDestroy {
    appSkipNavigation = input(false, { transform: booleanAttribute });
    skipNavigationClick = output();
    private readonly unsubscribe: () => void;

    private readonly ref = inject(ElementRef);

    private readonly renderer = inject(Renderer2);

    constructor() {
        this.unsubscribe = this.renderer.listen(this.ref.nativeElement as HTMLElement, 'click', (event: MouseEvent) => {
            if (this.appSkipNavigation()) {
                event.stopImmediatePropagation();
                this.skipNavigationClick.emit();
            }
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }
}
