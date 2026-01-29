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

} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { YearLevelProps, YearLevelType } from "@/types/yearlevel";
import { ChangeEventHandler, SubmitEventHandler } from "react";
import yearLevel from "@/routes/year-level";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { YearSectionType } from "@/types/section";
import yearSection from "@/routes/year-section";
import CustomSelect from "@/components/custom-select";
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    yearLevel: YearLevelProps | null;
}
export function YearSectionCreate({ open, setOpen, yearLevel }: Props) {

    const { data, setData, post, reset, processing, errors } = useForm<YearSectionType>({
        name: '',
        year_level_id: yearLevel?.id || 0,
    })


    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(yearSection.store().url, {
            preserveState: true,
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                setOpen(false);
                reset();
            },
        })
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Section</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>

                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Section</Label>
                            <Input id="name" name="name" placeholder="e.g. 1st Year" onChange={handleChange} />
                            <InputError message={errors.name} />
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Section
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
