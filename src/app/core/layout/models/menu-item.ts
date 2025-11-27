export interface MenuItem {
    path?: string | null;
    label: string;
    icon: string;
    children?: MenuItem[];
    isVirtual?: boolean;
}
