import { BaseModel } from '../../base-model';

export const CUSTOM_OPTION_TYPE_OPTIONS = ['SELECT', 'TEXT', 'NUMBER', 'IMAGE'] as const;
export type CustomOptionType = (typeof CUSTOM_OPTION_TYPE_OPTIONS)[number];

export const ADJUSTMENT_TYPE_OPTIONS = ['FIX', 'PERCENT'] as const;
export type AdjustmentType = (typeof ADJUSTMENT_TYPE_OPTIONS)[number];

export interface CustomOptionValue {
    label: string | null;
    value: string;
    adjustmentValue: string | null;
    adjustmentType: AdjustmentType | null;
}

export interface CustomOption extends BaseModel {
    id: string | null;
    name: string;
    type: CustomOptionType;
    required: boolean;
    multiple: boolean;
    values: CustomOptionValue[];
}
