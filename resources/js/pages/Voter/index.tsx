import { Head, Link, router } from '@inertiajs/react';
import { Delete, PlusIcon, Upload, Download, Printer, ShieldBan } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

import type { VoterProps } from '@/types/voter';
import voter from '@/routes/voter';
import { toast } from 'sonner';
import Heading from '@/components/heading';

interface YearLevel {
    id: number;
    name: string;
}

interface YearSection {
    id: number;
    name: string;
    year_level_id: number;
}

interface Props {
    voters: PaginatedDataResponse<VoterProps>;
    filters: FilterProps,
    events: EventProps[],
    yearLevels: YearLevel[];
    yearSections: YearSection[];
}
export default function Voter({ voters, filters, events, yearLevels, yearSections }: Props) {

    const [search, setSearch] = useState(filters.search || '');
    const [eventId, setEventId] = useState<string>(filters.event_id ? String(filters.event_id) : 'all');
    const [yearLevelId, setYearLevelId] = useState<string>(filters.year_level_id ? String(filters.year_level_id) : 'all');
    const [yearSectionId, setYearSectionId] = useState<string>(filters.year_section_id ? String(filters.year_section_id) : 'all');
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

    const updateFilters = (newFilters: any) => {
        router.get(voter.index().url, {
            search: search,
            event_id: eventId === 'all' ? undefined : eventId,
            year_level_id: yearLevelId === 'all' ? undefined : yearLevelId,
            year_section_id: yearSectionId === 'all' ? undefined : yearSectionId,
            ...newFilters
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleEventFilter = (value: string) => {
        setEventId(value);
        updateFilters({ event_id: value === 'all' ? undefined : value });
    }

    const handleYearLevelFilter = (value: string) => {
        setYearLevelId(value);
        setYearSectionId('all');
        updateFilters({
            year_level_id: value === 'all' ? undefined : value,
            year_section_id: undefined
        });
    }

    const handleYearSectionFilter = (value: string) => {
        setYearSectionId(value);
        updateFilters({ year_section_id: value === 'all' ? undefined : value });
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            updateFilters({});
        }
    }

    // Filter sections based on selected year level
    const filteredSections = yearLevelId !== 'all'
        ? yearSections.filter(section => section.year_level_id.toString() === yearLevelId)
        : yearSections;

    const handleExport = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (eventId !== 'all') params.append('event_id', eventId);
        if (yearLevelId !== 'all') params.append('year_level_id', yearLevelId);
        if (yearSectionId !== 'all') params.append('year_section_id', yearSectionId);

        window.location.href = `/voter/export?${params.toString()}`;
    };

    const handlePrint = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (eventId !== 'all') params.append('event_id', eventId);
        if (yearLevelId !== 'all') params.append('year_level_id', yearLevelId);
        if (yearSectionId !== 'all') params.append('year_section_id', yearSectionId);

        window.open(`/voter/print?${params.toString()}`, '_blank');
    };

    const handleToggleStatus = (voter: VoterProps) => {
        router.patch(`/voter/${voter.id}/toggle-status`, {}, {
            preserveScroll: true,
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
            }
        });
    };

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(voters.data.map(v => v.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (checked: boolean, id: number) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleBulkAction = (status: boolean) => {
        const action = status ? 'activate' : 'deactivate';
        const target = selectedIds.length > 0 ? `${selectedIds.length} selected voters` : 'ALL matching voters';

        if (confirm(`Are you sure you want to ${action} ${target}?`)) {
            router.post(voter.bulkStatus().url, {
                status: status,
                ids: selectedIds.length > 0 ? selectedIds : undefined,
                search: search,
                event_id: eventId,
                year_level_id: yearLevelId,
                year_section_id: yearSectionId,
            }, {
                preserveScroll: true,
                onSuccess: (response: { props: FlashProps }) => {
                    setSelectedIds([]);
                    toast.success(response.props.flash?.success);
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Voters" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Voters"
                    description="Manage registered voters eligible to participate in events."
                />
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className='gap-2 flex'>
                        <Link href={voter.create().url}>
                            <Button className="cursor-pointer" variant="outline">
                                <PlusIcon className=" h-4 w-4" />
                                <span className="rounded-sm lg:inline">Voter</span>
                            </Button>
                        </Link>

                        <Link href="/voter/import">
                            <Button className="cursor-pointer bg-blue-800 text-white">
                                <Upload className=" h-4 w-4" />
                                <span className="rounded-sm lg:inline">Import</span>
                            </Button>
                        </Link>

                        <Button
                            className="cursor-pointer bg-green-600 text-white"
                            onClick={handleExport}
                        >
                            <Download className="h-4 w-4" />
                            <span className="rounded-sm lg:inline">Export</span>
                        </Button>

                        <Button
                            className="cursor-pointer bg-gray-600 text-white"
                            onClick={handlePrint}
                        >
                            <Printer className="h-4 w-4" />
                            <span className="rounded-sm lg:inline">Print</span>
                        </Button>

                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => handleBulkAction(false)}
                        >
                            <ShieldBan className="h-4 w-4" />
                            <span className="rounded-sm lg:inline">
                                {selectedIds.length > 0 ? 'Deactivate Selected' : 'Deactivate All'}
                            </span>
                        </Button>

                        <Button
                            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleBulkAction(true)}
                        >
                            <ShieldBan className="h-4 w-4 rotate-180" />
                            <span className="rounded-sm lg:inline">
                                {selectedIds.length > 0 ? 'Activate Selected' : 'Activate All'}
                            </span>
                        </Button>

                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <Select value={yearLevelId} onValueChange={handleYearLevelFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Year Levels</SelectItem>
                                {yearLevels.map((level) => (
                                    <SelectItem key={level.id} value={String(level.id)}>
                                        {level.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={yearSectionId} onValueChange={handleYearSectionFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {filteredSections.map((section) => (
                                    <SelectItem key={section.id} value={String(section.id)}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

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
                        <Input placeholder="Search..." value={search} onChange={handleSearch} onKeyDown={handleKeyDown} className="w-[200px]" />
                    </div>
                </div>


                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[40px] pl-4">
                                    <Checkbox
                                        checked={voters.data.length > 0 && selectedIds.length === voters.data.length}
                                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                <TableHead className="text-primary font-bold">Name</TableHead>
                                <TableHead className="text-primary font-bold">Username</TableHead>
                                <TableHead className="text-primary font-bold">LRN</TableHead>
                                <TableHead className="text-primary font-bold">Year Level</TableHead>
                                <TableHead className="text-primary font-bold">Section</TableHead>
                                <TableHead className="text-primary font-bold">Status</TableHead>
                                <TableHead className="text-primary font-bold">Event</TableHead>
                                <TableHead className="text-primary font-bold text-center w-25">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {voters.data.length > 0 ? (
                                voters.data.map((voter, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell className="pl-4">
                                            <Checkbox
                                                checked={selectedIds.includes(voter.id)}
                                                onCheckedChange={(checked) => handleSelectOne(checked as boolean, voter.id)}
                                                aria-label="Select row"
                                            />
                                        </TableCell>
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
                                            <span >{voter.year_level.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.year_section.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.is_active ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{voter.event.name}</span>
                                        </TableCell>
                                        <TableCell className="text-sm gap-2 flex justify-end items-center">
                                            <div title={voter.is_active ? "Deactivate" : "Activate"}>
                                                <Switch
                                                    checked={Boolean(voter.is_active)}
                                                    onCheckedChange={() => handleToggleStatus(voter)}
                                                />
                                            </div>
                                            <Link
                                                href={`/voter/${voter.id}/edit`}
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                            >
                                                Edit
                                            </Link>
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
