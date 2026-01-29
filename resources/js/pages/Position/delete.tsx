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
import position from '@/routes/position';
import yearLevel from '@/routes/year-level';
import { EventProps } from '@/types/event';
import { PositionProps } from '@/types/position';
import { YearLevelProps } from '@/types/yearlevel';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedPosition: PositionProps;
}
export default function DeletePosition({ open, setOpen, selectedPosition }: Props) {
    const deleteData = () => {
        if (!selectedPosition) {
            return;
        }
        router.delete(position.destroy(selectedPosition?.id).url, {
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
                            <strong className="text-orange-400 uppercase">{selectedPosition?.name}</strong> from our servers.
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
