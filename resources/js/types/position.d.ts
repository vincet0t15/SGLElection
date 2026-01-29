import { EventProps } from "./event";

export interface PositionProps {
    id: number;
    name: string;
    max_votes: number;
    event_id: number;
    event: EventProps;
}

export type PositionType = {
    name: string;
    max_votes: number;
    event_id: number;
}