export interface RouteExtraData {
    label?: string; // 如果不提供默认,使用route自带的title属性
    perms: string[]; // 所需权限
    icon?: string; // 显示图标
    showInMenu?: boolean; // 是否显示到导航菜单
    isLayout?: boolean; // layout route 布局路由
    isVirtual?: boolean; // virtual/abstract route 虚拟/抽象路由
}
