import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProfileForm } from "@/components/profile/profile-form"
import { SkillsForm } from "@/components/profile/skills-form"
import { HobbiesForm } from "@/components/profile/hobbies-form"

export default async function ProfilePage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get student data
  const { data: student } = await supabase.from("students").select("*").eq("auth_id", session.user.id).single()

  // Get student skills
  const { data: skills } = await supabase.from("student_skills").select("*").eq("student_id", student.id)

  // Get student hobbies
  const { data: hobbies } = await supabase.from("student_hobbies").select("*").eq("student_id", student.id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais, habilidades e hobbies</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileForm student={student} />
          <div className="space-y-6">
            <SkillsForm studentId={student.id} initialSkills={skills || []} />
            <HobbiesForm studentId={student.id} initialHobbies={hobbies || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
