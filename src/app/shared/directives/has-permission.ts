import { Directive, effect, inject, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthStore } from '@auth';

@Directive({
    selector: '[appHasPermission]',
})
export class HasPermission implements OnInit {
    readonly appHasPermission = input<string>();
    private readonly templateRef = inject(TemplateRef);
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly authStore = inject(AuthStore);

    ngOnInit() {
        effect(() => {
            const perm = this.appHasPermission();
            if (!perm) return;

            /*const allowed = Array.isArray(perms)
                ? perms.some((p) => this.authStore.hasPermissionSignal(p)())
                : this.authStore.hasPermissionSignal(perms)();*/
            const allowed = this.authStore.hasPermissionSignal(perm)();

            this.viewContainer.clear();

            if (allowed) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
