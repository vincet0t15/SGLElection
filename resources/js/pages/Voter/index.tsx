import { Head, Link, router } from '@inertiajs/react';
import { Delete, PlusIcon } from 'lucide-react';
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
import { PositionProps } from '@/types/position';
import position from '@/routes/position';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

import type { VoterProps } from '@/types/voter';
import voter from '@/routes/voter';

interface Props {
    voters: PaginatedDataResponse<VoterProps>;
    filters: FilterProps,
    events: EventProps[],
}
export default function Voter({ voters, filters, events }: Props) {

    const [search, setSearch] = useState(filters.search || '');
    const [eventId, setEventId] = useState<string>(filters.event_id ? String(filters.event_id) : 'all');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<PositionProps>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleClickEdit = (position: PositionProps) => {
        setSelectedPosition(position);
        setOpenEditDialog(true);
    }
    const handleClickDelete = (position: PositionProps) => {
        setSelectedPosition(position);
        setOpenDeleteDialog(true);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleEventFilter = (value: string) => {
        setEventId(value);
        router.get(position.index().url, {
            search: search,
            event_id: value === 'all' ? undefined : value
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.get(position.index().url, {
                search: search,
                event_id: eventId === 'all' ? undefined : eventId
            },
                {
                    preserveState: true,
                    preserveScroll: true,
                })
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Year Level" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className='gap-2 flex'>
                        <Link href={voter.create().url}>
                            <Button className="cursor-pointer" >
                                <PlusIcon className=" h-4 w-4" />
                                <span className="rounded-sm lg:inline">Voter</span>
                            </Button>
                        </Link>

                        <Button className="cursor-pointer" onClick={() => setOpenCreateDialog(true)}>
                            <PlusIcon className=" h-4 w-4" />
                            <span className="rounded-sm lg:inline">Import</span>
                        </Button>

                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={eventId} onValueChange={handleEventFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                {events.map((event) => (
                                    <SelectItem key={event.id} value={String(event.id)}>
                                        {event.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input placeholder="Search..." value={search} onChange={handleSearch} onKeyDown={handleKeyDown} />
                    </div>
                </div>


                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Position Name</TableHead>
                                <TableHead className="text-primary font-bold">Event</TableHead>
                                <TableHead className="text-primary font-bold">Max Votes</TableHead>
                                <TableHead className="text-primary font-bold text-center w-25">Position Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {voters.data.length > 0 ? (
                                voters.data.map((voter, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>
                                            <span >{voter.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.username}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.lrn_number}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.yearLevel.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.yearSection.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.is_active ? 'Active' : 'Inactive'}</span>
                                        </TableCell>
                                        <TableCell className="text-sm gap-2 flex justify-end">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"

                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"

                                            >
                                                Delete
                                            </span>


                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={voters} />
                </div>
            </div>
        </AppLayout >
    );
}
