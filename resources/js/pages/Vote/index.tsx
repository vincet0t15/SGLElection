import { Head, useForm } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { EventProps } from '@/types/event';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, User, Info, Vote, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress"

interface Props {
    events: EventProps[];
}

export default function VoteIndex({ events }: Props) {
    // State to store votes: { [positionId]: [candidateId1, candidateId2, ...] }
    const [votes, setVotes] = useState<Record<number, number[]>>({});

    // Calculate progress
    const totalPositions = useMemo(() => {
        return events.reduce((acc, event) => acc + event.positions.length, 0);
    }, [events]);

    const votedPositions = useMemo(() => {
        return Object.keys(votes).filter(key => votes[Number(key)] && votes[Number(key)].length > 0).length;
    }, [votes]);

    const progressPercentage = totalPositions > 0 ? (votedPositions / totalPositions) * 100 : 0;

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
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Head title="Vote" />
            <Toaster richColors position="top-right" />

            {/* Sticky Header with Progress */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Vote className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight hidden md:block">Official Ballot</h1>
                    </div>

                    <div className="flex-1 max-w-md flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Voting Progress</span>
                            <span>{votedPositions} of {totalPositions} positions</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={votedPositions === 0}
                        className="hidden md:flex"
                    >
                        Submit Ballot
                    </Button>
                </div>
            </header>

            <main className="container mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-8">
                {events.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="pt-6 pb-6 text-center text-muted-foreground flex flex-col items-center gap-2">
                            <Info className="h-10 w-10 text-muted-foreground/50" />
                            <p>No active election events found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="space-y-12 animate-in fade-in duration-500">
                            {/* Event Banner */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 md:p-10 shadow-lg">
                                <div className="relative z-10">
                                    <Badge className="mb-3 bg-white/20 hover:bg-white/30 text-white border-none">
                                        Official Election
                                    </Badge>
                                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                                        {event.name}
                                    </h2>
                                    <p className="text-primary-foreground/90 max-w-2xl text-lg">
                                        {event.description}
                                    </p>
                                </div>
                                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-12" />
                            </div>

                            {event.positions.map((position) => (
                                <section key={position.id} className="scroll-mt-20">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b pb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground">{position.name}</h3>
                                            <p className="text-muted-foreground mt-1">
                                                Select up to <span className="font-semibold text-foreground">{position.max_votes}</span> candidate{position.max_votes > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <Badge variant={
                                            (votes[position.id] || []).length === position.max_votes
                                                ? "default"
                                                : "secondary"
                                        } className="text-sm px-3 py-1">
                                            Selected: {(votes[position.id] || []).length} / {position.max_votes}
                                        </Badge>
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
                                                        "group relative cursor-pointer rounded-xl bg-card transition-all duration-300 overflow-hidden",
                                                        selected
                                                            ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                                                            : "border hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
                                                    )}
                                                    onClick={() => handleVote(position.id, candidate.id, position.max_votes)}
                                                >
                                                    {/* Selection Overlay/Indicator */}
                                                    <div className={cn(
                                                        "absolute inset-x-0 top-0 h-1 transition-colors duration-300 z-20",
                                                        selected ? "bg-primary" : "bg-transparent group-hover:bg-primary/50"
                                                    )} />

                                                    {selected && (
                                                        <div className="absolute right-3 top-3 z-20 rounded-full bg-primary text-primary-foreground p-1.5 shadow-md animate-in zoom-in duration-200">
                                                            <Check className="h-4 w-4 stroke-[3]" />
                                                        </div>
                                                    )}

                                                    <div className="aspect-square w-full overflow-hidden bg-muted relative">
                                                        {photoUrl ? (
                                                            <img
                                                                src={photoUrl}
                                                                alt={candidate.name}
                                                                className={cn(
                                                                    "h-full w-full object-cover object-top transition-transform duration-500",
                                                                    selected ? "scale-105" : "group-hover:scale-105"
                                                                )}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-secondary/50 text-muted-foreground/30">
                                                                <User className="h-20 w-20" />
                                                            </div>
                                                        )}

                                                        {/* Gradient Overlay for Text readability if needed, mostly style */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                                            <span className={cn(
                                                                "text-white font-medium text-sm px-4 py-1 rounded-full backdrop-blur-sm",
                                                                selected ? "bg-primary/90" : "bg-black/50"
                                                            )}>
                                                                {selected ? "Selected" : "Click to Select"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-5">
                                                        <h4 className="font-bold text-lg leading-tight truncate text-center mb-1" title={candidate.name}>
                                                            {candidate.name}
                                                        </h4>

                                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                                                                {candidate.year_level?.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground/60">•</span>
                                                            <span className="truncate max-w-[100px]">
                                                                {candidate.year_section?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {position.candidates.length === 0 && (
                                            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed flex flex-col items-center gap-3">
                                                <User className="h-10 w-10 text-muted-foreground/30" />
                                                <p>No candidates available for this position yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ))
                )}
            </main>

            {/* Mobile Floating Action Button */}
            <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center md:hidden z-40 pointer-events-none">
                <Button
                    size="lg"
                    className="shadow-xl w-full max-w-sm pointer-events-auto"
                    onClick={handleSubmit}
                    disabled={votedPositions === 0}
                >
                    Submit Ballot ({votedPositions})
                </Button>
            </div>
        </div>
    );
}
