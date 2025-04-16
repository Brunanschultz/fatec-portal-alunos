import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { CreateProfileForm } from "@/components/profile/create-profile-form"

export default async function CreateProfilePage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if student profile already exists
  const { data: student } = await supabase.from("students").select("*").eq("auth_id", session.user.id).single()

  if (student) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Complete seu perfil</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Precisamos de algumas informações para completar seu cadastro
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CreateProfileForm />
        </div>
      </div>
    </div>
  )
}
