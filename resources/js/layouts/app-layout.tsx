import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
// import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import type { AppLayoutProps } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { FlashMessageToaster } from '@/components/flash-message-toaster';


export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {/* <FlashMessageToaster /> */}
        {children}
        <Toaster position="top-right" />
    </AppLayoutTemplate>
);
