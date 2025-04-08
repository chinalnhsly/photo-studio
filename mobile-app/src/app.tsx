import { Component } from 'react'
import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import './app.scss'

interface IProps {
  children?: React.ReactNode
}

class App extends Component<PropsWithChildren<IProps>> {
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
