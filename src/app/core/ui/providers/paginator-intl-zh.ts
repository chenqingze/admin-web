import { MatPaginatorIntl } from '@angular/material/paginator';

export function getZhPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = '每页显示';
    paginatorIntl.nextPageLabel = '下一页';
    paginatorIntl.previousPageLabel = '上一页';
    paginatorIntl.firstPageLabel = '第一页';
    paginatorIntl.lastPageLabel = '最后一页';
    paginatorIntl.getRangeLabel = (page, pageSize, length) => {
        if (length === 0 || pageSize === 0) {
            return `第 0 条，共 ${length} 条`;
        }
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `第 ${startIndex + 1} - ${endIndex} 条，共 ${length} 条`;
    };

    return paginatorIntl;
}
