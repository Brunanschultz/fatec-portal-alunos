"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ForumTopicListProps {
  topics: any[]
  disciplines: any[]
  selectedDiscipline?: string
}

export function ForumTopicList({ topics, disciplines, selectedDiscipline }: ForumTopicListProps) {
  const router = useRouter()
  const [discipline, setDiscipline] = useState(selectedDiscipline || "")

  const handleDisciplineChange = (value: string) => {
    setDiscipline(value)
    if (value) {
      router.push(`/forum?discipline=${value}`)
    } else {
      router.push("/forum")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Select value={discipline} onValueChange={handleDisciplineChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filtrar por disciplina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as disciplinas</SelectItem>
            {disciplines.map((discipline) => (
              <SelectItem key={discipline.id} value={discipline.id}>
                {discipline.name} ({discipline.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {topics.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma pergunta encontrada. Seja o primeiro a fazer uma pergunta!</p>
        ) : (
          topics.map((topic) => (
            <Link href={`/forum/${topic.id}`} key={topic.id}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{topic.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={topic.students?.avatar_url || ""} alt={topic.students?.full_name} />
                        <AvatarFallback>
                          {topic.students?.full_name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{topic.students?.full_name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{topic.views}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
