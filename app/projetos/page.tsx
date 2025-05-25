'use client'
import { Header } from "@/components/header";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { get, onValue, push, ref } from "firebase/database";
import { CirclePlus, Eye, Github, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown"
import { ToastContainer, toast } from 'react-toastify';

export default function Page() {

    const { loading, user } = useAuth()
    const [projects, setProjects] = useState<string[]>([]);
    const [currentProjectFolder, setCurrentProjectFolder] = useState<any>();
    const [currentPath, setCurrentPath] = useState('');
    const [doc, setDoc] = useState('');
    const [messages, setMessages] = useState<{ text: string, fromAI: boolean }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [previewMessage, setPreviewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [readmeContent, setReadmeContent] = useState('');
    const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);

    async function fetchLastReadme() {
        if (!user || !currentPath) return;
        setReadmeContent(currentProjectFolder?.lastReadme);
        setIsReadmeModalOpen(true);
    }

    async function updateRepoReadme() {
        if (!user || !currentPath || !currentProjectFolder?.lastReadme) return;
        try {
            toast("Atualizando README no GitHub...", { position: 'bottom-center' });
            const response = await fetch(`${process.env.NEXT_PUBLIC_N8N_UPDATE_README}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project: currentPath.split('/')[1],
                    user: user.uid,
                    userEmail: user.email,
                })
            });
            const data = await response.json()
            toast(<p>README atualizado com sucesso no GitHub! Clique <a href={data?.html_url} className="underline text-blue-400">aqui</a> para visualizar</p>, { position: 'bottom-center' });
        } catch (e: any) {
            console.error("Erro ao atualizar README no GitHub:", e.message);
            toast("Erro ao atualizar o README no GitHub.", { position: 'bottom-center' });
        }
    }

    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const entries = currentProjectFolder && Object.entries(currentProjectFolder);
    const files = entries?.filter(([_, value]: any[]) => value.extension);
    const folders = entries?.filter(([key, value]: any[]) => !value.extension && key != 'summary' && key != 'lastReadme');

    async function getData() {
        setProjectsLoading(true)
        const dbRef = ref(db, `documentations/${user.uid}`)

        onValue(dbRef, (snapshot) => {
            const data = snapshot.val()

            setProjects(Object.keys(data))
        });

        setProjectsLoading(false)
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

        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setCurrentProjectFolder(data)
                !currentPath && setCurrentPath(path.includes('documentations') ? path.split('/').slice(1).join('/') : path)
            }
        })
    }

    async function generateReadme() {
        try {
            toast("O README será enviado por email!", { position: 'bottom-center' });
            fetch(`${process.env.NEXT_PUBLIC_N8N_README}`, {
                method: 'POST',
                body: JSON.stringify({
                    project: currentPath.split('/')[1],
                    user: user.uid,
                    userEmail: user.email
                })
            })
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async function sendNewMessage() {
        setPreviewMessage(newMessage)
        setNewMessage('')
        setIsLoading(true)
        scrollToBottom()
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
        scrollToBottom()
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
                scrollToBottom()
            }
        });

        return () => unsubscribe();
    }, [user, currentPath]);

    if (loading || projectsLoading) return <Loading />

    return (
        <div className="min-h-screen flex flex-col">
            {/* Modal de visualização do README */}
            {isReadmeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[70]">
                    <div className="bg-white max-w-3xl w-full p-6 rounded-md relative">
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                            onClick={() => setIsReadmeModalOpen(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Último README.md</h2>
                        <div className="prose max-h-[70vh] overflow-y-auto">
                            <ReactMarkdown>{readmeContent}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
            <Header />
            <main className={`flex-1 flex flex-col ${projects.length ? `` : `-mt-20`}`}>
                {projects.length ?
                    !currentPath
                        ? <section className="mt-20 w-full flex flex-col items-center">
                            <h1 className="text-5xl font-semibold">Meus Projetos</h1>
                            <p className="text-xl text-muted-foreground mb-6">Aqui estão listados todos seus projetos documentados.</p>
                            {projects?.map((project, index) =>
                                <div key={index} className="flex flex-col gap-2">
                                    <Card onClick={() => chooseProject(project)} className="h-40 w-80 flex justify-center items-center cursor-pointer transition-all hover:scale-105">
                                        {project}
                                    </Card>
                                    <Button onClick={() => chooseProject(project)} className="transition-all hover:scale-105 flex self-center">Acessar o projeto</Button>
                                </div>
                            )}
                        </section>
                        : <div className="w-full flex gap-10 flex-1">
                            {/* DocumentAI Chat */}
                            <div className="p-4 text-start w-1/2 shadow-md flex-1 flex flex-col justify-between bg-black">
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-semibold mb-0 text-white">Converse com a DocumentAI</h2>
                                    <p className="mb-4 text-muted-foreground">Tire dúvidas sobre o seu projeto</p>
                                    <div className=" py-4 border-t border-[rgb(30,30,30)] space-y-4 h-[calc(100vh-300px)] overflow-y-auto">
                                        <div className="flex gap-2 items-start">
                                            <div className="w-10 h-10 bg-[rgb(30,30,30)] rounded-full flex justify-center items-center">
                                                <Image className="w-[60%] h-[60%] object-contain" src="/favicon.svg" width={8} height={8} alt="DocumentAI Icon" />
                                            </div>
                                            <p className="bg-[rgb(30,30,30)] p-3 rounded-lg shadow-[rgb(40,40,40)] shadow-md max-w-[80%] text-white">
                                                Olá! Como posso te ajudar com seu projeto?
                                            </p>
                                        </div>
                                        {
                                            messages.map((message, index) =>
                                                message.fromAI ? <div key={index} className="flex gap-2 items-start">
                                                    <div className="w-8 h-8 bg-[rgb(30,30,30)] rounded-full flex justify-center items-center">
                                                        <Image className="w-[70%] h-[70%] object-contain" src="/favicon.svg" width={8} height={8} alt="DocumentAI Icon" />
                                                    </div>
                                                    <p className="bg-[rgb(30,30,30)] text-white p-3 rounded-lg shadow-sm max-w-[80%] text-start">
                                                        <ReactMarkdown>{message.text}</ReactMarkdown>
                                                    </p>
                                                </div>
                                                    :
                                                    <div key={index} className="flex gap-2 items-start justify-end">
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
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2 ">
                                    <input
                                        type="text"
                                        placeholder="Digite sua mensagem..."
                                        className="flex-1 px-4 py-2 border rounded-md shadow-sm bg-[rgba(20,20,20)] text-white outline-white"
                                        value={newMessage}
                                        onChange={(e: any) => setNewMessage(e.target.value)}
                                        onKeyDown={e => {
                                            if (!isLoading && e.key == 'Enter') sendNewMessage()
                                        }}
                                    />
                                    <Button variant={"outline"} onClick={() => !isLoading && sendNewMessage()} className="px-4 py-2">{isLoading ? <Loader2 className="h-12 w-12 animate-spin text-black" /> : 'Enviar'}</Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-1/2 mt-10">
                                {/* Mapa e projeto */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <h2 className="text-2xl font-medium">README</h2>
                                    <div className="flex gap-4 mb-4">
                                        <Button onClick={generateReadme} variant="outline">
                                            <CirclePlus />
                                            Gerar novo .md
                                        </Button>
                                        {currentProjectFolder?.lastReadme &&
                                            <>
                                                <Button variant="outline" onClick={fetchLastReadme}>
                                                    <Eye />
                                                    Visualizar último .md
                                                </Button>
                                                <Button variant="outline" onClick={updateRepoReadme}>
                                                    <Github />
                                                    Atualizar .md no GitHub
                                                </Button>
                                            </>
                                        }
                                    </div>
                                </div>
                                <hr />
                                <div className="flex flex-col gap-2">
                                    {/* <h2 className="text-2xl font-medium">Projeto {currentPath.split('/')[1]}</h2> */}
                                    <div className="text-start flex gap-2">
                                        <span onClick={() => setCurrentPath('')} className="text-muted-foreground cursor-pointer hover:underline">Projetos /</span>
                                        {currentPath.split("/").filter((_, i) => i > 0).map((el, index, arr) =>
                                            <span key={index} onClick={() => {
                                                if (index < arr.length - 1) {
                                                    console.log(currentPath, currentPath.split('/').slice(0, index + 2).join('/'), index)
                                                    setCurrentPath(currentPath.split('/').slice(0, index + 2).join('/'))
                                                }
                                            }} className={`${index < arr.length - 1 && 'text-muted-foreground cursor-pointer group'}`}><span className="transition-all group-hover:underline">{el}</span>{index < arr.length - 1 && <>&nbsp;/&nbsp;</>}</span>
                                        )}
                                    </div>
                                </div>

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
                                                        className="h-32 xl:w-80 w-20 flex flex-col justify-center items-center cursor-pointer transition-all hover:scale-105 relative p-2 group"
                                                    >
                                                        <div className="w-full">
                                                            <h3 className="font-semibold absolute top-0 start-2">{key + '.' + value.extension}</h3>
                                                            <p className=" overflow-hidden xl:whitespace-normal whitespace-nowrap text-ellipsis">{value.content.slice(0, 100)}</p>
                                                        </div>
                                                        <div className="absolute top-0 start-0 w-full h-full backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100">
                                                            <p className="uppercase font-semibold xl:text-xl">Ver documentação</p>
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
                                                        className="h-20 xl:w-80 w-20 flex justify-center items-center cursor-pointer transition-all hover:scale-105"
                                                    >
                                                        {key}
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    : <div className="relative flex items-center justify-center">
                        <Image className="w-screen h-full max-h-screen object-cover" width={300} height={300} src="/empty-state-docgen-projects.jpg" alt="Empty State" />
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>

                        <h1 className="absolute text-4xl text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight sm:text-5xl md:text-6xl">Nenhum projeto disponível</h1>
                        <Link className="absolute text-lg mt-32  transition-all hover:backdrop-blur-lg hover:scale-105 text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight" href="/">Selecionar projeto</Link>
                    </div>
                }
                {
                    doc && <div className="fixed top-0 start-0 w-screen h-screen z-[60] flex justify-center items-center">
                        <div className="absolute w-full h-full backdrop-blur-md" onClick={() => setDoc('')}></div>
                        <Card className="absolute z-10 h-[90%] w-[600px] p-4 pt-10 overflow-auto resize-x">
                            <ReactMarkdown>{doc}</ReactMarkdown>
                            <button onClick={() => setDoc('')} className="bg-red-600 absolute top-2 end-2 text-white w-6 h-6 rounded-full text-center transition-all hover:scale-105 cursor-pointer">X</button>
                        </Card>
                    </div>
                }
            </main >
            <footer className={`border-t py-6 md:py-8 flex items-center justify-center gap-4 md:flex-row md:gap-8 ${!projects.length ? `absolute bottom-0 left-0 w-full backdrop-blur-sm h-fit -mb-4` : `bg-black`}`}>
                <p className={`text-center text-sm text-white`}>© 2025 DocumentAI. Todos os direitos reservados.
                    <a className={`underline text-white`} href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
            <ToastContainer />
        </div >
    )
}