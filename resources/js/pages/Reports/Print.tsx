import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

interface Props {
    event: EventProps;
    positions: PositionProps[];
    stats: {
        actual_voters: number;
        registered_voters: number;
        total_sections: number;
        turnout: number;
    };
}

export default function ReportsPrint({ event, positions, stats }: Props) {
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
            <div className="print:hidden mb-8 flex justify-end items-center border-b pb-4">

                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print Now
                </button>
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
                                            OFFICIAL ELECTION RESULTS
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
                                            <div key={position.id} className="break-inside-avoid print:mb-2">
                                                <h3 className="font-bold uppercase mb-2 print:mb-1 text-sm">
                                                    {position.name} (TOP {position.max_votes})
                                                </h3>

                                                <div className="border border-black">
                                                    <table className="w-full text-sm">
                                                        <tbody>
                                                            {position.candidates.map((candidate, index) => {
                                                                const percentage = stats.actual_voters > 0
                                                                    ? ((candidate.votes_count || 0) / stats.actual_voters * 100).toFixed(2)
                                                                    : "0.00";

                                                                const rank = index + 1;
                                                                const partylistName = candidate.partylist?.name ? `(${candidate.partylist.name})` : '(INDEPENDENT)';

                                                                return (
                                                                    <tr key={candidate.id} className="border-b border-black last:border-b-0">
                                                                        <td className="py-2 px-4 border-r border-black uppercase font-medium">
                                                                            {rank}. {candidate.name} <span className="text-gray-600 font-normal">{partylistName}</span>
                                                                        </td>
                                                                        <td className="py-2 px-4 w-32 text-center border-r border-black ">
                                                                            {candidate.votes_count?.toLocaleString()}
                                                                        </td>
                                                                        <td className="py-2 px-4 w-32 text-center ">
                                                                            {percentage}%
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            {position.candidates.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={3} className="py-4 text-center italic text-gray-500">
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

                                    <div className="flex justify-between items-end gap-8">
                                        <div className="text-center flex-1">
                                            <div className="border-b border-black w-full mb-2"></div>
                                            <p className="text-xs uppercase font-bold">Election Committee Head</p>
                                        </div>
                                        <div className="text-center flex-1">
                                            <div className="border-b border-black w-full mb-2"></div>
                                            <p className="text-xs uppercase font-bold">School Administrator</p>
                                        </div>
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
