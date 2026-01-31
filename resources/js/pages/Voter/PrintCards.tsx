import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { VoterProps } from '@/types/voter';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

interface Props {
    voters: VoterProps[];
    filters: any;
}

export default function PrintCards({ voters, filters }: Props) {
    const { system_settings } = usePage<SharedData>().props;

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 font-sans max-w-[210mm] mx-auto">
            <Head title="Print Voter Cards" />

             <div className="print:hidden mb-8 flex justify-end items-center border-b pb-4 gap-2">
                <p className="text-sm text-gray-500 mr-auto">
                    Printing {voters.length} cards. Recommended: A4 Paper, Portrait, No Margins.
                </p>
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print Cards
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 print:gap-2 print:m-0">
                {voters.map((voter) => (
                    <div key={voter.id} className="border border-dashed border-gray-400 p-4 rounded-sm break-inside-avoid relative page-break-inside-avoid">
                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
                             <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                                {system_settings.logo ? (
                                    <img src={system_settings.logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full bg-emerald-600 flex items-center justify-center rounded-full text-white">
                                        <AppLogoIcon className="w-5 h-5 fill-current" />
                                    </div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-sm uppercase leading-tight truncate">{system_settings.name || 'Voting System'}</h3>
                                <p className="text-xs text-gray-500 uppercase">Official Voter Credential</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-[80px_1fr]">
                                <span className="font-semibold text-gray-600">Name:</span>
                                <span className="font-bold uppercase truncate">{voter.name}</span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr]">
                                <span className="font-semibold text-gray-600">LRN:</span>
                                <span className="font-mono">{voter.lrn_number}</span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr]">
                                <span className="font-semibold text-gray-600">Username:</span>
                                <span className="font-mono font-bold text-base bg-gray-100 px-1 rounded inline-block">{voter.username}</span>
                            </div>
                             <div className="grid grid-cols-[80px_1fr] items-end pt-1">
                                <span className="font-semibold text-gray-600">Password:</span>
                                <div className="border-b-2 border-gray-300 h-6 w-full"></div>
                            </div>
                        </div>
                        
                        <div className="mt-3 pt-2 text-[10px] text-gray-400 text-center uppercase border-t border-gray-100">
                             {voter.event?.name} • {voter.year_level?.name} - {voter.year_section?.name}
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @media print {
                    @page {
                        margin: 0.5cm;
                    }
                    .page-break-inside-avoid {
                        break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
