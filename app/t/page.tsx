import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h1 className="text-lg font-semibold">{'<>'} DocumentAI</h1>
        <nav className="hidden md:flex gap-6 text-sm text-white/80">
          <a href="#">Recursos</a>
          <a href="#">Exemplos</a>
          <a href="#">Preços</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-white/80">Entrar</Button>
          <Button className="bg-white text-black hover:bg-white/90">Cadastrar</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-4 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Documente seu código automaticamente</h2>
        <p className="text-white/70 mb-8">Importe seu projeto git e obtenha uma documentação completa e organizada em segundos</p>

        <div className="border border-white/10 rounded-xl p-8 bg-white/5">
          <div className="flex flex-col items-center gap-4">
            <UploadCloud className="w-10 h-10 text-white/40" />
            <p className="text-white/70">Importe seu projeto github aqui</p>
            <Button variant="outline" className="bg-white text-black hover:bg-white">Conectar github</Button>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="bg-white/5 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-2">Recursos Poderosos</h3>
          <p className="text-white/70 mb-12">Nossa plataforma analisa seu código e gera documentação completa automaticamente</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              ["Análise de Código", "Analisa automaticamente seu código fonte para extrair estruturas, funções e comentários"],
              ["Documentação Completa", "Gera documentação detalhada com descrições de funções, parâmetros e exemplos de uso"],
              ["Estrutura do Projeto", "Mapeia a estrutura do projeto e as relações entre arquivos e componentes"],
              ["Fluxo de Trabalho", "Identifica e documenta fluxos de trabalho e processos dentro do código"],
              ["Modelos de Dados", "Extrai e documenta modelos de dados, esquemas e relacionamentos"],
              ["Arquitetura", "Visualiza a arquitetura do projeto e as dependências entre componentes"]
            ].map(([title, desc]) => (
              <div key={title} className="bg-black/40 border border-white/10 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">{title}</h4>
                <p className="text-white/70 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemplos */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-2">Exemplos de Documentação</h3>
          <p className="text-white/70 mb-8">Veja como sua documentação ficará após o processamento</p>

          <div className="inline-flex border border-white/10 rounded overflow-hidden text-sm mb-6">
            <button className="px-4 py-2 bg-white text-black">Frontend</button>
            <button className="px-4 py-2 text-white/70 hover:bg-white/10">Backend</button>
          </div>

          <div className="text-left bg-zinc-900 p-6 rounded-lg text-sm font-mono leading-relaxed">
            <h4 className="text-white mb-4">📄 Documentação Técnica: <code className="text-green-400">`page.tsx`</code></h4>
            <p className="text-white/70 mb-1"><strong>📁 Arquivo:</strong> temp_repositories/Aenewss.../page.tsx</p>
            <p className="text-white/70 mb-4"><strong>📦 Linguagem:</strong> TypeScript (React / Next.js)</p>
            <p className="text-white/70"><strong>📚 Bibliotecas / Frameworks:</strong></p>
            <ul className="list-disc list-inside text-white/70">
              <li>React</li>
              <li>Next.js</li>
              <li>React Flow <em>(diagramas de fluxo)</em></li>
              <li>Firebase <em>(autenticação e realtime database)</em></li>
              <li>Material-UI <em>(ícones)</em></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-8 text-white/40 text-sm">
        © 2025 DocumentAI. Todos os direitos reservados <a className="underline" href="https://gotech.com.br">gotech.com.br</a>
      </footer>
    </main>
  )
}