import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Lock,
    Menu,
    Palette,
    Search,
    Shield,
    User,
    ChevronDown,
    FileText,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    Menubar,
    MenubarContent,

    MenubarItem,
    MenubarMenu,

    MenubarTrigger,
} from "@/components/ui/menubar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import * as yearLevel from '@/routes/year-level';
import type { BreadcrumbItem, SharedData } from '@/types';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import yearSection from '@/routes/year-section';
import event from '@/routes/event';
import position from '@/routes/position';
import candidate from '@/routes/candidate';
import reports from '@/routes/reports';


type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const navItems = [
    { title: 'Dashboard', href: dashboard() },
];

const settingsItems = [
    { title: 'Year Level', href: yearLevel.index().url, icon: LayoutGrid },
    { title: 'Events', href: event.index().url, icon: Folder },
    { title: 'Positions', href: position.index().url, icon: BookOpen },
    { title: 'Candidates', href: candidate.index().url, icon: User },
    { title: 'Reports', href: reports.index().url, icon: FileText },
];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl } = useCurrentUrl();
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 ">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-[34px] w-[34px]"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            <Link
                                                href="/"
                                                className="flex items-center space-x-2 font-medium"
                                            >
                                                <span>Home</span>
                                            </Link>
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}

                                            <Collapsible className="group/collapsible">
                                                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
                                                    Settings
                                                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <div className="flex flex-col space-y-3 pl-2 pt-3">
                                                        {settingsItems.map((item) => (
                                                            <Link
                                                                key={item.title}
                                                                href={item.href}
                                                                className="flex items-center space-x-2 text-neutral-500 hover:text-black dark:hover:text-white"
                                                            >
                                                                <item.icon className="h-4 w-4" />
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>


                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden h-full items-center space-x-6 lg:flex absolute left-1/2 -translate-x-1/2">
                        <Menubar className="border-none bg-transparent shadow-none">
                            {navItems.map((item) => (
                                <MenubarMenu key={item.title}>
                                    <MenubarTrigger asChild className={cn("cursor-pointer", isCurrentUrl(item.href) && activeItemStyles)}>
                                        <Link href={item.href}>
                                            {item.title}
                                        </Link>
                                    </MenubarTrigger>
                                </MenubarMenu>
                            ))}
                            <MenubarMenu>
                                <MenubarTrigger className="cursor-pointer">
                                    Settings <ChevronDown className="ml-1 h-3 w-3" />
                                </MenubarTrigger>

                                <MenubarContent>
                                    {settingsItems.map((item) => (
                                        <MenubarItem key={item.title} asChild>
                                            <Link href={item.href} className={cn("cursor-pointer w-full", isCurrentUrl(item.href) && activeItemStyles)}>
                                                <item.icon className="mr-2 h-4 w-4" />
                                                {item.title}
                                            </Link>
                                        </MenubarItem>
                                    ))}
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
