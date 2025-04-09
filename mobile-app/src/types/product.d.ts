export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: {
    id: number
    name: string
  }
  tags: string[]
  appointments?: {
    date: string
    availableSlots: number
  }[]
}

export interface Category {
  id: number
  name: string
  icon: string
  children?: Category[]
}
