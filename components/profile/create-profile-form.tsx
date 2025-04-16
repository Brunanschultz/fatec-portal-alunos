"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateProfileForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [course, setCourse] = useState("")
  const [semester, setSemester] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || "")
        setFullName(user.user_metadata.full_name || "")
        setCourse(user.user_metadata.course || "")
        setSemester(user.user_metadata.semester?.toString() || "")
      }
    }

    loadUserData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Erro ao criar perfil",
          description: "Usuário não encontrado",
          variant: "destructive",
        })
        return
      }

      // Create student profile
      const { data: studentData, error: profileError } = await supabase
        .from("students")
        .insert({
          auth_id: user.id,
          full_name: fullName,
          email: user.email || "",
          course,
          semester: Number.parseInt(semester),
        })
        .select()
        .single()

      if (profileError) {
        toast({
          title: "Erro ao criar perfil",
          description: profileError.message,
          variant: "destructive",
        })
        return
      }

      // Create initial gamification entry
      await supabase.from("gamification_points").insert({
        student_id: studentData.id,
      })

      toast({
        title: "Perfil criado com sucesso",
        description: "Você será redirecionado para o dashboard",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Error creating profile:", error)
      toast({
        title: "Erro ao criar perfil",
        description: "Ocorreu um erro ao tentar criar seu perfil. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <Input id="email" name="email" type="email" value={email} disabled />
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
          {loading ? "Criando perfil..." : "Criar perfil"}
        </Button>
      </div>
    </form>
  )
}
