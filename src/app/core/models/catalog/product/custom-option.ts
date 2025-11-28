import { BaseModel } from '../../base-model';

export interface CustomOptionValue {
    id: string | null;
    label: string | null;
    value: string;
    priceAdjustment: string | null;
}

export const CUSTOM_OPTION_TYPE_OPTIONS = ['SINGLE_CHOICE', 'MULTI_CHOICE', 'TEXT_INPUT', 'FILE_UPLOAD'] as const;
export type CustomOptionType = (typeof CUSTOM_OPTION_TYPE_OPTIONS)[number];

export interface CustomOption extends BaseModel {
    id: string | null;
    name: string;
    position: number;
    type: CustomOptionType;
    required: boolean;
    priceAdjustment: string | null;
    values: CustomOptionValue[];
}
