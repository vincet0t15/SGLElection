import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import candidateRoutes from '@/routes/candidate';
import type { BreadcrumbItem } from '@/types';
import { EventProps } from '@/types/event';
import { Button } from '@/components/ui/button';
import { PlusIcon, User, Search, MoreVertical, Pencil, Trash } from 'lucide-react';
import { useState, KeyboardEventHandler, useMemo } from 'react';
import { YearLevelProps } from '@/types/yearlevel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { PaginatedDataResponse } from '@/types/pagination';
import { CandidateProps } from '@/types/candidate';
import { FilterProps } from '@/types/filter';
import { PositionProps } from '@/types/position';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import candidate from '@/routes/candidate';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
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
                        <Link href={candidate.create().url}>
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
                                <div key={index} className="space-y-6">
                                    <div key={index} className="space-y-2">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                                                {position.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-6">
                                        {position.candidates.map((candidate, index) => (
                                            <div key={index} className="flex flex-col items-center justify-center bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group relative overflow-hidden w-full sm:w-[300px]">
                                                {/* Actions */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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

                                                {/* Background decoration */}
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                <div className="flex flex-col items-center justify-center gap-4 pt-2">
                                                    <Avatar className="h-32 w-32 border-[4px] border-yellow-400 shadow-lg ring-4 ring-background">
                                                        <AvatarImage
                                                            src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : ''}
                                                            alt={candidate.name}
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
                                                            {candidate.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="text-center space-y-1 w-full">
                                                        <h4 className="text-lg font-black tracking-tight text-foreground uppercase leading-tight px-2">
                                                            {candidate.name}
                                                        </h4>

                                                        <div className="flex flex-col gap-0.5">
                                                            <p className="text-sm font-medium text-muted-foreground italic">
                                                                {candidate.year_level?.name || 'N/A'}
                                                            </p>
                                                            <p className="text-xs font-bold text-primary/80 uppercase tracking-wide">
                                                                {candidate.year_section?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            ))}
                        </div>
                    ))}

                </div>

            </div>
        </AppLayout>
    );
}
