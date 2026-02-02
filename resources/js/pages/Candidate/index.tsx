import { Head, Link, router, useForm } from '@inertiajs/react';
import { PlusIcon, Search, Pencil, Trash, MoreVertical, Upload, Download, Printer } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import candidateRoutes from '@/routes/candidate';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { PaginatedDataResponse } from '@/types/pagination';
import { FilterProps } from '@/types/filter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyboardEventHandler, useState } from 'react';
import Pagination from '@/components/paginationData';
import { EventProps } from '@/types/event';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CandidateProps } from '@/types/candidate';
import { YearLevelProps } from '@/types/yearlevel';
import { YearSectionProps } from '@/types/section';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { PositionProps } from '@/types/position';
import { PartylistProps } from '@/types/partylist';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Candidates',
        href: candidateRoutes.index().url,
    },
];

interface Props {
    candidates: PaginatedDataResponse<CandidateProps>;
    events: EventProps[];
    partylists: PartylistProps[];
    yearLevels: YearLevelProps[];
    yearSections: YearSectionProps[];
    filters: FilterProps;
}

export default function CandidateIndex({ candidates, events, partylists, yearLevels, yearSections, filters }: Props) {

    const [search, setSearch] = useState(filters.search || '');
    const [eventId, setEventId] = useState<string>(filters.event_id ? String(filters.event_id) : 'all');
    const [yearLevelId, setYearLevelId] = useState<string>(filters.year_level_id ? String(filters.year_level_id) : 'all');
    const [yearSectionId, setYearSectionId] = useState<string>(filters.year_section_id ? String(filters.year_section_id) : 'all');
    const [partylistId, setPartylistId] = useState<string>(filters.partylist_id ? String(filters.partylist_id) : 'all');

    const [isImportOpen, setIsImportOpen] = useState(false);
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, errors: importErrors, reset: resetImport } = useForm({
        file: null as File | null,
    });

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postImport('/candidate/import', {
            onSuccess: () => {
                setIsImportOpen(false);
                resetImport();
                toast.success('Candidates imported successfully');
            },
            onError: () => {
                toast.error('Failed to import candidates');
            }
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const updateFilters = (newFilters: any) => {
        router.get(candidateRoutes.index().url, {
            search: search,
            event_id: eventId === 'all' ? undefined : eventId,
            year_level_id: yearLevelId === 'all' ? undefined : yearLevelId,
            year_section_id: yearSectionId === 'all' ? undefined : yearSectionId,
            partylist_id: partylistId === 'all' ? undefined : partylistId,
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

    const handlePartylistFilter = (value: string) => {
        setPartylistId(value);
        updateFilters({ partylist_id: value === 'all' ? undefined : value });
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            updateFilters({});
        }
    }


    const filteredSections = yearLevelId !== 'all'
        ? yearSections.filter(section => section.year_level_id.toString() === yearLevelId)
        : yearSections;


    const filteredPartylists = eventId !== 'all'
        ? partylists.filter(partylist => partylist.event_id.toString() === eventId)
        : partylists;


    const groupedCandidates: { position: PositionProps | undefined, candidates: CandidateProps[] }[] = [];
    candidates.data.forEach(candidate => {
        const lastGroup = groupedCandidates[groupedCandidates.length - 1];
        if (lastGroup && lastGroup.position?.id === candidate.position_id) {
            lastGroup.candidates.push(candidate);
        } else {
            groupedCandidates.push({
                position: candidate.position,
                candidates: [candidate]
            });
        }
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidates" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Candidates"
                    description="Create and manage candidate profiles, positions, and partylists."
                />

                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className='flex w-full sm:w-auto gap-2'>
                        <Button className="cursor-pointer w-full sm:w-auto" asChild variant="outline">
                            <Link href={candidateRoutes.create().url}>
                                <PlusIcon className=" h-4 w-4" />
                                <span className="">Candidate</span>
                            </Link>
                        </Button>

                        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="w-full sm:w-auto">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Import Candidates</DialogTitle>
                                    <DialogDescription>
                                        Upload a CSV or Excel file to bulk import candidates.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" asChild className="w-full">
                                            <a href="/candidate/template">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download Template
                                            </a>
                                        </Button>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="file">Upload File</Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            onChange={(e) => setImportData('file', e.target.files ? e.target.files[0] : null)}
                                            accept=".csv,.xlsx,.xls"
                                        />
                                        {importErrors.file && <span className="text-red-500 text-sm">{importErrors.file}</span>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                                    <Button onClick={handleImportSubmit} disabled={importProcessing}>
                                        {importProcessing ? 'Importing...' : 'Import'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-auto sm:items-center sm:justify-end sm:flex-wrap">
                        <Select value={yearLevelId} onValueChange={handleYearLevelFilter}>
                            <SelectTrigger className="w-full sm:w-[160px]">
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
                            <SelectTrigger className="w-full sm:w-[160px]">
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
                            <SelectTrigger className="w-full sm:w-[160px]">
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

                        <Select value={partylistId} onValueChange={handlePartylistFilter}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <SelectValue placeholder="Filter by Partylist" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Partylists</SelectItem>
                                {filteredPartylists.map((partylist) => (
                                    <SelectItem key={partylist.id} value={String(partylist.id)}>
                                        {partylist.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search candidates..."
                                value={search}
                                onChange={handleSearch}
                                onKeyDown={handleKeyDown}
                                className="pl-9 w-full sm:w-[200px]"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {candidates.data.length > 0 ? (
                        groupedCandidates.map((group, groupIndex) => (
                            <div key={group.position?.id || `group-${groupIndex}`} className="space-y-2">
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-bold">{group.position?.name || 'Unknown Position'}</h2>
                                    {group.position?.max_votes && (
                                        <p className="text-sm text-muted-foreground">
                                            Top {group.position.max_votes} candidate{group.position.max_votes > 1 ? 's' : ''} will win
                                        </p>
                                    )}
                                </div>
                                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[80px]">Photo</TableHead>
                                                <TableHead className="text-primary font-bold">Name</TableHead>
                                                <TableHead className="text-primary font-bold text-center w-25">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {group.candidates.map((candidate, index) => (
                                                <TableRow key={index} className="text-sm">
                                                    <TableCell>
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage
                                                                src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : ''}
                                                                alt={candidate.name}
                                                                className="object-cover"
                                                            />
                                                            <AvatarFallback>
                                                                {candidate.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell className='flex flex-col'>
                                                        <span className="font-medium">{candidate.name}</span>
                                                        <div className="flex gap-2 items-center">
                                                            <span className='text-xs text-muted-foreground'>{candidate.year_level?.name}</span>
                                                            <span className="text-xs text-muted-foreground">{candidate.year_section?.name}</span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{candidate.partylist?.name || '-'}</span>
                                                    </TableCell>


                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/candidate/${candidate.id}/edit`} className="cursor-pointer flex items-center">
                                                                            <Pencil className="mr-2 h-4 w-4" />
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                                                                        onClick={() => {
                                                                            if (confirm('Are you sure you want to delete this candidate?')) {
                                                                                router.delete(`/candidate/${candidate.id}`, {
                                                                                    onSuccess: () => toast.success('Candidate deleted successfully')
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Trash className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[80px]">Photo</TableHead>
                                        <TableHead className="text-primary font-bold">Name</TableHead>
                                        <TableHead className="text-primary font-bold text-center w-25">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                <div>
                    <Pagination data={candidates} />
                </div>
            </div>
        </AppLayout>
    );
}
