'use client'
import { Header } from "@/components/header";
import Loading from "@/components/loading";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { get, onValue, push, ref, update } from "firebase/database";
import { CirclePlus, CodeXml, Dot, Download, Expand, Eye, Folder, Github, Loader2, Minimize, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown"
import { ToastContainer, toast } from 'react-toastify';
import remarkGfm from 'remark-gfm'

export default function Page() {
    const toastShownRef = useRef(false);

    const { loading, user } = useAuth()

    const [showChatModal, setShowChatModal] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [showSettingsModal, setShowSettingsModal] = useState<number | null>(null);
    const [currentProjectFolder, setCurrentProjectFolder] = useState<any>();
    const [currentPath, setCurrentPath] = useState('');
    const [oldProjectName, setOldProjectName] = useState('');
    const [doc, setDoc] = useState('');
    const [messages, setMessages] = useState<{ text: string, fromAI: boolean }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [previewMessage, setPreviewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [readmeContent, setReadmeContent] = useState('');
    const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
    const [readmeCooldown, setReadmeCooldown] = useState(false);

    async function fetchLastReadme() {
        if (!user || !currentPath) return;
        setReadmeContent(currentProjectFolder?.lastReadme);
        setIsReadmeModalOpen(true);
    }

    async function updateRepoReadme() {
        if (!user || !currentPath || !currentProjectFolder?.lastReadme) return;
        try {
            toast("Atualizando README no GitHub...", { position: 'bottom-center' });
            fetch(`${process.env.NEXT_PUBLIC_N8N_UPDATE_README}`, {
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
        } catch (e: any) {
            console.error("Erro ao atualizar README no GitHub:", e.message);
            toast("Erro ao atualizar o README no GitHub.", { position: 'bottom-center' });
        }
    }

    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100);
    }

    const entries = currentProjectFolder && Object.entries(currentProjectFolder);
    const files = entries?.filter(([_, value]: any[]) => value.extension);
    const folders = entries?.filter(([key, value]: any[]) => !value.extension && key != 'summary' && key != 'lastReadme' && key != 'autoUpdate');

    async function getData() {
        setProjectsLoading(true)
        const dbRef = ref(db, `documentations/${user.uid}`)

        onValue(dbRef, (snapshot) => {
            const data = snapshot.val()
            if (!data) return setProjectsLoading(false)
            setProjects(Object.entries(data).map(([key, value]: any) => ({ name: key, autoUpdate: value?.autoUpdate || false })))
            setProjectsLoading(false)
        });

    }
    useEffect(() => {
        user?.uid && getData()
    }, [user]);

    useEffect(() => {
        user?.uid && chooseProject()
    }, [currentPath]);

    async function chooseProject(project?: string) {
        const path = 'documentations/' + (currentPath || `${user.uid}/${project}`)
        const dbRef = ref(db, path)

        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setCurrentProjectFolder(data)
                project && setReadmeContent(data?.lastReadme);
                !currentPath && setCurrentPath(path.includes('documentations') ? path.split('/').slice(1).join('/') : path)
            }
        })
    }

    async function generateReadme() {
        try {
            toast("O README será enviado por email! Aguarde alguns minutos.", { position: 'bottom-center' });
            fetch(`${process.env.NEXT_PUBLIC_N8N_README}`, {
                method: 'POST',
                body: JSON.stringify({
                    project: currentPath.split('/')[1],
                    user: user.uid,
                    userEmail: user.email
                })
            })
                .then(_ => {
                    setWaitToGenerateAnotherReadme();
                })
                .catch(e => toast.error('Erro ao gerar readme. Tente novamente mais tarde', { position: 'bottom-center' }))
        } catch (e: any) {
            console.log(e.message)
        }
    }

    // Função para controlar o tempo de espera para gerar outro README
    function setWaitToGenerateAnotherReadme() {
        setReadmeCooldown(true)
        setTimeout(() => {
            setReadmeCooldown(false)
        }, 5 * 60 * 1000);
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
                project: currentPath.split('/')[1],
                user: user?.uid
            })
        })).json()

        const userMessage = { text: newMessage, fromAI: false }
        const aiMessage = { text: response.output, fromAI: true }

        setPreviewMessage('')
        setMessages(prev => [...prev, userMessage, aiMessage])
        setIsLoading(false)
        scrollToBottom()

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
        if (!user) return

        const statusRef = ref(db, `users/${user.uid}/status`);
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            if (data.updateReadmeGithub && !toastShownRef.current) {
                toastShownRef.current = true;

                toast(
                    <p>
                        README atualizado com sucesso no GitHub! Clique&nbsp;
                        <a href={data.updateReadmeGithub} className="underline text-blue-400" target="_blank">
                            aqui
                        </a>
                        &nbsp;para visualizar.
                    </p>,
                    {
                        position: 'bottom-center',
                        onClose: async () => {
                            await update(statusRef, { updateReadmeGithub: '' })
                            toastShownRef.current = false;
                        }
                    }
                );
            }
        });
        return () => {
            unsubscribeStatus();
        }

    }, [user?.status]);

    useEffect(() => {
        if (!user || !currentPath) return;

        if (oldProjectName == currentPath.split('/')[1]) return
        const projectName = currentPath.split("/")[1];
        setOldProjectName(projectName)
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

        return () => {
            unsubscribe();
        }
    }, [user, currentPath]);

    async function downloadDocumentation() {
        try {
            toast("A documentação completa será enviada por e-mail. Aguarde alguns minutos", { position: 'bottom-center' });
            await fetch(`${process.env.NEXT_PUBLIC_N8N_GENERATE_DOC_FILE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project: currentPath.split('/')[1],
                    user: user.uid,
                    userEmail: user.email
                })
            });
        } catch (e) {
            toast.error("Erro ao gerar o arquivo DOC.", { position: 'bottom-center' });
            console.error(e);
        }
    }

    if (loading || projectsLoading) return <Loading />

    return (
        <div className="min-h-screen flex flex-col">
            {/* Modal de visualização do README */}
            {isReadmeModalOpen && (
                <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex justify-center items-center z-[70]">
                    <div className="bg-white dark:bg-black dark:text-white max-w-3xl w-full p-6 rounded-md relative">
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                            onClick={() => setIsReadmeModalOpen(false)}
                        >
                            ×
                        </button>
                        <div className="prose dark:prose-invert max-h-[70vh] overflow-y-auto min-w-full">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
            <Header />
            <main className={`flex-1 flex flex-col ${projects.length ? `` : `-mt-20`}`}>
                {projects.length ?
                    !currentPath
                        ? <section className="mt-20 w-full flex flex-col items-center justify-center mx-auto max-w-6xl ">
                            <h1 className="text-5xl font-semibold">Meus Projetos</h1>
                            <p className="text-xl text-muted-foreground mb-6">Aqui estão listados todos seus projetos documentados.</p>
                            <div className="flex gap-5 flex-wrap justify-center">
                                {projects?.map((project, index) =>
                                    <div key={index} className="flex flex-col gap-2">
                                        {showSettingsModal == index &&
                                            <div className="fixed inset-0 bg-zinc-900 bg-opacity-30 z-[80] flex items-center justify-center">
                                                <div className="bg-white dark:text-black p-6 rounded-lg w-[400px] relative">
                                                    <button
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                                                        onClick={() => {
                                                            setShowSettingsModal(null)
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                    <h2 className="text-xl font-bold">Configurações do Projeto</h2>
                                                    <h3 className="mb-4 font-semibold mt-2">{project.name}</h3>
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span>Atualizar automaticamente quando houver mudanças na branch principal</span>
                                                        <Switch
                                                            checked={project.autoUpdate}
                                                            onCheckedChange={async (checked) => {
                                                                const [repo_owner, repo_name] = project.name.split("_");
                                                                if (checked) {
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
                                                                    })
                                                                        .then(_ => toast("Webhook criado com sucesso para atualização automática!", { position: 'bottom-center' }))
                                                                        .catch(_ => toast.error("Falha ao criar Webhook para atualização automática!", { position: 'bottom-center' }));
                                                                } else {
                                                                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/delete-webhook`, {
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
                                                                    })
                                                                        .then(_ => toast("Webhook removido com sucesso. A atualização automática foi desativada.", { position: 'bottom-center' }))
                                                                        .catch(_ => toast.error("Falha ao remover Webhook de atualização automática!", { position: 'bottom-center' }));
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <Card onClick={() => chooseProject(project.name)} className="h-40 w-80 flex justify-center items-center cursor-pointer transition-all hover:scale-105 relative">
                                            <div className="flex flex-col justify-center h-full gap-8">
                                                {project.name}
                                                <Button onClick={() => chooseProject(project.name)} className="transition-all hover:scale-105 flex self-center">Acessar o projeto</Button>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowSettingsModal(index);
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 z-20"
                                            >
                                                <Settings className="w-4 h-4 text-gray-600" />
                                            </button>

                                        </Card>
                                    </div>
                                )}
                            </div>
                        </section>
                        : <div className="w-full flex gap-10 flex-1">
                            {/* DocumentAI Chat */}
                            <div className={`p-4 text-start w-1/2 shadow-md flex-1 flex flex-col bg-zinc-900 dark:bg-black ${showChatModal && 'fixed top-0 left-0 z-[60] backdrop-blur-sm w-screen h-screen'}`}>
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-semibold mb-0 text-white">Converse com a DocumentAI</h2>
                                    <p className="mb-4 text-muted-foreground">Tire dúvidas sobre o seu projeto</p>
                                    <div className={` py-4 border-t border-[rgb(30,30,30)] space-y-4 h-[calc(100vh-300px)] overflow-y-auto ${showChatModal && 'h-[calc(100vh-160px)]'}`}>
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
                                                    <p className="prose prose-headings:text-white prose-p:text-white prose-li:text-white prose-code:text-white prose-strong:text-white dark:prose-invert bg-[rgb(30,30,30)] text-white p-3 rounded-lg shadow-sm max-w-[80%] text-start">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                                                    </p>
                                                </div>
                                                    :
                                                    <div key={index} className="flex gap-2 items-start justify-end">
                                                        <p className="bg-primary text-white dark:text-black p-3 rounded-lg shadow-sm max-w-[80%]">
                                                            {message.text}
                                                        </p>
                                                    </div>
                                            )
                                        }
                                        {
                                            previewMessage &&
                                            <>
                                                <div className="flex gap-2 items-start justify-end">
                                                    <p className="bg-primary text-white dark:text-black p-3 rounded-lg shadow-sm max-w-[80%]">
                                                        {previewMessage}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 items-start">
                                                    <div className="w-10 h-10 bg-[rgb(30,30,30)] rounded-full flex justify-center items-center">
                                                        <Image className="w-[60%] h-[60%] object-contain" src="/favicon.svg" width={8} height={8} alt="DocumentAI Icon" />
                                                    </div>
                                                    <div className="flex text-white -space-x-4 items-center -ms-2">
                                                        <Dot className="w-10 h-10 animate-ping" />
                                                        <Dot className="w-10 h-10 animate-ping delay-150" />
                                                        <Dot className="w-10 h-10 animate-ping delay-300" />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <div ref={messagesEndRef} className="min-h-[1px]" />
                                    </div>
                                </div>
                                <Tooltip message={(user?.chatsLeft < 1) ? 'Limite mensal de mensagens atingido.' : ''}>
                                    <div className={`mt-4 flex gap-2 items-center ${(user?.chatsLeft < 1) ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {!showChatModal
                                            ? <Tooltip left={1} message="Tela cheia"><Expand onClick={() => setShowChatModal(true)} className="text-white cursor-pointer" /></Tooltip>
                                            : <Tooltip left={1} message="Minimizar chat"><Minimize onClick={() => setShowChatModal(false)} className="text-white cursor-pointer" /></Tooltip>}
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
                                        <Tooltip message={user?.chatsLeft < 1 ? "Limite mensal atingido." : ""}>
                                            <Button disabled={(user?.chatsLeft < 1)} variant={"outline"} onClick={() => !isLoading && sendNewMessage()} className="px-4 py-2">{isLoading ? <Loader2 className="h-12 w-12 animate-spin text-black" /> : 'Enviar'}</Button>
                                        </Tooltip>
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="flex flex-col gap-4 w-1/2 mt-10">
                                {/* Mapa e projeto */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <h2 className="text-2xl font-medium">README</h2>
                                    <div className="flex gap-4 mb-4">
                                        <Tooltip message={currentProjectFolder?.lastReadme ? "Só sera possível gerar outro readme se o código for alterado." : user?.readmesLeft < 1 ? "Limite mensal atingido." : ""}>
                                            <Button disabled={user?.readmesLeft < 1 || readmeCooldown || currentProjectFolder?.lastReadme} onClick={generateReadme} variant="outline">
                                                <CirclePlus />
                                                Gerar novo
                                            </Button>
                                        </Tooltip>
                                        {readmeContent &&
                                            <>
                                                <Button variant="outline" onClick={fetchLastReadme}>
                                                    <Eye />
                                                    Visualizar último
                                                </Button>
                                                <Button variant="outline" onClick={updateRepoReadme}>
                                                    <Github />
                                                    Atualizar no GitHub
                                                </Button>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 -mt-2">
                                    <h2 className="text-2xl font-medium">Documentação</h2>
                                    <div className="flex gap-4 mb-4">
                                        <Button variant="outline" onClick={downloadDocumentation}>
                                            <Folder />
                                            Baixar documentação completa
                                        </Button>
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
                                    {files?.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <CodeXml width={24} height={24} />
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
                                    {folders?.length > 0 && (
                                        <div className="flex flex-col gap-2 mb-6">
                                            <div className="flex gap-2">
                                                <Folder width={24} height={24} />
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
                        <div className="absolute top-0 left-0 w-full h-full bg-zinc-900 opacity-20"></div>

                        <h1 className="absolute text-4xl text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight sm:text-5xl md:text-6xl">Nenhum projeto disponível</h1>
                        <Link className="absolute text-lg mt-32  transition-all hover:backdrop-blur-lg hover:scale-105 text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight" href="/">Selecionar projeto</Link>
                    </div>
                }
                {
                    doc && <div className="fixed top-0 start-0 w-screen h-screen z-[60] flex justify-center items-center">
                        <div className="absolute w-full h-full backdrop-blur-md" onClick={() => setDoc('')}></div>
                        <Card className="absolute z-10 h-[90%] w-[800px] p-4 pt-10 overflow-auto resize-x">
                            <div className="prose dark:prose-invert min-w-full">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                            </div>
                            <button onClick={() => setDoc('')} className="bg-red-600 absolute top-2 end-2 text-white w-6 h-6 rounded-full text-center transition-all hover:scale-105 cursor-pointer">X</button>
                        </Card>
                    </div>
                }
                {/* {
                    showChatModal && <div className="fixed top-0 start-0 w-screen h-screen z-[60] flex justify-center items-center">
                        <div className="absolute w-full h-full backdrop-blur-md" onClick={() => setDoc('')}></div>
                        <Card className="absolute z-10 h-[90%] w-[800px] p-4 pt-10 overflow-auto resize-x">
                        </Card>
                    </div>
                } */}
            </main >
            <footer className={`border-t py-6 md:py-8 flex items-center justify-center gap-4 md:flex-row md:gap-8 ${!projects.length ? `absolute bottom-0 left-0 w-full backdrop-blur-sm h-fit -mb-4` : `bg-zinc-900`}`}>
                <p className={`text-center text-sm text-white`}>© 2025 DocumentAI. Todos os direitos reservados.
                    <a className={`underline text-white`} href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
            <ToastContainer />

        </div >
    )
}