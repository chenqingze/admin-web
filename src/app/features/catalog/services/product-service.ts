import { Injectable } from '@angular/core';
import { AbstractCrudApi } from '@api';
import { Product } from '@models';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends AbstractCrudApi<Product> {
    protected override endpoint = '/products';
}
