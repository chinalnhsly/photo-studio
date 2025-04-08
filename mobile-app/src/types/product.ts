export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  tags: string[]
  appointments: {
    date: string
    available: number
  }[]
}

export interface Category {
  id: number
  name: string
  icon: string
  subCategories?: Category[]
}
