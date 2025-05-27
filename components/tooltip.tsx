'use client'

import { useState } from 'react'

interface TooltipProps {
    message: string
    children: React.ReactNode
    position?: 'top' | 'bottom'
}

export default function Tooltip({ message, children, position = 'top' }: TooltipProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {(visible && message) && (
                <div className={`absolute left-1/2 transform -translate-x-1/2 px-3 py-1 bg-zinc-900 text-white dark:bg-white dark:text-black text-sm rounded shadow-lg z-50 whitespace-nowrap
    ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                    {message}
                </div>
            )}
        </div>
    )
}