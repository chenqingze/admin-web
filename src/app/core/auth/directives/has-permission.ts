import { Directive, effect, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthStore } from '../store/auth-store';

@Directive({
    selector: '[appHasPermission]',
})
export class HasPermission implements OnInit {
    @Input('appHasPermission') requiredPerm!: string | string[];

    private templateRef = inject(TemplateRef);
    private viewContainer = inject(ViewContainerRef);
    private authStore = inject(AuthStore);

    ngOnInit() {
        effect(() => {
            const perms = this.requiredPerm;
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
