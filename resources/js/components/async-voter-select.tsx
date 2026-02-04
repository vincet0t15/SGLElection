import { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface Voter {
    id: number;
    name: string;
    username?: string;
    year_level_id: number;
    year_section_id: number;
}

interface AsyncVoterSelectProps {
    eventId?: number | string;
    value?: number | null;
    onChange: (voter: Voter | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    initialVoterName?: string;
}

export default function AsyncVoterSelect({
    eventId,
    value,
    onChange,
    placeholder = "Select a voter...",
    disabled,
    className,
    initialVoterName
}: AsyncVoterSelectProps) {
    const [open, setOpen] = useState(false);
    const [voters, setVoters] = useState<Voter[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedLabel, setSelectedLabel] = useState<string>('');

    const observerTarget = useRef<HTMLDivElement>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(inputValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue]);

    // Initial fetch or fetch on search/event change
    useEffect(() => {
        if (open) {
            setPage(1);
            setVoters([]);
            setHasMore(true);
            fetchVoters(1, search);
        }
    }, [open, search, eventId]);

    // Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading]);

    // Fetch on page change
    useEffect(() => {
        if (page > 1 && open) {
            fetchVoters(page, search);
        }
    }, [page]);

    // Set initial label
    useEffect(() => {
        if (value && initialVoterName) {
             setSelectedLabel(initialVoterName);
        } else if (!value) {
            setSelectedLabel('');
        }
    }, [value, initialVoterName]);
    
    // Update label when selection matches loaded voters
    useEffect(() => {
        if (value) {
            const found = voters.find(v => v.id === value);
            if (found) {
                setSelectedLabel(found.name);
            }
        }
    }, [value, voters]);


    const fetchVoters = async (pageToFetch: number, searchQuery: string) => {
        if (!eventId && !searchQuery) return;

        setLoading(true);
        try {
            const response = await axios.get('/voter/search', {
                params: {
                    page: pageToFetch,
                    search: searchQuery,
                    event_id: eventId
                }
            });
            
            const newVoters = response.data.data;
            
            if (pageToFetch === 1) {
                setVoters(newVoters);
            } else {
                setVoters(prev => [...prev, ...newVoters]);
            }

            setHasMore(!!response.data.next_page_url);
        } catch (error) {
            console.error("Failed to fetch voters", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (voter: Voter | null) => {
        onChange(voter);
        setOpen(false);
        if (voter) {
            setSelectedLabel(voter.name);
        } else {
            setSelectedLabel('');
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
                    disabled={disabled}
                >
                    {selectedLabel || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="flex items-center border-b px-3">
                    <Input
                        placeholder="Search voters..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 px-0 shadow-none"
                    />
                </div>
                <ScrollArea className="h-[200px]">
                     <div className="p-1">
                        <div
                            className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                value === null ? "bg-accent text-accent-foreground" : ""
                            )}
                            onClick={() => handleSelect(null)}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    value === null ? "opacity-100" : "opacity-0"
                                )}
                            />
                            None (Create New)
                        </div>
                        {voters.map((voter) => (
                            <div
                                key={voter.id}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                    value === voter.id ? "bg-accent text-accent-foreground" : ""
                                )}
                                onClick={() => handleSelect(voter)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === voter.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {voter.name}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </div>
                        )}
                        {!loading && voters.length === 0 && search && (
                             <div className="p-2 text-sm text-muted-foreground text-center">No voters found.</div>
                        )}
                        <div ref={observerTarget} className="h-1" />
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
