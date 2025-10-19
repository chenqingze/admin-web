import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth-guard';
import { guestGuard } from '@core/auth/guards/guest-guard';

export const routes: Routes = [
    // admin
    {
        path: '',
        data: {
            perms: ['dashboard'],
            icon: 'dashboard',
            showInMenu: true,
            isLayout: true,
        },
        canActivate: [authGuard],
        loadComponent: () => import('./core/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
                title: '仪表盘',
                data: {
                    perms: ['dashboard'],
                    icon: 'dashboard',
                    showInMenu: true,
                },
            },
            // 商品目录
            {
                path: 'catalog',
                title: '商品目录',
                data: {
                    perms: ['catalog'],
                    icon: 'category',
                    showInMenu: true,
                    isVirtual: true,
                },
                children: [
                    {
                        path: 'products',
                        loadComponent: () =>
                            import('@features/catalog/product/pages/product-list-page/product-list-page').then(
                                (m) => m.ProductListPage,
                            ),
                        title: '商品管理',
                        data: {
                            perms: ['product:list'],
                            icon: 'inventory_2',
                            showInMenu: true,
                        },
                    },
                    {
                        path: 'collections',
                        loadComponent: () =>
                            import('@features/catalog/collection/pages/collection-list-page/collection-list-page').then(
                                (m) => m.CollectionListPage,
                            ),
                        title: '商品分类',
                        data: {
                            icon: 'widgets',
                            showInMenu: true,
                            perms: ['collection:list'],
                        },
                    },
                    {
                        path: 'brands',
                        loadComponent: () =>
                            import('@features/catalog/brand/pages/brand-list-page/brand-list-page').then(
                                (m) => m.BrandListPage,
                            ),
                        title: '品牌管理',
                        data: {
                            perms: ['brand:list'],
                            icon: 'branding_watermark',
                            showInMenu: true,
                        },
                    },
                ],
            },
            // // 订单
            // {
            //     path: 'orders',
            //     title: '订单管理',
            //     data: {
            //         perms: ['order'],
            //         icon: 'receipt_long',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: '',
            //             title: '订单列表',
            //             data: {
            //                 perms: ['order:list'],
            //                 icon: 'list_alt',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'refunds',
            //             title: '退款管理',
            //             data: {
            //                 perms: ['refunds:list'],
            //                 icon: 'receipt_long',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'delivery',
            //             title: '配送管理',
            //             data: {
            //                 perms: ['delivery:list'],
            //                 icon: 'delivery_long',
            //                 showInMenu: true,
            //             },
            //         },
            //     ],
            // },
            // // 客户/顾客/会员
            // {
            //     path: 'customer',
            //     title: '客户/会员管理',
            //     data: {
            //         perms: ['customer:list'],
            //         icon: 'people',
            //         showInMenu: true,
            //     },
            // },
            // // 库存
            // {
            //     path: 'inventory',
            //     title: '库存管理',
            //     data: {
            //         perms: ['inventory:list'],
            //         icon: 'inventory',
            //         showInMenu: true,
            //     },
            // },
            // // 支付
            // {
            //     path: 'payment',
            //     title: '支付管理',
            //     data: {
            //         perms: ['payment:list'],
            //         icon: 'payment',
            //         showInMenu: true,
            //     },
            // },
            // // 促销活动
            // {
            //     path: 'promotions',
            //     title: '促销管理',
            //     data: {
            //         perms: ['promotion'],
            //         icon: 'campaign',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: 'coupon',
            //             title: '优惠券',
            //             data: {
            //                 perms: ['coupon:list'],
            //                 icon: 'card_giftcard',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'discount',
            //             title: '满减/折扣活动',
            //             data: {
            //                 perms: ['discount:list'],
            //                 icon: 'discount',
            //                 showInMenu: true,
            //             },
            //         },
            //     ],
            // },
            // // 报表
            // {
            //     path: 'reports',
            //     title: '满减/折扣活动',
            //     data: {
            //         perms: ['report:list'],
            //         icon: 'bar_chart',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: 'discount',
            //             title: '销售报表',
            //             data: {
            //                 perms: ['report:sales'],
            //                 icon: 'attach_money',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'inventory',
            //             title: '库存报表',
            //             data: {
            //                 perms: ['report:inventory'],
            //                 icon: 'assessment',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'c-analysis',
            //             title: '用户分析',
            //             data: {
            //                 perms: ['report:customer_analysis'],
            //                 icon: 'insights',
            //                 showInMenu: true,
            //             },
            //         },
            //     ],
            // },
            // // 系统设置
            // {
            //     path: 'settings',
            //     title: '系统设置',
            //     data: {
            //         perms: ['settings'],
            //         icon: 'settings',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: 'permissions',
            //             title: '权限配置',
            //             data: {
            //                 perms: ['permission:list'],
            //                 icon: 'security',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'roles',
            //             title: '角色管理',
            //             data: {
            //                 perms: ['role:list'],
            //                 icon: 'permission',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'params',
            //             title: '系统参数',
            //             data: {
            //                 perms: ['param:list'],
            //                 icon: 'tune',
            //                 showInMenu: true,
            //             },
            //         },
            //     ],
            // },
            // demo
            {
                path: 'address',
                loadComponent: () =>
                    import('./features/demo/address-form/address-form.component').then((m) => m.AddressFormComponent),
            },
            {
                path: 'drag-drag',
                loadComponent: () =>
                    import('./features/demo/drag-drag/drag-drag.component').then((m) => m.DragDragComponent),
            },
            {
                path: 'navigation',
                loadComponent: () =>
                    import('./features/demo/navigation/navigation.component').then((m) => m.NavigationComponent),
            },
            {
                path: 'table',
                loadComponent: () => import('./features/demo/table/table.component').then((m) => m.TableComponent),
            },
            {
                path: 'tree',
                loadComponent: () => import('./features/demo/tree/tree.component').then((m) => m.TreeComponent),
            },
        ],
    },

    // auth
    {
        path: 'auth',
        canActivate: [guestGuard],
        loadComponent: () => import('./core/layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./core/auth/pages/login/login').then((m) => m.Login),
            },
        ],
    },
];
