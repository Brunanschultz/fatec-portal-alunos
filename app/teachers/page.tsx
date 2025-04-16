// app/teachers/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

type Teacher = {
  id: string
  full_name: string
  email: string
  specialization: string
  bio: string
  avatar_url?: string | null
}

export default function TeachersPage() {
  const supabase = createClient()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [feedback, setFeedback] = useState<Record<string, { rating: number; comment: string }>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase.from('teachers').select('*')
      if (error) {
        console.error('Erro ao buscar professores:', error)
      } else {
        setTeachers(data)
      }
    }

    fetchTeachers()
  }, [])

  const handleFeedbackChange = (teacherId: string, field: 'rating' | 'comment', value: string | number) => {
    setFeedback((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [field]: field === 'rating' ? Number(value) : value,
      },
    }))
  }

  const submitReview = async (teacherId: string) => {
    const review = feedback[teacherId]
    if (!review || !review.rating || !review.comment) {
      alert('Preencha a nota e o comentário.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('teacher_reviews').insert({
      teacher_id: teacherId,
      rating: review.rating,
      comment: review.comment,
    })

    if (error) {
      console.error('Erro ao enviar avaliação:', error)
      setMessage('Erro ao enviar avaliação.')
    } else {
      setMessage('Avaliação enviada com sucesso!')
      setFeedback((prev) => ({
        ...prev,
        [teacherId]: { rating: 0, comment: '' },
      }))
    }

    setLoading(false)
  }

  return (
    <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Professores</h1>

      {teachers.map((teacher) => (
        <div key={teacher.id} className="mb-8 border rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold">{teacher.full_name}</h2>
          <p className="text-muted-foreground mb-2">{teacher.specialization}</p>
          <p className="mb-4">{teacher.bio}</p>

          <div className="mb-2">
            <label className="block mb-1">Nota (1 a 5):</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={feedback[teacher.id]?.rating || ''}
              onChange={(e) => handleFeedbackChange(teacher.id, 'rating', e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1">Comentário:</label>
            <Textarea
              value={feedback[teacher.id]?.comment || ''}
              onChange={(e) => handleFeedbackChange(teacher.id, 'comment', e.target.value)}
            />
          </div>

          <Button
            disabled={loading}
            onClick={() => submitReview(teacher.id)}
            className="mt-2"
          >
            Enviar Avaliação
          </Button>
        </div>
      ))}

      {message && <div className="text-green-600 mt-4">{message}</div>}
    </div>
    </DashboardLayout>
  )
}
