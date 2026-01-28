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
import { YearLevelCreateDialog } from './create';
import { YearLevelEditDialog } from './edit';
import yearLevel from '@/routes/year-level';
import DeleteYearLevel from './delete';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    yearLevels: PaginatedDataResponse<YearLevelProps>;
    filters: FilterProps
}
export default function YearLevel({ yearLevels, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [dataToEdit, setDataEdit] = useState<YearLevelProps | null>(null);
    const [dataToDelete, setDataDelete] = useState<YearLevelProps | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


    const handleClickEdit = (yearLevel: YearLevelProps) => {
        setDataEdit(yearLevel);
        setOpenEditDialog(true);
    }
    const handleClickDelete = (yearLevel: YearLevelProps) => {
        setDataDelete(yearLevel);
        setOpenDeleteDialog(true);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = search ? { search: search } : undefined;

            router.get(yearLevel.index().url, queryString,
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
                        <PlusIcon className="mr-2 h-4 w-4" />
                        <span className="rounded-sm lg:inline">Year Level</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input placeholder="Search..." value={search} onChange={handleSearch} onKeyDown={handleKeyDown} />
                    </div>
                </div>


                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Year Level Name</TableHead>

                                <TableHead className="text-primary font-bold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {yearLevels.data.length > 0 ? (
                                yearLevels.data.map((yearLevel, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>
                                            <span >{yearLevel.name}</span>
                                        </TableCell>

                                        <TableCell className="text-sm gap-2 flex justify-end">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                                onClick={() => {
                                                    handleClickEdit(yearLevel)
                                                }}

                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => {
                                                    handleClickDelete(yearLevel);

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
            </div>
            {
                openCreateDialog && (
                    <YearLevelCreateDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />
                )
            }

            {
                openEditDialog && dataToEdit && (
                    <YearLevelEditDialog open={openEditDialog} setOpen={setOpenEditDialog} yearlevel={dataToEdit} />
                )
            }
            {
                openDeleteDialog && dataToDelete && (
                    <DeleteYearLevel open={openDeleteDialog} setOpen={setOpenDeleteDialog} dataToDelete={dataToDelete} />
                )
            }
        </AppLayout >
    );
}
