import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
                        <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
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
                    <div className="flex flex-col gap-10">
                        {positions.map((position) => {
                            const totalVotes = getTotalVotes(position.candidates);

                            return (
                                <div key={position.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <div>
                                            <h2 className="text-2xl font-bold text-primary tracking-tight">{position.name}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                Top {position.max_votes} {position.max_votes > 1 ? 'candidates' : 'candidate'} will win
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-base py-1 px-3">
                                            Total Votes: {totalVotes.toLocaleString()}
                                        </Badge>
                                    </div>

                                    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead className="w-[80px] text-center font-bold">Rank</TableHead>
                                                    <TableHead className="font-bold">Candidate Info</TableHead>
                                                    <TableHead className="text-right font-bold w-[150px]">Votes</TableHead>
                                                    <TableHead className="w-[30%] font-bold">Percentage</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {position.candidates.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                            No candidates for this position.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    position.candidates.map((candidate, index) => {
                                                        const percentage = totalVotes > 0
                                                            ? Math.round((candidate.votes_count / totalVotes) * 100)
                                                            : 0;

                                                        // Determine winner if results should be shown
                                                        const isWinner = showResults && index < position.max_votes && candidate.votes_count > 0;
                                                        // Only show 2nd/3rd place medals if they are NOT winners
                                                        const isSecond = showResults && !isWinner && index === 1 && candidate.votes_count > 0;
                                                        const isThird = showResults && !isWinner && index === 2 && candidate.votes_count > 0;

                                                        // Use the showResults flag for details visibility
                                                        const showDetails = showResults;

                                                        return (
                                                            <TableRow
                                                                key={candidate.id}
                                                                className={`transition-colors ${isWinner ? 'bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20' : 'hover:bg-muted/50'}`}
                                                            >
                                                                <TableCell className="text-center">
                                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mx-auto shadow-sm
                                                                        ${isWinner
                                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                                                                            : 'bg-muted text-muted-foreground'
                                                                        }`}>
                                                                        {index + 1}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="relative shrink-0">
                                                                            <Avatar className={`h-12 w-12 border-2 shadow-sm ${isWinner ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-border'}`}>
                                                                                {showDetails ? (
                                                                                    <AvatarImage
                                                                                        src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined}
                                                                                        alt={candidate.name}
                                                                                        className="object-cover"
                                                                                    />
                                                                                ) : null}
                                                                                <AvatarFallback className={!showDetails ? "bg-emerald-100 dark:bg-emerald-900/30 animate-pulse" : "bg-muted"}>
                                                                                    {showDetails ? (
                                                                                        <User className="h-5 w-5 text-muted-foreground" />
                                                                                    ) : (
                                                                                        <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                                                    )}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            {isWinner && (
                                                                                <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full shadow-md animate-in zoom-in duration-300">
                                                                                    <Trophy className="h-3 w-3 fill-current" />
                                                                                </div>
                                                                            )}
                                                                            {isSecond && (
                                                                                <div className="absolute -top-1.5 -right-1.5 bg-slate-400 text-white p-1 rounded-full shadow-md">
                                                                                    <Medal className="h-3 w-3 fill-current" />
                                                                                </div>
                                                                            )}
                                                                            {isThird && (
                                                                                <div className="absolute -top-1.5 -right-1.5 bg-amber-700 text-white p-1 rounded-full shadow-md">
                                                                                    <Medal className="h-3 w-3 fill-current" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className={`font-bold text-base leading-none ${isWinner ? 'text-emerald-700 dark:text-emerald-500' : ''} ${!showDetails ? 'text-emerald-600 dark:text-emerald-400 italic' : ''}`}>
                                                                                {showDetails ? candidate.name : "Tallying..."}
                                                                            </h4>
                                                                            {showDetails && (
                                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                                    {candidate.year_level?.name} - {candidate.year_section?.name}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="font-mono text-lg font-bold leading-none">
                                                                        {candidate.votes_count.toLocaleString()}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <Progress
                                                                            value={percentage}
                                                                            className={`h-2.5 flex-1 bg-muted/50 ${isWinner ? 'bg-emerald-100/50 dark:bg-emerald-900/20' : ''}`}
                                                                            indicatorClassName={`transition-all duration-500 ${isWinner ? 'bg-emerald-500' : 'bg-primary/70'}`}
                                                                        />
                                                                        <span className="text-xs font-medium w-10 text-right">{percentage}%</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
