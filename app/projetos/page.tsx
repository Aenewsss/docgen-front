'use client'
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"

export default function Page() {

    const { user } = useAuth()
    const [projects, setProjects] = useState<string[]>([]);
    const [currentProjectFolder, setCurrentProjectFolder] = useState<any>();
    const [currentPath, setCurrentPath] = useState('');
    const [doc, setDoc] = useState('');

    async function getData() {
        const dbRef = ref(db, user.uid)

        const result = await get(dbRef)

        if (result.exists()) {
            const data = result.val()

            setProjects(Object.keys(data))
        }
    }

    useEffect(() => {
        getData()
    }, [user]);

    async function chooseProject(project?: string) {
        console.log(currentPath, project)
        const path = currentPath || `${user.uid}/${project}`
        const dbRef = ref(db, path)

        const result = await get(dbRef)
        if (result.exists()) {
            const data = result.val()

            setCurrentProjectFolder(data)
            !currentPath && setCurrentPath(path)
        }
    }

    useEffect(() => {
        chooseProject()
    }, [currentPath]);

    console.log(doc)

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Meu projetos
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Aqui estarão listados seus projetos com uma documentação completa e organizada
                    </p>
                </div>
                {
                    doc && <div className="fixed top-0 start-0 w-screen h-screen z-50 flex justify-center items-center">
                        <div className="absolute w-full h-full backdrop-blur-md" onClick={() => setDoc('')}></div>
                        <Card className="absolute z-10 h-[90%] w-[600px] p-4 pt-10 overflow-auto resize-x">
                            <ReactMarkdown>{doc}</ReactMarkdown>
                            <button onClick={() => setDoc('')} className="bg-red-600 absolute top-2 end-2 text-white w-6 h-6 rounded-full text-center transition-all hover:scale-105 cursor-pointer">X</button>
                        </Card>
                    </div>
                }
                <div className="flex gap-4 flex-wrap">
                    {
                        !currentPath ? projects?.map((project, index) =>
                            <Card key={index} onClick={() => chooseProject(project)} className="h-40 w-80 flex justify-center items-center cursor-pointer transition-all hover:scale-105">
                                {project}
                            </Card>)
                            : Object.entries(currentProjectFolder)?.map(([key, value]: any[], index) =>
                                value.extension ?
                                    <Card key={index} onClick={() => setDoc(value.content)} className="h-40 w-80 flex flex-col justify-center items-center cursor-pointer transition-all hover:scale-105 relative p-2 group">
                                        <div>
                                            <h3 className="font-semibold absolute top-0 start-2">{key + '.' + value.extension}</h3>
                                            <p>{value.content.slice(0, 100)}</p>
                                        </div>
                                        <div className="absolute top-0 start-0 w-full h-full backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100">
                                            <p className="uppercase font-semibold text-xl">Ver documentação</p>
                                        </div>
                                    </Card>
                                    : <Card key={index} onClick={() => setCurrentPath(currentPath + "/" + key)} className="h-40 w-80 flex justify-center items-center cursor-pointer transition-all hover:scale-105">
                                        {key}
                                    </Card>)
                    }
                </div>
            </main>
            <footer className="border-t py-6 md:py-8  flex items-center justify-center gap-4 md:flex-row md:gap-8 ">
                <p className="text-center text-sm text-muted-foreground">© 2025 DocGen. Todos os direitos reservados.
                    <a className="underline text-black" href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
        </div>
    )
}