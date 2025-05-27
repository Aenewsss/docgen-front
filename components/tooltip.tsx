'use client'

import { useState } from 'react'

interface TooltipProps {
    message: string
    children: React.ReactNode
}

export default function Tooltip({ message, children }: TooltipProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {(visible && message) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-sm rounded shadow-lg z-50 whitespace-nowrap">
                    {message}
                </div>
            )}
        </div>
    )
}