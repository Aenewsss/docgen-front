'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { getDatabase, ref, update } from 'firebase/database'

interface Props {
  user: { uid: string; modalCongratsShowed?: boolean }
  loading: boolean
}

export default function CongratsModal({ user, loading }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!loading && user && !user.modalCongratsShowed) {
      setIsOpen(true)
    }
  }, [user, loading])

  const handleClose = async () => {
    setIsOpen(false)

    try {
      const db = getDatabase()
      const userRef = ref(db, `users/${user.uid}`)
      await update(userRef, { modalCongratsShowed: true })
    } catch (err) {
      console.error('Erro ao atualizar modalCongratsShowed:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-8 text-center shadow-xl">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />

        <h2 className="text-2xl font-bold text-black mb-2">
          🎉 Parabéns por escolher o DocumentAI!
        </h2>

        <p className="text-gray-700 mb-6">
          Você acaba de iniciar a revolução da sua documentação. <br />
          Como presente, você ganhou <strong className="text-black">30.000 créditos</strong> para explorar tudo o que o DocumentAI pode fazer.
        </p>

        <button
          onClick={handleClose}
          className="bg-zinc-900 text-white px-6 py-2 rounded-full hover:opacity-90 transition"
        >
          Começar agora
        </button>
      </div>
    </div>
  )
}