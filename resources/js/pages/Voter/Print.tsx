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
        <div className="bg-white p-8 min-h-screen text-black">
            <Head title="Print Voters" />
            
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">List of Voters</h1>
                <div className="text-sm text-gray-600 space-y-1">
                    {filters.event_name && <p>Event: <span className="font-semibold">{filters.event_name}</span></p>}
                    {filters.year_level_name && <p>Year Level: <span className="font-semibold">{filters.year_level_name}</span></p>}
                    {filters.section_name && <p>Section: <span className="font-semibold">{filters.section_name}</span></p>}
                </div>
            </div>

            <div className="w-full border border-gray-300">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow className="border-b border-gray-300">
                            <TableHead className="text-black font-bold border-r border-gray-300 h-10">Name</TableHead>
                            <TableHead className="text-black font-bold border-r border-gray-300 h-10">LRN</TableHead>
                            <TableHead className="text-black font-bold border-r border-gray-300 h-10">Username</TableHead>
                            <TableHead className="text-black font-bold border-r border-gray-300 h-10">Year Level</TableHead>
                            <TableHead className="text-black font-bold border-r border-gray-300 h-10">Section</TableHead>
                            <TableHead className="text-black font-bold h-10">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {voters.length > 0 ? (
                            voters.map((voter, index) => (
                                <TableRow key={index} className="border-b border-gray-300 text-sm">
                                    <TableCell className="py-2 border-r border-gray-300 font-medium">{voter.name}</TableCell>
                                    <TableCell className="py-2 border-r border-gray-300">{voter.lrn_number}</TableCell>
                                    <TableCell className="py-2 border-r border-gray-300 font-mono">{voter.username}</TableCell>
                                    <TableCell className="py-2 border-r border-gray-300">{voter.year_level.name}</TableCell>
                                    <TableCell className="py-2 border-r border-gray-300">{voter.year_section.name}</TableCell>
                                    <TableCell className="py-2">
                                        {voter.is_active ? 'Active' : 'Inactive'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                                    No voters found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-8 flex justify-center print:hidden">
                <button 
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    Print List
                </button>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0.5in; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
