'use client'

import { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { db } from '@/firebase/config'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/header'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { MultiSelect } from '@/components/multiselect'
import Footer from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
    const { user } = useAuth()

    const [data, setData] = useState<any[]>([])
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [availableProjects, setAvailableProjects] = useState<string[]>([])
    const [availableDates, setAvailableDates] = useState<string[]>([])
    const [projectsLoading, setProjectsLoading] = useState(true);

    useEffect(() => {
        if (!user) return

        setProjectsLoading(true)
        const userRef = ref(db, `files_analysis/${user.uid}`)
        onValue(userRef, (snapshot) => {
            const val = snapshot.val()
            if (!val) return

            const flattened: Record<string, { [project: string]: number }> = {}

            Object.entries(val).forEach(([project, fileData]: any) => {
                Object.values(fileData).forEach((file: any) => {
                    const { date, total_tokens } = file
                    if (date && total_tokens) {
                        if (!flattened[date]) flattened[date] = {}
                        if (!flattened[date][project]) flattened[date][project] = 0
                        flattened[date][project] += total_tokens
                    }
                })
            })

            const chartData = Object.entries(flattened)
                .reduce((acc, [date, projects]) => {
                    const formattedDate = new Date(date).toLocaleDateString('pt-BR')
                    const fullDate = new Date(date).toLocaleString('pt-BR')
                    const existing = acc.find((entry) => entry.date === formattedDate)
                    if (existing) {
                        Object.entries(projects).forEach(([project, tokens]) => {
                            existing[project] = (existing[project] || 0) + tokens
                        })
                    } else {
                        acc.push({
                            date: formattedDate,
                            fullDate,
                            ...projects,
                        })
                    }

                    return acc
                }, [] as any[])
                .sort((a, b) => {
                    const [diaA, mesA, anoA] = a.date.split('/')
                    const [diaB, mesB, anoB] = b.date.split('/')
                    return new Date(+anoA, +mesA - 1, +diaA).getTime() - new Date(+anoB, +mesB - 1, +diaB).getTime()
                })

            setData(chartData)

            setAvailableProjects(
                Array.from(
                    new Set(
                        chartData.flatMap((item) => Object.keys(item).filter((k) => !['date', 'fullDate'].includes(k)))
                    )
                )
            )
            setAvailableDates(chartData.map((item) => item.date))
            setProjectsLoading(false)
        })
    }, [user])

    const filteredData = data.filter((item) => {
        const matchesProject = selectedProjects.length
            ? selectedProjects.some((proj) => Object.keys(item).includes(proj))
            : true
        const matchesDate = startDate && endDate
            ? new Date(item.date.split('/').reverse().join('-')) >= startDate &&
            new Date(item.date.split('/').reverse().join('-')) <= endDate
            : true
        return matchesProject && matchesDate
    })

    if (!projectsLoading && !data.length) return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="relative flex items-center justify-center h-[90vh]">
            <div className="absolute top-0 left-0 w-full h-full bg-zinc-900 opacity-20"></div>
            <Image className="absolute top-0 left-0 w-screen h-full object-cover" width={300} height={300} src="/empty-state-historic.png" alt="Empty State Historic" />
            <h1 className="absolute text-4xl text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight sm:text-5xl md:text-6xl">Histórico indisponível</h1>
            <Link className="absolute text-lg mt-32  transition-all hover:backdrop-blur-lg hover:scale-105 text-white p-2 z-10 shadow-black shadow-lg font-bold tracking-tight" href="/">Clique para selecionar um projeto</Link>
        </main>
        <Footer />
    </div>

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24 md:pt-24">
                <div className="p-8 max-w-7xl mx-auto w-full">
                    <h1 className="text-5xl font-bold mb-6 text-center">Histórico de Uso de Créditos</h1>
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex gap-4 justify-center items-center flex-wrap">
                            <MultiSelect
                                options={availableProjects.map((p) => p)}
                                selected={selectedProjects}
                                onChange={setSelectedProjects}
                            // placeholder="Filtrar por projetos"
                            />
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Data inicial"
                                className="border px-3 py-2 rounded"
                                dateFormat="dd/MM/yyyy"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Data final"
                                className="border px-3 py-2 rounded"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                        {(selectedProjects.length > 0 || startDate || endDate) && (
                            <div className="flex gap-2 mt-4 flex-wrap justify-center">
                                {selectedProjects.map((proj) => (
                                    <span key={proj} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {proj}
                                        <button onClick={() => setSelectedProjects(selectedProjects.filter((p) => p !== proj))}>×</button>
                                    </span>
                                ))}
                                {startDate && endDate && (
                                    <span className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {`de ${startDate.toLocaleDateString('pt-BR')} até ${endDate.toLocaleDateString('pt-BR')}`}
                                        <button onClick={() => { setStartDate(null); setEndDate(null); }}>×</button>
                                    </span>
                                )}
                                {!endDate && startDate && (
                                    <span className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {startDate.toLocaleDateString('pt-BR')}
                                        <button onClick={() => setStartDate(null)}>×</button>
                                    </span>
                                )}
                                {endDate && !startDate && (
                                    <span className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {endDate.toLocaleDateString('pt-BR')}
                                        <button onClick={() => setEndDate(null)}>×</button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap={16}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: any, name: any) => [value, name]}
                                    labelFormatter={(label: any) => {
                                        const item = data.find((d) => d.date === label)
                                        return item?.fullDate || label
                                    }}
                                />
                                {filteredData.length > 0 &&
                                    Array.from(
                                        new Set(
                                            filteredData.flatMap((item) => Object.keys(item).filter((key) => key !== 'date' && key != 'defaultDate' && key != 'fullDate'))
                                        )
                                    ).map((key, i) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            stackId="usage"
                                            fill={`hsl(${i * 60}, 70%, 50%)`}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}