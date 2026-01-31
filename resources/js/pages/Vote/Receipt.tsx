import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, LogOut, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vote {
    id: number;
    candidate: {
        id: number;
        name: string;
        partylist?: {
            name: string;
        };
        position: {
            id: number;
            name: string;
            order: number;
        };
        candidate_photos?: {
            path: string;
        }[];
    };
}

interface Props {
    votes: Vote[];
    event: {
        name: string;
    };
    voter: {
        name: string;
        username: string;
    };
}

export default function Receipt({ votes, event, voter }: Props) {
    // Group votes by position
    const votesByPosition = votes.reduce((acc, vote) => {
        const positionName = vote.candidate.position.name;
        if (!acc[positionName]) {
            acc[positionName] = [];
        }
        acc[positionName].push(vote);
        return acc;
    }, {} as Record<string, Vote[]>);

    const handleLogout = () => {
        router.post(('voter.logout'));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
            <Head title="Vote Receipt" />

            <Card className="w-full max-w-2xl shadow-xl border-t-8 border-t-emerald-500">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-emerald-100 p-3 rounded-full w-fit mb-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800">Vote Submitted Successfully!</CardTitle>
                    <CardDescription className="text-lg text-slate-600 mt-2">
                        Thank you for voting in the <span className="font-semibold text-slate-900">{event.name}</span>.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    <div className="bg-slate-100 p-4 rounded-lg text-center">
                        <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Voter</p>
                        <p className="text-xl font-bold text-slate-800">{voter.name}</p>
                        <p className="text-sm text-slate-500">{voter.username}</p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Your Ballot Summary</h3>

                        {Object.entries(votesByPosition).map(([position, positionVotes]) => (
                            <div key={position} className="space-y-2 break-inside-avoid">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{position}</h4>
                                <div className="grid gap-3">
                                    {positionVotes.map((vote) => (
                                        <div key={vote.id} className="flex items-center gap-4 bg-white border rounded-lg p-3 shadow-sm">
                                            {/* Avatar/Photo Placeholder */}
                                            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                {vote.candidate.candidate_photos && vote.candidate.candidate_photos.length > 0 ? (
                                                    <img
                                                        src={`/storage/${vote.candidate.candidate_photos[0].path}`}
                                                        alt={vote.candidate.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold">
                                                        {vote.candidate.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-800">{vote.candidate.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {vote.candidate.partylist?.name || 'Independent'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t bg-slate-50/50">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={handlePrint}
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                    </Button>
                    <Button
                        className="w-full sm:w-auto sm:ml-auto bg-slate-900 hover:bg-slate-800"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Secure Logout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
