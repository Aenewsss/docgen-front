'use client'

import Footer from "@/components/footer"
import { Header } from "@/components/header"
import { PricingPlans } from "@/components/pricing-plans"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function PricingPage() {

  const { loading, user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Planos e Preços</h1>
          <p className="text-xl text-muted-foreground">Escolha o plano ideal para suas necessidades de documentação</p>
          {!loading && !user && <Link href={`/signup?plan=free`}>
            <Button className="mt-4" variant={"outline"}>
              Teste nossa ferramenta com<span className="text-green-600 -ms-1 font-semibold">30.000 créditos grátis</span>
            </Button>
          </Link>}
        </div>
        <PricingPlans />
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="text-left p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2">Posso mudar de plano depois?</h3>
              <p className="text-muted-foreground">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              </p>
            </div>
            <div className="text-left p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2">Como funciona o limite de projetos?</h3>
              <p className="text-muted-foreground">
                Cada projeto é contado como um arquivo .zip processado e armazenado em sua conta.
              </p>
            </div>
            <div className="text-left p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2">Preciso fornecer cartão de crédito no plano gratuito?</h3>
              <p className="text-muted-foreground">Não, o plano gratuito não requer informações de pagamento.</p>
            </div>
            <div className="text-left p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
              </p>
            </div>
          </div>
        </div>
      </main>
       <Footer />
    </div>
  )
}
