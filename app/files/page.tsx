// app/files/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

type FileItem = {
  id: string
  name: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  student_id: string
  discipline_id: string
  created_at: string
}

export default function FilesPage() {
  const supabase = createClient()
  const [files, setFiles] = useState<FileItem[]>([])
  const [newFolderName, setNewFolderName] = useState('')
  const [newFile, setNewFile] = useState<any>(null)
  const [fileDescription, setFileDescription] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [disciplines, setDisciplines] = useState<string[]>([]) // Liste de disciplinas disponíveis

  // Fetch disciplines for dropdown (you can modify this query based on your schema)
  useEffect(() => {
    const fetchDisciplines = async () => {
      const { data, error } = await supabase.from('disciplines').select('id, name')
      if (error) {
        console.error('Erro ao buscar disciplinas:', error)
      } else {
        setDisciplines(data.map((discipline: { id: string; name: string }) => discipline.name))
      }
    }

    fetchDisciplines()
  }, [])

  // Fetch files for the selected discipline
  useEffect(() => {
    if (selectedDiscipline) {
      const fetchFiles = async () => {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('discipline_id', selectedDiscipline)
        if (error) {
          console.error('Erro ao buscar arquivos:', error)
        } else {
          setFiles(data)
        }
      }

      fetchFiles()
    }
  }, [selectedDiscipline])

  const handleFolderCreate = async () => {
    if (!newFolderName) {
      alert('Digite um nome para a pasta.')
      return
    }

    setLoading(true)

    // Adiciona uma pasta vazia (sem arquivo) para a disciplina selecionada
    const { error } = await supabase.from('files').insert({
      name: newFolderName,
      description: 'Pasta criada pelo aluno',
      file_url: '', // Pastas não têm URL de arquivo
      file_type: 'folder',
      file_size: 0,
      student_id: 'student-id-placeholder', // Substitua pelo ID do aluno autenticado
      discipline_id: selectedDiscipline,
    })

    if (error) {
      console.error('Erro ao criar pasta:', error)
      setMessage('Erro ao criar pasta.')
    } else {
      setMessage('Pasta criada com sucesso!')
      setNewFolderName('') // Limpar campo
    }

    setLoading(false)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.name || !selectedDiscipline) {
      alert('Selecione um arquivo válido.')
      return
    }

    setLoading(true)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData?.session?.user?.id) {
      alert('Você precisa estar logado para fazer upload.')
      setLoading(false)
      return
    }

    const fileExtension = file.name.split('.').pop() || ''
    const filePath = `${selectedDiscipline}/${file.name}`

    // Faça upload do arquivo para o Supabase Storage
    const { error: uploadError, data: fileData } = await supabase.storage
      .from('files')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Erro ao fazer upload:', uploadError)
      setMessage('Erro ao fazer upload.')
      setLoading(false)
      return
    }

    // Inserir dados do arquivo na tabela 'files'
    const { error: insertError } = await supabase.from('files').insert({
      name: file.name,
      description: fileDescription,
      file_url: fileData?.Key,
      file_type: fileExtension,
      file_size: file.size,
      student_id: sessionData.session.user.id,
      discipline_id: selectedDiscipline,
    })

    if (insertError) {
      console.error('Erro ao adicionar arquivo:', insertError)
      setMessage('Erro ao adicionar arquivo.')
    } else {
      setMessage('Arquivo enviado com sucesso!')
      setFileDescription('') // Limpar descrição
    }

    setLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Arquivos e Pastas</h1>
        <p className="text-muted-foreground mb-6">Faça upload de arquivos e organize-os em pastas por disciplina.</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Selecione a Disciplina</h2>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione uma disciplina</option>
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Criar Pasta</h2>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nome da pasta"
            className="mt-2"
          />
          <Button onClick={handleFolderCreate} disabled={loading} className="mt-2">
            {loading ? 'Criando...' : 'Criar Pasta'}
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Upload de Arquivo</h2>
          <Input
            type="file"
            onChange={handleFileUpload}
            className="mt-2"
          />
          <Textarea
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            placeholder="Descrição do arquivo"
            className="mt-2"
          />
          <Button onClick={handleFileUpload} disabled={loading} className="mt-2">
            {loading ? 'Enviando...' : 'Enviar Arquivo'}
          </Button>
        </div>

        {message && <div className="text-green-600 mt-4">{message}</div>}

        <h2 className="text-2xl font-semibold mt-8 mb-4">Arquivos e Pastas da Disciplina</h2>
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="border p-4 rounded">
              {file.file_type === 'folder' ? (
                <h3 className="text-xl font-semibold">{file.name}</h3>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold">{file.name}</h3>
                  <p className="text-muted-foreground mb-2">{file.file_type}</p>
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    Ver Arquivo
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
