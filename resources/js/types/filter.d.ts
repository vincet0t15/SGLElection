import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface FilterProps {
    search: string;
    event_id: number;
    year_level_id: number;
    year_section_id: number;
    partylist_id: number;
}

interface MyPageProps extends InertiaPageProps {
    filters: FilterProps;
}
