import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StudentSearch } from "@/components/students/student-search"
import { StudentList } from "@/components/students/student-list"

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const search = searchParams.search || ""

  // Get students
  let query = supabase.from("students").select("*")

  if (search) {
    query = query.ilike("full_name", `%${search}%`)
  }

  const { data: students } = await query.order("full_name")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alunos</h1>
          <p className="text-muted-foreground">Encontre outros alunos da FATEC</p>
        </div>
        <StudentSearch initialSearch={search} />
        <StudentList students={students || []} />
      </div>
    </DashboardLayout>
  )
}
