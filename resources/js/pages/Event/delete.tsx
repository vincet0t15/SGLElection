import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import event from '@/routes/event';
import yearLevel from '@/routes/year-level';
import { EventProps } from '@/types/event';
import { YearLevelProps } from '@/types/yearlevel';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    dataToDelete: EventProps | null;
}
export default function DeleteEvent({ open, setOpen, dataToDelete }: Props) {
    const deleteData = () => {
        if (!dataToDelete) {
            return;
        }
        router.delete(event.destroy(dataToDelete?.id).url, {
            preserveScroll: true,
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                setOpen(false);
            },
        });
    };
    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. It will permanently delete the data you selected{' '}
                            <strong className="text-orange-400 uppercase">{dataToDelete?.name}</strong> from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button size={'sm'} variant={'outline'} onClick={() => setOpen(false)} className="cursor-pointer rounded-sm">
                            Cancel
                        </Button>
                        <Button onClick={deleteData} size={'sm'} className="cursor-pointer rounded-sm">
                            Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
