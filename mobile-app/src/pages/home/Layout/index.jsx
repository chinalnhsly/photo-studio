import { View } from '@tarojs/components'
import { TopNav } from '../components/TopNav'
import { CategoryNav } from '../components/CategoryNav'
import ProductList from '../components/ProductList'
import AppointmentCard from '../components/AppointmentCard'
import './index.scss'

const HomeLayout = () => {
  return (
    <View className='home-container'>
      <TopNav />
      <CategoryNav />
      <AppointmentCard />
      <ProductList />
    </View>
  )
}

export default HomeLayout
