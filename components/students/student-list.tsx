import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/types/supabase"

type Student = Database["public"]["Tables"]["students"]["Row"]

interface StudentListProps {
  students: Student[]
}

export function StudentList({ students }: StudentListProps) {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {students.length === 0 ? (
        <p className="text-muted-foreground col-span-full">Nenhum aluno encontrado.</p>
      ) : (
        students.map((student) => (
          <Link href={`/students/${student.id}`} key={student.id}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
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
                  <CardTitle className="text-lg">{student.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getCourseFullName(student.course)} - {student.semester}º semestre
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{student.bio || "Sem biografia."}</p>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}
