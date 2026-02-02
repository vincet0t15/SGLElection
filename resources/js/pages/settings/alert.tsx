import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import position from '@/routes/position';
import { PositionProps } from '@/types/position';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    acceptImport: () => void;
    cancelImport: () => void;
}
export default function ImportDatabase({ open, setOpen, acceptImport, cancelImport }: Props) {

    const handleCancel = () => {
        setOpen(false);
        cancelImport();
    };
    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            'WARNING: This will overwrite the current database with the selected backup file. All current data will be lost. Are you sure you want to proceed?'{' '}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button size={'sm'} variant={'outline'} onClick={handleCancel} className="cursor-pointer rounded-sm">
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="cursor-pointer rounded-sm"
                            onClick={() => {
                                acceptImport();
                                setOpen(false);
                            }}
                        >
                            Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
