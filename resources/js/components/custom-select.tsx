import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options?: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    widthClass?: string;
    disabled?: boolean;
    tabIndex?: number;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    widthClass = 'w-full',
    disabled,
    tabIndex,
}: CustomSelectProps) {
    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
        >
            <SelectTrigger className={widthClass} tabIndex={tabIndex}>
                {value == '0' ? placeholder : <SelectValue />}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
