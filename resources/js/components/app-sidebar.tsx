import { Link } from '@inertiajs/react';
import { BookOpen, File, Folder, LayoutGrid, Lock, User } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import results from '@/routes/results';
import yearLevel from '@/routes/year-level';
import event from '@/routes/event';
import position from '@/routes/position';
import candidate from '@/routes/candidate';
import reports from '@/routes/reports';
import voter from '@/routes/voter';

const mainNavItems: NavItem[] = [
    {
        name: 'General',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Results',
                href: results.index().url,
                icon: BookOpen,
            },

        ]
    },
    {
        name: 'Settings',
        items: [
            { title: 'Year Level', href: yearLevel.index().url, icon: LayoutGrid },
            { title: 'Events', href: event.index().url, icon: Folder },
            { title: 'Positions', href: position.index().url, icon: BookOpen },
            { title: 'Candidates', href: candidate.index().url, icon: User },
            { title: 'Reports', href: reports.index().url, icon: File },
            { title: 'Voters', href: voter.index().url, icon: Lock },
        ]
    }

];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
