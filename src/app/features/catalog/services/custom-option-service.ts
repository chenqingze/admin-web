import { Injectable } from '@angular/core';
import { AbstractCrudApi } from '@api';
import { CustomOption } from '@models/catalog/product/custom-option';

@Injectable({
    providedIn: 'root',
})
export class CustomOptionService extends AbstractCrudApi<CustomOption> {
    protected override endpoint = '/custom-options';
}
