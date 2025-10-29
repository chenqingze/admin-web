import { Injectable } from '@angular/core';
import { AbstractCrudApi } from '@core/api/abstract-crud-api';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends AbstractCrudApi<Product> {
    protected override endpoint = '/products';
}
