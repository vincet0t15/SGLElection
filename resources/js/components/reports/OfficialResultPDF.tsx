import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';

interface Signatory {
    id: number;
    name: string;
    position: string;
    description: string | null;
}

interface SystemSettings {
    logo: string | null;
    name: string | null;
}

interface Props {
    event: EventProps;
    positions: PositionProps[];
    signatories: Signatory[];
    stats: {
        total_voters: number; // votes cast
        total_assigned_voters: number; // registered
        voted_count: number; // same as total_voters usually in stats prop of Show
    };
    system_settings: SystemSettings;
    type?: 'official' | 'winners';
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        fontSize: 11,
    },
    headerTable: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    logoContainer: {
        width: 100,
        paddingRight: 15,
        alignItems: 'flex-end',
    },
    logo: {
        width: 60,
        height: 60,
        objectFit: 'contain',
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Times-Roman',
    },
    schoolName: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
        color: '#006400',
        textTransform: 'uppercase',
        marginVertical: 4,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    reportTitle: {
        fontSize: 16,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    subTitle: {
        fontSize: 12,
        marginBottom: 2,
    },
    statsTable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statsItem: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
    },
    positionContainer: {
        marginBottom: 15,
    },
    positionHeader: {
        backgroundColor: '#f3f4f6',
        padding: 4,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        borderWidth: 1,
        borderColor: '#000',
        borderBottomWidth: 0,
        fontSize: 11,
    },
    table: {
        width: '100%',
        borderLeftWidth: 1,
        borderLeftColor: '#000',
        borderRightWidth: 1,
        borderRightColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        minHeight: 20,
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#f3f4f6',
    },
    tableCell: {
        padding: 4,
        borderRightWidth: 1,
        borderRightColor: '#000',
        fontSize: 10,
    },
    tableCellLast: {
        borderRightWidth: 0,
    },
    // Columns
    colCandidate: { width: '40%' },
    colParty: { width: '30%' },
    colVotes: { width: '10%', textAlign: 'center' },
    colPercent: { width: '10%', textAlign: 'center' },
    colStatus: { width: '10%', textAlign: 'center' },

    signatoriesSection: {
        marginTop: 30,
        textAlign: 'center',
    },
    certificationText: {
        marginBottom: 15,
        fontSize: 10,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    signatoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    signatoryBox: {
        width: '33%',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    signatoryLine: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        width: '80%',
        marginBottom: 5,
    },
    signatoryName: {
        fontFamily: 'Times-Bold',
        fontSize: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    signatoryPosition: {
        fontSize: 9,
        color: '#4b5563',
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        fontSize: 9,
        textAlign: 'center',
        color: '#9ca3af',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    statusWinner: { color: '#047857', fontFamily: 'Times-Bold' },
    statusTie: { color: '#dc2626', fontSize: 9 },
    statusTieBreak: { color: '#2563eb', fontSize: 9 },
    abstentionRow: {
        backgroundColor: '#f9fafb',
    },
});

export default function OfficialResultPDF({
    event,
    positions,
    signatories,
    stats,
    system_settings,
    type = 'official'
}: Props) {
    const logoUrl = system_settings.logo
        ? (system_settings.logo.startsWith('http') || system_settings.logo.startsWith('data:')
            ? system_settings.logo
            : `/storage/${system_settings.logo.replace(/^\/?storage\//, '')}`)
        : null;

    // Use stats.voted_count (from Show props) which usually maps to actual voters in report
    const actualVoters = stats.voted_count;
    const registeredVoters = stats.total_assigned_voters;
    const turnout = registeredVoters > 0 ? Math.round((actualVoters / registeredVoters) * 100) : 0;

    const date = new Date(event.dateTime_start).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Document>
            <Page size="LEGAL" style={styles.page}>
                {/* Header */}
                <View style={styles.headerTable}>
                    <View style={styles.logoContainer}>
                        {logoUrl ? (
                            <Image src={logoUrl} style={styles.logo} />
                        ) : (
                            <Svg viewBox="0 0 40 42" style={styles.logo}>
                                <Path fill="#059669" fillRule="evenodd" d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z" />
                            </Svg>
                        )}
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>REPUBLIC OF THE PHILIPPINES</Text>
                        <Text style={styles.headerText}>DEPARTMENT OF EDUCATION</Text>
                        <Text style={styles.headerText}>MIMAROPA Region</Text>
                        <Text style={styles.headerText}>Schools Division of Palawan</Text>
                        <Text style={styles.schoolName}>SAN VICENTE NATIONAL HIGH SCHOOL</Text>
                        <Text style={[styles.headerText, { fontStyle: 'italic' }]}>Poblacion, San Vicente, Palawan</Text>
                    </View>
                    <View style={{ width: 100 }} />
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.reportTitle}>
                        OFFICIAL RESULT {type === 'winners' ? '(WINNERS ONLY)' : ''}
                    </Text>
                    <Text style={styles.subTitle}>{event.name}</Text>
                    <Text style={styles.subTitle}>Date of Election: {date}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsTable}>
                    <Text style={styles.statsItem}>Total Registered Voters: {registeredVoters.toLocaleString()}</Text>
                    <Text style={styles.statsItem}>Total Votes Cast: {actualVoters.toLocaleString()}</Text>
                    <Text style={styles.statsItem}>Voter Turnout: {turnout}%</Text>
                </View>

                {/* Positions */}
                {positions.map((position) => {
                    const lastWinnerIndex = position.max_votes - 1;
                    const firstLoserIndex = position.max_votes;
                    
                    const lastWinnerVotes = position.candidates[lastWinnerIndex]?.votes_count || 0;
                    const firstLoserVotes = position.candidates[firstLoserIndex]?.votes_count || 0;
                    
                    const isTieForLastSpot = position.candidates.length > position.max_votes &&
                        lastWinnerVotes > 0 &&
                        lastWinnerVotes === firstLoserVotes;

                    // Filter candidates if winners only
                    const displayedCandidates = type === 'winners' 
                        ? position.candidates.filter((candidate, index) => {
                             const votes = candidate.votes_count || 0;
                             let isTied = isTieForLastSpot && votes === lastWinnerVotes;
                             if (candidate.is_tie_breaker_winner) isTied = false;
                             else if (isTieForLastSpot && votes === lastWinnerVotes) {
                                 const hasTieBreakerWinner = position.candidates.some(c => c.votes_count === lastWinnerVotes && c.is_tie_breaker_winner);
                                 if (hasTieBreakerWinner) isTied = false;
                             }
                             const isWinner = (index < position.max_votes && votes > 0) || candidate.is_tie_breaker_winner;
                             return isWinner || isTied;
                        })
                        : position.candidates;

                    if (type === 'winners' && displayedCandidates.length === 0) return null;

                    return (
                        <View key={position.id} style={styles.positionContainer} wrap={false}>
                            <Text style={styles.positionHeader}>
                                {position.name} (Vote for {position.max_votes})
                            </Text>
                            <View style={styles.table}>
                                <View style={[styles.tableRow, styles.tableHeader]}>
                                    <Text style={[styles.tableCell, styles.colCandidate, { fontFamily: 'Times-Bold' }]}>CANDIDATE</Text>
                                    <Text style={[styles.tableCell, styles.colParty, { fontFamily: 'Times-Bold' }]}>PARTYLIST</Text>
                                    <Text style={[styles.tableCell, styles.colVotes, { fontFamily: 'Times-Bold' }]}>VOTES</Text>
                                    <Text style={[styles.tableCell, styles.colPercent, { fontFamily: 'Times-Bold' }]}>%</Text>
                                    <Text style={[styles.tableCell, styles.colStatus, styles.tableCellLast, { fontFamily: 'Times-Bold' }]}>STATUS</Text>
                                </View>

                                {displayedCandidates.map((candidate, index) => {
                                    // Need to find original index for accurate winner calculation if array is filtered?
                                    // Actually, position.candidates is sorted by votes desc, tie_breaker desc.
                                    // So index in original array matters.
                                    const originalIndex = position.candidates.findIndex(c => c.id === candidate.id);
                                    
                                    const votes = candidate.votes_count || 0;
                                    const percentage = actualVoters > 0 
                                        ? ((votes / actualVoters) * 100).toFixed(2) 
                                        : "0.00";

                                    let isTied = isTieForLastSpot && votes === lastWinnerVotes;
                                    if (candidate.is_tie_breaker_winner) {
                                        isTied = false;
                                    } else if (isTieForLastSpot && votes === lastWinnerVotes) {
                                        const hasTieBreakerWinner = position.candidates.some(c => c.votes_count === lastWinnerVotes && c.is_tie_breaker_winner);
                                        if (hasTieBreakerWinner) {
                                            isTied = false;
                                        }
                                    }

                                    const isWinner = (originalIndex < position.max_votes && votes > 0) || candidate.is_tie_breaker_winner;

                                    return (
                                        <View key={candidate.id} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, styles.colCandidate, { textTransform: 'uppercase' }]}>
                                                {originalIndex + 1}. {candidate.name}
                                            </Text>
                                            <Text style={[styles.tableCell, styles.colParty, { textTransform: 'uppercase' }]}>
                                                {candidate.partylist?.name || 'INDEPENDENT'}
                                            </Text>
                                            <Text style={[styles.tableCell, styles.colVotes]}>
                                                {votes.toLocaleString()}
                                            </Text>
                                            <Text style={[styles.tableCell, styles.colPercent]}>
                                                {percentage}%
                                            </Text>
                                            <View style={[styles.tableCell, styles.colStatus, styles.tableCellLast]}>
                                                {isWinner && <Text style={styles.statusWinner}>WINNER</Text>}
                                                {candidate.is_tie_breaker_winner && <Text style={styles.statusTieBreak}>(TIE BREAK)</Text>}
                                                {isTied && <Text style={styles.statusTie}>(TIE)</Text>}
                                            </View>
                                        </View>
                                    );
                                })}

                                {type !== 'winners' && (
                                    <View style={[styles.tableRow, styles.abstentionRow]}>
                                        <Text style={[styles.tableCell, { width: '70%', textAlign: 'right', fontFamily: 'Times-Bold', textTransform: 'uppercase' }]}>
                                            Abstentions / Undervotes
                                        </Text>
                                        <Text style={[styles.tableCell, styles.colVotes]}>
                                            {(actualVoters - (position.votes_cast_count || 0)).toLocaleString()}
                                        </Text>
                                        <Text style={[styles.tableCell, styles.colPercent]}>
                                            {actualVoters > 0 
                                                ? (((actualVoters - (position.votes_cast_count || 0)) / actualVoters) * 100).toFixed(2)
                                                : "0.00"}%
                                        </Text>
                                        <Text style={[styles.tableCell, styles.colStatus, styles.tableCellLast]}></Text>
                                    </View>
                                )}
                                
                                {displayedCandidates.length === 0 && type !== 'winners' && (
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { width: '100%', textAlign: 'center', fontStyle: 'italic' }]}>
                                            No candidates for this position.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}

                {/* Signatories */}
                <View style={styles.signatoriesSection} wrap={false}>
                    <Text style={styles.certificationText}>Certified Correct:</Text>

                    <View style={styles.signatoriesGrid}>
                        {signatories.map((signatory) => (
                            <View key={signatory.id} style={styles.signatoryBox}>
                                <View style={{ height: 30 }} />
                                <View style={styles.signatoryLine} />
                                <Text style={styles.signatoryName}>{signatory.name}</Text>
                                <Text style={styles.signatoryPosition}>{signatory.position}</Text>
                            </View>
                        ))}
                        {signatories.length === 0 && (
                             <>
                                <View style={styles.signatoryBox}>
                                    <View style={{ height: 30 }} />
                                    <View style={styles.signatoryLine} />
                                    <Text style={styles.signatoryName}>Election Committee Head</Text>
                                </View>
                                <View style={styles.signatoryBox}>
                                    <View style={{ height: 30 }} />
                                    <View style={styles.signatoryLine} />
                                    <Text style={styles.signatoryName}>School Administrator</Text>
                                </View>
                             </>
                        )}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Generated by {system_settings.name || 'System'}</Text>
                    <Text>Date Printed: {new Date().toLocaleString()}</Text>
                </View>
            </Page>
        </Document>
    );
}
