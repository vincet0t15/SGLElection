import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Heading from '@/components/heading';
import { PaginatedDataResponse } from '@/types/pagination';
import { VoterProps } from '@/types/voter';

interface VoteLogEntry {
    id: number;
    voter_id: number;
    event_id: number;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    voter: VoterProps;
}

interface Props {
    logs: PaginatedDataResponse<VoteLogEntry>;
}

export default function VoteLog({ logs }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Vote Logs', href: '/vote-logs' },
        ]}>
            <Head title="Vote Logs" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Audit Logs"
                    description="Secure audit trail of voting activities."
                />

                <Card className='rounded-sm'>
                    <CardHeader>
                        <CardTitle>Activity Log</CardTitle>
                        <CardDescription>
                            Records of when and from where votes were cast. Candidate choices are not shown for secrecy.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[250px]">Voter</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Device Info</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow key={log.id} className='text-sm hover:bg-muted/50'>
                                            <TableCell className="font-medium">
                                                <div>{log.voter.name}</div>
                                                <div className="text-xs text-muted-foreground">{log.voter.username}</div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(log.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {log.ip_address || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate" title={log.user_agent || ''}>
                                                {log.user_agent || 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
