import { Directive, effect, inject, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthStore } from '@core/auth/services/auth-store';

@Directive({
    selector: '[appHasPermission]',
})
export class HasPermission implements OnInit {
    readonly appHasPermission = input<string | string[]>([]);
    private readonly templateRef = inject(TemplateRef);
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly authStore = inject(AuthStore);

    ngOnInit() {
        effect(() => {
            const perms = this.appHasPermission();
            if (!perms) return;

            const allowed = Array.isArray(perms)
                ? perms.some((p) => this.authStore.hasPermissionSignal(p)())
                : this.authStore.hasPermissionSignal(perms)();

            this.viewContainer.clear();

            if (allowed) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
