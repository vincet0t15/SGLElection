import { EventProps } from "./event";
import { PositionProps } from "./position";
import { YearLevelProps } from "./yearlevel";
import { YearSectionProps } from "./section";
import { PartylistProps } from "./partylist";
import { VoterProps } from "./voter";

export interface CandidatePhoto {
    id: number;
    path: string;
}

export interface CandidateProps {
    id: number;
    name: string;
    year_level_id: number;
    year_section_id: number;
    event_id: number;
    position_id: number;
    partylist_id?: number | null;
    platform?: string | null;
    photo?: File[]
    event?: EventProps;
    position?: PositionProps;
    partylist?: PartylistProps;
    candidate_photos?: CandidatePhoto[];
    year_level?: YearLevelProps;
    year_section?: YearSectionProps;
    votes_count?: number;
    is_tie_breaker_winner?: boolean;
    voter_id?: number | null;
    voter?: VoterProps;
}

export type CandidateCreateProps = Omit<CandidateProps, 'id'>