import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Vote, Award, Activity, Calendar, AlertCircle, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import results from '@/routes/results';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Event {
    id: number;
    name: string;
    description: string;
    dateTime_start: string;
    dateTime_end: string;
    is_active: boolean;
    location: string;
}

interface Stats {
    total_voters: number;
    total_candidates: number;
    total_positions: number;
    active_event: Event | null;
    votes_cast: number;
    turnout_percentage: number;
}

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

interface Props {
    stats: Stats;
    winners: Position[];
}

export default function Dashboard({ stats, winners = [] }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

                {/* Active Event Section */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold tracking-tight">Election Status</h2>
                        <span className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    {stats.active_event ? (
                        <Card className="border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Vote className="w-32 h-32 text-emerald-600" />
                            </div>
                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">
                                                {stats.active_event.name}
                                            </CardTitle>
                                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm animate-pulse">
                                                Active Now
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-base text-emerald-700/80 dark:text-emerald-400/80">
                                            {stats.active_event.description || 'No description provided.'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={results.index().url} target="_blank" rel="noopener noreferrer">
                                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:scale-105">
                                                <Trophy className="mr-2 h-4 w-4" />
                                                View Live Results
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                                    <div className="flex flex-col space-y-1 p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50">
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Start Date</span>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(stats.active_event.dateTime_start).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1 p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50">
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">End Date</span>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(stats.active_event.dateTime_end).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1 p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50">
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Current Turnout</span>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                            <Activity className="h-4 w-4" />
                                            <span>{stats.votes_cast} Votes ({stats.turnout_percentage}%)</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-muted/50 p-4 rounded-full mb-4">
                                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold">No Active Election</h3>
                                <p className="text-muted-foreground text-sm max-w-md mt-2 mb-6">
                                    There is no election currently active. You can create a new event or activate an existing one to start tracking votes.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>



                {/* Stats Grid */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">System Overview</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover:shadow-md transition-shadow bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Voters</CardTitle>
                                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total_voters}</div>
                                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Registered in system</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow bg-purple-50/50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Total Candidates</CardTitle>
                                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.total_candidates}</div>
                                <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Across all positions</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow bg-orange-50/50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-300">Positions</CardTitle>
                                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                    <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.total_positions}</div>
                                <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Available for election</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Voter Turnout</CardTitle>
                                <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline justify-between mb-2">
                                    <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.turnout_percentage}%</div>
                                    <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                                        {stats.votes_cast} of {stats.total_voters} voted
                                    </span>
                                </div>
                                <Progress value={stats.turnout_percentage} className="h-2 bg-emerald-100 dark:bg-emerald-900/30" indicatorClassName="bg-emerald-600 dark:bg-emerald-400" />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Winners Section */}
                {winners.length > 0 && (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="h-6 w-6 text-emerald-600" />
                            <h2 className="text-2xl font-bold tracking-tight">Election Winners</h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {winners.map((position) => (
                                <Card key={position.id} className="flex flex-col h-full border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3 border-b border-emerald-100 dark:border-emerald-900/30 bg-emerald-100/20 dark:bg-emerald-900/20">
                                        <CardTitle className="text-base font-bold text-center text-emerald-800 dark:text-emerald-500">
                                            {position.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col gap-3 p-4">
                                        {position.candidates.length > 0 ? (
                                            position.candidates.map((candidate, index) => (
                                                <div key={candidate.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                                                    <div className="relative shrink-0">
                                                        <Avatar className="h-10 w-10 border-2 border-emerald-500 shadow-sm">
                                                            <AvatarImage src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined} className="object-cover" />
                                                            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                                {candidate.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md ring-1 ring-white dark:ring-black">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold truncate text-foreground">{candidate.name}</p>
                                                        <div className="flex items-center justify-between mt-0.5">
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {candidate.year_level?.name}
                                                            </p>
                                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400 border-none">
                                                                {candidate.votes_count} Votes
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-sm text-muted-foreground italic">
                                                No winners declared
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
