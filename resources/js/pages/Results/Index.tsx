import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, User, AlertCircle, HelpCircle, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';



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

interface Partylist {
    id: number;
    name: string;
}

interface Candidate {
    id: number;
    name: string;
    candidate_photos: CandidatePhoto[];
    year_level: YearLevel;
    year_section: YearSection;
    partylist: Partylist | null;
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
    show_winner: boolean;
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


    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshData = () => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsRefreshing(true);
        router.reload({
            only: ['event', 'positions'],
            onFinish: () => {
                setIsRefreshing(false);

                if (!document.hidden) {
                    timeoutRef.current = setTimeout(refreshData, 10000);
                }
            }
        });
    };

    useEffect(() => {

        refreshData();

        const handleVisibilityChange = () => {
            if (document.hidden) {

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            } else {

                if (!isRefreshing && !timeoutRef.current) {
                    refreshData();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);


    useEffect(() => {
        if (event?.is_active && event?.dateTime_end) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(event.dateTime_end));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [event]);


    const getTotalVotes = (candidates: Candidate[]) => {
        return candidates.reduce((sum, candidate) => sum + candidate.votes_count, 0);
    };


    const isTimeUp = timeLeft?.days === 0 && timeLeft?.hours === 0 && timeLeft?.minutes === 0 && timeLeft?.seconds === 0;
    const showResults = !event?.is_active || isTimeUp || event?.show_winner;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 text-foreground pb-20">
            <Head title="Election Results" />


            <div className="bg-white dark:bg-slate-900 border-b shadow-sm mb-8">
                <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Election Results
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {event ? `Live updates for ${event.name}` : 'No active event found'}
                        </p>
                    </div>

                    {event && event.is_active && !isTimeUp && timeLeft && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-emerald-600 uppercase tracking-widest">
                                <Clock className="w-4 h-4 animate-pulse" />
                                Voting Ends In
                            </div>
                            <div className="grid grid-cols-4 gap-3 md:gap-6">
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Minutes', value: timeLeft.minutes },
                                    { label: 'Seconds', value: timeLeft.seconds }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-16 h-20 md:w-24 md:h-28 flex items-center justify-center mb-2 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50 pointer-events-none" />
                                            <span className="text-3xl md:text-5xl font-mono font-bold text-slate-800 dark:text-slate-100 tabular-nums group-hover:scale-110 transition-transform duration-300">
                                                {String(item.value).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-1 animate-pulse shadow-sm">
                                    <span className="relative flex h-2 w-2 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Live Updates Enabled
                                </Badge>
                            </div>
                        </div>
                    )}

                    {event && (event.is_active && isTimeUp) && (
                        <div className="flex flex-col items-center">
                            <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-2 text-base shadow-md">
                                Voting Ended - Results Finalized
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 flex flex-col gap-10">
                {!event ? (
                    <Card className="border-dashed border-2 max-w-lg mx-auto mt-10">
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
                    <div className="grid gap-8 max-w-5xl mx-auto w-full">
                        {positions.map((position) => {
                            const totalVotes = getTotalVotes(position.candidates);


                            const sortedCandidates = [...position.candidates].sort((a, b) => b.votes_count - a.votes_count);

                            return (
                                <Card key={position.id} className="overflow-hidden border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <CardHeader className="bg-slate-50/80 dark:bg-slate-800/50 border-b pb-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">{position.name}</CardTitle>
                                                <CardDescription className="mt-1">
                                                    Top {position.max_votes} {position.max_votes > 1 ? 'candidates' : 'candidate'} will win
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary" className="w-fit text-sm px-3 py-1 bg-white dark:bg-slate-800 border shadow-sm">
                                                Total Votes: {totalVotes.toLocaleString()}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-muted/30">
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableHead className="w-[80px] text-center font-bold">Rank</TableHead>
                                                        <TableHead className="font-bold min-w-[200px]">Candidate</TableHead>
                                                        <TableHead className="text-right font-bold w-[120px]">Votes</TableHead>
                                                        <TableHead className="w-[35%] min-w-[150px] font-bold">Percentage</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sortedCandidates.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                                No candidates for this position.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        sortedCandidates.map((candidate, index) => {
                                                            const percentage = totalVotes > 0
                                                                ? Math.round((candidate.votes_count / totalVotes) * 100)
                                                                : 0;

                                                            const isWinner = showResults && index < position.max_votes && candidate.votes_count > 0;
                                                            const rank = index + 1;


                                                            let rowClass = "transition-all duration-300";
                                                            let rankBadgeClass = "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

                                                            if (isWinner) {
                                                                if (rank === 1) {
                                                                    rowClass = "bg-yellow-50/60 dark:bg-yellow-900/10 hover:bg-yellow-50 dark:hover:bg-yellow-900/20";
                                                                    rankBadgeClass = "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400/50 dark:bg-yellow-900/40 dark:text-yellow-400";
                                                                } else if (rank === 2) {
                                                                    rowClass = "bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50";
                                                                    rankBadgeClass = "bg-slate-200 text-slate-700 ring-2 ring-slate-400/50 dark:bg-slate-700 dark:text-slate-300";
                                                                } else if (rank === 3) {
                                                                    rowClass = "bg-orange-50/60 dark:bg-orange-900/10 hover:bg-orange-50 dark:hover:bg-orange-900/20";
                                                                    rankBadgeClass = "bg-orange-100 text-orange-800 ring-2 ring-orange-400/50 dark:bg-orange-900/40 dark:text-orange-400";
                                                                } else {
                                                                    rowClass = "bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20";
                                                                    rankBadgeClass = "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400/30 dark:bg-emerald-900/40 dark:text-emerald-400";
                                                                }
                                                            } else {
                                                                rowClass = "hover:bg-muted/30";
                                                            }

                                                            return (
                                                                <TableRow key={candidate.id} className={rowClass}>
                                                                    <TableCell className="text-center py-4">
                                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mx-auto shadow-sm transition-transform hover:scale-110 ${rankBadgeClass}`}>
                                                                            {rank}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-4">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="relative shrink-0">
                                                                                <Avatar className={`h-12 w-12 md:h-14 md:w-14 border-2 shadow-sm transition-transform duration-300 hover:scale-105 ${isWinner ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                                                                    {showResults ? (
                                                                                        <AvatarImage
                                                                                            src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined}
                                                                                            alt={candidate.name}
                                                                                            className="object-cover"
                                                                                        />
                                                                                    ) : null}
                                                                                    <AvatarFallback className={!showResults ? "bg-emerald-100 dark:bg-emerald-900/30 animate-pulse" : "bg-slate-100 dark:bg-slate-800"}>
                                                                                        {showResults ? (
                                                                                            <User className="h-6 w-6 text-slate-400" />
                                                                                        ) : (
                                                                                            <HelpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                                                        )}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                {isWinner && rank === 1 && (
                                                                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg animate-in zoom-in duration-500 border-2 border-white dark:border-slate-900">
                                                                                        <Trophy className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                                                                                    </div>
                                                                                )}
                                                                                {isWinner && rank === 2 && (
                                                                                    <div className="absolute -top-2 -right-2 bg-slate-300 text-slate-800 p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                                                                                        <Medal className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                                                                                    </div>
                                                                                )}
                                                                                {isWinner && rank === 3 && (
                                                                                    <div className="absolute -top-2 -right-2 bg-orange-400 text-orange-900 p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                                                                                        <Medal className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <h4 className={`font-bold text-base md:text-lg leading-tight ${isWinner ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'} ${!showResults ? 'italic text-emerald-600 dark:text-emerald-400' : ''}`}>
                                                                                    {showResults ? candidate.name : "Tallying..."}
                                                                                </h4>
                                                                                {showResults && (
                                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs md:text-sm text-muted-foreground mt-1">
                                                                                        <span className="font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                                                                            {candidate.partylist?.name || 'Independent'}
                                                                                        </span>
                                                                                        <span className="hidden sm:inline">•</span>
                                                                                        <span>
                                                                                            {candidate.year_level?.name} {candidate.year_section?.name && `- ${candidate.year_section.name}`}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell className="text-right py-4">
                                                                        <div className="font-mono text-lg md:text-xl font-bold leading-none text-slate-800 dark:text-slate-100">
                                                                            {candidate.votes_count.toLocaleString()}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-4 pr-6">
                                                                        <div className="flex flex-col gap-1.5">
                                                                            <div className="flex items-center justify-between text-xs font-medium">
                                                                                <span className={isWinner ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}>
                                                                                    {percentage}%
                                                                                </span>
                                                                            </div>
                                                                            <Progress
                                                                                value={percentage}
                                                                                className={`h-3 rounded-full bg-slate-100 dark:bg-slate-800 ${isWinner ? 'bg-emerald-100/50 dark:bg-emerald-900/20' : ''}`}
                                                                                indicatorClassName={`transition-all duration-1000 ease-out rounded-full ${rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                                                                    rank === 2 ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                                                                                        rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                                                                                            isWinner ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                                                                                                'bg-slate-300 dark:bg-slate-600'
                                                                                    }`}
                                                                            />
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
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
