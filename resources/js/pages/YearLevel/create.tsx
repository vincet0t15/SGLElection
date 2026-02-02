import { Button } from "@/components/ui/button"
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { YearLevelType } from "@/types/yearlevel";
import { ChangeEventHandler, FormEventHandler, SubmitEventHandler } from "react";
import yearLevel from "@/routes/year-level";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export function YearLevelCreateDialog({ open, setOpen }: Props) {
    const { data, setData, post, reset, processing, errors } = useForm<YearLevelType>({
        name: '',
    })

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(yearLevel.store().url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                // setOpen(false); // Do not close modal
                reset();
            },
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Year Level</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Year Level</Label>
                            <Input id="name" name="name" placeholder="e.g. 1st Year" onChange={handleChange} value={data.name} />
                            <InputError message={errors.name} />
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Year Level
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
