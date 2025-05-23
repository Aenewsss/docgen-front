'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, CircleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
    repoError?: boolean
    repoMessage: string | null
    clearMessage: () => void // função para limpar a mensagem após o usuário fechar
}

export default function RepoMessageModal({ repoMessage, clearMessage, repoError = false }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (repoMessage) setIsOpen(true)
    }, [repoMessage])

    const handleClose = () => {
        setIsOpen(false)
        clearMessage()
    }

    const handleProject = () => {
        setIsOpen(false)
        clearMessage()
        router.push('/projetos')
    }

    if (!isOpen || !repoMessage) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
                {repoError ? <CircleAlert className="mx-auto text-red-600 mb-4" size={48} /> : <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />}

                <h2 className="text-2xl font-bold text-black mb-2">{repoError ? '😞 Erro durante a documentação!' : '🎉 Documentação finalizada!'}</h2>

                <p className="text-gray-700 mb-6 whitespace-pre-line">{repoMessage}</p>

                <div className="flex gap-2 justify-center">
                    <button
                        onClick={handleProject}
                        className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90 transition-all hover:bg-white hover:border hover:border-black hover:text-black"
                    >
                        Acessar projeto
                    </button>
                    <button
                        onClick={handleClose}
                        className="border-black border text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}