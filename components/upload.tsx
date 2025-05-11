"use client"
import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UploadIcon, FileArchive, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"

export function Upload() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const { user } = useAuth()

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const response = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/repos`, {
      headers: {
        Authorization: `Bearer ${token || localStorage.getItem('github_token')}`,
      },
    })).json()

    setRepos(response)
    setIsUploading(false)
  }

  useEffect(() => {
    if (searchParams.get('token')) {
      localStorage.setItem('github_token', searchParams.get('token')!)

      getReposData(searchParams.get('token')!)
    }
  }, [router])

  async function handleRepoSelect(data: any) {
    setIsLoading(true)
    const [repo_owner, repo_name] = data.full_name.split("/")

    const response = await (await
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/download-repo?repo_owner=${repo_owner}&repo_name=${repo_name}&token=${localStorage.getItem('github_token')}&user=${user.uid}`,
        {
          method: 'POST',
        }
      )
    ).json()

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mb-16">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
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
                {repos.map((el: any, index) => <div onClick={() => handleRepoSelect(el)} key={index} className="flex flex-col items-center justify-center space-y-4 w-1/2 max-w-[300px]">
                  <FileArchive className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-x font-medium">{el.name}</h3>
                    <a target="_blank" href={el.clone_url}><p className="text-muted-foreground">link do repo</p></a>
                  </div>
                </div>)}
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
