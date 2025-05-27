'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { getDatabase, ref, update } from 'firebase/database'

interface Props {
  user: { uid: string; showModalCongratsCredits?: number; }
  loading: boolean
}

export default function CongratsCreditsModal({ user, loading }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!loading && user && user.showModalCongratsCredits) {
      setIsOpen(true)
    }
  }, [user, loading])

  const handleClose = async () => {
    setIsOpen(false)

    try {
      const db = getDatabase()
      const userRef = ref(db, `users/${user.uid}`)
      await update(userRef, { showModalCongratsCredits: 0 })
    } catch (err) {
      console.error('Erro ao atualizar showModalCongratsCredits:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-8 text-center shadow-xl">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />

        <h2 className="text-2xl font-bold text-black mb-2">
          🚀 Bem-vindo ao próximo nível!
        </h2>

        <p className="text-gray-700 mb-6">
          Parabéns! Você acaba de adicionar <strong>{user.showModalCongratsCredits?.toLocaleString('pt-BR') || '0'}</strong> créditos à sua conta.<br />
          Com o DocumentAI, seus projetos nunca mais serão os mesmos. Agora você tem o poder de gerar documentações inteligentes e acelerar seu desenvolvimento como nunca antes.
        </p>

        <button
          onClick={handleClose}
          className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90 transition"
        >
          Vamos nessa!
        </button>
      </div>
    </div>
  )
}