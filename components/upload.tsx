"use client"
import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UploadIcon, FileArchive, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export function Upload() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const { user } = useAuth()

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCharacters, setIsCheckingCharacters] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [visibility, setVisibility] = useState("");
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenEstimation, setTokenEstimation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const reposPerPage = 9;

  // Cálculo de índices para a página atual
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = Array.isArray(filteredRepos) && filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo) || [];

  const handleSearch = () => {
    setIsLoading(true)
    const lower = (str: string) => str.toLowerCase();

    const result = repos.filter((el: any) => {
      const matchesName = documentName === "" || lower(el.name).includes(lower(documentName));
      const matchesVisibility = visibility === "Privado" ? el.private === true : el.private === false;

      return matchesName && matchesVisibility;
    });

    setFilteredRepos(result);
    setIsLoading(false)
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].name.endsWith(".zip")) {
      setFile(files[0])
      handleUpload(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && files[0].name.endsWith(".zip")) {
      setFile(files[0])
      handleUpload(files[0])
    }
  }

  const handleUpload = (file: File) => {
    setIsUploading(true)

    // Simulação de upload e processamento
    setTimeout(() => {
      setIsUploading(false)
      // Aqui você redirecionaria para a página de documentação gerada
      // window.location.href = `/documentation/${documentationId}`
    }, 3000)
  }

  async function connectGithub() {
    if (!user) return router.push("/login")

    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/github/login`;
  }

  async function getReposData(token?: string) {
    setIsUploading(true)
    try {
      const response = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/repos`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem('github_token')}`,
        },
      })).json()

      setRepos(response)
      setFilteredRepos(response)
  } catch (error: any) {
      console.error(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (searchParams.get('token')) {
      localStorage.setItem('github_token', searchParams.get('token')!)

      getReposData(searchParams.get('token')!)
    } else {
      getReposData()
    }
  }, [router])

  async function handleRepoSelect(data: any) {
    setIsCheckingCharacters(true);
    const [repo_owner, repo_name] = data.full_name.split("/");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/estimate-tokens?repo_owner=${repo_owner}&repo_name=${repo_name}&token=${localStorage.getItem('github_token')}`, {
      method: "POST",
    });

    const result = await response.json();
    setIsCheckingCharacters(false);

    // Exibir modal com os dados estimados
    setTokenEstimation(result);
    setShowModal(true);
  }

  async function handleRepoDownload(data: any) {
    setIsLoading(true)
    const [repo_owner, repo_name] = data.split("/")

    const response = await (await
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/download-repo?repo_owner=${repo_owner}&repo_name=${repo_name}&token=${localStorage.getItem('github_token')}&user=${user.uid}&email=${user.email}`,
        {
          method: 'POST',
        }
      )
    ).json()

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mb-16">
      {showModal && tokenEstimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar Análise</h2>
            <p className="mb-2">Repositório: <strong>{tokenEstimation.repo}</strong></p>
            <p className="mb-2">Arquivos considerados: <strong>{tokenEstimation.files_counted}</strong></p>
            <p className="mb-2">Caracteres totais: <strong>{tokenEstimation.total_characters.toLocaleString('pt-BR')}</strong></p>
            <p className="mb-2">Tokens estimados: <strong>{tokenEstimation.estimated_tokens.toLocaleString('pt-BR')}</strong></p>
            <p className="mb-4">Custo estimado: <strong>R$ {tokenEstimation.estimated_cost_brl.toLocaleString('pt-BR')}</strong></p>

            {
              tokenEstimation.estimated_tokens.toLocaleString('pt-BR') > user.credits
                ?
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-amber-400 text-white rounded"
                >
                  Limite de créditos atingido
                </button>
                :
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => {
                      handleRepoDownload(tokenEstimation.repo); // novo nome da função original
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Confirmar Análise
                  </button>
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                    Cancelar
                  </button>
                </div>
            }

          </div>
        </div>
      )}
      {user && <div className="flex justify-center mt-4">
        <Link href="/projetos"><Button>Acessar meus projetos</Button></Link>
      </div>}
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {
            isCheckingCharacters ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Verificando quantos tokens seu projeto consumirá</h3>
                  <p className="text-muted-foreground">Estamos analisando seu projeto...</p>
                </div>
              </div>
            ) :
              isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Documentando seu projeto</h3>
                    <p className="text-muted-foreground">Estamos documentando seus códigos...</p>
                  </div>
                </div>
              ) :
                isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Processando seus projetos</h3>
                      <p className="text-muted-foreground">Estamos buscando seus códigos...</p>
                    </div>
                  </div>
                ) : repos.length ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="bg-gray-100 rounded-xl p-6 w-full">
                      <h2 className="text-xl font-semibold mb-4 text-start">Buscar Documento</h2>
                      <div className="flex gap-2 justify-between">

                        <div className="flex gap-4 w-full">
                          <input
                            type="text"
                            placeholder="Nome do Documento"
                            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm placeholder-gray-500 w-full"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSearch(); // sua função de busca
                              }
                            }}
                          />

                          <select
                            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-black"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                          >
                            <option defaultValue={''}>Tipo do repositório</option>
                            <option value={'Público'}>Público</option>
                            <option value={'Privado'}>Privado</option>
                          </select>

                          {/* <select
                      className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-black w-24"
                    >
                      <option selected>Proprietário</option>
                      <option>Sim</option>
                      <option>Não</option>
                    </select> */}
                        </div>
                        <button onClick={handleSearch} className="bg-black text-white px-6 py-2 rounded-md text-sm hover:opacity-90 transition">Buscar</button>
                      </div>
                    </div>
                    {currentRepos.map((el: any, index) => <div onClick={() => handleRepoSelect(el)} key={index} className="cursor-pointer transition-all hover:scale-105 flex flex-col items-center justify-center space-y-4 w-1/2 max-w-[300px]">
                      <FileArchive className="h-12 w-12 text-primary" />
                      <div className="space-y-2">
                        <h3 className="text-x font-medium">{el.name}</h3>
                        <a target="_blank" href={el.clone_url}><p className="text-muted-foreground">link do repo</p></a>
                      </div>
                    </div>)}
                    <div className="flex justify-center gap-4 mt-6 w-full">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Anterior
                      </button>

                      <span className="self-center">Página {currentPage}</span>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            indexOfLastRepo < filteredRepos.length ? prev + 1 : prev
                          )
                        }
                        disabled={indexOfLastRepo >= filteredRepos.length}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                ) : (
                  <div onClick={connectGithub} className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
                    <UploadIcon className="h-12 w-12 text-muted-foreground" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Importe seu projeto github aqui</h3>
                      {/* <p className="text-muted-foreground">Ou clique para selecionar um arquivo</p> */}
                    </div>
                    {/* <input type="file" id="file-upload" className="hidden" accept=".zip" onChange={handleFileChange} /> */}
                    <Button className="cursor-pointer" asChild>
                      <label htmlFor="file-upload"> <img src="/github.svg" alt="Github logo" width={16} height={16} />Conectar github</label>
                    </Button>
                  </div>
                )}
        </div>
      </CardContent>
    </Card>
  )
}
