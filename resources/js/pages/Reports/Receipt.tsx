import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { EventProps } from '@/types/event';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { Printer } from 'lucide-react';

interface Voter {
    id: number;
    name: string;
    username: string;
}

interface Vote {
    id: number;
    created_at: string;
    candidate: {
        name: string;
        position: {
            name: string;
        };
        partylist?: {
            name: string;
        };
    };
}

interface Props {
    event: EventProps;
    voter: Voter;
    votes: Vote[];
}

export default function ReportsReceipt({ event, voter, votes }: Props) {
    const { system_settings } = usePage<SharedData>().props;

    useEffect(() => {
        // Optional: Auto-print
        // window.print();
    }, []);

    const voteDate = votes.length > 0
        ? new Date(votes[0].created_at).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
        })
        : 'N/A';

    const currentDate = new Date().toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    });

    return (
        <div className="bg-white text-[#333] min-h-screen p-8 print:p-0 max-w-[210mm] mx-auto font-sans text-[12px] leading-[1.4] relative overflow-hidden">
            <Head title={`Official Ballot Receipt - ${voter.username}`} />

            {/* Watermark */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 text-[100px] text-gray-100 font-bold z-0 pointer-events-none select-none print:absolute">
                OFFICIAL
            </div>

            {/* Print Controls */}
            <div className="print:hidden mb-8 flex justify-end items-center border-b pb-4 gap-2 relative z-10">
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    Print / Save as PDFzzzzzzzzzzzzzzz
                </button>
            </div>

            <div className="relative z-10 print:w-full">
                {/* Header */}
                <div className="mb-5 border-b-2 border-black pb-2 flex justify-center">
                    <table className="border-collapse border-none">
                        <tbody>
                            <tr>
                                <td className="align-top pr-4 border-none !p-0">
                                    {system_settings?.logo ? (
                                        <img
                                            src={system_settings.logo}
                                            alt="Logo"
                                            className="h-20 w-auto object-contain"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-emerald-600 flex items-center justify-center rounded-full text-white">
                                            <AppLogoIcon className="w-10 h-10 fill-current" />
                                        </div>
                                    )}
                                </td>
                                <td className="align-middle text-center border-none !p-0">
                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Times New Roman", serif' }}>REPUBLIC OF THE PHILIPPINES</div>
                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Times New Roman", serif' }}>DEPARTMENT OF EDUCATION</div>
                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Times New Roman", serif' }}>MIMAROPA Region</div>
                                    <div className="font-serif text-[13px]" style={{ fontFamily: '"Times New Roman", serif' }}>Schools Division of Palawan</div>
                                    <div className="font-serif text-[16px] font-bold text-[#006400] uppercase my-1" style={{ fontFamily: '"Times New Roman", serif' }}>
                                        {system_settings?.name || 'SAN VICENTE NATIONAL HIGH SCHOOL'}
                                    </div>
                                    <div className="font-serif text-[12px] italic" style={{ fontFamily: '"Times New Roman", serif' }}>Poblacion, San Vicente, Palawan</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Receipt Details */}
                <div className="text-center mb-5">
                    <div className="font-bold text-[14px] uppercase">Official Ballot Receipt</div>
                    <div className="text-[12px] mt-[2px] uppercase">{event.name}</div>
                    <div className="text-[10px] text-[#666] mt-[5px]">Ref: {voter.username}</div>
                </div>

                <div className="mb-5 w-full">
                    <div className="mb-[5px]">
                        <span className="font-bold inline-block w-[100px]">Voter Name:</span> {voter.name}
                    </div>
                    <div className="mb-[5px]">
                        <span className="font-bold inline-block w-[100px]">Voter ID:</span> {voter.username}
                    </div>
                    <div className="mb-[5px]">
                        <span className="font-bold inline-block w-[100px]">Date Voted:</span> {voteDate}
                    </div>
                    <div className="mb-[5px]">
                        <span className="font-bold inline-block w-[100px]">Location:</span> {event.location || 'Online'}
                    </div>
                </div>

                {/* Votes Table */}
                <table className="w-full border-collapse mb-5">
                    <thead>
                        <tr>
                            <th className="border border-[#ddd] p-2 text-left bg-[#f5f5f5] font-bold">Position</th>
                            <th className="border border-[#ddd] p-2 text-left bg-[#f5f5f5] font-bold">Candidate</th>
                            <th className="border border-[#ddd] p-2 text-left bg-[#f5f5f5] font-bold">Party List</th>
                        </tr>
                    </thead>
                    <tbody>
                        {votes.map((vote) => (
                            <tr key={vote.id}>
                                <td className="border border-[#ddd] p-2 text-left">{vote.candidate.position.name}</td>
                                <td className="border border-[#ddd] p-2 text-left">{vote.candidate.name}</td>
                                <td className="border border-[#ddd] p-2 text-left">
                                    {vote.candidate.partylist?.name || 'Independent'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer */}
                <div className="text-center mt-[30px] text-[10px] text-[#666] border-t border-[#ddd] pt-[10px]">
                    <p>This document is a system-generated receipt. Valid only for the specified election event.</p>
                    <p>Generated on: {currentDate}</p>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 10mm; size: auto; }
                    body { margin: 0; -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
