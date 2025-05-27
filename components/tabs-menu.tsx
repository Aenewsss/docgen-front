'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const tabs = [
    { label: 'MEUS PROJETOS', path: '/projetos' },
    { label: 'MEU PLANO', path: '/meu-plano' },
    { label: 'HISTÓRICO DE USO', path: '/historico-de-uso' }
]

export default function TabsMenu() {
    const pathname = usePathname()

    return (
        <div className="bg-zinc-900 text-white flex justify-center self-center rounded-full p-2 space-x-8 w-full max-w-xl mx-auto shadow-lg shadow-black -mt-2 z-[60] fixed top-[72px] bounce-custom ">
            {tabs.map(({ label, path }) => (
                <Link
                    key={path}
                    href={path}
                    className={clsx(
                        'text-sm transition-all',
                        pathname === path ? 'font-bold' : 'font-medium hover:font-black'
                    )}
                >
                    {label}
                </Link>
            ))}
        </div>
    )
}