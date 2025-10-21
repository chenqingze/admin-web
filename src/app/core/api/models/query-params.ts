import { FilterParams } from './filter-params';
import { PageParams } from './page-params';

export type QueryParams = Partial<FilterParams & PageParams>;
