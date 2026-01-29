import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import yearSection from '@/routes/year-section';
import { YearSectionProps } from '@/types/section';
import { router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    dataToDelete: YearSectionProps;
}
export default function DeleteYearSection({ open, setOpen, dataToDelete }: Props) {
    const [processing, setProcessing] = useState(false);
    const deleteData = () => {
        setProcessing(true);
        router.delete(yearSection.destroy(dataToDelete?.id).url, {
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

                        <Button onClick={deleteData} className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Delete Section
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
