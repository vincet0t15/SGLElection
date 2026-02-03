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
                                <div className="mb-6">
                                    <table className="w-full border-collapse border-none">
                                        <tbody>
                                            <tr>
                                                <td className="w-[120px] align-top text-right pr-4 border-none !p-0">
                                                    {system_settings.logo ? (
                                                        <img
                                                            src={system_settings.logo}
                                                            alt="Logo"
                                                            className="h-20 w-auto ml-auto object-contain"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                if (target.src !== system_settings.logo) {
                                                                    target.src = system_settings.logo || '';
                                                                } else {
                                                                    target.style.display = 'none';
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 bg-emerald-600 flex items-center justify-center rounded-full text-white ml-auto">
                                                            <AppLogoIcon className="w-10 h-10 fill-current" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="align-middle text-center border-none !p-0">
                                                    <div className="font-serif text-[14px]" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>REPUBLIC OF THE PHILIPPINES</div>
                                                    <div className="font-serif text-[14px]" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>DEPARTMENT OF EDUCATION</div>
                                                    <div className="font-serif text-[13px]">MIMAROPA Region</div>
                                                    <div className="font-serif text-[13px]">Schools Division of Palawan</div>
                                                    <div className="font-serif text-[16px] font-bold text-[#006400] uppercase my-1">
                                                        SAN VICENTE NATIONAL HIGH SCHOOL
                                                    </div>
                                                    <div className="font-serif text-[12px] italic">Poblacion, San Vicente, Palawan</div>
                                                </td>
                                                <td className="w-[130px] border-none !p-0"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>




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


                                <div className="space-y-8 print:space-y-1">
                                    {positions.map((position) => {
                                        const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);

                                        return (
                                            <div key={position.id} className="break-inside-avoid print:mb-4">
                                                <h3 className="font-bold uppercase mb-2  text-sm bg-gray-100 p-1 border border-black border-b-0 mb-[-2px]">
                                                    {position.name} (Vote for {position.max_votes})
                                                </h3>

                                                <div className="">
                                                    <table className="w-full text-sm border-collapse border border-black table-fixed">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-black">
                                                                <th className="border border-black py-1 px-4 text-left">Candidate</th>
                                                                <th className="border border-black py-1 px-4 text-left">Partylist</th>
                                                                <th className="border border-black py-1 px-4 text-center w-24">Votes</th>
                                                                <th className="border border-black py-1 px-4 text-center w-24">%</th>
                                                                <th className="border border-black py-1 px-4 text-center w-24">Status</th>
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


                                                                if (candidate.is_tie_breaker_winner) {
                                                                    isTied = false;
                                                                } else if (isTieForLastSpot && votes === lastWinnerVotes) {
                                                                    const hasTieBreakerWinner = position.candidates.some((c: any) => c.votes_count === lastWinnerVotes && c.is_tie_breaker_winner);
                                                                    if (hasTieBreakerWinner) {
                                                                        isTied = false;
                                                                    }
                                                                }

                                                                const rank = position.candidates.findIndex(c => c.votes_count === votes) + 1;
                                                                const isWinner = index < position.max_votes || candidate.is_tie_breaker_winner;

                                                                return (
                                                                    <tr key={candidate.id} className="border-b border-black last:border-b-0">
                                                                        <td className="py-1 px-4 border border-black uppercase font-medium">
                                                                            {index + 1}. {candidate.name}
                                                                        </td>
                                                                        <td className="py-1 px-4 border border-black uppercase">
                                                                            {candidate.partylist?.name || 'INDEPENDENT'}
                                                                        </td>
                                                                        <td className="py-1 px-4 border border-black w-24 text-center">
                                                                            {candidate.votes_count?.toLocaleString()}
                                                                        </td>
                                                                        <td className="py-1 px-4 border border-black w-24 text-center">
                                                                            {percentage}%
                                                                        </td>
                                                                        <td className="py-1 px-4 border border-black w-24 text-center font-bold text-xs">
                                                                            {isWinner && <span className="text-emerald-700">WINNER</span>}
                                                                            {candidate.is_tie_breaker_winner && <span className="text-blue-600 block text-[10px]">(TIE BREAK)</span>}
                                                                            {isTied && <span className="text-red-600 block text-[10px]">(TIE)</span>}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            {type !== 'winners' && (
                                                                <tr className="bg-gray-50 border-t border-black font-bold text-xs">
                                                                    <td colSpan={2} className="py-1 px-4 border border-black text-right uppercase">Abstentions / Undervotes</td>
                                                                    <td className="py-1 px-4 border border-black text-center">
                                                                        {stats.actual_voters - (position.votes_cast_count || 0)}
                                                                    </td>
                                                                    <td className="py-1 px-4 border border-black text-center">
                                                                        {stats.actual_voters > 0
                                                                            ? (((stats.actual_voters - (position.votes_cast_count || 0)) / stats.actual_voters) * 100).toFixed(2)
                                                                            : "0.00"}%
                                                                    </td>
                                                                    <td className="py-1 px-4 border border-black"></td>
                                                                </tr>
                                                            )}
                                                            {position.candidates.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={5} className="py-4 text-center italic text-gray-500 border border-black">
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


                                <div className="mt-16 break-inside-avoid print:mt-12">
                                    <p className="text-xs font-bold uppercase mb-12">Certified Correct:</p>

                                    <div className="grid grid-cols-3 gap-8 gap-y-12">
                                        {signatories.length > 0 ? (
                                            signatories.map((signatory) => (
                                                <div key={signatory.id} className="text-center break-inside-avoid px-2">
                                                    <div className="border-b border-black w-4/5 mx-auto mb-1"></div>
                                                    <p className="uppercase font-bold text-sm">{signatory.name}</p>
                                                    <p className="text-[10px] text-gray-600 uppercase font-bold">{signatory.position}</p>
                                                    {signatory.description && (
                                                        <p className="text-[10px] text-gray-500 mt-0.5">{signatory.description}</p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (

                                            <>
                                                <div className="text-center flex-1">
                                                    <div className="border-b border-black w-4/5 mx-auto mb-1"></div>
                                                    <p className="text-[10px] uppercase font-bold">Election Committee Head</p>
                                                </div>
                                                <div className="text-center flex-1">
                                                    <div className="border-b border-black w-4/5 mx-auto mb-1"></div>
                                                    <p className="text-[10px] uppercase font-bold">School Administrator</p>
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
