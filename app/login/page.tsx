"use client"
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

    const router = useRouter()

    const [loginData, setLoginData] = useState({ email: '', password: '' });

    function handleLogin() {
        signInWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then(result => {
                console.log(result.user)
                // @ts-ignore
                localStorage.setItem('jwt-docgen', result.user.accessToken)
                router.push("/")
            })
            .catch(e => alert(`Erro ao tentar logar: ${e.message}`))
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
                <form className="space-y-4 border rounded-md p-10 min-w-[400px]">
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">E-mail</label>
                        <input value={loginData.email} onChange={(e: any) => setLoginData({ ...loginData, email: e.target.value })} className="border rounded-md p-2" type="email" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Senha</label>
                        <input value={loginData.password} onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })} className="border rounded-md p-2" type="password" />
                    </div>
                    <Button type="button" onClick={handleLogin} className="w-full" variant="default">Login</Button>
                    <p className="underline text-sm text-center">Esqueci minha senha</p>
                </form>
            </main>
            <footer className="border-t py-6 md:py-8  flex items-center justify-center gap-4 md:flex-row md:gap-8 ">
                <p className="text-center text-sm text-muted-foreground">© 2025 DocumentAI. Todos os direitos reservados.
                    <a className="underline text-black" href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
        </div>
    )
}