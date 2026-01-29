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
import { KeyboardEventHandler, useState } from 'react';
import Pagination from '@/components/paginationData';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import position from '@/routes/position';
import { PositionCreateDialog } from './create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    positions: PaginatedDataResponse<PositionProps>;
    filters: FilterProps,
    events: EventProps[],
}
export default function Position({ positions, filters, events }: Props) {

    const [search, setSearch] = useState(filters.search || '');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [dataToEdit, setDataEdit] = useState<PositionProps | null>(null);
    const [dataToDelete, setDataDelete] = useState<PositionProps | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleClickEdit = (position: PositionProps) => {
        setDataEdit(position);
        setOpenEditDialog(true);
    }
    const handleClickDelete = (position: PositionProps) => {
        setDataDelete(position);
        setOpenDeleteDialog(true);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = search ? { search: search } : undefined;

            router.get(position.index().url, queryString,
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
                    <Button className="cursor-pointer" onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className=" h-4 w-4" />
                        <span className="rounded-sm lg:inline">Position</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input placeholder="Search..." value={search} onChange={handleSearch} onKeyDown={handleKeyDown} />
                    </div>
                </div>


                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Position Name</TableHead>
                                <TableHead className="text-primary font-bold">Max Votes</TableHead>
                                <TableHead className="text-primary font-bold text-center w-25">Position Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {positions.data.length > 0 ? (
                                positions.data.map((position, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>
                                            <span >{position.name}</span>
                                        </TableCell>

                                        <TableCell>
                                            <span >{position.max_votes}</span>
                                        </TableCell>

                                        <TableCell className="text-sm gap-2 flex justify-end">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                                onClick={() => {
                                                    handleClickEdit(position)
                                                }}
                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => {
                                                    handleClickDelete(position);

                                                }}
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
                    <Pagination data={positions} />
                </div>
            </div>

            {openCreateDialog && <PositionCreateDialog open={openCreateDialog} setOpen={setOpenCreateDialog} events={events} />}

        </AppLayout >
    );
}
