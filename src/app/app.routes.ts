import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@auth';

export const routes: Routes = [
    // admin
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./core/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
        data: {
            perm: 'dashboard',
            icon: 'dashboard',
            showInMenu: true,
            isLayout: true,
        },
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            {
                path: 'dashboard',
                title: '仪表盘',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
                data: {
                    perm: 'dashboard',
                    icon: 'dashboard',
                    showInMenu: true,
                },
            },
            // 商品目录
            {
                path: 'catalog',
                title: '商品目录',
                data: {
                    perm: 'catalog',
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
                            perm: 'product:list',
                            icon: 'inventory_2',
                            showInMenu: true,
                        },
                    },
                    {
                        path: 'products/new',
                        loadComponent: () =>
                            import('@features/catalog/product/pages/product-form-page/product-form-page').then(
                                (m) => m.ProductFormPage,
                            ),
                        title: '新增商品',
                        data: {
                            perm: 'product:create',
                            icon: 'inventory_2',
                            showInMenu: false,
                        },
                    },
                    {
                        path: 'products/:id/edit',
                        loadComponent: () =>
                            import('@features/catalog/product/pages/product-form-page/product-form-page').then(
                                (m) => m.ProductFormPage,
                            ),
                        title: '编辑商品',
                        data: {
                            perm: 'product:edit',
                            icon: 'inventory_2',
                            showInMenu: false,
                        },
                    },
                    {
                        path: 'products/:id',
                        loadComponent: () =>
                            import('@features/catalog/product/pages/product-detail-page/product-detail-page').then(
                                (m) => m.ProductDetailPage,
                            ),
                        title: '商品详情',
                        data: {
                            perm: 'product:view',
                            icon: 'inventory_2',
                            showInMenu: false,
                        },
                    },

                    {
                        path: 'collections',
                        loadComponent: () =>
                            import('@features/catalog/collection/collection-list-page/collection-list-page').then(
                                (m) => m.CollectionListPage,
                            ),
                        title: '商品分组',
                        data: {
                            icon: 'widgets',
                            showInMenu: true,
                            perm: 'collection:list',
                        },
                    },
                    {
                        path: 'brands',
                        loadComponent: () =>
                            import('@features/catalog/brand/brand-list-page/brand-list-page').then(
                                (m) => m.BrandListPage,
                            ),
                        title: '品牌管理',
                        data: {
                            perm: 'brand:list',
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
            //         perm: 'order',
            //         icon: 'receipt_long',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: '',
            //             title: '订单列表',
            //             data: {
            //                 perm: 'order:list',
            //                 icon: 'list_alt',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'refunds',
            //             title: '退款管理',
            //             data: {
            //                 perm: 'refunds:list',
            //                 icon: 'receipt_long',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'delivery',
            //             title: '配送管理',
            //             data: {
            //                 perm: 'delivery:list',
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
            //         perm: 'customer:list',
            //         icon: 'people',
            //         showInMenu: true,
            //     },
            // },
            // // 库存
            // {
            //     path: 'inventory',
            //     title: '库存管理',
            //     data: {
            //         perm: 'inventory:list',
            //         icon: 'inventory',
            //         showInMenu: true,
            //     },
            // },
            // // 支付
            // {
            //     path: 'payment',
            //     title: '支付管理',
            //     data: {
            //         perm: 'payment:list',
            //         icon: 'payment',
            //         showInMenu: true,
            //     },
            // },
            // // 促销活动
            // {
            //     path: 'promotions',
            //     title: '促销管理',
            //     data: {
            //         perm: 'promotion',
            //         icon: 'campaign',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: 'coupon',
            //             title: '优惠券',
            //             data: {
            //                 perm: 'coupon:list',
            //                 icon: 'card_giftcard',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'discount',
            //             title: '满减/折扣活动',
            //             data: {
            //                 perm: 'discount:list',
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
            //         perm: 'report:list',
            //         icon: 'bar_chart',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: 'discount',
            //             title: '销售报表',
            //             data: {
            //                 perm: 'report:sales',
            //                 icon: 'attach_money',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'inventory',
            //             title: '库存报表',
            //             data: {
            //                 perm: 'report:inventory',
            //                 icon: 'assessment',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'c-analysis',
            //             title: '用户分析',
            //             data: {
            //                 perm: 'report:customer_analysis',
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
            //         perm: 'settings',
            //         icon: 'settings',
            //         showInMenu: true,
            //     },
            //     children: [
            //         {
            //             path: 'permissions',
            //             title: '权限配置',
            //             data: {
            //                 perm: 'permission:list',
            //                 icon: 'security',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'roles',
            //             title: '角色管理',
            //             data: {
            //                 perm: 'role:list',
            //                 icon: 'permission',
            //                 showInMenu: true,
            //             },
            //         },
            //         {
            //             path: 'params',
            //             title: '系统参数',
            //             data: {
            //                 perm: 'param:list',
            //                 icon: 'tune',
            //                 showInMenu: true,
            //             },
            //         },
            //     ],
            // },
            // demo
            {
                path: 'address',
                title: 'address',
                loadComponent: () =>
                    import('./features/demo/address-form/address-form.component').then((m) => m.AddressFormComponent),
                data: {
                    perm: 'address',
                    icon: 'address',
                    showInMenu: true,
                },
            },
            {
                path: 'drag-drag',
                title: 'drag-drag',
                loadComponent: () =>
                    import('./features/demo/drag-drag/drag-drag.component').then((m) => m.DragDragComponent),
                data: {
                    perm: 'drag-drag',
                    icon: 'drag-drag',
                    showInMenu: true,
                },
            },
            {
                path: 'navigation',
                title: 'navigation',
                loadComponent: () =>
                    import('./features/demo/navigation/navigation.component').then((m) => m.NavigationComponent),
                data: {
                    perm: 'navigation',
                    icon: 'navigation',
                    showInMenu: true,
                },
            },
            {
                path: 'table',
                title: 'table',
                loadComponent: () => import('./features/demo/table/table.component').then((m) => m.TableComponent),
                data: {
                    perm: 'table',
                    icon: 'table',
                    showInMenu: true,
                },
            },
            {
                path: 'tree',
                title: 'tree',
                loadComponent: () => import('./features/demo/tree/tree.component').then((m) => m.TreeComponent),
                data: {
                    perm: 'tree',
                    icon: 'tree',
                    showInMenu: true,
                },
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
