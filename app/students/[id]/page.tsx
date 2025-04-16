import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student data
  const { data: student } = await supabase.from("students").select("*").eq("id", params.id).single()

  if (!student) {
    redirect("/students")
  }

  // Get student skills
  const { data: skills } = await supabase.from("student_skills").select("*").eq("student_id", student.id)

  // Get student hobbies
  const { data: hobbies } = await supabase.from("student_hobbies").select("*").eq("student_id", student.id)

  const getCourseFullName = (code: string) => {
    const courses: Record<string, string> = {
      ADS: "Análise e Desenvolvimento de Sistemas",
      GTI: "Gestão da Tecnologia da Informação",
      SI: "Sistemas de Informação",
      RC: "Redes de Computadores",
      BD: "Banco de Dados",
    }
    return courses[code] || code
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student.avatar_url || ""} alt={student.full_name} />
            <AvatarFallback>
              {student.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{student.full_name}</h1>
            <p className="text-muted-foreground">
              {getCourseFullName(student.course)} - {student.semester}º semestre
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
              <CardDescription>Informações sobre o aluno</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{student.bio || "Este aluno ainda não adicionou uma biografia."}</p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                {skills && skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.skill_name} ({skill.proficiency_level})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Este aluno ainda não adicionou habilidades.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hobbies</CardTitle>
              </CardHeader>
              <CardContent>
                {hobbies && hobbies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((hobby) => (
                      <Badge key={hobby.id} variant="outline">
                        {hobby.hobby_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Este aluno ainda não adicionou hobbies.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
