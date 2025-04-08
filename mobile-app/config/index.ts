import { resolve } from 'path'

export default {
  framework: 'react',
  plugins: ['@tarojs/plugin-framework-react'],
  alias: {
    '@': resolve(__dirname, '..', 'src'),
    '@/components': resolve(__dirname, '..', 'src/components'),
    '@/types': resolve(__dirname, '..', 'src/types')
  }
}
