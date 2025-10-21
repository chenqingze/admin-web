import { LOCALE_ID, Provider } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorIntl } from '@angular/material/paginator';
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { getZhPaginatorIntl } from './paginator-intl-zh';

// 注册中文语言环境
registerLocaleData(localeZh);

export const uiProviders: Provider[] = [
    { provide: LOCALE_ID, useValue: 'zh-CN' }, // 或 'zh-Hans'
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    { provide: MatPaginatorIntl, useValue: getZhPaginatorIntl() },
    {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            appearance: 'outline',
        },
    },
    {
        provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
        useValue: {
            pageSizeOptions: [5, 10, 15, 20, 30],
            hidePageSize: false,
            showFirstLastButtons: true,
        },
    },
];
