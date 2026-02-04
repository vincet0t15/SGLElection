import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { VoterProps } from '@/types/voter';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { Printer } from 'lucide-react';

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
        <div className="bg-white text-black min-h-screen p-8 print:p-0 max-w-[216mm] mx-auto font-sans text-[11px] leading-[1.3]">
            <Head title="Print Voters" />

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
                                <div className="h-[5mm]"></div>
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
                                                        {system_settings.name || 'SAN VICENTE NATIONAL HIGH SCHOOL'}
                                                    </div>
                                                    <div className="font-serif text-[12px] italic" style={{ fontFamily: '"Times New Roman", serif' }}>Poblacion, San Vicente, Palawan</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Title */}
                                <div className="text-center mb-5">
                                    <h2 className="m-0 text-[16px] font-bold uppercase" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>OFFICIAL VOTER LIST</h2>
                                    {filters.event_name && <p className="m-[5px_0] text-[12px]">{filters.event_name}</p>}
                                    <p className="m-0 text-[12px]">Date Printed: {new Date().toLocaleDateString()}</p>
                                </div>

                                {/* Meta Info */}
                                <table className="w-full mb-5 border-collapse">
                                    <tbody>
                                        <tr>
                                            <td className="p-1 font-bold">
                                                {filters.year_level_name && <span>Level: {filters.year_level_name}</span>}
                                            </td>
                                            <td className="p-1 font-bold text-center">
                                                {(filters.year_level_name && !filters.section_name) ? <span>Section: All Sections</span> : (filters.section_name && <span>Section: {filters.section_name}</span>)}
                                            </td>
                                            <td className="p-1 font-bold text-right">
                                                Total Voters: {voters.length}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="w-full">
                                    <table className="w-full text-left border-collapse border border-black table-fixed -mt-[1px]">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-black">
                                                <th className="p-1 px-2 border border-black font-bold uppercase w-[30%]">Name</th>
                                                <th className="p-1 px-2 border border-black font-bold uppercase w-[15%]">LRN</th>
                                                <th className="p-1 px-2 border border-black font-bold uppercase w-[15%]">Username</th>
                                                <th className="p-1 px-2 border border-black font-bold uppercase w-[15%]">Year Level</th>
                                                <th className="p-1 px-2 border border-black font-bold uppercase w-[15%]">Section</th>
                                                <th className="p-1 px-2 border border-black font-bold uppercase w-[10%] text-center">Status</th>
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

                                <div className="mt-16 break-inside-avoid print:mt-12">
                                    {/* <p className="text-xs font-bold uppercase mb-12">Certified Correct:</p> */}

                                    {/* <div className="grid grid-cols-3 gap-8 gap-y-12">
                                        {signatories && signatories.length > 0 ? (
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
                                    </div> */}

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
                    @page { margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    thead { display: table-header-group; }
                }
            `}</style>
        </div>
    );
}
