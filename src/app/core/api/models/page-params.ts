/**
 * 排序字段、方向
 */
export const DIRECTION_OPTION = ['ASC', 'DESC'] as const;
export type Direction = (typeof DIRECTION_OPTION)[number];

export interface Sort {
    property: string; // 要排序的字段名
    direction: Direction; // 排序方向
}

/**
 * 分页参数
 */
export interface PageParams {
    page: number; // 页码
    size: number; // 每页数据记录数
    sort?: Sort[]; // 排序字段
    direction?: Direction; // 排序方向,升降序
}
