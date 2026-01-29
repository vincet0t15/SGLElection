import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import candidateRoutes from '@/routes/candidate';
import type { BreadcrumbItem } from '@/types';
import { EventProps } from '@/types/event';
import { Button } from '@/components/ui/button';
import { PlusIcon, User, Search } from 'lucide-react';
import { useState, KeyboardEventHandler, useMemo } from 'react';
import { YearLevelProps } from '@/types/yearlevel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/paginationData';
import { PaginatedDataResponse } from '@/types/pagination';
import { CandidateProps } from '@/types/candidate';
import { FilterProps } from '@/types/filter';
import { PositionProps } from '@/types/position';

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
    console.log(events)
    const [search, setSearch] = useState(filters.search || '');

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
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8 bg-background">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-2 border-b">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search candidates..."
                            value={search}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                            className="pl-9"
                        />
                    </div>
                    <Button className="cursor-pointer shadow-sm" asChild>
                        <Link href="/candidate/create">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            <span>Add Candidate</span>
                        </Link>
                    </Button>
                </div>

                {/* Content Section */}
                <div className="space-y-12">
                    {events.map((data, index) => (
                        <div key={index} className="space-y-8 animate-in fade-in duration-500">
                            {/* Event Header */}
                            <div className="text-center space-y-2 border-b pb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                                    OFFICIAL CANDIDATES
                                </h2>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">to the</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tight">
                                    {data.name}
                                </h1>
                            </div>

                            {/* Positions and Candidates */}
                            {data.positions.map((position, index) => (
                                <>
                                    <div key={index} className="space-y-6">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                                                {position.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {position.candidates.map((candidate, index) => (
                                            <div key={index} className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border border-border">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={'storage/' + candidate.candidate_photos?.[0].path || ''} alt={candidate.name} />
                                                        <AvatarFallback>{candidate.name}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="text-center">
                                                        <h4 className="text-lg font-bold tracking-tight text-foreground">{candidate.name}</h4>
                                                        <p className="text-sm font-medium text-muted-foreground">{candidate.year_level?.name || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>

                            ))}
                        </div>
                    ))}

                </div>

            </div>
        </AppLayout>
    );
}
