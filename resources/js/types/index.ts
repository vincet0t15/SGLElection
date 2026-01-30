export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    system_settings: {
        name: string;
        logo: string | null;
    };
    [key: string]: unknown;
};
