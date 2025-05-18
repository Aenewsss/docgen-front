"use client"

import { Header } from "@/components/header";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { ref, set } from "firebase/database";

function SignupForm() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [loginData, setLoginData] = useState({
        email: '', password: '', repeatPassword: '',
        name: '', company: '', phone: '', country: '',
        city: '', role: '', plan: '', billingCycle: ''
    });

    useEffect(() => {
        if (!searchParams.get("plan") && !searchParams.get("billingCycle")) {
            router.push('/pricing')
        } else {
            setLoginData({ ...loginData, plan: searchParams.get("plan")!, billingCycle: searchParams.get("billingCycle")! })
        }
    }, [searchParams]);

    function handleSignup() {

        if (loginData.password != loginData.repeatPassword) return alert("As senhas não são iguais")

        if (Object.values(loginData).filter(Boolean).some(el => !el)) {
            return alert("Preencha todos os campos")
        }

        createUserWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then(result => {
                // @ts-ignore
                localStorage.setItem('jwt-docgen', result.user.accessToken)
                const dbRef = ref(db, `users/${result.user.uid}`)

                set(dbRef, {
                    ...loginData,
                    email: result.user.email,
                    isTrial: true,
                    trialDateEnd: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
                    credits: 30000,
                    creditsExpiresAt: new Date(new Date().setDate(new Date().getDate() + 29)).toISOString()
                })

                router.push("/")
            })
            .catch(e => alert(`Erro ao tentar criar conta: ${e.message}`))
    }

    return (
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
    )
}


export default function Page() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
                <Suspense fallback={<p>Carregando...</p>}>
                    <SignupForm />
                </Suspense>
            </main>
            <footer className="border-t py-6 md:py-8  flex items-center justify-center gap-4 md:flex-row md:gap-8 ">
                <p className="text-center text-sm text-muted-foreground">© 2025 DocGen. Todos os direitos reservados.
                    <a className="underline text-black" href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
        </div>
    );
}