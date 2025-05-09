import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="fullstack">Full Stack</TabsTrigger>
          </TabsList>
          <TabsContent value="frontend" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="Exemplo de documentação frontend"
                  width={1200}
                  height={600}
                  className="rounded-lg object-cover w-full"
                />
              </CardContent>
            </Card>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Documentação React</h3>
              <p className="text-muted-foreground">
                Documentação completa de componentes, hooks, e fluxo de dados em aplicações React
              </p>
            </div>
          </TabsContent>
          <TabsContent value="backend" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="Exemplo de documentação backend"
                  width={1200}
                  height={600}
                  className="rounded-lg object-cover w-full"
                />
              </CardContent>
            </Card>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Documentação API</h3>
              <p className="text-muted-foreground">
                Documentação detalhada de rotas, controladores, modelos e serviços de backend
              </p>
            </div>
          </TabsContent>
          <TabsContent value="fullstack" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="Exemplo de documentação full stack"
                  width={1200}
                  height={600}
                  className="rounded-lg object-cover w-full"
                />
              </CardContent>
            </Card>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Documentação Full Stack</h3>
              <p className="text-muted-foreground">
                Documentação integrada de frontend e backend com fluxos de dados completos
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
