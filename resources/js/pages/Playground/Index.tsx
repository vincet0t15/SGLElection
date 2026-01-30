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
import { Badge } from "@/components/ui/badge";

interface Vote {
    id: number;
    position: {
        name: string;
    };
    candidate: {
        name: string;
    };
}

interface Voter {
    id: number;
    name: string;
    username: string;
    votes: Vote[];
}

interface Props {
    voters: Voter[];
}

export default function Playground({ voters }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Playground', href: '/playground' },
        ]}>
            <Head title="Playground" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Voter Votes Log</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Votes</CardTitle>
                        <CardDescription>
                            Displaying the latest 50 voters and their choices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Voter Name</TableHead>
                                    <TableHead>Votes Cast</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {voters.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                            No votes found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    voters.map((voter) => (
                                        <TableRow key={voter.id}>
                                            <TableCell className="font-medium align-top">
                                                <div>{voter.name}</div>
                                                <div className="text-xs text-muted-foreground">{voter.username}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {voter.votes.map((vote) => (
                                                        <Badge key={vote.id} variant="secondary" className="flex flex-col items-start gap-0.5 py-1 px-2 h-auto">
                                                            <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                                                                {vote.position?.name || 'Unknown Position'}
                                                            </span>
                                                            <span className="font-medium">
                                                                {vote.candidate?.name || 'Unknown Candidate'}
                                                            </span>
                                                        </Badge>
                                                    ))}
                                                </div>
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
