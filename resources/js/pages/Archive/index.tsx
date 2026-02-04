import { Head, router } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginatedDataResponse } from '@/types/pagination';
import { FilterProps } from '@/types/filter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyboardEventHandler, useState } from 'react';

import Pagination from '@/components/paginationData';
import { EventProps } from '@/types/event';
import event from '@/routes/event';
import archives from '@/routes/archives';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Archives',
        href: archives.index().url,
    },
];

interface Props {
    events: PaginatedDataResponse<EventProps>;
    filters: FilterProps,
}

export default function Archive({ events, filters }: Props) {

    const [search, setSearch] = useState(filters.search || '');

    const handleToggleArchive = (ev: EventProps) => {
        router.put(event.toggleArchive(ev.id).url, {}, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = search ? { search: search } : undefined;
            // Use current URL for search
            router.get(window.location.pathname, queryString,
                {
                    preserveState: true,
                    preserveScroll: true,
                })
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archived Events" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Archived Events"
                    description="View and manage archived events. Restore them to make them active again."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <div className="flex items-center gap-2">
                        <Input placeholder="Search..." value={search} onChange={handleSearch} onKeyDown={handleKeyDown} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Event Name</TableHead>
                                <TableHead className="text-primary font-bold">Event Start</TableHead>
                                <TableHead className="text-primary font-bold">Event End</TableHead>
                                <TableHead className="text-primary font-bold">Event Location</TableHead>
                                <TableHead className="text-primary font-bold">Event Description</TableHead>
                                <TableHead className="text-primary font-bold text-center w-25">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.data.length > 0 ? (
                                events.data.map((ev, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>
                                            <span >{ev.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span>
                                                {
                                                    new Intl.DateTimeFormat(undefined, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    }).format(new Date(ev.dateTime_start))
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span>
                                                {
                                                    new Intl.DateTimeFormat(undefined, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    }).format(new Date(ev.dateTime_end))
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{ev.location}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{ev.description}</span>
                                        </TableCell>
                                        <TableCell className="text-sm gap-2 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                                onClick={() => handleToggleArchive(ev)}
                                            >
                                                <RotateCcw className="h-4 w-4 mr-1" />
                                                Restore
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-3 text-center text-gray-500">
                                        No archived events found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={events} />
                </div>
            </div>
        </AppLayout >
    );
}
