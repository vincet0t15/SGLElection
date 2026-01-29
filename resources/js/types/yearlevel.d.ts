import { YearSectionProps } from "./section";

export interface YearLevelProps {
    id: number;
    name: string;
    section: YearSectionProps[]
}

export type YearLevelType = {
    name: string;
}