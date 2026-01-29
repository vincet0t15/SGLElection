import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, User, AlertCircle, HelpCircle } from 'lucide-react';




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
}

interface Props {
    event: Event | null;
    positions: Position[];
}

export default function ResultsIndex({ event, positions }: Props) {
    // Helper to get total votes for a position to calculate percentage
    const getTotalVotes = (candidates: Candidate[]) => {
        return candidates.reduce((sum, candidate) => sum + candidate.votes_count, 0);
    };

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
                    {event && event.is_active && (
                        <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 animate-pulse">
                            Live Updates
                        </Badge>
                    )}
                </div>

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
                                                    // Determine winner only if event is NOT active
                                                    const isWinner = !event.is_active && index === 0 && candidate.votes_count > 0;
                                                    const isSecond = !event.is_active && index === 1 && candidate.votes_count > 0;
                                                    const isThird = !event.is_active && index === 2 && candidate.votes_count > 0;

                                                    // If event is active, mask the details
                                                    const showDetails = !event.is_active;

                                                    return (
                                                        <div
                                                            key={candidate.id}
                                                            className={`p-4 transition-colors ${isWinner ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className="relative">
                                                                    <Avatar className={`h-12 w-12 border-2 ${isWinner ? 'border-yellow-500' : 'border-border'}`}>
                                                                        {showDetails ? (
                                                                            <AvatarImage
                                                                                src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined}
                                                                                alt={candidate.name}
                                                                            />
                                                                        ) : null}
                                                                        <AvatarFallback className={!showDetails ? "bg-emerald-100 dark:bg-emerald-900/30 animate-pulse" : ""}>
                                                                            {showDetails ? (
                                                                                <User className="h-6 w-6 text-muted-foreground" />
                                                                            ) : (
                                                                                <HelpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                                            )}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    {isWinner && (
                                                                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full shadow-sm">
                                                                            <Trophy className="h-3 w-3" />
                                                                        </div>
                                                                    )}
                                                                    {isSecond && (
                                                                        <div className="absolute -top-2 -right-2 bg-slate-400 text-white p-1 rounded-full shadow-sm">
                                                                            <Medal className="h-3 w-3" />
                                                                        </div>
                                                                    )}
                                                                    {isThird && (
                                                                        <div className="absolute -top-2 -right-2 bg-amber-700 text-white p-1 rounded-full shadow-sm">
                                                                            <Medal className="h-3 w-3" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className={`font-semibold text-sm ${isWinner ? 'text-yellow-700 dark:text-yellow-500' : ''} ${!showDetails ? 'text-emerald-600 dark:text-emerald-400 italic' : ''}`}>
                                                                            {showDetails ? candidate.name : "Tallying..."}
                                                                        </h4>
                                                                        <span className="font-mono text-sm font-bold">
                                                                            {candidate.votes_count}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                                        <span>
                                                                            {showDetails
                                                                                ? `${candidate.year_level?.name} - ${candidate.year_section?.name}`
                                                                                : "Candidate Details Hidden"
                                                                            }
                                                                        </span>
                                                                        <span>{percentage}%</span>
                                                                    </div>

                                                                    <Progress
                                                                        value={percentage}
                                                                        className={`h-2 ${isWinner ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}`}
                                                                        indicatorClassName={isWinner ? 'bg-yellow-500' : ''}
                                                                    />
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
