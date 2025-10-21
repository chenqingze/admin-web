import { Pageable } from '../api/models';
import { PaginatorProps } from '../ui/models';

/**
 * 后端分页数据转换
 */
export const updatePaginatorProps = (pageable: Pageable, paginatorProps: PaginatorProps) => {
    const { number, size, totalElements } = pageable;
    return {
        ...paginatorProps,
        pageIndex: parseInt(number),
        pageSize: parseInt(size),
        length: parseInt(totalElements),
    };
};
