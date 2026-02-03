import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LogOut, Printer, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

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
    systemSettings?: {
        system_name: string;
        system_logo: string;
    }
}

export default function Receipt({ votes, event, voter }: Props) {
    const { system_settings } = usePage<SharedData>().props;

    const votesByPosition = votes.reduce((acc, vote) => {
        const positionName = vote.candidate.position.name;
        if (!acc[positionName]) {
            acc[positionName] = [];
        }
        acc[positionName].push(vote);
        return acc;
    }, {} as Record<string, Vote[]>);

    const handleLogout = () => {
        router.post('/voter/logout');
    };

    const handlePrint = () => {
        window.print();
    };

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center justify-center print:bg-white print:p-0">
            <Head title="Vote Receipt" />


            <div className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full relative rounded-xl print:rounded-none">

                <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 w-full print:hidden"></div>

                <div className="p-8 print:p-0">

                    <div className="mb-8 flex justify-center border-b border-slate-100 pb-6">
                        <table className="border-collapse border-none">
                            <tbody>
                                <tr>
                                    <td className="align-top pr-4 border-none !p-0 w-20 hidden sm:table-cell print:table-cell">
                                        {system_settings.logo ? (
                                            <img src={system_settings.logo} alt="Logo" className="h-20 w-auto object-contain" />
                                        ) : (
                                            <div className="w-20 h-20 bg-emerald-600 flex items-center justify-center rounded-full text-white shadow-sm print:hidden">
                                                <AppLogoIcon className="w-10 h-10 fill-current" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="align-middle text-center border-none !p-0">
                                        <div className="font-serif text-[12px] sm:text-[13px] text-slate-900" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>REPUBLIC OF THE PHILIPPINES</div>
                                        <div className="font-serif text-[12px] sm:text-[13px] text-slate-900" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>DEPARTMENT OF EDUCATION</div>
                                        <div className="font-serif text-[12px] text-slate-600" style={{ fontFamily: '"Times New Roman", serif' }}>MIMAROPA Region</div>
                                        <div className="font-serif text-[12px] text-slate-600" style={{ fontFamily: '"Times New Roman", serif' }}>Schools Division of Palawan</div>
                                        <div className="font-serif text-[15px] sm:text-[16px] font-bold text-emerald-800 uppercase my-1" style={{ fontFamily: '"Times New Roman", serif' }}>
                                            {system_settings.name || 'SAN VICENTE NATIONAL HIGH SCHOOL'}
                                        </div>
                                        <div className="font-serif text-[11px] text-slate-500 italic" style={{ fontFamily: '"Times New Roman", serif' }}>Poblacion, San Vicente, Palawan</div>
                                    </td>
                                    <td className="w-20 hidden sm:table-cell print:table-cell"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center space-y-1 mb-8">
                        <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900 leading-none font-serif" style={{ fontFamily: '"Old English Text MT", serif' }}>Official Ballot Receipt</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{event.name}</p>
                    </div>

                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-dashed border-slate-300"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400">
                            <ShieldCheck className="w-5 h-5" />
                        </span>
                        <div className="flex-grow border-t border-dashed border-slate-300"></div>
                    </div>


                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Voter Name</p>
                                <p className="text-sm font-bold text-slate-900 uppercase">{voter.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Voter ID</p>
                                <p className="text-sm font-mono font-bold text-slate-900">{voter.username}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Date</p>
                                <p className="text-sm font-mono text-slate-700">{formattedDate}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Time</p>
                                <p className="text-sm font-mono text-slate-700">{formattedTime}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t-2 border-slate-900 mb-6"></div>


                    <div className="space-y-6">
                        {Object.entries(votesByPosition).map(([position, positionVotes]) => (
                            <div key={position} className="space-y-2 break-inside-avoid">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{position}</h4>
                                <div className="space-y-2">
                                    {positionVotes.map((vote) => (
                                        <div key={vote.id} className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">

                                                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 print:hidden">
                                                    {vote.candidate.candidate_photos && vote.candidate.candidate_photos.length > 0 ? (
                                                        <img
                                                            src={`/storage/${vote.candidate.candidate_photos[0].path}`}
                                                            alt={vote.candidate.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-xs">
                                                            {vote.candidate.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{vote.candidate.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase">{vote.candidate.partylist?.name || 'Independent'}</p>
                                                </div>
                                            </div>
                                            <div className="print:hidden">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-b border-dashed border-slate-200 mt-2"></div>
                            </div>
                        ))}
                    </div>


                    <div className="mt-8 pt-8 text-center space-y-4">
                        <div className="flex justify-center text-slate-900">
                            <QrCode className="w-20 h-20 opacity-90" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Digital Signature</p>
                            <p className="font-mono text-[10px] text-slate-400 break-all px-8">
                                {btoa(`${voter.username}-${event.name}-${formattedDate}`).substring(0, 32)}...
                            </p>
                        </div>
                        <div className="pt-4">
                            <p className="text-sm font-black text-slate-900 tracking-widest uppercase">Vote Recorded</p>
                        </div>
                    </div>
                </div>


                <div className="h-2 bg-slate-900 w-full print:hidden"></div>
            </div>


            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md print:hidden">
                <Button
                    variant="outline"
                    className="flex-1 bg-white hover:bg-slate-50 border-slate-200 shadow-sm h-12"
                    onClick={handlePrint}
                >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                </Button>
                <Button
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 h-12"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Secure Logout
                </Button>
            </div>
        </div>
    );
}
