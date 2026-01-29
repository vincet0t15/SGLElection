export interface EventProps {
    id: number;
    name: string;
    dateTime_start: string;
    dateTime_end: string;
    location: string;
    description: string;
    is_active: boolean;
}

export type EventType = {
    name: string;
    dateTime_start: string;
    dateTime_end: string;
    location: string;
    description: string;
    is_active: boolean;
}