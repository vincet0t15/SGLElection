import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface FlashProps {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export function FlashMessageToaster() {
    const { flash } = usePage<{ flash: FlashProps }>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    return null;
}
