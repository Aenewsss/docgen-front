"use client"

import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";

export default function Page() {

    const router = useRouter()

    const [loginData, setLoginData] = useState({ email: '', password: '', repeatPassword: '', name: '', company: '', phone: '', country: '', city: '', role: '' });

    function handleSignup() {

        if (loginData.password != loginData.repeatPassword) return alert("As senhas não são iguais")

        if (Object.values(loginData).filter(Boolean).some(el => !el)) {
            return alert("Preencha todos os campos")
        }

        createUserWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then(result => {
                // @ts-ignore
                localStorage.setItem('jwt-docgen',result.user.accessToken)
                router.push("/")
            })
            .catch(e => alert(`Erro ao tentar criar conta: ${e.message}`))
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
                <form className="space-y-4 border rounded-md p-10 min-w-[400px]">
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Nome*</label>
                        <input value={loginData.name} onChange={(e: any) => setLoginData({ ...loginData, name: e.target.value })} className="border rounded-md p-2" type="text" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">E-mail*</label>
                        <input value={loginData.email} onChange={(e: any) => setLoginData({ ...loginData, email: e.target.value })} className="border rounded-md p-2" type="email" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Senha*</label>
                        <input value={loginData.password} onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })} className="border rounded-md p-2" type="password" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Repetir Senha*</label>
                        <input value={loginData.repeatPassword} onChange={(e: any) => setLoginData({ ...loginData, repeatPassword: e.target.value })} className="border rounded-md p-2" type="password" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Empresa*</label>
                        <input value={loginData.company} onChange={(e: any) => setLoginData({ ...loginData, company: e.target.value })} className="border rounded-md p-2" type="text" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">País*</label>
                        <input value={loginData.country} onChange={(e: any) => setLoginData({ ...loginData, country: e.target.value })} className="border rounded-md p-2" type="text" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Cidade*</label>
                        <input value={loginData.city} onChange={(e: any) => setLoginData({ ...loginData, city: e.target.value })} className="border rounded-md p-2" type="text" />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Telefone*</label>
                        <input value={loginData.phone} onChange={(e: any) => setLoginData({ ...loginData, phone: e.target.value })} className="border rounded-md p-2" type="tel" />
                    </div>
                    <Button type="button" onClick={handleSignup} className="w-full" variant="default">Cadastrar</Button>
                </form>
            </main>
            <footer className="border-t py-6 md:py-8  flex items-center justify-center gap-4 md:flex-row md:gap-8 ">
                <p className="text-center text-sm text-muted-foreground">© 2025 DocGen. Todos os direitos reservados.
                    <a className="underline text-black" href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
        </div>
    )
}