import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { VoterProps } from '@/types/voter';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { Scissors } from 'lucide-react';

interface Props {
    voters: VoterProps[];
    filters: any;
}

export default function PrintCards({ voters, filters }: Props) {
    const { system_settings } = usePage<SharedData>().props;

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 font-sans max-w-[297mm] mx-auto print:max-w-none">
            <Head title="Print Credential Slips" />

            <div className="print:hidden mb-8 flex flex-col sm:flex-row justify-between items-center border-b pb-4 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Voter Credential Slips</h1>
                    <p className="text-sm text-gray-500">
                        Printing {voters.length} slips.
                        <span className="block mt-1 text-emerald-600 font-medium">
                            Tip: Use "Landscape" orientation for best fit (3x5 grid).
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print Slips
                </button>
            </div>

            <div className="grid grid-cols-3 gap-0 border-t border-l border-gray-300 print:w-full">
                {voters.map((voter) => (
                    <div key={voter.id} className="border-b border-r border-gray-300 p-3 break-inside-avoid relative page-break-inside-avoid h-[60mm] flex flex-col justify-between">


                        <div className="absolute top-0 right-0 p-1 opacity-20 print:opacity-10">
                            <Scissors size={10} />
                        </div>


                        <div className="flex items-start gap-2 mb-2">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center pt-1">
                                {system_settings.logo ? (
                                    <img src={system_settings.logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full bg-emerald-600 flex items-center justify-center rounded-full text-white">
                                        <AppLogoIcon className="w-4 h-4 fill-current" />
                                    </div>
                                )}
                            </div>
                            <div className="overflow-hidden leading-none pt-0.5">
                                <h3 className="font-bold text-[10px] uppercase truncate w-full">{system_settings.name || 'Voting System'}</h3>
                                <p className="text-[9px] text-gray-500 uppercase font-medium">Voter Credential</p>
                                <p className="text-[8px] text-gray-400 truncate max-w-[150px]">{voter.event?.name}</p>
                            </div>
                        </div>


                        <div className="space-y-1.5 text-[11px] flex-1">
                            <div>
                                <div className="text-[9px] text-gray-500 uppercase tracking-wider">Name</div>
                                <div className="font-bold uppercase truncate leading-tight">{voter.name}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-wider">Username</div>
                                    <div className="font-mono font-bold bg-gray-50 px-1 rounded inline-block">{voter.username}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-wider">Password</div>
                                    <div className="font-mono font-bold bg-gray-50 px-1 rounded inline-block">{voter.username}</div>
                                </div>
                            </div>
                        </div>


                        <div className="mt-2 pt-1 text-[9px] text-gray-400 flex justify-between items-center border-t border-gray-100">
                            <span className="truncate max-w-[60%]">{voter.year_level?.name} - {voter.year_section?.name}</span>
                            <span className="font-mono">{voter.lrn_number}</span>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0.5cm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                    }
                    .page-break-inside-avoid {
                        break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
