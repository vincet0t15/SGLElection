import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { EventProps } from '@/types/event';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

interface Signatory {
    id: number;
    name: string;
    position: string;
    description: string | null;
}

interface VoteActivityLog {
    id: number;
    created_at: string;
    ip_address: string;
    user_agent: string;
    voter: {
        id: number;
        name: string;
        username: string;
        year_level?: { name: string };
        year_section?: { name: string };
    };
}

interface Props {
    event: EventProps;
    logs: VoteActivityLog[];
    signatories: Signatory[];
}

export default function ReportsPrintAudit({ event, logs, signatories }: Props) {
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

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
    };

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 max-w-[300mm] mx-auto font-sans">
            <Head title={`Audit Log - ${event.name}`} />


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
                                            OFFICIAL AUDIT LOG REPORT
                                        </h2>
                                        <p className="text-sm font-bold uppercase mt-1 text-gray-600">
                                            {event.name}
                                        </p>
                                    </div>
                                    <div className="text-right pt-2">
                                        <p className="text-xs text-gray-500">Ref: {event.id}-{new Date().getFullYear()}</p>
                                    </div>
                                </div>


                                <div className="mb-8 text-sm leading-relaxed font-medium text-gray-800">
                                    <div className="grid grid-cols-[100px_1fr] gap-1">
                                        <div>Period:</div>
                                        <div>{formatDate(event.dateTime_start)} - {formatDate(event.dateTime_end)}</div>
                                        <div>Total Records:</div>
                                        <div>{logs.length.toLocaleString()}</div>
                                    </div>
                                </div>


                                <div className="mb-8">
                                    <table className="w-full text-xs border-collapse border border-black">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-black px-2 py-1 text-left w-32">Timestamp</th>
                                                <th className="border border-black px-2 py-1 text-left">Voter Name</th>
                                                <th className="border border-black px-2 py-1 text-left w-24">Voter ID</th>
                                                <th className="border border-black px-2 py-1 text-left">Year & Section</th>
                                                <th className="border border-black px-2 py-1 text-left w-32">IP Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="border border-black px-2 py-1 font-mono">
                                                        {formatDateTime(log.created_at)}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 uppercase">
                                                        {log.voter.name}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 font-mono">
                                                        {log.voter.username}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 uppercase">
                                                        {log.voter.year_level?.name} - {log.voter.year_section?.name}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 font-mono">
                                                        {log.ip_address}
                                                    </td>
                                                </tr>
                                            ))}
                                            {logs.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="border border-black px-2 py-4 text-center italic">
                                                        No voting activity recorded.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>


                                <div className="mt-16 break-inside-avoid print:mt-12">
                                    <p className="text-xs font-bold uppercase mb-8">Certified Correct:</p>

                                    <div className="grid grid-cols-2 gap-8 gap-y-12">
                                        {signatories.length > 0 ? (
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

                                            <>
                                                <div className="text-center flex-1">
                                                    <div className="border-b border-black w-full mb-2"></div>
                                                    <p className="text-xs uppercase font-bold">Election Committee Head</p>
                                                </div>
                                                <div className="text-center flex-1">
                                                    <div className="border-b border-black w-full mb-2"></div>
                                                    <p className="text-xs uppercase font-bold">School Administrator</p>
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
