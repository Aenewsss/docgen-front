"use client"

import { Header } from "@/components/header";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { ref, set } from "firebase/database";
import { callCheckoutPage } from "@/utils/call-checkout-page";
import { Loader2 } from "lucide-react";

function SignupForm() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '', password: '', repeatPassword: '',
        name: '', company: '', phone: '', country: '',
        city: '', role: '', plan: '', billingCycle: ''
    });

    useEffect(() => {
        setLoginData({ ...loginData, plan: searchParams.get("plan") || '', billingCycle: searchParams.get("billingCycle") || '' })
    }, [searchParams]);

    function handleSignup() {
        setIsLoading(true)
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

                loginData.plan == 'free'
                    ? router.push("/")
                    : !loginData.plan
                        ? router.push("/pricing")
                        : callCheckoutPage(result.user.email!, result.user.uid, loginData.plan, loginData.billingCycle)
            })
            .catch(e => alert(`Erro ao tentar criar conta: ${e.message}`))
            .finally(() => setIsLoading(false))
    }

    function formatPhone(value: string): string {
        const digits = value.replace(/\D/g, '')

        if (digits.length <= 2) {
            return `(${digits}`
        } else if (digits.length <= 6) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
        } else if (digits.length <= 10) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
        } else {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
        }
    }


    const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value)
        setLoginData({ ...loginData, phone: formatted })
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
                <input value={loginData.phone} onChange={handleChangePhone} className="border rounded-md p-2" type="tel" />
            </div>
            <Button disabled={isLoading} type="button" onClick={handleSignup} className="w-full" variant="default">
                {isLoading && <Loader2 className="w-12 h-12 animate-spin" />}
                Cadastrar
            </Button>
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