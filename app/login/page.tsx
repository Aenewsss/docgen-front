"use client"
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    function handleLogin() {
        setIsLoading(true)
        signInWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then(result => {
                console.log(result.user)
                // @ts-ignore
                localStorage.setItem('jwt-docgen', result.user.accessToken)
                router.push("/")
            })
            .catch(e => alert(`Erro ao tentar logar: ${e.message}`))
            .finally(() => setIsLoading(false))
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
                    <Button disabled={isLoading} type="button" onClick={handleLogin} className="w-full" variant="default">
                        {isLoading && <Loader2 className="w-12 h-12 animate-spin" />}
                        Login
                    </Button>
                    <p className="underline text-sm text-center">Esqueci minha senha</p>
                </form>
            </main>
           <Footer />
        </div>
    )
}