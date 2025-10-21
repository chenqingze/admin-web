export interface Pageable {
    number: string;
    size: string;
    totalElements: string;
    totalPages: string;
}

/**
 * 分页查询响应 数据结构
 */
export interface Page<T> {
    content: T[];
    page: Pageable;
}
