import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { Printer, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ComelecPDF from '@/components/reports/ComelecPDF';

interface Signatory {
    id: number;
    name: string;
    position: string;
    description: string | null;
}

interface Partylist {
    id: number;
    name: string;
}

interface Props {
    event: EventProps;
    positions: PositionProps[];
    partylists: Partylist[];
    signatories: Signatory[];
    totalRegisteredVoters: number;
    totalVotesCast: number;
    voterTurnout: number;
    date: string;
}

export default function ReportsComelec({
    event,
    positions,
    partylists,
    signatories,
    totalRegisteredVoters,
    totalVotesCast,
    voterTurnout,
    date
}: Props) {
    const { system_settings } = usePage<SharedData>().props;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 max-w-[216mm] mx-auto font-sans text-[11px] leading-[1.3]">
            <Head title={`COMELEC Election Return - ${event.name}`} />

            {/* Print Controls */}
            <div className="print:hidden mb-8 flex justify-end items-center border-b pb-4 gap-2 relative z-10">
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    Print
                </button>

                {isClient && (
                    <PDFDownloadLink
                        document={
                            <ComelecPDF
                                event={event}
                                positions={positions}
                                partylists={partylists}
                                signatories={signatories}
                                totalRegisteredVoters={totalRegisteredVoters}
                                totalVotesCast={totalVotesCast}
                                voterTurnout={voterTurnout}
                                date={date}
                                system_settings={system_settings}
                            />
                        }
                        fileName={`comelec_form_${event.id}.pdf`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Export PDF
                                </>
                            )
                        }
                    </PDFDownloadLink>
                )}
            </div>

            <div className="relative z-10 print:w-full">
                {/* Header */}
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
                    <h2 className="m-0 text-[16px] font-bold uppercase" style={{ fontFamily: '"Old English Text MT", "Times New Roman", serif' }}>ELECTION RETURN</h2>
                    <p className="m-[5px_0] text-[12px]">{event.name}</p>
                    <p className="m-0 text-[12px]">Date of Election: {date}</p>
                </div>

                {/* Meta Info */}
                <table className="w-full mb-5 border-collapse">
                    <tbody>
                        <tr>
                            <td className="p-1 font-bold">Total Registered Voters: {totalRegisteredVoters.toLocaleString()}</td>
                            <td className="p-1 font-bold">Total Votes Cast: {totalVotesCast.toLocaleString()}</td>
                            <td className="p-1 font-bold">Voter Turnout: {voterTurnout}%</td>
                        </tr>
                    </tbody>
                </table>

                {/* Positions */}
                {positions.map((position) => (
                    <div
                        key={position.id}
                        className="mb-5"
                        style={{ pageBreakInside: 'avoid' }}
                    >
                        <div
                            className="bg-gray-100 p-1 font-bold uppercase border border-black"
                            style={{ pageBreakAfter: 'avoid' }}
                        >
                            {position.name} (Vote for {position.max_votes})
                        </div>
                        <table className="w-full border-collapse -mt-[1px]">
                            <thead>
                                <tr>
                                    <th className="border border-black p-1 text-center bg-gray-50 w-1/2">CANDIDATE NAME</th>
                                    <th className="border border-black p-1 text-center bg-gray-50 w-[30%]">PARTY / AFFILIATION</th>
                                    <th className="border border-black p-1 text-center bg-gray-50 w-[20%]">VOTES OBTAINED</th>
                                </tr>
                            </thead>

                            <tbody>
                                {position.candidates.map((candidate) => (
                                    <tr
                                        key={candidate.id}
                                        style={{ pageBreakInside: 'avoid' }}
                                    >
                                        <td className="border border-black p-1 uppercase">
                                            {candidate.name}
                                        </td>
                                        <td className="border border-black p-1 uppercase">
                                            {candidate.partylist?.name || 'INDEPENDENT'}
                                        </td>
                                        <td className="border border-black p-1 text-center font-bold">
                                            {candidate.votes_count?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}


                {/* Footer / Signatories */}
                <div className="mt-10 text-center break-inside-avoid">
                    <p className="mb-8">
                        WE HEREBY CERTIFY that the foregoing is a true and correct statement of the votes obtained by each candidate in the election.
                    </p>

                    <div className="w-full mt-12">
                        <div className="grid grid-cols-3 gap-y-10 gap-x-4">
                            {signatories.map((signatory) => (
                                <div key={signatory.id} className="text-center pt-8">
                                    <div className="border-t border-black w-[80%] mx-auto mb-1"></div>
                                    <div className="font-bold uppercase text-[11px]">{signatory.name}</div>
                                    <div className="text-[10px]">{signatory.position}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden print:block fixed bottom-0 left-0 right-0 text-[10px] text-center">
                    Generated by Voting System • {new Date().toLocaleDateString()}
                </div>

            </div>

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
        </div>
    );
}
