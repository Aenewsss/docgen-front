'use client'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Upload } from "@/components/upload"
import { Features } from "@/components/features"
import { Examples } from "@/components/examples"
import { Header } from "@/components/header"
import { Suspense, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, Settings } from "lucide-react"
import CongratsModal from "@/components/congrats-modal"
import Loading from "@/components/loading"
import { callCheckoutPage } from "@/utils/call-checkout-page"
import CongratsCreditsModal from "@/components/congrats-credits-modal"
import Footer from "@/components/footer"

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
  const [showOrganizationsModal, setShowOrganizationsModal] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])

  useEffect(() => {
    if (!loading && user) {
      if (!user?.plan || (checkTrialExpired(user?.trialDateEnd) && user?.plan == "free")) router.push('/pricing')
      else if (checkTrialExpired(user?.trialDateEnd)) callCheckoutPage(user.email, user.uid, user.plan, user.billingCycle)
    }
  }, [user, pathname, loading]);

  useEffect(() => {
    if (user?.github_token) {
      fetch("https://api.github.com/user/memberships/orgs", {
        headers: {
          Authorization: `Bearer ${user.github_token}`,
          Accept: "application/vnd.github+json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const parsed = (data || []).map((item: any) => ({
            login: item.organization.login,
            state: item.state,
            id: item.organization.id
          }));
          setOrganizations(parsed);
        })
        .catch((err) => console.error("Erro ao buscar organizações:", err));
    }
  }, [user]);

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

        {user && <Button onClick={() => setShowOrganizationsModal(true)} className="mb-8">
          <Settings /> Gerenciar Acesso às Organizações
        </Button>}

        <Suspense fallback={<div>Carregando...</div>}>
          <Upload />
        </Suspense>

        <CongratsModal loading={loading} user={user} />
        <CongratsCreditsModal loading={loading} user={user} />

        {!user && <Features />}
        {!user && <Examples />}
        {showOrganizationsModal && (
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button onClick={() => setShowOrganizationsModal(false)} className="absolute top-2 right-2 text-red-500 text-xl">×</button>
              <h2 className="text-xl font-semibold mb-4">Organizações do GitHub</h2>
              <p className="mb-4 text-muted-foreground">Selecione as organizações às quais deseja autorizar ou revogar acesso para o DocumentAI.</p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Caso a organização que você procura não esteja listada aqui, ela pode estar com acesso restrito.{" "}
                  Acesse suas configurações do GitHub e solicite manualmente a autorização para o aplicativo do DocumentAI neste link:{" "}
                  <a href="https://github.com/settings/connections/applications/Ov23liETQhy3ZNbHdDy0" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                    github.com/settings/connections/applications
                  </a>
                </p>
                {organizations.length === 0 && <p>Nenhuma organização encontrada.</p>}
                {organizations.map((org) => (
                  <div key={org.id} className="border p-4 rounded-md flex justify-between items-center">
                    <span className="font-medium">{org.login}</span>
                    <div className="flex gap-2">
                      {org.state === 'active' ? (
                        <Button variant="destructive">Revogar</Button>
                      ) : (
                        <Button variant="default">Solicitar acesso</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
