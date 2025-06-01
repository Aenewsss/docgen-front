"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, Contrast } from "lucide-react"
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import TabsMenu from "./tabs-menu";
import { usePathname, useRouter } from "next/navigation";
import Tooltip from "./tooltip";

export function Header() {

  const { loading, user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && !user?.plan) router.push('/pricing')
  }, [user, pathname, loading]);

  useEffect(() => {
    let savedTheme = localStorage.getItem('theme')

    if (!savedTheme) {
      localStorage.setItem('theme', 'dark')
      savedTheme = 'dark'
    }

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) localStorage.setItem('theme', 'light')
    else localStorage.setItem('theme', 'dark')

    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 backdrop-blur-lg bg-white/60 dark:bg-black/80 flex justify-center">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-white to-black rounded-full blur opacity-40"></div>
              <div className="relative bg-white dark:bg-black rounded-full p-1">
                <Code2 className="h-6 w-6 text-black dark:text-white" />
              </div>
            </div>
            <Link href={(!loading && (!user || user.plan)) ? "/" : "/pricing"} className="text-sm font-medium underline-offset-4">
              <span className="text-xl font-bold">DocumentAI</span>
            </Link>
          </div>
          {(!loading && (!user)) && <div className="hidden md:flex items-center space-x-8">
            <Link href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
              Como Funciona
            </Link>
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Preços
            </Link>
          </div>
          }
          {!loading && user
            ? <div className="flex items-center gap-2">
              {/* @ts-ignore */}
              {user.credits && user.plan && <Button className="cursor-auto hover:bg-white dark:hover:bg-transparent" variant="ghost" >🪙 Créditos: <span className={`font-semibold ${Number(user.credits) < 0 ? 'text-red-500' : 'text-black dark:text-white'}`}>{(user.credits as string).toLocaleString('pt-BR')}</span></Button>}
              <Button className="cursor-auto  px-1 dark:hover:bg-transparent" variant="ghost" >{user.email}</Button>
              <Tooltip message="Alterar tema" positionY="bottom">
                <Button onClick={toggleTheme} className="p-0 me-4 hover:bg-transparent hover:scale-[1.3] transition-all" variant="ghost" >
                  <Contrast className=" h-16 w-16 scale-125" /></Button>
              </Tooltip>
              <Button onClick={logout} variant="destructive">Sair</Button>
            </div>
            : <div className="flex items-center gap-2">
              <Tooltip message="Alterar tema" positionY="bottom">
                <Button onClick={toggleTheme} className="p-0 me-4 hover:bg-transparent hover:scale-[1.3] transition-all" variant="ghost" >
                  <Contrast className=" h-16 w-16 scale-125" /></Button>
              </Tooltip>
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Comece agora</Link>
              </Button>
            </div>}
        </nav>
      </div>
      {!loading && user?.plan && <TabsMenu />}
    </header>
  )
}