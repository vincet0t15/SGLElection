import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { Printer, Download } from 'lucide-react';

interface Signatory {
    id: number;
    name: string;
    position: string;
    description: string | null;
}

interface Props {
    event: EventProps;
    positions: PositionProps[];
    signatories: Signatory[];
    stats: {
        actual_voters: number;
        registered_voters: number;
        total_sections: number;
        turnout: number;
    };
    type?: string;
}

export default function ReportsPrint({ event, positions, signatories, stats, type }: Props) {
    const { system_settings } = usePage<SharedData>().props;

    useEffect(() => {
        // Optional: Auto-print when loaded
        // window.print();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 max-w-[300mm] mx-auto font-sans">
            <Head title={`Official Result - ${event.name}`} />

            {/* Print controls - hidden when printing */}
            <div className="print:hidden mb-8 flex justify-end items-center border-b pb-4 gap-2">

                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    Print Now
                </button>

                <a
                    href={`/reports/print-pdf/${event.id}?type=${type || ''}`}
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </a>
            </div>

            <div className="print:w-full">
                <table className="w-full">
                    <thead className="hidden print:table-header-group">
                        <tr>
                            <td>
                                <div className="h-[9mm]"></div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {/* Header Section */}
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                                        {system_settings.logo ? (
                                            <img src={system_settings.logo} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-emerald-600 flex items-center justify-center rounded-full text-white">
                                                <AppLogoIcon className="w-10 h-10 fill-current" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h1 className="text-xl font-serif font-bold uppercase tracking-wide leading-tight">
                                            {system_settings.name || 'Voting System'}
                                        </h1>
                                        <h2 className="text-lg font-serif uppercase tracking-wide text-gray-800">
                                            {type === 'winners' ? 'OFFICIAL LIST OF WINNERS' : 'OFFICIAL ELECTION RESULTS'}
                                        </h2>
                                        <p className="text-sm font-bold uppercase mt-1 text-gray-600">
                                            {event.name}
                                        </p>
                                    </div>
                                    <div className="text-right pt-2">
                                        <p className="text-xs  text-gray-500">Ref: {event.id}-{new Date().getFullYear()}</p>
                                    </div>
                                </div>

                                {/* Metadata Section */}
                                <div className="mb-8 text-sm leading-relaxed font-medium text-gray-800">
                                    <div className="grid grid-cols-[300px_1fr] gap-1">
                                        <div>Period:</div>
                                        <div>{formatDate(event.dateTime_start)} - {formatDate(event.dateTime_end)}</div>

                                        <div>Total Number of Clustered Precincts (Sections):</div>
                                        <div>{stats.total_sections.toLocaleString()}</div>

                                        <div>Total Number of Registered Voters:</div>
                                        <div>{stats.registered_voters.toLocaleString()}</div>

                                        <div>Total Number of Voters that Actually Voted:</div>
                                        <div>{stats.actual_voters.toLocaleString()}</div>

                                        <div>Voters' Turnout (%):</div>
                                        <div>{stats.turnout}%</div>
                                    </div>
                                </div>

                                {/* Results Section */}
                                <div className="space-y-8 print:space-y-1">
                                    {positions.map((position) => {
                                        const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);

                                        return (
                                            <div key={position.id} className="break-inside-avoid print:mb-4">
                                                <h3 className="font-bold uppercase mb-2  text-sm bg-gray-100 p-1 border border-black border-b-0 mb-[-2px]">
                                                    {position.name} (TOP {position.max_votes})
                                                </h3>

                                                <div className="">
                                                    <table className="w-full text-sm border-collapse border border-black table-fixed">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-black">
                                                                <th className="border border-black py-1 px-4 text-left">Candidate</th>
                                                                <th className="border border-black py-1 px-4 text-center w-32">Votes</th>
                                                                <th className="border border-black py-1 px-4 text-center w-32">%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {position.candidates.map((candidate, index) => {
                                                                const percentage = stats.actual_voters > 0
                                                                    ? ((candidate.votes_count || 0) / stats.actual_voters * 100).toFixed(2)
                                                                    : "0.00";

                                                                const votes = candidate.votes_count || 0;
                                                                const lastWinnerVotes = position.candidates[position.max_votes - 1]?.votes_count || 0;
                                                                const firstLoserVotes = position.candidates[position.max_votes]?.votes_count || 0;

                                                                const isTieForLastSpot = position.candidates.length > position.max_votes &&
                                                                    lastWinnerVotes > 0 &&
                                                                    lastWinnerVotes === firstLoserVotes;

                                                                let isTied = isTieForLastSpot && votes === lastWinnerVotes;

                                                                // Handle manual tie breaker display
                                                                if (candidate.is_tie_breaker_winner) {
                                                                    isTied = false;
                                                                } else if (isTieForLastSpot && votes === lastWinnerVotes) {
                                                                    const hasTieBreakerWinner = position.candidates.some((c: any) => c.votes_count === lastWinnerVotes && c.is_tie_breaker_winner);
                                                                    if (hasTieBreakerWinner) {
                                                                        isTied = false;
                                                                    }
                                                                }

                                                                const rank = position.candidates.findIndex(c => c.votes_count === votes) + 1;
                                                                const partylistName = candidate.partylist?.name ? `(${candidate.partylist.name})` : '(INDEPENDENT)';

                                                                return (
                                                                    <tr key={candidate.id} className="border-b border-black last:border-b-0">
                                                                        <td className="py-1 px-4 border border-black uppercase font-medium">
                                                                            {rank}. {candidate.name} <span className="text-gray-600 font-normal">{partylistName}</span>
                                                                            {candidate.is_tie_breaker_winner && <span className="font-bold text-blue-600 ml-1">(TIE WINNER)</span>}
                                                                            {isTied && <span className="font-bold text-red-600 ml-1">(TIE)</span>}
                                                                        </td>
                                                                        <td className="py-1 px-4 border border-black w-32 text-center">
                                                                            {candidate.votes_count?.toLocaleString()}
                                                                        </td>
                                                                        <td className="py-1 px-4 border border-black w-32 text-center">
                                                                            {percentage}%
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            {position.candidates.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={3} className="py-4 text-center italic text-gray-500 border border-black">
                                                                        No candidates for this position.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer / Certification */}
                                <div className="mt-16 break-inside-avoid print:mt-12">
                                    <p className="text-xs font-bold uppercase mb-8">Certified Correct:</p>

                                    <div className="grid grid-cols-2 gap-8 gap-y-12">
                                        {signatories.length > 0 ? (
                                            signatories.map((signatory) => (
                                                <div key={signatory.id} className="text-center break-inside-avoid px-4">
                                                    <p className="uppercase font-bold mb-1 text-sm">{signatory.name}</p>
                                                    <div className="border-b border-black w-full mb-2"></div>
                                                    <p className="text-xs uppercase font-bold">{signatory.position}</p>
                                                    {signatory.description && (
                                                        <p className="text-[10px] text-gray-500 mt-0.5">{signatory.description}</p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            /* Fallback for when no signatories are defined yet */
                                            <>
                                                <div className="text-center flex-1">
                                                    <div className="border-b border-black w-full mb-2"></div>
                                                    <p className="text-xs uppercase font-bold">Election Committee Head</p>
                                                </div>
                                                <div className="text-center flex-1">
                                                    <div className="border-b border-black w-full mb-2"></div>
                                                    <p className="text-xs uppercase font-bold">School Administrator</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-4 border-t text-[10px] text-gray-400 flex justify-between">
                                        <span>Generated by {system_settings.name || 'System'}</span>
                                        <span>Date Printed: {new Date().toLocaleString()}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody >
                </table >
            </div >

            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { margin: 0 10mm; -webkit-print-color-adjust: exact; }
                       table {
                        border-collapse: collapse;
                    }

                    td {
                        padding: 4px 6px !important;
                        font-size: 12px;
                        page-break-inside: avoid;
                    }
                }
            `}</style>
        </div >
    );
}
