'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface FavoriteItem {
  id: string
  name: string
  slug: string
  basePrice: number
  salePrice: number | null
  image: string
}

interface FavoriteContextType {
  favorites: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: FavoriteItem) => void
  totalFavorites: number
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined)

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      try { setFavorites(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.find(f => f.id === item.id)) return prev
      return [...prev, item]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }, [])

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id)
  }, [favorites])

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    if (favorites.some(f => f.id === item.id)) {
      removeFavorite(item.id)
    } else {
      addFavorite(item)
    }
  }, [favorites, addFavorite, removeFavorite])

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, totalFavorites: favorites.length }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoriteContext)
  if (!context) throw new Error('useFavorites must be used within FavoriteProvider')
  return context
}
