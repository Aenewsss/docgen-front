import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function DocumentationPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Documentação do Projeto</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
            <Button size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 flex-1">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="structure">Estrutura</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>Visão Geral do Projeto</h2>
              <p>
                Este projeto é uma aplicação web desenvolvida com React no frontend e Node.js no backend. A aplicação
                permite aos usuários gerenciar tarefas, colaborar em projetos e acompanhar o progresso.
              </p>

              <h3>Tecnologias Utilizadas</h3>
              <ul>
                <li>
                  <strong>Frontend:</strong> React, TypeScript, Tailwind CSS
                </li>
                <li>
                  <strong>Backend:</strong> Node.js, Express, MongoDB
                </li>
                <li>
                  <strong>Autenticação:</strong> JWT, OAuth
                </li>
                <li>
                  <strong>Testes:</strong> Jest, React Testing Library
                </li>
              </ul>

              <h3>Arquitetura</h3>
              <p>
                A aplicação segue uma arquitetura de microsserviços, com o frontend e backend separados. O frontend é
                uma Single Page Application (SPA) que se comunica com o backend através de uma API RESTful.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="structure">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>Estrutura do Projeto</h2>
              <p>A estrutura de arquivos do projeto está organizada da seguinte forma:</p>

              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {`
project-root/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── tsconfig.json
└── README.md
                `}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="components">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>Componentes</h2>
              <p>Os principais componentes da aplicação são:</p>

              <h3>TaskList</h3>
              <p>
                Componente responsável por exibir a lista de tarefas do usuário. Recebe um array de tarefas como prop e
                renderiza cada uma delas.
              </p>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {`
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onComplete={() => onTaskComplete(task.id)} 
        />
      ))}
    </div>
  );
};

export default TaskList;
                `}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>API</h2>
              <p>A API do backend expõe os seguintes endpoints:</p>

              <h3>Autenticação</h3>
              <ul>
                <li>
                  <code>POST /api/auth/login</code> - Autenticar usuário
                </li>
                <li>
                  <code>POST /api/auth/register</code> - Registrar novo usuário
                </li>
                <li>
                  <code>POST /api/auth/refresh</code> - Renovar token de acesso
                </li>
              </ul>

              <h3>Tarefas</h3>
              <ul>
                <li>
                  <code>GET /api/tasks</code> - Listar todas as tarefas do usuário
                </li>
                <li>
                  <code>POST /api/tasks</code> - Criar nova tarefa
                </li>
                <li>
                  <code>GET /api/tasks/:id</code> - Obter detalhes de uma tarefa
                </li>
                <li>
                  <code>PUT /api/tasks/:id</code> - Atualizar uma tarefa
                </li>
                <li>
                  <code>DELETE /api/tasks/:id</code> - Excluir uma tarefa
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>Banco de Dados</h2>
              <p>O projeto utiliza MongoDB como banco de dados. Os principais modelos são:</p>

              <h3>Modelo de Usuário</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {`
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
                `}
              </pre>

              <h3>Modelo de Tarefa</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {`
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed'], 
    default: 'pending' 
  },
  dueDate: { type: Date },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
                `}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
