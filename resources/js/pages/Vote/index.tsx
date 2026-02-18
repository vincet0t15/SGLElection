import { Head, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { EventProps } from '@/types/event';
import { SharedData } from '@/types';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, User, Vote, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import vote from '@/routes/vote';
import AppLogoIcon from '@/components/app-logo-icon';
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
    const { system_settings } = usePage<SharedData>().props;
    const [votes, setVotes] = useState<Record<number, number[]>>({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const totalPositions = useMemo(() => {
        return events.reduce((acc, event) => acc + event.positions.length, 0);
    }, [events]);

    const votedPositions = useMemo(() => {
        return Object.keys(votes).filter(key => votes[Number(key)] && votes[Number(key)].length > 0).length;
    }, [votes]);

    const progressPercentage = totalPositions > 0 ? (votedPositions / totalPositions) * 100 : 0;

    const handleVote = (positionId: number, candidateId: number, maxVotes: number) => {

        const currentVotes = votes[positionId] || [];
        const isSelected = currentVotes.includes(candidateId);

        if (isSelected) {
            setVotes(prev => ({
                ...prev,
                [positionId]: currentVotes.filter(id => id !== candidateId)
            }));
        } else {
            if (currentVotes.length >= maxVotes) {
                toast.error(`You can only select ${maxVotes} candidate(s) for this position.`);
                return;
            }

            setVotes(prev => ({
                ...prev,
                [positionId]: [...currentVotes, candidateId]
            }));
        }


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
        setIsSubmitting(true);
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
            },
            onFinish: () => {
                setIsSubmitting(false);
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
            <Head title="Official Ballot" />
            <Toaster richColors position="top-center" />


            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            {system_settings.logo ? (
                                <img src={system_settings.logo} alt="Logo" className="h-10 w-10 object-contain" />
                            ) : (
                                <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-sm">
                                    <AppLogoIcon className="h-6 w-6 fill-current" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none text-slate-900 hidden sm:block">
                                {system_settings.name || 'Official Ballot'}
                            </h1>
                            <h1 className="text-lg font-bold leading-none text-slate-900 sm:hidden">
                                Ballot
                            </h1>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                {votedPositions} of {totalPositions} positions filled
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="hidden md:flex flex-col w-48 gap-1.5">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={votedPositions === 0}
                            className={cn(
                                "hidden md:flex shadow-md transition-all",
                                votedPositions === totalPositions
                                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                                    : "bg-green-600 hover:bg-green-700 text-white shadow-green-200 hidden"

                            )}

                        >
                            {votedPositions === totalPositions ? 'Submit Vote' : 'Review & Submit'}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="md:hidden w-full h-1 bg-slate-100">
                    <div
                        className="h-full bg-green-600 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </header>

            <main className="container mx-auto max-w-5xl px-4 py-8 space-y-10">

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600"></div>

                    <div className="mb-6 flex justify-center border-b border-slate-100 pb-6">
                        <table className="border-collapse border-none">
                            <tbody>
                                <tr>
                                    <td className="align-top pr-6 border-none !p-0 hidden sm:table-cell w-24">
                                        {system_settings.logo ? (
                                            <img src={system_settings.logo} alt="Logo" className="h-24 w-auto object-contain" />
                                        ) : (
                                            <div className="w-24 h-24 bg-emerald-600 flex items-center justify-center rounded-full text-white shadow-sm">
                                                <AppLogoIcon className="w-12 h-12 fill-current" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="align-middle text-center border-none !p-0">
                                        <div className="font-serif text-sm sm:text-base text-slate-900" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>REPUBLIC OF THE PHILIPPINES</div>
                                        <div className="font-serif text-sm sm:text-base text-slate-900" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>DEPARTMENT OF EDUCATION</div>
                                        <div className="font-serif text-sm text-slate-600" style={{ fontFamily: '"Times New Roman", serif' }}>MIMAROPA Region</div>
                                        <div className="font-serif text-sm text-slate-600" style={{ fontFamily: '"Times New Roman", serif' }}>Schools Division of Palawan</div>
                                        <div className="font-serif text-lg sm:text-xl font-bold text-emerald-800 uppercase my-2" style={{ fontFamily: '"Times New Roman", serif' }}>
                                            SAN VICENTE NATIONAL HIGH SCHOOL
                                        </div>
                                        <div className="font-serif text-xs text-slate-500 italic" style={{ fontFamily: '"Times New Roman", serif' }}>Poblacion, San Vicente, Palawan</div>
                                    </td>
                                    <td className="w-24 hidden sm:table-cell"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-slate-900 mb-2" style={{ fontFamily: '"Old English Text MT", serif' }}>
                        Official Ballot
                    </h2>
                    {events.length > 0 && (
                        <p className="text-xs sm:text-sm text-slate-600 uppercase tracking-widest font-bold mb-2">
                            {events.map(e => e.name).join(' / ')}
                        </p>
                    )}
                    <p className="text-slate-500 font-serif italic">Please vote wisely.</p>
                </div>

                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <AlertCircle className="h-10 w-10 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-700">No Active Elections</h2>
                        <p className="text-slate-500 mt-2">There are no election events available for you at this time.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {event.positions.map((position) => (
                                <section key={position.id} className="scroll-mt-24 relative">

                                    <div className="flex items-center justify-between mb-6 sticky top-16 z-30 bg-slate-50/95 backdrop-blur py-3 border-b border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-1 bg-green-600 rounded-full" />
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{position.name}</h3>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    Vote for <span className="text-green-600 font-bold">{position.max_votes}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "text-xs font-bold px-3 py-1.5 rounded-full transition-colors",
                                            (votes[position.id] || []).length === position.max_votes
                                                ? "bg-green-100 text-green-700"
                                                : "bg-slate-200 text-slate-600"
                                        )}>
                                            {(votes[position.id] || []).length} / {position.max_votes} Selected
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                        {position.candidates.map((candidate) => {
                                            const selected = isSelected(position.id, candidate.id);
                                            const photoUrl = candidate.candidate_photos && candidate.candidate_photos.length > 0
                                                ? `/storage/${candidate.candidate_photos[0].path}`
                                                : null;

                                            return (
                                                <div
                                                    key={candidate.id}
                                                    onClick={() => handleVote(position.id, candidate.id, position.max_votes)}
                                                    className={cn(
                                                        "group relative flex flex-row sm:flex-col bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border",
                                                        selected
                                                            ? "border-green-500 ring-1 ring-green-500 shadow-lg shadow-green-100 z-10"
                                                            : "border-slate-200 hover:border-green-300 hover:shadow-md"
                                                    )}
                                                >

                                                    {selected && (
                                                        <div className="absolute top-2 right-2 z-20 bg-green-600 text-white p-1 rounded-full shadow-sm animate-in zoom-in duration-200">
                                                            <Check className="h-3 w-3 stroke-[4]" />
                                                        </div>
                                                    )}


                                                    <div className="w-24 h-24 sm:w-full sm:h-auto sm:aspect-square shrink-0 bg-slate-100 relative overflow-hidden">
                                                        {photoUrl ? (
                                                            <img
                                                                src={photoUrl}
                                                                alt={candidate.name}
                                                                className={cn(
                                                                    "w-full h-full object-cover object-top transition-transform duration-500",
                                                                    selected ? "scale-105" : "group-hover:scale-105"
                                                                )}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <User className="h-10 w-10 sm:h-20 sm:w-20" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 sm:opacity-0 transition-opacity" />


                                                        {candidate.partylist && (
                                                            <div className="absolute bottom-2 left-2 hidden sm:block">
                                                                <Badge variant="secondary" className="bg-white/90 text-slate-900 text-[10px] font-bold shadow-sm backdrop-blur-sm border-0">
                                                                    {candidate.partylist.name}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>


                                                    <div className="flex-1 p-4 flex flex-col justify-center sm:justify-start">

                                                        {candidate.partylist && (
                                                            <div className="mb-1 sm:hidden">
                                                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                                                                    {candidate.partylist.name}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <h4 className={cn(
                                                            "font-bold text-base sm:text-lg leading-tight text-slate-900 mb-1",
                                                            selected && "text-green-700"
                                                        )}>
                                                            {candidate.name}
                                                        </h4>

                                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                                                            <span className="font-medium">{candidate.year_level?.name}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <span>{candidate.year_section?.name}</span>
                                                        </div>

                                                        {candidate.platform && (
                                                            <div className="mt-3 text-xs text-slate-600 line-clamp-2 border-t border-slate-100 pt-2">
                                                                {candidate.platform}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {position.candidates.length === 0 && (
                                            <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                                <p className="text-slate-400 text-sm">No candidates available for this position.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ))
                )}
            </main>


            <div className="fixed bottom-0 left-0 right-0 md:hidden z-[100] bg-white border-t border-slate-200 p-4 pb-6 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                <Button
                    size="lg"
                    className={cn(
                        "w-full shadow-none text-lg font-bold h-12",
                        votedPositions === totalPositions
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                    )}
                    onClick={handleSubmit}
                    disabled={votedPositions === 0}
                    hidden={isConfirmOpen}
                >
                    {votedPositions === totalPositions ? (
                        <>Submit Vote <Check className="ml-2 h-5 w-5" /></>
                    ) : (
                        <>Review & Submit ({votedPositions}) <ChevronRight className="ml-2 h-5 w-5" /></>
                    )}
                </Button>
            </div>


            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl">Review Your Votes</DialogTitle>
                        <DialogDescription>
                            Please review your selections carefully. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 px-6 py-2 overflow-y-auto">
                        <div className="space-y-6">
                            {getVoteSummary().map((item, idx) => (
                                <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">
                                        {item.position}
                                    </h4>
                                    <div className="space-y-2">
                                        {item.candidates.map((name, cIdx) => (
                                            <div key={cIdx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-100">
                                                <div className="bg-blue-100 text-blue-700 p-1 rounded-full">
                                                    <User className="h-3 w-3" />
                                                </div>
                                                <span className="font-medium text-sm text-slate-900">{name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {getVoteSummary().length === 0 && (
                                <p className="text-center text-slate-500 py-4">No votes selected.</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-2 bg-slate-50 border-t border-slate-100">
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>
                            Back to Ballot
                        </Button>
                        <Button
                            onClick={confirmSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Submit Ballot"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Toaster />
        </div>
    );
}
