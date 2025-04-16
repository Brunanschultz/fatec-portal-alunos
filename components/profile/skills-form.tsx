"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Database } from "@/types/supabase"

type Skill = Database["public"]["Tables"]["student_skills"]["Row"]

interface SkillsFormProps {
  studentId: string
  initialSkills: Skill[]
}

export function SkillsForm({ studentId, initialSkills }: SkillsFormProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [newSkill, setNewSkill] = useState("")
  const [proficiency, setProficiency] = useState("Intermediário")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleAddSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newSkill.trim()) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("student_skills")
        .insert({
          student_id: studentId,
          skill_name: newSkill.trim(),
          proficiency_level: proficiency,
        })
        .select()
        .single()

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Habilidade já existe",
            description: "Você já adicionou esta habilidade ao seu perfil",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro ao adicionar habilidade",
            description: error.message,
            variant: "destructive",
          })
        }
        return
      }

      setSkills([...skills, data])
      setNewSkill("")
      setProficiency("Intermediário")

      toast({
        title: "Habilidade adicionada",
        description: "Sua habilidade foi adicionada com sucesso",
      })
    } catch (error) {
      console.error("Error adding skill:", error)
      toast({
        title: "Erro ao adicionar habilidade",
        description: "Ocorreu um erro ao tentar adicionar a habilidade. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const { error } = await supabase.from("student_skills").delete().eq("id", skillId)

      if (error) {
        toast({
          title: "Erro ao remover habilidade",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setSkills(skills.filter((skill) => skill.id !== skillId))

      toast({
        title: "Habilidade removida",
        description: "Sua habilidade foi removida com sucesso",
      })
    } catch (error) {
      console.error("Error removing skill:", error)
      toast({
        title: "Erro ao remover habilidade",
        description: "Ocorreu um erro ao tentar remover a habilidade. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habilidades</CardTitle>
        <CardDescription>Adicione suas habilidades técnicas e conhecimentos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newSkill">Nova Habilidade</Label>
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ex: JavaScript, Python, Design..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proficiency">Nível</Label>
              <Select value={proficiency} onValueChange={setProficiency}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Iniciante">Iniciante</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                  <SelectItem value="Especialista">Especialista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={loading || !newSkill.trim()}>
            {loading ? "Adicionando..." : "Adicionar Habilidade"}
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Minhas Habilidades</h3>
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você ainda não adicionou nenhuma habilidade.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  <span>
                    {skill.skill_name} ({skill.proficiency_level})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRemoveSkill(skill.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
