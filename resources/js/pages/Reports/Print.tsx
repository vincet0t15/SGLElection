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
        <div className="bg-white text-black min-h-screen p-8 print:p-0 max-w-[216mm] mx-auto font-sans text-[11px] leading-[1.3]">
            <Head title={`Official Result - ${event.name}`} />


            <div className="print:hidden mb-8 flex justify-end items-center border-b pb-4 gap-2">
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    Print / Save as PDF
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
                                <div className="mb-6 flex justify-center border-b-2 border-black pb-2">
                                    <table className="border-collapse border-none">
                                        <tbody>
                                            <tr>
                                                <td className="align-top pr-4 border-none !p-0">
                                                    {system_settings.logo ? (
                                                        <img
                                                            src={system_settings.logo}
                                                            alt="Logo"
                                                            className="h-20 w-auto object-contain"
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
                                                        <div className="w-20 h-20 bg-emerald-600 flex items-center justify-center rounded-full text-white">
                                                            <AppLogoIcon className="w-10 h-10 fill-current" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="align-middle text-center border-none !p-0">
                                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>REPUBLIC OF THE PHILIPPINES</div>
                                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>DEPARTMENT OF EDUCATION</div>
                                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Times New Roman", serif' }}>MIMAROPA Region</div>
                                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Times New Roman", serif' }}>Schools Division of Palawan</div>
                                                    <div className="font-serif text-[16px] font-bold text-[#006400] uppercase my-1" style={{ fontFamily: '"Times New Roman", serif' }}>
                                                        SAN VICENTE NATIONAL HIGH SCHOOL
                                                    </div>
                                                    <div className="font-serif text-[12px] italic" style={{ fontFamily: '"Times New Roman", serif' }}>Poblacion, San Vicente, Palawan</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Title */}
                                <div className="text-center mb-5">
                                    <h2 className="m-0 text-[16px] font-bold uppercase" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>OFFICIAL RESULT</h2>
                                    <p className="m-[5px_0] text-[12px]">{event.name}</p>
                                    <p className="m-0 text-[12px]">Date of Election: {formatDate(event.dateTime_start)}</p>
                                </div>

                                {/* Meta Info */}
                                <table className="w-full mb-5 border-collapse">
                                    <tbody>
                                        <tr>
                                            <td className="p-1 font-bold">Total Registered Voters: {stats.registered_voters.toLocaleString()}</td>
                                            <td className="p-1 font-bold">Total Votes Cast: {stats.actual_voters.toLocaleString()}</td>
                                            <td className="p-1 font-bold">Voter Turnout: {stats.turnout}%</td>
                                        </tr>
                                    </tbody>
                                </table>


                                <div className="space-y-8 print:space-y-1">
                                    {positions.map((position) => {
                                        const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);

                                        return (
                                            <div key={position.id} className="mb-4">
                                                <div
                                                    className="font-bold uppercase bg-gray-100 p-1 border border-black"
                                                    style={{ pageBreakAfter: 'avoid' }}
                                                >
                                                    {position.name} (Vote for {position.max_votes})
                                                </div>

                                                <div className="">
                                                    <table className="w-full border-collapse border border-black table-fixed -mt-[1px]">
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
  @page {
    margin: 10mm;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  table {
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  thead {
    display: table-header-group;
  }
}

                `}</style>
        </div >
    );
}
