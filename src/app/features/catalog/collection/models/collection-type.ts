export const COLLECTION_TYPE_OPTIONS = ['MANUAL', 'AUTOMATED'] as const;
export type CollectionType = (typeof COLLECTION_TYPE_OPTIONS)[number];
