import { Head, router } from '@inertiajs/react';
import { Delete, Dot, Minus, PlusIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginatedDataResponse } from '@/types/pagination';
import { FilterProps } from '@/types/filter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { YearLevelProps } from '@/types/yearlevel';
import React, { KeyboardEventHandler, useState } from 'react';
import { YearLevelCreateDialog } from './create';
import { YearLevelEditDialog } from './edit';
import yearLevel from '@/routes/year-level';
import DeleteYearLevel from './delete';
import Pagination from '@/components/paginationData';
import { YearSectionCreate } from '../YearSection/create';
import { YearSectionProps } from '@/types/section';
import { YearSectionEdit } from '../YearSection/edit';
import DeleteYearSection from '../YearSection/delete';
import Heading from '@/components/heading';
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
    const [openCreateSection, setOpenCreateSection] = useState(false);
    const [dataToCreateSection, setDataToCreateSection] = useState<YearLevelProps | null>(null);
    const [yearSections, setYearSections] = useState<YearSectionProps | null>(null);
    const [openEditYearSectionDialog, setOpenEditYearSectionDialog] = useState(false);
    const [openDeleteSectionDialog, setOpenDeleteSectionDialog] = useState(false);

    const handleCLickDeleteSection = (section: YearSectionProps) => {
        setYearSections(section);
        setOpenDeleteSectionDialog(true);
    }
    const handleClickEditSection = (section: YearSectionProps) => {
        setYearSections(section);
        setOpenEditYearSectionDialog(true);
    }
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

    const handleClickCreateSection = (yearLevel: YearLevelProps) => {
        setOpenCreateSection(true)
        setDataToCreateSection(yearLevel)
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Year Level" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Year Level"
                    description="Create and manage year level records for student classification."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button className="cursor-pointer" onClick={() => setOpenCreateDialog(true)} variant="outline">
                        <PlusIcon className="h-4 w-4" />
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
                                yearLevels.data.map((yearLevel) => (
                                    <React.Fragment key={yearLevel.id}>
                                        {/* Year Level row */}
                                        <TableRow className="text-sm font-medium">
                                            <TableCell>
                                                {yearLevel.name}
                                            </TableCell>

                                            <TableCell className="flex justify-end gap-3">
                                                <span
                                                    className="cursor-pointer text-teal-800 hover:text-teal-900 hover:underline"
                                                    onClick={() => handleClickCreateSection(yearLevel)}
                                                >
                                                    Create Section
                                                </span>
                                                <span
                                                    className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                                    onClick={() => handleClickEdit(yearLevel)}
                                                >
                                                    Edit
                                                </span>

                                                <span
                                                    className="cursor-pointer text-red-500 hover:text-red-700 hover:underline"
                                                    onClick={() => handleClickDelete(yearLevel)}
                                                >
                                                    Delete
                                                </span>
                                            </TableCell>
                                        </TableRow>

                                        {/* Section rows */}
                                        {yearLevel.section.map((section) => (
                                            <TableRow key={section.id} className="text-sm bg-gray-50">
                                                <TableCell>
                                                    <div className="pl-8 flex items-center gap-1">
                                                        <Minus className="h-4 w-4 text-gray-400" />
                                                        <span>{section.name}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex justify-end gap-3">
                                                        <span
                                                            className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                                                            onClick={() => handleClickEditSection(section)}
                                                        >
                                                            Edit
                                                        </span>

                                                        <span
                                                            className="cursor-pointer text-red-500 hover:text-red-700 hover:underline"
                                                            onClick={() => handleCLickDeleteSection(section)}
                                                        >
                                                            Delete
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                        ))}
                                    </React.Fragment>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-3 text-center text-gray-500">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={yearLevels} />
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

            {openCreateSection && (
                <YearSectionCreate open={openCreateSection} setOpen={setOpenCreateSection} yearLevel={dataToCreateSection} />
            )}

            {openEditYearSectionDialog && yearSections && (
                <YearSectionEdit open={openEditYearSectionDialog} setOpen={setOpenEditYearSectionDialog} dataToEdit={yearSections} />
            )}

            {
                openDeleteSectionDialog && yearSections && (
                    <DeleteYearSection open={openDeleteSectionDialog} setOpen={setOpenDeleteSectionDialog} dataToDelete={yearSections} />
                )
            }
        </AppLayout >
    );
}
