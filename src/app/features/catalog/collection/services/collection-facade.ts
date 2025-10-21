import { Injectable } from '@angular/core';
import { AbstractCrudApi } from '@core/api/abstract-crud-api';
import { Collection } from '../models/collection';
import { buildHttpParams } from '@core/utils/api-utils';
import { Observable } from 'rxjs';
import { FilterParams, Page, PageParams } from '@core/api/models';

@Injectable({
    providedIn: 'root',
})
export class CollectionFacade extends AbstractCrudApi<Collection> {
    protected override endpoint = '/collections';

    getPage(pageParams?: PageParams, filterParams?: FilterParams): Observable<Page<Collection>> {
        const params = buildHttpParams({ ...pageParams, ...filterParams });
        return this.http.get<Page<Collection>>(this.endpoint, { params });
    }
}
