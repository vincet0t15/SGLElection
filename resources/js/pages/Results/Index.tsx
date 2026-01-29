import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, User, AlertCircle, HelpCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';



interface CandidatePhoto {
    id: number;
    path: string;
}

interface YearLevel {
    id: number;
    name: string;
}

interface YearSection {
    id: number;
    name: string;
}

interface Candidate {
    id: number;
    name: string;
    candidate_photos: CandidatePhoto[];
    year_level: YearLevel;
    year_section: YearSection;
    votes_count: number;
}

interface Position {
    id: number;
    name: string;
    max_votes: number;
    candidates: Candidate[];
}

interface Event {
    id: number;
    name: string;
    is_active: boolean;
    dateTime_end: string;
}

interface Props {
    event: Event | null;
    positions: Position[];
}

export default function ResultsIndex({ event, positions }: Props) {
    const calculateTimeLeft = (endTime: string) => {
        const now = new Date().getTime();
        const distance = new Date(endTime).getTime() - now;

        if (distance < 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
    };

    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(() => {
        if (event?.is_active && event?.dateTime_end) {
            return calculateTimeLeft(event.dateTime_end);
        }
        return null;
    });

    useEffect(() => {
        if (event?.is_active && event?.dateTime_end) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(event.dateTime_end));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [event]);

    // Helper to get total votes for a position to calculate percentage
    const getTotalVotes = (candidates: Candidate[]) => {
        return candidates.reduce((sum, candidate) => sum + candidate.votes_count, 0);
    };

    // Determine if results should be shown (Event not active OR Time has passed)
    const isTimeUp = timeLeft?.days === 0 && timeLeft?.hours === 0 && timeLeft?.minutes === 0 && timeLeft?.seconds === 0;
    const showResults = !event?.is_active || isTimeUp;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head title="Election Results" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 container mx-auto py-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Election Results</h1>
                        <p className="text-muted-foreground">
                            {event ? `Showing results for ${event.name}` : 'No active event found'}
                        </p>
                    </div>
                    {event && event.is_active && !isTimeUp && (
                        <div className="flex items-center gap-4">
                            {timeLeft && (
                                <div className="hidden md:flex flex-col items-end">
                                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-lg bg-emerald-100 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                        <Clock className="h-5 w-5 animate-pulse" />
                                        <span>
                                            {timeLeft.days > 0 && `${timeLeft.days}d `}
                                            {String(timeLeft.hours).padStart(2, '0')}:
                                            {String(timeLeft.minutes).padStart(2, '0')}:
                                            {String(timeLeft.seconds).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs font-sans text-emerald-600/80 dark:text-emerald-500 ml-1 uppercase font-semibold">remaining</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground mt-1 mr-2 font-medium">
                                        Ends: {new Date(event.dateTime_end).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}
                                    </span>
                                </div>
                            )}
                            <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 animate-pulse">
                                Live Updates
                            </Badge>
                        </div>
                    )}
                    {event && (event.is_active && isTimeUp) && (
                        <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20">
                            Voting Ended - Results Finalized
                        </Badge>
                    )}
                </div>

                {/* Mobile Countdown */}
                {event && event.is_active && timeLeft && !isTimeUp && (
                    <div className="md:hidden flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xl bg-emerald-100 dark:bg-emerald-900/20 px-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
                            <Clock className="h-5 w-5 animate-pulse" />
                            <span>
                                {timeLeft.days > 0 && `${timeLeft.days}d `}
                                {String(timeLeft.hours).padStart(2, '0')}:
                                {String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground font-medium">
                            Ends: {new Date(event.dateTime_end).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}
                        </div>
                    </div>
                )}

                {!event ? (
                    <Card className="border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-muted/50 p-4 rounded-full mb-4">
                                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold">No Results Available</h3>
                            <p className="text-muted-foreground text-sm max-w-md mt-2">
                                There are no election events to display results for.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {positions.map((position) => {
                            const totalVotes = getTotalVotes(position.candidates);

                            return (
                                <Card key={position.id} className="flex flex-col overflow-hidden h-full">
                                    <CardHeader className="bg-muted/30 pb-4">
                                        <CardTitle className="text-lg font-bold text-center text-primary">
                                            {position.name}
                                        </CardTitle>
                                        <CardDescription className="text-center text-xs">
                                            Total Votes Cast: {totalVotes}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 flex-1 flex flex-col">
                                        {position.candidates.length === 0 ? (
                                            <div className="p-6 text-center text-muted-foreground text-sm">
                                                No candidates for this position.
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {position.candidates.map((candidate, index) => {
                                                    const percentage = totalVotes > 0
                                                        ? Math.round((candidate.votes_count / totalVotes) * 100)
                                                        : 0;

                                                    // Determine winner if results should be shown
                                                    const isWinner = showResults && index < position.max_votes && candidate.votes_count > 0;
                                                    // Only show 2nd/3rd place medals if they are NOT winners (to avoid double badging in multi-winner races)
                                                    const isSecond = showResults && !isWinner && index === 1 && candidate.votes_count > 0;
                                                    const isThird = showResults && !isWinner && index === 2 && candidate.votes_count > 0;

                                                    // Use the showResults flag for details visibility
                                                    const showDetails = showResults;

                                                    return (
                                                        <div
                                                            key={candidate.id}
                                                            className={`p-4 transition-all duration-300 ${isWinner
                                                                ? 'bg-gradient-to-r from-yellow-50/80 to-transparent dark:from-yellow-900/20'
                                                                : 'hover:bg-muted/50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 shadow-sm
                                                                    ${isWinner
                                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 ring-2 ring-yellow-500/20'
                                                                        : 'bg-muted text-muted-foreground'
                                                                    }`}>
                                                                    #{index + 1}
                                                                </div>
                                                                <div className="relative shrink-0">
                                                                    <Avatar className={`h-14 w-14 border-2 shadow-sm transition-transform hover:scale-105 ${isWinner ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-border'}`}>
                                                                        {showDetails ? (
                                                                            <AvatarImage
                                                                                src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined}
                                                                                alt={candidate.name}
                                                                                className="object-cover"
                                                                            />
                                                                        ) : null}
                                                                        <AvatarFallback className={!showDetails ? "bg-emerald-100 dark:bg-emerald-900/30 animate-pulse" : "bg-muted"}>
                                                                            {showDetails ? (
                                                                                <User className="h-6 w-6 text-muted-foreground" />
                                                                            ) : (
                                                                                <HelpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                                            )}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    {isWinner && (
                                                                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1.5 rounded-full shadow-md animate-in zoom-in duration-300">
                                                                            <Trophy className="h-3.5 w-3.5 fill-current" />
                                                                        </div>
                                                                    )}
                                                                    {isSecond && (
                                                                        <div className="absolute -top-2 -right-2 bg-slate-400 text-white p-1.5 rounded-full shadow-md">
                                                                            <Medal className="h-3.5 w-3.5 fill-current" />
                                                                        </div>
                                                                    )}
                                                                    {isThird && (
                                                                        <div className="absolute -top-2 -right-2 bg-amber-700 text-white p-1.5 rounded-full shadow-md">
                                                                            <Medal className="h-3.5 w-3.5 fill-current" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1 space-y-1.5">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex flex-col">
                                                                            <h4 className={`font-bold text-base leading-none ${isWinner ? 'text-amber-700 dark:text-amber-500' : ''} ${!showDetails ? 'text-emerald-600 dark:text-emerald-400 italic' : ''}`}>
                                                                                {showDetails ? candidate.name : "Tallying..."}
                                                                            </h4>
                                                                            {showDetails && (
                                                                                <span className="text-xs text-muted-foreground mt-1">
                                                                                    {candidate.year_level?.name} - {candidate.year_section?.name}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="font-mono text-lg font-bold leading-none">
                                                                                {candidate.votes_count.toLocaleString()}
                                                                            </div>
                                                                            <div className="text-[10px] uppercase text-muted-foreground font-semibold mt-0.5">Votes</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-3">
                                                                        <Progress
                                                                            value={percentage}
                                                                            className={`h-2.5 flex-1 bg-muted/50 ${isWinner ? 'bg-amber-100/50 dark:bg-amber-900/20' : ''}`}
                                                                            indicatorClassName={`transition-all duration-500 ${isWinner ? 'bg-amber-500' : 'bg-primary/70'}`}
                                                                        />
                                                                        <span className="text-xs font-medium w-10 text-right">{percentage}%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
