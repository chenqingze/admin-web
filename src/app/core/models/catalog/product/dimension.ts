export const DIMENSION_UNIT_TYPE_OPTIONS = ['CENTIMETERS', 'METERS', 'INCHES', 'FEET'] as const;
export type DimensionUnitType = (typeof DIMENSION_UNIT_TYPE_OPTIONS)[number];

export interface Dimension {
    length: number | null;
    height: number | null;
    width: number | null;
    dimensionUnit: DimensionUnitType | null;
}
