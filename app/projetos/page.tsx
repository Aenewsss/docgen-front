'use client'
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { get, onValue, push, ref } from "firebase/database";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"

export default function Page() {

    const { user } = useAuth()
    const [projects, setProjects] = useState<string[]>([]);
    const [currentProjectFolder, setCurrentProjectFolder] = useState<any>();
    const [currentPath, setCurrentPath] = useState('');
    const [doc, setDoc] = useState('');
    const [messages, setMessages] = useState<{ text: string, fromAI: boolean }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [previewMessage, setPreviewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [readmeIsLoading, setReadmeIsLoading] = useState(false);

    const entries = currentProjectFolder && Object.entries(currentProjectFolder);
    const files = entries?.filter(([_, value]: any[]) => value.extension);
    const folders = entries?.filter(([key, value]: any[]) => !value.extension && key != 'summary');

    async function getData() {
        const dbRef = ref(db, `documentations/${user.uid}`)

        const result = await get(dbRef)

        if (result.exists()) {
            const data = result.val()

            setProjects(Object.keys(data))
        }
    }

    useEffect(() => {
        user?.uid && getData()
    }, [user]);

    useEffect(() => {
        user?.uid && chooseProject()
    }, [currentPath]);

    async function chooseProject(project?: string) {
        console.log(project)
        const path = 'documentations/' + (currentPath || `${user.uid}/${project}`)
        const dbRef = ref(db, path)

        const result = await get(dbRef)
        if (result.exists()) {
            const data = result.val()
            setCurrentProjectFolder(data)
            !currentPath && setCurrentPath(path.includes('documentations') ? path.split('/').slice(1).join('/') : path)
        }
    }

    async function generateReadme() {
        setReadmeIsLoading(true)
        try {
            const response = await (await fetch(`${process.env.NEXT_PUBLIC_N8N_README}`, {
                method: 'POST',
                body: JSON.stringify({
                    project: currentPath.split('/')[1],
                    user: user.uid
                })
            })).json()

            const markdownContent = response.data

            // Cria um blob do conteúdo .md
            const blob = new Blob([markdownContent], { type: 'text/markdown' })
            const url = URL.createObjectURL(blob)

            // Cria e clica num link invisível
            const a = document.createElement('a')
            a.href = url
            a.download = `${currentPath.split('/')[1] || 'README'}.md`
            a.click()

            // Libera a memória
            URL.revokeObjectURL(url)
        } catch (e: any) {
            alert(`Erro: ${e.message}`)
        } finally {
            setReadmeIsLoading(false)
        }
    }

    async function sendNewMessage() {
        setPreviewMessage(newMessage)
        setNewMessage('')
        setIsLoading(true)
        const response = await (await fetch(`${process.env.NEXT_PUBLIC_N8N_CHAT}`, {
            method: 'POST',
            body: JSON.stringify({
                newMessage,
                project: currentPath.split('/')[1]
            })
        })).json()

        const userMessage = { text: newMessage, fromAI: false }
        const aiMessage = { text: response.output, fromAI: true }

        setPreviewMessage('')
        setMessages(prev => [...prev, userMessage, aiMessage])
        setIsLoading(false)

        // 🔥 Salvar no Firebase
        const chatRef = ref(db, `chats/${user.uid}/${currentPath.split('/')[1]}`)
        await push(chatRef, {
            userMessage: userMessage.text,
            aiMessage: aiMessage.text,
            createdAt: new Date().toISOString()
        })
    }

    useEffect(() => {
        if (!user || !currentPath) return;

        const projectName = currentPath.split("/")[1];
        const chatRef = ref(db, `chats/${user.uid}/${projectName}`);

        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formatted = Object.values(data).map((entry: any) => ([
                    { text: entry.userMessage, fromAI: false },
                    { text: entry.aiMessage, fromAI: true }
                ])).flat();

                setMessages(formatted);
            }
        });

        return () => unsubscribe();
    }, [user, currentPath]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className={`flex-1 flex flex-col items-center justify-center ${projects.length ? `px-4 py-12` : `-mt-20`}`}>
                {projects.length ?
                    <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Meu projetos
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Aqui estarão listados seus projetos com uma documentação completa e organizada
                        </p>

                        {currentPath && <div className="w-full max-w-3xl border rounded-lg p-4 mb-12 shadow-md">
                            <h2 className="text-xl font-semibold mb-0">Converse com a IA DocGen</h2>
                            <p className="mb-4 text-muted-foreground">Tire dúvidas sobre o seu projeto</p>
                            <div className="bg-muted-foreground/10 rounded-md p-4 space-y-4 max-h-[400px] overflow-y-auto">
                                <div className="flex gap-2 items-start">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center">
                                        <Image className="w-[70%] h-[70%] object-contain" src="/favicon.svg" width={8} height={8} alt="DocGen Icon" />
                                    </div>
                                    <p className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                                        Olá! Como posso te ajudar com seu projeto?
                                    </p>
                                </div>
                                {
                                    messages.map((message, index) =>
                                        message.fromAI ? <div key={index} className="flex gap-2 items-start">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center">
                                                <Image className="w-[70%] h-[70%] object-contain" src="/favicon.svg" width={8} height={8} alt="DocGen Icon" />
                                            </div>
                                            <p className="bg-white p-3 rounded-lg shadow-sm max-w-[80%] text-start">
                                                <ReactMarkdown>{message.text}</ReactMarkdown>
                                            </p>
                                        </div>
                                            : <div className="flex gap-2 items-start justify-end">
                                                <p className="bg-primary text-white p-3 rounded-lg shadow-sm max-w-[80%]">
                                                    {message.text}
                                                </p>
                                            </div>
                                    )
                                }
                                {
                                    previewMessage && <div className="flex gap-2 items-start justify-end">
                                        <p className="bg-primary text-white p-3 rounded-lg shadow-sm max-w-[80%]">
                                            {previewMessage}
                                        </p>
                                    </div>
                                }
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 px-4 py-2 border rounded-md shadow-sm"
                                    value={newMessage}
                                    onChange={(e: any) => setNewMessage(e.target.value)}
                                    onKeyDown={e => {
                                        if (!isLoading && e.key == 'Enter') sendNewMessage()
                                    }}
                                />
                                <Button onClick={() => !isLoading && sendNewMessage()} className="px-4 py-2">{isLoading ? <Loader2 className="h-12 w-12 animate-spin text-white" /> : 'Enviar'}</Button>
                            </div>
                        </div>}
                        {currentPath && <div className="text-start flex gap-2">
                            <span onClick={() => setCurrentPath('')} className="text-muted-foreground cursor-pointer hover:underline">Projetos /</span>
                            {currentPath.split("/").filter((_, i) => i > 0).map((el, index, arr) =>
                                <span onClick={() => {
                                    if (index < arr.length - 1) {
                                        console.log(currentPath, currentPath.split('/').slice(0, index + 2).join('/'), index)
                                        setCurrentPath(currentPath.split('/').slice(0, index + 2).join('/'))
                                    }
                                }} className={`${index < arr.length - 1 && 'text-muted-foreground cursor-pointer group'}`}><span className="transition-all group-hover:underline">{el}</span>{index < arr.length - 1 && <>&nbsp;/&nbsp;</>}</span>
                            )}
                        </div>}
                    </div>
                    : <div className="relative flex items-center justify-center">
                        <Image className="w-screen h-full max-h-screen object-cover" width={300} height={300} src="/empty-state-docgen-projects.jpg" alt="Empty State" />
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>

                        <h1 className="absolute text-4xl text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight sm:text-5xl md:text-6xl">Nenhum projeto disponível</h1>
                        <Link className="absolute text-lg mt-32  transition-all hover:backdrop-blur-lg hover:scale-105 text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight" href="/">Selecionar projeto</Link>
                    </div>
                }
                {
                    doc && <div className="fixed top-0 start-0 w-screen h-screen z-50 flex justify-center items-center">
                        <div className="absolute w-full h-full backdrop-blur-md" onClick={() => setDoc('')}></div>
                        <Card className="absolute z-10 h-[90%] w-[600px] p-4 pt-10 overflow-auto resize-x">
                            <ReactMarkdown>{doc}</ReactMarkdown>
                            <button onClick={() => setDoc('')} className="bg-red-600 absolute top-2 end-2 text-white w-6 h-6 rounded-full text-center transition-all hover:scale-105 cursor-pointer">X</button>
                        </Card>
                    </div>
                }
                <div className="flex gap-4 flex-wrap max-w-3xl justify-center">
                    {
                        !currentPath ? projects?.map((project, index) =>
                            <div key={index} className="flex flex-col gap-2">
                                <Card onClick={() => chooseProject(project)} className="h-40 w-80 flex justify-center items-center cursor-pointer transition-all hover:scale-105">
                                    {project}
                                </Card>
                                <Button onClick={() => chooseProject(project)} className="transition-all hover:scale-105 flex self-center">Acessar o projeto</Button>
                            </div>
                        )
                            :
                            <div className="flex justify-between gap-10">
                                {files.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Image width={24} height={24} src="/files.svg" alt="Files svg" />
                                            <h3>Arquivos</h3>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            {files.map(([key, value]: any[], index: number) => (
                                                <Card
                                                    key={index}
                                                    onClick={() => setDoc(value.content)}
                                                    className="h-40 w-80 flex flex-col justify-center items-center cursor-pointer transition-all hover:scale-105 relative p-2 group"
                                                >
                                                    <div>
                                                        <h3 className="font-semibold absolute top-0 start-2">{key + '.' + value.extension}</h3>
                                                        <p>{value.content.slice(0, 100)}</p>
                                                    </div>
                                                    <div className="absolute top-0 start-0 w-full h-full backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100">
                                                        <p className="uppercase font-semibold text-xl">Ver documentação</p>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>)}
                                {folders.length > 0 && (
                                    <div className="flex flex-col gap-2 mb-6">
                                        <div className="flex gap-2">
                                            <Image width={24} height={24} src="/folders.svg" alt="Folders svg" />
                                            <h3>Pastas</h3>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            {folders.map(([key]: any[], index: number) => (
                                                <Card
                                                    key={index}
                                                    onClick={() => setCurrentPath(currentPath + "/" + key)}
                                                    className="h-40 w-80 flex justify-center items-center cursor-pointer transition-all hover:scale-105"
                                                >
                                                    {key}
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>}
                    {
                        currentPath &&
                        <Button disabled={readmeIsLoading} onClick={generateReadme} variant="outline" className="fixed bottom-10 right-10">
                            Gerar README.md
                            {readmeIsLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
                        </Button>
                    }
                </div>
            </main>
            <footer className={`border-t py-6 md:py-8 flex items-center justify-center gap-4 md:flex-row md:gap-8 ${!projects.length && `absolute bottom-0 left-0 w-full backdrop-blur-sm h-fit -mb-4`}`}>
                <p className={`text-center text-sm ${!projects.length ? `text-white` : `text-muted-foreground`}`}>© 2025 DocGen. Todos os direitos reservados.
                    <a className={`underline ${!projects.length ? `text-white` : `text-black`}`} href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
        </div>
    )
}