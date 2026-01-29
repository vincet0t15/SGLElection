import { Head, router } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { EventProps } from '@/types/event';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, User, Info, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import vote from '@/routes/vote';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    events: EventProps[];
}

export default function VoteIndex({ events }: Props) {
    // State to store votes: { [positionId]: [candidateId1, candidateId2, ...] }
    const [votes, setVotes] = useState<Record<number, number[]>>({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
        if (votedPositions === 0) {
            toast.error("Please select at least one candidate to submit.");
            return;
        }
        setIsConfirmOpen(true);
    };

    const confirmSubmit = () => {
        router.post((vote.store().url), { votes }, {
            onSuccess: () => {
                toast.success("Votes submitted successfully!");
                setVotes({});
                setIsConfirmOpen(false);
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => {
                    toast.error(error);
                });
                setIsConfirmOpen(false);
            }
        });
    };

    const getVoteSummary = () => {
        const summary: { position: string; candidates: string[] }[] = [];
        events.forEach(event => {
            event.positions.forEach(position => {
                const selectedIds = votes[position.id] || [];
                if (selectedIds.length > 0) {
                    const selectedCandidates = position.candidates
                        .filter(c => selectedIds.includes(c.id))
                        .map(c => c.name);
                    summary.push({
                        position: position.name,
                        candidates: selectedCandidates
                    });
                }
            });
        });
        return summary;
    };

    return (
        <div className="min-h-screen bg-emerald-50/30 pb-20 font-sans">
            <Head title="Vote" />
            <Toaster richColors position="top-right" />

            {/* Sticky Header with Progress */}
            <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
                <div className="container mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                            <Vote className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight hidden md:block text-emerald-950">Official Ballot</h1>
                    </div>

                    <div className="flex-1 max-w-md flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-emerald-700">
                            <span>Voting Progress</span>
                            <span>{votedPositions} of {totalPositions} positions</span>
                        </div>
                        {/* Custom Green Progress Bar */}
                        <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={votedPositions === 0}
                        className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-lg"
                    >
                        Review & Submit
                    </Button>
                </div>
            </header>

            <main className="container mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-8">
                {events.length === 0 ? (
                    <Card className="border-dashed border-emerald-200 bg-emerald-50/50">
                        <CardContent className="pt-6 pb-6 text-center text-emerald-600 flex flex-col items-center gap-2">
                            <Info className="h-10 w-10 text-emerald-400" />
                            <p>No active election events found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="space-y-12 animate-in fade-in duration-500">
                            {/* Event Banner */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-white p-6 md:p-10 shadow-xl shadow-emerald-200/50">
                                <div className="relative z-10">
                                    <Badge className="mb-3 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                                        Official Election
                                    </Badge>
                                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                                        {event.name}
                                    </h2>
                                    <p className="text-emerald-50 max-w-2xl text-lg font-medium">
                                        {event.description}
                                    </p>
                                </div>
                                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-12 mix-blend-overlay" />
                                <div className="absolute -left-12 -bottom-12 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
                            </div>

                            {event.positions.map((position) => (
                                <section key={position.id} className="scroll-mt-24">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-emerald-100 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-emerald-950">{position.name}</h3>
                                            <p className="text-emerald-600/80 mt-1">
                                                Select up to <span className="font-semibold text-emerald-700">{position.max_votes}</span> candidate{position.max_votes > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className={cn(
                                            "text-sm px-3 py-1 border-emerald-200",
                                            (votes[position.id] || []).length === position.max_votes
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                                : "bg-transparent text-emerald-600"
                                        )}>
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
                                                        "group relative cursor-pointer rounded-xl bg-white transition-all duration-300 overflow-hidden",
                                                        selected
                                                            ? "ring-2 ring-emerald-500 shadow-xl shadow-emerald-100/50 scale-[1.02]"
                                                            : "border border-emerald-100/50 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50/50 hover:-translate-y-1"
                                                    )}
                                                    onClick={() => handleVote(position.id, candidate.id, position.max_votes)}
                                                >
                                                    {/* Selection Overlay/Indicator */}
                                                    <div className={cn(
                                                        "absolute inset-x-0 top-0 h-1 transition-colors duration-300 z-20",
                                                        selected ? "bg-emerald-500" : "bg-transparent group-hover:bg-emerald-400/50"
                                                    )} />

                                                    {selected && (
                                                        <div className="absolute right-3 top-3 z-20 rounded-full bg-emerald-500 text-white p-1.5 shadow-md animate-in zoom-in duration-200">
                                                            <Check className="h-4 w-4 stroke-[3]" />
                                                        </div>
                                                    )}

                                                    <div className="aspect-square w-full overflow-hidden bg-emerald-50 relative">
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
                                                            <div className="flex h-full w-full items-center justify-center bg-emerald-100/50 text-emerald-300">
                                                                <User className="h-20 w-20" />
                                                            </div>
                                                        )}

                                                        {/* Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                                            <span className={cn(
                                                                "text-white font-medium text-sm px-4 py-1 rounded-full backdrop-blur-md shadow-sm",
                                                                selected ? "bg-emerald-600/90" : "bg-emerald-900/40"
                                                            )}>
                                                                {selected ? "Selected" : "Click to Select"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-5">
                                                        <h4 className="font-bold text-lg leading-tight truncate text-center mb-2 text-emerald-950" title={candidate.name}>
                                                            {candidate.name}
                                                        </h4>

                                                        <div className="flex items-center justify-center gap-2 text-sm">
                                                            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                                {candidate.year_level?.name}
                                                            </span>
                                                            <span className="text-xs text-emerald-300">•</span>
                                                            <span className="truncate max-w-[100px] text-emerald-600/80 text-xs">
                                                                {candidate.year_section?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {position.candidates.length === 0 && (
                                            <div className="col-span-full py-12 text-center text-emerald-400 bg-emerald-50/30 rounded-xl border border-dashed border-emerald-200 flex flex-col items-center gap-3">
                                                <User className="h-10 w-10 text-emerald-200" />
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
                    className="shadow-xl shadow-emerald-900/20 w-full max-w-sm pointer-events-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleSubmit}
                    disabled={votedPositions === 0}
                >
                    Review & Submit ({votedPositions})
                </Button>
            </div>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-emerald-950">Review Your Votes</DialogTitle>
                        <DialogDescription>
                            Please review your selected candidates before submitting. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 my-4">
                        {getVoteSummary().length === 0 ? (
                            <p className="text-center text-muted-foreground">No candidates selected.</p>
                        ) : (
                            getVoteSummary().map((item, index) => (
                                <div key={index} className="border-b border-emerald-100 last:border-0 pb-3 last:pb-0">
                                    <h4 className="font-semibold text-emerald-800 text-sm mb-1">{item.position}</h4>
                                    <ul className="list-disc list-inside text-sm text-emerald-600">
                                        {item.candidates.map((candidate, idx) => (
                                            <li key={idx}>{candidate}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}

                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start gap-2 mt-4">
                            <Info className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>
                                You have selected candidates for <span className="font-semibold">{votedPositions}</span> out of <span className="font-semibold">{totalPositions}</span> positions.
                                {votedPositions < totalPositions && " You can still vote for the remaining positions."}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                            Keep Voting
                        </Button>
                        <Button onClick={confirmSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Confirm & Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
