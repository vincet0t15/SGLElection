import { PositionProps } from "./position";

export interface EventProps {
    id: number;
    name: string;
    dateTime_start: string;
    dateTime_end: string;
    location: string;
    description: string;
    is_active: boolean;
    show_winner: boolean;
    positions: PositionProps[];
}

export type EventType = {
    name: string;
    dateTime_start: string;
    dateTime_end: string;
    location: string;
    description: string;
    is_active: boolean;
    show_winner: boolean;
}