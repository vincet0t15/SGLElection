import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Vote, Award, Activity, Calendar, AlertCircle, Trophy, Flag, Database, Server, HardDrive, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
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
    total_partylists: number;
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
    total_votes?: number;
}

interface TurnoutData {
    name: string;
    total: number;
    voted: number;
    not_voted: number;
}

interface VoteActivityLog {
    id: number;
    voter: {
        id: number;
        name: string;
        username: string;
    };
    created_at: string;
}

interface SystemHealth {
    database: boolean;
    database_latency: number;
    php_version: string;
    server_os: string;
    disk_free: number;
    disk_total: number;
    memory_usage: number;
}

interface Props {
    stats: Stats;
    winners: Position[];
    turnoutByYearLevel: TurnoutData[];
    recentActivity: VoteActivityLog[];
    systemHealth?: SystemHealth;
}

export default function Dashboard({ stats, winners = [], turnoutByYearLevel = [], recentActivity = [], systemHealth }: Props) {
    // Pie Chart Data
    const totalVoted = turnoutByYearLevel.reduce((acc, curr) => acc + curr.voted, 0);
    const totalNotVoted = turnoutByYearLevel.reduce((acc, curr) => acc + curr.not_voted, 0);

    const pieData = [
        { name: 'Voted', value: totalVoted },
        { name: 'Not Voted', value: totalNotVoted },
    ];

    const COLORS = ['#2563eb', '#e2e8f0']; // blue-600, slate-200

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

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



                {/* Analytics Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Voter Turnout by Year Level</CardTitle>
                            <CardDescription>
                                Comparison of total voters vs. actual votes cast across year levels.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={turnoutByYearLevel}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="voted" name="Voted" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="not_voted" name="Not Voted" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Overall Turnout</CardTitle>
                            <CardDescription>
                                Percentage of registered voters who have cast their votes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-4xl font-bold">{stats.turnout_percentage}%</span>
                                    <span className="text-sm text-muted-foreground">Turnout</span>
                                </div>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                    <span className="text-sm text-muted-foreground">Voted ({totalVoted})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                    <span className="text-sm text-muted-foreground">Not Voted ({totalNotVoted})</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Grid */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">System Overview</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

                        <Card className="hover:shadow-md transition-shadow bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Total Partylists</CardTitle>
                                <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                    <Flag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.total_partylists}</div>
                                <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80">Registered partylists</p>
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

                {/* Recent Activity & Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Recent Activity */}
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-emerald-600" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Latest votes cast in the active election</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                                    {log.voter.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{log.voter.name}</p>
                                                    <p className="text-xs text-muted-foreground">ID: {log.voter.username}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="text-xs font-normal">
                                                    Voted
                                                </Badge>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    {new Date(log.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground text-sm py-4">No recent activity found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Flag className="h-5 w-5 text-blue-600" />
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>Common tasks and shortcuts</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href="/events/create" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Create New Event
                                    </Button>
                                </Link>
                                <Link href="/voters/import" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Users className="mr-2 h-4 w-4" />
                                        Import Voters
                                    </Button>
                                </Link>
                                <Link href="/candidates" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Manage Candidates
                                    </Button>
                                </Link>
                                <Link href="/reports" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Activity className="mr-2 h-4 w-4" />
                                        View Reports
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* System Health */}
                        {systemHealth && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Server className="h-5 w-5 text-emerald-600" />
                                        System Health
                                    </CardTitle>
                                    <CardDescription>Server status overview</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Database className="h-4 w-4" />
                                            <span>Database</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={systemHealth.database ? "outline" : "destructive"} className={systemHealth.database ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}>
                                                {systemHealth.database ? "Connected" : "Error"}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{systemHealth.database_latency}ms</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Cpu className="h-4 w-4" />
                                            <span>Memory Usage</span>
                                        </div>
                                        <span className="font-medium">{formatBytes(systemHealth.memory_usage)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <HardDrive className="h-4 w-4" />
                                            <span>Disk Space</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium">{formatBytes(systemHealth.disk_free)} free</span>
                                            <p className="text-[10px] text-muted-foreground">of {formatBytes(systemHealth.disk_total)}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t mt-2">
                                        <p className="text-xs text-muted-foreground flex justify-between">
                                            <span>PHP Version:</span>
                                            <span className="font-mono">{systemHealth.php_version}</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Winners Section */}
                {winners.length > 0 && (
                    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="h-6 w-6 text-emerald-600" />
                            <h2 className="text-2xl font-bold tracking-tight">Election Winners</h2>
                        </div>

                        <div className="flex flex-col gap-10">
                            {winners.map((position) => (
                                <div key={position.id} className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground tracking-tight">{position.name}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                Top {position.max_votes} {position.max_votes > 1 ? 'candidates' : 'candidate'} will win
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-base py-1 px-3">
                                            Total Votes: {(position.total_votes || 0).toLocaleString()}
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
                                                {position.candidates.length > 0 ? (
                                                    position.candidates.map((candidate, index) => {
                                                        const percentage = (position.total_votes || 0) > 0
                                                            ? Math.round((candidate.votes_count / (position.total_votes || 1)) * 100)
                                                            : 0;

                                                        return (
                                                            <TableRow key={candidate.id} className="bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20">
                                                                <TableCell className="text-center">
                                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mx-auto shadow-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 ring-2 ring-emerald-500/20">
                                                                        {index + 1}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="relative shrink-0">
                                                                            <Avatar className="h-12 w-12 border-2 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm">
                                                                                <AvatarImage src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined} className="object-cover" />
                                                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                                                    {candidate.name.charAt(0)}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                                                                                <Trophy className="h-3 w-3 fill-current" />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-base leading-none text-emerald-700 dark:text-emerald-500 uppercase">
                                                                                {candidate.name}
                                                                            </h4>
                                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                                {candidate.year_level?.name} - {candidate.year_section?.name}
                                                                            </p>
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
                                                                            className="h-2.5 flex-1 bg-emerald-100/50 dark:bg-emerald-900/20"
                                                                            indicatorClassName="bg-emerald-500 transition-all duration-500"
                                                                        />
                                                                        <span className="text-xs font-medium w-10 text-right">{percentage}%</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                ) : (
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableCell colSpan={4} className="text-center text-muted-foreground italic py-8">
                                                            No winners declared
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
