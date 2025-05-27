

"use client"

import * as Popover from "@radix-ui/react-popover"
import { ChevronDown } from "lucide-react"

interface MultiSelectProps {
    options: string[]
    selected: string[]
    onChange: (selected: string[]) => void
}

export function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option))
        } else {
            onChange([...selected, option])
        }
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    className="inline-flex items-center px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 dark:text-black transition"
                >
                    {selected.length > 0 ? `${selected.length} selecionado(s)` : "Selecionar projetos"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="bg-white dark:text-black dark:bg-white rounded-md shadow-lg border p-4 w-64 z-50">
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <label
                                key={option}
                                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => toggleOption(option)}
                                    className="form-checkbox"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}