import { BaseModel } from '../../base-model';

export const ADJUSTMENT_TYPE_OPTIONS = ['FIX', 'PERCENT'] as const;
export type AdjustmentType = (typeof ADJUSTMENT_TYPE_OPTIONS)[number];

export interface CustomOptionValue {
    label: string | null;
    value: string;
    adjustmentValue: string | null;
    adjustmentType: AdjustmentType | null;
}

export const CUSTOM_OPTION_SCOPE_OPTIONS = ['GLOBAL', 'CATEGORY', 'PRODUCT'] as const;
export type CustomOptionScope = (typeof CUSTOM_OPTION_SCOPE_OPTIONS)[number];

export const CUSTOM_OPTION_TYPE_OPTIONS = ['SELECT', 'TEXT', 'NUMBER', 'IMAGE'] as const;
export type CustomOptionType = (typeof CUSTOM_OPTION_TYPE_OPTIONS)[number];

export interface CustomOption extends BaseModel {
    id: string | null;
    name: string;
    position: number;
    type: CustomOptionType;
    scope: CustomOptionScope;
    required: boolean;
    maxSelect: number | null;
    values: CustomOptionValue[];
}
