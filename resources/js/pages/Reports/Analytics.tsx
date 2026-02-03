import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, PieChart, Clock, Users, AlertCircle } from 'lucide-react';
import { EventProps } from '@/types/event';
import Heading from '@/components/heading';

interface SectionTurnout {
    name: string;
    year_level: string;
    total_voters: number;
    voted_count: number;
    turnout_percentage: number;
}

interface YearLevelTurnout {
    name: string;
    total_voters: number;
    voted_count: number;
    turnout_percentage: number;
}

interface CandidatePerformance {
    id: number;
    name: string;
    position: string;
    partylist: string;
    section_votes: Record<string, number>;
    total_votes: number;
}

interface HourlyTrend {
    hour: number;
    count: number;
}

interface Abstention {
    position: string;
    max_votes: number;
    total_votes_cast: number;
    undervotes: number;
    fully_abstained_voters: number;
}

interface Props {
    event: EventProps;
    sections: SectionTurnout[];
    yearLevels: YearLevelTurnout[];
    candidates: CandidatePerformance[];
    hourly_trends: HourlyTrend[];
    abstentions: Abstention[];
}

export default function Analytics({ event, sections, yearLevels, candidates, hourly_trends, abstentions }: Props) {

    const candidatesByPosition = candidates.reduce((acc, candidate) => {
        if (!acc[candidate.position]) {
            acc[candidate.position] = [];
        }
        acc[candidate.position].push(candidate);
        return acc;
    }, {} as Record<string, CandidatePerformance[]>);

    const sectionsByYearLevel = sections.reduce((acc, section) => {
        if (!acc[section.year_level]) {
            acc[section.year_level] = [];
        }
        acc[section.year_level].push(section);
        return acc;
    }, {} as Record<string, SectionTurnout[]>);


    const sectionNames = Array.from(new Set(
        candidates.flatMap(c => Object.keys(c.section_votes))
    )).sort();

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: '/reports' },
            { title: event.name, href: `/reports/${event.id}` },
            { title: 'Analytics', href: '#' },
        ]}>
            <Head title={`Analytics - ${event.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="default"
                        title="Advanced Analytics"
                        description={`Detailed analysis for ${event.name}`}
                    />
                    <Link href={`/reports/${event.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Report
                        </Button>
                    </Link>
                </div>

                <Tabs defaultValue="turnout" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="turnout">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Section Turnout
                        </TabsTrigger>
                        <TabsTrigger value="yearLevel">
                            <Users className="mr-2 h-4 w-4" />
                            Year Level Turnout
                        </TabsTrigger>
                        <TabsTrigger value="candidates">
                            <PieChart className="mr-2 h-4 w-4" />
                            Candidate Performance
                        </TabsTrigger>
                        <TabsTrigger value="time">
                            <Clock className="mr-2 h-4 w-4" />
                            Hourly Trends
                        </TabsTrigger>
                        <TabsTrigger value="abstentions">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Abstentions
                        </TabsTrigger>
                    </TabsList>


                    <TabsContent value="turnout" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Voter Turnout by Section</CardTitle>
                                <CardDescription>Percentage of registered voters who voted in each section.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Section</TableHead>
                                            <TableHead>Registered</TableHead>
                                            <TableHead>Voted</TableHead>
                                            <TableHead>Turnout</TableHead>
                                            <TableHead className="w-[40%]">Visual</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(sectionsByYearLevel).map(([yearLevel, levelSections]) => (
                                            <>
                                                <TableRow key={yearLevel} className="bg-muted/50">
                                                    <TableCell colSpan={5} className="font-bold">
                                                        {yearLevel}
                                                    </TableCell>
                                                </TableRow>
                                                {levelSections.map((section) => (
                                                    <TableRow key={section.name}>
                                                        <TableCell className="font-medium pl-8">{section.name}</TableCell>
                                                        <TableCell>{section.total_voters}</TableCell>
                                                        <TableCell>{section.voted_count}</TableCell>
                                                        <TableCell>{section.turnout_percentage}%</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Progress value={section.turnout_percentage} className="h-2" />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="yearLevel" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Voter Turnout by Year Level</CardTitle>
                                <CardDescription>Percentage of registered voters who voted in each grade level.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Year Level</TableHead>
                                            <TableHead>Registered</TableHead>
                                            <TableHead>Voted</TableHead>
                                            <TableHead>Turnout</TableHead>
                                            <TableHead className="w-[40%]">Visual</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {yearLevels.map((level) => (
                                            <TableRow key={level.name}>
                                                <TableCell className="font-medium">{level.name}</TableCell>
                                                <TableCell>{level.total_voters}</TableCell>
                                                <TableCell>{level.voted_count}</TableCell>
                                                <TableCell>{level.turnout_percentage}%</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={level.turnout_percentage} className="h-2" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="candidates" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Votes by Section</CardTitle>
                                <CardDescription>Breakdown of where each candidate got their votes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {Object.entries(candidatesByPosition).map(([position, candidates]) => (
                                    <div key={position} className="border rounded-lg p-4">
                                        <h3 className="font-bold text-lg mb-4 uppercase text-primary">{position}</h3>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[200px]">Candidate</TableHead>
                                                        <TableHead>Total</TableHead>
                                                        {sectionNames.map(section => (
                                                            <TableHead key={section} className="text-center text-xs whitespace-nowrap">{section}</TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {candidates.map(candidate => (
                                                        <TableRow key={candidate.id}>
                                                            <TableCell className="font-medium">
                                                                <div>{candidate.name}</div>
                                                                <div className="text-xs text-muted-foreground">{candidate.partylist}</div>
                                                            </TableCell>
                                                            <TableCell className="font-bold">{candidate.total_votes}</TableCell>
                                                            {sectionNames.map(section => (
                                                                <TableCell key={section} className="text-center">
                                                                    {candidate.section_votes[section] || '-'}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="time" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Voting Activity (Hourly)</CardTitle>
                                <CardDescription>Number of voters casting their votes per hour.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-end justify-between gap-2 p-4 border rounded bg-slate-50">
                                    {Array.from({ length: 24 }, (_, i) => i).map(hour => {
                                        const data = hourly_trends.find(t => t.hour === hour);
                                        const count = data ? data.count : 0;
                                        const max = Math.max(...hourly_trends.map(t => t.count), 1);
                                        const height = (count / max) * 100;

                                        return (
                                            <div key={hour} className="flex flex-col items-center gap-1 w-full group">
                                                <div
                                                    className="w-full bg-emerald-500 rounded-t hover:bg-emerald-600 transition-all relative"
                                                    style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                                                >
                                                    {count > 0 && (
                                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold bg-white px-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {count}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-500 rotate-0">
                                                    {hour}:00
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="abstentions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Abstentions & Undervotes</CardTitle>
                                <CardDescription>Analysis of uncast votes per position.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Position</TableHead>
                                            <TableHead className="text-center">Max Votes Allowed</TableHead>
                                            <TableHead className="text-center">Total Votes Cast</TableHead>
                                            <TableHead className="text-center text-amber-600">Undervotes (Unused Slots)</TableHead>
                                            <TableHead className="text-center text-red-600">Fully Abstained Voters</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {abstentions.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-bold">{item.position}</TableCell>
                                                <TableCell className="text-center">{item.max_votes}</TableCell>

                                                <TableCell className="text-center">
                                                    {(item.total_votes_cast ?? 0).toLocaleString()}
                                                </TableCell>

                                                <TableCell className="text-center font-bold text-amber-600">
                                                    {(item.undervotes ?? 0).toLocaleString()}
                                                </TableCell>

                                                <TableCell className="text-center font-bold text-red-600">
                                                    {(item.fully_abstained_voters ?? 0).toLocaleString()}
                                                </TableCell>
                                            </TableRow>

                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 text-sm text-muted-foreground bg-muted p-4 rounded">
                                    <p className="font-semibold mb-1">Definitions:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Undervotes:</strong> Total number of available vote slots that were not used. (e.g. if a position allows 2 votes and a voter only selects 1, that is 1 undervote).</li>
                                        <li><strong>Fully Abstained Voters:</strong> Number of voters who did not select ANY candidate for this position.</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
