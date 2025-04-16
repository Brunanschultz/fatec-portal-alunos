import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, FileText, MessageSquare, Star } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <GraduationCap className="h-6 w-6 mr-2" />
          <span className="font-bold">FATEC Portal</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Entrar
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Registrar
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Portal para Alunos da FATEC
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Conecte-se com outros alunos, compartilhe conhecimento, acesse materiais de estudo e muito mais.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg">Criar Conta</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Entrar
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <Users className="h-8 w-8 text-primary" />
                    <h3 className="font-bold">Perfis de Alunos</h3>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                      Conecte-se com outros alunos e compartilhe suas habilidades
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <h3 className="font-bold">Fórum de Perguntas</h3>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                      Tire suas dúvidas e ajude outros alunos
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <h3 className="font-bold">Compartilhamento de Arquivos</h3>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                      Acesse e compartilhe materiais de estudo
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <Star className="h-8 w-8 text-primary" />
                    <h3 className="font-bold">Avaliação de Professores</h3>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                      Avalie seus professores e veja avaliações de outros alunos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 FATEC Portal. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
