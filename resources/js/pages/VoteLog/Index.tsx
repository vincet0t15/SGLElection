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
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Eye, User } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { PaginatedDataResponse } from '@/types/pagination';
import { VoterProps } from '@/types/voter';





interface Position {
    id: number;
    name: string;
}

interface Props {
    voters: PaginatedDataResponse<VoterProps>;
    positions: Position[];
}

export default function VoteLog({ voters, positions }: Props) {
    console.log(voters);
    const [selectedVoter, setSelectedVoter] = useState<VoterProps | null>(null);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Vote Logs', href: '/vote-logs' },
        ]}>
            <Head title="Vote Logs" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Vote Logs"
                    description="View and manage voting logs for each voter."
                />

                <Card className='rounded-sm'>
                    <CardHeader>
                        <CardTitle>Voter List</CardTitle>
                        <CardDescription>
                            List of voters and their voting activity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-muted/50">
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
                                    voters.data.map((voter, index) => (
                                        <TableRow key={voter.id} className='text-sm hover:bg-muted/50'>
                                            <TableCell className="font-medium">
                                                <div>{voter.name}</div>
                                                <div className="text-xs text-muted-foreground">{voter.username}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {voter.votes?.length || 0} Votes
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span
                                                    className='text-teal-700 hover:text-teal900 hover:font-bold cursor-pointer hover:underline'
                                                    onClick={() => setSelectedVoter(voter)}
                                                >
                                                    View Votes
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
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
