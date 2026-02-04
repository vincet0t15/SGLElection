import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OfficialResultPDF from '@/components/reports/OfficialResultPDF';
import { SharedData } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, User, Trophy, Calendar, MapPin, ArrowLeft, ChevronLeft, ChevronRight, Search, BarChart3, Monitor, ShieldCheck, Printer, FileSpreadsheet, FileText, Eye, EyeOff } from 'lucide-react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import { cn } from "@/lib/utils";

import Heading from '@/components/heading';
import { PaginatedDataResponse } from '@/types/pagination';
import Pagination from '@/components/paginationData';

interface Voter {
    id: number;
    name: string;
    username: string;
    is_active: boolean;
    has_voted: boolean;
}

interface Signatory {
    id: number;
    name: string;
    position: string;
    description: string | null;
}

interface Vote {
    id: number;
    position: string;
    candidate: string;
    partylist: string;
    candidate_photo: string | null;
}

interface PaginatedVoters {
    data: Voter[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    event: EventProps;
    positions: PositionProps[];
    signatories: Signatory[];
    stats: {
        total_voters: number;
        total_assigned_voters: number;
        voted_count: number;
    };
    voters: PaginatedDataResponse<Voter>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ReportsShow({ event, positions, signatories, stats, voters, filters }: Props) {
    const { url, props } = usePage<SharedData>();
    const { system_settings } = props;
    const backUrl = url.includes('from=archives') ? '/archives' : '/reports';

    const turnoutPercentage = stats.total_assigned_voters > 0
        ? Math.round((stats.voted_count / stats.total_assigned_voters) * 100)
        : 0;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [isLoadingVotes, setIsLoadingVotes] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [resolveTieDialogOpen, setResolveTieDialogOpen] = useState(false);
    const [selectedTiePosition, setSelectedTiePosition] = useState<{ id: number; name: string; candidates: any[] } | null>(null);
    const [selectedWinnerId, setSelectedWinnerId] = useState<string>("");

    const handleResolveTie = (position: any, tiedCandidates: any[]) => {
        setSelectedTiePosition({ ...position, candidates: tiedCandidates });
        setSelectedWinnerId("");
        setResolveTieDialogOpen(true);
    };

    const submitResolveTie = () => {
        if (!selectedTiePosition || !selectedWinnerId) return;

        router.post(`/reports/${event.id}/resolve-tie`, {
            position_id: selectedTiePosition.id,
            candidate_id: selectedWinnerId
        }, {
            onSuccess: () => {
                setResolveTieDialogOpen(false);
                setSelectedTiePosition(null);
                setSelectedWinnerId("");
            }
        });
    };

    const handleViewVotes = async (voter: Voter) => {
        setSelectedVoter(voter);
        setIsLoadingVotes(true);
        setIsDialogOpen(true);
        setVotes([]);
        try {
            const response = await fetch(`/reports/${event.id}/voters/${voter.id}/votes`);
            const data = await response.json();
            setVotes(data);
        } catch (error) {
            console.error('Failed to fetch votes', error);
        } finally {
            setIsLoadingVotes(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    `/reports/${event.id}`,
                    { search, status: status === 'all' ? undefined : status },
                    { preserveState: true, preserveScroll: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(
            `/reports/${event.id}`,
            { search, status: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true }
        );
    };

    const breadcrumbs = url.includes('from=archives')
        ? [
            { title: 'Archives', href: '/archives' },
            { title: event.name, href: '' },
        ]
        : [
            { title: 'Reports', href: '/reports' },
            { title: event.name, href: '' },
        ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Report - ${event.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex gap-2 items-center'>
                    <Link href={backUrl} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <Heading
                        variant="small"
                        title="Report Details"
                        description="View detailed voting results and statistics."
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">

                            <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(event.dateTime_start).toLocaleDateString()}</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                </div>
                            )}
                            <Badge variant={event.is_active ? "default" : "secondary"} className={event.is_active ? "bg-emerald-600" : ""}>
                                {event.is_active ? 'Active' : 'Ended'}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {!event.is_archived && (
                            <>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => router.put(`/event/${event.id}/toggle-show-winner`)}
                                >
                                    {event.show_winner ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            Hide Winners Early
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            Show Winners Early
                                        </>
                                    )}
                                </Button>
                                {event.is_active ? (
                                    <Button asChild variant="outline" className="gap-2 bg-rose-600 text-white hover:bg-rose-700 hover:text-white border-rose-600">
                                        <Link href={`/reports/live/${event.id}`}>
                                            <Monitor className="h-4 w-4 animate-pulse" />
                                            Live Monitor
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button disabled variant="outline" className="gap-2 opacity-50 cursor-not-allowed">
                                        <Monitor className="h-4 w-4" />
                                        Live Monitor
                                    </Button>
                                )}
                            </>
                        )}
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={`/reports/audit/${event.id}`}>
                                <ShieldCheck className="h-4 w-4" />
                                Audit Log
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={`/reports/analytics/${event.id}`}>
                                <BarChart3 className="h-4 w-4" />
                                Analytics
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white border-emerald-600">
                            <a href={`/reports/print/${event.id}`} target="_blank" rel="noopener noreferrer">
                                <Printer className="h-4 w-4" />
                                Official Report
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-blue-600">
                            <a href={`/reports/print/${event.id}?type=winners`} target="_blank" rel="noopener noreferrer">
                                <Trophy className="h-4 w-4" />
                                Winners Only
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="gap-2 bg-purple-600 text-white hover:bg-purple-700 hover:text-white border-purple-600">
                            <a href={`/reports/comelec/${event.id}`} target="_blank" rel="noopener noreferrer">
                                <FileText className="h-4 w-4" />
                                COMELEC Form
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_assigned_voters}</div>
                            <p className="text-xs text-muted-foreground">Assigned voters</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.voted_count}</div>
                            <p className="text-xs text-muted-foreground">Total votes received</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Turnout</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{turnoutPercentage}%</div>
                            <Progress value={turnoutPercentage} className="h-2 mt-2" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Did Not Vote</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_assigned_voters - stats.voted_count}</div>
                            <p className="text-xs text-muted-foreground">Pending voters</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="results" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="candidates">Candidates</TabsTrigger>
                        <TabsTrigger value="voters">Voters</TabsTrigger>
                    </TabsList>

                    <TabsContent value="results" className="space-y-6 mt-6">
                        {positions.map((position) => {
                            const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);
                            return (
                                <Card key={position.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{position.name}</CardTitle>
                                                <div className="flex gap-4 text-sm text-muted-foreground">
                                                    <p>Total Votes: {totalVotes}</p>
                                                    <p>Abstentions: {stats.voted_count - (position.votes_cast_count || 0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {position.candidates.map((candidate, index) => {
                                                const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);
                                                const percentage = totalVotes > 0
                                                    ? Math.round(((candidate.votes_count || 0) / totalVotes) * 100)
                                                    : 0;

                                                const votes = candidate.votes_count || 0;
                                                const lastWinnerVotes = position.candidates[position.max_votes - 1]?.votes_count || 0;
                                                const firstLoserVotes = position.candidates[position.max_votes]?.votes_count || 0;

                                                // Check for a tie at the cutoff boundary
                                                const isTieForLastSpot = position.candidates.length > position.max_votes &&
                                                    lastWinnerVotes > 0 &&
                                                    lastWinnerVotes === firstLoserVotes;

                                                // Determine status
                                                let isTied = isTieForLastSpot && votes === lastWinnerVotes;
                                                let isWinner = !isTied && index < position.max_votes && votes > 0;

                                                // Check for manual tie breaker
                                                if (candidate.is_tie_breaker_winner) {
                                                    isWinner = true;
                                                    isTied = false;
                                                } else if (isTieForLastSpot && votes === lastWinnerVotes) {
                                                    // If someone else is the declared tie winner, then I am not tied anymore, I am a loser (unless I am also a winner? No, single winner).
                                                    // Wait, if there is a tie breaker winner, that person takes the spot.
                                                    // The others who have the same votes but are NOT the tie breaker winner are effectively losers for that spot.
                                                    // BUT, we might have multiple spots.
                                                    // Example: Top 2. Rank 1 (100 votes), Rank 2 (50 votes), Rank 2 (50 votes). Tie for 2nd spot.
                                                    // If one is marked winner, they get rank 2. The other gets rank 3? Or just "not winner".

                                                    const hasTieBreakerWinner = position.candidates.some((c: any) => c.votes_count === lastWinnerVotes && c.is_tie_breaker_winner);
                                                    if (hasTieBreakerWinner) {
                                                        isTied = false; // No longer a tie situation visually, as it's resolved.
                                                        isWinner = false; // Default to false, already set true above if this specific candidate is the one.
                                                    }
                                                }

                                                // Calculate rank (handle ties)
                                                const rank = position.candidates.findIndex(c => c.votes_count === votes) + 1;

                                                return (
                                                    <div key={candidate.id} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                                    #{rank}
                                                                </div>
                                                                <Avatar className={cn(
                                                                    "h-10 w-10 border-2",
                                                                    isWinner ? "border-yellow-500" : (isTied ? "border-orange-500" : "border-transparent")
                                                                )}>
                                                                    <AvatarImage
                                                                        src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined}
                                                                        alt={candidate.name}
                                                                    />
                                                                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium flex items-center gap-2">
                                                                        {candidate.name}
                                                                        {isWinner && (
                                                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Winner</Badge>
                                                                        )}
                                                                        {candidate.is_tie_breaker_winner && (
                                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Tie Break Win</Badge>
                                                                        )}
                                                                        {isTied && (
                                                                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Tie</Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {candidate.partylist?.name && (
                                                                            <span className="font-semibold text-primary mr-1">
                                                                                {candidate.partylist.name} •
                                                                            </span>
                                                                        )}
                                                                        {candidate.year_level?.name} - {candidate.year_section?.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold">{candidate.votes_count} votes</div>
                                                                <div className="text-xs text-muted-foreground">{percentage}%</div>
                                                            </div>
                                                        </div>
                                                        <Progress
                                                            value={percentage}
                                                            className="h-2"
                                                            indicatorClassName={isWinner ? "bg-emerald-600" : (isTied ? "bg-orange-500" : "")}
                                                        />
                                                    </div>
                                                );
                                            })}

                                            {(() => {
                                                const lastWinnerVotes = position.candidates[position.max_votes - 1]?.votes_count || 0;
                                                const firstLoserVotes = position.candidates[position.max_votes]?.votes_count || 0;
                                                const isTieForLastSpot = position.candidates.length > position.max_votes &&
                                                    lastWinnerVotes > 0 &&
                                                    lastWinnerVotes === firstLoserVotes;
                                                const hasTieBreakerWinner = position.candidates.some((c: any) => c.votes_count === lastWinnerVotes && c.is_tie_breaker_winner);

                                                if (isTieForLastSpot && !hasTieBreakerWinner) {
                                                    const tiedCandidates = position.candidates.filter((c: any) => c.votes_count === lastWinnerVotes);
                                                    return (
                                                        <div className="flex justify-end mt-4 pt-4 border-t">
                                                            <Button
                                                                variant="outline"
                                                                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                                                                onClick={() => handleResolveTie(position, tiedCandidates)}
                                                            >
                                                                <ShieldCheck className="w-4 h-4 mr-2" />
                                                                Resolve Tie
                                                            </Button>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </TabsContent>

                    <TabsContent value="candidates" className="mt-6 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-medium">Candidates List</h3>
                                <p className="text-sm text-muted-foreground">All candidates grouped by position</p>
                            </div>
                        </div>

                        {positions.map((position) => {
                            const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);
                            return (
                                <Card key={position.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{position.name}</CardTitle>
                                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                                    <p>Total Votes: {totalVotes}</p>
                                                    <p>Abstentions: {stats.voted_count - (position.votes_cast_count || 0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead className="text-right">Votes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {position.candidates.map((candidate, index) => (
                                                    <TableRow key={candidate.id}>
                                                        <TableCell className="font-medium flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                                #{index + 1}
                                                            </div>
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage
                                                                    src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined}
                                                                    alt={candidate.name}
                                                                />
                                                                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium">{candidate.name}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {candidate.partylist?.name && (
                                                                        <span className="font-semibold text-primary mr-1">
                                                                            {candidate.partylist.name} •
                                                                        </span>
                                                                    )}
                                                                    {candidate.year_level?.name} - {candidate.year_section?.name}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">{candidate.votes_count}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {position.candidates.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                                            No candidates for this position.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </TabsContent>

                    <TabsContent value="voters" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Voters List</CardTitle>
                                <CardDescription>
                                    Registered voters and their voting status ({stats.voted_count}/{stats.total_assigned_voters} voted)
                                </CardDescription>
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search voters..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                    <Select value={status} onValueChange={handleStatusChange}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Voters</SelectItem>
                                            <SelectItem value="voted">Voted</SelectItem>
                                            <SelectItem value="not_voted">Not Voted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {voters.data.map((voter) => (
                                            <TableRow key={voter.id}>
                                                <TableCell className="font-medium">{voter.name}</TableCell>
                                                <TableCell>{voter.username}</TableCell>
                                                <TableCell>
                                                    <Badge variant={voter.has_voted ? "default" : "outline"} className={voter.has_voted ? "bg-emerald-600" : ""}>
                                                        {voter.has_voted ? "Voted" : "Not Voted"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {voter.has_voted && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewVotes(voter)}
                                                        >
                                                            View Votes
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {voters.data.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                    No voters assigned to this event.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <div className="mt-4">
                                    <Pagination data={voters} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <Dialog open={resolveTieDialogOpen} onOpenChange={setResolveTieDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resolve Tie - {selectedTiePosition?.name}</DialogTitle>
                        <DialogDescription>
                            There is a tie for the final winning spot. Please select the official winner as determined by the Election Committee (e.g., via coin toss).
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTiePosition && (
                        <div className="py-4 space-y-4">
                            <Select onValueChange={setSelectedWinnerId} value={selectedWinnerId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Winner" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedTiePosition.candidates.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name} ({c.votes_count} votes)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-sm text-amber-800">
                                <p className="font-bold mb-1">Warning:</p>
                                <p>This action will manually designate the selected candidate as the winner of the tie-breaker. This will be recorded in the system.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setResolveTieDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={submitResolveTie}
                            disabled={!selectedWinnerId}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Confirm Winner
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle>Votes for {selectedVoter?.name}</DialogTitle>
                                <DialogDescription>
                                    List of candidates voted by {selectedVoter?.name}
                                </DialogDescription>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`/reports/${event.id}/voters/${selectedVoter?.id}/receipt`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                                >
                                    <Printer className="h-4 w-4" />
                                    View Receipt
                                </a>
                                <a
                                    href={`/reports/${event.id}/voters/${selectedVoter?.id}/receipt?type=excel`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Excel
                                </a>
                            </div>
                        </div>
                    </DialogHeader>
                    {isLoadingVotes ? (
                        <div className="flex justify-center p-4">Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {votes.length === 0 ? (
                                <p className="text-center text-muted-foreground">No votes found.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {Object.entries(votes.reduce((acc, vote) => {
                                        if (!acc[vote.position]) acc[vote.position] = [];
                                        acc[vote.position].push(vote);
                                        return acc;
                                    }, {} as Record<string, typeof votes>)).map(([position, positionVotes]) => (
                                        <div key={position} className="border rounded-lg overflow-hidden shadow-sm">
                                            <div className="bg-muted/40 px-4 py-2 border-b flex items-center justify-between">
                                                <h3 className="font-semibold text-sm text-foreground">{position}</h3>
                                                <Badge variant="secondary" className="text-xs font-normal">
                                                    {positionVotes.length} {positionVotes.length === 1 ? 'Vote' : 'Votes'}
                                                </Badge>
                                            </div>
                                            <div className="divide-y divide-border/50 bg-card">
                                                {positionVotes.map((vote) => (
                                                    <div key={vote.id} className="flex items-center gap-3 p-3 hover:bg-muted/20 transition-colors">
                                                        <Avatar className="h-10 w-10 border ring-1 ring-background">
                                                            <AvatarImage src={vote.candidate_photo ? `/storage/${vote.candidate_photo}` : undefined} />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                                                {vote.candidate.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{vote.candidate}</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-xs text-muted-foreground truncate">{vote.partylist}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
