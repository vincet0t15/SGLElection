import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from '@/components/paginationData';
import { PaginatedDataResponse } from '@/types/pagination';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Search, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { voteLogs } from '@/routes';

interface Vote {
    id: number;
    position: {
        name: string;
    };
    candidate: {
        name: string;
        candidate_photos: {
            path: string;
        }[];
    };
}

interface Voter {
    id: number;
    name: string;
    username: string;
    votes: Vote[];
}

interface Position {
    id: number;
    name: string;
}

interface Props {
    voters: PaginatedDataResponse<Voter>;
    positions: Position[];
    filters: {
        search?: string;
    };
}

export default function VoteLog({ voters, positions, filters }: Props) {
    const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    voteLogs().url,
                    { search },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Vote Logs', href: '/vote-logs' },
        ]}>
            <Head title="Vote Logs" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Vote Logs</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Voter List</CardTitle>
                        <CardDescription>
                            List of voters and their voting activity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search voters..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Voter Name</TableHead>
                                    <TableHead>Total Votes</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {voters.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No voters found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    voters.data.map((voter) => (
                                        <TableRow key={voter.id}>
                                            <TableCell className="font-medium">
                                                <div>{voter.name}</div>
                                                <div className="text-xs text-muted-foreground">{voter.username}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {voter.votes.length} Votes
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedVoter(voter)}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Votes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <Pagination data={voters} />
                    </CardContent>
                </Card>

                <Dialog open={!!selectedVoter} onOpenChange={(open) => !open && setSelectedVoter(null)}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Votes by {selectedVoter?.name}</DialogTitle>
                            <DialogDescription>
                                Detailed list of candidates voted for by this voter.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedVoter && (
                            <div className="mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Candidate</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {positions.map((position) => {
                                            const vote = selectedVoter.votes.find(v => v.position.name === position.name);

                                            let photoUrl = null;
                                            if (vote && vote.candidate.candidate_photos && vote.candidate.candidate_photos.length > 0) {
                                                photoUrl = `/storage/${vote.candidate.candidate_photos[0].path}`;
                                            }

                                            return (
                                                <TableRow key={position.id}>
                                                    <TableCell className="font-medium">{position.name}</TableCell>
                                                    <TableCell>
                                                        {vote ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                                    {photoUrl ? (
                                                                        <img
                                                                            src={photoUrl}
                                                                            alt={vote.candidate.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                                            <User className="h-5 w-5" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <span className="font-medium">{vote.candidate.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground italic text-sm">No vote cast</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
