import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { VoterProps } from '@/types/voter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
    voters: VoterProps[];
    filters: any;
}

export default function Print({ voters, filters }: Props) {
    useEffect(() => {
        // Optional: Auto-print when loaded
        // window.print();
    }, []);

    return (
        <div className="bg-white p-4 md:p-8 min-h-screen text-black font-sans">
            <Head title="Print Voters" />

            <div className="mb-6 text-center">
                <h1 className="text-xl font-bold uppercase tracking-wider mb-2">List of Voters</h1>
                <div className="text-xs text-gray-600 space-y-1 flex flex-wrap justify-center gap-4">
                    {filters.event_name && <p>Event: <span className="font-semibold">{filters.event_name}</span></p>}
                    {filters.year_level_name && <p>Year Level: <span className="font-semibold">{filters.year_level_name}</span></p>}
                    {filters.section_name && <p>Section: <span className="font-semibold">{filters.section_name}</span></p>}
                </div>
            </div>

            <div className="w-full">
                <table className="w-full text-xs text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border border-gray-400 font-bold uppercase w-[30%]">Name</th>
                            <th className="p-2 border border-gray-400 font-bold uppercase w-[15%]">LRN</th>
                            <th className="p-2 border border-gray-400 font-bold uppercase w-[10%]">Username</th>
                            <th className="p-2 border border-gray-400 font-bold uppercase w-[15%]">Year Level</th>
                            <th className="p-2 border border-gray-400 font-bold uppercase w-[15%]">Section</th>
                            <th className="p-2 border border-gray-400 font-bold uppercase w-[10%] print:hidden">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voters.length > 0 ? (
                            voters.map((voter, index) => (
                                <tr key={index} className="even:bg-gray-50">
                                    <td className="p-1 px-2 border border-gray-300 font-medium">{voter.name}</td>
                                    <td className="p-1 px-2 border border-gray-300">{voter.lrn_number}</td>
                                    <td className="p-1 px-2 border border-gray-300 font-mono">{voter.username}</td>
                                    <td className="p-1 px-2 border border-gray-300">{voter.year_level.name}</td>
                                    <td className="p-1 px-2 border border-gray-300">{voter.year_section.name}</td>
                                    <td className="p-1 px-2 border border-gray-300 text-center print:hidden">
                                        {voter.is_active ? 'Active' : 'Inactive'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-4 text-center border border-gray-300 text-gray-500">
                                    No voters found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-center print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print List
                </button>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0.5cm; size: auto; }
                    body { -webkit-print-color-adjust: exact; font-size: 10pt; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
}
