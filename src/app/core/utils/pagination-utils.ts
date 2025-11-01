import { Pageable } from '../api';
import { PaginatorProps } from '../ui';

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
