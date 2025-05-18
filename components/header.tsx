"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {

  const { loading, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="flex h-16 items-center justify-between w-full container">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          <Link href="/" className="text-sm font-medium underline-offset-4">
            <span className="text-xl font-bold">DocGen</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
            Recursos
          </Link>
          <Link href="#examples" className="text-sm font-medium hover:underline underline-offset-4">
            Exemplos
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Preços
          </Link>
        </nav>
        {user
          ? <div className="flex items-center gap-2">
            {/* @ts-ignore */}
            {user.credits && <Button className="cursor-auto hover:bg-white" variant="ghost" >🪙 Créditos: <span className={`font-semibold ${Number(user.credits) < 0 ? 'text-red-500' : 'text-black'}`}>{(user.credits as string).toLocaleString('pt-BR')}</span></Button>}
            <Button className="cursor-auto hover:bg-white" variant="ghost" >{user.email}</Button>
            <Button onClick={logout} variant="destructive">Sair</Button>
          </div>
          : <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/pricing">Cadastrar</Link>
            </Button>
          </div>}
      </div>
    </header>
  )
}
