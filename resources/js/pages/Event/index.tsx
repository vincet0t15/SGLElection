import { Head, router } from '@inertiajs/react';
import { Delete, PlusIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginatedDataResponse } from '@/types/pagination';
import { FilterProps } from '@/types/filter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { YearLevelProps } from '@/types/yearlevel';
import { KeyboardEventHandler, useState } from 'react';

import Pagination from '@/components/paginationData';
import { YearSectionProps } from '@/types/section';
import yearSection from '@/routes/year-section';
import { EventProps } from '@/types/event';
import { EventCreateDialog } from './create';
import event from '@/routes/event';
import { EventEditDialog } from './edit';
import DeleteEvent from './delete';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    events: PaginatedDataResponse<EventProps>;
    filters: FilterProps,
}
export default function Event({ events, filters }: Props) {

    const [search, setSearch] = useState(filters.search || '');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [dataToEdit, setDataEdit] = useState<EventProps | null>(null);
    const [dataToDelete, setDataDelete] = useState<EventProps | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleClickEdit = (event: EventProps) => {
        setDataEdit(event);
        setOpenEditDialog(true);
    }
    const handleClickDelete = (event: EventProps) => {
        setDataDelete(event);
        setOpenDeleteDialog(true);
    }

    const handleToggleActive = (ev: EventProps) => {
        console.log(ev)
        router.put(event.update(ev.id).url, {
            name: ev.name,
            dateTime_start: ev.dateTime_start,
            dateTime_end: ev.dateTime_end,
            location: ev?.location,
            description: ev?.description,
            is_active: !ev.is_active,
        }, {
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

            router.get(event.index().url, queryString,
                {
                    preserveState: true,
                    preserveScroll: true,
                })
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Events"
                    description="Create, update, or remove events and manage their availability in reports."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button className="cursor-pointer" onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className=" h-4 w-4" />
                        <span className="rounded-sm lg:inline">Event</span>
                    </Button>

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
                                <TableHead className="text-primary font-bold">Event Status</TableHead>
                                <TableHead className="text-primary font-bold text-center w-25">Event Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.data.length > 0 ? (
                                events.data.map((event, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>
                                            <span >{event.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span>
                                                {
                                                    new Intl.DateTimeFormat(undefined, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    }).format(new Date(event.dateTime_start))
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span>
                                                {
                                                    new Intl.DateTimeFormat(undefined, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    }).format(new Date(event.dateTime_end))
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{event.location}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{event.description}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{event.is_active ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>}</span>
                                        </TableCell>
                                        <TableCell className="text-sm gap-2 flex justify-end">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                                onClick={() => {
                                                    handleClickEdit(event)
                                                }}
                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => {
                                                    handleClickDelete(event);

                                                }}
                                            >
                                                Delete
                                            </span>
                                            <span
                                                className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline w-25"
                                                onClick={() => handleToggleActive(event)}
                                            >
                                                {event.is_active ? 'Deactivate' : 'Activate'}
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
                    <Pagination data={events} />
                </div>
            </div>

            {openCreateDialog && <EventCreateDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />}
            {openEditDialog && <EventEditDialog open={openEditDialog} setOpen={setOpenEditDialog} SelectedEvent={dataToEdit} />}
            {openDeleteDialog && <DeleteEvent open={openDeleteDialog} setOpen={setOpenDeleteDialog} dataToDelete={dataToDelete} />}
        </AppLayout >
    );
}
