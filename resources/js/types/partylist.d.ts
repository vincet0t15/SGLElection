import { EventProps } from "./event";
import { CandidateProps } from "./candidate";

export interface PartylistProps {
    id: number;
    name: string;
    description: string;
    event_id: number;
    event: EventProps;
    candidates?: CandidateProps[];
}

export type PartylistType = {
    name: string;
    description: string;
    event_id: number;
}
