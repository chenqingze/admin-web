export const DIMENSION_UNIT_TYPE_OPTIONS = ['CENTIMETERS', 'METERS', 'INCHES', 'FEET'] as const;
export type DimensionUnitType = (typeof DIMENSION_UNIT_TYPE_OPTIONS)[number];

export interface Dimension {
    length: string | null;
    height: string | null;
    width: string | null;
    dimensionUnit: DimensionUnitType | null;
}
