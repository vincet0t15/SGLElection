import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Printer, Users, User, Trophy, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';

interface Voter {
    id: number;
    name: string;
    username: string;
    is_active: boolean;
    has_voted: boolean;
}

interface Props {
    event: EventProps;
    positions: PositionProps[];
    stats: {
        total_voters: number;
    };
    voters: Voter[];
}

export default function ReportsShow({ event, positions, stats, voters }: Props) {
    const votedCount = voters.filter(v => v.has_voted).length;
    const turnoutPercentage = voters.length > 0 ? Math.round((votedCount / voters.length) * 100) : 0;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: '/reports' },
            { title: event.name, href: `/reports/${event.id}` }
        ]}>
            <Head title={`Report - ${event.name}`} />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link href="/reports" className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pl-6">
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
                    <Button asChild variant="outline" className="gap-2">
                        <a href={`/reports/print/${event.id}`} target="_blank" rel="noopener noreferrer">
                            <Printer className="h-4 w-4" />
                            Print Official Report
                        </a>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{voters.length}</div>
                            <p className="text-xs text-muted-foreground">Assigned voters</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{votedCount}</div>
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
                                        <CardTitle>{position.name}</CardTitle>
                                        <CardDescription>
                                            Total Votes: {totalVotes}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {position.candidates.map((candidate, index) => {
                                                const percentage = totalVotes > 0 
                                                    ? Math.round(((candidate.votes_count || 0) / totalVotes) * 100) 
                                                    : 0;
                                                const isWinner = index === 0 && (candidate.votes_count || 0) > 0;
                                                
                                                return (
                                                    <div key={candidate.id} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className={`h-10 w-10 border-2 ${isWinner ? 'border-yellow-500' : 'border-transparent'}`}>
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
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
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
                                                            indicatorClassName={isWinner ? "bg-emerald-600" : ""}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </TabsContent>

                    <TabsContent value="candidates" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Candidates List</CardTitle>
                                <CardDescription>All candidates participating in this election</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Year & Section</TableHead>
                                            <TableHead className="text-right">Votes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {positions.flatMap(p => p.candidates.map(c => ({...c, position_name: p.name}))).map((candidate) => (
                                            <TableRow key={candidate.id}>
                                                <TableCell className="font-medium flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage 
                                                            src={candidate.candidate_photos?.[0]?.path ? `/storage/${candidate.candidate_photos[0].path}` : undefined} 
                                                            alt={candidate.name} 
                                                        />
                                                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    {candidate.name}
                                                </TableCell>
                                                <TableCell>{candidate.position_name}</TableCell>
                                                <TableCell>
                                                    {candidate.year_level?.name} - {candidate.year_section?.name}
                                                </TableCell>
                                                <TableCell className="text-right">{candidate.votes_count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="voters" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Voters List</CardTitle>
                                <CardDescription>
                                    Registered voters and their voting status ({votedCount}/{voters.length} voted)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {voters.map((voter) => (
                                            <TableRow key={voter.id}>
                                                <TableCell className="font-medium">{voter.name}</TableCell>
                                                <TableCell>{voter.username}</TableCell>
                                                <TableCell>
                                                    <Badge variant={voter.has_voted ? "default" : "outline"} className={voter.has_voted ? "bg-emerald-600" : ""}>
                                                        {voter.has_voted ? "Voted" : "Not Voted"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {voters.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                    No voters assigned to this event.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
