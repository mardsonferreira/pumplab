import { cn } from "@/utils/cn";
import { MdCheckCircle } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useState, useEffect, useMemo, useRef } from "react";

import { Tooltip } from "@/components/ui/Tooltip";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    containerClassName?: string;
    className?: string;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({ id, label, value, onChange, className, containerClassName, ...props }: TextareaProps) {
    const [initialValue, setInitialValue] = useState(value || "");
    const hasBeenEdited = useMemo(() => initialValue !== (value || ""), [initialValue, value]);
    const hasInitialized = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
    }

    // Set initialValue only once on mount
    useEffect(() => {
        if (!hasInitialized.current) {
            setInitialValue(value || "");
            hasInitialized.current = true;
        }
    }, [value]);

    return (
        <div className={cn("relative", containerClassName)}>
            <label className="block text-sm font-medium text-foreground text-primary" htmlFor={id}>{label}</label>
            <textarea id={id} value={value} onChange={handleChange} className={cn(
                "w-full px-4 py-3 rounded-lg border border-neutral-800",
                "bg-neutral-900/50 text-foreground placeholder:text-neutral-500",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "resize-none min-h-[100px]",
                className
            )} {...props} />

            {hasBeenEdited && (
                <div className="absolute top-8 right-4 flex items-center gap-2">
                    <Tooltip content="Reverter">
                        <RiArrowGoBackLine className="w-4 h-4 text-error" />
                    </Tooltip>
                    <Tooltip content="Salvar">
                        <MdCheckCircle className="w-4 h-4 text-confirm" />
                    </Tooltip>
                </div>
            )}
        </div>
    )
}