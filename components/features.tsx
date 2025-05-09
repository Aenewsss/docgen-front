import type React from "react"
import { FileText, Code, FolderTree, GitBranch, Database, Layers } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Recursos Poderosos</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Nossa plataforma analisa seu código e gera documentação completa automaticamente
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Code className="h-8 w-8" />}
            title="Análise de Código"
            description="Analisa automaticamente seu código fonte para extrair estruturas, funções e comentários"
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8" />}
            title="Documentação Completa"
            description="Gera documentação detalhada com descrições de funções, parâmetros e exemplos de uso"
          />
          <FeatureCard
            icon={<FolderTree className="h-8 w-8" />}
            title="Estrutura do Projeto"
            description="Mapeia a estrutura do projeto e as relações entre arquivos e componentes"
          />
          <FeatureCard
            icon={<GitBranch className="h-8 w-8" />}
            title="Fluxo de Trabalho"
            description="Identifica e documenta fluxos de trabalho e processos dentro do código"
          />
          <FeatureCard
            icon={<Database className="h-8 w-8" />}
            title="Modelos de Dados"
            description="Extrai e documenta modelos de dados, esquemas e relacionamentos"
          />
          <FeatureCard
            icon={<Layers className="h-8 w-8" />}
            title="Arquitetura"
            description="Visualiza a arquitetura do projeto e as dependências entre componentes"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
      <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
