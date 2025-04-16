// app/marketplace/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

type MarketplaceItem = {
  id: string
  title: string
  description: string
  price: number
  type: 'product' | 'service'
  user_id: string
}

export default function MarketplacePage() {
  const supabase = createClient()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    type: 'product', // Default type is product
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch all marketplace items from skill_marketplace table
  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from('skill_marketplace').select('*')
      if (error) {
        console.error('Erro ao buscar itens do marketplace:', error)
      } else {
        setItems(data)
      }
    }

    fetchItems()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.description || !newItem.price) {
      alert('Preencha todos os campos.')
      return
    }

    setLoading(true)

    // Insert new item into skill_marketplace table
    const { error } = await supabase.from('skill_marketplace').insert({
      title: newItem.title,
      description: newItem.description,
      price: parseFloat(newItem.price),
      type: newItem.type,
      user_id: 'user-id-placeholder', // Replace this with logged-in user ID
    })

    if (error) {
      console.error('Erro ao adicionar item:', error)
      setMessage('Erro ao adicionar item.')
    } else {
      setMessage('Item adicionado com sucesso!')
      // Clear the form after successful submission
      setNewItem({ title: '', description: '', price: '', type: 'product' })
      setItems((prev) => [...prev, { ...newItem, price: parseFloat(newItem.price) }])
    }

    setLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <p className="text-muted-foreground mb-6">Ofereça serviços e produtos no Marketplace</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Adicionar Novo Item</h2>
          <div className="mt-4 space-y-4">
            <Input
              name="title"
              placeholder="Título do Produto/Serviço"
              value={newItem.title}
              onChange={handleInputChange}
            />
            <Textarea
              name="description"
              placeholder="Descrição do Produto/Serviço"
              value={newItem.description}
              onChange={handleInputChange}
            />
            <Input
              name="price"
              placeholder="Preço"
              type="number"
              value={newItem.price}
              onChange={handleInputChange}
            />
            <select
              name="type"
              value={newItem.type}
              onChange={handleInputChange}
              className="border p-2 rounded"
            >
              <option value="product">Produto</option>
              <option value="service">Serviço</option>
            </select>
            <Button onClick={handleAddItem} disabled={loading} className="w-full">
              {loading ? 'Adicionando...' : 'Adicionar Item'}
            </Button>
          </div>
        </div>

        {message && <div className="text-green-600 mt-4">{message}</div>}

        <h2 className="text-2xl font-semibold mt-8 mb-4">Itens no Marketplace</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded p-4 shadow-sm">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mb-2">{item.type === 'product' ? 'Produto' : 'Serviço'}</p>
              <p>{item.description}</p>
              <p className="mt-4 font-bold">{`R$ ${item.price.toFixed(2)}`}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
