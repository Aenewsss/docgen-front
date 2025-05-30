'use client'

import { useState } from 'react'

interface TooltipProps {
    message: string
    children: React.ReactNode
    positionY?: 'top' | 'bottom'
    left?:number
    right?:number
}

export default function Tooltip({ message, children, positionY = 'top', left, right }: TooltipProps) {
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
    ${positionY === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
    ${left ? `left-[${left}] translate-x-0` : null}
    ${right ? `right-[${right}] translate-x-0` : null}
    `}>
                    {message}
                </div>
            )}
        </div>
    )
}