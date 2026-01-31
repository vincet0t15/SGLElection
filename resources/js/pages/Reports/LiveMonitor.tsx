import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';
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

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['positions', 'stats'],
                onSuccess: () => setLastUpdated(new Date()),
                preserveUrl: true,
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);


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

            {/* Header / Toolbar */}
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
                    {/* Stats Ticker */}
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
                        <Badge variant="outline" className="font-mono text-xs border-slate-700 text-slate-500 hidden sm:flex">
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.reload({ only: ['positions', 'stats'], onSuccess: () => setLastUpdated(new Date()) })}
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
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

            {/* Main Content Grid */}
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
                            {/* Candidates List */}
                            <div className="divide-y divide-slate-800/50 flex-1">
                                {position.candidates.map((candidate, index) => {
                                    // Calculate percentage relative to total votes cast (approx) or max possible
                                    // For visuals, let's use percentage of total votes for this position if available, 
                                    // OR just raw count relative to leader.

                                    const votes = candidate.votes_count || 0;

                                    // Let's find the leader's votes to scale the bars relative to the winner
                                    const leaderVotes = position.candidates[0]?.votes_count || 0;
                                    const percentage = leaderVotes > 0 ? (votes / leaderVotes) * 100 : 0;
                                    const isLeader = index === 0 && votes > 0;
                                    const isWinner = index < position.max_votes && votes > 0;

                                    return (
                                        <div key={candidate.id} className={cn(
                                            "relative p-4 transition-colors",
                                            isWinner ? "bg-emerald-950/10" : ""
                                        )}>
                                            {/* Progress Bar Background */}
                                            <div
                                                className={cn(
                                                    "absolute left-0 top-0 bottom-0 bg-emerald-500/5 transition-all duration-1000 ease-out",
                                                    isWinner ? "bg-emerald-500/10" : ""
                                                )}
                                                style={{ width: `${percentage}%` }}
                                            />

                                            <div className="relative flex items-center gap-4">
                                                {/* Rank/Avatar */}
                                                <div className="flex-shrink-0 w-10 text-center">
                                                    {isWinner ? (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center mx-auto text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                                            {index + 1}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 font-mono text-sm">#{index + 1}</span>
                                                    )}
                                                </div>

                                                {/* Name & Party */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={cn(
                                                        "font-bold truncate text-lg leading-none mb-1",
                                                        isWinner ? "text-white" : "text-slate-400"
                                                    )}>
                                                        {candidate.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 truncate uppercase tracking-wider">
                                                        {candidate.partylist?.name || 'Independent'}
                                                    </p>
                                                </div>

                                                {/* Vote Count */}
                                                <div className="text-right">
                                                    <div className={cn(
                                                        "text-2xl font-black font-mono tracking-tighter",
                                                        isWinner ? "text-emerald-400" : "text-slate-500"
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
