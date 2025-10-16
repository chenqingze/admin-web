export interface MenuItem {
    icon: string;
    label: string;
    path?: string;
    children?: MenuItem[];
}
