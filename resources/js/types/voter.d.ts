import { YearSectionProps } from "./section";
import { YearLevelProps } from "./yearlevel";

export interface VoterProps {
    id: number;
    name: string;
    username: string;
    password: string;
    lrn_number: string;
    year_level_id: number;
    year_section_id: number;
    is_active: boolean;
    yearLevel: YearLevelProps;
    yearSection: YearSectionProps;
}

export type VoterCreateProps = Omit<VoterProps, 'id' | 'is_active'>;