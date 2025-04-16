"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Database } from "@/types/supabase"

type Student = Database["public"]["Tables"]["students"]["Row"]

interface ProfileFormProps {
  student: Student
}

export function ProfileForm({ student }: ProfileFormProps) {
  const [fullName, setFullName] = useState(student.full_name)
  const [course, setCourse] = useState(student.course)
  const [semester, setSemester] = useState(student.semester.toString())
  const [bio, setBio] = useState(student.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(student.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("students")
        .update({
          full_name: fullName,
          course,
          semester: Number.parseInt(semester),
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id)

      if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Perfil atualizado com sucesso",
        description: "Suas informações foram atualizadas",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao tentar atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={student.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Curso</Label>
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
          <div className="space-y-2">
            <Label htmlFor="semester">Semestre</Label>
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
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL da Foto de Perfil</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
