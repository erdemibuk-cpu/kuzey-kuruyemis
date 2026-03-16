export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  categoryId: string
  category: Category
  basePrice: number
  salePrice: number | null
  sku: string | null
  stock: number
  isActive: boolean
  isFeatured: boolean
  images: ProductImage[]
  variants: ProductVariant[]
  reviews: Review[]
}

export interface ProductImage {
  id: string
  url: string
  alt: string | null
  sortOrder: number
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  salePrice: number | null
  stock: number
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  children?: Category[]
  isActive: boolean
  sortOrder: number
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  isApproved: boolean
  createdAt: string
  user: { name: string }
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  variantId: string | null
  quantity: number
}

export interface Order {
  id: string
  status: string
  totalAmount: number
  items: OrderItem[]
  shippingAddress: string
  shippingCity: string
  shippingPhone: string
  shippingName: string
  cargoTrackingNo: string | null
  cargoCompany: string | null
  paymentStatus: string
  createdAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  variantName: string | null
  quantity: number
  price: number
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
  isActive: boolean
}

export interface SiteSetting {
  key: string
  value: string
}
