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
import { YearLevelProps, YearLevelType } from "@/types/yearlevel";
import { ChangeEventHandler, SubmitEventHandler } from "react";
import yearLevel from "@/routes/year-level";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    yearlevel: YearLevelProps
}
export function YearLevelEditDialog({ open, setOpen, yearlevel }: Props) {
    const { data, setData, put, reset, processing, errors } = useForm<YearLevelType>({
        name: yearlevel.name,
    })

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        console.log(data);
        put(yearLevel.update(yearlevel.id).url, {
            preserveState: true,
            onSuccess: (response: { props: FlashProps }) => {
                setOpen(false);
                toast.success(response.props.flash?.success);
                reset();
            },
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Year Level</DialogTitle>
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
                            Update Year Level
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
