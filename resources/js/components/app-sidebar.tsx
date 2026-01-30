import { Link } from '@inertiajs/react';
import { BarChart3Icon, BookOpen, Calendar1Icon, File, FlagIcon, Folder, Layers3Icon, LayoutGrid, Lock, User, UserCheck2, Users, Vote } from 'lucide-react';
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
import partylist from '@/routes/partylist';

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
            { title: 'Year Level', href: yearLevel.index().url, icon: Layers3Icon },
            { title: 'Events', href: event.index().url, icon: Calendar1Icon },
            { title: 'Positions', href: position.index().url, icon: Vote },
            { title: 'Partylists', href: partylist.index().url, icon: FlagIcon },
            { title: 'Candidates', href: candidate.index().url, icon: UserCheck2 },
            { title: 'Reports', href: reports.index().url, icon: BarChart3Icon },
            { title: 'Voters', href: voter.index().url, icon: Users },
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
