"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Github, Code, FileText, GitBranch, Workflow, Database, Network, ArrowRight, ExternalLink, Import, Scan, FileCode, Webhook, Check, ChevronRight, Star, Users, Clock, FileJson, Code2, Contrast } from 'lucide-react'
import Link from "next/link"
import Markdown from "markdown-to-jsx"
import { useAuth } from "@/hooks/use-auth"
import { usePathname, useRouter } from "next/navigation"
import Tooltip from "@/components/tooltip"
import TabsMenu from "@/components/tabs-menu"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function DocumentAILanding() {

  const { loading, user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && !user?.plan) router.push('#pricing')
  }, [user, pathname, loading]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) localStorage.setItem('theme', 'light')
    else localStorage.setItem('theme', 'dark')

    document.documentElement.classList.toggle('dark')
  }

  const [isYearly, setIsYearly] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    {
      icon: Code,
      title: "Análise Completa do Código",
      description: "Análise avançada de todas as estruturas de código em múltiplas linguagens e frameworks"
    },
    {
      icon: GitBranch,
      title: "Mapeamento da Arquitetura do Projeto",
      description: "Representação visual da arquitetura do seu projeto e relações entre componentes"
    },
    {
      icon: Database,
      title: "Extração de Entidades/Modelos",
      description: "Extração automática e documentação de modelos de dados e seus relacionamentos"
    },
    {
      icon: FileText,
      title: "Compreensão Inteligente de Comentários",
      description: "Análise por IA dos comentários existentes para enriquecer a documentação"
    },
    {
      icon: Workflow,
      title: "Resumo de Workflows & Funções",
      description: "Sumários completos de funções, métodos e fluxos de trabalho"
    },
    {
      icon: Webhook,
      title: "Atualização Automática do README",
      description: "Atualização automática do README via integração com webhook do GitHub"
    }
  ]

  const howItWorks = [
    {
      icon: Import,
      title: "Importe o Repositório",
      description: "Conecte seu repositório do GitHub com um clique"
    },
    {
      icon: Scan,
      title: "Análise com IA",
      description: "Nossa IA escaneia e analisa todo o seu código"
    },
    {
      icon: FileCode,
      title: "Gere Documentação",
      description: "Documentação limpa e estruturada gerada automaticamente"
    },
    {
      icon: Webhook,
      title: "Atualizações em Tempo Real",
      description: "A documentação se mantém sincronizada via webhooks"
    }
  ]

  const stats = [
    { icon: Clock, value: "85%", label: "Tempo Economizado" },
    { icon: FileJson, value: "10M+", label: "Linhas Analisadas" },
    { icon: Users, value: "2.500+", label: "Times" }
  ]

  const testimonials = [
    {
      quote: "O DocumentAI reduziu nosso tempo de onboarding pela metade. Novos desenvolvedores entendem o código em minutos, não dias.",
      author: "Sarah Chen",
      role: "CTO na TechFlow"
    },
    {
      quote: "A documentação gerada por IA é tão precisa que parece ter sido escrita pelos nossos engenheiros seniores.",
      author: "Michael Rodriguez",
      role: "Desenvolvedor Líder na Stackify"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 backdrop-blur-lg bg-black/80 flex justify-center">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white to-black rounded-full blur opacity-40"></div>
                <div className="relative bg-black rounded-full p-1">
                  <Code2 className="h-6 w-6" />
                </div>
              </div>
              <Link href={(!loading && (!user || user.plan)) ? "/" : "/pricing"} className="text-sm font-medium underline-offset-4">
                <span className="text-xl font-bold">DocumentAI</span>
              </Link>
            </div>
            {(!loading && (!user)) && <div className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
                Como Funciona
              </Link>
              <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
                Funcionalidades
              </Link>
              <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Preços
              </Link>
            </div>
            }
            {!loading && user
              ? <div className="flex items-center gap-2">
                {/* @ts-ignore */}
                {user.credits && user.plan && <Button className="cursor-auto hover:bg-white dark:hover:bg-transparent" variant="ghost" >🪙 Créditos: <span className={`font-semibold ${Number(user.credits) < 0 ? 'text-red-500' : 'text-black dark:text-white'}`}>{(user.credits as string).toLocaleString('pt-BR')}</span></Button>}
                <Button className="cursor-auto  px-1 dark:hover:bg-transparent" variant="ghost" >{user.email}</Button>
                <Tooltip message="Alterar tema" positionY="bottom">
                  <Button onClick={toggleTheme} className="p-0 me-4 hover:bg-transparent hover:scale-[1.3] transition-all" variant="ghost" >
                    <Contrast className=" h-16 w-16 scale-125" /></Button>
                </Tooltip>
                <Button onClick={logout} variant="destructive">Sair</Button>
              </div>
              : <div className="flex items-center gap-2">
                <Tooltip message="Alterar tema" positionY="bottom">
                  <Button onClick={toggleTheme} className="p-0 me-4 hover:bg-transparent hover:scale-[1.3] transition-all" variant="ghost" >
                    <Contrast className=" h-16 w-16 scale-125" /></Button>
                </Tooltip>
                <Button variant="ghost" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Comece agora</Link>
                </Button>
              </div>}
          </nav>
        </div>
        {!loading && user?.plan && <TabsMenu />}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0f172a]/20 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1f2937]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Badge className="mb-6 bg-[#1f2937]/50 text-[#d1d5db] hover:bg-[#1f2937]/50 border border-[#374151]/50 backdrop-blur-sm">
              Impulsionado por IA
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Documentação de
              <br />
              Código com IA.
              <br />
              <span className="bg-gradient-to-r from-[#0f172a]/20 to-purple-900/20 bg-clip-text text-transparent">
                No Piloto Automático.
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Importe seu repositório do GitHub/GitLab e obtenha documentação limpa e estruturada em segundos.
              Deixe a IA cuidar do trabalho repetitivo enquanto você foca em construir.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-6 h-auto text-lg group">
                {/* <Github className="h-5 w-5 mr-2" /> */}
                Documenta AÍ!
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>


          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white to-purple-800/80 rounded-xl blur opacity-30"></div>
            <div className="relative bg-zinc-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
              <div className="flex items-center bg-gray-950 px-4 py-2 border-b border-gray-800">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-400">page.tsx</div>
              </div>
              <Card>
                <CardContent className="p-4 bg-zinc-900 ">
                  <Markdown className="max-w-none prose dark:prose-invert max-h-[500px] overflow-y-auto text-start">
                    {`
# 📄 Documentação Técnica: \`page.tsx\`<br />
<br />
**📁 Arquivo:**<br />
\`temp_repositories/Aenewsss_impact-flow/Aenewsss-impact-flow-dc667c7/src/app/page.tsx\`<br />
<br />
**🔍 Linguagem:**<br />
TypeScript (React / Next.js)<br />
<br />
**📦 Bibliotecas / Frameworks:**<br />
- React<br />
- Next.js<br />
- React Flow *(diagramas de fluxo)*<br />
- Firebase *(autenticação e realtime database)*<br />
- Material-UI *(ícones)*<br />
- UUID *(geração de IDs únicos)*<br />

<br />

## 🧠 Funções Principais

<br />
### ⚙️ \`FlowApp()\`<br />
**Descrição:** Componente principal que renderiza o editor de fluxo interativo com funcionalidades de:<br />
- criação de nós<br />
- conexões<br />
- visualização de impactos<br />
- geração de fluxos via IA<br />
- integração com Firebase<br />
<br />
**Parâmetros:** Nenhum<br />
**Retorno:** JSX do editor<br />
<br />

### 🤖 \`generateFlow()\`<br />
**Descrição:** Gera um fluxo de processos com base em um prompt via API Groq. Cria automaticamente nós e conexões.<br />
**Parâmetros:** Nenhum (usa estado \`prompt\`)<br />
**Retorno:** Atualiza o estado local com novos nós/conexões<br />
**Obs:** Valida plano do usuário e trata erros<br />
<br />

### ☁️ \`fetchNodes()\`<br />
**Descrição:** Busca os nós e conexões do usuário no Firebase Realtime Database.<br />
**Parâmetros:** Nenhum (usa \`userUID\`)<br />
**Retorno:** Atualiza o estado com os dados<br />
<br />

### 🔗 \`onConnect(params)\`<br />
**Descrição:** Cria novas conexões entre nós.<br />
**Parâmetros:**<br />
- \`params\` (objeto): \`{ source, target }\`<br />
**Retorno:** Atualiza o estado e o Firebase<br />
<br />

### 🔍 \`viewImpact(event, nodeId, nodesImpacted, visited, depth)\`<br />
**Descrição:** Calcula o impacto de um nó em outros nós (diretos e indiretos).<br />
**Parâmetros:**<br />
- \`event?\`: DOM event<br />
- \`nodeId\`: ID do nó de origem<br />
- \`nodesImpacted\`: \`Map\` para controle<br />
- \`visited\`: \`Map\` para evitar ciclos<br />
- \`depth\`: Profundidade da recursão<br />
**Retorno:** Atualiza o estado com nós impactados<br />
<br />

### ➕ \`createNewNode()\`<br />
**Descrição:** Cria um novo nó no centro da viewport.<br />
**Parâmetros:** Nenhum<br />
**Retorno:** Adiciona o nó ao estado e Firebase<br />
**Obs:** Respeita limitações do plano<br />
<br />

### 🗂️ \`handleJSONUpload(event)\`<br />
**Descrição:** Processa upload de JSON para gerar diagrama.<br />
**Parâmetros:**<br />
- \`event\`: change do input de arquivo<br />
**Retorno:** Cria nós e conexões a partir do JSON<br />
<br />

### 🧩 \`generateDiagramFromJSON(json)\`<br />
**Descrição:** Transforma objeto JSON em nós e conexões.<br />
**Parâmetros:**<br />
- \`json\`: dados do diagrama<br />
**Retorno:** Atualiza estado com os elementos<br />
<br />

### 📝 \`createAnnotation()\`<br />
**Descrição:** Cria um novo nó do tipo anotação.<br />
**Parâmetros:** Nenhum<br />
**Retorno:** Adiciona anotação ao estado e Firebase<br />
**Obs:** Verifica plano do usuário<br />
<br />

## 💬 Observações Gerais<br />
1. Usa intensivamente hooks do React (\`useState\`, \`useEffect\`, \`useCallback\`)<br />
2. Firebase garante persistência e sincronia em tempo real<br />
3. Funcionalidades avançadas do editor:<br />
   - Criação e remoção de nós/conexões<br />
   - Impact analysis<br />
   - Geração via IA (Groq)<br />
   - Importação/exportação de JSON<br />
   - Controle de tema (light/dark)<br />
4. Controle de permissões com base no plano (FREE / PRO)<br />
5. Interface com tooltips e botões flutuantes<br />
6. **Sugestão:** funções ligadas ao Firebase podem ser separadas em arquivos utilitários para melhor organização.<br />
<br />

✨ O código está bem modularizado, com responsabilidade clara por função e tratamento de erro presente. Ótima base para evoluir funcionalidades como **colaboração em tempo real**, **versionamento de fluxos**, entre outras.<br />
`}
                  </Markdown>
                </CardContent>
              </Card>


            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-[#1f2937]/30 text-[#d1d5db] hover:bg-[#1f2937]/30 border border-[#374151]/30">
              Processo Simples
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Nossa plataforma com IA torna a documentação fácil em poucos passos
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {howItWorks.map((step, index) => (
              <motion.div key={index} variants={fadeIn} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-800/80 to-transparent z-0 -translate-x-4"></div>
                )}
                <Card className="border-0 bg-zinc-900/60 backdrop-blur-sm hover:bg-zinc-900/80 transition-colors overflow-hidden group">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-4 bg-[#374151]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-16 h-16 bg-[#1f2937]/50 rounded-full flex items-center justify-center mx-auto relative">
                        <step.icon className="h-8 w-8 text-[#545455]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative bg-gradient-to-b from-transparent to-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#1f2937]/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-[#1f2937]/30 text-[#d1d5db] hover:bg-[#1f2937]/30 border border-[#374151]/30">
              Funcionalidades
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Funcionalidades Poderosas</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Nossa plataforma com IA analisa seu código e gera documentação completa
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 transition-colors h-full group">
                  <CardContent className="p-8">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-4 bg-[#374151]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <feature.icon className="h-8 w-8 text-[#374151]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Preview / Interactive Demo */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-[#1f2937]/30 text-[#d1d5db] hover:bg-[#1f2937]/30 border border-[#374151]/30">
              Veja na Prática
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Exemplos</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Veja como o DocumentAI transforma seu código em documentação completa
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Tabs defaultValue="before" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="before" className="data-[state=active]:bg-[#353b43]/30 data-[state=active]:text-[#d1d5db]">Front end</TabsTrigger>
                <TabsTrigger value="after" className="data-[state=active]:bg-[#353b43]/30 data-[state=active]:text-[#d1d5db]">Back end</TabsTrigger>
              </TabsList>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#374151] to-[#1f2937] rounded-xl blur opacity-20"></div>
                <div className="relative">
                  <TabsContent value="before" className="mt-0">
                    <Card className="border border-gray-800 bg-zinc-900 shadow-xl">
                      <CardContent className="p-0">
                        <div className="flex items-center bg-zinc-950 px-4 py-2 border-b border-zinc-800">
                          <div className="flex space-x-2 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-xs text-gray-400">page.tsx</div>
                        </div>
                        <Markdown className="max-w-none prose dark:prose-invert max-h-[500px] overflow-y-auto text-start">
                          {`
# 📄 Documentação Técnica: \`page.tsx\`<br />
<br />
**📁 Arquivo:**<br />
\`temp_repositories/Aenewsss_impact-flow/Aenewsss-impact-flow-dc667c7/src/app/page.tsx\`<br />
<br />
**🔍 Linguagem:**<br />
TypeScript (React / Next.js)<br />
<br />
**📦 Bibliotecas / Frameworks:**<br />
- React<br />
- Next.js<br />
- React Flow *(diagramas de fluxo)*<br />
- Firebase *(autenticação e realtime database)*<br />
- Material-UI *(ícones)*<br />
- UUID *(geração de IDs únicos)*<br />

<br />

## 🧠 Funções Principais

<br />
### ⚙️ \`FlowApp()\`<br />
**Descrição:** Componente principal que renderiza o editor de fluxo interativo com funcionalidades de:<br />
- criação de nós<br />
- conexões<br />
- visualização de impactos<br />
- geração de fluxos via IA<br />
- integração com Firebase<br />
<br />
**Parâmetros:** Nenhum<br />
**Retorno:** JSX do editor<br />
<br />

### 🤖 \`generateFlow()\`<br />
**Descrição:** Gera um fluxo de processos com base em um prompt via API Groq. Cria automaticamente nós e conexões.<br />
**Parâmetros:** Nenhum (usa estado \`prompt\`)<br />
**Retorno:** Atualiza o estado local com novos nós/conexões<br />
**Obs:** Valida plano do usuário e trata erros<br />
<br />

### ☁️ \`fetchNodes()\`<br />
**Descrição:** Busca os nós e conexões do usuário no Firebase Realtime Database.<br />
**Parâmetros:** Nenhum (usa \`userUID\`)<br />
**Retorno:** Atualiza o estado com os dados<br />
<br />

### 🔗 \`onConnect(params)\`<br />
**Descrição:** Cria novas conexões entre nós.<br />
**Parâmetros:**<br />
- \`params\` (objeto): \`{ source, target }\`<br />
**Retorno:** Atualiza o estado e o Firebase<br />
<br />

### 🔍 \`viewImpact(event, nodeId, nodesImpacted, visited, depth)\`<br />
**Descrição:** Calcula o impacto de um nó em outros nós (diretos e indiretos).<br />
**Parâmetros:**<br />
- \`event?\`: DOM event<br />
- \`nodeId\`: ID do nó de origem<br />
- \`nodesImpacted\`: \`Map\` para controle<br />
- \`visited\`: \`Map\` para evitar ciclos<br />
- \`depth\`: Profundidade da recursão<br />
**Retorno:** Atualiza o estado com nós impactados<br />
<br />

### ➕ \`createNewNode()\`<br />
**Descrição:** Cria um novo nó no centro da viewport.<br />
**Parâmetros:** Nenhum<br />
**Retorno:** Adiciona o nó ao estado e Firebase<br />
**Obs:** Respeita limitações do plano<br />
<br />

### 🗂️ \`handleJSONUpload(event)\`<br />
**Descrição:** Processa upload de JSON para gerar diagrama.<br />
**Parâmetros:**<br />
- \`event\`: change do input de arquivo<br />
**Retorno:** Cria nós e conexões a partir do JSON<br />
<br />

### 🧩 \`generateDiagramFromJSON(json)\`<br />
**Descrição:** Transforma objeto JSON em nós e conexões.<br />
**Parâmetros:**<br />
- \`json\`: dados do diagrama<br />
**Retorno:** Atualiza estado com os elementos<br />
<br />

### 📝 \`createAnnotation()\`<br />
**Descrição:** Cria um novo nó do tipo anotação.<br />
**Parâmetros:** Nenhum<br />
**Retorno:** Adiciona anotação ao estado e Firebase<br />
**Obs:** Verifica plano do usuário<br />
<br />

## 💬 Observações Gerais<br />
1. Usa intensivamente hooks do React (\`useState\`, \`useEffect\`, \`useCallback\`)<br />
2. Firebase garante persistência e sincronia em tempo real<br />
3. Funcionalidades avançadas do editor:<br />
   - Criação e remoção de nós/conexões<br />
   - Impact analysis<br />
   - Geração via IA (Groq)<br />
   - Importação/exportação de JSON<br />
   - Controle de tema (light/dark)<br />
4. Controle de permissões com base no plano (FREE / PRO)<br />
5. Interface com tooltips e botões flutuantes<br />
6. **Sugestão:** funções ligadas ao Firebase podem ser separadas em arquivos utilitários para melhor organização.<br />
<br />

✨ O código está bem modularizado, com responsabilidade clara por função e tratamento de erro presente. Ótima base para evoluir funcionalidades como **colaboração em tempo real**, **versionamento de fluxos**, entre outras.<br />
`}
                        </Markdown>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="after" className="mt-0">
                    <Card className="border border-gray-800 bg-zinc-900 shadow-xl">
                      <CardContent className="p-0">
                        <div className="flex items-center bg-zinc-950 px-4 py-2 border-b border-zinc-800">
                          <div className="flex space-x-2 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-xs text-gray-400">check-insta-status.py</div>
                        </div>
                        <Markdown className="max-w-none prose dark:prose-invert max-h-[500px] overflow-y-auto">
                          {`
### 📁 Arquivo: \`check-insta-status.py\`
<br/>
### 🔍 Linguagem: Python
<br/>
### 📦 Bibliotecas: Playwright, pytesseract, OpenCV (cv2), NumPy, Pillow (PIL), python-dotenv
<br/>

---

### 🧩 Função: \`preprocessar_imagem(imagem_array)\`
<br/>
**Descrição**: Pré-processa uma imagem para otimizar a extração de texto via OCR (Reconhecimento Óptico de Caracteres). Converte a imagem para escala de cinza, aplica binarização (thresholding) para aumentar o contraste e remove ruídos. Opcionalmente, salva a imagem processada em disco.
<br/>
<br/>
**Parâmetros**:
- \`imagem_array\` (numpy.ndarray): Array NumPy representando a imagem (formato BGR do OpenCV).
<br/>
<br/>
**Retorno**:  
- \`imagem_tratada\` (numpy.ndarray): Imagem processada em escala de cinza e binarizada.
<br/>
<br/>
**Observações**:
O salvamento da imagem é controlado pela variável de ambiente \`SAVE_SCREENSHOT\`.
<br/>
<br/>

---

### 🧩 Função: \`verificar_anuncio_ocr(url)\`
<br/>
<br/>
**Descrição**: Verifica se um perfil do Instagram está ativo ou foi removido. Acessa a URL fornecida via Playwright (Chromium), captura a tela, aplica pré-processamento de imagem e usa OCR (pytesseract) para extrair texto. Analisa o texto em busca de frases indicativas de inatividade.
<br/>
<br/>
**Parâmetros**:  
- \`url\` (string): URL do perfil do Instagram a ser verificado.
<br/>
<br/>
**Retorno**:  
- \`bool\`: \`True\` se o perfil estiver ativo (não contém frases de inatividade), \`False\` caso contrário.
<br/>
<br/>
**Fluxo**:  
1. Abre o navegador em modo headless e captura um screenshot da página.  
2. Pré-processa a imagem com OpenCV e pytesseract.  
3. Extrai texto e verifica padrões como "isn't available" ou "não está disponível".
<br/>
<br/>
**Observações**: 
- Variáveis de ambiente controlam comportamentos opcionais (\`SAVE_SCREENSHOT\`, \`DEBUG\`).  
- A função depende de bibliotecas externas para navegação web e OCR.
<br/>
<br/>
**Exemplo de uso**:
\`\`\`python
url_anuncio = "https://www.instagram.com/signopoderoso/#"
print(f"Perfil Ativo: {verificar_anuncio_ocr(url_anuncio)}")
\`\`\`
`}</Markdown>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Link href="#pricing">
              <Button className="bg-[#2d3035] hover:bg-[#3d4045] text-white group">
                Testar Grátis
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Plans & Pricing */}
      <section id="pricing" className="py-24 px-6 relative bg-gradient-to-b from-white/[0.06] to-black">
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#1f2937]/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-[#1f2937]/30 text-[#d1d5db] hover:bg-[#1f2937]/30 border border-[#374151]/30">
              Preços
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Planos & Preços</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades de documentação
            </p>

            <div className="flex items-center justify-center mt-8 mb-12 space-x-3">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Mensal</span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-[#374151]"
              />
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                Anual
                <Badge className="ml-2 bg-[#1f2937]/50 text-[#d1d5db] hover:bg-[#1f2937]/50">Economize 20%</Badge>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn}>
              <Card className="border border-gray-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 transition-colors h-full">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Gratuito</h3>
                    <p className="text-zinc-400 text-sm mb-6">Para desenvolvedores individuais e projetos pequenos</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">R$0</span>
                      <span className="text-zinc-400 ml-2">/ mês</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">30.000 créditos mensais</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">Chat com IA: até 20 mensagens/mês</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">Geração de README: até 3 arquivos/mês</span>
                      </li>
                    </ul>
                  </div>

                  <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                    Começar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="border border-[#374151]/50 bg-zinc-900/50 backdrop-blur-sm hover:border-[#1f2937] transition-colors h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#374151] text-white text-xs font-medium px-3 py-1">
                  Popular
                </div>
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Pro</h3>
                    <p className="text-zinc-400 text-sm mb-6">Para times e projetos em crescimento</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">R${isYearly ? '839,90' : '89,90'}</span>
                      <span className="text-zinc-400 ml-2">/ mês</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">1.000.000 créditos mensais</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">Chat com IA: até 250 mensagens/mês</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">Geração de README: até 20 arquivos/mês</span>
                      </li>
                    </ul>                  </div>
                  <Button className="w-full bg-[#374151] hover:bg-[#1f2937] text-white">
                    Experimente Grátis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 transition-colors h-full">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                    <p className="text-zinc-400 text-sm mb-6">Para grandes equipes e organizações</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">R${isYearly ? '1869,90' : '199,90'}</span>
                      <span className="text-zinc-400 ml-2">/ mês</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">4.000.000 créditos mensais</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">Chat com IA: até 1.000 mensagens/mês</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-[#374151] mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">Geração de README: até 100 arquivos/mês</span>
                      </li>
                    </ul>
                  </div>
                  <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                    Falar com Vendas
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why DocumentAI */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-[#1f2937]/30 text-[#d1d5db] hover:bg-[#1f2937]/30 border border-[#374151]/30">
              Vantagens
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Por que escolher o DocumentAI</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Junte-se a milhares de desenvolvedores que confiam no DocumentAI para documentar seus projetos
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 relative">
                      <div className="w-16 h-16 bg-[#1f2937]/30 rounded-full flex items-center justify-center mx-auto">
                        <stat.icon className="h-8 w-8 text-[#374151]" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <p className="text-zinc-400">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 transition-colors">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-zinc-300 mb-6 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-zinc-400">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/20 to-purple-900/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1f2937]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para documentar de forma inteligente?</h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de desenvolvedores que economizam horas toda semana com documentação por IA.
            </p>
            <Button size="lg" className="bg-[#374151] hover:bg-[#1f2937] text-white text-lg px-8 py-6 h-auto group">
              Experimente o DocumentAI Grátis
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-zinc-400 mt-4">Não requer cartão de crédito • 7 dias grátis</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 px-6 border-t border-zinc-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#374151] to-[#1f2937] rounded-full blur opacity-70"></div>
                <div className="relative bg-black rounded-full p-1">
                  <Code className="h-5 w-5 text-[#374151]" />
                </div>
              </div>
              <span className="font-semibold text-white">DocumentAI</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link href="#" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="hover:text-white transition-colors flex items-center">
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Link>
              <Link
                href="https://qrotech.com.br"
                className="hover:text-white transition-colors flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                qrotech.com.br
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2025 DocumentAI · Desenvolvido por qrotech.com.br
          </div>
        </div>
      </footer>
    </div>
  )
}