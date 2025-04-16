"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Database } from "@/types/supabase"

type Hobby = Database["public"]["Tables"]["student_hobbies"]["Row"]

interface HobbiesFormProps {
  studentId: string
  initialHobbies: Hobby[]
}

export function HobbiesForm({ studentId, initialHobbies }: HobbiesFormProps) {
  const [hobbies, setHobbies] = useState<Hobby[]>(initialHobbies)
  const [newHobby, setNewHobby] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleAddHobby = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newHobby.trim()) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("student_hobbies")
        .insert({
          student_id: studentId,
          hobby_name: newHobby.trim(),
        })
        .select()
        .single()

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Hobby já existe",
            description: "Você já adicionou este hobby ao seu perfil",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro ao adicionar hobby",
            description: error.message,
            variant: "destructive",
          })
        }
        return
      }

      setHobbies([...hobbies, data])
      setNewHobby("")

      toast({
        title: "Hobby adicionado",
        description: "Seu hobby foi adicionado com sucesso",
      })
    } catch (error) {
      console.error("Error adding hobby:", error)
      toast({
        title: "Erro ao adicionar hobby",
        description: "Ocorreu um erro ao tentar adicionar o hobby. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveHobby = async (hobbyId: string) => {
    try {
      const { error } = await supabase.from("student_hobbies").delete().eq("id", hobbyId)

      if (error) {
        toast({
          title: "Erro ao remover hobby",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setHobbies(hobbies.filter((hobby) => hobby.id !== hobbyId))

      toast({
        title: "Hobby removido",
        description: "Seu hobby foi removido com sucesso",
      })
    } catch (error) {
      console.error("Error removing hobby:", error)
      toast({
        title: "Erro ao remover hobby",
        description: "Ocorreu um erro ao tentar remover o hobby. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hobbies</CardTitle>
        <CardDescription>Adicione seus hobbies e interesses</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddHobby} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newHobby">Novo Hobby</Label>
            <Input
              id="newHobby"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              placeholder="Ex: Leitura, Música, Esportes..."
            />
          </div>
          <Button type="submit" disabled={loading || !newHobby.trim()}>
            {loading ? "Adicionando..." : "Adicionar Hobby"}
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Meus Hobbies</h3>
          {hobbies.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você ainda não adicionou nenhum hobby.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <div
                  key={hobby.id}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  <span>{hobby.hobby_name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRemoveHobby(hobby.id)}
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
