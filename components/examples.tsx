import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import Markdown from 'markdown-to-jsx'

export function Examples() {
  return (
    <section id="examples" className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Exemplos de Documentação</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Veja como sua documentação ficará após o processamento
          </p>
        </div>

        <Tabs defaultValue="frontend" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            {/* <TabsTrigger value="fullstack">Full Stack</TabsTrigger> */}
          </TabsList>
          <TabsContent value="frontend" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <Markdown className="max-w-none prose dark:prose-invert max-h-[500px] overflow-y-auto">
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
          <TabsContent value="backend" className="space-y-4">
            <Card>
              <CardContent className="p-4">
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
          <TabsContent value="fullstack" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="Exemplo de documentação full stack"
                  width={1200}
                  height={600}
                  className="rounded-lg object-cover w-full"
                />
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
