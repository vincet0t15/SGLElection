import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';

interface Props {
    event: EventProps;
    positions: PositionProps[];
    stats: {
        total_voters: number;
    };
}

export default function ReportsPrint({ event, positions, stats }: Props) {
    useEffect(() => {
        // Optional: Auto-print when loaded
        // window.print();
    }, []);

    return (
        <div className="bg-white text-black min-h-screen p-8 print:px-5 print:py-0 print:text-sm max-w-[210mm] print:max-w-none mx-auto font-sans">
            <Head title={`Report - ${event.name}`} />

            {/* Print controls - hidden when printing */}
            <div className="print:hidden mb-8 flex justify-between items-center border-b pb-4">
                <h1 className="text-xl font-bold">Print Preview</h1>
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print Now
                </button>
            </div>

            <table className="w-full">
                <thead>
                    <tr>
                        <td>
                            {/* Top Margin Spacer - Repeats on every page */}
                            <div className="h-0 print:h-[20mm]"></div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {/* Header */}
                            <div className="text-center mb-8 border-b-2 border-black pb-6 print:mb-6 print:pb-4">
                                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 print:text-2xl">{event.name}</h1>
                                <p className="text-gray-600 text-lg uppercase tracking-wide print:text-base">Election Results Report</p>
                                <div className="flex justify-center gap-8 mt-4 text-sm font-medium text-gray-700 print:mt-2 print:text-xs">
                                    <span>Generated: {new Date().toLocaleDateString()}</span>
                                    <span>Total Voters: {stats.total_voters}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-8 print:space-y-6">
                                {positions.map((position) => {
                                    const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);

                                    return (
                                        <div key={position.id} className="break-inside-avoid">
                                            <h2 className="text-xl font-bold mb-4 border-b border-black pb-2 bg-gray-50 pl-2 uppercase print:text-lg print:mb-2 print:pb-1">
                                                {position.name}
                                            </h2>

                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b-2 border-gray-300">
                                                        <th className="py-2 pl-2 w-12 font-bold uppercase text-xs text-gray-500 print:py-1">Rank</th>
                                                        <th className="py-2 font-bold uppercase text-xs text-gray-500 print:py-1">Candidate</th>
                                                        <th className="py-2 font-bold uppercase text-xs text-gray-500 print:py-1">Year & Section</th>
                                                        <th className="py-2 text-right font-bold uppercase text-xs text-gray-500 print:py-1">Votes</th>
                                                        <th className="py-2 text-right pr-2 font-bold uppercase text-xs text-gray-500 print:py-1">Percentage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {position.candidates.map((candidate, index) => {
                                                        const percentage = totalVotes > 0
                                                            ? Math.round(((candidate.votes_count || 0) / totalVotes) * 100)
                                                            : 0;
                                                        // Consider as winner if the candidate is within the top N candidates (where N is max_votes)
                                                        // and has at least one vote.
                                                        const isWinner = index < position.max_votes && (candidate.votes_count || 0) > 0;
                                                        const rank = index + 1;

                                                        return (
                                                            <tr key={candidate.id} className={`border-b border-gray-100 ${isWinner ? 'bg-emerald-50/50' : ''}`}>
                                                                <td className="py-3 pl-2 font-bold text-gray-500 print:py-1.5">#{rank}</td>
                                                                <td className="py-3 flex items-center gap-3 print:py-1.5">
                                                                    <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 print:w-8 print:h-8">
                                                                        {candidate.candidate_photos?.[0]?.path ? (
                                                                            <img
                                                                                src={`/storage/${candidate.candidate_photos[0].path}`}
                                                                                alt={candidate.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold">?</div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className={`font-medium ${isWinner ? 'text-black' : 'text-gray-800'}`}>
                                                                            {candidate.name}
                                                                        </div>
                                                                        {isWinner && (
                                                                            <span className="text-[10px] uppercase font-bold bg-black text-white px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                                                                                Winner
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 text-sm text-gray-600 print:py-1.5">
                                                                    {candidate.year_level?.name} - {candidate.year_section?.name}
                                                                </td>
                                                                <td className="py-3 text-right font-mono font-medium print:py-1.5">
                                                                    {candidate.votes_count}
                                                                </td>
                                                                <td className="py-3 text-right pr-2 font-mono text-gray-600 print:py-1.5">
                                                                    {percentage}%
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Signatures */}
                            <div className="mt-20 pt-8 border-t-2 border-black break-inside-avoid print:mt-12 print:pt-6">
                                <h3 className="text-sm uppercase tracking-wider font-bold mb-12 text-center text-gray-500 print:text-xs print:mb-8">Certified Correct</h3>
                                <div className="flex justify-between gap-8 px-8">
                                    <div className="flex-1 text-center">
                                        <div className="border-b border-black h-8 mb-2"></div>
                                        <p className="text-sm font-bold uppercase print:text-xs">Election Committee Chair</p>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="border-b border-black h-8 mb-2"></div>
                                        <p className="text-sm font-bold uppercase print:text-xs">School Administrator</p>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="border-b border-black h-8 mb-2"></div>
                                        <p className="text-sm font-bold uppercase print:text-xs">Student Representative</p>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            {/* Bottom Spacer - Repeats on every page */}
                            <div className="h-0 print:h-[20mm]"></div>
                        </td>
                    </tr>
                </tfoot>
            </table>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full text-center text-[10px] text-gray-400 p-4 print:text-gray-600 print:pb-6 print:text-[9px]">
                Generated by SGLL Voting System on {new Date().toLocaleString()}
            </div>

            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { margin: 0; -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
