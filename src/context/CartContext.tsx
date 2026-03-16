'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface CartProduct {
  id: string
  name: string
  slug: string
  basePrice: number
  salePrice: number | null
  images: { url: string }[]
}

interface CartItemType {
  productId: string
  product: CartProduct
  variantId: string | null
  variantName: string | null
  quantity: number
  price: number
}

interface CartContextType {
  items: CartItemType[]
  addItem: (product: CartProduct, quantity: number, variantId?: string | null, variantName?: string | null, variantPrice?: number) => void
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: CartProduct, quantity: number, variantId?: string | null, variantName?: string | null, variantPrice?: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id && i.variantId === (variantId || null))
      const price = variantPrice || product.salePrice || product.basePrice

      if (existing) {
        return prev.map(i =>
          i.productId === product.id && i.variantId === (variantId || null)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }

      return [...prev, {
        productId: product.id,
        product,
        variantId: variantId || null,
        variantName: variantName || null,
        quantity,
        price,
      }]
    })
  }, [])

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.variantId === (variantId || null))))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }
    setItems(prev => prev.map(i =>
      i.productId === productId && i.variantId === (variantId || null)
        ? { ...i, quantity }
        : i
    ))
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
