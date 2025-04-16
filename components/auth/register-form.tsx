"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [course, setCourse] = useState("")
  const [semester, setSemester] = useState("")
  const [loading, setLoading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            course,
            semester: Number.parseInt(semester),
          },
        },
      })

      if (authError) {
        toast({
          title: "Erro ao criar conta",
          description: authError.message,
          variant: "destructive",
        })
        return
      }

      if (!authData.user) {
        toast({
          title: "Erro ao criar conta",
          description: "Não foi possível criar o usuário",
          variant: "destructive",
        })
        return
      }

      // Check if email confirmation is required
      if (authData.session) {
        // User is automatically signed in, create student profile
        const { error: profileError } = await supabase.from("students").insert({
          auth_id: authData.user.id,
          full_name: fullName,
          email,
          course,
          semester: Number.parseInt(semester),
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          toast({
            title: "Erro ao criar perfil",
            description: profileError.message,
            variant: "destructive",
          })
          return
        }

        // Get the newly created student
        const { data: studentData } = await supabase
          .from("students")
          .select("id")
          .eq("auth_id", authData.user.id)
          .single()

        if (studentData) {
          // Create initial gamification entry
          await supabase.from("gamification_points").insert({
            student_id: studentData.id,
          })
        }

        toast({
          title: "Conta criada com sucesso",
          description: "Você será redirecionado para o dashboard",
        })

        router.push("/dashboard")
        router.refresh()
      } else {
        // Email confirmation is required
        setRegistrationComplete(true)
        toast({
          title: "Conta criada com sucesso",
          description: "Por favor, verifique seu email para confirmar sua conta",
        })
      }
    } catch (error) {
      console.error("Error registering:", error)
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao tentar criar sua conta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (registrationComplete) {
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Verifique seu email</AlertTitle>
          <AlertDescription>
            Enviamos um link de confirmação para {email}. Por favor, verifique sua caixa de entrada e clique no link
            para confirmar sua conta.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          Após confirmar seu email, você poderá fazer login e completar seu perfil.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Ir para página de login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Nome Completo</Label>
        <div className="mt-1">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="course">Curso</Label>
        <div className="mt-1">
          <Select value={course} onValueChange={setCourse} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADS">Análise e Desenvolvimento de Sistemas</SelectItem>
              <SelectItem value="GTI">Gestão da Tecnologia da Informação</SelectItem>
              <SelectItem value="SI">Sistemas de Informação</SelectItem>
              <SelectItem value="RC">Redes de Computadores</SelectItem>
              <SelectItem value="BD">Banco de Dados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="semester">Semestre</Label>
        <div className="mt-1">
          <Select value={semester} onValueChange={setSemester} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1º Semestre</SelectItem>
              <SelectItem value="2">2º Semestre</SelectItem>
              <SelectItem value="3">3º Semestre</SelectItem>
              <SelectItem value="4">4º Semestre</SelectItem>
              <SelectItem value="5">5º Semestre</SelectItem>
              <SelectItem value="6">6º Semestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </form>
  )
}
