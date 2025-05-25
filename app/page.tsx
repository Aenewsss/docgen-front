'use client'
import { Upload } from "@/components/upload"
import { Features } from "@/components/features"
import { Examples } from "@/components/examples"
import { Header } from "@/components/header"
import { Suspense, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import CongratsModal from "@/components/congrats-modal"
import Loading from "@/components/loading"
import { callCheckoutPage } from "@/utils/call-checkout-page"

function checkTrialExpired(trialDateEnd: string): boolean {
  if (!trialDateEnd) return false;
  const now = new Date();
  const end = new Date(trialDateEnd);
  return now > end;
}

export default function Home() {
  const { loading, user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (!user?.plan || (checkTrialExpired(user?.trialDateEnd) && user?.plan == "free")) router.push('/pricing')
      else if (checkTrialExpired(user?.trialDateEnd)) callCheckoutPage(user.email, user.uid, user.plan, user.billingCycle)
    }
  }, [user, pathname, loading]);

  if (loading) return <Loading />

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Documente seu código automaticamente
          </h1>
          <p className="text-xl text-muted-foreground">
            Importe seu projeto git e obtenha uma documentação completa e organizada em segundos
          </p>
        </div>
        <Suspense fallback={<div>Carregando...</div>}>
          <Upload />
        </Suspense>

        <CongratsModal loading={loading} user={user} />

        <Features />
        <Examples />
      </main>
      <footer className="border-t py-6 md:py-8  flex items-center justify-center gap-4 md:flex-row md:gap-8 ">
        <p className="text-center text-sm text-muted-foreground">© 2025 DocumentAI. Todos os direitos reservados.
          <a className="underline text-black" href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
        </p>
      </footer>
    </div>
  )
}
