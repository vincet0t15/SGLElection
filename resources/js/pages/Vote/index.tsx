import { Head, useForm } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { EventProps } from '@/types/event';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, User, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Props {
    events: EventProps[];
}

export default function VoteIndex({ events }: Props) {
    // State to store votes: { [positionId]: [candidateId1, candidateId2, ...] }
    const [votes, setVotes] = useState<Record<number, number[]>>({});

    const handleVote = (positionId: number, candidateId: number, maxVotes: number) => {
        setVotes(prev => {
            const currentVotes = prev[positionId] || [];
            const isSelected = currentVotes.includes(candidateId);

            if (isSelected) {
                // Deselect
                return {
                    ...prev,
                    [positionId]: currentVotes.filter(id => id !== candidateId)
                };
            } else {
                // Select
                if (currentVotes.length >= maxVotes) {
                    toast.error(`You can only select ${maxVotes} candidate(s) for this position.`);
                    return prev;
                }
                return {
                    ...prev,
                    [positionId]: [...currentVotes, candidateId]
                };
            }
        });
    };

    const isSelected = (positionId: number, candidateId: number) => {
        return (votes[positionId] || []).includes(candidateId);
    };

    const handleSubmit = () => {
        // Here you would typically send the votes to the backend
        console.log('Votes submitted:', votes);
        toast.success("Votes submitted successfully (Simulation)");
        // router.post('/vote', { votes });
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <Head title="Vote" />
            <Toaster richColors position="top-right" />

            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Official Ballot</h1>
                        <p className="text-muted-foreground mt-1">Select your preferred candidates for each position.</p>
                    </div>
                </div>

                {events.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No active election events found.
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="space-y-10">
                            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-md">
                                <h2 className="text-2xl font-bold text-primary">{event.name}</h2>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>

                            {event.positions.map((position) => (
                                <section key={position.id} className="space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-2">
                                        <div>
                                            <h3 className="text-xl font-semibold">{position.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Vote for <span className="font-medium text-foreground">{position.max_votes}</span> candidate(s)
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                Selected: {(votes[position.id] || []).length} / {position.max_votes}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {position.candidates.map((candidate) => {
                                            const selected = isSelected(position.id, candidate.id);
                                            const photoUrl = candidate.candidate_photos && candidate.candidate_photos.length > 0
                                                ? `/storage/${candidate.candidate_photos[0].path}`
                                                : null;

                                            return (
                                                <div
                                                    key={candidate.id}
                                                    className={cn(
                                                        "group relative cursor-pointer rounded-xl border-2 transition-all duration-200 hover:border-primary/50 hover:shadow-md overflow-hidden bg-card",
                                                        selected ? "border-primary shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-muted"
                                                    )}
                                                    onClick={() => handleVote(position.id, candidate.id, position.max_votes)}
                                                >
                                                    {selected && (
                                                        <div className="absolute right-2 top-2 z-10 rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                    )}

                                                    <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                                                        {photoUrl ? (
                                                            <img
                                                                src={photoUrl}
                                                                alt={candidate.name}
                                                                className={cn(
                                                                    "h-full w-full object-cover transition-transform duration-500",
                                                                    selected ? "scale-105" : "group-hover:scale-105"
                                                                )}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
                                                                <User className="h-24 w-24" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-4">
                                                        <h4 className="font-bold text-lg leading-tight truncate" title={candidate.name}>
                                                            {candidate.name}
                                                        </h4>
                                                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                                                                <span className="truncate">
                                                                    {candidate.year_level?.name} - {candidate.year_section?.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {position.candidates.length === 0 && (
                                            <div className="col-span-full py-8 text-center text-muted-foreground italic bg-muted/30 rounded-lg border border-dashed">
                                                No candidates for this position.
                                            </div>
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ))
                )}

                {events.length > 0 && (
                    <div className="sticky bottom-6 z-20 flex justify-center pt-8">
                        <Button
                            size="lg"
                            className="w-full max-w-md shadow-xl text-lg h-12"
                            onClick={handleSubmit}
                        >
                            Submit My Votes
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
