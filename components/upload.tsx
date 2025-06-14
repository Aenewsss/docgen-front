"use client"
import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UploadIcon, FileArchive, Loader2, Link2, ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import RepoMessageModal from "./repo-message-modal"
import { ref, update } from "firebase/database"
import { db } from "@/firebase/config"
import { Switch } from "./ui/switch"

export function Upload() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const { user } = useAuth()

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCharacters, setIsCheckingCharacters] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [visibility, setVisibility] = useState("");
  const [type, setType] = useState("");
  const [filteredRepos, setFilteredRepos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenEstimation, setTokenEstimation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
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
      const matchesVisibility = visibility ? visibility === "Privado" ? el.private === true : el.private === false : true
      const matchesType = type ? type == el.type : true

      return matchesName && matchesVisibility && matchesType;
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
    if (!token) return
    setIsUploading(true)

    try {
      const response = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/repos?user_id=${user.uid}&email=${user.email}`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem('github_token')}`,
        },
      })).json()

      setRepos(response.repos)
      setFilteredRepos(response.repos)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Atualiza o github_token do usuário no Firebase
  async function updateUserGithubToken(token: string) {
    if (!user?.uid) return;
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, {
      github_token: token,
    });
  }

  useEffect(() => {
    if (!user) return

    if (searchParams.get('token')) {
      const token = searchParams.get('token')!;
      localStorage.setItem('github_token', token);
      updateUserGithubToken(token);
      getReposData(token);
    } else {
      getReposData(user?.github_token);
    }

  }, [router, user]);

  async function handleRepoSelect(data: any) {
    setIsCheckingCharacters(true);
    const [repo_owner, repo_name] = data.full_name.split("/");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/estimate-tokens?repo_owner=${repo_owner}&repo_name=${repo_name}&token=${user.github_token}`, {
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

    if (autoUpdate) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/create-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.github_token}`,
        },
        body: JSON.stringify({
          repo_owner,
          repo_name,
          user_id: user.uid,
          email: user.email,
        }),
      });
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/download-repo?repo_owner=${repo_owner}&repo_name=${repo_name}&token=${user.github_token}&user=${user.uid}&email=${user.email}`,
      {
        method: 'POST',
      }
    )

    setIsLoading(false)
  }

  function clearMessage() {
    const userRef = ref(db, `users/${user.uid}`)

    update(userRef, {
      repo_message: '',
      repo_name: '',
      repo_error: false,
    })

  }

  return (
    <Card className="w-full max-w-6xl mx-auto mb-16">
      <RepoMessageModal repoMessage={user?.repo_message} repoError={user?.repo_error} clearMessage={clearMessage} />

      {showModal && tokenEstimation && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 z-[60] flex items-center justify-center">
          <div className="bg-white dark:bg-black rounded-lg p-6 max-w-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Sobre o projeto</h2>
            <p className="mb-2">Organização: <strong>{tokenEstimation.repo.split('/')[0]}</strong></p>
            <p className="mb-2">Repositório: <strong>{tokenEstimation.repo.split('/')[1]}</strong></p>
            <p className="mb-2">Arquivos considerados: <strong>{tokenEstimation.files_counted}</strong></p>
            <p className="mb-2">Caracteres totais: <strong>{tokenEstimation.total_characters?.toLocaleString('pt-BR')}</strong></p>
            <p className="mb-2">Créditos estimados: <strong>{tokenEstimation.estimated_tokens?.toLocaleString('pt-BR')}</strong></p>

            <div className="flex justify-between my-10">
              <label htmlFor="autoUpdate" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Atualizar automaticamente quando houver mudanças na branch principal do repo
              </label>
              <Switch checked={autoUpdate} onCheckedChange={(checked) => setAutoUpdate(checked)} />
            </div>

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
                <div className="flex justify-start gap-4 mt-4">
                  <button
                    onClick={() => {
                      handleRepoDownload(tokenEstimation.repo); // novo nome da função original
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-black dark:bg-white dark:text-black text-white rounded hover:scale-105 transition-all shadow-md shadow-white"
                  >
                    DocumentAI
                  </button>
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-500 rounded hover:scale-105 transition-all ">
                    Cancelar
                  </button>
                </div>
            }

          </div>
        </div>
      )}
      <CardContent className="p-6">
        <div
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
              isLoading || user?.repo_loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 md:min-h-[600px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Documentando seu projeto</h3>
                    <p className="text-muted-foreground">Estamos documentando seus códigos...</p>
                  </div>
                </div>
              ) :
                isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 md:min-h-[600px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Processando seus projetos</h3>
                      <p className="text-muted-foreground">Estamos buscando seus códigos...</p>
                    </div>
                  </div>
                ) : repos?.length ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full">
                      <h2 className="text-xl font-semibold mb-4 text-start">Buscar Documento</h2>
                      <div className="flex gap-2 justify-between">

                        <div className="flex gap-4 w-full">
                          <input
                            type="text"
                            placeholder="Nome do Documento"
                            className="dark:text-black px-4 py-2 rounded-md border border-gray-300 bg-white text-sm placeholder-gray-500 w-full"
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
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          >
                            <option defaultValue={''}>Tipo</option>
                            <option value={'User'}>Usuário</option>
                            <option value={'Organization'}>Organização</option>
                          </select>
                          <select
                            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-black"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                          >
                            <option defaultValue={''}>Visiblidade</option>
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
                        <button onClick={handleSearch} className="bg-zinc-900 dark:bg-white dark:text-black text-white px-6 py-2 rounded-md text-sm hover:opacity-90 transition">Buscar</button>
                      </div>
                    </div>
                    <div className="md:min-h-[380px] flex flex-wrap gap-4 justify-center">

                      {currentRepos.map((el: any, index) => <div onClick={() => handleRepoSelect(el)} key={index} className="cursor-pointer transition-all hover:scale-105 flex flex-col items-center text-center justify-center space-y-4 w-1/2 max-w-[300px]">
                        <FileArchive className="h-12 w-12 text-primary" />
                        <div className="space-y-2">
                          <h3 className="text-x font-medium">{el.name}</h3>
                          <a target="_blank" href={el.clone_url}>
                            <p className="text-muted-foreground flex gap-1 items-center justify-center border-b border-transparent hover:border-muted-foreground mx-4"><Link2 className="mt-1" width={16} height={16} />github</p>
                          </a>
                        </div>
                      </div>)}
                    </div>
                    <div className="flex justify-center gap-4 mt-6 w-full">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-zinc-900 rounded disabled:opacity-50"
                      >
                        <ChevronsLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-zinc-900 rounded disabled:opacity-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <span className="self-center">{currentPage} de {Math.ceil(filteredRepos.length / reposPerPage)}</span>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            indexOfLastRepo < filteredRepos.length ? prev + 1 : prev
                          )
                        }
                        disabled={indexOfLastRepo >= filteredRepos.length}
                        className="px-4 py-2 bg-gray-200 dark:bg-zinc-900 rounded disabled:opacity-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => setCurrentPage(Math.ceil(filteredRepos.length / reposPerPage))}
                        disabled={currentPage === Math.ceil(filteredRepos.length / reposPerPage)}
                        className="px-4 py-2 bg-gray-200 dark:bg-zinc-900 rounded disabled:opacity-50"
                      >
                        <ChevronsRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div onClick={connectGithub} className="border-2 rounded-lg border-dashed p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer group hover:bg-zinc-900 hover:text-white transition-all">
                    <UploadIcon className="h-12 w-12 text-muted-foreground group-hover:text-white transition-all" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">Importe seu projeto github aqui</h3>
                      {/* <p className="text-muted-foreground">Ou clique para selecionar um arquivo</p> */}
                    </div>
                    {/* <input type="file" id="file-upload" className="hidden" accept=".zip" onChange={handleFileChange} /> */}
                    <Button className="cursor-pointer group-hover:scale-105 transition-all group-hover:bg-white group-hover:text-black" asChild>
                      <label htmlFor="file-upload">
                        <img className="group-hover:hidden dark:hidden" src="/github.svg" alt="Github logo" width={16} height={16} />
                        <img className="dark:block hidden group-hover:block" src="/github-black.svg" alt="Github logo black" width={16} height={16} />
                        Conectar github
                      </label>
                    </Button>
                  </div>
                )}
        </div>
      </CardContent>
    </Card>
  )
}
