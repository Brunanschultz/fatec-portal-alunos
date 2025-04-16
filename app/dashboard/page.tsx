import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, FileText, Star, Trophy } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student data
  const { data: student } = await supabase.from("students").select("*").eq("auth_id", session.user.id).single()

  if (!student) {
    // If student profile doesn't exist yet, redirect to create profile
    redirect("/profile/create")
  }

  // Get gamification data
  const { data: gamification } = await supabase
    .from("gamification_points")
    .select("*")
    .eq("student_id", student.id)
    .single()

  // Get forum stats
  const { count: topicsCount } = await supabase
    .from("forum_topics")
    .select("*", { count: "exact", head: true })
    .eq("student_id", student.id)

  const { count: answersCount } = await supabase
    .from("forum_answers")
    .select("*", { count: "exact", head: true })
    .eq("student_id", student.id)

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Olá, {student?.full_name}</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao Portal FATEC. Aqui você pode acessar todas as funcionalidades do portal.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nível</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gamification?.level || 1}</div>
              <p className="text-xs text-muted-foreground">{gamification?.points || 0} pontos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perguntas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topicsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Perguntas criadas no fórum</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respostas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{answersCount || 0}</div>
              <p className="text-xs text-muted-foreground">Respostas dadas no fórum</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respostas Aceitas</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gamification?.accepted_answers_count || 0}</div>
              <p className="text-xs text-muted-foreground">Respostas marcadas como corretas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Fórum de Perguntas</CardTitle>
              <CardDescription>Tire suas dúvidas e ajude outros alunos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Arquivos Compartilhados</CardTitle>
              <CardDescription>Acesse e compartilhe materiais de estudo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avaliação de Professores</CardTitle>
              <CardDescription>Avalie seus professores e veja avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <Star className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
