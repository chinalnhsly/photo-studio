import React from 'react'
import TopNav from '../components/TopNav'
import CategoryNav from '../components/CategoryNav'
import { View } from '@tarojs/components'
import './index.scss'

const Layout = (props) => {
  return (
    <View className='home-layout'>
      <TopNav title='影楼商城' />
      <CategoryNav />
      <View className='content'>
        {props.children}
      </View>
    </View>
  )
}

export default Layout
