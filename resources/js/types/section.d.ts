import { YearLevelProps } from "./yearlevel";

export interface YearSectionProps {
    id: number;
    year_level_id: number;
    name: string;
    yearLevel: YearLevelProps
}

export type YearSectionType = {
    year_level_id: number;
    name: string;
} 