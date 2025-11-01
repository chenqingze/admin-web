export const WEIGHT_UNIT_TYPE_OPTIONS = ['GRAMS', 'KILOGRAMS', 'TONS', 'POUNDS'] as const;
export type WeightUnitType = (typeof WEIGHT_UNIT_TYPE_OPTIONS)[number];

export interface Weight {
    weightValue?: number | null;
    weightUnit?: WeightUnitType | null;
}
