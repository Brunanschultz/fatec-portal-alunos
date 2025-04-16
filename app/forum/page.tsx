import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ForumTopicList } from "@/components/forum/forum-topic-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function ForumPage({
  searchParams,
}: {
  searchParams: { discipline?: string }
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get disciplines
  const { data: disciplines } = await supabase.from("disciplines").select("*").order("name")

  // Get topics with student and discipline info
  let query = supabase
    .from("forum_topics")
    .select(`
      *,
      students (full_name, avatar_url),
      disciplines (name, code)
    `)
    .order("created_at", { ascending: false })

  if (searchParams.discipline) {
    query = query.eq("discipline_id", searchParams.discipline)
  }

  const { data: topics } = await query

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Fórum de Perguntas</h1>
            <p className="text-muted-foreground">Tire suas dúvidas e ajude outros alunos</p>
          </div>
          <Link href="/forum/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Pergunta
            </Button>
          </Link>
        </div>

        <ForumTopicList
          topics={topics || []}
          disciplines={disciplines || []}
          selectedDiscipline={searchParams.discipline}
        />
      </div>
    </DashboardLayout>
  )
}
