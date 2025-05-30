"use client"
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Page() {

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showResetPassword, setShowResetPassword] = useState(false);

    function handleLogin() {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then(result => {
                // @ts-ignore
                localStorage.setItem('jwt-docgen', result.user.accessToken);
                router.push("/");
            })
            .catch(e => {
                let msg = "Erro ao tentar logar.";
                switch (e.code) {
                    case "auth/user-not-found":
                        msg = "Usuário não encontrado.";
                        break;
                    case "auth/wrong-password":
                        msg = "Senha incorreta.";
                        break;
                    case "auth/invalid-email":
                        msg = "E-mail inválido.";
                        break;
                    case "auth/user-disabled":
                        msg = "Usuário desativado.";
                        break;
                    default:
                        msg = "Erro ao tentar logar.";
                        break;
                }
                toast.error(msg, {position: 'bottom-center'});
            })
            .finally(() => setIsLoading(false));
    }

    async function resetPassword() {
        if (!loginData.email) return toast("E-mail inválido.")

        sendPasswordResetEmail(auth, loginData.email)
            .then(_ => toast("💌 A nova senha será enviada por e-mail", { position: "bottom-center" }))
            .catch(_ => toast("❌ Erro ao enviar nova senha", { type: "error", position: "bottom-center" }))
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
                <form className="space-y-4 border rounded-md p-10 min-w-[400px]">
                    <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">E-mail</label>
                        <input value={loginData.email} onChange={(e: any) => setLoginData({ ...loginData, email: e.target.value })} className="dark:text-black border rounded-md p-2" type="email" />
                    </div>
                    {!showResetPassword && <div className="mb-3 flex flex-col gap-1">
                        <label htmlFor="">Senha</label>
                        <input value={loginData.password} onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })} className="dark:text-black border rounded-md p-2" type="password" />
                    </div>}
                    <Button disabled={isLoading} type="button" onClick={() => !showResetPassword ? handleLogin() : resetPassword()} className="w-full" variant="default">
                        {isLoading && <Loader2 className="w-12 h-12 animate-spin" />}
                        {!showResetPassword ? 'Login' : 'Receber nova senha'}
                    </Button>
                    {
                        !showResetPassword
                            ? <p onClick={() => setShowResetPassword(true)} className="cursor-pointer underline text-sm text-center">Esqueci minha senha</p>
                            : <p onClick={() => setShowResetPassword(false)} className="cursor-pointer underline text-sm text-center">Cancelar</p>
                    }

                </form>
            </main>
            <Footer />

            <ToastContainer />
        </div>
    )
}