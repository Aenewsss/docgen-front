'use client'
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function Page() {

    const { user } = useAuth()
    const [projects, setProjects] = useState<string[]>([]);
    const [project, setProject] = useState<any>();

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

    async function chooseProject(project: string) {
        const dbRef = ref(db, `${user.uid}/${project}`)

        const result = await get(dbRef)
        if (result.exists()) {
            const data = result.val()

            setProject(data)
        }
    }

    console.log(project)

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
                    !project ? projects?.map(project =>
                        <Card onClick={() => chooseProject(project)} className="h-40 w-80 flex justify-center items-center cursor-pointer transition-all hover:scale-105">
                            {project}
                        </Card>)
                        : <div></div>
                }
            </main>
            <footer className="border-t py-6 md:py-8  flex items-center justify-center gap-4 md:flex-row md:gap-8 ">
                <p className="text-center text-sm text-muted-foreground">© 2025 DocGen. Todos os direitos reservados.
                    <a className="underline text-black" href="http://qrotech.com.br" target="_blank" rel="noopener noreferrer">qrotech.com.br</a>
                </p>
            </footer>
        </div>
    )
}