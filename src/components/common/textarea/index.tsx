import { cn } from "@/utils/cn";
import { MdCheckCircle } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useState, useCallback, useMemo } from "react";

import { Tooltip } from "@/components/ui/Tooltip";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    containerClassName?: string;
    labelClassName?: string;
    label?: string;
    value?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onChangeValue?: (string: string) => void;
}

export function Textarea({ id, label, value, icon, onChangeValue, containerClassName, labelClassName, disabled, ...props }: TextareaProps) {
    const [previousValue, setPreviousValue] = useState(value || "");
    const [currentValue, setCurrentValue] = useState(value || "");
    const hasBeenEdited = useMemo(() => previousValue.trim() !== currentValue.trim(), [previousValue, currentValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentValue(e.target.value);
    }

    const handleRevert = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentValue(previousValue);
    }, [previousValue]);

    const handleConfirm = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviousValue(currentValue);
        onChangeValue?.(currentValue);
    }, [previousValue, currentValue, onChangeValue]);

    return (
        <div className={cn("flex flex-col gap-2 relative", containerClassName)}>
            <div className="flex items-center gap-2">
                {icon && icon}
                <label className={cn("block text-sm font-medium text-foreground text-primary", labelClassName)} htmlFor={id}>{
                    label}
                </label>
            </div>

            <textarea id={id} value={currentValue} onChange={handleChange} disabled={disabled} className={cn(
                "w-full px-4 py-3 rounded-lg border border-neutral-800",
                "bg-neutral-900/50 text-foreground placeholder:text-neutral-500",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "resize-none",
                props.className
            )} {...props} />

            {hasBeenEdited && (
                <div className="absolute bottom-3 right-4 flex items-center gap-2">
                    <Tooltip content="Reverter">
                        <button type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleRevert(e)} disabled={disabled}>
                            <RiArrowGoBackLine className="w-4 h-4 text-warning" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Salvar">
                        <button type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleConfirm(e)} disabled={disabled}>
                            <MdCheckCircle className="w-4 h-4 text-confirm" />
                        </button>
                    </Tooltip>
                </div>
            )}
        </div>
    )
}