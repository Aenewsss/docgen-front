"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { callCheckoutPage } from "@/utils/call-checkout-page"

export function PricingPlans() {
  const { user } = useAuth()

  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  async function handleCheckout(plan: string, billingCycle: string) {
    if (!user) return router.push(`/signup?plan=${plan.toLowerCase()}&billingCycle=${billingCycle}`)

    const email = user.email
    const userId = user.uid

    callCheckoutPage(email, userId, plan, billingCycle)
  }

  const plans = [
    {
      name: "Starter",
      description: "Para desenvolvedores individuais e projetos pequenos",
      price: {
        monthly: "R$ 29,90",
        yearly: "R$ 279,90",
      },
      features: [
        "🪙 70.000 créditos mensais",
        "💬 Chat com IA: até 50 mensagens/mês",
        "📄 Geração de README: até 5 arquivos/mês",
        "🧠 Documentação Inteligente com IA",
        "🗂️ Organização automática por arquivos e funções",
        "💬 Chat com IA treinado no seu projeto",
        "🔎 Busca contextual nos arquivos",
        "🚀 Economia de horas em leitura e onboarding",
        "🔐 Privacidade garantida",
        "👥 Colaboração entre times",
        "📦 Compatível com qualquer linguagem e estrutura",
        "🔁 Possibilidade de adicionar créditos avulsos",
      ],
      limitations: [
        "Acesso antecipado ao roadmap de features",
      ],
      cta: "Assinar",
      popular: false,
    },
    {
      name: "Pro",
      description: "Para equipes pequenas e startups",
      price: {
        monthly: "R$ 89,90",
        yearly: "R$ 839,90",
      },
      features: [
        "🪙 350.000 créditos mensais",
        "💬 Chat com IA: até 250 mensagens/mês",
        "📄 Geração de README: até 20 arquivos/mês",
        "🧠 Documentação Inteligente com IA",
        "🗂️ Organização automática por arquivos e funções",
        "💬 Chat com IA treinado no seu projeto",
        "🔎 Busca contextual nos arquivos",
        "🚀 Economia de horas em leitura e onboarding",
        "🔐 Privacidade garantida",
        "👥 Colaboração entre times",
        "📦 Compatível com qualquer linguagem e estrutura",
        "Acesso antecipado ao roadmap de features",
        "🔁 Possibilidade de adicionar créditos avulsos",
      ],
      limitations: [
      ],
      cta: "Assinar",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Para equipes e empresas de médio e grande porte",
      price: {
        monthly: "R$ 199,90",
        yearly: "R$ 1869,90",
      },
      features: [
        "🪙 1.050.000 créditos mensais",
        "💬 Chat com IA: até 1.000 mensagens/mês",
        "📄 Geração de README: até 100 arquivos/mês",
        "🧠 Documentação Inteligente com IA",
        "🗂️ Organização automática por arquivos e funções",
        "💬 Chat com IA treinado no seu projeto",
        "🔎 Busca contextual nos arquivos",
        "🚀 Economia de horas em leitura e onboarding",
        "🔐 Privacidade garantida",
        "👥 Colaboração entre times",
        "📦 Compatível com qualquer linguagem e estrutura",
        "✉️ Suporte prioritário e limites ajustáveis via contato direto",
        "Acesso antecipado ao roadmap de features",
        "🔁 Possibilidade de adicionar créditos avulsos",
      ],
      limitations: [],
      cta: "Assinar",
      popular: false,
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center p-1 bg-muted rounded-lg">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 text-sm rounded-md ${billingCycle === "monthly" ? "bg-background shadow-sm" : ""}`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${billingCycle === "yearly" ? "bg-background shadow-sm" : ""
              }`}
          >
            Anual
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Economize 20%+
            </Badge>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${plan.popular ? "border-primary dark:border-zinc-900 shadow-lg shadow-black dark:shadow-white animate-in duration-1000 relative md:scale-105" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <p className="text-4xl font-bold">
                  {plan.price[billingCycle]}
                  {plan.price[billingCycle] !== "R$ 0" && (
                    <span className="text-base font-normal text-muted-foreground">
                      /{billingCycle === "monthly" ? "mês" : "ano"}
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">O que está incluído:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-medium text-muted-foreground">Não inclui:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start gap-2 text-muted-foreground">
                          <span className="ml-7">• {limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleCheckout(plan.name.toLowerCase(), billingCycle)}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
