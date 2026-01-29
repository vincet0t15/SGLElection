import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { EventProps } from '@/types/event';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

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

interface CandidatePhoto {
    id: number;
    path: string;
}

interface CandidateWithPhotos {
    id: number;
    name: string;
    candidate_photos: CandidatePhoto[];
}

interface PositionWithCandidates {
    id: number;
    name: string;
    candidates: CandidateWithPhotos[];
}

interface EventWithPositions {
    id: number;
    name: string;
    positions: PositionWithCandidates[];
}

interface Props {
    events: EventWithPositions[];
}

export default function CandidateIndex({ events }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidates" />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="flex flex-col gap-6">
                            <div className="flex flex-col items-center justify-center space-y-2 border-b pb-4">
                                <h2 className="text-3xl font-bold tracking-tight text-primary">{event.name}</h2>
                            </div>

                            <div className="flex flex-col gap-8">
                                {event.positions.map((position) => (
                                    <div key={position.id} className="flex flex-col items-center gap-4">
                                        <div className="relative flex items-center justify-center w-full">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-dashed border-muted-foreground/30" />
                                            </div>
                                            <div className="relative bg-background px-4">
                                                <h3 className="text-xl font-semibold text-muted-foreground uppercase tracking-wider">
                                                    {position.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-6">
                                            {position.candidates.length > 0 ? (
                                                position.candidates.map((candidate) => (
                                                    <Card key={candidate.id} className="w-64 transition-all hover:shadow-md">
                                                        <CardContent className="flex flex-col items-center p-6 gap-4">
                                                            <Avatar className="h-32 w-32 border-4 border-muted">
                                                                {candidate.candidate_photos && candidate.candidate_photos.length > 0 ? (
                                                                    <AvatarImage
                                                                        src={`/storage/${candidate.candidate_photos[0].path}`}
                                                                        alt={candidate.name}
                                                                        className="object-cover"
                                                                    />
                                                                ) : null}
                                                                <AvatarFallback className="bg-muted">
                                                                    <User className="h-16 w-16 text-muted-foreground" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="text-center space-y-1">
                                                                <h4 className="font-bold text-lg leading-none">{candidate.name}</h4>
                                                                <p className="text-sm text-muted-foreground">Candidate</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="text-sm text-muted-foreground italic py-4">
                                                    No candidates for this position
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex h-64 items-center justify-center text-muted-foreground">
                        No active events found.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
