import { Injectable } from '@angular/core';
import { Collection } from '@models';
import { AbstractCrudApi } from '@api';

@Injectable({
    providedIn: 'root',
})
export class CollectionService extends AbstractCrudApi<Collection> {
    protected override endpoint = '/collections';
}
