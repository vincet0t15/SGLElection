import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';

// Register fonts if needed (optional, using standard fonts for now)
// Font.register({ family: 'Roboto', src: 'path/to/font.ttf' });

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

interface SystemSettings {
    logo: string | null;
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
    system_settings: SystemSettings;
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Times-Roman',
        fontSize: 11,
    },
    headerTable: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingBottom: 10,
        alignItems: 'center',
    },
    logoContainer: {
        width: '15%',
        alignItems: 'flex-end',
        paddingRight: 15,
    },
    logo: {
        width: 60,
        height: 60,
        objectFit: 'contain',
    },
    headerTextContainer: {
        width: '70%',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Times-Roman',
    },
    schoolName: {
        fontSize: 14,
        fontWeight: 'bold', // Times-Bold
        fontFamily: 'Times-Bold',
        color: '#006400', // DarkGreen
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
    metaTable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    metaItem: {
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
    },
    tableHeader: {
        backgroundColor: '#f9fafb',
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
    colCandidate: { width: '50%' },
    colParty: { width: '30%' },
    colVotes: { width: '20%', textAlign: 'center' },
    
    signatoriesSection: {
        marginTop: 30,
        textAlign: 'center',
    },
    certificationText: {
        marginBottom: 30,
        fontSize: 11,
        textAlign: 'center',
    },
    signatoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    signatoryBox: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 20,
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
    },
    signatoryPosition: {
        fontSize: 9,
        color: '#4b5563',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        fontSize: 9,
        textAlign: 'center',
        color: '#9ca3af',
    },
});

export default function ComelecPDF({
    event,
    positions,
    signatories,
    totalRegisteredVoters,
    totalVotesCast,
    voterTurnout,
    date,
    system_settings
}: Props) {
    const logoUrl = system_settings.logo 
        ? (system_settings.logo.startsWith('http') 
            ? system_settings.logo 
            : `/storage/${system_settings.logo}`)
        : null;

    return (
        <Document>
            <Page size="LEGAL" style={styles.page}>
                {/* Header */}
                <View style={styles.headerTable}>
                    <View style={styles.logoContainer}>
                        {logoUrl && (
                             <Image src={logoUrl} style={styles.logo} />
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
                    <View style={{ width: '15%' }} />
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.reportTitle}>ELECTION RETURN</Text>
                    <Text style={styles.subTitle}>{event.name}</Text>
                    <Text style={styles.subTitle}>Date of Election: {date}</Text>
                </View>

                {/* Meta Info */}
                <View style={styles.metaTable}>
                    <Text style={styles.metaItem}>Total Registered Voters: {totalRegisteredVoters.toLocaleString()}</Text>
                    <Text style={styles.metaItem}>Total Votes Cast: {totalVotesCast.toLocaleString()}</Text>
                    <Text style={styles.metaItem}>Voter Turnout: {voterTurnout}%</Text>
                </View>

                {/* Positions */}
                {positions.map((position) => (
                    <View key={position.id} style={styles.positionContainer} wrap={false}>
                        <Text style={styles.positionHeader}>
                            {position.name} (Vote for {position.max_votes})
                        </Text>
                        <View style={styles.table}>
                            {/* Table Header */}
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={[styles.tableCell, styles.colCandidate, { fontFamily: 'Times-Bold', textAlign: 'center' }]}>CANDIDATE NAME</Text>
                                <Text style={[styles.tableCell, styles.colParty, { fontFamily: 'Times-Bold', textAlign: 'center' }]}>PARTY / AFFILIATION</Text>
                                <Text style={[styles.tableCell, styles.colVotes, styles.tableCellLast, { fontFamily: 'Times-Bold' }]}>VOTES OBTAINED</Text>
                            </View>
                            {/* Table Body */}
                            {position.candidates.map((candidate) => (
                                <View key={candidate.id} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.colCandidate, { textTransform: 'uppercase' }]}>{candidate.name}</Text>
                                    <Text style={[styles.tableCell, styles.colParty, { textTransform: 'uppercase' }]}>{candidate.partylist?.name || 'INDEPENDENT'}</Text>
                                    <Text style={[styles.tableCell, styles.colVotes, styles.tableCellLast, { fontFamily: 'Times-Bold' }]}>{candidate.votes_count?.toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Signatories */}
                <View style={styles.signatoriesSection} wrap={false}>
                    <Text style={styles.certificationText}>
                        WE HEREBY CERTIFY that the foregoing is a true and correct statement of the votes obtained by each candidate in the election.
                    </Text>

                    <View style={styles.signatoriesGrid}>
                        {signatories.map((signatory) => (
                            <View key={signatory.id} style={styles.signatoryBox}>
                                <View style={{ height: 30 }} />
                                <View style={styles.signatoryLine} />
                                <Text style={styles.signatoryName}>{signatory.name}</Text>
                                <Text style={styles.signatoryPosition}>{signatory.position}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Generated by Voting System • {new Date().toLocaleDateString()}
                </Text>
            </Page>
        </Document>
    );
}
