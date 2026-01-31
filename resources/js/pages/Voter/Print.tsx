import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { VoterProps } from '@/types/voter';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

interface Signatory {
    id: number;
    name: string;
    position: string;
    description: string | null;
}

interface Props {
    voters: VoterProps[];
    filters: any;
    signatories: Signatory[];
}

export default function Print({ voters, filters, signatories }: Props) {
    const { system_settings } = usePage<SharedData>().props;

    useEffect(() => {
        // Optional: Auto-print when loaded
        // window.print();
    }, []);

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 max-w-[300mm] mx-auto font-sans">
            <Head title="Print Voters" />

            {/* Print controls - hidden when printing */}
            <div className="print:hidden mb-8 flex justify-end items-center border-b pb-4">
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print List
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
                                            OFFICIAL VOTER LIST
                                        </h2>
                                        <div className="text-sm font-bold uppercase mt-1 text-gray-600 flex flex-col gap-1">
                                            {filters.event_name && <span>Event: {filters.event_name}</span>}
                                            <div className="flex gap-4">
                                                {filters.year_level_name && <span>Level: {filters.year_level_name}</span>}
                                                {filters.year_level_name && !filters.section_name && <span>Section: All Sections</span>}
                                                {filters.section_name && <span>Section: {filters.section_name}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right pt-2">
                                        <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="w-full">
                                    <table className="w-full text-xs text-left border-collapse border border-black">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-black">
                                                <th className="p-2 border border-black font-bold uppercase w-[30%]">Name</th>
                                                <th className="p-2 border border-black font-bold uppercase w-[15%]">LRN</th>
                                                <th className="p-2 border border-black font-bold uppercase w-[15%]">Username</th>
                                                <th className="p-2 border border-black font-bold uppercase w-[15%]">Year Level</th>
                                                <th className="p-2 border border-black font-bold uppercase w-[15%]">Section</th>
                                                <th className="p-2 border border-black font-bold uppercase w-[10%]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {voters.length > 0 ? (
                                                voters.map((voter, index) => (
                                                    <tr key={index} className="border-b border-black last:border-b-0">
                                                        <td className="p-1 px-2 border border-black font-medium uppercase">{voter.name}</td>
                                                        <td className="p-1 px-2 border border-black">{voter.lrn_number}</td>
                                                        <td className="p-1 px-2 border border-black font-mono">{voter.username}</td>
                                                        <td className="p-1 px-2 border border-black uppercase">{voter.year_level.name}</td>
                                                        <td className="p-1 px-2 border border-black uppercase">{voter.year_section.name}</td>
                                                        <td className="p-1 px-2 border border-black text-center uppercase">
                                                            {voter.is_active ? 'Active' : 'Inactive'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="py-4 text-center border border-black text-gray-500 italic">
                                                        No voters found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Signatories Section */}
                                <div className="mt-8 break-inside-avoid print:mt-8 px-8">
                                    <p className="text-xs font-bold uppercase mb-8">Certified Correct:</p>

                                    <div className="grid grid-cols-3 gap-8 gap-y-12">
                                        {signatories && signatories.length > 0 ? (
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
                                            <div className="text-center break-inside-avoid px-4">
                                                <div className="border-b border-black w-full mb-2 mt-6"></div>
                                                <p className="text-xs uppercase font-bold">Election Committee Head</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Section */}
                                <div className="mt-8 pt-4 border-t text-[10px] text-gray-400 flex justify-between break-inside-avoid print:mt-12">
                                    <span>Generated by {system_settings.name || 'System'}</span>
                                    <span>Date Printed: {new Date().toLocaleString()}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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
        </div>
    );
}
