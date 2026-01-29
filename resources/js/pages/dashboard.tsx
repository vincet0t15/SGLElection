import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Vote, Award, Activity, Calendar, AlertCircle, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

export default function Dashboard({ stats }: { stats: Stats }) {
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
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_voters}</div>
                                <p className="text-xs text-muted-foreground">Registered in system</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_candidates}</div>
                                <p className="text-xs text-muted-foreground">Across all positions</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Positions</CardTitle>
                                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                    <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_positions}</div>
                                <p className="text-xs text-muted-foreground">Available for election</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
                                <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline justify-between mb-2">
                                    <div className="text-2xl font-bold">{stats.turnout_percentage}%</div>
                                    <span className="text-xs text-muted-foreground">
                                        {stats.votes_cast} of {stats.total_voters} voted
                                    </span>
                                </div>
                                <Progress value={stats.turnout_percentage} className="h-2 bg-emerald-100 dark:bg-emerald-900/30" indicatorClassName="bg-emerald-600 dark:bg-emerald-400" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
