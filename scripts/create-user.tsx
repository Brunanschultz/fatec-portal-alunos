"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateUserScript() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const supabase = createClient()

  const createBrunaUser = async () => {
    setLoading(true)
    setResult("")

    try {
      // Step 1: Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: "bruna.schultz@fatec.sp.gov.br",
        password: "fatec123",
        options: {
          data: {
            full_name: "Bruna Schultz",
            course: "ADS",
            semester: 3,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setResult(`Erro ao criar usuário: ${authError.message}`)
        return
      }

      if (!authData.user) {
        setResult("Erro: Não foi possível criar o usuário")
        return
      }

      // Step 2: Sign in with the created account
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: "bruna.schultz@fatec.sp.gov.br",
        password: "fatec123",
      })

      if (signInError) {
        setResult(`Erro ao fazer login: ${signInError.message}`)
        return
      }

      // Step 3: Create student profile
      const { data: studentData, error: profileError } = await supabase
        .from("students")
        .insert({
          auth_id: authData.user.id,
          full_name: "Bruna Schultz",
          email: "bruna.schultz@fatec.sp.gov.br",
          course: "ADS",
          semester: 3,
          bio: "Estudante de Análise e Desenvolvimento de Sistemas na FATEC.",
        })
        .select()
        .single()

      if (profileError) {
        setResult(`Erro ao criar perfil: ${profileError.message}`)
        return
      }

      // Step 4: Create gamification points
      const { error: gamificationError } = await supabase.from("gamification_points").insert({
        student_id: studentData.id,
        points: 0,
        answers_count: 0,
        accepted_answers_count: 0,
        level: 1,
      })

      if (gamificationError) {
        setResult(`Erro ao criar pontos de gamificação: ${gamificationError.message}`)
        return
      }

      setResult("Usuário Bruna criado e autenticado com sucesso! Você pode agora navegar para /dashboard")
    } catch (error) {
      console.error("Error creating user:", error)
      setResult(`Erro inesperado: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar Usuário Bruna</CardTitle>
          <CardDescription>
            Este script criará um usuário para Bruna com email bruna.schultz@fatec.sp.gov.br e senha fatec123
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Clique no botão abaixo para criar o usuário e autenticá-lo automaticamente.
          </p>
          {result && (
            <div className="p-3 bg-muted rounded-md my-4 whitespace-pre-wrap">
              <p>{result}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={createBrunaUser} disabled={loading} className="w-full">
            {loading ? "Criando usuário..." : "Criar e Autenticar Usuário Bruna"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
