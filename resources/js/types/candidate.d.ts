export interface CandidateProps {
    id: number;
    name: string;
    year_level_id: number;
    year_section_id: number;
    event_id: number;
    position_id: number;
    photo?: File[]
}

export type CandidateCreateProps = Omit<CandidateProps, 'id'>