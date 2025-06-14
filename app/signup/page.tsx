"use client"

import { Header } from "@/components/header";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { ref, set } from "firebase/database";
import { callCheckoutPage } from "@/utils/call-checkout-page";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Footer from "@/components/footer";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

function SignupForm() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '', password: '', repeatPassword: '',
        name: '', company: '', phone: '', country: '',
        city: '', role: '', plan: '', billingCycle: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

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
                    isTrial: !loginData.plan ? false : true,
                    trialDateEnd: !loginData.plan ? null : new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
                    credits: !loginData.plan ? 0 : 30000,
                    creditsExpiresAt: !loginData.plan ? null : new Date(new Date().setDate(new Date().getDate() + 29)).toISOString(),
                    readmesLeft: !loginData.plan ? 5 : loginData.plan == 'starter' ? 5 : loginData.plan == 'pro' ? 20 : 100,
                    chatsLeft: !loginData.plan ? 50 : loginData.plan == 'starter' ? 50 : loginData.plan == 'pro' ? 250 : 1000,
                })

                loginData.plan == 'free'
                    ? router.push("/")
                    : !loginData.plan
                        ? router.push("/pricing")
                        : callCheckoutPage(result.user.email!, result.user.uid, loginData.plan, loginData.billingCycle)
            })
            .catch(e => {
                let errorMessage = "Erro ao tentar criar conta.";

                switch (e.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = "Este e-mail já está em uso.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "E-mail inválido.";
                        break;
                    case 'auth/weak-password':
                        errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = "Cadastro com e-mail e senha não está habilitado.";
                        break;
                    default:
                        errorMessage = "Erro inesperado: " + e.message;
                        break;
                }

                // alert(errorMessage);
                toast.error(errorMessage, { position: 'bottom-center' });
            })
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
                <input value={loginData.name} onChange={(e: any) => setLoginData({ ...loginData, name: e.target.value })} className="dark:text-black border rounded-md p-2" type="text" />
            </div>
            <div className="mb-3 flex flex-col gap-1">
                <label htmlFor="">E-mail*</label>
                <input value={loginData.email} onChange={(e: any) => setLoginData({ ...loginData, email: e.target.value })} className="dark:text-black border rounded-md p-2" type="email" />
            </div>
            <div className="mb-3 flex flex-col gap-1">
                <label htmlFor="">Senha*</label>
                <div className="relative">
                    <input
                        value={loginData.password}
                        onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })}
                        className="dark:text-black border rounded-md p-2 w-full pr-10"
                        type={showPassword ? "text" : "password"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    >
                        {!showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <div className="mb-3 flex flex-col gap-1">
                <label htmlFor="">Repetir Senha*</label>
                <div className="relative">
                    <input
                        value={loginData.repeatPassword}
                        onChange={(e: any) => setLoginData({ ...loginData, repeatPassword: e.target.value })}
                        className="dark:text-black border rounded-md p-2 w-full pr-10"
                        type={showRepeatPassword ? "text" : "password"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    >
                        {!showRepeatPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <div className="mb-3 flex flex-col gap-1">
                <label htmlFor="">Empresa*</label>
                <input value={loginData.company} onChange={(e: any) => setLoginData({ ...loginData, company: e.target.value })} className="dark:text-black border rounded-md p-2" type="text" />
            </div>
            <div className="mb-3 flex flex-col gap-1">
                <label htmlFor="">País*</label>
                <input value={loginData.country} onChange={(e: any) => setLoginData({ ...loginData, country: e.target.value })} className="dark:text-black border rounded-md p-2" type="text" />
            </div>
            <div className="mb-3 flex flex-col gap-1">
                <label htmlFor="">Cidade*</label>
                <input value={loginData.city} onChange={(e: any) => setLoginData({ ...loginData, city: e.target.value })} className="dark:text-black border rounded-md p-2" type="text" />
            </div>
            <div className="mb-3 flex flex-col gap-1">
                <label htmlFor="">Telefone*</label>
                <input value={loginData.phone} onChange={handleChangePhone} className="dark:text-black border rounded-md p-2" type="tel" />
            </div>
            <Link href="/login" className="cursor-pointer underline text-sm text-center flex self-center justify-self-center">Já tenho conta</Link>

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
            <Footer />
            <ToastContainer />
        </div>
    );
}