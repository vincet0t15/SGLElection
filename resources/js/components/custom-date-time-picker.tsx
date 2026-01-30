"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export interface DatePickerTimeProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
}

export function DatePickerTime({ date, setDate }: DatePickerTimeProps) {
    const [open, setOpen] = React.useState(false)

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            setDate(undefined)
            return
        }

        const newDate = new Date(selectedDate)
        if (date) {
            newDate.setHours(date.getHours())
            newDate.setMinutes(date.getMinutes())
            newDate.setSeconds(date.getSeconds())
        }
        setDate(newDate)
        setOpen(false)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value
        if (!timeValue || !date) return

        const [hours, minutes] = timeValue.split(':').map(Number)
        const newDate = new Date(date)
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        setDate(newDate)
    }

    return (
        <FieldGroup className="w-full flex-row gap-2">
            <Field className="flex-1">
                <FieldLabel htmlFor="date-picker">Date</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className="w-full justify-between font-normal"
                        >
                            {date ? format(date, "PPP") : "Select date"}
                            <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            defaultMonth={date || new Date()}
                            onSelect={handleDateSelect}
                        />
                    </PopoverContent>
                </Popover>
            </Field>
            <Field className="w-32">
                <FieldLabel htmlFor="time-picker">Time</FieldLabel>
                <Input
                    type="time"
                    id="time-picker"
                    value={date ? format(date, "HH:mm") : ""}
                    onChange={handleTimeChange}
                    disabled={!date}
                    className="bg-background"
                />
            </Field>
        </FieldGroup>
    )
}
