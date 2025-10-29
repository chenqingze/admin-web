import { Injectable } from '@angular/core';
import { AbstractCrudApi } from '@core/api/abstract-crud-api';
import { Collection } from '../models/collection';

@Injectable({
    providedIn: 'root',
})
export class CollectionService extends AbstractCrudApi<Collection> {
    protected override endpoint = '/collections';
}
