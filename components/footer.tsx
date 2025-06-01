import { Code, ExternalLink, Link } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-zinc-400 py-12 px-6 border-t border-zinc-800">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#374151] to-[#1f2937] rounded-full blur opacity-70"></div>
                            <div className="relative bg-black rounded-full p-1">
                                <Code className="h-5 w-5 text-[#374151]" />
                            </div>
                        </div>
                        <span className="font-semibold text-white">© 2025 DocumentAI.</span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                        <Link
                            href="https://qrotech.com.br"
                            className="hover:text-white transition-colors flex items-center"
                            target="_blank"
                        >
                            qrotech.com.br
                            <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    © 2025 DocumentAI · Desenvolvido por qrotech.com.br
                </div>
            </div>
        </footer>
    )
}