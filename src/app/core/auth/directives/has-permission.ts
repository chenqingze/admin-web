import { Directive, effect, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionStore } from '../stores/permission-store';

@Directive({
    selector: '[appHasPermission]',
})
export class HasPermission implements OnInit {
    @Input('appHasPermission') requiredPerm!: string | string[];

    private templateRef = inject(TemplateRef);
    private viewContainer = inject(ViewContainerRef);
    private permissionStore = inject(PermissionStore);

    ngOnInit() {
        effect(() => {
            const perms = this.requiredPerm;
            if (!perms) return;

            const allowed = Array.isArray(perms)
                ? perms.some((p) => this.permissionStore.hasPermissionSignal(p)())
                : this.permissionStore.hasPermissionSignal(perms)();

            this.viewContainer.clear();

            if (allowed) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
