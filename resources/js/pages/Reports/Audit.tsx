import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, MapPin, Monitor, Printer } from 'lucide-react';
import { EventProps } from '@/types/event';
import Heading from '@/components/heading';
import Pagination from '@/components/paginationData';
import { PaginatedDataResponse } from '@/types/pagination';

interface VoteActivityLog {
    id: number;
    created_at: string;
    ip_address: string;
    user_agent: string;
    voter: {
        id: number;
        name: string;
        username: string;
        year_level?: { name: string };
        year_section?: { name: string };
    };
}

interface PaginatedLogs {
    data: VoteActivityLog[];
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
    logs: PaginatedDataResponse<VoteActivityLog>;
}

export default function ReportsAudit({ event, logs }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Reports', href: '/reports' },
            { title: event.name, href: `/reports/${event.id}` },
            { title: 'Audit Log', href: '' },
        ]}>
            <Head title={`Audit Log - ${event.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex gap-2 items-center'>
                    <Link href={`/reports/${event.id}`} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <Heading
                        variant="small"
                        title="Election Audit Log"
                        description="Secure chronological record of all voting activities."
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
                        <p className="text-muted-foreground text-sm">
                            Total Records: {logs.total}
                        </p>
                    </div>
                    <Button asChild variant="outline" className="gap-2">
                        <a href={`/reports/audit/print/${event.id}`} target="_blank" rel="noopener noreferrer">
                            <Printer className="h-4 w-4" />
                            Print Log
                        </a>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            Voting Activity Log
                        </CardTitle>
                        <CardDescription>
                            This log records the exact time and location of every vote cast. It does not show who the voter voted for.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Voter Name</TableHead>
                                    <TableHead>Voter ID</TableHead>
                                    <TableHead>Year & Section</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Device Info</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No voting activity recorded yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs">
                                                {new Date(log.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {log.voter.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {log.voter.username}
                                            </TableCell>
                                            <TableCell>
                                                {log.voter.year_level?.name} - {log.voter.year_section?.name}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {log.ip_address}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground" title={log.user_agent}>
                                                <div className="flex items-center gap-1">
                                                    <Monitor className="h-3 w-3" />
                                                    {log.user_agent}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <Pagination data={logs} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
