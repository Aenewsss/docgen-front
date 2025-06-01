"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { callCheckoutPage } from "@/utils/call-checkout-page"
import { Header } from "@/components/header"
import { callCheckoutCreditsPage } from "@/utils/call-checkout-credits-page"
import Tooltip from "@/components/tooltip"
import Footer from "@/components/footer"

export default function Page() {
    const { user } = useAuth()

    const router = useRouter()
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
    const [inputCredits, setInputCredits] = useState<string>("")

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
                "30.000 créditos mensais",
                "Chat com IA: até 20 mensagens/mês",
                "Geração de README: até 3 arquivos/mês",
            ],
            limitations: [
                "Acesso antecipado ao roadmap de features",
            ],
            cta: user?.plan != "starter" ? "Downgrade" : "Upgrade",
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
                "1.000.000 créditos mensais",
                "Chat com IA: até 250 mensagens/mês",
                "Geração de README: até 20 arquivos/mês",
                "Acesso antecipado ao roadmap de features",
            ],
            limitations: [
            ],
            cta: user?.plan == "enterprise" ? "Downgrade" : "Upgrade",
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
                "4.000.000 créditos mensais",
                "Chat com IA: até 1.000 mensagens/mês",
                "Geração de README: até 100 arquivos/mês",
                "Acesso antecipado ao roadmap de features",
            ],
            limitations: [],
            cta: "Upgrade",
            popular: false,
        },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24 md:pt-10">
                <div className="text-center space-y-4 max-w-6xl mx-auto mb-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Gerencie seu plano e adquira créditos
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Escolha um plano mensal, anual ou compre créditos avulsos conforme sua demanda
                    </p>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="space-y-2 text-center">
                        <label htmlFor="credit-select" className="block font-medium text-lg">Comprar créditos avulsos</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                min={10000}
                                step={1000}
                                placeholder="Digite a quantidade de créditos"
                                className="border dark:text-black rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                value={inputCredits}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                                    if (rawValue === "") {
                                        setInputCredits("");
                                    } else {
                                        const formatted = Number(rawValue).toLocaleString("pt-BR");
                                        setInputCredits(formatted);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const raw = parseInt(inputCredits.replace(/\./g, ""), 10);
                                        if (!raw || raw < 10000) return alert("Digite um valor válido acima de 10.000 créditos")
                                        if (!user) return router.push(`/signup?credits=${raw}`)
                                        const email = user.email
                                        const userId = user.uid
                                        callCheckoutCreditsPage(email, userId, raw.toString())
                                    }
                                }}
                            />
                            <Tooltip message={(!inputCredits || parseInt(inputCredits.replace(/\./g, ""), 10) < 10000) ? "O mínimo de crédito é 10.000" : ""}>
                                <Button
                                    className="w-full flex-grow px-4"
                                    disabled={!inputCredits || parseInt(inputCredits.replace(/\./g, ""), 10) < 10000}
                                    onClick={() => {
                                        const raw = parseInt(inputCredits.replace(/\./g, ""), 10);
                                        if (!raw || raw < 10000) return alert("Digite um valor válido acima de 10.000 créditos")
                                        if (!user) return router.push(`/signup?credits=${raw}`)
                                        const email = user.email
                                        const userId = user.uid
                                        callCheckoutCreditsPage(email, userId, raw.toString())
                                    }}
                                >
                                    Comprar
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

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
                                className={`flex flex-col ${plan.popular ? "border-primary shadow-lg shadow-black animate-in relative md:scale-105" : ""}`}
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
                                        disabled={user?.plan.toLowerCase() == plan.name.toLocaleLowerCase()}
                                        className="w-full"
                                        variant={plan.popular ? "default" : "outline"}
                                        onClick={() => handleCheckout(plan.name.toLowerCase(), billingCycle)}
                                    >
                                        {user?.plan.toLowerCase() == plan.name.toLowerCase() ? 'Plano atual' : plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}