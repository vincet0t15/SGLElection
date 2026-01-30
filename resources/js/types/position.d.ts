import { CandidateProps } from "./candidate";
import { EventProps } from "./event";

export interface PositionProps {
    id: number;
    name: string;
    max_votes: number;
    event_id: number;
    event: EventProps;
    candidates: CandidateProps[];
    year_levels?: { id: number; name: string }[];
}

export type PositionType = {
    name: string;
    max_votes: number;
    event_id: number;
    year_level_ids: number[];
}