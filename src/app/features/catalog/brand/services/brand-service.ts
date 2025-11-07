import { Injectable } from '@angular/core';
import { AbstractCrudApi } from '@api';
import { Brand } from '@models';

@Injectable({
    providedIn: 'root',
})
export class BrandService extends AbstractCrudApi<Brand> {
    protected override endpoint = '/brands';
}
