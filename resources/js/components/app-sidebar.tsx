import { Link } from '@inertiajs/react';
import { BarChart3Icon, BookOpen, Calendar1Icon, CheckIcon, File, FileText, FingerprintIcon, FlagIcon, Layers3Icon, LayoutGrid, UserCheck2, Users, Vote } from 'lucide-react';
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
import { dashboard, voteLogs } from '@/routes';
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
import signatories from '@/routes/signatories';

const mainNavItems: NavItem[] = [
    {
        name: 'Overview',
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
            {
                title: 'Reports',
                href: reports.index().url,
                icon: BarChart3Icon,
            },
        ]
    },
    {
        name: 'Election Management',
        items: [
            { title: 'Events', href: event.index().url, icon: Calendar1Icon },
            { title: 'Positions', href: position.index().url, icon: Vote },
            { title: 'Partylists', href: partylist.index().url, icon: FlagIcon },
            { title: 'Candidates', href: candidate.index().url, icon: UserCheck2 },
        ]
    },
    {
        name: 'Voter Management',
        items: [
            { title: 'Voters', href: voter.index().url, icon: Users },
            { title: 'Year Levels', href: yearLevel.index().url, icon: Layers3Icon },
            { title: 'Vote Logs', href: voteLogs(), icon: FingerprintIcon },
        ]
    },
    {
        name: 'Configuration',
        items: [
            { title: 'Signatories', href: signatories.index().url, icon: FileText },
        ]
    }
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="h-14" asChild>
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
