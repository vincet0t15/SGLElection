import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    name: string;
    href?: string;
    icon?: LucideIcon | null;
    items?: {
        title: string;
        href: NonNullable<InertiaLinkProps['href']>;
        icon?: LucideIcon | null;
        isActive?: boolean;
    }[];
};
