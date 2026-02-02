import { Head, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Maximize2, Minimize2, RefreshCw, Wifi, WifiOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
    event: EventProps;
    positions: PositionProps[];
    stats: {
        registered: number;
        turnout: number;
        percentage: number;
    };
}

export default function LiveMonitor({ event, positions, stats }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isConnected, setIsConnected] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


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

    const refreshData = () => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsRefreshing(true);
        router.reload({
            only: ['positions', 'stats'],
            onSuccess: () => {
                setLastUpdated(new Date());
                setIsConnected(true);
            },
            onError: () => {
                setIsConnected(false);
            },
            onFinish: () => {
                setIsRefreshing(false);

                if (!document.hidden) {
                    timeoutRef.current = setTimeout(refreshData, 10000);
                }
            },
            preserveUrl: true,
        });
    };


    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
            <Head title={`LIVE: ${event.name}`} />


            <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            LIVE ELECTION MONITOR
                        </h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">{event.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">

                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-slate-400 text-xs uppercase">Turnout</span>
                            <span className="font-mono font-bold text-emerald-400 text-lg">
                                {stats.percentage}%
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-slate-400 text-xs uppercase">Votes Cast</span>
                            <span className="font-mono font-bold text-white text-lg">
                                {stats.turnout.toLocaleString()} <span className="text-slate-500 text-sm">/ {stats.registered.toLocaleString()}</span>
                            </span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-800 hidden md:block" />

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                            "font-mono text-xs border-slate-700 hidden sm:flex gap-2",
                            isConnected ? "text-slate-500" : "text-red-500 border-red-900 bg-red-950/30"
                        )}>
                            {isConnected ? (
                                <>
                                    <Wifi className="h-3 w-3" />
                                    <span>Live</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-3 w-3" />
                                    <span>Offline</span>
                                </>
                            )}
                            <span className="w-px h-3 bg-slate-800 mx-1" />
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className={cn(
                                "text-slate-400 hover:text-white hover:bg-slate-800",
                                isRefreshing && "animate-spin"
                            )}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleFullscreen}
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>


            <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {positions.map((position) => (
                    <Card key={position.id} className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden flex flex-col">
                        <CardHeader className="bg-slate-900/50 border-b border-slate-800 pb-3">
                            <CardTitle className="text-emerald-400 uppercase tracking-wider text-sm font-bold flex justify-between items-center">
                                {position.name}
                                <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700 border-0">
                                    Vote for {position.max_votes}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 flex flex-col">

                            <div className="divide-y divide-slate-800/50 flex-1">
                                {position.candidates.map((candidate, index) => {
                                    const votes = candidate.votes_count || 0;


                                    const leaderVotes = position.candidates[0]?.votes_count || 0;
                                    const percentage = leaderVotes > 0 ? (votes / leaderVotes) * 100 : 0;

                                    const lastWinnerVotes = position.candidates[position.max_votes - 1]?.votes_count || 0;
                                    const firstLoserVotes = position.candidates[position.max_votes]?.votes_count || 0;


                                    const isTieForLastSpot = position.candidates.length > position.max_votes &&
                                        lastWinnerVotes > 0 &&
                                        lastWinnerVotes === firstLoserVotes;


                                    let isTied = isTieForLastSpot && votes === lastWinnerVotes;
                                    let isWinner = !isTied && index < position.max_votes && votes > 0;


                                    if (candidate.is_tie_breaker_winner) {
                                        isWinner = true;
                                        isTied = false;
                                    } else if (isTieForLastSpot && votes === lastWinnerVotes) {
                                        const hasTieBreakerWinner = position.candidates.some((c: any) => c.votes_count === lastWinnerVotes && c.is_tie_breaker_winner);
                                        if (hasTieBreakerWinner) {
                                            isTied = false;
                                            isWinner = false;
                                        }
                                    }


                                    const rank = position.candidates.findIndex(c => c.votes_count === votes) + 1;

                                    return (
                                        <div key={candidate.id} className={cn(
                                            "relative p-4 transition-colors",
                                            isWinner ? "bg-emerald-950/10" : (isTied ? "bg-orange-950/10" : "")
                                        )}>

                                            <div
                                                className={cn(
                                                    "absolute left-0 top-0 bottom-0 bg-emerald-500/5 transition-all duration-1000 ease-out",
                                                    isWinner ? "bg-emerald-500/10" : (isTied ? "bg-orange-500/10" : "")
                                                )}
                                                style={{ width: `${percentage}%` }}
                                            />

                                            <div className="relative flex items-center gap-4">

                                                <div className="flex-shrink-0 w-10 text-center">
                                                    {isWinner ? (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center mx-auto text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                                            {rank}
                                                        </div>
                                                    ) : isTied ? (
                                                        <div className="w-8 h-8 rounded-full bg-orange-500 text-slate-950 font-bold flex items-center justify-center mx-auto text-sm shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                                                            {rank}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 font-mono text-sm">#{rank}</span>
                                                    )}
                                                </div>


                                                <div className="flex-1 min-w-0">
                                                    <h3 className={cn(
                                                        "font-bold truncate text-lg leading-none mb-1",
                                                        isWinner ? "text-white" : (isTied ? "text-orange-200" : "text-slate-400")
                                                    )}>
                                                        {candidate.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 truncate uppercase tracking-wider">
                                                        {candidate.partylist?.name || 'Independent'}
                                                        {candidate.is_tie_breaker_winner && <span className="ml-2 text-blue-400 font-bold">(TIE BREAK WIN)</span>}
                                                        {isTied && <span className="ml-2 text-orange-500 font-bold">(TIE)</span>}
                                                    </p>
                                                </div>


                                                <div className="text-right">
                                                    <div className={cn(
                                                        "text-2xl font-black font-mono tracking-tighter",
                                                        isWinner ? "text-emerald-400" : (isTied ? "text-orange-400" : "text-slate-500")
                                                    )}>
                                                        {votes.toLocaleString()}
                                                    </div>
                                                    <div className="text-[10px] text-slate-600 uppercase font-bold">Votes</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
