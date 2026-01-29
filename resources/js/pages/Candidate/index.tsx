import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import candidateRoutes from '@/routes/candidate';
import type { BreadcrumbItem } from '@/types';
import { EventProps } from '@/types/event';
import { Button } from '@/components/ui/button';
import { PlusIcon, User } from 'lucide-react';
import { useState, KeyboardEventHandler } from 'react';
import { CandidateCreateDialog } from './create';
import { YearLevelProps } from '@/types/yearlevel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/paginationData';
import { PaginatedDataResponse } from '@/types/pagination';
import { CandidateProps } from '@/types/candidate';
import { FilterProps } from '@/types/filter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Candidates',
        href: '#',
    },
];

interface Props {
    candidates: PaginatedDataResponse<CandidateProps>;
    events: EventProps[];
    yearLevels: YearLevelProps[];
    filters: FilterProps;
}

export default function CandidateIndex({ candidates, events, yearLevels, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.get(candidateRoutes.index().url, {
                search: search,
            }, {
                preserveState: true,
                preserveScroll: true,
            })
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidates" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button className="cursor-pointer" onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        <span className="rounded-sm lg:inline">Candidate</span>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Input placeholder="Search..." value={search} onChange={handleSearch} onKeyDown={handleKeyDown} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px]">Photo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Year Level</TableHead>
                                <TableHead>Section</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.data.length > 0 ? (
                                candidates.data.map((candidate) => (
                                    <TableRow key={candidate.id}>
                                        <TableCell>
                                            <Avatar className="h-10 w-10 border border-muted">
                                                {candidate.candidate_photos && candidate.candidate_photos.length > 0 ? (
                                                    <AvatarImage
                                                        src={`/storage/${candidate.candidate_photos[0].path}`}
                                                        alt={candidate.name}
                                                        className="object-cover"
                                                    />
                                                ) : null}
                                                <AvatarFallback className="bg-muted">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{candidate.name}</TableCell>
                                        <TableCell>{candidate.event?.name}</TableCell>
                                        <TableCell>{candidate.position?.name}</TableCell>
                                        <TableCell>{candidate.year_level?.name}</TableCell>
                                        <TableCell>{candidate.year_section?.name}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No candidates found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={candidates} />
            </div>

            {openCreateDialog && (
                <CandidateCreateDialog
                    open={openCreateDialog}
                    setOpen={setOpenCreateDialog}
                    events={events}
                    yearLevels={yearLevels}
                />
            )}
        </AppLayout>
    );
}
